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
			},
			chats: function ($stateParams, FbChatService) {
				return FbChatService.getFbChatRef($stateParams.id);
			},
			players: function ($stateParams, FbPlayerService) {
				return FbPlayerService.getPlayers($stateParams.id)
			},
			gameState: function ($stateParams, FbGameStateService) {
				return FbGameStateService.getFbGameStateRef($stateParams.id);
			}
		}
	});
});

app.controller('RoomCtrl', 
	function ($scope, $firebaseArray, game, chats, gameState, players, Session, FbChatService) {

	const author = Session.user.displayName;

	$scope.game = game;
	$scope.chats = chats;
	$scope.players = players;
	gameState.$bindTo($scope, 'gameState');
	
	$scope.addMessage = function () {
		FbChatService.addChat($scope.chats, author, $scope.newMessage.text);
	}

});
