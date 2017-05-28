(function (ng) {
	'use strict';

	ng.module('controllers').controller('SettingsItemCtrl', SettingsItemCtrl);

	SettingsItemCtrl.$inject = [
		'$rootScope',
		'$stateParams',
		'$scope',
		'User',
		'Event',
		'Item'
	];
	function SettingsItemCtrl(
		$rootScope,
		$stateParams,
		$scope,
		User,
		Event,
		Item
	) {
		var vm = this;
		vm.$rootScope = $rootScope;
		vm.$stateParams = $stateParams;
		vm.$scope = $scope;
		vm.User = User;
		vm.Event = Event;
		vm.Item = Item;

		vm.currentUser = User.currentUser();
		vm.event = {};
		vm.list = [];
		vm.loadMoreData = false;
		vm.sortReversed = false;
		vm.sortBy = '-created';
		vm.conditions = {
			pageSize: 0,
			offset: 0,
			where: 'deleted is null',
			sortBy: 'created desc',
			loadRelations: [
				'items',
				'items.ministry',
				'items.ownerMinistry',
				'items.ownerMember',
				'items.logs',
				'items.checkedInBy',
				'items.checkedOutBy'
			].join(',')
		};
		vm.sortItems = [
			{title: 'Default', model: 'created'},
			{title: 'Item Id', model: 'itemId'},
			{title: 'Name', model: 'name'}
		];
		vm.init(vm);
	}

	SettingsItemCtrl.prototype.init = function(vm) {
		vm.$rootScope.$broadcast('loading:show');
		vm.Event.get(vm.$stateParams.eventId, vm.conditions).then((res) => {
			vm.event = res;
			vm.loadMoreData = true;
		}).catch((err) => {
			vm.$rootScope.$broadcast('alert-error:show');
			vm.loadMoreData = false;
		}).finally(() => {
			vm.$rootScope.$broadcast('loading:hide');
		});
	};

	SettingsItemCtrl.prototype.getItemHeight = function(item, index) {
		return 75;
	};

	SettingsItemCtrl.prototype.getOwnerName = function(item) {
		var vm = this, owner = null;
		if (item.ownerVal === 'ministry' && item.ownerMinistry != null) {
			owner = item.ownerMinistry.name;
		} else if (item.ownerVal === 'member' && item.ownerMember != null) {
			owner = item.ownerMember.name;
		}
		return owner;
	};

	SettingsItemCtrl.prototype.getItemLog = function(item) {
		var vm = this;
		return item.logs.find((val) => val.event === vm.event.code) || {};
	};

	SettingsItemCtrl.prototype.handleOnRefresh = function() {
		console.log('handleOnRefresh');
		var vm = this;
		vm.conditions.pageSize = 0;
		vm.conditions.offset = 0;
		vm.Event.get(vm.$stateParams.eventId, vm.conditions).then((res) => {
			vm.event = res;
			return vm.Ministry.get(vm.$stateParams.ministryId);
		}).then((res) => {
			vm.ministry = res;
			vm.list.splice(0, vm.list.length);
			vm.loadMoreData = true;
		}).catch((err) => {
			vm.$rootScope.$broadcast('alert-error:show');
			vm.loadMoreData = false;
		}).finally(() => {
			vm.$scope.$broadcast('scroll.refreshComplete');
		});
	};

	SettingsItemCtrl.prototype.handleOnInfiniteScroll = function() {
		console.log('handleOnInfiniteScroll');
		var vm = this;
		ng.forEach(vm.event.items, (val) => {
			var log = val.logs.find((val) => val.event === vm.event.code) || {};
			if (log.checkedOutEmail === vm.currentUser.email) {
				vm.list.push(val);
			}
		});
		vm.loadMoreData = false;
	};

	SettingsItemCtrl.prototype.handleOptionGetter = function(option) {
		var vm = this;
		return (!vm.sortReversed ? '' : '-') + option.model;
	};

	SettingsItemCtrl.prototype.handleOnSort = function() {
		var vm = this;
		vm.sortReversed = !vm.sortReversed;
	};

	SettingsItemCtrl.prototype.handleOnSwipe = function(ev, item) {
		var vm = this;
		switch (ev.gesture.direction) {
			case 'left':
				vm.swipeLeftAction(item);
				break;
			case 'right':
				vm.swipeRightAction(item);
				break;
			default: break;
		}
	};

	SettingsItemCtrl.prototype.swipeLeftAction = function(item) {
		var vm = this;
		var message = '';
		var model = {objectId: item.objectId};
		var logAction = 'put';
		var conditions = {expired: false, log: false};
		var itemLog = ng.copy(item.logs.find((val) => val.event === vm.event.code)) || {};
		var tomorrow = new Date(vm.event.eventDate);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(tomorrow.getHours() + 12);
		vm.$rootScope.$broadcast('loading:show');

		if (!itemLog.confirm) {
			conditions.expired = tomorrow > new Date();
			conditions.log = !itemLog.confirm;
			model.__meta = item.__meta;
			model.checkedOutBy = null;
			model.checkedOutAt = null;
			itemLog.checkedOutBy = null;
			itemLog.checkedOutAt = null;
			itemLog.checkedOutEmail = null;
		}

		if (conditions.expired, conditions.log) {
			vm.User.save('data.item_log@' + logAction, itemLog).then((res) => {
				if (logAction === 'post') { model.logs = [res]; }
				return vm.User.save('data.item@put', model);
			}).then((res) => {
				message = 'You declined to check out item ' + res.name;
				return vm.Event.get(vm.$stateParams.eventId, vm.conditions);
			}).then((res) => {
				vm.event = res;
				vm.list.splice(0, vm.list.length);
				vm.loadMoreData = true;
			}).catch((err) => {
				vm.$rootScope.$broadcast('alert-error:show');
			}).finally(() => {
				vm.$rootScope.$broadcast('loading:hide');
				vm.$rootScope.$broadcast('toast:show', {message: message})
			});
		} else {
			vm.$rootScope.$broadcast('loading:hide');
			if (!conditions.log) {
				message = 'Cannot move back checked out items';
			} else if (!conditions.expired) {
				message = 'Expired checking of items for this event';
			}
			vm.$rootScope.$broadcast('toast:show', {message: message})
		}
	};

	SettingsItemCtrl.prototype.swipeRightAction = function(item) {
		var vm = this;
		var message = '';
		var model = {objectId: item.objectId};
		var logAction = 'put';
		var conditions = {expired: false, log: false};
		var itemLog = ng.copy(item.logs.find((val) => val.event === vm.event.code)) || {};
		var tomorrow = new Date(vm.event.eventDate);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(tomorrow.getHours() + 12);
		vm.$rootScope.$broadcast('loading:show');

		if (!itemLog.confirm) {
			conditions.expired = tomorrow > new Date();
			conditions.log = !itemLog.confirm;
			model.__meta = item.__meta;
			model.checkedOutAt = new Date();
			itemLog.confirm = true;
			itemLog.checkedOutAt = model.checkedOutAt;
		}

		if (conditions.expired) {
			vm.User.save('data.item_log@' + logAction, itemLog).then((res) => {
				if (logAction === 'post') { model.logs = [res]; }
				return vm.User.save('data.item@put', model);
			}).then((res) => {
				message = 'You checked out item ' + res.name;
				return vm.Event.get(vm.$stateParams.eventId, vm.conditions);
			}).then((res) => {
				vm.event = res;
				vm.list.splice(0, vm.list.length);
				vm.loadMoreData = true;
			}).catch((err) => {
				vm.$rootScope.$broadcast('alert-error:show');
			}).finally(() => {
				vm.$rootScope.$broadcast('loading:hide');
				vm.$rootScope.$broadcast('toast:show', {message: message})
			});
		} else {
			vm.$rootScope.$broadcast('loading:hide');
			if (!conditions.log) {
				message = 'Item is already checked out';
			} else if (!conditions.expired) {
				message = 'Expired checking of items for this event';
			}
			vm.$rootScope.$broadcast('toast:show', {message: message})
		}
	};
})(angular);
