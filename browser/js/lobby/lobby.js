app.config(function ($stateProvider) {
	$stateProvider.state('lobby', {
		url: '/lobby',
		templateUrl: 'js/lobby/lobby.html'
	});
});

app.controller('lobby', function ($scope, $state) {});