'use strict';

app.service('FbPlayerService', function ($firebaseArray) {

	function errorHandler (error) {
		console.error(error);
	}

	this.getPlayers = function (id) {
		let fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/game-players/" + id);
		return new Promise(function (resolve, reject) {
			if (!fb) reject (new Error ('Unable to connect to Firebase'));
			resolve(fb);
		})
		.then(ref => $firebaseArray(ref))
		.then(null, errorHandler);
	}

	this.addPlayer = function (players, player) {
		return new Promise(function (resolve) {
			resolve(players.$add(player));
		})
		.then(null, errorHandler);
	}

});