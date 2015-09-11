'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tournament = mongoose.model('Tournament'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tournament;

/**
 * Tournament routes tests
 */
describe('Tournament CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Tournament
		user.save(function() {
			tournament = {
				name: 'Tournament Name'
			};

			done();
		});
	});

	it('should be able to save Tournament instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tournament
				agent.post('/tournaments')
					.send(tournament)
					.expect(200)
					.end(function(tournamentSaveErr, tournamentSaveRes) {
						// Handle Tournament save error
						if (tournamentSaveErr) done(tournamentSaveErr);

						// Get a list of Tournaments
						agent.get('/tournaments')
							.end(function(tournamentsGetErr, tournamentsGetRes) {
								// Handle Tournament save error
								if (tournamentsGetErr) done(tournamentsGetErr);

								// Get Tournaments list
								var tournaments = tournamentsGetRes.body;

								// Set assertions
								(tournaments[0].user._id).should.equal(userId);
								(tournaments[0].name).should.match('Tournament Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tournament instance if not logged in', function(done) {
		agent.post('/tournaments')
			.send(tournament)
			.expect(401)
			.end(function(tournamentSaveErr, tournamentSaveRes) {
				// Call the assertion callback
				done(tournamentSaveErr);
			});
	});

	it('should not be able to save Tournament instance if no name is provided', function(done) {
		// Invalidate name field
		tournament.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tournament
				agent.post('/tournaments')
					.send(tournament)
					.expect(400)
					.end(function(tournamentSaveErr, tournamentSaveRes) {
						// Set message assertion
						(tournamentSaveRes.body.message).should.match('Please fill Tournament name');
						
						// Handle Tournament save error
						done(tournamentSaveErr);
					});
			});
	});

	it('should be able to update Tournament instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tournament
				agent.post('/tournaments')
					.send(tournament)
					.expect(200)
					.end(function(tournamentSaveErr, tournamentSaveRes) {
						// Handle Tournament save error
						if (tournamentSaveErr) done(tournamentSaveErr);

						// Update Tournament name
						tournament.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tournament
						agent.put('/tournaments/' + tournamentSaveRes.body._id)
							.send(tournament)
							.expect(200)
							.end(function(tournamentUpdateErr, tournamentUpdateRes) {
								// Handle Tournament update error
								if (tournamentUpdateErr) done(tournamentUpdateErr);

								// Set assertions
								(tournamentUpdateRes.body._id).should.equal(tournamentSaveRes.body._id);
								(tournamentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tournaments if not signed in', function(done) {
		// Create new Tournament model instance
		var tournamentObj = new Tournament(tournament);

		// Save the Tournament
		tournamentObj.save(function() {
			// Request Tournaments
			request(app).get('/tournaments')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tournament if not signed in', function(done) {
		// Create new Tournament model instance
		var tournamentObj = new Tournament(tournament);

		// Save the Tournament
		tournamentObj.save(function() {
			request(app).get('/tournaments/' + tournamentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tournament.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tournament instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tournament
				agent.post('/tournaments')
					.send(tournament)
					.expect(200)
					.end(function(tournamentSaveErr, tournamentSaveRes) {
						// Handle Tournament save error
						if (tournamentSaveErr) done(tournamentSaveErr);

						// Delete existing Tournament
						agent.delete('/tournaments/' + tournamentSaveRes.body._id)
							.send(tournament)
							.expect(200)
							.end(function(tournamentDeleteErr, tournamentDeleteRes) {
								// Handle Tournament error error
								if (tournamentDeleteErr) done(tournamentDeleteErr);

								// Set assertions
								(tournamentDeleteRes.body._id).should.equal(tournamentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tournament instance if not signed in', function(done) {
		// Set Tournament user 
		tournament.user = user;

		// Create new Tournament model instance
		var tournamentObj = new Tournament(tournament);

		// Save the Tournament
		tournamentObj.save(function() {
			// Try deleting Tournament
			request(app).delete('/tournaments/' + tournamentObj._id)
			.expect(401)
			.end(function(tournamentDeleteErr, tournamentDeleteRes) {
				// Set message assertion
				(tournamentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tournament error error
				done(tournamentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tournament.remove().exec();
		done();
	});
});