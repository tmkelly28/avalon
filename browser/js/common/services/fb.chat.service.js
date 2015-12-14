'use strict';

app.service('FbChatService', function ($firebaseArray) {

	function errorHandler (error) {
		console.error(error);
	}

	this.getFbChatRef = function (id) {
		let fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/chat/" + id);
		return new Promise(function (resolve, reject) {
			if (!fb) reject (new Error ('Unable to connect to Firebase'));
			resolve(fb);
		})
		.then(ref => $firebaseArray(ref))
		.then(null, errorHandler);
	}

	this.addChat = function (chatsArray, author, text) {
		chatsArray.$add({
			text: `${author}: ${text}`
		});
	}

});