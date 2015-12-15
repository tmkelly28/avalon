'use strict';

app.service('FbGamesService', function ($firebaseArray, $firebaseObject, GameFactory) {

	/*  class Game

		host: String (mongoId),
		hostName: String,
		waitingToPlay: Boolean,
		name: String,
		targetSize: Number,
		players: playerFirebaseKeys[]
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
		currentPlayerTurn: firebaseKey,
		currentLadyOfTheLake: firebaseKey,
		currentGamePhase: String 
			enum:['team building', 'team voting', 'quest voting', 'using lady', 'choose merlin', 'end'],
		currentVoteTrack: Number,
		currentTurnIdx: Number,
		currentQuestIdx: Number,
		currentQuestPlayersNeeded: Number,
		currentQuestToFail: Number,
		currentQuestAccepts: Number,
		currentQuestRejects: Number,
		currentQuestSuccess: Number,
		currentQuestFail: Number		*/

	const fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/games");

	this.fetchAllGames = function () {
		return $firebaseArray(fb);
	}

	this.fetchById = function (key) {
		let path = new Firebase("https://resplendent-torch-2655.firebaseio.com/games/" + key);
		return $firebaseObject(path);
	}

	this.pushNewGame = function (game) {
		let ref = fb.push();
		ref.set(game);
		return ref.key();
	}

	this.addPlayerToGame = function (key, player) {
		let path = new Firebase("https://resplendent-torch-2655.firebaseio.com/games/" + key + "/players");
		let ref = path.push();
		ref.set(player);
		return ref.key();
	}

	this.startGame = function (game) {
		let path = new Firebase("https://resplendent-torch-2655.firebaseio.com/games/" + game.$id);
		let quests = GameFactory.assignQuests(game);
		let players = GameFactory.assignPlayerRoles(game);
		let turnOrder = _.shuffle(Object.keys(game.players));

		path.update({
			waitingToPlay: false,
			players: players,
			turnOrder: turnOrder,
			quests: quests,
			loyalScore: 0,
			evilScore: 0,
			currentPlayerTurn: turnOrder[0],
			currentLadyOfTheLake: turnOrder[turnOrder.length - 1],
			currentGamePhase: 'team building',
			currentVoteTrack: 0,
			currentTurnIdx: 0,
			currentQuestIdx: 0,
			currentQuestPlayersNeeded: quests[0].playersNeeded,
			currentQuestToFail: quests[0].toFail,
			currentQuestAccepts: 0,
			currentQuestRejects: 0,
			currentQuestSuccess: 0,
			currentQuestFail: 0
		});

		GameFactory.playAvalon(game);
	}

});