'use strict';
const router = require('express').Router();
const mongoose = require('mongoose');
const Game = mongoose.model('Game');
module.exports = router;


// POST to create a new game
router.post('/', function (req, res, next) {
	Game.create(req.body)
	.then(game => res.status(201).json(game))
	.then(null, next);
});

// GET to find all active games
router.get('/active', function (req, res, next) {
	Game.find({ active: true }).populate('host').exec()
	.then(games => res.status(200).json(games))
	.then(null, next);
});

router.param('id', function setUser (req, res, next, id) {
	Game.findById(id).exec()
	.then(game => {
		req.game = game;
		next();
	}).then(null, next);
});

// GET to find one game
router.get('/:id', function (req, res) {
    res.status(200).json(req.game);
});
