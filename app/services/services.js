'use strict';

angular.module('services', [])
.factory('apiService' , ['$q', '$http', function($q, $http) {
	var articlesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=Brian+Williams&begin_date=20100101&end_date=20150214&api-key=37e212d4173740831658ccd3ce5be553%3A9%3A2588854';

	var fetchArticles = function() {
		var deferred = $q.defer();
		$http.get(articlesUrl)
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(reason) {
			deferred.reject(reason);
		})
		return deferred.promise;		
	}
	//--- RETURN THE SERVICE OBJECT WITH METHODS -----
	return {
		fetchArticles: function() {
			return fetchArticles();
		}
	};
}]);