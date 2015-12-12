'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('lobby', {
		url: '/lobby/:uid',
		templateUrl: 'js/lobby/lobby.html',
		resolve: {
			user: function ($stateParams, UserService) {
				return UserService.fetchById($stateParams.uid);
			}
		}
	});
});

app.controller('lobby', function ($scope, user) {

	$scope.user = user;

});
