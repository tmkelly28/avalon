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
			},
			games: function (GameService) {
				return GameService.fetchAllActive();
			}
		}
	});
});

app.controller('LobbyCtrl', function ($scope, user, $uibModal) {

	$scope.user = user;
	$scope.openModal = function () {
		$uibModal.open({
			templateUrl: 'js/lobby/lobby-modal.html',
			controller: 'LobbyModalCtrl'
		});
	}

	$scope.specialRules = function (game) {
		let rules = [];
		if (game.usePercival) rules.push('Percival');
		if (game.useMorgana) rules.push('Morgana');
		if (game.useOberon) rules.push('Oberon');
		if (game.useLady) rules.push('Lady of the Lake');
		return rules.join(' | ');
	}

});

app.controller('LobbyModalCtrl', function ($scope, GameService) {

	$scope.createNewGame = function () {}
	
});
