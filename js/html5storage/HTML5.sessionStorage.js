if (typeof HTML5 == 'undefined') {
	var HTML5 = {};
}
/**
 * Wrapper class to deal with easily storing values in session storage
 * without having to constantly use JSON.parse and JSON.stringify everywhere
 * you want to save an object.
 *
 * @param {String} index the base index to use in the localStorage global object
 * @author Tom Chapman
 */
HTML5.sessionStorage = function(index)
{
	/**
	 * @type {Mixed}
	 * @private
	 */
	var sessionValues;

	/**
	 * @type {String}
	 * @private
	 */
	var sessionIndex;

	/**
	 * Class level constructor
	 *
	 * @constructor
	 * @param {String} index
	 * @private
	 */
	var __init = function(index) {
		if (typeof index != 'string' || index === null) {
			throw new Error('A string index must be provided to HTML5.sessionStorage');
		}
		sessionIndex = index;
		var currentLocalValue = sessionStorage.getItem(index);
		if (typeof currentLocalValue != 'undefined' && currentLocalValue !== null) {
			try {
				sessionValues = JSON.parse(currentLocalValue);
			} catch (err) {
				sessionValues = currentLocalValue;
			}
		} else {
			sessionValues = {};
		}
	}(index);

	return {

		/**
		 * Returns all vars or index from the sessionValues
		 *
		 * @param {String} [index] the index inside the object in use
		 * @return {Mixed}
		 */
		get: function(index) {
			return (typeof index == 'undefined')
					? sessionValues
					: ((typeof sessionValues[index] != 'undefined')
							? sessionValues[index]
							: null);
		},

		/**
		 * Set sessionValues or an index in sessionValues
		 *
		 * @param {Mixed} value the value to assign to the object, or if index provided the index inside the object
		 * @param {String} [index] the index inside the object in use
		 * @return {Mixed}
		 */
		set: function(value, index) {
			if (typeof index == 'undefined' || index === null) {
				sessionValues = value;
			} else {
				if (typeof sessionValues != 'object') {
					throw new Error();
				}
				sessionValues[index] = value;
			}
			sessionStorage.setItem(sessionIndex, (typeof sessionValues != 'string' && typeof sessionValues != 'number')
													? JSON.stringify(sessionValues)
													: sessionValues);
		},

		/**
		 * Removes either the whole object from the sessionStorage or the index provided
		 *
		 * @param {String} [index] the index inside the object in use
		 */
		remove: function(index) {
			if (typeof index == 'undefined') {
				sessionStorage.removeItem(sessionIndex);
			} else if (typeof sessionValues[index] != 'undefined') {
				delete sessionValues[index];
				sessionStorage.setItem(sessionIndex, (typeof sessionValues != 'string' && typeof sessionValues != 'number')
													? JSON.stringify(sessionValues)
													: sessionValues);
			}
		}
	};
};

/*
How to Use:
	HTML5.sessionStorage('username').set('Anoxy');
	HTML5.sessionStorage('username').get()
	
	console.log( HTML5.sessionStorage('username').get() ); -> Outputs Anoxy
	HTML5.sessionStorage('username').remove();
	console.log( HTML5.sessionStorage('username').get() ); -> Outputs ''
	
*/