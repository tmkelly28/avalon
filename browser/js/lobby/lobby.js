'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('lobby', {
		url: '/lobby/:uid',
		templateUrl: 'js/lobby/lobby.html',
		controller: 'LobbyCtrl',
		data: {
			authenticate: true
		},
		resolve: {
			user: function ($stateParams, UserService) {
				return UserService.fetchById($stateParams.uid);
			}
		}
	});
});

app.controller('LobbyCtrl', function ($scope, user) {

	$scope.user = user;

});
