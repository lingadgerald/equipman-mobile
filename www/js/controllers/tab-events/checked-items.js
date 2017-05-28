(function (ng) {
	'use strict';

	ng.module('controllers').controller('CheckedItemsCtrl', CheckedItemsCtrl);

	CheckedItemsCtrl.$inject = [
		'$rootScope',
		'$localStorage',
		'$stateParams',
		'$scope',
		'User',
		'Event',
		'Ministry',
		'Item'
	];
	function CheckedItemsCtrl(
		$rootScope,
		$localStorage,
		$stateParams,
		$scope,
		User,
		Event,
		Ministry,
		Item
	) {
		var vm = this;
		vm.platform = ionic.Platform.platform();
		vm.$rootScope = $rootScope;
		vm.$localStorage = $localStorage;
		vm.$stateParams = $stateParams;
		vm.$scope = $scope;
		vm.User = User;
		vm.Event = Event;
		vm.Ministry = Ministry;
		vm.Item = Item;

		vm.lsEventItems = null;
		vm.currentUser = User.currentUser();
		vm.check = 'in';
		vm.event = {};
		vm.ministry = {};
		vm.list = [];
		vm.loadMoreData = false;
		vm.sortReversed = false;
		vm.sortBy = '-created';
		vm.sendBy = null;
		vm.userBy = null;
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
		vm.userItems = [];
		vm.assignedMember = {name: 'You'};
		vm.init(vm);
	}

	CheckedItemsCtrl.prototype.init = function(vm) {
		vm.$rootScope.$broadcast('loading:show');
		vm.Event.get(vm.$stateParams.eventId, vm.conditions).then((res) => {
			vm.event = res;
			vm.lsEventItems = vm.$localStorage[vm.event.code];
			return vm.Ministry.get(vm.$stateParams.ministryId);
		}).then((res) => {
			vm.ministry = res;
			var where = 'deleted is null and objectId != \'{objectId}\''.format(vm.currentUser);
			return vm.User.all({where: where});
		}).then((res) => {
			vm.userItems = res.data;
			vm.loadMoreData = true;
		}).catch((err) => {
			vm.$rootScope.$broadcast('alert-error:show');
			vm.loadMoreData = false;
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

	CheckedItemsCtrl.prototype.getItemLog = function(item) {
		var vm = this;
		return item.logs.find((val) => val.event === vm.event.code) || {};
	};

	CheckedItemsCtrl.prototype.handleOnRefresh = function() {
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

	CheckedItemsCtrl.prototype.handleOnInfiniteScroll = function() {
		console.log('handleOnInfiniteScroll');
		var vm = this;
		ng.forEach(vm.event.items, (val) => {
			var log = val.logs.find((val) => val.event === vm.event.code) || {};
			if (val.ministry.code === vm.ministry.code) {
				if (vm.check === 'in' && (log.checkedInBy == null && log.checkedInAt == null)) {
					vm.list.push(val);
				} else if (vm.check === 'out' && 
					(log.checkedInBy != null && log.checkedInAt != null)
				) {
					vm.list.push(val);
				}
			}
		});
		vm.loadMoreData = false;
	};

	CheckedItemsCtrl.prototype.handleOptionGetter = function(option) {
		var vm = this;
		return (!vm.sortReversed ? '' : '-') + option.model;
	};

	CheckedItemsCtrl.prototype.handleOptionGetterUser = function(option) {
		var vm = this;
		return {
			___class: option.___class,
			objectId: option.objectId,
			name: option.name,
			email: option.email
		};
	};

	CheckedItemsCtrl.prototype.handleOnSort = function() {
		var vm = this;
		vm.sortReversed = !vm.sortReversed;
	};

	CheckedItemsCtrl.prototype.handleOnSend = function() {
		var vm = this;
		console.log(vm.sendBy);
	};

	CheckedItemsCtrl.prototype.handleOnAssignUser = function() {
		var vm = this;
		console.log(vm.userBy);
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
		var message = '';
		var model = {objectId: item.objectId};
		var logAction = 'put';
		var role = vm.currentUser.role;
		var conditions = {
			checked: false,
			expired: false,
			role 	 : false,
			log 	 : false
		};
		var itemLog = ng.copy(item.logs.find((val) => val.event === vm.event.code)) || {};
		var tomorrow = new Date(vm.event.eventDate);
		var logChecked = (!!itemLog.checkedOutBy && !!itemLog.checkedOutEmail && !!itemLog.checkedOutAt);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(tomorrow.getHours() + 12);
		vm.$rootScope.$broadcast('loading:show');

		switch (action) {
			case 'in':
				console.log(item.name + ' swipe left no action');
				break;
			case 'out':
				conditions.checked = vm.check === 'out';
				conditions.expired = tomorrow > new Date();
				conditions.role = (role.code === 'admin' || role.code === 'head');

				console.log(itemLog);
				if (!itemLog.confirm && !logChecked) {
					console.log(item.name + ' is moved back to check in');
					model.__meta = item.__meta;
					model.checkedInBy = null;
					model.checkedInAt = null;
					itemLog.checkedInAt = null;
					itemLog.checkedInBy = null;
					itemLog.checkedInEmail = null;

					conditions.log = !logChecked;
					message = ' was moved back to check in';
				} else if (!itemLog.confirm && logChecked) {
					console.log(item.name + ' cancelled check out');
					model.__meta = item.__meta;
					model.checkedOutBy = null;
					model.checkedOutAt = null;
					itemLog.checkedOutAt = null;
					itemLog.checkedOutBy = null;
					itemLog.checkedOutEmail = null;

					conditions.log = logChecked;
					message = ' cancelled check out';
				}
				
				console.log(conditions);
				break;
			default: break;
		}

		if (conditions.checked && conditions.role && conditions.log && conditions.expired) {
			console.log('SWIPE LEFT ACTION');
			vm.User.save('data.item_log@' + logAction, itemLog).then((res) => {
				if (logAction === 'post') { model.logs = [res]; }
				return vm.User.save('data.item@put', model);
			}).then((res) => {
				message = res.name + message;
				return vm.Event.get(vm.$stateParams.eventId, vm.conditions);
			}).then((res) => {
				vm.event = res;
				vm.list.splice(0, vm.list.length);
				vm.loadMoreData = true;
			}).catch((err) => {
				vm.$rootScope.$broadcast('alert-error:show');
			}).finally(() => {
				vm.$rootScope.$broadcast('loading:hide');
				vm.$rootScope.$broadcast('toast:show', {message: message});
			});
		} else {
			vm.$rootScope.$broadcast('loading:hide');
			if (conditions.checked && !conditions.role) {
				message = 'You have no permission to move items back to check in';
			} else if (conditions.checked && !conditions.log) {
				message = 'Cannot move back checked out items';
			} else if (conditions.checked && !conditions.expired) {
				message = 'Expired moving items back to check in';
			}
			vm.$rootScope.$broadcast('toast:show', {message: message});
		}
	};

	CheckedItemsCtrl.prototype.swipeRightAction = function(action, item) {
		var vm = this;
		var message = '';
		var model = {objectId: item.objectId};
		var logObj = {item: item.code, event: vm.event.code};
		var logAction = 'put';
		var role = vm.currentUser.role;
		var conditions = {
			checked: false,
			expired: false,
			role 	 : false,
			log 	 : false
		};
		var itemLog = ng.copy(item.logs.find((val) => val.event === vm.event.code)) || {};
		var tomorrow = new Date(vm.event.eventDate);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(tomorrow.getHours() + 12);
		vm.$rootScope.$broadcast('loading:show');

		if (ng.equals({}, itemLog)) {
			logAction = 'post';
			itemLog.name  = '{event}_{item}'.format(logObj);
			itemLog.code  = '{event}_{item}'.format(logObj);
			itemLog.event = '{event}'.format(logObj);
		}

		switch (action) {
			case 'in':
				console.log(item.name + ' request to checked out');
				model.checkedInBy = vm.currentUser;
				model.checkedInAt = Date.now();
				itemLog.checkedInBy = vm.currentUser.name;
				itemLog.checkedInAt = model.checkedInAt;
				itemLog.checkedInEmail = vm.currentUser.email;

				conditions.checked = vm.check === 'in';
				conditions.expired = tomorrow > new Date();
				conditions.role = (role.code === 'admin' || role.code === 'head');
				conditions.log = true;
				break;
			case 'out':
				console.log(item.name + ' is checked out');
				conditions.checked = vm.check === 'out';
				conditions.expired = tomorrow > new Date();
				conditions.role = true;
				conditions.log = (!itemLog.checkedOutBy && !itemLog.checkedOutEmail && !itemLog.checkedOutAt);

				model.checkedOutAt = Date.now();
				// itemLog.confirm = true;
				itemLog.checkedOutAt = model.checkedOutAt;
				itemLog.checkedOutUser = vm.currentUser;

				if (vm.userBy != null) {
					model.checkedOutBy = vm.userBy;
					itemLog.checkedOutBy = vm.userBy.name;
					itemLog.checkedOutEmail = vm.userBy.email;

					// Get items to perform email action
					if (vm.$localStorage[vm.event.code] == null) { vm.$localStorage[vm.event.code] = []; }
					var ls = vm.$localStorage[vm.event.code];
					var owner = null, mobile = null, email = null, lsData = {};

					if (item.ownerMember != null) {
						owner = item.ownerMember.name;
						email = item.ownerMember.email;
						mobile = item.ownerMember.mobile;
					} else if (item.ownerMinistry != null) {
						owner = item.ownerMinistry.name;
					}

					lsData.itemName = item.name;
					lsData.itemId = item.itemId;
					lsData.coName = itemLog.checkedOutBy;
					lsData.coEmail = itemLog.checkedOutEmail;

					if (owner != null) { lsData.name = owner; }
					if (email != null) { lsData.email = email; }
					if (mobile != null) { lsData.mobile = mobile; }

					ls.push(lsData);
					vm.$localStorage[vm.event.code] = ls;
					// -----
				} else {
					model.checkedOutBy = vm.currentUser;
					itemLog.checkedOutBy = vm.currentUser.name;
					itemLog.checkedOutEmail = vm.currentUser.email;
				}
				break;
			default: break;
		}

		if (conditions.checked && conditions.role && conditions.log && conditions.expired) {
			console.log('SWIPE RIGHT ACTION');
			vm.User.save('data.item_log@' + logAction, itemLog).then((res) => {
				if (logAction === 'post') { model.logs = [res]; }
				return vm.User.save('data.item@put', model);
			}).then((res) => {
				message = res.name + ' was checked ' + vm.check;
				return vm.Event.get(vm.$stateParams.eventId, vm.conditions);
			}).then((res) => {
				vm.event = res;
				vm.list.splice(0, vm.list.length);
				vm.loadMoreData = true;
			}).catch((err) => {
				vm.$rootScope.$broadcast('alert-error:show');
			}).finally(() => {
				vm.$rootScope.$broadcast('loading:hide');
				vm.$rootScope.$broadcast('toast:show', {message: message});
			});
		} else {
			vm.$rootScope.$broadcast('loading:hide');
			if (conditions.checked && !conditions.role) {
				message = 'You have no permission to checked ' + vm.check;
			} else if (conditions.checked && !conditions.log) {
				message = 'Item {name} is already checked out'.format(item);
			} else if (conditions.checked && !conditions.expired) {
				message = 'Expired checking ' + vm.check + ' of items for this event';
			}
			vm.$rootScope.$broadcast('toast:show', {message: message});
		}
	};
})(angular);
