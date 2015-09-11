'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Game Schema
 */
var GameSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Game name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	player1: {
		type: Object
	},
	player2: {
		type: Object
	},
	pointP1: {
		type: Number,
		default: 0
	},
	pointP2: {
		type: Number,
		default: 0
	},
	throwsP1: {
		type: Number,
		default: 0
	},
	throwsP2: {
		type: Number,
		default: 0
	},
	nearsP1: {
		type: Number,
		default: 0
	},
	nearsP2: {
		type: Number,
		default: 0
	},
	maxPoints:{
		type: Number,
		default: 0
	},
	state:{
		type: String,
		default: 'Open'
	},
	length:{
		type: Number,
		default: 0
	},
	maxLength: {
		type: Number,
		default: 300000
	}
});

mongoose.model('Game', GameSchema);