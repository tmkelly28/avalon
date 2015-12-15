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

app.controller('LobbyCtrl', function ($scope, $uibModal, user, games, FbGamesService, UserService, FbPlayerService) {

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

	$scope.openNewGameModal = function () {
		$uibModal.open({
			templateUrl: 'js/lobby/new-game-modal.html',
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

	$scope.openJoinGameModal = function (game) {
		$uibModal.open({
			templateUrl: 'js/lobby/join-game-modal.html',
			controller: 'JoinGameModalCtrl',
			resolve: {
				game: function () {
					return FbGamesService.fetchById(game.$id);
				},
				user: function () {
					return UserService.fetchById($scope.user._id);
				},
				players: function () {
					return FbPlayerService.fetchById(game.$id)
				}
			}
		});
	}

});

app.controller('NewGameModalCtrl', function ($scope, $state, $uibModalInstance, user, games, FbGamesService) {

	$scope.user = user;
	$scope.games = games;
	
	$scope.createNewGame = function () {
		FbGamesService.pushNewGame({
			host: $scope.user._id,
			hostName: $scope.user.displayName,
			active: true,
			name: $scope.newGame.name,
			maxSize: $scope.newGame.numberOfPlayers,
			size: 1,
			usePercival: $scope.newGame.percival || false,
			useMorgana: $scope.newGame.morgana || false,
			useOberon: $scope.newGame.oberon || false,
			useLady: $scope.newGame.lady || false
		})
		.then(key => {
			$state.go('room', { key: key });
			$uibModalInstance.dismiss();
		});
	}

});

app.controller('JoinGameModalCtrl', function ($scope, $state, $uibModalInstance, game, user, players, FbPlayerService) {

	$scope.game = game;
	$scope.user = user;
	$scope.players = players;

	$scope.dismiss = function () {
		$uibModalInstance.dismiss();
	}

	$scope.joinGame = function () {
		FbPlayerService.addPlayer($scope.players, $scope.user);
		$state.go('room', { key: $scope.game.$id });
		$uibModalInstance.dismiss();
	}

});
