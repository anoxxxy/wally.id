/*
 * sessionStorage
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
 * forked from: https://gist.github.com/966030
 * modified by @anoxxxy
 */

var ss = function(
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
ss.set('meo', {'kalle': 'banan'})
ss.get('meo')
-->object

ss.set('wally.group', 'hejsan')
ss.set('wally.group')
-->string

ss.set('wally.group', ['1', '2']) 
ss.get('wally.group')
-->array

ss.remove('wally.group')
-->remove an item

ss.clear()
-->clear all sessionstorage

**/


var sl = function(
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