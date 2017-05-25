(function (ng) {
	'use strict';

	ng.module('app.profile', []).config(Config);

	Config.$inject = ['$stateProvider'];
	function Config($stateProvider) {
		$stateProvider
			.state('app.tabs.profile', {
				url		 : '/profile',
				params : {name: 'profile'},
				views	 : {
					'profile@app.tabs': {
						templateUrl: 'templates/app/profile_menu.html',
						controller : 'ProfileCtrl as ctrl'
					}
				},
				resolve: {
					ProfileData: function (MainService) {
						return MainService.getData({name: 'profile', group: 'app'});
					}
				}
			})
			.state('app.tabs.profile.editProfile', {
				url		 : '/edit_profile',
				params : {name: 'editProfile'},
				cache	 : false,
				views	 : {
					'profile@app.tabs': {
						templateUrl: 'templates/app/details.html',
						controller : 'EditProfileCtrl as ctrl'
					}
				},
				resolve: {
					ProfileData: function (MainService) {
						return MainService.getData({name: 'edit_profile', group: 'app'});
					}
				}
			})
			.state('app.tabs.profile.changePassword', {
				url		 : '/change_password',
				params : {name: 'changePassword'},
				cache	 : false,
				views	 : {
					'profile@app.tabs': {
						templateUrl: 'templates/app/details.html',
						controller : 'EditProfileCtrl as ctrl'
					}
				},
				resolve: {
					ProfileData: function (MainService) {
						return MainService.getData({name: 'change_password', group: 'app'});
					}
				}
			})
		;
	}
})(angular);