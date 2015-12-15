'use strict';

app.service('FbPlayerService', function ($firebaseArray) {

	var fb;

	this.fetchById = function (id) {
		fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/game-players/" + id);
		return $firebaseArray(fb);
	}

	this.addPlayer = function (fbArray, player) {
		fbArray.$add(player);
	}

});