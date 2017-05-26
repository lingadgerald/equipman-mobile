(function (ng) {
	'use strict';

	ng.module('services').factory('User', User);

	User.$inject = ['$q', '$http', '$localStorage', 'Backendless'];
	function User($q, $http, $localStorage, Backendless) {

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
			currentUser: (user) => {
				if (!!user) { $localStorage['_equipman_mobile_user'] = user; }
				return $localStorage['_equipman_mobile_user'];
			},
			login: (data) => {
				var deferred = $q.defer(),
					promise = deferred.promise,
					error = null
				;
				if (!!data.login && !!data.password) {
					Backendless.request('auth.login@post', data).then((res) => {
						var params = { loadRelations: 'user,user.ministry,user.role' };
						var resource = 'data.user@get@{objectId}'.format(res);
						$localStorage['user-token'] = res['user-token'];
						return Backendless.request(resource, params);
					}).then((res) => {
						$localStorage['_equipman_mobile_user'] = res.user || res;
						deferred.resolve(res);
					}).catch((err) => {
						deferred.reject(err);
					});
				} else {
					error = { message: 'Invalid login credentials' };
					deferred.reject(error);
				}
				return promiser(promise);
			},
			logout: () => {
				var deferred = $q.defer(),
					promise = deferred.promise
				;
				Backendless.request('auth.logout@get').then((res) => {
					$localStorage.$reset();
					delete $localStorage['user-token'];
					delete $localStorage['_equipman_mobile_user'];
					deferred.resolve(res);
				}, (err) => {
					deferred.reject(err);
				});
				return promiser(promise);
			},
			getTable: (resource, params) => {
				var deferred = $q.defer();
				var promise = deferred.promise;
				if (params == null) { params = {}; }
				Backendless.request(resource + '@get', params).then(
					(res) => deferred.resolve(res),
					(err) => deferred.reject(err)
				);
				return promise;
			}
		}
	}
})(angular);
