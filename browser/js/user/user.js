'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('user', {
		url: '/user',
		templateUrl: 'js/user/user.html'
	});
});

app.controller('user', function () {});
