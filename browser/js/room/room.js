'use strict';

app.config(function ($stateProvider) {
	
	$stateProvider.state('room', {
		url: '/room/:id',
		templateUrl: 'js/room/room.html',
		controller: 'RoomCtrl',
		data: {
			authenticate: true
		},
		resolve: {
			game: function ($stateParams, GameService) {
				return GameService.fetchById($stateParams.id);
			}
		}
	});
});

app.controller('RoomCtrl', function ($scope, $firebaseArray, game, FbChatService, Session) {

	const author = Session.user.displayName;
	console.log(author)

	$scope.game = game;
	$scope.fbChat = FbChatService.getFbChatRef()
	.then(chatRef => {
		$scope.chats = $firebaseArray(chatRef)
	});

	$scope.addMessage = function () {
		$scope.chats.$add({
			text: `${author}: ${$scope.newMessage.text}`
		});
	}

});
