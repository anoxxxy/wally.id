if (typeof HTML5 == 'undefined') {
	var HTML5 = {};
}
/**
 * Wrapper class to deal with easily storing values in local storage
 * without having to constantly use JSON.parse and JSON.stringify everywhere
 * you want to save an object.
 *
 * @param {String} index the base index to use in the localStorage global object
 * @author Tom Chapman
 */
HTML5.localStorage = function(index)
{
	/**
	 * @type {Mixed}
	 * @private
	 */
	var localValues;

	/**
	 * @type {String}
	 * @private
	 */
	var localIndex;

	/**
	 * Class level constructor
	 *
	 * @constructor
	 * @param {String} index
	 * @private
	 */
	var __init = function(index) {
		if (typeof index != 'string' || index === null) {
			throw new Error('A string index must be provided to HTML5.localStorage');
		}
		localIndex = index;
		var currentLocalValue = localStorage.getItem(index);
		if (typeof currentLocalValue != 'undefined' && currentLocalValue !== null) {
			try {
				localValues = JSON.parse(currentLocalValue);
			} catch (err) {
				localValues = currentLocalValue;
			}
		} else {
			localValues = {};
		}
	}(index);

	return {
		/**
		 * Returns all vars or index from the localValues
		 *
		 * @param {String} [index] the index inside the object in use
		 * @return {Mixed}
		 */
		get: function(index) {
			return (typeof index == 'undefined')
					? localValues
					: ((typeof localValues[index] != 'undefined')
							? localValues[index]
							: null);
		},

		/**
		 * Set localValues or an index in localValues
		 *
		 * @param {Mixed} value the value to assign to the object, or if index provided the index inside the object
		 * @param {String} [index] the index inside the object in use
		 * @return {Mixed}
		 */
		set: function(value, index) {
			if (typeof index == 'undefined' || index === null) {
				localValues = value;
			} else {
				if (typeof localValues != 'object') {
					throw new Error();
				}
				localValues[index] = value;
			}
			localStorage.setItem(localIndex, (typeof localValues != 'string' && typeof localValues != 'number')
													? JSON.stringify(localValues)
													: localValues);
		},

		/**
		 * Removes either the whole object from the localStorage or the index provided
		 *
		 * @param {String} [index] the index inside the object in use
		 */
		remove: function(index) {
			if (typeof index == 'undefined') {
				localStorage.removeItem(localIndex);
			} else if (typeof localValues[index] != 'undefined') {
				delete localValues[index];
				localStorage.setItem(localIndex, (typeof localValues != 'string' && typeof localValues != 'number')
													? JSON.stringify(localValues)
													: localValues);
			}
		}
	};
};

/*
How to Use:
	HTML5.localStorage('username').set('Anoxy');
	HTML5.localStorage('username').get()
	
	console.log( HTML5.localStorage('username').get() ); -> Outputs Anoxy
	HTML5.localStorage('username').remove();
	console.log( HTML5.localStorage('username').get() ); -> Outputs ''
	
*/