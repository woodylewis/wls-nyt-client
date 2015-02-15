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
				"state" : { templateUrl: "partials/stocklist.html",}
			}
		})
		.state('stock', {
			url: "/stock",
			views: {
				"state" : { templateUrl: "partials/stock.html", }
			}
		})
		.state('add', {
			url: "/add",
			views: {
				"state" : { templateUrl: "partials/add_stock.html", }
			}
		})
		.state('edit', {
			url: "/edit",
			views: {
				"state" : { templateUrl: "partials/edit_stock.html", }
			}
		})
}])
.directive('wlsBarchart2', [ 'd3Service', function (d3Service) {
	return {
		restrict: 'E',
		templateUrl: 'templates/wls-barchart2.html',
		//--- WE WANT THE TEMPLATE TO BIND PARENT CONTEXT --- 
		transclude: true,

		link: function($scope) {
			d3Service.d3().then(function(d3) {
				//-- WE ALSO WANT ACCESS TO PARENT VARIABLES HERE ---
				var theStock = $scope.$parent.currentStock;
				var barData = [{
					'x'	: 1,
					'y' : theStock.year1
					},{
					'x' : 2,
					'y'	: theStock.year2
					}, {
					'x' : 3,
					'y' : theStock.year3
					}, {
					'x' : 4,
					'y' : theStock.year4
					}, {
					'x' : 5,
					'y' : theStock.year5 
					}];	
				
				var chart = d3.select(".wls-stock-bar"),
					WIDTH = 500,
					HEIGHT = 150,
					MARGINS = {
						top:20,
						right:10,
						bottom:20,
						left:50
					},
				xRange = d3.scale.ordinal()
						.rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right],
					0.1).domain(barData.map(function(d) {
						return d.x;
					})),

				yRange = d3.scale.linear()
				   	   //.range([HEIGHT - MARGINS.top, MARGINS.bottom])
				   	   .range([HEIGHT - MARGINS.bottom, MARGINS.top])
				   	   .domain([0, d3.max(barData, function(d) {
				   	   		return d.y;
				   	   })
				   	  ]),

				xAxis = d3.svg.axis()
						.scale(xRange)
						.tickSize(5)
						.tickSubdivide(true),

				yAxis = d3.svg.axis()
						.scale(yRange)
						.tickSize(5)
						.orient("left")
						.tickSubdivide(true);

				chart.append('svg:g')
					.attr('class', 'x axis')
					.attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
					.call(xAxis);
				
				chart.append('svg:g')
					.attr('class', 'y axis')
					.attr('transform', 'translate(' + (MARGINS.left) + ',0)')
					.call(yAxis);
				   
				chart.selectAll('rect')
				   .data(barData)
				   .enter()
				   .append('rect')
				   .attr('x', function(d){
				   		return xRange(d.x);
				   })
				   .attr('y', function(d){
				   		return yRange(d.y);
				   })
				   .attr('width', xRange.rangeBand())
				   .attr('height', function (d){
				   		return ((HEIGHT - MARGINS.bottom) - yRange(d.y));
				   })

				   .attr("fill", function(d) {
						return "#70B8FF";
						//return "rgb(0, 0, 200";
				   });
			});
		}
	};
}])
.controller('MainCtrl', ['$scope', '$window', '$state', 'apiService', function($scope, $window, $state, apiService) {
	$scope.currentStock; 
	$scope.editStockID;

	//----------------- STOCK LIST ----------------------
  	apiService.fetchStocks()
  	.then(function(data) {
  		$scope.stocks = data; 	
	    console.log('stocks', $scope.stocks);
  	}), function(error) {
  		console.log('fetch stocks error', error);
  	};

	//----------------- SHOW STOCK  ----------------------
    $scope.showCurrentStock = function(_id) {
	    apiService.fetchCurrentStock(_id)
	    .then(function(data) {
	    	$scope.currentStock = data;
    		$state.go('stock');
	    }), function(error) {
  		console.log('show stock error', error);
	    };
  	};

	//----------------- ADD STOCK  ----------------------
  	$scope.insertStock = function(stock) {
    	apiService.insertStock(stock)
    	.then(function(data) {
    		apiService.fetchStocks()
    		.then(function(data) {
  				$scope.stocks = data; 	
  			}), function(error) {
  				console.log('fetch stocks error', error);
  			};
    		$state.go('list');
    	}), function(error) {
  			console.log('insert stock error', error);
    	};
    };


	//----------------- DELETE STOCK  ----------------------
  	$scope.deleteStock = function(_id) {
    	apiService.deleteStock(_id)
    	.then(function(data) {
    		apiService.fetchStocks()
    		.then(function(data) {
  				$scope.stocks = data; 	
  			}), function(error) {
  				console.log('fetch stocks error', error);
  			};
    		$state.go('list');
    	}), function(error) {
  			console.log('delete stock error', error);
    	};
  	};
    //----------------- EDIT STOCK  ----------------------
	$scope.editStock = function(_id, stock) {
    	apiService.editStock(_id, stock)
    	.then(function(data) {
    		 apiService.fetchCurrentStock(_id)
		    .then(function(data) {
		    	$scope.currentStock = data;
		    }), function(error) {
	  		console.log('show stock error', error);
		    };
    		$state.go('stock');
    	}), function(error) {
  			console.log('edit stock error', error);
    	};
  	};

	//----------------- SUBMIT FORM ----------------------
	$scope.submitInsertForm = function(isValid) {
		if(isValid) {
			$scope.insertStock($scope.currentStock);
		}
	};

	//----------------- EDIT FORM ----------------------
	$scope.submitEditForm = function(isValid) {
		if(isValid) {
			$scope.editStock($scope.editStockID, $scope.currentStock);
		}
	};

	$scope.copyStock = function(stock) {
		$scope.currentStock = stock; 
	};

	$scope.copyEditStock = function(id, stock) {
		$scope.editStockID = id;
		$scope.currentStock = stock; 
	};
}]); 