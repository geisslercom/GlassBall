'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tournament Schema
 */
var TournamentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Tournament name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tournament', TournamentSchema);