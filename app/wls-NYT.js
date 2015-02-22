 'use strict';

angular.module('wlsNYT', [ 
	'ui.router',
	'ui.bootstrap',
	'ui.bootstrap.tpls',
  	'services',
	'd3'
])
.config(['$stateProvider', '$urlRouterProvider', 
		  	function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider
	.otherwise('index');

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
		.state('charts', {
			url: "/charts",
			views: {
				"state" : { templateUrl: "partials/charts.html",}
			}
		})

}])
.directive('wlsBarchart', ['d3Service', function(d3Service){
  return {
    restrict: 'E',
	templateUrl: 'templates/barcharts.html',

   link: function($scope) {

		d3Service.d3().then(function(d3) {
			
			function barChart(data, svgRegion, width, barHeight) {
				var color = d3.scale.category20b();
				var x = d3.scale.linear()
				    .domain([0, d3.max(data)])
				    .range([0, width]);

				var chart = d3.select(svgRegion)
				    .attr("width", width)
				    .attr("height", barHeight * data.length);

				var bar = chart.selectAll("g")
				    .data(data)
				  .enter().append("g")
				    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

				bar.append("rect")
				    .attr("width", x)
				    .attr("height", barHeight - 1)
			        .attr('fill', function(d, i){ return color(i) });

				bar.append("text")
				    .attr("x", function(d) { return x(d) - 16; })
				    .attr("y", barHeight / 2)
				    .attr("dy", ".35em")
				    .text(function(d) { return d; });
			}

			barChart($scope.$parent.personRanks, "#persons", 120, 16);
			barChart($scope.$parent.subjectRanks, "#subjects", 120, 16);
			barChart($scope.$parent.CreativeWorksRanks, "#creative_works", 120, 16);			
			barChart($scope.$parent.organizations, "#organizations", 120, 16);						

		});//-- d3Service ---
	}//-- link ---
  };
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