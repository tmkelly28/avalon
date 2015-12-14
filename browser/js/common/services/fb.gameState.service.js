'use strict';

app.service('FbGameStateService', function ($firebaseObject) {

	function errorHandler (error) {
		console.error(error);
	}

	this.getFbGameStateRef = function (id) {
		let fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/game/" + id);
		return new Promise(function (resolve, reject) {
			if (!fb) reject (new Error ('Unable to connect to Firebase'));
			resolve($firebaseObject(fb));
		})
		.then(null, errorHandler);
	}

});