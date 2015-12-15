'use strict';

app.service('FbChatService', function ($firebaseArray) {

	var fb;

	this.fetchById = function (id) {
		fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/chat/" + id);
		return $firebaseArray(fb);
	}

	this.addChat = function (fbArray, author, text) {
		fbArray.$add({
			text: `${author}: ${text}`
		});
	}

});