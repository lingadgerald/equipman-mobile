(function (ng) {
	'use strict';

	ng.module('controllers').controller('TabSettingCtrl', TabSettingCtrl);

	TabSettingCtrl.$inject = ['$ionicPopup', '$rootScope', '$state', 'User'];
	function TabSettingCtrl($ionicPopup, $rootScope, $state, User) {
		var vm = this;
		vm.platform = ionic.Platform.platform();
		vm.$ionicPopup = $ionicPopup;
		vm.$rootScope = $rootScope;
		vm.$state = $state;
		vm.User = User;

		vm.menuList = vm.getMenuList() || [];
	}

	TabSettingCtrl.prototype.getMenuList = function() {
		var vm = this;
		var menu = [
			{
				label: 'Items To Checked Out',
				model: 'itemsCheckedOut',
				state: 'tab.settings.events',
				iconDefault: 'ion-log-out'
			},
			{
				label: 'Edit Profile',
				model: 'editProfile',
				state: 'setting-profile-edit',
				iconDefault: 'ion-person',
				iconAndroid: 'ion-android-person',
				iconIos: 'ion-ios-person'
			},
			{
				label: 'Change Password',
				model: 'changePassword',
				state: 'setting-profile-changepassword',
				iconDefault: 'ion-locked',
				iconAndroid: 'ion-android-lock',
				iconIos: 'ion-ios-locked'
			},
			{
				label: 'Log out',
				model: 'logout',
				iconDefault: 'ion-android-exit'
			}
		];
		ng.forEach(menu, (val) => {
			if (vm.platform === 'android') {
				val.icon = ('iconAndroid' in val) ? val.iconAndroid : val.iconDefault;
			} else if (vm.platform === 'ios') {
				val.icon = ('iconIos' in val) ? val.iconIos : val.iconDefault;
			} else {
				val.icon = val.iconDefault;
			}
		});
		return menu;
	};

	TabSettingCtrl.prototype.handleItemClicked = function(menu) {
		var vm = this;
		if (menu.model === 'logout') {
			vm.$rootScope.$broadcast('loading:show');
			vm.User.logout()
				.then(() => vm.$state.go('login'))
				.catch((err) => console.log('logout error:', err))
				.finally(() => vm.$rootScope.$broadcast('loading:hide'))
			;
		} else {
			if (!!menu.state) { vm.$state.go(menu.state); }
		}
	};
})(angular);
