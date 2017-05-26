(function (ng) {
	'use strict';

	ng.module('controllers').controller('CheckedItemsCtrl', CheckedItemsCtrl);

	CheckedItemsCtrl.$inject = [
		'$ionicPopup',
		'$rootScope',
		'$stateParams',
		'$scope',
		'Event',
		'Ministry',
		'Item'
	];
	function CheckedItemsCtrl(
		$ionicPopup,
		$rootScope,
		$stateParams,
		$scope,
		Event,
		Ministry,
		Item
	) {
		var vm = this;
		vm.$ionicPopup = $ionicPopup;
		vm.$rootScope = $rootScope;
		vm.$stateParams = $stateParams;
		vm.$scope = $scope;
		vm.Event = Event;
		vm.Ministry = Ministry;
		vm.Item = Item;
		
		vm.check = 'in';
		vm.event = {};
		vm.ministry = {};
		vm.list = [];
		vm.loadMoreData = false;
		vm.sortReversed = false;
		vm.conditions = {
			pageSize: 0,
			offset: 0,
			where: 'deleted is null',
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

	CheckedItemsCtrl.prototype.init = function(vm) {
		vm.$rootScope.$broadcast('loading:show');
		vm.Event.get(vm.$stateParams.eventId).then((res) => {
			vm.event = res;
			return vm.Ministry.get(vm.$stateParams.ministryId);
		}).then((res) => {
			vm.ministry = res;
			// vm.conditions.where = vm.conditions.where + ' and eventId = \'' + vm.$stateParams.eventId + '\'';
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

	CheckedItemsCtrl.prototype.getItemHeight = function(item, index) {
		return 75;
	};

	CheckedItemsCtrl.prototype.getOwnerName = function(item) {
		var vm = this, owner = null;
		if (item.ownerVal === 'ministry' && item.ownerMinistry != null) {
			owner = item.ownerMinistry.name;
		} else if (item.ownerVal === 'member' && item.ownerMember != null) {
			owner = item.ownerMember.name;
		}
		return owner;
	};

	CheckedItemsCtrl.prototype.handleOnRefresh = function() {
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
			});
			vm.loadMoreData = false;
		}).finally(() => {
			vm.$scope.$broadcast('scroll.refreshComplete');
		});
	};

	CheckedItemsCtrl.prototype.handleOnInfiniteScroll = function() {
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
			});
			vm.loadMoreData = false;
		}).finally(() => {
			vm.$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	CheckedItemsCtrl.prototype.handleOptionGetter = function(option) {
		var vm = this;
		return option.model + ' ' + (!vm.sortReversed ? 'asc' : 'desc');
	};

	CheckedItemsCtrl.prototype.handleOnSort = function() {
		var vm = this;
		vm.sortReversed = !vm.sortReversed;
		vm.conditions.pageSize = 0;
		vm.conditions.offset = 0;
		vm.list.splice(0, vm.list.length);
		vm.loadMoreData = true;
	};

	CheckedItemsCtrl.prototype.handleOnChangeCheck = function(action) {
		var vm = this;
		vm.check = action;
		vm.list.splice(0, vm.list.length);
		vm.loadMoreData = true;
	};

	CheckedItemsCtrl.prototype.handleOnSwipe = function(ev, action, item) {
		var vm = this;
		switch (ev.gesture.direction) {
			case 'left':
				vm.swipeLeftAction(action, item);
				break;
			case 'right':
				vm.swipeRightAction(action, item);
				break;
			default: break;
		}
	};

	CheckedItemsCtrl.prototype.swipeLeftAction = function(action, item) {
		var vm = this;
		switch (action) {
			case 'in':
				console.log(item.name + ' swipe left no action');
				break;
			case 'out':
				console.log(item.name + ' is moved back to check in');
				break;
			default: break;
		}
	};

	CheckedItemsCtrl.prototype.swipeRightAction = function(action, item) {
		var vm = this;
		switch (action) {
			case 'in':
				console.log(item.name + ' request to checked out');
				break;
			case 'out':
				console.log(item.name + ' is checked out');
				break;
			default: break;
		}
	};
})(angular);
