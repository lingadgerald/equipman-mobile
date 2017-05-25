(function (ng) {
	'use strict';

	ng.module('services').factory('Event', Event);

	Event.$inject = ['$q', '$http', 'Backendless'];
	function Event($q, $http, Backendless) {
		var events = [];

		var promiser = (promise) => {
			promise.success = (res) => {
				promise.then(res);
				return promise;
			};
			promise.error = (err) => {
				promise.then(null, err);
				return promise;
			};
			return promise;
		};
		
		return {
			all: function(params) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				if (params == null) { params = {}; }
				Backendless.request('data.event@get', params).then(
					(res) => deferred.resolve(res),
					(err) => deferred.reject(err)
				);
				return promiser(promise);
			},
			get: function(eventId) {
				return events.find(function(event) {
					return event.id === parseInt(eventId);
				});
			}
		};
	}
})(angular);
