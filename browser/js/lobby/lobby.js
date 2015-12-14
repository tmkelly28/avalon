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

app.controller('LobbyCtrl', function ($scope, user, $uibModal, GameService, UserService) {

	$scope.user = user;

	$scope.openModal = function () {
		$uibModal.open({
			templateUrl: 'js/lobby/lobby-modal.html',
			controller: 'LobbyModalCtrl',
			resolve: {
				user: function () {
					return UserService.fetchById($scope.user._id);
				}
			}
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

app.controller('LobbyModalCtrl', function ($scope, $state, $uibModalInstance, user, GameService) {

	$scope.user = user;
	
	$scope.createNewGame = function () {
		GameService.create({
			host: $scope.user._id,
			active: true,
			name: $scope.newGame.name,
			maxSize: $scope.newGame.numberOfPlayers,
			size: 1,
			usePercival: $scope.newGame.percival,
			useMorgana: $scope.newGame.morgana,
			useOberon: $scope.newGame.oberon,
			useLady: $scope.newGame.lady
		})
		.then(game => {
			$state.go('room', {id: game._id});
			$uibModalInstance.dismiss();
		});
	}

});
