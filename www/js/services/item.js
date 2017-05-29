(function (ng) {
	'use strict';

	ng.module('services').factory('Item', Item);

	Item.$inject = ['$q', '$http', 'Backendless'];
	function Item($q, $http, Backendless) {

		var union_arrays = (x, y) => {
			var obj = {}, res = [];
			for (var i = x.length - 1; i >= 0; --i) {
				obj[x[i]] = x[i];
			}
			for (var i = y.length - 1; i >= 0; --i) {
				obj[y[i]] = y[i];
			}
			for (var k in obj) {
				if (obj.hasOwnProperty(k))
				res.push(obj[k]);
			}
			return res;
		};
		
		return {
			all: (params) => {
				var deferred = $q.defer();
				var promise = deferred.promise;
				if (params == null) { params = {}; }
				Backendless.request('data.item@get', params).then(
					(res) => deferred.resolve(res),
					(err) => deferred.reject(err)
				);
				return promise;
			},
			get: (id, params) => {
				var deferred = $q.defer();
				var promise = deferred.promise;
				if (params == null) { params = {}; }
				Backendless.request('data.item@get@' + id, params).then(
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
				Backendless.request('data.item@get', params).then(
					(res) => deferred.resolve(res),
					(err) => deferred.reject(err)
				);
				return promise;
			},
			save: (resource, params, headers) => {
				var deferred = $q.defer();
				var promise = deferred.promise;
				if (params == null) { params = {}; }
				Backendless.request(resource, params, headers).then(
					(res) => deferred.resolve(res),
					(err) => deferred.reject(err)
				);
				return promise;
			},
			sendEmail: (params, event, currentUser) => {
				var deferred = $q.defer();
				var promise = deferred.promise;
				var obj = {
					subject: '{event} Checked Out Items'.format({event: event}),
					bodyparts: {},
					to: []
				};
				var message = ['<ul>'], arr1 = [], arr2 = [];

				ng.forEach(params, (val) => {
					var temp = '';
					if (val.email != null && val.email !== currentUser.email) {
						arr1.push(val.email);
					}
					if (val.coEmail != null && val.coEmail !== currentUser.email) {
						arr2.push(val.coEmail);
					}

					temp = '<li>{itemId} - {itemName}';
					// if (val.name != null) { temp += ': {name}'; }
					// if (val.coName != null) { temp += ' checked out by {coName}'; }
					temp += '</li>';
					message.push(temp.format(val));
				});
				message.push('</ul>');
				obj.to = union_arrays(arr1, arr2);

				var htmlmessage = [
					'Hello,<br><br>',
					// 'In event {event}, the items that I\'ve checked out are:<br>'
					'Please check out the following items in event {event}'
				].join(' ');
				htmlmessage = htmlmessage.concat(message.join(' '));
				htmlmessage += '<br>Sincerely, {name}<br>'.format(currentUser);
				obj.bodyparts.htmlmessage = htmlmessage.format({event: event});

				if (obj.to.length > 0) {
					Backendless.sendEmail(obj.subject, obj.bodyparts, obj.to).then(
						(res) => deferred.resolve(res),
						(err) => deferred.reject(err)
					);
				} else {
					deferred.reject('Cannot send email to yourself');
				}
				return promise;
			}
		};

	}
})(angular);
