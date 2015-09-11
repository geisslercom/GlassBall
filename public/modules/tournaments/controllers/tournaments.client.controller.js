'use strict';

// Tournaments controller
angular.module('tournaments').controller('TournamentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tournaments',
	function($scope, $stateParams, $location, Authentication, Tournaments) {
		$scope.authentication = Authentication;

		// Create new Tournament
		$scope.create = function() {
			// Create new Tournament object
			var tournament = new Tournaments ({
				name: this.name
			});

			// Redirect after save
			tournament.$save(function(response) {
				$location.path('tournaments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tournament
		$scope.remove = function(tournament) {
			if ( tournament ) { 
				tournament.$remove();

				for (var i in $scope.tournaments) {
					if ($scope.tournaments [i] === tournament) {
						$scope.tournaments.splice(i, 1);
					}
				}
			} else {
				$scope.tournament.$remove(function() {
					$location.path('tournaments');
				});
			}
		};

		// Update existing Tournament
		$scope.update = function() {
			var tournament = $scope.tournament;

			tournament.$update(function() {
				$location.path('tournaments/' + tournament._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tournaments
		$scope.find = function() {
			$scope.tournaments = Tournaments.query();
		};

		// Find existing Tournament
		$scope.findOne = function() {
			$scope.tournament = Tournaments.get({ 
				tournamentId: $stateParams.tournamentId
			});
		};
	}
]);