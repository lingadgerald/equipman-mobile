(function (ng) {
	'use strict';

	ng.module('services').factory('Ministry', Ministry);

	Ministry.$inject = [];
	function Ministry() {
		var ministries = [
			{id: 0, title: 'Sample', description: 'Sample Ministry'},
			{id: 1, title: 'Music', description: 'Music Ministry'},
			{id: 2, title: 'Training', description: 'Training Ministry'}
		];
		
		return {
			all: function() {
				return ministries;
			},
			get: function(ministryId) {
				return ministries.find(function(ministry) {
					return ministry.id === parseInt(ministryId);
				});
			}
		};
	}
})(angular);
