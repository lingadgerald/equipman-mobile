(function (ng) {
	'use strict';

	ng.module('controllers').controller('LoginCtrl', LoginCtrl);

	LoginCtrl.$inject = [
		'$ionicPopup',
		'$rootScope',
		'$state',
		'LoginData',
		'User',
		'MainService'
	];
	function LoginCtrl(
		$ionicPopup,
		$rootScope,
		$state,
		LoginData,
		User,
		MainService
	) {
		var vm = this, loginData = LoginData;
		vm.$ionicPopup = $ionicPopup;
		vm.$rootScope = $rootScope;
		vm.$state = $state;
		vm.User = User;
		vm.MainService = MainService;

		vm.model = {};
		vm.fields = loginData.fields || [];
		vm.options = {};
		vm.isLoading = false;
	}

	LoginCtrl.prototype.handleLogin = function() {
		var vm = this;
		vm.isLoading = true;
		vm.$rootScope.$broadcast('loading:show');

		vm.User.login(vm.model).then((res) => {
			if (res.username !== 'admin') {
				Object.keys(vm.model).forEach((key) => { delete vm.model[key]; });
				vm.$state.go('tab.events');
			} else {
				vm.User.logout().then(() => {
					vm.$ionicPopup.alert({
						title 	: 'Login failed!',
						template: '{login} is not a member'.format(vm.model)
					}).then(() => vm.model.password = null);
				});
			}
		}).catch((err) => {
			vm.$ionicPopup.alert({
				title 	: 'Login failed!',
				template: err.message
			}).then(() => vm.model.password = null);
		}).finally(() => {
			vm.isLoading = false;
			vm.$rootScope.$broadcast('loading:hide');
		});
	};
})(angular);
