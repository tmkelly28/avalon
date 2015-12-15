'use strict';

app.service('FbGamesService', function ($firebaseArray, $firebaseObject) {

	const fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/games");

	function errorHandler (error) {
		console.error(error);
	}

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

});