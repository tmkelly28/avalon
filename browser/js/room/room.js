'use strict';

app.config(function ($stateProvider) {
	
	$stateProvider.state('room', {
		url: '/room/:id',
		templateUrl: 'js/room/room.html',
		controller: 'RoomCtrl',
		resolve: {
			game: function ($stateParams, GameService) {
				return GameService.fetchById($stateParams.id);
			}
		}
	});
});

app.controller('RoomCtrl', function ($scope, game) {

	$scope.game = game;

});
