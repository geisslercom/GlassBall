'use strict';

// Games controller
angular.module('games').controller('GamesController', ['$scope','$interval', '$stateParams', '$location', 'Authentication', 'Games', 'Users', 
	function($scope, $interval, $stateParams, $location, Authentication, Games, Users) {
		var inter;
		$scope.getTotalThrows = function(player){
		    var total = 0;
		    for(var i = 0; i < $scope.games.length; i++){
		        total += $scope.games[i].throwsP1 + $scope.games[i].throwsP2 ;
		    }
		    return total;
		};
		$scope.getTotalAcc = function(player){
		    var total = 0;
		    for(var i = 0; i < $scope.games.length; i++){
		    	var tp1 = $scope.games[i].throwsP1 || 0;
		    	var tp2 = $scope.games[i].throwsP2 || 0;
		    	var p1 = $scope.games[i].pointP1 || 0;
		    	var p2 = $scope.games[i].pointP2 || 0;
		        total += ((100 / tp1 * p1) + (100 / tp2 * p2)) / 2;
		    	console.log(total);
		    }
		    return total;
		};
		// $scope.keydown = function(){
		// 	$scope.throwsP1++;
		// 	$scope.throwsP2++;
		// };
		$scope.authentication = Authentication;
		$scope.user = Users.getAll();
		// $scope.user.then(console.log)
		// .then(function(e,d){
		// 	console.log(arguments);
		// });
		// Create new Game
		$scope.checkWinner = function(scope,player){
			console.log(scope);
			scope.game[player] = scope.game[player]+1 || 1;
			if (scope.game[player]+1>$scope.game.maxPoints) {
				scope.game.state = 'Done';
				scope.game.length = $scope.game.length;
				$scope.update();
				console.log(inter);
				$location.path('games');
			}
		};
		$scope.getTimeStatus = function(scope){
			return scope.game.length / scope.game.maxLength * 100 < 50 ? 'warning' : (scope.game.length / scope.game.maxLength * 100 < 20 ?  'danger' : 'default')
		};
		$scope.startMatch = function(scope){
			scope.game.state = 'Running';
			inter = $interval(function(){
				console.log($scope.game.length);
				$scope.game.length++;
			},1000,$scope.game.maxLength).finally(function(){
				console.log('Times  up');
				scope.game.state = 'Done';
				scope.game.length = $scope.game.length;
				$scope.update();
				console.log(inter);
				$location.path('games');
			});
		};
		$scope.create = function() {
			console.log($scope.opponent);
			// Create new Game object
			var game = new Games ({
				name: this.name,
				player1: $scope.authentication.user,
				player2: $scope.user[$scope.opponent],
				maxPoints: $scope.maxPoints,
				maxLength: $scope.maxLength * 60
			});

			// Redirect after save0000000
			game.$save(function(response) {
				$location.path('games/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Game
		$scope.remove = function(game) {
			
			if ( game ) { 
				game.$remove();

				for (var i in $scope.games) {
					if ($scope.games [i] === game) {
						$scope.games.splice(i, 1);
					}
				}
			} else {
				$scope.game.$remove(function() {
					$location.path('games');
				});
			}
			inter.stop();
		};

		// Update existing Game
		$scope.update = function() {
			var game = $scope.game;

			game.$update(function() {
				$location.path('games/' + game._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Games
		$scope.find = function() {
			$scope.games = Games.query();
		};

		// Find existing Game
		$scope.findOne = function() {
			$scope.game = Games.get({ 
				gameId: $stateParams.gameId
			});
		};
		$scope.saveP = function(){
			var game = $scope.game;

			game.$update(function() {
				$location.path('games/' + game._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);