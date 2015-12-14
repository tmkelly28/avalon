'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('user', {
		url: '/user/:uid',
		templateUrl: 'js/user/user.html',
		controller: 'UserCtrl',
		data: {
			authenticate: true
		},
		resolve: {
			user: function ($stateParams, UserService) {
				return UserService.fetchById($stateParams.uid);
			},
			statistics: function ($stateParams, UserService) {
				return UserService.fetchStatistics($stateParams.uid)
			}
		}
	});
});

app.controller('UserCtrl', function ($scope, user, statistics) {

	$scope.user = user;
	$scope.statistics = statistics;
	
});
