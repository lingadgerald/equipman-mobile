(function (ng) {
	'use strict';

	ng.module('controllers').controller('ItemsCtrl', ItemsCtrl);

	ItemsCtrl.$inject = [
		'$ionicPopup',
		'$rootScope',
		'$stateParams',
		'$scope',
		'Ministry',
		'Item'
	];
	function ItemsCtrl(
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

		vm.ministry = {};
		vm.list = [];
		vm.loadMoreData = false;
		vm.sortReversed = false;
		vm.conditions = {
			pageSize: 0,
			offset: 0,
			where: 'deleted is null and ministry.objectId = \'' + $stateParams.ministryId + '\'',
			sortBy: 'created desc',
			loadRelations: 'ministry,ownerMinistry,ownerMember'
		};
		vm.sortItems = [
			{title: 'Default', model: 'created'},
			{title: 'Item Id', model: 'itemId'},
			{title: 'Name', model: 'name'},
			{title: 'Condition', model: 'condition'},
			{title: 'Description', model: 'description'}
		];

		vm.init(vm);
	}

	ItemsCtrl.prototype.init = function(vm) {
		vm.$rootScope.$broadcast('loading:show');
		vm.Ministry.get(vm.$stateParams.ministryId).then((res) => {
			vm.ministry = res;
			vm.loadMoreData = true;
		}).catch((err) => {
			vm.$ionicPopup.alert({
				title: 'Something went wrong!',
				template: 'Please try again later'
			});
		}).finally(() => {
			vm.$rootScope.$broadcast('loading:hide');
		});
	};

	ItemsCtrl.prototype.getItemHeight = function(item, index) {
		return 75;
	};

	ItemsCtrl.prototype.handleOnRefresh = function() {
		console.log('handleOnRefresh');
		var vm = this;
		vm.loadMoreData = true;
		vm.conditions.pageSize = 0;
		vm.conditions.offset = 0;
		vm.Item.all(vm.conditions).then((res) => {
			vm.conditions.pageSize = vm.conditions.pageSize + 10;
			vm.conditions.offset = 10;
			vm.list.splice(0, vm.list.length);
			ng.forEach(res.data, (val) => vm.list.push(val));
			if (res.totalObjects === vm.list.length) {
				vm.loadMoreData = false;
			}
		}).catch((err) => {
			vm.$ionicPopup.alert({
				title: 'Something went wrong!',
				template: 'Please try again later'
			}).then(() => vm.loadMoreData = false);
		}).finally(() => {
			vm.$scope.$broadcast('scroll.refreshComplete');
		});
	};

	ItemsCtrl.prototype.handleOnInfiniteScroll = function() {
		console.log('handleOnInfiniteScroll');
		var vm = this;
		vm.Item.all(vm.conditions).then((res) => {
			ng.forEach(res.data, (val) => vm.list.push(val));
			if (res.totalObjects !== vm.list.length) {
				vm.conditions.pageSize = vm.conditions.pageSize + 10;
				vm.conditions.offset = 10;
			} else {
				vm.loadMoreData = false;
			}
		}).catch((err) => {
			vm.$ionicPopup.alert({
				title: 'Something went wrong!',
				template: 'Please try again later'
			}).then(() => vm.loadMoreData = false);
		}).finally(() => {
			vm.$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	ItemsCtrl.prototype.handleOptionGetter = function(option) {
		var vm = this;
		return option.model + ' ' + (!vm.sortReversed ? 'asc' : 'desc');
	};

	ItemsCtrl.prototype.handleOnSort = function() {
		var vm = this;
		vm.sortReversed = !vm.sortReversed;
		vm.conditions.pageSize = 0;
		vm.conditions.offset = 0;
		vm.list.splice(0, vm.list.length);
		vm.loadMoreData = true;
	};
})(angular);
