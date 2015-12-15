'use strict';

app.service('GameService', function ($http, FbGamesService, Session) {

	function toData (res) {
		return res.data;
	}

	function errorHandler (error) {
		console.error(error);
	}

	this.fetchById = function (id) {
		return $http.get('/api/games/' + id)
		.then(toData)
		.then(null, errorHandler);
	}

	this.fetchAllActive = function () {
		return $http.get('/api/games/active')
		.then(toData)
		.then(null, errorHandler);	
	}

	this.create = function (data) {
		return $http.post('/api/games/', data)
		.then(toData)
		.then(game => {
			// attach hostName for the lobby view, since not populated in the firebase ref
			game.hostName = Session.user.displayName
			return FbGamesService.pushNewGame(game)
		})
		.then(null, errorHandler);
	}
	
});
