'use strict';

app.service('FbGamesService', function ($firebaseArray) {

	const fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/games");

	this.fetchAllGames = function () {
		return $firebaseArray(fb);
	}

	this.pushNewGame = function (game) {
		fb.push().set(game);
		return game;
	}

});