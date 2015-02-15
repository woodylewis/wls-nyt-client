'use strict';

angular.module('wlsApp.services', [])
/* SERVICE TO WRAP HTTP REQUESTS */
.factory('apiService' , ['$q', '$http', function($q, $http) {
	//var stockListUrl = 'http://dev1:5000/api/stocks/';
	var stockListUrl = 'http://mean.wlsllc.com:5000/api/stocks/';

	var fetchStocks = function() {
		var deferred = $q.defer();
		$http.get(stockListUrl)
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(reason) {
			deferred.reject(reason);
		})
		return deferred.promise;		
	}

	var fetchCurrentStock = function(_id) {
		var deferred = $q.defer();
		$http.get(stockListUrl + _id)
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(reason) {
			deferred.reject(reason);
		})
		return deferred.promise;		
	}

	//---- TRANSFORMREQUESTASFORMPOST AVOIDS HAVING TO INCLUDE JQUERY FOR SERIALIZATION --
	//---- SEE FIRST ANSWER (as of Jan 27, 2015) IN THIS STACKOVERFLOW ARTICLE -----------
	//---- http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object/1714899#1714899 
	var transformRequestAsFormPost = function(obj) {
	        var str = [];
	        for(var p in obj)
	        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
	}
	//-----
	
	var insertStock = function(stock) {
		var payload = { 
			name:stock.name, 
			ticker:stock.ticker,
			year1:stock.year1,
			year2:stock.year2,
			year3:stock.year3,
			year4:stock.year4,
			year5:stock.year5
		};
		var deferred = $q.defer();
		$http.post(stockListUrl, 
			{
				transformRequest: transformRequestAsFormPost,
				data: payload,
				headers: {'Content-Type':'application/x-www-form-urlencoded'}
		})
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(reason) {
			deferred.reject(reason);
			console.log('post error', reason);
		})
		return deferred.promise;
	}

	var deleteStock = function(_id) {
		var deferred = $q.defer();
		$http.delete(stockListUrl + _id)
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(reason) {
			deferred.reject(reason);
			console.log('delete error', reason);
		})
		return deferred.promise;		
	}

	var editStock = function(_id, stock) {
		var payload = { 
			name:stock.name, 
			ticker:stock.ticker,
			year1:stock.year1,
			year2:stock.year2,
			year3:stock.year3,
			year4:stock.year4,
			year5:stock.year5
		};
		var deferred = $q.defer();
		$http.put(stockListUrl + _id,
			{
				transformRequest: transformRequestAsFormPost,
				data: payload,
				headers: {'Content-Type':'application/x-www-form-urlencoded'}
		})
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(reason) {
			deferred.reject(reason);
			console.log('post error', reason);
		})
		return deferred.promise;
	}

	//--- RETURN THE SERVICE OBJECT WITH METHODS -----
	return {
		fetchStocks: function() {
			return fetchStocks();
		},
		fetchCurrentStock: function(_id) {
			return fetchCurrentStock(_id);
		},
		insertStock: function(stock) {
			return insertStock(stock);
		},
		deleteStock: function(_id) {
			return deleteStock(_id);
		},
		editStock: function(_id, stock) {
			return editStock(_id, stock);
		}
	};
}]);
