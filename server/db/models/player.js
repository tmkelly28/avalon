'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game',
		required: true,
		index: true
	},
	role: {
		type: String,
		enum: ['Loyal', 'Minion', 'Merlin', 'Percival', 'Mordred', 'Morgana', 'Assassin', 'Oberon']
	}
});

mongoose.model('Player', schema);
