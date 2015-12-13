'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game',
		required: true,
		index: true
	},
	size: {
		type: Number
	},
	failsRequired: {
		type: Number,
		required: true
	},
	active: {
		type: Boolean,
		default: true
	},
	passed: {
		type: Boolean
	}
});

mongoose.model('Quest', schema);
