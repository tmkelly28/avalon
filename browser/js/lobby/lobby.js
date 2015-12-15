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
			games: function (FbGamesService) {
				return FbGamesService.fetchAllGames();
			}
		}
	});
});

app.controller('LobbyCtrl', function ($scope, $uibModal, user, games, GameService, UserService, FbGamesService) {

	$scope.user = user;
	$scope.games = games;

	$scope.specialRules = function (game) {
		let rules = [];
		if (game.usePercival) rules.push('Percival');
		if (game.useMorgana) rules.push('Morgana');
		if (game.useOberon) rules.push('Oberon');
		if (game.useLady) rules.push('Lady of the Lake');
		return rules.join(' | ');
	}

	$scope.openModal = function () {
		$uibModal.open({
			templateUrl: 'js/lobby/lobby-modal.html',
			controller: 'NewGameModalCtrl',
			resolve: {
				user: function () {
					return UserService.fetchById($scope.user._id);
				},
				games: function () {
					return FbGamesService.fetchAllGames();
				}
			}
		});
	}

	$scope.confirm = function (gameId) {
		$uibModal.open({
			templateUrl: 'js/lobby/confirm-modal.html',
			controller: 'ConfirmModalCtrl',
			resolve: {
				game: function () {
					return GameService.fetchById(gameId)
				},
				user: function () {
					return UserService.fetchById($scope.user._id);
				},
				games: function () {
					return FbGamesService.fetchAllGames();
				}
			}
		});
	}

});

app.controller('NewGameModalCtrl', function ($scope, $state, $uibModalInstance, user, games, GameService) {

	$scope.user = user;
	$scope.games = games;
	
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

app.controller('ConfirmModalCtrl', function ($scope, $state, $uibModalInstance, game, user, games, FbPlayerService) {

	$scope.game = game;
	$scope.user = user;
	$scope.games = games;

	$scope.dismiss = function () {
		$uibModalInstance.dismiss();
	}

	$scope.joinGame = function () {
		let gameId = $scope.game._id
		FbPlayerService.addPlayer($scope.games, $scope.user, gameId);
		$state.go('room', { id: gameId });
		$uibModalInstance.dismiss();
	}

});
