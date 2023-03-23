window.wait = function (first) {
	return new(function () {
		var self = this;
		var callback = function () {
			var args;
			if (self.deferred.length) {
				args = [].slice.call(arguments);
				args.unshift(callback);
				self.deferred[0].apply(self, args);

				self.deferred.shift();
			}
		}
		this.deferred = [];

		this.wait = function (run) {
			this.deferred.push(run);

			return self;
		}

		first(callback);
	});
}