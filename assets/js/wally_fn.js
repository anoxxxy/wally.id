/*
 @ Developed by Anoxy for Wally.id
 * Custom Misc. Functions for Wally.id
*/

(function () {

  var wally_fn = window.wally_fn = function () { };

  //location hash pages
  const routerPages = ["home", "newAddress", "newSegWit", "newMultiSig", "newHDaddress", "newTimeLocked", "newTransaction", "wallet", "about", "verify", "sign", "broadcast", "converter", "fee", "token"];

  //active/current coin/asset variables
  wally_fn.host = '';
  
  wally_fn.network = 'mainnet'; //this is the temporary network choosen in settings page but not saved
  wally_fn.asset = 'bitcoin'; //this is the temporary asset choosen in settings page but not saved

  wally_fn.chainModel = 'utxo';
  wally_fn.provider = {utxo:'', broadcast:''};
  wally_fn.assetInfo = {}; //has a copy of "coinjs.asset" object

  //wally_fn.availablePages = ["home", "newAddress", "newSegWit", "newMultiSig", "newTimeLocked", "newHDaddress", "newTransaction", "verify", "sign", "broadcast", "wallet", "settings", "about", "fees", "converter"];
  
  wally_fn.navigationPages = { 
    "home" : ['all'],
    "error_404" : ['all'],
    "newAddress" : ['utxo', 'account'],
    "newSegWit" : ['utxo'],
    "newMultiSig" : ['utxo'],
    "newTimeLocked" : ['utxo'],
    "newHDaddress" : ['utxo', 'account'],
    "newTransaction" : ['utxo', 'account'],
    "verify" : ['utxo', 'account'],
    "sign" : ['utxo', 'account'],
    "broadcast" : ['utxo', 'account'],
    "login" : ['utxo', 'account'],
    "wallet" : ['utxo', 'account'],
    "settings" : ['utxo', 'account'],
    "about" : ['all'],
    "fees" : ['utxo'],
    "converter" : ['all'],
    "components" : ['all'],
    "way-token" : ['all'],
  };


  
  /*
   @ Validate Email address
  */
  wally_fn.validateEmail = function (email){
    email = email.toLowerCase().trim();
    var re = /^\s*(([a-z0-9\._-]{2,30})@((?:(?:[a-z0-9\-]{1,30})){1,3})(\.[a-z]{2,3}(?:\.[a-z]{2})?))\s*$/;
    return re.test(email);
  }


  /*
   @ Check Password
   https://regex101.com/r/TzK4Sp/1
   https://stackoverflow.com/questions/33670870/regex-for-1-uppercase-1-special-character-and-1-lowercase
   Validate a password,
   must be between 12-255 characters in length
   contain at least: 1 uppercase letter, 1 lowercase letter, 1 digit and special char
  */
  wally_fn.validatePassword = function (password) {
    var regex = /^(?=.{16,255})(?=.*[\d])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$€§%^£!»©«&*|←↓→+=¥½&<>;:.µ,^~¨¤{}´?`+"()'/ \\-]).{1,255}$/g
    return regex.test(password);
  }


/**
https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
*/
wally_fn.getUrlParams = function (url) {
    
    // get query string from url (optional) or window
    var qs = url ? url : window.location.search.slice(1);
    var qsHash = url ? url : window.location.hash.slice(1);

    var qs = qs.substring(qs.indexOf('?') + 1).split('&');
    var qsHash = qsHash.substring(qsHash.indexOf('#') + 1).split('&');

    console.log('qs',qs);
    console.log('qsHash',qsHash);
    /*
    //do we have any hash?
    qsSplit = qs.split('#');  //cointains only search params
    qs = qsSplit[0];
    var qsHash = qsSplit[1];  //contains hash if there is any
    qsHash = qsHash.split('&');
    */


    var result = {'search_params': {}, 'hash_params': {}};

    //var qs = url.substring(url.indexOf('?') + 1).split('&');
    //search params
    for(var i = 0, tmp; i < qs.length; i++){
        qs[i] = qs[i].split('=');

        if (qs[i][0].includes('#')) {
          tmp = qs[i][0].split('#');
          qs[i][0] = tmp[0];
          result.search_params['_hashtag_'] = tmp[1];
        }

        if (qs[i][0] != '') 
          result.search_params[qs[i][0]] = (typeof(qs[i][1]) === 'undefined' ? undefined : decodeURIComponent(qs[i][1]) );
    }

    //hashtag params
    for(var i = 0, tmp; i < qsHash.length; i++){
        qsHash[i] = qsHash[i].split('=');
        if (qsHash[i][0].includes('?')) {
          tmp = qsHash[i][0].split('?');
          qsHash[i][0] = tmp[1];
          result.hash_params['_hashtag_'] = tmp[0].trim('/');
        }
        if (qsHash[i][0] != '') 
          result.hash_params[qsHash[i][0]] = (typeof(qsHash[i][1]) === 'undefined' ? undefined : decodeURIComponent(qsHash[i][1]) );
    }

    result = Object.assign(result.search_params, result.hash_params)

    if(result['_hashtag_'] === undefined)
      result['_hashtag_'] = window.location.hash.slice(1);
    
    return result;
}


/*
 @ url= 'http://example.com/?product=shirt&color=blue&color[]=blue2&color[]=blue3&newuser&size=m#verify';
 Get all url parameters and hashtag and save to an object
 @url is a url string and optional
 

  wally_fn.getAllUrlParams = function(url) {

    

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    
    //make it lowercase
    queryString = queryString.toLowerCase();

    var pageHash = '';
    if (url )
      queryString = url.split('?')[1];
    else {
      queryString = window.location.search.slice(1);
      pageHash = (window.location.hash).replace('#', '');
    }
    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

      // stuff after # is not part of query string, so get rid of it
      var getAllParams = queryString.split('#');
      queryString = getAllParams[0];  //get the parameters
      
      //get the hashtag
      if (getAllParams[1] !== undefined)
        obj._hashtag_ = (getAllParams[1] ? getAllParams[1] : pageHash);

      // split our query string into its component parts
      var arr = queryString.split('&');

      for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');

        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? undefined : a[1];

          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } 
      }
    }

    return obj;
  }
  */

  /* 
   @ get page url params / load code params 
  

  wally_fn._searchURLParam = function(p) {
    var dataArray = (document.location.search).match(/(([a-z0-9\_\[\]]+\=[a-z0-9\_\.\%\@]+))/gi);
    var r = [];
    if(dataArray) {
      for(var x in dataArray) {
        if((dataArray[x]) && typeof(dataArray[x])=='string') {
          if((dataArray[x].split('=')[0].toLowerCase()).replace(/\[\]$/ig,'') == p.toLowerCase()) {
            r.push(unescape(dataArray[x].split('=')[1]));
          }
        }
      }
    }
    return r;
  }
  */

  /*
  @ sleep promise
  */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /*
  @ Hash the email + password upon account login
  */
  wally_fn.passwordHasher = function (email, pass) {
    var s = email;
    s += '|'+pass+'|';
    s += s.length+'|!@'+((pass.length*7)+email.length)*7;
    var regchars = (pass.match(/[a-z]+/g)) ? pass.match(/[a-z]+/g).length : 1;
    var regupchars = (pass.match(/[A-Z]+/g)) ? pass.match(/[A-Z]+/g).length : 1;
    var regnums = (pass.match(/[0-9]+/g)) ? pass.match(/[0-9]+/g).length : 1;
    s += ((regnums+regchars)+regupchars)*pass.length+'3571';
    s += (s+''+s);

    for(i=0;i<=50;i++){
      s = Crypto.SHA256(s);
    }
    //s = s.padStart(64, '0');
    //s = wally_fn.padLeft(s, 64);
    return s;
  }

/*
use for multisig wallet key generating
https://jsbin.com/vadodateru/edit?html,js,console,output
https://jsbin.com/sajajodimo/1/edit?html,js,console,output

//with confirmation
https://jsbin.com/qikaserivi/1/edit?html,js,console,output
*/
  /*


Convert a number to a hexadecimal string with:

hexString = yourNumber.toString(16);

And reverse the process with:

yourNumber = parseInt(hexString, 16);

https://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hexadecimal-in-javascript
  */

  /*
   @ Hex to Decimal
   param hex value
   https://jsbin.com/heloduxota/edit?js,console,output
  */
  wally_fn.Hex2Decimal = function (h) {
    //return BigInt("0x" + h);
    //return BigInt("0x" + h).toString(10); 
    return parseInt(h, 16);
  }

  /*
   @ Hex to Decimal
   param number
   https://jsbin.com/heloduxota/edit?js,console,output
  */
  wally_fn.Decimal2Hex = function (n) {
    //return n.toString(16);
    return new BigInteger(h,10).toString(16);
    
  }

  wally_fn.isHex = function (str){
    regexHex = /^[0-9a-fA-F]+$/;

    if (regexHex.test(str))
        return true;
    else
        return false;
  }

  wally_fn.isDecimal = function (s) {

    
    //this is awkward, it didnt work earlier with BigInt, odd!!!
     return /^[0-9]+$/.test(s);


     //commented out in case BigInt makes issues again
    //s = s.toString(10);
    //s = s+'';
    //s = s.replace('0x', '');

    //var s2 = '';
    //s2 +=s;

    //return (parseInt(ss) >= 0 ? true : false);
    //return (parseInt(s) == NaN ? false : true);
    
    //return (typeof s2 == 'number' ? true : false);

  }



  /*
  @ Check if HEX value is within Bitcoin HEX key range
  param HEX/Decimals
  */
  wally_fn.isHexKeyInRange = function (key, options = {'show_error': true}) {

    try {
      console.log('===wally_fn.isHexKeyInRange===');
      //console.log('key before: '+ key);

      if(key.length > 78) //highest possible decimal length for last crypto address
        return false;

      //use max safe integer to determine if key is valid
      if (key <= 9007199254740991 )//Number.MAX_SAFE_INTEGER
        return true;
      
      //we got a BIG number! validate it!
      //var lastHexKeyInRange = new BigInteger('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140', 16).toString(16);
      var lastDecKeyinRange = new BigInteger('115792089237316195423570985008687907852837564279074904382605163141518161494336');


      var keyBig, keyLength = key.length;

      if (this.isDecimal(key)) { 
        console.log('is DIGIT');

        //just to reduce time-elapse for this function!
        if(keyLength < 78)
          return true;
        //if key DEC length has more then 79 chars -> out of range!
        if(keyLength > 79)
          return false;

        keyBig = new BigInteger(key);

      }else {
        
        if (!this.isHex(key))
          throw ('Key is not in HEX format!');

        console.log('Key is in HEX format');



        //remove 0x HEX identifier
        if(key.slice(0, 2) == '0x')
          key = key.replace('0x', '');
        //strip all leading 0's:
        key = key.replace(/^0+/, "");

        if(keyLength < 64)
          return true;

        //if key HEX length has more then 66 chars -> out of range!
        if(keyLength > 66) //we add 0x to the length which gives us 66 chars!
          return false;
        
        var ki = new BigInteger(key, 16).toString(10);
        keyBig = new BigInteger(ki);
      }

      /*
      console.log('key after: '+ key);
      console.log('keyBig: '+ keyBig);
      console.log('lastDecKeyinRange: '+ lastDecKeyinRange);
      */


      //**Key is converted to decimal: check if key is in range now!
      // jsbn.js: return + if this > a, - if this < a, 0 if equal
      var keyIsBiggerThenLastKey = (keyBig).compareTo(lastDecKeyinRange);

      if ( keyIsBiggerThenLastKey < 1)
        return true;

    } catch (err) {
      console.log('ERROR (wally_fn.isHexKeyInRange E1):', err)
    }
    
    //is option set to show error?
    if (options.show_error)
      custom.showModal('Error', 'ERROR (wally_fn.isHexKeyInRange E1): Key is out of Range! <br>Error Decoding Crypto address! <p>Try other credentials!</p>', 'secondary');

    return false;

  }

  /*
  wally_fn.padLeft = function(anything, length, character) {
    if(character == null) {
      character = '0';
      }
    var result = String(anything);
    for(var i = result.length; i < length; ++i) {
      result = character + result;
    }
    return result;
  }
  */

  /*
   @Generate all addresses for supported assets
  */
    /* decode/convert HEX privkey to addresses, privkeys, compressed and uncompressed*/
  wally_fn.hexPrivKeyDecode = function (h, options = {'supports_address':['compressed', 'uncompressed'], 'show_error': true}) {

    //generate legacy compressed and uncompressed wif keys

    //compressed
    /*
    var h= '0000000000000000000000000000000000000000000000000000000000000001';
    h = '1';

    //to big numbers use try and catch instead!
    if(!this.isHexKeyInRange(h)){
      console.log('not in range')
      return;
    }

    */
    console.log('=wally_fn.hexPrivKeyDecode=');
    //console.log('h: ', h);

    try {

      //convert decimal to hex if needed
      //console.log('h before: '+h)
      if(this.isDecimal(h)){
        //h = this.Decimal2Hex(h);
        //h = h.padStart(64, '0');
        h = new BigInteger(h).toString(16);
        //console.log('we got a digit, encode to hex');
      }

      //if (!this.isHex(h)) //not needed, we are already checking this in the request to isHexKeyInRange!
        //throw ('Parameter is not in HEX format!');

      h = (h.toString()).padStart(64, '0');  //wif should always be in 32bit/64 chars!

      //console.log('h after: '+h)

      //check if HEXkey is in range!
      if (!this.isHexKeyInRange(h, {'show_error': options.show_error}))
        throw ('HexKey is not in Range!');
        
      var keyInDecimal = new BigInteger(h, 16).toString(10);
      console.log('keyInDecimal: '+keyInDecimal);
    
      

      //***Begin address creation
      var r = Crypto.util.hexToBytes(h);      


      //***Compressed, is used for bech32 and segwit addresses
      r.push(0x01); //set compress true

      r.unshift(coinjs.priv);
      var hash = Crypto.SHA256(Crypto.SHA256(r, {asBytes: true}), {asBytes: true});
      var checksum = hash.slice(0, 4);
      

      var privKeyWifC = coinjs.base58encode(r.concat(checksum));
      var addressC = coinjs.wif2address(privKeyWifC);
      var pubKeyC = coinjs.wif2pubkey(privKeyWifC);
      
      //generate additional addresses like bech32 and segwit ?
      var address_formats = {};
      //console.log('options.length: '+options.length);
      //console.log('options: ',options);
      
      if (options.supports_address.length){
        if (options.supports_address.includes('bech32')){
          var swbech32C = coinjs.bech32Address(pubKeyC.pubkey);
          address_formats.bech32 = swbech32C;
        }
        if (options.supports_address.includes('segwit')){
          var swC = coinjs.segwitAddress(pubKeyC.pubkey);
          address_formats.segwit = swC;
        }
        
      }
      //console.log('address_formats: ', address_formats);

      //***Uncompressed

      //uncompressed addresses is not supported for bech32 and segwit!
      //var r = r2;
      var r = Crypto.util.hexToBytes(h);

      r.unshift(coinjs.priv);
      var hash = Crypto.SHA256(Crypto.SHA256(r, {asBytes: true}), {asBytes: true});
      var checksum = hash.slice(0, 4);

      var privKeyWifU = coinjs.base58encode(r.concat(checksum));
      var addressU = coinjs.wif2address(privKeyWifU);
      var pubKeyU = coinjs.wif2pubkey(privKeyWifU);

      //var swbech32U = coinjs.bech32Address(pubKeyU.pubkey);    //<--not supported for bech32
      //var swU = coinjs.segwitAddress(pubKeyU.pubkey);  //<-- not supported for segwit

      /*
      console.log('privKeyWifC: ', privKeyWifC);
      console.log('addressC: ', addressC);
      console.log('pubKeyC: ', pubKeyC);
      console.log('swbech32C: ', swbech32C);
      console.log('swC: ', swC);

      console.log('privKeyWifU: ', privKeyWifU);
      console.log('addressU: ', addressU);
      console.log('pubKeyU: ', pubKeyU);
      */


      var hexGenerated = {
        'decimal_key': keyInDecimal,
        'hex_key': h,
        'wif': {
          'compressed': {
            'key': privKeyWifC,
            'public_key': pubKeyC.pubkey,
            'address': addressC.address,
            'public_key_hash': coinjs.address2ripemd160(addressC.address),
            //'bech32': swbech32C,-
            //'segwit': swC,


          },
          'uncompressed': {
            'key': privKeyWifU,
            'public_key': pubKeyU.pubkey,
            'public_key_hash': coinjs.address2ripemd160(addressU.address),
            'address': addressU.address,
          }
        }
      };

      //is segwit and bech32 addresses generated?
      if (Object.keys(address_formats).indexOf('bech32') !== -1)
        hexGenerated.wif.compressed.bech32 = address_formats.bech32;

      if (Object.keys(address_formats).indexOf('segwit') !== -1)
        hexGenerated.wif.compressed.segwit = address_formats.segwit;
        
      
      //console.log('hexGenerated: ', hexGenerated);
      return hexGenerated;

      //var privKeyWifC= coinjs.privkey2wif(hex);


      //generate segwit and bech32 address 
      
      //var swbech32 = coinjs.bech32Address(coin.pubkey);
      //var sw = coinjs.segwitAddress(coin.pubkey);
    } catch (err){
      console.log('ERROR (hexPrivKeyDecode): Out of Range! Error generating Bitcoin address!: ', err)
    }
    return false;
  }

/*
@ Generate Wallet addresses upon Login, compressed or single keys for assets/coins
*/
wally_fn.generateAllWalletAddresses = function(hexkey){
  console.log('=================wally_fn.generateAllWalletAddresses=================')

  var assetAddress;
  var walletAddresses = {};
  for (var [key, value] of Object.entries(wally_fn.networks[ coinjs.asset.network ])) {
    console.log('loop for key, value: '+ key, value);
    //console.log('loop for value: ', value);

    
    

    //UTXO coins
    if (value.asset.chainModel == 'utxo') {
      //asset supports compressed keys?
      if ( (value.asset.supports_address).includes('compressed') ) {
        $.extend(coinjs, value);
        assetAddresses = this.hexPrivKeyDecode(hexkey, {'supports_address': coinjs.asset.supports_address});
        //console.log('assetAddresses.wif', assetAddresses);


        walletAddresses[ key ] = {};
        walletAddresses[ key ]['name']  = value.asset.name;
        walletAddresses[ key ]['symbol']  = value.asset.symbol;
        walletAddresses[ key ]['address']  = assetAddresses.wif.compressed.address;
        walletAddresses[ key ]['addresses_supported']  = assetAddresses.wif;
      }
    }

    //Account based coins
    if (value.asset.chainModel == 'account') {

      //asset supports compressed keys?
      if ( (value.asset.supports_address).includes('single') ) {
      }
    
  }
}

$.extend(coinjs, wally_fn.networks.mainnet.bitcoin);
console.log('walletAddresses: ', walletAddresses);
return walletAddresses;


  

}

/*
 Validate/Decode/Convert key to address
 @key in:decimal/hex
 Not used - iceee
*/
wally_fn.decodeHexPrivKey = function(key){
    
    console.log('=wally_fn.decodePrivKey=');
    console.log('key: ', key);
    try {
      //if int, convert to hex and then try to validate address
      if (Number.isInteger(key))
        key = this.Decimal2Hex;

      //check if string is in HEX format
      //if yes, add padding so its value is in 32bit/64char format
      if (this.isHex(key)) {
        if(key.length < 64)
          key = (key.toString()).padStart(64, '0')
      }

      //try to decode the address
      var wif='';

      console.log('key: ' + key);
      if(key.length==64){
        wif = coinjs.privkey2wif(key);
      //}
      //if(wif.length==51 || wif.length==52){
          var w2address = coinjs.wif2address(wif);
          var w2pubkey = coinjs.wif2pubkey(wif);
          var w2privkey = coinjs.wif2privkey(wif);

          console.log("wally_fn.decodePrivKey .address: "+ w2address['address']);
          console.log("wally_fn.decodePrivKey .pubkey: "+ w2pubkey['pubkey']);
          console.log("wally_fn.decodePrivKey .privkey: "+w2privkey['privkey']);
          console.log("wally_fn.decodePrivKey .iscompressed: " + w2address['compressed']?'true':'false');

          return true;
      }
    } catch (e) {
      console.log('wally_fn.decodePrivKey ERROR: ', e)
    }
    return false;
  }

  /*
   @ scripthash2address
    Address, to HEX Ripemd160 hash of public key
  */
  wally_fn.address2scripthash = function (a) {
    var bytes = coinjs.base58decode(a);
    var front = bytes.slice(1, bytes.length-4);
    return Crypto.util.bytesToHex(front);
  }


  /*
   @ Compare if two objects is equal
   param object1, object 2
  */
  wally_fn.isObjectEqual = function (x, y) {
    return (x && y && typeof x === 'object' && typeof y === 'object') ?
      (Object.keys(x).length === Object.keys(y).length) &&
        Object.keys(x).reduce(function(isEqual, key) {
          return isEqual && this.isObjectEqual(x[key], y[key]);
        }, true) : (x === y);
  }


/*
 @ 
 given a parameter @word (string)
 shuffle it and get randomized characters from it with a given @maxLength, return
 * 
 console.log(generateString(5));
*/
wally_fn.generateString = function(word, maxLength) {
    var result = ' ';
    var chars = this.shuffleWord(word);
    var charsLength = chars.length;
    for ( let i = 0; i < maxLength; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    return result;
}


/**
 * Shuffle an array using the modern Fisher–Yates shuffle algorithm.
 *
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 *
 * @param (string) word
 * @returns {word}
 * 
 * 
 */
wally_fn.shuffleWord = function (word){
  /*var array = word.split("");
  var i = array.length;
  while (--i > 0) {
      var swapIndex = Math.floor(Math.random() * (i + 1));
      [array[swapIndex], array[i]] = [array[i], array[swapIndex]];
   }
   return array.join("");
   */
   
   
   word = word.split("");
   for (var i = word.length - 1; i > 0; i--) {
    var swapIndex = Math.floor(Math.random() * (i + 1))
    var currentCard = word[i]
    var cardToSwap = word[swapIndex]
    word[i] = cardToSwap
    word[swapIndex] = currentCard
  }
  return word.join("");
  

}


/*
https://blog.logrocket.com/write-declarative-javascript-promise-wrapper/#declarative-programming


/*
@ Promiser Wrapper
//https://medium.com/bithubph/creating-a-promise-wrapper-for-old-callback-api-methods-fa1b03b82a90
//https://javascript.info/promisify


//https://www.freecodecamp.org/news/write-your-own-promisify-function-from-scratch/

*/

wally_fn.myPromisify = function (fn) {
  console.log('===wally_fn.myPromisify===');
   return (...args) => {
    console.log('return (...args) => ', ...args);
     return new Promise((resolve, reject) => {
      console.log('return new Promise((resolve, reject) => {');
      //do we have callbacks from the requested "fn" (as parameter) function?
       function customCallback(err, ...results) {
        console.log('=customCallback=');

        console.log('err: ', err);
        console.log('results: ', results);
         if (err) {
          console.log('reject error: ', err);
           return reject(err);
         }
         console.log('resolve: ', resolve);
         return resolve(results.length === 1 ? results[0] : results);
        }

        //add callback parameter to the requested function
        //args.push(customCallback);
        
        //handle the return accordingly
        console.log('args: ', args);
        
        var res = fn.call(this, args);
        console.log('res: ', res);

        //setTimeout(() => reject('hello'), 2000);

        if (res) 
          resolve(res);

        reject(res);
      });
   }
}
/*
use like:
wally_fn.myPromisify( (wally_fn.decodeHexPrivKey()) );


var getSumPromise = wally_fn.myPromisify(wally_fn.decodeHexPrivKey);
getSumPromise('3ö').then((data) => {
  console.log('====***wally_fn.myPromisify SUCCESS: ', data);
}).catch((error) => {
  console.log('====***wally_fn.myPromisify ERROR: ', error);
})


var genAllAddresses = wally_fn.myPromisify(wally_fn.generateAllWalletAddresses)

genAllAddresses('3').then((data) => {
  console.log('====***wally_fn.myPromisify SUCCESS: ', data);
}).catch((error) => {
  console.log('====***wally_fn.myPromisify ERROR: ', error);
})





*/

/*
//https://masteringjs.io/tutorials/fundamentals/this

  @ A Promise handler
  @ simplified implementation of `util.promisify()`

*/

wally_fn.promisify =  function(fn) {
  console.log('===wally_fn.promisify===');
  return (...args) => {
    console.log('=return function() {=', fn);
    //console.log('arguments: ', arguments);
    //const args = Array.prototype.slice.call(arguments);
    //console.log('args: ', args);
    return new Promise((resolve, reject) => {

      //setTimeout(() => reject('hello'), 2000);

      //console.log('resolve: ', resolve);
      //console.log('reject: ', reject);
      console.log('return new Promise((resolve, reject) => {');
      //var res = fn.call(this, ...args);
      var res = fn.call(this, ...args);

      console.log('res: ', res);
      if (res)
        resolve(res);

      reject(res);
          
    });
  }
}
/*
**use it like:
testar = wally_fn.promisify( wally_fn.hexPrivKeyDecode );
console.log(testar('3aa'));
**or
testar('3aa').then((data) => {
    console.log('then yeah', data);
  }).catch((error) => {
    console.log('then catch', error);
  });
*/




  wally_fn.networks = {
    mainnet : {
      bitcoin : {
        symbol: 'BTC',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Bitcoin',
          slug: 'bitcoin',
          symbol: 'BTC',
          symbols: ['btc', 'bitcoin'],
          icon: './assets/images/crypto/bitcoin-btc-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed', 'bech32', 'segwit'],
          api : {
              //only key is used for the moment, not the value!
            unspent_outputs: {
              'Blockchain.info': 'btc', //no arguments needs to be passed
              'Blockchair.com': 'bitcoin',
              'Blockcypher.com': 'btc',
              //'Blockstream.info': 'Blockstream.info',
              'Chain.so': 'BTC',
              'Coinb.in': 'Coinb.in',
              'Cryptoid.info': 'btc',
              //'Mempool.space': 'btc',
            },
            broadcast: {
              'Blockchair.com': 'bitcoin',
              'Blockcypher.com': 'btc',
              'Blockstream.info': 'Blockstream.info', //no arguments needs to be passed
              'Chain.so': 'BTC',
              'Coinb.in': 'Coinb.in',                 //no arguments needs to be passed
              'Cryptoid.info': 'btc',
              //'Mempool.space': 'btc',
            }
          }
        },
        pub : 0x00,      //pubKeyHash
        priv : 0x80,     //wif
        multisig : 0x05, //scriptHash
          hdkey : {'prv':0x0488ade4, 'pub':0x0488b21e},
          bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'bc'},
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: true,
        developer: '1o18b93etEEbg2sB4tQYk8LBW45N9K8RJ',
      },
      litecoin : {
        symbol: 'LTC',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Litecoin',
          slug: 'litecoin',
          symbol: 'LTC',
          symbols: ['ltc', 'litecoin'],
          icon: './assets/images/crypto/litecoin-ltc-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed', 'bech32', 'segwit'],
          api : {
              //only key is used for the moment, not the value!
            unspent_outputs: {
              'Blockcypher.com': 'ltc',
              'Blockchair.com': 'litecoin',
              'Chain.so': 'LTC',
              'Cryptoid.info': 'ltc',
            },
            broadcast: {
              'Blockcypher.com': 'ltc',
              'Blockchair.com': 'litecoin',
              'Chain.so': 'LTC',
              'Cryptoid.info': 'ltc',
            }
          }
        },
        pub : 0x30,      //pubKeyHash
        priv : 0xb0,     //wif
        multisig : 0x32, //scriptHash
          hdkey : {'prv':0x019d9cfe, 'pub':0x019da462},
          bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'ltc'},
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'LWvggiTjyaosoydaxTKKrnVAgPocu7PVcP',
      },
      dogecoin : {
        symbol: 'DOGE',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Dogecoin',
          slug: 'dogecoin',
          symbol: 'DOGE',
          symbols: ['doge', 'dogecoin'],
          icon: './assets/images/crypto/dogecoin-doge-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed', 'segwit'],
          api : {
            unspent_outputs: {
              'Blockcypher.com': 'doge',
              'Blockchair.com': 'dogecoin',
              'Chain.so': 'DOGE',
            },
            broadcast: {
              'Blockcypher.com': 'doge',
              'Blockchair.com': 'dogecoin',
              'Chain.so': 'DOGE',
            }
          }
        },
        pub : 0x1e,      //pubKeyHash
        priv : 0x9e,     //wif
        multisig : 0x16, //scriptHash
          hdkey : {'prv':0x089944e4, 'pub':0x0827421e},
          bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'doge'},
          
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: true,
        developer: 'DEhoLGBcCLArvcaC1UmCzZ4zFy2ZViytu8',
      },
      bitbay : {
        symbol: 'BAY',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'BitBay',
          slug: 'bitbay',
          symbol: 'BAY',
          symbols: ['bay', 'bitbay'],
          icon: './assets/images/crypto/bitbay-bay-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed'],
          api : {
            unspent_outputs: {
              'Cryptoid.info': 'bay',
              'BitBay Node': '',
            },
            broadcast: {
              'Cryptoid.info': 'bay',
              'BitBay Node': '',
            }
          }
        },
        pub : 0x19,      //pubKeyHash
        priv : 0x99,     //wif
        multisig : 0x55, //scriptHash
          hdkey : {'prv':0x02cfbf60, 'pub':0x02cfbede},
          bech32 : {},
          
        txExtraTimeField: true,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'BTEkGhZekUT6xaGqzwJcpUcmXrVxBeYRrN',
      },
      blackcoin : {
        symbol: 'BLK',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Blackcoin',
          slug: 'blackcoin',
          symbol: 'BLK',
          symbols: ['blk', 'blackcoin'],
          icon: './assets/images/crypto/blackcoin-blk-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed'],
          api : {
            unspent_outputs: {
              'Cryptoid.info': 'blk'
            },
            broadcast: {
              'Cryptoid.info': 'blk'
            }
          }
        },
        pub : 0x19,      //pubKeyHash
        priv : 0x99,     //wif
        multisig : 0x55, //scriptHash
          hdkey : {'prv':0x02cfbf60, 'pub':0x02cfbede},
          bech32 : {},
          
        txExtraTimeField: true,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'BGexLJiFBatp92XiZi2RXDLyjidZnDrDmw',
      },
      lynx : {
        symbol: 'LYNX',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Lynx',
          slug: 'lynx',
          symbol: 'LYNX',
          symbols: ['lynx'],
          icon: './assets/images/crypto/lynx-lynx-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed', 'bech32', 'segwit'],
          api : {
            unspent_outputs: {
              'Cryptoid.info': 'lynx'
            },
            broadcast: {
              'Cryptoid.info': 'lynx'
            }
          }
        },
        pub : 0x2d,      //pubKeyHash
        priv : 0xad,     //wif
        multisig : 0x32, //scriptHash
          hdkey : {'prv':0x0488ade4, 'pub':0x0488b21e}, //fix this! iceeee
          bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'ltc'},
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'K9w3PqeX9yr9AcYuyafcoa2wDk1VAfEzoH',
      },
      
      potcoin : {
        symbol: 'POT',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'PotCoin',
          version: 4,
          slug: 'potcoin',
          symbol: 'POT',
          symbols: ['pot', 'potcoin'],
          icon: './assets/images/crypto/potcoin-pot-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed'],
          api : {
            unspent_outputs: {
              'Cryptoid.info': 'pot'
            },
            broadcast: {
              'Cryptoid.info': 'pot'
            }
          },
          
        },
        /*oinjs_multisig").value = "0x5";
        
        pub : 55,      //pubKeyHash
        priv : 183,     //wif, or is it 189??
        multisig : 5, //scriptHash


    // template matching params
    https://github.com/potcoin/potcoin/blob/master/src/script.h#L206
    https://github.com/potcoin/PotcoinJS/blob/master/potcoinjs-lib/src/networks.js
    OP_SMALLINTEGER = 0xfa,
    OP_PUBKEYS = 0xfb,
    OP_PUBKEYHASH = 0xfd,
    OP_PUBKEY = 0xfe,
        */
        pub : 0x37,      //pubKeyHash
        priv : 0xb7,     //wif
        multisig : 0x05, //scriptHash
          hdkey : {'prv':0x0488ade4, 'pub':0x0488b21e},
          bech32 : {},
          //magic: hex('fbc0b6db'),
          
        txExtraTimeField: true,    //Set to true for PoSV coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'PF2BMF6TwjAUp7omwgVJh3XmzjHXEYtpFf',
      },
      infiniloop: {
        symbol: 'IL8P',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'InfiniLooP',
          slug: 'infiniloop',
          symbol: 'IL8P',
          symbols: ['il8p', 'infiniloop'],
          icon: './assets/images/crypto/infiniloop-il8p-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed'],
          api : {
            unspent_outputs: {
              'Cryptoid.info': 'il8p'
            },
            broadcast: {
              'Cryptoid.info': 'il8p'
            }
          },
        },
        pub : 0x21,      //pubKeyHash
        priv : 0x99,     //wif
        multisig : 0x55, //scriptHash
          hdkey : {'prv':0x0488ade4, 'pub':0x0488b21e},
          bech32 : {},
          
        txExtraTimeField: true,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'EMHj1vHhh8D5kxtK7NbNQw4qoW6Qeyz3Hd',
      },
      artbyte: {
        symbol: 'ABY',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Artbyte',
          slug: 'artbyte',
          symbol: 'ABY',
          symbols: ['aby', 'artbyte'],
          icon: './assets/images/crypto/artbyte-aby-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed'],
          api : {
            unspent_outputs: {
              'Cryptoid.info': 'aby'
            },
            broadcast: {
              'Cryptoid.info': 'aby'
            }
          },

        },
        pub : 28,      //pubKeyHash
        priv : 153,     //wif
        multisig : 85, //scriptHash
          hdkey : {'prv':0x0488ade4 /*EXT_SECRET_KEY*/, 'pub':0x0488b21e /*EXT_PUBLIC_KEY*/},
          bech32 : {},
          
        txExtraTimeField: true,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'CeTNuWQ5pC3RS4NexFEeAysF7X25zp1qB4',
      },
      zetacoin: {
        symbol: 'ZET',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Zetacoin',
          slug: 'zetacoin',
          symbol: 'ZET',
          symbols: ['zet', 'zetacoin'],
          icon: './assets/images/crypto/zetacoin-zet-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed'],
          api : {
            unspent_outputs: {
              'Cryptoid.info': 'zet'
            },
            broadcast: {
              'Cryptoid.info': 'zet'
            }
          },
        },
        pub : 20,      //pubKeyHash
        priv : 153,     //wif
        multisig : 85, //scriptHash
          hdkey : {'prv':0x0488ade4 /*EXT_SECRET_KEY*/, 'pub':0x0488b21e /*EXT_PUBLIC_KEY*/},
          bech32 : {},
          
        txExtraTimeField: true,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: '9HDfTd3VhF5RsSWfzrHvvonVzGjW3gQPcb',
      },
      vanillacash: {
        symbol: 'XVC',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Vanillacash',
          slug: 'vanillacash',
          symbol: 'XVC',
          symbols: ['xvc', 'vanillacash'],
          icon: './assets/images/crypto/vanillacash-xvc-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed'],
          api : {
            unspent_outputs: {
              'Cryptoid.info': 'xvc'
            },
            broadcast: {
              'Cryptoid.info': 'xvc'
            }
          },

        },
        pub : 18,      //pubKeyHash, PUBKEY_ADDRESS
        priv : 181,     //wif, SECRET_KEY
        multisig : 30, //scriptHash, SCRIPT_ADDRESS
          hdkey : {'prv':0xe1a32b3e /*EXT_SECRET_KEY*/, 'pub':0xad1b12a4 /*EXT_PUBLIC_KEY*/},
          bech32 : {},
          
        txExtraTimeField: true,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: '8RTwrgaA9sSTokWJsJN5tc9f3QKWJuAdzD',
      },
      novacoin: {
        symbol: 'NVC',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Novacoin',
          slug: 'novacoin',
          symbol: 'NVC',
          symbols: ['nvc', 'novacoin'],
          icon: './assets/images/crypto/novacoin-nvc-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed'],
          api : {
            unspent_outputs: {
              'Cryptoid.info': 'nvc'
            },
            broadcast: {
              'Cryptoid.info': 'nvc',
              'ElectrumX-1 (SSL)': 'electrumx.nvc.ewmcx.org:50002',
              'ElectrumX-2 (SSL)': 'failover.nvc.ewmcx.biz:50002',
            }
          },
          social: {
            discord : {
              official: 'https://discord.gg/6juXnsSkGa',
            },
            telegram : {
              english: 'https://t.me/NovaCoin_EN',
              russian: 'https://t.me/NovaCoin_RU',
            },
            twitter : {
              official: '',
            },
          },
        },
        pub : 0x08,      //pubKeyHash, "pubtype": 8,
        priv : 0x88,     //wif, "wiftype": 136,
        multisig : 0x14, //scriptHash, "p2shtype": 20,
          hdkey : {'prv':0x0488ade4 /*EXT_SECRET_KEY*/, 'pub':0x0488b21e /*EXT_PUBLIC_KEY*/}, //bip32
          bech32 : {},
          
        txExtraTimeField: true,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:6,
        txRBFTransaction: false,
        developer: '4bATCSp4uUrRZzwwUuQJKAJG4vyXhK85fZ',
      },
    },


    //TESTNET
    testnet : {
      bitcoin : {
        symbol: 'tBTC',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Bitcoin',
          slug: 'bitcoin',
          symbol: 'tBTC',
          symbols: ['btc', 'bitcoin'],
          icon: './assets/images/crypto/bitcoin-btc-logo.svg',
          network: 'testnet',
          supports_address : ['compressed', 'uncompressed', 'bech32', 'segwit'],
          api : {
              //key is provider, value is the parameter to the provider (if needed)
              //https://github.com/spesmilo/electrum/blob/afa1a4d22a31d23d088c6670e1588eed32f7114d/lib/network.py#L57
              //https://1209k.com/bitcoin-eye/ele.php?chain=tbtc
            unspent_outputs: {
              'Blockchair.com': 'bitcoin',
              'Blockcypher.com': 'btc',
              //'Blockstream.info': 'Blockstream.info',
              'Chain.so': 'BTCTEST',
              //'Mempool.space': 'testnet',
              'ElectrumX-1 (TCP)': 'testnet.aranguren.org:51001',
              'ElectrumX-1 (SSL)': 'testnet.aranguren.org:51002',
              'ElectrumX-2 (TCP)': 'testnetnode.arihanc.com:51001',
              'ElectrumX-3 (SSL)': 'testnetnode.arihanc.com:51002',
              'ElectrumX-4 (TCP)': 'testnet.hsmiths.com:53011',
              'ElectrumX-5 (SSL)': 'testnet.hsmiths.com:53012',
              'ElectrumX-6 (SSL)': 'bitcoin-testnet.stackwallet.com:51002',
              'ElectrumX-5 (SSL)': 'ax102.blockeng.ch:60002',
              'ElectrumX-5 (TCP)': 'testnet.qtornado.com:51001',
              'ElectrumX-5 (SSL)': 'testnet.qtornado.com:51002',

            },
            broadcast: {
              'Blockchair.com': 'bitcoin',
              'Blockcypher.com': 'btc',
              'Blockstream.info': 'Blockstream.info',
              'Chain.so': 'BTCTEST',
              //'Mempool.space': 'testnet',
              'ElectrumX-1 (TCP)': 'testnet.aranguren.org:51001',
              'ElectrumX-1 (SSL)': 'testnet.aranguren.org:51002',
              'ElectrumX-2 (TCP)': 'testnetnode.arihanc.com:51001',
              'ElectrumX-3 (SSL)': 'testnetnode.arihanc.com:51002',
              'ElectrumX-4 (TCP)': 'testnet.hsmiths.com:53011',
              'ElectrumX-5 (SSL)': 'testnet.hsmiths.com:53012',
              'ElectrumX-6 (SSL)': 'bitcoin-testnet.stackwallet.com:51002',
              'ElectrumX-5 (SSL)': 'ax102.blockeng.ch:60002',
              'ElectrumX-5 (TCP)': 'testnet.qtornado.com:51001',
              'ElectrumX-5 (SSL)': 'testnet.qtornado.com:51002',
              


            }
          }
        },
        pub : 0x6f,      //pubKeyHash
        priv : 0xef,     //wif
        multisig : 0xc4, //scriptHash
          hdkey : {'prv':0x04358394, 'pub':0x043587cf},
          bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'tb'},
          //bech32 : {},
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: true,
        developer: 'moZx3Vhdj4xe1JbEp7BegcpVdMNWTpzWHh',
      },
      litecoin : {
        symbol: 'tLTC',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Litecoin',
          slug: 'litecoin',
          symbol: 'tLTC',
          symbols: ['ltc', 'litecoin'],
          icon: './assets/images/crypto/litecoin-ltc-logo.svg',
          network: 'testnet',
          supports_address : ['compressed', 'uncompressed'],
          api : {
            unspent_outputs: {
              'Chain.so': 'LTCTEST',
            },
            broadcast: {
              'Chain.so': 'LTCTEST',
            }

          }
        },
        pub : 0x6f,      //pubKeyHash
        priv : 0xef,     //wif
        multisig : 0xc4, //scriptHash
          hdkey : {'prv':0x04358394, 'pub':0x043587cf},
          bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'litecointestnet'},
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'mkBRJRKFA7YL7ezXW6tyXUsEzK9Jnpv842',
      },
      dogecoin : {
        symbol: 'tDOGE',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Dogecoin',
          slug: 'dogecoin',
          symbol: 'tDOGE',
          symbols: ['doge', 'dogecoin'],
          icon: './assets/images/crypto/dogecoin-doge-logo.svg',
          network: 'testnet',
          supports_address : ['compressed', 'uncompressed', 'segwit'],
          api : {
            unspent_outputs: {
              'Chain.so': 'DOGETEST',
            },
            broadcast: {
              'Chain.so': 'DOGETEST',
            }
          }
        },
        pub : 0x71,      //pubKeyHash
        priv : 0xf1,     //wif
        multisig : 0xc4, //scriptHash
          hdkey : {'prv':0x04358394, 'pub':0x043587cf},
          bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'litecointestnet'},
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: true,
        developer: 'ncFA1iJD9RtPeAsQrwrHesN4tMtPwuYTTo',
      },
      wally : {
        symbol: 'tWAY',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Wally',
          slug: 'wally',
          symbol: 'tWAY',
          symbols: ['way', 'wally'],
          icon: './assets/images/crypto/wally-way-logo.svg',
          network: 'testnet',
          supports_address : ['compressed', 'uncompressed', 'segwit', 'bech32'],
          api : {
            unspent_outputs: {
              'Wally.id': 'way',
              //https://github.com/qtumproject/qtuminfo-api
              //https://github.com/qtumproject/qtuminfo-api/blob/master/doc/address.md#Address-UTXO-List
            },
            broadcast: {
              'Wally.id': 'way',
            }
          }
        },
        pub : 120,      //pubKeyHash
        priv : 239,     //wif
        //pub : 0x00,      //pubKeyHash
        //priv : 0x80,     //wif
        //https://github.com/qtumproject/qtum/issues/612
        //https://blog.qtum.org/wallet-import-format-3497f670b6aa
        //https://github.com/qtumproject/documents/tree/master/en/QTUM-WebWallet-usage#4-restore-from-wif

        multisig : 110, //scriptHash
          hdkey : {'prv':70615956, 'pub':70617039},
          bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'tb'},

        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'iceeeee',
      },

      
      ethereum : {
        symbol: 'tETH-Goerli',      //ticker
        asset: {
          chainModel: 'account',
          name: 'Ethereum-Goerli',
          slug: 'ethereum-goerli',
          symbol: 'tETH',
          symbols: ['eth-goerli', 'ethereum-goerli'],
          icon: './assets/images/crypto/ethereum-eth-logo.svg',
          network: 'testnet',
          supports_address : ['single'],
          api : {
            unspent_outputs: {
              '': '',
            },
            broadcast: {
              '': '',
            }
          }
        },
        pub : 0,      //not used for account based chains
        priv : 0,     //not used for ....
        multisig : 0, //....
          hdkey : {'prv':0x04358394, 'pub':0x043587cf},
          bech32 : {},
          
        txExtraTimeField: false,    //not used for ....
        txExtraTimeFieldValue: false, //....
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:16,
        txRBFTransaction: false,
        developer: '0x000',
      },
      nexus : {
        symbol: 'NXS',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Nexus',
          version: 4,
          slug: 'nexus',
          symbol: 'NXS',
          symbols: ['nxs', 'nexus'],
          icon: './assets/images/crypto/nexus-nxs-logo.svg',
          network: 'mainnet',
          supports_address : ['compressed', 'uncompressed'],
          api : {
            unspent_outputs: {
              'Cryptoid.info': 'nxs'
            },
            broadcast: {
              'Cryptoid.info': 'nxs'
            }
          }
        },
        pub : 0xfe,      //pubKeyHash     OP_PUBKEYHASH = 0xfd, https://github.com/Nexusoft/Legacy/blob/v0.2.0.0/src/wallet/script.h
        priv : 0xfd,     //wif            OP_PUBKEY = 0xfe,
        multisig : 0xfb, //scriptHash     OP_PUBKEYS = 0xfb, OP_PUBKEYSCRIPT

/*
    pub : 0xfd,      //pubKeyHash     OP_PUBKEYHASH = 0xfd, https://github.com/Nexusoft/Legacy/blob/v0.2.0.0/src/wallet/script.h
        priv : 0xfe,     //wif            OP_PUBKEY = 0xfe,
        multisig : 0xfb, //scriptHash     OP_PUBKEYS = 0xfb, OP_PUBKEYSCRIPT


*/
          hdkey : {'prv':0x02cfbf60, 'pub':0x02cfbede},
          bech32 : {},
          
        txExtraTimeField: true,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: '2kp58H1Ezgsv2jaHpLPL1RXw4T5jVygTVqp',
      },
    }

  }

  //assets are now sorted in the object
  //https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
  wally_fn.networks.mainnet = Object.fromEntries(Object.entries(wally_fn.networks.mainnet).sort());
  wally_fn.networks.testnet = Object.fromEntries(Object.entries(wally_fn.networks.testnet).sort());

/*
https://testnet.qtum.info/
https://testnet.qtum.org/

API testnet
https://testnet.qtum.info/api/
https://testnet.qtum.info/api/address/QReceive4V6rE6XU5dqoGLokwhcLnoKnUH/utxo

push raw tx:
https://testnet.qtum.info/api/tx/send

POST
rawtx=01000000016a7a005ad482e7aa2b7d18d1b1b3d89304f7f939393481139655c7665e01c3a0000000006b483045022100a7d8a9b3a9741f87dc298b799d5aec2774a4d43be959314b2872c015c083b9ac022066792718420e488b5f6f68d016332299de7457c1a18856262be7214e8bbde267012103e4fe6c71ca115bcb8ef10c91bd7ec57f926b485af9d265e2d175d02ff623e57dfeffffff01c0705465010000001976a914b103edfb0cd4cd56023030b93b4b707843f19c5688ac00000000

Response

{
  "status": 0,
  "id": "56daa4ae91c07b84aad5bcab74bfe0c12e14b228ed755c2aaabc6b027f8698a0"
}
/// or
{
  "status": 1,
  "message": "{error message}"
}
-----------------------

address: qZhMU25uxChirtGJg34on7JGEN2EN6dFSX
wif: cPYMu3fzacYhQ2AfeQgeE7ovYN7muduRT6nqRRiBq1AZxBpu5tV5



qtum mainnet
coinjs.pub = 58;
coinjs.priv = 128;
coinjs.multisig = 50;

        pub : 58,      //pubKeyHash
        priv : 128,     //wif
        multisig : 50, //scriptHash
          hdkey : {'prv':76066276, 'pub':76067358},
bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'bc'},

qtum testnet
coinjs.pub = 120;
coinjs.priv = 239;
coinjs.multisig = 110;

        pub : 120,      //pubKeyHash
        priv : 239,     //wif
        multisig : 110, //scriptHash
          hdkey : {'prv':70615956, 'pub':70617039},
bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'tb'},

          [l.MAINNET]: {
            name: l.MAINNET,
            messagePrefix: "Qtum Signed Message:\n",
            bech32: "bc",
            bip32: { public: 76067358, private: 76066276 },
            pubKeyHash: 58,
            scriptHash: 50,
            wif: 128,
          },
          [l.TESTNET]: {
            name: l.TESTNET,
            messagePrefix: "Qtum Signed Message:\n",
            bech32: "tb",
            bip32: { public: 70617039, private: 70615956 },
            pubKeyHash: 120,
            scriptHash: 110,
            wif: 239,


paccoin mainnet
        pub : 0x37,      //pubKeyHash
        priv : 0xcc,     //wif
        multisig : 0x0a, //scriptHash
          hdkey : {'prv':0x03dd3e5a, 'pub':0x03dd3e31},



  name: 'livenet',
  alias: 'mainnet',
  pubkeyhash: 0x37,
  privatekey: 0xcc,
  scripthash: 0x0a,
  xpubkey: 0x03dd3e31,    // 'xpub' (Bitcoin Default)
  xprivkey: 0x03dd3e5a,   // 'xprv' (Bitcoin Default)
  networkMagic: 0xc8e5612c,
*/
  

  /*

https://www.blockcypher.com/dev/bitcoin/#api-versions

Bitcoin   Main  api.blockcypher.com/v1/btc/main
Bitcoin   Testnet3  api.blockcypher.com/v1/btc/test3
Dash  Main  api.blockcypher.com/v1/dash/main
Dogecoin  Main  api.blockcypher.com/v1/doge/main
Litecoin  Main  api.blockcypher.com/v1/ltc/main
BlockCypher   Test  api.blockcypher.com/v1/bcy/test

https://www.blockcypher.com/dev/bitcoin/#blockchain-api



https://developer.bitaps.com/blockchain


https://mempool.emzy.de/docs/api/rest

https://mempool.emzy.de/testnet/docs/api/rest

***Blockcypher
https://api.blockcypher.com/v1/btc/main/addrs/bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d
https://api.blockcypher.com/v1/btc/main/addrs/bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d


***Blockchain.info
https://www.blockchain.com/explorer/api/blockchain_api

https://blockchain.info/balance?active=bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d
Multi Address
https://blockchain.info/multiaddr?active=bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d|bc1qx49fm4xf70nwqc3mhgd6743q9g0fkdwh9syc2c


https://blockchain.info/unspent?active=bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d
https://blockchain.info/btc-testnet/unspent?active=bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d



***Chain.so
https://chain.so/api/#code-examples

https://chain.so/api/v2/get_info/DASH
https://chain.so/api/v2/get_info/DASHTEST

https://chain.so/api/v2/get_info/BTC
https://chain.so/api/v2/get_info/BTCTEST
https://chain.so/api/v2/get_info/LTC
https://chain.so/api/v2/get_info/LTCTEST
https://chain.so/api/v2/get_info/DOGETEST
https://chain.so/api/v2/get_info/DOGE
https://chain.so/api/v2/get_address_balance/DOGE/DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1
https://chain.so/api/v2/get_address_received/DOGE/DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1
https://chain.so/api/v2/get_address_spent/DOGE/DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1

https://chain.so/api/v2/get_tx_unspent/DOGE/DRapidDiBYggT1zdrELnVhNDqyAHn89cRi

https://chain.so/api/v2/is_address_valid/DOGE/DM7Yo7YqPtgMsGgphX9RAZFXFhu6Kd6JTT

$ curl https://chain.so/api/v2/get_price/DOGE

$ curl https://chain.so/api/v2/get_price/DOGE/USD

***broadcast
POST /api/v2/send_tx/{NETWORK}
REQUEST

Provide a JSON object which contains the following fields:
tx_hex: string
$ curl -d 'tx_hex=0102100001ac…' https://chain.so/api/v2/send_tx/DOGE


{
  "utxo": {
    "blockchain.info": "https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=unspent&active=+address"
  },
  "transactions": {
    "blockchain.info": "https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=unspent&active=+txid+&r=+Math.random()"
  },
  "broadcast": {
    "blockchain.info": "https://chainz.cryptoid.info/blk/api.dws?q=pushtx&key=1205735eba8c"
  },
  "blockexplorer": {
    "blockchain.info": "https://chainz.cryptoid.info/blk/tx.dws?${txid}.htm"
  }
}
*/


/*
   @ return Available Blockchain Networks 
   @param string, all/mainnet/testnet

   returns object
  */

  wally_fn.getNetworks = function (chainType = 'all') {

    //defaults to mainnet, or else set to testnet
    var listChainTypes = ["all", "mainnet", "testnet"];

    try {
      if(!listChainTypes.includes(chainType))
        throw('Network type "'+chainType+'" not found!');

      if (chainType == "all") {
        console.log( 'list '+chainType +': ', this.networks);
        return this.networks;
      }

      //if(!this.networks.hasOwnProperty(chainType))
        //throw('Network type "'+chainType+'" not found!')
      console.log( 'list '+chainType +': ', this.networks[chainType]);
      return this.chainType;


    } catch (e) {
      console.log('wally_fn.listNetwork ERROR: ', e);
      //console.warn("");
    }
    return false;
  };


  /*
  @ Set Host name
  //Check if the script is hosted online or running locally
  */

  wally_fn.setHost = function() {
  
    if (document.location.host != '') {
      wally_fn.host = document.location.origin+'/';
      //wally_fn.host = document.protocol+document.location.host;
      console.log('running on server');
    } else {  //running locally
      wally_fn.host = document.location.pathname;
      console.log('running locally');
    }

    /*
  if (document.location.host) {
    // remote file over http or https
  } else {
    // local file
  }

    */
  };



})();





//DomReady.ready(function() {     




/*
 @ Checkbox for Disclaimer: on Login/Open Wallet form
 * Enable/Disable Loginbutton
*/
//document.getElementById('openCheckAcceptTerms').addEventListener('click', function() {

    /*
    var loginBtn = document.getElementById('openBtn');

    if (this.checked){
      loginBtn.disabled = false;
      loginBtn.insertAdjacentHTML('afterbegin', '<i class="bi bi-person-check-fill"></i> ');
    }else {
      loginBtn.disabled = true;
      if(loginBtn.hasChildNodes())
        loginBtn.removeChild( loginBtn.childNodes[0]);
    }
    */
//});






/*

libs.bitcoin.networks.crown = {
  messagePrefix: 'unused',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
  ,
  address: {
    "P2PKH(c),
    "P2SH(c)"
    "BECH32(c)",
    "P2PKH(u)"
  }
};

libs.bitcoin.networks.litecoin = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
  address: {
    "P2PKH(c),
    "P2SH(c)"
    "BECH32(c)",
    "P2PKH(u)"
  }
};


cash:
address: {
    "P2PKH(c)",
    "P2PKH(u)"
  }


libs.bitcoin.networks.blackcoin = {
  messagePrefix: '\x18BlackCoin Signed Message:\n',
  bip32: {
    public: 0x02CFBEDE,
    private: 0x02CFBF60
  },
  pubKeyHash: 0x19,
  scriptHash: 0x55,
  wif: 0x99
};

libs.bitcoin.networks.litecointestnet = {
  messagePrefix: '\x18Litecoin Signed Message:\n',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

libs.bitcoin.networks.dogecointestnet = {
  messagePrefix: '\x19Dogecoin Signed Message:\n',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394
  },
  pubKeyHash: 0x71,
  scriptHash: 0xc4,
  wif: 0xf1
};


libs.bitcoin.networks.lynx = {
  messagePrefix: '\x18Lynx Signed Message:\n',
  bip32: {
    public: 0x0488B21E,
    private: 0x0488ADE4,
  },
  pubKeyHash: 0x2d,
  scriptHash: 0x32,
  wif: 0xad,
};

"wallet_type" : [
  "name" : "regular",
  "login_type" : "password"
  "email": "email@address.com",
  "generated": [
    {"btc": [
        "address": "1Dj7MRrod3TYAJSLyhr7PVpgaogd1i8Lin"
        "compressed": false
        "privkey": "1bad6b8cf97131fceab8543e81f7757195fbb1d36b376ee994ad1cf17699c464"
        "pubkey": "04f93103a23ca52bd8fd6aa8f09876e7abf0b5dfc67bcf42377858c7e82db8bf81258ad511a5261528aade2327409d79e1e6e5028bf55892b35439112a32e3e9a6"
        "wif": "5J2UZfwTAap5P182EtaztK5Kup58n5Qi28wLCiT789XydzJpPbB"
      ]
    },
    {"bch": [
        {""},
        {""}
      ]
    },
  ],
  "passwords" : [
      {""},
      {""}
    ],
  "public_keys" : [
      {"btc": [
          {""},
          {""}
        ]
      },
      {"bch": [
          {""},
          {""}
        ]
      },
      {"ltc": [
          {""},
          {""}
        ]
      },
      {"doge": [
          {""},
          {""}
        ]
      }
    ],
    address: [
    "btc": [
      "P2PKH(c): "address",
      "P2SH(c): "address",
      "BECH32(c): "address",
      "P2PKH(u): "address"
    ],
    "ltc": [
      "P2PKH(c): "address",
      "P2SH(c): "address",
      "BECH32(c): "address",
      "P2PKH(u): "address"
    ],
    "bch": [
      "P2PKH(c): "address",
      "P2PKH(u): "address"
    ],
  ]
    "private_keys" : [  //wif format, private keys are generated from hex key!
      {"btc": [
          {""},
          {""}
        ]
      },
      {"bch": [
          {""},
          {""}
        ]
      },
      {"ltc": [
          {""},
          {""}
        ]
      },
      {"doge": [
          {""},
          {""}
        ]
      }
    ],
]
*/

/*profile_data = { 
      "address" : "", //only for choosen asset! there is no global address since Wally is a multi-blockchain wallet!
      "email" : "",   //deprecated ??
      "login_type" : "", //"password" (email & password login), "private_key" login, "import", mnemonic" login, "hdmaster" login
      "wallet_type" : walletType, //regular / multisig
      "redeem_script" : "", //used for multisig wallets
      "remember_me" : boolean,
      "pubkey_sorted": false, // check this when generating the private keys! - (it must be sorted if user wants to import to BitBay Client Wallet)
      "signatures" : signatures,  //total signatures/private keys needed for signing a transaction!
      
      "public_keys" : [
        {"btc": [
            {""},
            {""}
          ]
        },
        {"bch": [
            {""},
            {""}
          ]
        },
        {"ltc": [
            {""},
            {""}
          ]
        },
        {"doge": [
            {""},
            {""}
          ]
        }
      ],
      "passwords" : [
        {""},
        {""}
      ],
      "private_keys" : [  //wif format, private keys are generated from hex key!
        {"btc": [
            {""},
            {""}
          ]
        },
        {"bch": [
            {""},
            {""}
          ]
        },
        {"ltc": [
            {""},
            {""}
          ]
        },
        {"doge": [
            {""},
            {""}
          ]
        }
      ],
      "hex_key" : ""
      
      //"deterministic" : [
      //  {"xpub" : ""},
      //  {"xprv" : ""},
      //  {"seed" : ""}
      //],
      
      "imported_wallet" : [
      {"file1": ""},
      {"file2": ""},
      ]
    };
    */
//console.log('blockie:  ' + makeBlockie('0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8'));

//});
