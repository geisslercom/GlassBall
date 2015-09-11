'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tournaments = require('../../app/controllers/tournaments.server.controller');

	// Tournaments Routes
	app.route('/tournaments')
		.get(tournaments.list)
		.post(users.requiresLogin, tournaments.create);

	app.route('/tournaments/:tournamentId')
		.get(tournaments.read)
		.put(users.requiresLogin, tournaments.hasAuthorization, tournaments.update)
		.delete(users.requiresLogin, tournaments.hasAuthorization, tournaments.delete);

	// Finish by binding the Tournament middleware
	app.param('tournamentId', tournaments.tournamentByID);
};
