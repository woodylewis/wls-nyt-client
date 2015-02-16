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
		.state('charts', {
			url: "/charts",
			views: {
				"state" : { templateUrl: "partials/charts.html",}
			}
		})

}])
.directive('wlsPiechart', ['d3Service', function(d3Service){
  return {
    restrict: 'E',
    transclude: true,
	templateUrl: 'templates/piecharts.html',

   link: function($scope) {

		d3Service.d3().then(function(d3) {
			function pieChart(data, svgRegion, width, height) {		    
				d3.select(svgRegion).select('svg').remove();
				//--- START WITH GREEN FOR CASH -----
				var color = ['#2ca02c', '#1f77b4','#ff7f0e','#d62728'];
			    var data = data;
			    var min = Math.min(width, height);
			    var svg = d3.select(svgRegion).append('svg');
			    var pie = d3.layout.pie().sort(null);
			    var arc = d3.svg.arc()
			      .outerRadius(min / 2 * 0.9);

			    svg.attr({width: width, height: height});
			    var g = svg.append('g')
			      // center the chart
			      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
			    // add the <path>s for each arc slice
			    g.selectAll('path').data(pie(data))
			      .enter().append('path')
			        .attr('d', arc)
			        .attr('fill', function(d, i){ return color[i] });
			}//--- pieChart ----

			var persons = $scope.$parent.personRanks; 
	    	var subject	= $scope.$parent.subjectRanks; 
	    	var creative_works	= $scope.$parent.CreativeWorksRanks; 
	    	var organizations = $scope.$parent.organizations;

			pieChart(persons, "#chart", 120, 120);

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