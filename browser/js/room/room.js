'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('room', {
		url: '/room',
		templateUrl: 'js/room/room.html',
		controller: 'room'
	});
});

app.controller('rooom', function () {});
