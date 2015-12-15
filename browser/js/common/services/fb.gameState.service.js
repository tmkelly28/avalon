'use strict';

app.service('FbGameStateService', function ($firebaseObject) {

	var fb;

	this.fetchById = function (id) {
		fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/game/" + id);
		return $firebaseObject(fb);
	}

});