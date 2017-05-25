(function (ng) {
	'use strict';
	
	ng.module('routes').config(configBlock);

	configBlock.$inject = ['$stateProvider'];
	function configBlock($stateProvider) {
		var baseUrl = 'templates/auth';
		var auth = {
			login: {
				url 				: '/login',
				templateUrl : baseUrl + '/login.html',
				controller  : 'LoginCtrl as vm',
				resolve 		: {
					LoginData: (MainService) => {
						return MainService.getData({ name: 'login', group: 'auth' });
					}
				}
			}
		};

		$stateProvider
			.state('login', auth.login)
		;
	}
})(angular);
