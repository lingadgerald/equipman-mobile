(function (ng) {
	'use strict';

	ng.module('equipmanMobile')
		.service('MainService', MainService)
	;

	MainService.$inject = ['$q', '$http', '$localStorage'];
	function MainService($q, $http, $localStorage) {
		var self = this;
		self.$q = $q;
		self.$http = $http;
		self.$localStorage = $localStorage;
		self.data = {};
		self.assignedMember = null;
	}

	MainService.prototype.promiser = function (promise) {
		promise.success = function (data) {
			promise.then(data);
			return promise;
		};
		promise.error = function (data) {
			promise.then(null, data);
			return promise;
		};
		return promise;
	};

	MainService.prototype.getData = function (parameters) {
		var self = this,
			deferred = self.$q.defer(),
			promise = deferred.promise,
			obj = ng.copy(parameters),
			url = 'js/data/{group}/{name}.json'.format(obj)
		;

		if (self.data[obj.name] === null || self.data[obj.name] === undefined) {
			self.$http.get(url).then(function (success) {
				self.data[obj.name] = success.data;
				deferred.resolve(self.data[obj.name]);
			}, function (error) {
				deferred.reject(error);
			});
		} else {
			deferred.resolve(self.data[obj.name]);
		}
		return self.promiser(promise);
	};

	MainService.prototype.currentUser = function (user) {
		var self = this;
		if (!!user) {self.$localStorage._equipman_mobile_user = user;}
		return self.$localStorage._equipman_mobile_user;
	};

	MainService.prototype.localStorage = function (key, value) {
		var self = this;
		if (!!value) {self.$localStorage[key] = value;}
		return self.$localStorage;
	};

	MainService.prototype.assignMember = function (data) {
		var self = this;
		if (ng.equals({}, data) || ng.equals([], data) || ng.equals('', data) || data === undefined) {
			self.assignedMember = null;
		} else {
			self.assignedMember = data;
		}
		return self.assignedMember;
	};
})(angular);