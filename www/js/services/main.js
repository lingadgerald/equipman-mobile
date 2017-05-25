(function (ng) {
	'use strict';

	ng.module('services').service('MainService', MainService);

	MainService.$inject = ['$q', '$http'];
	function MainService($q, $http) {
		var vm = this;
		vm.$q = $q;
		vm.$http = $http;
		vm.data = {};
	}

	MainService.prototype.promiser = function(promise) {
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

	MainService.prototype.getData = function(params) {
		var vm = this,
			deferred = vm.$q.defer(),
			promise = deferred.promise,
			obj = ng.copy(params),
			url = 'js/data/{group}/{name}.json'.format(obj)
		;

		if (vm.data[obj.name] == null) {
			vm.$http.get(url).then((res) => {
				vm.data[obj.name] = res.data;
				deferred.resolve(vm.data[obj.name]);
			}, (err) => {
				deferred.reject(err);
			});
		} else {
			deferred.resolve(vm.data[obj.name]);
		}
		
		return vm.promiser(promise);
	};
})(angular);
