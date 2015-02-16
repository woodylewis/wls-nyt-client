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
	    console.log('articles', $scope.articles);
  	}), function(error) {
  		console.log('fetch articles error', error);
  	};

  	$scope.buildKeywords = function() {
  		$scope.keyWords = [];
  		$scope.keyWordTypes = []; 
		var kList = [];
  		angular.forEach($scope.articles, function (article) {
  			angular.forEach(article.keywords, function(keyword) {
  				var k1 = { 	"rank" : keyword.rank,
  						  	"name" : keyword.name  
  						}; 
  				kList.push(k1);

  				var k2 = {
  							"rank" : keyword.rank,
  						  	"major": keyword.is_major,
  						  	"name" : keyword.name,
  						  	"value": keyword.value  
  						}; 
  				$scope.keyWords.push(k2);
  			});
  		});
  		//-- BUILD UNIQUE KEYWORD LIST
  		angular.forEach(kList, function(k) {
  			if($scope.keyWordTypes.indexOf(k.name) == -1) {
  				$scope.keyWordTypes.push(k.name);
  			}
  		});

		$scope.personRanks = [];
		buildTypeRankList("persons", kList, $scope.personRanks);
		$scope.subjectRanks = [];
		buildTypeRankList("subject", kList, $scope.subjectRanks);
		$scope.CreativeWorksRanks = [];
		buildTypeRankList("creative_works", kList, $scope.CreativeWorksRanks);
		$scope.organizations = [];
		buildTypeRankList("organizations", kList, $scope.organizations);

  	console.log('kList ', kList);
		console.log('keyWordTypes', $scope.keyWordTypes);
		console.log('$scope.personRanks ', $scope.personRanks);
		console.log('$scope.subjectRanks ', $scope.subjectRanks);
		console.log('$scope.CreativeWorksRanks ', $scope.CreativeWorksRanks);
		console.log('$scope.organizations ', $scope.organizations);
		$state.go('keywords');

  		function buildTypeRankList(theType, typeArray, rankArray) {
  				for(var $i = 0; $i < typeArray.length; $i++) {
	  				if(typeArray[$i].name == theType) {
	  					rankArray.push(typeArray[$i].rank);
	  				}
  				}
  			}
  	};

}]); 