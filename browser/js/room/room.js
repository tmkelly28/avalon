app.config(function ($stateProvider) {
	$stateProvider.state('room', {
		url: '/room',
		templateUrl: 'js/room/room.html'
	});
});

app.controller('rooom', function ($scope, $state) {});