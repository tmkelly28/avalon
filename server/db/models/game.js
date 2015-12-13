'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	host: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	active: {
		type: Boolean,
		index: true
	},
	maxSize: {
		type: Number
	},
	size: {
		type: Number
	},
	usePercival: {
		type: Boolean
	},
	useMorgana: {
		type: Boolean
	},
	useOberon: {
		type: Boolean
	},
	useLady: {
		type: Boolean
	}
});

mongoose.model('Game', schema);
