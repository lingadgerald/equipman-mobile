(function (ng) {
	'use strict';

	ng.module('services').factory('Item', Item);

	Item.$inject = [];
	function Item() {
		var items = [
			{id: 0, title: 'Guitar', description: 'Acoustic Guitar'},
			{id: 1, title: 'Ukelele', description: 'Brand New Ukelele'},
			{id: 2, title: 'Piano', description: 'Keyboard/Organ'},
			{id: 3, title: 'Flute', description: 'White Flute'},
			{id: 4, title: 'Mic', description: 'Cordless Mic'}
		];
		
		return {
			all: function() {
				return items;
			},
			get: function(itemId) {
				return items.find(function(item) {
					return item.id === parseInt(itemId);
				});
			}
		};
	}
})(angular);
