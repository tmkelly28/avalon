'use strict';

app.config(function ($stateProvider) {
	
	$stateProvider.state('room', {
		url: '/room/:key',
		templateUrl: 'js/room/room.html',
		controller: 'RoomCtrl',
		data: {
			authenticate: true
		},
		resolve: {
			game: ($stateParams, FbGamesService) => FbGamesService.fetchById($stateParams.key),
			chats: ($stateParams, FbChatService) => FbChatService.fetchById($stateParams.key),
			user: (UserService, Session, FbGamesService, $stateParams) => {
				return UserService.fetchById(Session.user._id)
				.then(user => FbGamesService.fetchPlayer($stateParams.key, user.playerKey));
			},
			userRecord: (UserService, Session) => {
				return UserService.fetchById(Session.user._id);
			},
			players: ($stateParams, FbGamesService) => FbGamesService.fetchPlayers($stateParams.key)
		}
	});
});

app.controller('RoomCtrl', 
	function ($scope, game, chats, user, players, userRecord, Session, FbChatService, FbGamesService) {


	$scope.game = game;
	$scope.chats = chats;
	$scope.user = user;
	$scope.userRecord = userRecord;
	$scope.players = players;
	$scope.currentGamePhase = game.currentGamePhase;
	$scope.myTurn = false;
	$scope.myVote;
	$scope.onQuest = false;
	$scope.roomLeftOnTeam = true;

	const author = Session.user.displayName;
	const fb = "https://resplendent-torch-2655.firebaseio.com/games/";

	const currentPlayerRef = new Firebase(fb + $scope.game.$id + '/players/' + $scope.userRecord.playerKey);

	const currentPlayerTurnRef = new Firebase(fb + $scope.game.$id + '/currentPlayerTurn');
	currentPlayerTurnRef.on('value', (snap) => {
		if (snap.val() && (snap.val()._id === Session.user._id)) $scope.myTurn = true;
		else $scope.myTurn = false;
	});

	const currentGamePhaseRef = new Firebase(fb + $scope.game.$id + '/currentGamePhase');
	currentGamePhaseRef.on('value', (snap) => {
		$scope.currentGamePhase = snap.val();
	});

	const currentQuestPlayersGoingRef = new Firebase(fb + $scope.game.$id + '/currentQuestPlayersGoing');
	const playerIsOnQuestRef = new Firebase(fb + $scope.game.$id + '/players/' + $scope.userRecord.playerKey + '/onQuest');
	currentQuestPlayersGoingRef.on('value', (snap) => {
		let team = snap.val();
		if (team) {
			let teamKeys = Object.keys(team);
			let teamLength = teamKeys.length;

			teamKeys.forEach(key => {
				let ref = new Firebase(fb + $scope.game.$id + '/currentQuestPlayersGoing/' + key);
				ref.once('value', (snap) => {
					let teamMember = snap.val();
					if (teamMember._id === Session.user._id) playerIsOnQuestRef.set(true)
				});
			});

			if (teamLength < $scope.game.currentQuestPlayersNeeded) $scope.roomLeftOnTeam = true;
			else if (teamLength >= $scope.game.currentQuestPlayersNeeded) $scope.roomLeftOnTeam = false;

		} else $scope.roomLeftOnTeam = true;
	});
	currentQuestPlayersGoingRef.on('child_removed', (snap) => {
		let team = snap.val();
		let teamKeys = Object.keys(team);
		teamKeys.forEach(key => {
				let ref = new Firebase(fb + $scope.game.$id + '/currentQuestPlayersGoing/' + key);
				ref.once('value', (snap) => {
					let teamMember = snap.val();
					playerIsOnQuestRef.set(false)
				});
			});
	});

	function tallyVoting (approves, rejects) {
		if (!$scope.game.players) return; // prevent error on refresh
		let numberOfPlayers = Object.keys($scope.game.players).length;
		if ((approves + rejects) === numberOfPlayers) {
			if (approves > rejects) FbGamesService.goToQuestVoting($scope.game.$id);
			else FbGamesService.goToNextTurn($scope.game.$id);
		}
	}

	const currentQuestApprovesRef = new Firebase(fb + $scope.game.$id + '/currentQuestApproves');
	currentQuestApprovesRef.on('value', (snap) => {
		let approves = snap.val();
		let rejects = $scope.game.currentQuestRejects;
		tallyVoting(approves, rejects);
	});

	const currentQuestRejectsRef = new Firebase(fb + $scope.game.$id + '/currentQuestRejects');
	currentQuestRejectsRef.on('value', (snap) => {
		let rejects = snap.val();
		let approves = $scope.game.currentQuestApproves;
		tallyVoting(approves, rejects);
	});

	$scope.addMessage = () => FbChatService.addChat($scope.chats, author, $scope.newMessage.text);
	$scope.isHost = () => Session.user._id === $scope.game.host;
	$scope.ableToBegin = () => Object.keys($scope.game.players).length >= $scope.game.targetSize;
	$scope.startGame = () => FbGamesService.startGame($scope.game);
	$scope.me = (player) => player._id === $scope.user._id;
	$scope.voteApprove = () => FbGamesService.approveTeam($scope.game.$id, $scope.userRecord.playerKey);
	$scope.voteReject = () => FbGamesService.rejectTeam($scope.game.$id, $scope.userRecord.playerKey);
	$scope.successQuest = () => FbGamesService.voteToSucceed($scope.game.$id);
	$scope.failQuest = () => FbGamesService.voteToFail($scope.game.$id);
	$scope.addToTeam = (player) => FbGamesService.addToTeam($scope.game.$id, player);
	$scope.proposeTeam = () => FbGamesService.proposeTeam($scope.game.$id);
	$scope.resetTeam = () => FbGamesService.resetTeam($scope.game.$id);
});
