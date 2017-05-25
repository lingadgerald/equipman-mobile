(function (ng) {
	'use strict';

	ng.module('controllers').controller('TabSettingCtrl', TabSettingCtrl);

	TabSettingCtrl.$inject = ['$ionicPopup', '$rootScope', '$state', 'SettingsData', 'User'];
	function TabSettingCtrl($ionicPopup, $rootScope, $state, SettingsData, User) {
		var vm = this, settingsData = SettingsData;
		vm.$ionicPopup = $ionicPopup;
		vm.$rootScope = $rootScope;
		vm.$state = $state;
		vm.User = User;

		vm.menuList = settingsData.profileMenu || [];
	}

	TabSettingCtrl.prototype.handleItemClicked = function(menu) {
		var vm = this;
		if (menu.model === 'logout') {
			vm.$rootScope.$broadcast('loading:show');
			vm.User.logout()
				.then(() => vm.$state.go('login'))
				.catch((err) => console.log('logout error:', error))
				.finally(() => vm.$rootScope.$broadcast('loading:hide'))
			;
		} else {
			if (!!menu.state) { vm.$state.go(menu.state); }
		}
	};
})(angular);
