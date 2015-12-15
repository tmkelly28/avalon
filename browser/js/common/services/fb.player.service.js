'use strict';

app.service('FbPlayerService', function ($firebaseArray) {

	var fb;

	this.getPlayers = function (id) {
		fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/game-players/" + id);
		return $firebaseArray(fb);
	}

	this.addPlayer = function (games, player, id) {
		games.$add(player);
	}

});