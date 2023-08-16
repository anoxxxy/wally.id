/*
 * sessionStorage
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
 * forked from: https://gist.github.com/966030
 * modified by @anoxxxy
 */

const storage_s = function(
  a, // placeholder for storage object
  b  // placeholder for JSON
){
  return b
    ? {                 // if JSON is supported
      get: function(    // provide a getter function
        c               // that takes a key
      ){
        return a[c] &&  // and if the key exists
          b.parse(a[c]) // parses and returns it,
      },

      set: function(     // and a setter function
        c,               // that takes a key
        d                // and a value
      ){
        a[c] =           // and sets
          b.stringify(d) // its serialization.
      },
      remove: function(e){  // and a remover function
        a.removeItem(e)     // that takes a key and deletes it
      },
      clear: function(){    //and a clear function
        a.clear()           //that delete session totally!
      }
    }
    : {}                 // if JSON isn't supported, provide a shim.
}(
  this.sessionStorage // use native sessionStorage if available
  || {},            // or an object otherwise
  JSON              // use native JSON (required)
);

/**
 * 
storage_s.set('meo', {'kalle': 'banan'})
storage_s.get('meo')
-->object

storage_s.set('wally.group', 'hejsan')
storage_s.set('wally.group')
-->string

storage_s.set('wally.group', ['1', '2']) 
storage_s.get('wally.group')
-->array

storage_s.remove('wally.group')
-->remove an item

storage_s.clear()
-->clear all sessionstorage

**/


const storage_l = function(
  a, // placeholder for storage object
  b  // placeholder for JSON
){
  return b
    ? {                 // if JSON is supported
      get: function(    // provide a getter function
        c               // that takes a key
      ){
        return a[c] &&  // and if the key exists
          b.parse(a[c]) // parses and returns it,
      },

      set: function(     // and a setter function
        c,               // that takes a key
        d                // and a value
      ){
        a[c] =           // and sets
          b.stringify(d) // its serialization.
      },
      remove: function(e){  // and a remover function
        a.removeItem(e)     // that takes a key and deletes it
      },
      clear: function(){    //and a clear function
        a.clear()           //that delete session totally!
      }
    }
    : {}                 // if JSON isn't supported, provide a shim.
}(
  this.localStorage // use native localStorage if available
  || {},            // or an object otherwise
  JSON              // use native JSON (required)
);


/**
storage_l.set('meo', {'kalle': 'banan'})
storage_l.get('meo')
-->object

storage_l.set('wally.group', 'hejsan')
storage_l.set('wally.group')
-->string

storage_l.set('wally.group', ['1', '2']) 
storage_l.get('wally.group')
-->array

storage_l.remove('wally.group')
-->remove an item

storage_l.clear()
-->clear all sessionstorage

**/
