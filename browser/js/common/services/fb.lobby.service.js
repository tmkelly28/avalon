'use strict';

app.service('FbLobbyService', function () {

	const fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/games");
	const startFbPromise = new Promise(function (resolve, reject) {
		if (!fb) reject (new Error ('Unable to connect to Firebase'));
		resolve(fb);
	});

	function errorHandler (error) {
		console.error(error);
	}

	this.getFbGamesRef = function () {
		return startFbPromise;
	}

	this.pushNewGame = function (game) {
		let _game = game;
		return startFbPromise
		.then(gamesRef => {
			return gamesRef.push().set(game);
		})
		.then(() => _game)
		.then(null, errorHandler);
	}

});