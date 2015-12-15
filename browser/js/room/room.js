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
			}
		}
	});
});

app.controller('RoomCtrl', 
	function ($scope, $firebaseArray, $stateParams, game, chats, Session, FbChatService, FbGamesService) {

	const author = Session.user.displayName;

	$scope.game = game;
	$scope.chats = chats;

	$scope.addMessage = function () {
		FbChatService.addChat($scope.chats, author, $scope.newMessage.text);
	}

	$scope.isHost = function () {
		return Session.user._id === $scope.game.host;
	}

	$scope.ableToBegin = function () {
		let numberOfPlayers = Object.keys($scope.game.players).length;
		return numberOfPlayers >= $scope.game.targetSize;
	}

	$scope.startGame = function () {
		FbGamesService.startGame($scope.game);
	}

	$scope.voteApprove = function () {};
	$scope.voteReject = function () {};
	$scope.successQuest = function () {};
	$scope.failQuest = function () {};

	$scope.test = function (data) {
		console.log(data)
	}

});
