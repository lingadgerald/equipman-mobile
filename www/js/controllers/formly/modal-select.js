(function (ng) {
	'use strict';

	ng.module('controllers').controller('ModalSelectCtrl', ModalSelectCtrl);

	ModalSelectCtrl.$inject = ['$ionicPopup', '$scope', 'User'];
	function ModalSelectCtrl($ionicPopup, $scope, User) {
		var vm = this;
		vm.$ionicPopup = $ionicPopup;
		vm.User = User;
		vm.options = $scope.options;
		vm.to = $scope.to;
		vm.model = $scope.model;
		vm.formState = $scope.formState;

		if (!!vm.to.optionProperties) {
			if (vm.to.optionProperties.conditions == null) {
				vm.to.optionProperties.conditions = {};
			}
			vm.to.optionProperties.conditions.pageSize = 0;
			vm.to.optionProperties.conditions.offset = 0;
		}

		vm.loadMoreData = true;

		if (!!vm.to.optionProperties) {
			vm.to.options.splice(0, vm.to.options.length);
			vm.getData();
		}
	}

	ModalSelectCtrl.prototype.getData = function() {
		var vm = this;
		var op = vm.to.optionProperties;
		vm.User.getTable(op.resource, op.conditions).then((res) => {
			ng.forEach(res.data, (val) => {
				vm.to.options.push({
					name: val.name,
					value: {___class: val.___class, objectId: val.objectId}
				});
			});
			if (res.totalObjects !== vm.to.options.length) {
				op.conditions.pageSize = op.conditions.pageSize + 10;
				op.conditions.offset = 10;
			} else {
				vm.loadMoreData = false;
			}
		}).catch((err) => {
			vm.$ionicPopup.alert({
				title: 'Something went wrong!',
				template: 'Please try again later'
			});
			vm.loadMoreData = false;
		}).finally(() => {
			vm.$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	ModalSelectCtrl.prototype.getLabel = function() {
		var vm = this, label = '';
		var model = vm.model, options = vm.options, to = vm.to;
		if (to.options.length > 0) {
			ng.forEach(to.options, (obj) => {
				if (ng.equals(obj[to.valueProp || 'value'], model[options.key])) {
					label = obj[to.labelProp || 'name'];
				}
			});
		}
		return label;
	};
})(angular);
