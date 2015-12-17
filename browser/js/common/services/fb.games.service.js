'use strict';

app.service('FbGamesService', function ($firebaseArray, $firebaseObject, GameFactory, UserService) {

	/*  class Game

		host: String (mongoId),
		hostName: String,
		waitingToPlay: Boolean,
		name: String,
		targetSize: Number,
		players: player{}[]
			loyalty: String ['good', 'evil'],
			character: String enum:['Servant of Arthur', 'Minion of Mordred', etc]
		usePercival: Boolean,
		useMorgana: Boolean,
		useOberon: Boolean,
		useMordred: Boolean,
		useLady: Boolean,
		turnOrder: playerFirebaseKeys[],
		quests: Quests[],
			playersNeeded: Number,
			toFail: Number
		loyalScore: Number,
		evilScore: Number,
		currentPlayerTurn: player{},
		currentLadyOfTheLake: player{},
		currentGamePhase: String 
			enum:['team building', 'team voting', 'quest voting', 'using lady', 'choose merlin', 'end'],
		currentVoteTrack: Number,
		currentTurnIdx: Number,
		currentQuestIdx: Number,
		currentQuestPlayersNeeded: Number,
		currentQuestPlayersGoing: player{}[]
		currentQuestToFail: Number,
		currentQuestApproves: Number,
		currentQuestRejects: Number,
		currentQuestSuccess: Number,
		currentQuestFail: Number,
		merlinGuess: player{}					*/

	const fb = 'https://resplendent-torch-2655.firebaseio.com/games/';
	const gamesRef = new Firebase("https://resplendent-torch-2655.firebaseio.com/games");
	const service = this;

	service.fetchAllGames = function () {
		return $firebaseArray(gamesRef);
	};

	service.fetchById = function (key) {
		let gameRef = new Firebase(fb + key);
		return $firebaseObject(gameRef);
	};

	service.pushNewGame = function (game) {
		let ref = gamesRef.push();
		ref.set(game);
		return ref.key();
	};

	service.addPlayerToGame = function (gameKey, player) {
		let playersRef = new Firebase(fb + gameKey + "/players");
		return new Promise(resolve => {
			let ref = playersRef.push();
			ref.set(player);
			resolve(ref.key());
		})
		.then(playerKey => UserService.update(player._id, { playerKey: playerKey }))
		.then(null, err => console.error(err));
	};

	service.fetchPlayer = function (gameKey, playerKey) {
		let playerRef = new Firebase(fb + gameKey + "/players/" + playerKey);
		return $firebaseObject(playerRef);
	};

	service.fetchPlayers = function (gameKey) {
		let playersRef = new Firebase(fb + gameKey + "/players");
		return $firebaseObject(playersRef);
	};

	service.startGame = function (game) {
		let gameRef = new Firebase(fb + game.$id);
		let quests = GameFactory.assignQuests(game);
		GameFactory.assignPlayerRoles(game);
		let turnOrder = _.shuffle(game.players);

		gameRef.update({
			waitingToPlay: false,
			turnOrder: turnOrder,
			quests: quests,
			loyalScore: 0,
			evilScore: 0,
			currentPlayerTurn: turnOrder[0],
			currentLadyOfTheLake: turnOrder[turnOrder.length - 1],
			currentGamePhase: 'team building',
			currentTurnIdx: 0,
			currentVoteTrack: 0,
			currentQuestIdx: 0,
			currentQuestPlayersNeeded: quests[0].playersNeeded,
			currentQuestPlayersGoing: null,
			currentQuestToFail: quests[0].toFail,
			currentQuestApproves: 0,
			currentQuestRejects: 0,
			currentQuestSuccess: 0,
			currentQuestFail: 0
		});

		console.log(game)
	};

	service.approveTeam = function (id, playerKey) {
		let approveRef = new Firebase(fb + id + '/currentQuestApproves');
		let playerRef = new Firebase(fb + '/players/' + playerKey + '/approvedQuest');
		approveRef.transaction(currentVal => (currentVal + 1));
		playerRef.set(true);
	};

	service.rejectTeam = function (id, playerKey) {
		let rejectRef = new Firebase(fb + id + '/currentQuestRejects');
		let playerRef = new Firebase(fb + '/players/' + playerKey + '/approvedQuest');
		rejectRef.transaction(currentVal => (currentVal + 1));
		playerRef.set(false);
	};

	service.voteToSucceed = function (id) {
		let ref = new Firebase(fb + id + '/currentQuestSuccess');
		ref.transaction(currentVal => (currentVal + 1));
	};

	service.voteToFail = function (id) {
		let ref = new Firebase(fb + id + '/currentQuestFail');
		ref.transaction(currentVal => (currentVal + 1));
	};

	service.addToTeam = function (id, player) {
		let teamRef = new Firebase(fb + id + '/currentQuestPlayersGoing');
		let playerQuestKeyRef = new Firebase(fb + id + '/players/' + player.playerKey + '/questKey');
		let newTeamMemberRef = teamRef.push();
		newTeamMemberRef.set(player);
	};

	service.proposeTeam = function (id) {
		let ref = new Firebase(fb + id + '/currentGamePhase');
		ref.set('team voting');
	};

	service.resetTeam = function (id, questMembers) {
		let ref = new Firebase(fb + id + '/currentQuestPlayersGoing');
		ref.set(null);
	};

	service.goToQuestVoting = function (id) {
		let ref = new Firebase(fb + id + '/currentGamePhase');
		ref.set('quest voting');

	}

});