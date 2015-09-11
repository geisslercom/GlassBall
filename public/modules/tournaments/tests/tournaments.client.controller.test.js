'use strict';

(function() {
	// Tournaments Controller Spec
	describe('Tournaments Controller Tests', function() {
		// Initialize global variables
		var TournamentsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Tournaments controller.
			TournamentsController = $controller('TournamentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tournament object fetched from XHR', inject(function(Tournaments) {
			// Create sample Tournament using the Tournaments service
			var sampleTournament = new Tournaments({
				name: 'New Tournament'
			});

			// Create a sample Tournaments array that includes the new Tournament
			var sampleTournaments = [sampleTournament];

			// Set GET response
			$httpBackend.expectGET('tournaments').respond(sampleTournaments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tournaments).toEqualData(sampleTournaments);
		}));

		it('$scope.findOne() should create an array with one Tournament object fetched from XHR using a tournamentId URL parameter', inject(function(Tournaments) {
			// Define a sample Tournament object
			var sampleTournament = new Tournaments({
				name: 'New Tournament'
			});

			// Set the URL parameter
			$stateParams.tournamentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tournaments\/([0-9a-fA-F]{24})$/).respond(sampleTournament);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tournament).toEqualData(sampleTournament);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tournaments) {
			// Create a sample Tournament object
			var sampleTournamentPostData = new Tournaments({
				name: 'New Tournament'
			});

			// Create a sample Tournament response
			var sampleTournamentResponse = new Tournaments({
				_id: '525cf20451979dea2c000001',
				name: 'New Tournament'
			});

			// Fixture mock form input values
			scope.name = 'New Tournament';

			// Set POST response
			$httpBackend.expectPOST('tournaments', sampleTournamentPostData).respond(sampleTournamentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tournament was created
			expect($location.path()).toBe('/tournaments/' + sampleTournamentResponse._id);
		}));

		it('$scope.update() should update a valid Tournament', inject(function(Tournaments) {
			// Define a sample Tournament put data
			var sampleTournamentPutData = new Tournaments({
				_id: '525cf20451979dea2c000001',
				name: 'New Tournament'
			});

			// Mock Tournament in scope
			scope.tournament = sampleTournamentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tournaments\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tournaments/' + sampleTournamentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tournamentId and remove the Tournament from the scope', inject(function(Tournaments) {
			// Create new Tournament object
			var sampleTournament = new Tournaments({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tournaments array and include the Tournament
			scope.tournaments = [sampleTournament];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tournaments\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTournament);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tournaments.length).toBe(0);
		}));
	});
}());