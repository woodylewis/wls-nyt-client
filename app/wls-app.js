'use strict';

angular.module('wlsApp', [
  	'wlsApp.services',
	'ui.router',
	'ui.bootstrap',
	'ui.bootstrap.tpls',
	'd3'
])
.config(['$stateProvider', '$urlRouterProvider', 
		  	function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider
	.otherwise('/index');

	$stateProvider
		.state('index', {
			url: "/index",
			views: {
				"state" : { templateUrl: "partials/main_state.html",}
			}
		})
		.state('list', {
			url: "/list",
			views: {
				"state" : { templateUrl: "partials/articlelist.html",}
			}
		})
		.state('keywords', {
			url: "/keywords",
			views: {
				"state" : { templateUrl: "partials/keywords.html",}
			}
		})

}])
.controller('MainCtrl', ['$scope', '$window', '$state', 'apiService', function($scope, $window, $state, apiService) {
	//----------------- ARTICLES LIST ----------------------
  	apiService.fetchArticles()
  	.then(function(data) {
  		$scope.articles = data.response.docs; 	
  		$scope.hits = data.response.meta.hits;
	    console.log('articles', $scope.articles);
  	}), function(error) {
  		console.log('fetch articles error', error);
  	};

  	$scope.buildKeywords = function() {
  		$scope.keyWords = [];
  		angular.forEach($scope.articles, function (article) {
  			angular.forEach(article.keywords, function(keyword) {
  				//console.log('keyword', keyword);
  				var k = { "rank" : keyword.rank,
  						  "major": keyword.is_major,
  						  "name" : keyword.name,
  						  "value": keyword.value  
  						};
  				$scope.keyWords.push(k);
  			});
  		});
  			console.log('$scope.keyWords', $scope.keyWords);
  			$state.go('keywords');
  	};

}]); 