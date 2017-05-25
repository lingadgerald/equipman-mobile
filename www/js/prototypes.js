(function () {
	'use strict';

	String.prototype.capitalize = function(lower) {
		return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, (a) => { return a.toUpperCase(); });
	};

	String.prototype.underscoreless = function() {
		return this.replace(/_/g, ' ');
	};

	String.prototype.underscore = function() {
		return this.replace(/ /g, '_');
	};

	String.prototype.splice = function(idx, rem, str) {
		return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
	};

	String.prototype.pluralize = function(count, plural) {
		if (!plural) { plural = this + 's'; }
		return (count === 1) ? this : plural;
	};

	String.prototype.camelize = function() {
		var self = this;
		self = self.replace(/[\-_\s]+(.)?/g, (match, chr) => {
			return chr ? chr.toUpperCase() : '';
		});
		return self.replace(/^([A-Z])/, (match, chr) => {
			return chr ? chr.toLowerCase() : '';
		});
	};

	String.prototype.format = function() {
		var str = this.toString();
    if (!arguments.length) { return str; }
    var args = typeof arguments[0];
    args = (('string' === args || 'number' === args) ? arguments : arguments[0]);
    for (var arg in args) {
      str = str.replace(new RegExp('\\{' + arg + '\\}', 'gi'), args[arg]);
    }
    return str;
	};

})();
