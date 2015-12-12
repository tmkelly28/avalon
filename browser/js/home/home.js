'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('home', function ($scope, $rootScope, $state, AUTH_EVENTS, Session, UserService) {

	function proceedToLobby (user) {
		$state.go('lobby', {
			uid: user._id
		});
	}

	$rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
		$scope.showDisplayNameEntry = true;
		$scope.user = Session.user;
		$scope.originalDisplayName = $scope.user.displayName;
		$scope.defaultDisplayName = $scope.user.displayName || "Enter a display name"
	});

	$scope.proceed = function () {
		if ($scope.user.displayName !== $scope.originalDisplayName) {
			UserService.update($scope.user._id, $scope.user)
			.then(user => proceedToLobby(user));
		} else proceedToLobby($scope.user);
	};

});
