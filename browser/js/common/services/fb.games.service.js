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
		let fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/games/" + key);
		return $firebaseObject(fb);
	}

	this.pushNewGame = function (game) {
		return new Promise(function (resolve, reject) {
			let ref = fb.push();
			ref.set(game);
			resolve(ref.key());	
		})
		.then(key => key)
		.then(null, errorHandler);
	}

});