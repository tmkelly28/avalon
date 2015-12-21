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

	const author = Session.user.displayName;

	$scope.game = game;
	$scope.chats = chats;
	$scope.user = user;
	$scope.userRecord = userRecord;
	$scope.players = players;
	$scope.myTurn = false;
	$scope.needToVoteForTeam = true;
	$scope.needToVoteOnQuest = true;
	$scope.investigatedPlayer = null;

	FbGamesService.registerListeners($scope.game, $scope.userRecord, $scope);

	$scope.addMessage = () => {
		if (!$scope.newMessage.text) return;
		FbChatService.addChat($scope.chats, author, $scope.newMessage.text);
		$scope.newMessage.text = "";
	};
	$scope.isHost = () => Session.user._id === $scope.game.host;
	$scope.ableToBegin = () => {
		let numberOfPlayers = Object.keys($scope.game.players).length;
		return numberOfPlayers >= $scope.game.targetSize && numberOfPlayers < 11;
	};
	$scope.startGame = () => FbGamesService.startGame($scope.game);
	$scope.me = (player) => player._id === $scope.user._id;
	$scope.voteApprove = () => {
		$scope.needToVoteForTeam = false;
		FbGamesService.approveTeam($scope.game.$id, $scope.userRecord.playerKey);
	};
	$scope.voteReject = () => {
		$scope.needToVoteForTeam = false;
		FbGamesService.rejectTeam($scope.game.$id, $scope.userRecord.playerKey);
	};
	$scope.successQuest = () => {
		$scope.needToVoteOnQuest = false;
		FbGamesService.voteToSucceed($scope.game.$id);
	};
	$scope.failQuest = () => {
		$scope.needToVoteOnQuest = false;
		FbGamesService.voteToFail($scope.game.$id);
	};
	$scope.addToTeam = (player) => FbGamesService.addToTeam($scope.game.$id, player);
	$scope.proposeTeam = () => FbGamesService.proposeTeam($scope.game.$id);
	$scope.resetTeam = () => FbGamesService.resetTeam($scope.game.$id);
	$scope.guessMerlin = (player) => FbGamesService.guessMerlin($scope.game.$id, player);
	$scope.disablePropose = () => {
		if (!$scope.game.currentQuestPlayersGoing) return true;
		else return $scope.game.currentQuestPlayersNeeded !== Object.keys($scope.game.currentQuestPlayersGoing).length;
	};
	$scope.range = (n, m) => _.range(n, m);
	$scope.useLady = (player) => {
		// this won't persist after refresh
		$scope.investigatedPlayer = {
			loyalty: player.loyalty,
			displayName: player.displayName
		}
		FbGamesService.useLady($scope.game.$id, player);
	};
});
