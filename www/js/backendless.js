(function (ng) {
	'use strict';

	ng.module('backendless', []).provider('Backendless', Backendless);

	Backendless.$inject = [];
	function Backendless() {
		var vm = this, $log = ng.injector(['ng']).get('$log'),
			paths = {},
			keys = {
				applicationId		: '<application-id>',
				secretKey				: '<secret-key>',
				version					: 'v1',
				applicationType : 'REST',
				apiUrl 					: 'https://api.backendless.com'
			}
		;

		// A helper function to define our configure functions.
		// Loops over all properties in obj, and creates a get/set
		// method for [key + suffix] to set that property on obj.
		function configure(obj, suffix) {
			ng.forEach(obj, (v, action) => {
				this[action + suffix] = (param) => {
					if (param === undefined) { return obj[action]; }
					obj[action] = param;
					return this;
				}
			}, this);
		}
		configure.call(this, keys, 'Config');

		function register(key, path) {
			if (!ng.isString(key)) {
				$log.error('"path" must be a string (eg. `dashboard.project`)');
				return;
			}
			if (!ng.isString(path)) {
				$log.error('"path" must be a string (eg. `users/register`)');
				return;
			}
			paths[key] = path;
		}

		vm.register = register;

		vm.$get = ['$q', '$log', '$http', '$localStorage', ($q, $log, $http, $localStorage) => {
			// Request
			function request(action, data, headerRequests) {
				var actionParts = action.split('@'),
					resource = actionParts[0],
					method = actionParts[1],
					object = actionParts[2],
					params = data || {},
					headers = headerRequests || {}
				;

				if (!resource || !method) {
					$log.error('backendless.request requires correct action parameter (resourceName@methodName)');
					return false;
				} else {
					method = method.toUpperCase();
				}
				
				var deferred = $q.defer(),
					promise = deferred.promise,
					pathObject = paths[resource]
				;

				if (!pathObject) {
					$log.error('Resource "' + resource + '" is not defined in the api service!');
					deferred.reject('Resource "' + resource + '" is not defined in the api service!');
				} else {
					var obj = ng.copy(keys);
					var userToken = $localStorage['user-token'];
					var url = ['{apiUrl}/{version}/{path}'];

					if (!!object) { url.push('/{param}'); }

					obj.path = paths[resource];
					obj.param = object;

					var httpConfig = {
						url 		: url.join('').format(obj),
						method 	: method,
						headers : headers
					};

					if (method === 'GET') {
						httpConfig.params = params;
					} else {
						httpConfig.data = params;
					}

					if (!!userToken) { httpConfig.headers['user-token'] = userToken; }

					$http(httpConfig).then(
						(res) => deferred.resolve(res.data),
						(err) => deferred.reject(err.data)
					);

					// promise.success = (data) => {
					// 	promise.then(data);
					// 	return promise;
					// };
					// promise.error = (data) => {
					// 	promise.then(null, data);
					// 	return promise;
					// };
					return promise;
				}
			} // End

			// Send Email
			function sendEmail(subject, bodyparts, to, attatchment) {
				var deferred = $q.defer(),
					promise = deferred.promise
				;
				subject = subject || 'Equipman';
				if (!ng.isArray(to)) {
					$log.error('backendless.sendEmail must have an array of email addresses to deliver the email message');
					return false;
				}
				if (ng.isObject(bodyparts) && !ng.isArray(bodyparts)) {
					if (!bodyparts.textmessage && !bodyparts.htmlmessage) {
						$log.error('backendless.sendEmail must have a textmessage or htmlmessage key to create the body of the email message');
						return false;
					}
				}

				var obj = {
					subject   : subject,
					bodyparts : bodyparts,
					to 				: to
				};

				if (!!attatchment) { obj.attatchment = attatchment; }

				request('send.email@post', obj).then((res) => {
					console.log('send email success:', res);
					deferred.resolve(res);
				}, (err) => {
					console.log('send email error:', err);
					deferred.reject(err);
				});
				return promise;
			}

			return {
				paths 		: paths,
				register 	: register,
				request 	: request,
				sendEmail : sendEmail
			};
		}];

	}
})(angular);
