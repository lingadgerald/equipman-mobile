(function (ng) {
	'use strict';

	ng.module('controllers').controller('ItemDetailsCtrl', ItemDetailsCtrl);

	ItemDetailsCtrl.$inject = [
		'$ionicPopup',
		'$rootScope',
		'$stateParams',
		'$scope',
		'Ministry',
		'Item'
	];
	function ItemDetailsCtrl(
		$ionicPopup,
		$rootScope,
		$stateParams,
		$scope,
		Ministry,
		Item
	) {
		var vm = this;
		vm.$ionicPopup = $ionicPopup;
		vm.$rootScope = $rootScope;
		vm.$stateParams = $stateParams;
		vm.$scope = $scope;
		vm.Ministry = Ministry;
		vm.Item = Item;

		vm.item = {};
		vm.fields = [];
		vm.conditions = {
			loadRelations: 'ministry,ownerMinistry,ownerMember'
		}

		vm.init(vm);
	}

	ItemDetailsCtrl.prototype.init = function(vm) {
		vm.$rootScope.$broadcast('loading:show');
		vm.Item.get(vm.$stateParams.itemId, vm.conditions).then((res) => {
			vm.item = res;
			vm.fields = vm.getFormFields(res);
		}).catch((err) => {
			vm.$ionicPopup.alert({
				title: 'Something went wrong!',
				template: 'Please try again later'
			});
		}).finally(() => {
			vm.$rootScope.$broadcast('loading:hide');
		});
	};

	ItemDetailsCtrl.prototype.getFormFields = function(item) {
		var owner = null, ministry = null;
		if (item.ownerVal === 'ministry' && item.ownerMinistry != null) {
			owner = item.ownerMinistry.name;
		} else if (item.ownerVal === 'member' && item.ownerMember != null) {
			owner = item.ownerMember.name;
		}

		if (item.ministry != null) { ministry = item.ministry.name; }

		return [
			{label: 'Name', value: item.name},
			{label: 'Item Id', value: item.itemId},
			{label: 'Ministry', value: ministry},
			{label: 'Owner', value: owner},
			{label: 'Condition', value: item.condition},
			{label: 'Description', value: item.description},
		];
	};

	ItemDetailsCtrl.prototype.getFormFields1 = function() {
		return [{
			key: 'name',
			type: 'stacked-input',
			templateOptions: {
				type: 'text',
				label: 'Name',
				placeholder: 'Name',
				required: true
			},
			expressionProperties: {
				'templateOptions.disabled': 'formState.readOnly'
			}
		}, {
			key: 'itemId',
			type: 'stacked-input',
			templateOptions: {
				type: 'text',
				label: 'Item Id',
				placeholder: 'Item Id'
			},
			expressionProperties: {
				'templateOptions.disabled': 'formState.readOnly'
			}
		}, {
			key: 'condition',
			type: 'stacked-input',
			templateOptions: {
				type: 'text',
				label: 'Condition',
				placeholder: 'Condition'
			},
			expressionProperties: {
				'templateOptions.disabled': 'formState.readOnly'
			}
		}, {
			key: 'description',
			type: 'stacked-input',
			templateOptions: {
				type: 'text',
				label: 'Description',
				placeholder: 'Description'
			},
			expressionProperties: {
				'templateOptions.disabled': 'formState.readOnly'
			}
		}];
	};

	ItemDetailsCtrl.prototype.getItemHeight = function(item, index) {
		return 75;
	};

	ItemDetailsCtrl.prototype.handleOnRefresh = function() {
		console.log('handleOnRefresh');
		var vm = this;
		vm.Item.get(vm.$stateParams.itemId, vm.conditions).then((res) => {
			vm.item = res;
		}).catch((err) => {
			vm.$ionicPopup.alert({
				title: 'Something went wrong!',
				template: 'Please try again later'
			});
		}).finally(() => {
			vm.$scope.$broadcast('scroll.refreshComplete');
		});
	};

	ItemDetailsCtrl.prototype.handleOptionGetter = function(option) {
		var vm = this;
		return option.model + ' ' + (!vm.sortReversed ? 'asc' : 'desc');
	};
})(angular);
