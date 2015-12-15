'use strict';

app.config(function ($stateProvider) {
	
	$stateProvider.state('room', {
		url: '/room/:key',
		templateUrl: 'js/room/room.html',
		controller: 'RoomCtrl',
		data: {
			authenticate: true
		},
		resolve: {
			game: function ($stateParams, FbGamesService) {
				return FbGamesService.fetchById($stateParams.key);
			},
			chats: function ($stateParams, FbChatService) {
				return FbChatService.fetchById($stateParams.key);
			},
			players: function ($stateParams, FbPlayerService) {
				return FbPlayerService.fetchById($stateParams.key)
			},
			gameState: function ($stateParams, FbGameStateService) {
				return FbGameStateService.fetchById($stateParams.key);
			}
		}
	});
});

app.controller('RoomCtrl', 
	function ($scope, $firebaseArray, $stateParams, game, chats, gameState, players, Session, FbChatService) {

	const author = Session.user.displayName;

	$scope.game = game;
	$scope.chats = chats;
	$scope.players = players;
	gameState.$bindTo($scope, 'gameState');
	
	$scope.addMessage = function () {
		FbChatService.addChat($scope.chats, author, $scope.newMessage.text);
	}

});
