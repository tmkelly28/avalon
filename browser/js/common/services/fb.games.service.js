'use strict';

app.service('FbGamesService', function ($firebaseArray, $firebaseObject, GameFactory, UserService, Session) {

	/*  class Game

		host: String (mongoId),
		hostName: String,
		waitingToPlay: Boolean,
		name: String,
		targetSize: Number,
		players: player{}[]
			loyalty: String ['good', 'evil'],
			character: String enum:['Servant of Arthur', 'Minion of Mordred', etc]
			onQuest: boolean
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
			enum:
			['team building', 'team voting', 'quest voting', 
			'using lady', 'guess merlin', 'end - evil wins',
			'end - evil guessed merlin', 'end - good wins'],
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
		merlinGuess: player{}					
	*/

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
			roomLeftOnTeam: true,
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
	};

	service.approveTeam = function (id, playerKey) {
		let approveRef = new Firebase(fb + id + '/currentQuestApproves');
		let playerRef = new Firebase(fb + id + '/players/' + playerKey + '/approvedQuest');
		approveRef.transaction(currentVal => (currentVal + 1));
		playerRef.set(true);
	};

	service.rejectTeam = function (id, playerKey) {
		let rejectRef = new Firebase(fb + id + '/currentQuestRejects');
		let playerRef = new Firebase(fb + id + '/players/' + playerKey + '/approvedQuest');
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
		let newTeamMemberRef = teamRef.push();
		newTeamMemberRef.set(player);
	};

	service.proposeTeam = function (id) {
		let ref = new Firebase(fb + id + '/currentGamePhase');
		ref.set('team voting');
	};

	service.resetTeam = function (id) {
		let ref = new Firebase(fb + id + '/currentQuestPlayersGoing');
		ref.set(null);
	};

	service.goToQuestVoting = function (id) {
		let ref = new Firebase(fb + id + '/currentGamePhase');
		ref.set('quest voting');
	};

	service.goToQuestResult = function (id, result) {
		let phaseRef = new Firebase(fb + id + '/currentGamePhase');
		let loyalScoreRef = new Firebase(fb + id + '/loyalScore');
		let evilScoreRef = new Firebase(fb + id + '/evilScore');
		phaseRef.set('quest result');
		if (result === 'evil') {
			evilScoreRef.transaction(currentVal => (currentVal + 1));
			evilScoreRef.once('value', snap => {
				if (snap.val() === 3) {
					service.endGame(id, 'evil');
				} else {
					service.goToNextQuest(id);
					service.goToNextTurn(id);					
				}
			});
		} else {
			loyalScoreRef.transaction(currentVal => (currentVal + 1));
			loyalScoreRef.once('value', snap => {
				if (snap.val() === 3) {
					service.endGame(id, 'good');
				} else {
					service.goToNextQuest(id);
					service.goToNextTurn(id);
				}
			});
		}
	};

	service.goToNextQuest = function (id) {
		let gameRef = new Firebase(fb + id);
		gameRef.once('value', snap => {
			let game = snap.val();
			let newIdx = game.currentQuestIdx + 1;
			if (game.currentQuestIdx <= 5) {
				gameRef.update({
					currentVoteTrack: 0,
					currentQuestIdx: newIdx,
					currentQuestPlayersNeeded: game.quests[newIdx].playersNeeded,
					currentQuestPlayersGoing: null,
					currentQuestToFail: game.quests[newIdx].toFail,
					currentQuestApproves: 0,
					currentQuestRejects: 0,
					currentQuestSuccess: 0,
					currentQuestFail: 0
				});
			} else game.update({ currentQuestIdx: newIdx });
		});
	};

	service.goToNextTurn = function (id, rejectedQuest) {
		let gameRef = new Firebase(fb + id);
		let currentVoteTrackRef = new Firebase(fb + id + '/currentVoteTrack');
		if (rejectedQuest) currentVoteTrackRef.transaction(currentVal => (currentVal + 1));
		gameRef.once('value', snap => {
			let game = snap.val();
			let newIdx = game.currentTurnIdx + 1;
			let numberOfPlayers = Object.keys(game.players).length;
			if (newIdx > numberOfPlayers) newIdx = 0;
			gameRef.update({
				currentGamePhase: 'team building',
				currentTurnIdx: newIdx,
				currentQuestPlayersGoing: null,
				currentQuestApproves: 0,
				currentQuestRejects: 0,
				currentPlayerTurn: game.turnOrder[newIdx]
			});
		});
	};

	service.endGame = function (id, result) {
		let gameRef = new Firebase(fb + id);
		if (result === 'evil') gameRef.update({ currentGamePhase: 'end - evil wins' });
		else if (result === 'merlinGuessed') gameRef.update({ currentGamePhase: 'end - evil guessed merlin' });
		else if (result === 'merlinNotGuessed') gameRef.update({ currentGamePhase: 'end - good wins' });
		else gameRef.update({ currentGamePhase: 'guess merlin' });
	};

	service.guessMerlin = function (id, player) {
		let identityRef = new Firebase(fb + id + '/players/' + player.playerKey + '/character');
		identityRef.once('value', snap => {
			if (snap.val() === 'merlin') service.endGame(id, 'merlinGuessed');
			else service.endGame(id, 'merlinNotGuessed');
		})
	}

	service.registerListeners = function (game, userRecord, scope) {
		const gameId = game.$id;
		const gameRef = new Firebase(fb + gameId);
		const currentPlayerTurnRef = new Firebase(fb + gameId + '/currentPlayerTurn');
		const currentQuestPlayersGoingRef = new Firebase(fb + gameId + '/currentQuestPlayersGoing');
		const playerIsOnQuestRef = new Firebase(fb + gameId + '/players/' + userRecord.playerKey + '/onQuest');
		const currentQuestApprovesRef = new Firebase(fb + gameId + '/currentQuestApproves');
		const currentQuestRejectsRef = new Firebase(fb + gameId + '/currentQuestRejects');
		const currentQuestSuccessRef = new Firebase(fb + gameId + '/currentQuestSuccess');
		const currentQuestFailRef = new Firebase(fb + gameId + '/currentQuestFail');
		const currentVoteTrackRef = new Firebase(fb + gameId + '/currentVoteTrack');

		function tallyVoting (approves, rejects) {
			if (!game.players) return; // prevent error on refresh
			let numberOfPlayers = Object.keys(game.players).length;
			if ((approves + rejects) === numberOfPlayers) {
				if (approves > rejects) service.goToQuestVoting(gameId);
				else service.goToNextTurn(gameId, 'rejectedQuest');
			}
		}
		function tallyGrails (successes, fails) {
			if (!game.currentQuestPlayersGoing) return; // prevent error on refresh
			let questSize = Object.keys(game.currentQuestPlayersGoing).length;
			if ((successes + fails) === questSize) {
				if (fails >= game.currentQuestToFail) service.goToQuestResult(gameId, 'evil');
				else service.goToQuestResult(gameId, 'good');
			}
		}

		// update player turn
		currentPlayerTurnRef.on('value', snap => {
			if (snap.val() && (snap.val()._id === Session.user._id)) scope.myTurn = true;
			else scope.myTurn = false;
		});

		// update players going on the team
		currentQuestPlayersGoingRef.on('value', (snap) => {
			let team = snap.val();
			if (team) {
				let teamKeys = Object.keys(team);
				let teamLength = teamKeys.length;

				teamKeys.forEach(key => {
					let ref = new Firebase(fb + gameId + '/currentQuestPlayersGoing/' + key);
					ref.once('value', snapshot => {
						let teamMember = snapshot.val();
						if (teamMember._id === Session.user._id) playerIsOnQuestRef.set(true)
					});
				});

				if (teamLength < game.currentQuestPlayersNeeded) gameRef.update({ roomLeftOnTeam: true });
				else if (teamLength >= game.currentQuestPlayersNeeded) gameRef.update({ roomLeftOnTeam: false });

			} else gameRef.update({ roomLeftOnTeam: true });
		});
		currentQuestPlayersGoingRef.on('child_removed', (snap) => {
			let team = snap.val();
			let teamKeys = Object.keys(team);
			teamKeys.forEach(key => {
					let ref = new Firebase(fb + gameId + '/currentQuestPlayersGoing/' + key);
					ref.once('value', () => {
						playerIsOnQuestRef.set(false)
					});
				});
		});

		// track approvals and rejections for teams
		currentQuestApprovesRef.on('value', snap => {
			let approves = snap.val();
			let rejects = game.currentQuestRejects;
			tallyVoting(approves, rejects);
		});
		currentQuestRejectsRef.on('value', snap => {
			let rejects = snap.val();
			let approves = game.currentQuestApproves;
			tallyVoting(approves, rejects);
		});

		// track success and fail votes for quests
		currentQuestSuccessRef.on('value', snap => {
			let successes = snap.val();
			let fails = game.currentQuestFail;
			tallyGrails(successes, fails);
		});
		currentQuestFailRef.on('value', snap => {
			let fails = snap.val();
			let successes = game.currentQuestSuccess;
			tallyGrails(successes, fails);
		});

		// track end game conditions
		currentVoteTrackRef.on('value', snap => {
			if (snap.val() === 5) service.endGame(gameId, 'evil');
		});
	};

});