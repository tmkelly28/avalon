app.factory('GameFactory', function () {
	const factory = {};

	factory.assignQuests = function (game) {

		function Quest (playersNeeded, toFail) {
			this.playersNeeded = playersNeeded;
			this.toFail = toFail;
		}

		let quests = [];
		let numberOfPlayers = Object.keys(game.players).length;

		// first quest
		if (numberOfPlayers < 8) quests.push(new Quest(2, 1));
		else quests.push(new Quest(3, 1));
		// second quest
		if (numberOfPlayers < 8) quests.push(new Quest(3, 1));
		else quests.push(new Quest(4, 1));
		// third quest
		if (numberOfPlayers === 5) quests.push(new Quest(2, 1));
		else if (numberOfPlayers === 6) quests.push(new Quest(4, 1));
		else if (numberOfPlayers === 7) quests.push(new Quest(3, 1));
		else quests.push(new Quest(4, 1));
		// fourth quest
		if (numberOfPlayers < 7) quests.push(new Quest(3, 1));
		else if (numberOfPlayers === 7) quests.push(new Quest(4, 2));
		else quests.push(new Quest(5, 2));
		// fifth quest
		if (numberOfPlayers === 5) quests.push(new Quest(3, 1));
		else if (numberOfPlayers < 8) quests.push(new Quest(4, 1));
		else quests.push(new Quest(5, 1));

		return quests;
	};

	factory.assignPlayerRoles = function (game) {

		function Character (loyalty, character, imageUrl) {
			this.loyalty = loyalty;
			this.character = character;
			this.imageUrl = imageUrl
		}

		let characters = [];
		let good = 0;
		let bad = 0;
		let idx = 0;
		let numberOfPlayers = Object.keys(game.players).length;

		// determine the number of good and bad characters
		if (numberOfPlayers === 5) {
			good += 3;
			bad += 2;
		} else if (numberOfPlayers === 6) {
			good += 4;
			bad += 2;
		} else if (numberOfPlayers === 7) {
			good += 4;
			bad += 3
		} else if (numberOfPlayers === 8) {
			good += 5;
			bad += 3;
		} else if (numberOfPlayers === 9) {
			good += 6;
			bad += 3
		} else {
			good += 6;
			bad += 4;
		}
		// add special characters
		if (game.usePercival) {
			characters.push(new Character('good', 'Percival', '/icons/percival.png'));
			good--;
		}
		if (game.useMordred && bad > 1) {
			characters.push(new Character('evil', 'Mordred', '/icons/mordred.png'));
			bad--;
		}
		if (game.useMorgana && bad > 1) {
			characters.push(new Character('evil', 'Morgana', '/icons/morgana.png'));
			bad--;
		}
		if (game.useOberon && bad > 1) {
			characters.push(new Character('evil', 'Oberon', '/icons/oberon.png'));
		}
		// add remaining characters, including assassin and merlin
		characters.push(new Character('evil', 'Assassin', '/icons/assassin.png'));
		bad--;
		characters.push(new Character('good', 'Merlin', '/icons/merlin.png'));
		good--;
		while (good > 0) {
			characters.push(new Character('good', 'Servant of Arthur', '/icons/loyal_' + good + '.png'));
			good--;
		}
		while (bad > 0) {
			characters.push(new Character('evil', 'Minion of Mordred', '/icons/minion_' + bad + '.png'));
			bad--;
		}
		// shuffle characters
		characters = _.shuffle(characters);

		for (let player in game.players) {
			let ref = new Firebase("https://resplendent-torch-2655.firebaseio.com/games/" + game.$id + '/players/' + player);
			ref.update({
				loyalty: characters[idx].loyalty,
				character: characters[idx].character,
				imageUrl: characters[idx].imageUrl
			});
			idx++;
		}
		return game.players;
	};
	
	factory.playAvalon = function (game) {
		console.log(game);
		return;
		let firstTurn = true;
		while (game.currentGamePhase !== 'end') {

			// 1. Set the current player's turn, and phase to team building
			if (!firstTurn) factory.beginNewTurn(game);
			firstTurn = false;
			// 2. Wait until currentQuestTeam is set appropriately
			while (factory.waitingForTeamBuilding(game)) continue;
			// 3. Check if the proposed team passes or not
			if (factory.questIsAccepted(game)) factory.goOnQuest(game);
			else continue;
		}
	};

	return factory;
});