(function (ng) {
	'use strict';

	ng.module('services').factory('Ministry', Ministry);

	Ministry.$inject = ['$q', '$http', 'Backendless'];
	function Ministry($q, $http, Backendless) {
		
		return {
			all: (params) => {
				var deferred = $q.defer();
				var promise = deferred.promise;
				if (params == null) { params = {}; }
				Backendless.request('data.ministry@get', params).then(
					(res) => deferred.resolve(res),
					(err) => deferred.reject(err)
				);
				return promise;
			},
			get: (id, params) => {
				var deferred = $q.defer();
				var promise = deferred.promise;
				if (params == null) { params = {}; }
				Backendless.request('data.ministry@get@' + id, params).then(
					(res) => deferred.resolve(res),
					(err) => deferred.reject(err)
				);
				return promise;
			},
			getBy: (model, data, params) => {
				var deferred = $q.defer();
				var promise = deferred.promise;
				if (params == null) { params = {}; }
				params.where = 'deleted is null and ' + model + '=\'' + data + '\'';
				Backendless.request('data.ministry@get', params).then(
					(res) => deferred.resolve(res),
					(err) => deferred.reject(err)
				);
				return promise;
			}
		};

	}
})(angular);
