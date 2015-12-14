'use strict';

app.service('FbChatService', function () {

	this.getFbChatRef = function (id) {
		let fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/chat/" + id);
		return new Promise(function (resolve, reject) {
			if (!fb) reject (new Error ('Unable to connect to Firebase'));
			resolve(fb);
		});
	}

});