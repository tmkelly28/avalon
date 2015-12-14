'use strict';

app.service('FbGamesService', function ($firebaseArray) {


	function errorHandler (error) {
		console.error(error);
	}

	this.fetchAllGames = function () {
		let fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/games");
		return new Promise(function (resolve, reject) {
			if (!fb) reject (new Error ('Unable to connect to Firebase'));
			resolve($firebaseArray(fb));
		});
	}

	this.pushNewGame = function (game) {
		let games = new Firebase("https://resplendent-torch-2655.firebaseio.com/games");
		games.push().set(game);
		return game;
	}

});