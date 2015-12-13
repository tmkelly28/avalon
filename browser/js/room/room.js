'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('room', {
		url: '/room/:id',
		templateUrl: 'js/room/room.html',
		controller: 'RoomCtrl'
	});
});

app.controller('RoomCtrl', function () {});
