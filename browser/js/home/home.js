'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function ($scope, $rootScope, $state, Session, AUTH_EVENTS, UserService, AuthService) {

	function proceedToLobby (user) {
		$state.go('lobby', {
			uid: user._id
		});
	}

	function setUser () {
        AuthService.getLoggedInUser()
        .then(user => {
        	if (user) {
				$scope.showDisplayNameEntry = true;
            	$scope.user = user;
				$scope.originalDisplayName = $scope.user.displayName;
				$scope.defaultDisplayName = $scope.user.displayName || 'Enter a display name';
        	}
        });
    };

	$scope.proceed = function () {
		if ($scope.user.displayName !== $scope.originalDisplayName) {
			UserService.update($scope.user._id, $scope.user)
			.then(user => proceedToLobby(user));
		} else proceedToLobby($scope.user);
	};

	setUser();

});
