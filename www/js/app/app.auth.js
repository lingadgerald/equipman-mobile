(function (ng) {
	'use strict';

	ng.module('app.auth', []).config(Config);

	Config.$inject = ['$stateProvider'];
	function Config($stateProvider) {
		$stateProvider
			.state('auth.login', {
				url		 : '/login',
				params : {name: 'login'},
				views	 : {
					'content@auth': {
						templateUrl: 'templates/auth/login.html',
						controller : 'AuthenticateCtrl as ctrl'
					}
				},
				resolve: {
					AuthData: function (MainService) {
						return MainService.getData({name: 'login', group: 'auth'});
					}
				}
			})
		;
	}
})(angular);