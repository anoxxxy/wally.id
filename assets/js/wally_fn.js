'use strict';
/*
 @ Developed by Anoxy for Wally.id
 * Custom Misc. Functions for Wally.id
*/
(function() {
  var wally_fn = window.wally_fn = function() {};
  //location hash pages
  const routerPages = ["home", "newAddress", "newSegWit", "newMultiSig", "newHDaddress", "newTimeLocked", "newTransaction", "wallet", "about", "verify", "sign", "broadcast", "converter", "fee", "token"];
  //active/current coin/asset variables
  wally_fn.host = '';
  wally_fn.network = 'mainnet'; //this is the temporary network choosen in settings page but not saved (manual transactions)
  wally_fn.asset = 'bitcoin'; //this is the temporary asset choosen in settings page but not saved, (manual transactions)
  wally_fn.chainModel = 'utxo';
  wally_fn.provider = {
    utxo: '',
    broadcast: ''
  }; //(manual transactions)
  wally_fn.assetInfo = {}; //has a copy of "coinjs.asset" object, not used besides dabi (data-binding)
  //for mnemonic seeds and master XYZ keys 
  wally_fn.gap = {
    'limit': 5, //total receive/change addresses to generate initially
    'receive': 5, //total receive addresses to generate uponclick  load more button
    'change': 5, //total change addresses to generate upon click load more button
    'receivePage': 0, //page 2 -> shows 2*'receive' addresses
    'changePage': 0,
    'timeout': 10000, //timeout for loading more addresses, in ms
  };
  //not used yet
  wally_fn.wallet_settings = {
    asset: '',
    chainModel: '',
    provider: '',
  };

  //used with Mikado.js for template rendering
  wally_fn.tpl = {};
  wally_fn.tpl.seed = {};


  //wally_fn.availablePages = ["home", "newAddress", "newSegWit", "newMultiSig", "newTimeLocked", "newHDaddress", "newTransaction", "verify", "sign", "broadcast", "wallet", "settings", "about", "fees", "converter"];
  wally_fn.navigationPages = {
    "home": ['all'],
    "error_404": ['all'],
    "newAddress": ['utxo', 'account'],
    "newSegWit": ['utxo'],
    "newMultiSig": ['utxo'],
    "newTimeLocked": ['utxo'],
    "newHDaddress": ['all'],
    "newMnemonicAddress": ['all'],
    "newTransaction": ['utxo'],
    "verify": ['utxo', 'account'],
    "sign": ['utxo'],
    "broadcast": ['utxo'],
    "login": ['all'],
    "logout": ['all'],
    "wallet": ['all'],
    "settings": ['all'],
    "about": ['all'],
    "fees": ['utxo'],
    "converter": ['all'],
    "components": ['all'],
    "way-token": ['all'],
  };
  /*
   @ Validate Email address
  */
  wally_fn.validateEmail = function(email) {
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
  wally_fn.validatePassword = function(password) {
    var regex = /^(?=.{16,255})(?=.*[\d])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$€§%^£!»©«&*|←↓→+=¥½&<>;:.µ,^~¨¤{}´?`+"()'/ \\-]).{1,255}$/g
    return regex.test(password);
  }
  /**
   * Format a number with commas as thousands separators.
   *
   * @param {number} number - The number to be formatted.
   * @returns {string} The formatted number with commas.
   */
  wally_fn.formatNumberWithCommas = function(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  /**
  https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  */
  wally_fn.getUrlParams = function(url) {
    // get query string from url (optional) or window
    var qs = url ? url : window.location.search.slice(1);
    var qsHash = url ? url : window.location.hash.slice(1);
    var qs = qs.substring(qs.indexOf('?') + 1).split('&');
    var qsHash = qsHash.substring(qsHash.indexOf('#') + 1).split('&');
    console.log('qs', qs);
    console.log('qsHash', qsHash);
    /*
    //do we have any hash?
    qsSplit = qs.split('#');  //cointains only search params
    qs = qsSplit[0];
    var qsHash = qsSplit[1];  //contains hash if there is any
    qsHash = qsHash.split('&');
    */
    var result = {
      'search_params': {},
      'hash_params': {}
    };
    //var qs = url.substring(url.indexOf('?') + 1).split('&');
    //search params
    for (var i = 0, tmp; i < qs.length; i++) {
      qs[i] = qs[i].split('=');
      if (qs[i][0].includes('#')) {
        tmp = qs[i][0].split('#');
        qs[i][0] = tmp[0];
        result.search_params['_hashtag_'] = tmp[1];
      }
      if (qs[i][0] != '')
        result.search_params[qs[i][0]] = (typeof(qs[i][1]) === 'undefined' ? undefined : decodeURIComponent(qs[i][1]));
    }
    //hashtag params
    for (var i = 0, tmp; i < qsHash.length; i++) {
      qsHash[i] = qsHash[i].split('=');
      if (qsHash[i][0].includes('?')) {
        tmp = qsHash[i][0].split('?');
        qsHash[i][0] = tmp[1];
        result.hash_params['_hashtag_'] = tmp[0].trim('/');
      }
      if (qsHash[i][0] != '')
        result.hash_params[qsHash[i][0]] = (typeof(qsHash[i][1]) === 'undefined' ? undefined : decodeURIComponent(qsHash[i][1]));
    }
    result = Object.assign(result.search_params, result.hash_params)
    if (result['_hashtag_'] === undefined)
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
  wally_fn.sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /*
  @ Hash the email + password upon account login
  */
  wally_fn.passwordHasher = function(email, pass) {
    var s = email;
    s += '|' + pass + '|';
    s += s.length + '|!@' + ((pass.length * 7) + email.length) * 7;
    var regchars = (pass.match(/[a-z]+/g)) ? pass.match(/[a-z]+/g).length : 1;
    var regupchars = (pass.match(/[A-Z]+/g)) ? pass.match(/[A-Z]+/g).length : 1;
    var regnums = (pass.match(/[0-9]+/g)) ? pass.match(/[0-9]+/g).length : 1;
    s += ((regnums + regchars) + regupchars) * pass.length + '3571';
    s += (s + '' + s);
    for (var i = 0; i <= 50; i++) {
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
  wally_fn.Hex2Decimal = function(h) {
    //return BigInt("0x" + h);
    //return BigInt("0x" + h).toString(10); 
    return parseInt(h, 16);
  }
  /*
   @ Hex to Decimal
   param number
   https://jsbin.com/heloduxota/edit?js,console,output
  */
  wally_fn.Decimal2Hex = function(n) {
    //return n.toString(16);
    return new BigInteger(h, 10).toString(16);
  }
  wally_fn.isHex = function(str) {
    var regexHex = /^[0-9a-fA-F]+$/;
    if (regexHex.test(str))
      return true;
    else
      return false;
  }
  wally_fn.isDecimal = function(s) {
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
  wally_fn.isHexKeyInRange = function(key, options = {
    'show_error': true
  }) {
    try {
      console.log('===wally_fn.isHexKeyInRange===');
      //console.log('key before: '+ key);
      if (key.length > 78) //highest possible decimal length for last crypto address
        return false;
      //use max safe integer to determine if key is valid
      if (key <= 9007199254740991) //Number.MAX_SAFE_INTEGER
        return true;
      //we got a BIG number! validate it!
      //var lastHexKeyInRange = new BigInteger('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140', 16).toString(16);
      var lastDecKeyinRange = new BigInteger('115792089237316195423570985008687907852837564279074904382605163141518161494336');
      var keyBig, keyLength = key.length;
      if (this.isDecimal(key)) {
        console.log('is DIGIT');
        //just to reduce time-elapse for this function!
        if (keyLength < 78)
          return true;
        //if key DEC length has more then 79 chars -> out of range!
        if (keyLength > 79)
          return false;
        keyBig = new BigInteger(key);
      } else {
        if (!this.isHex(key))
          throw ('Key is not in HEX format!');
        //console.log('Key is in HEX format');
        //remove 0x HEX identifier
        if (key.slice(0, 2) == '0x')
          key = key.replace('0x', '');
        //strip all leading 0's:
        key = key.replace(/^0+/, "");
        if (keyLength < 64)
          return true;
        //if key HEX length has more then 66 chars -> out of range!
        if (keyLength > 66) //we add 0x to the length which gives us 66 chars!
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
      if (keyIsBiggerThenLastKey < 1)
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
  /* Generate Password Functions*/
  //https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript
  wally_fn.generatePassword = function(length = 64, wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!"#$%&\'()*+,-.¨/¤:;<€½¶§=>?@[\]^_`´{|}~') {
    var generatePass = (
        //length = 20,
        //wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!"#$%&\'()*+,-.¨/¤:;<€½¶§=>?@[\]^_`´{|}~'
      ) =>
      Array.from(crypto.getRandomValues(new Uint32Array(length)))
      .map((x) => wishlist[x % wishlist.length])
      .join('');
    return wally_fn.shuffleWord(generatePass());
  }
  /*
  @ Vanity Address Generator
  */
  wally_fn.vanityAddress = async function(searchAddress, times = 50) {
    var coin, genPassword, passLength;
    var minLength = 48,
      maxLength = 1000;
    for (i = 0; i <= times; i++) {
      passLength = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength);
      genPassword = this.generatePassword(passLength);
      coinjs.compressed = true;
      coin = coinjs.newKeys(genPassword);
      if ((coin.address).includes(searchAddress)) {
        console.log('Vanity Address Found (C): ', coin);
        break;
        return true;
      }
      coinjs.compressed = false;
      coin = coinjs.newKeys(genPassword);
      if ((coin.address).includes(searchAddress)) {
        console.log('Vanity Address Found (U): ', coin);
        break;
        return true;
      }
      /*
       genAddress = this.hexPrivKeyDecode(coin.privkey);
       console.log('genAddress: ', genAddress);

      if ( (genAddress.wif.compressed.address).includes(genAddress) || (genAddress.wif.uncompressed.address).includes(genAddress)) {
        console.log('Vanity Address Found (C): ', genAddress.wif.compressed.address, genAddress.wif.compressed.key);
        console.log('Vanity Address Found (U): ', genAddress.wif.uncompressed.address, genAddress.wif.uncompressed.key);
      }

      */
      console.log('Vanity test:' + i);
      await wally_fn.timeout(15);
    }
    return false;
  }
  /*
   @Generate all addresses for supported assets
  */
  /* decode/convert HEX privkey to addresses, privkeys, compressed and uncompressed*/
  wally_fn.hexPrivKeyDecode = function(h, options = {
    'supports_address': ['compressed', 'uncompressed'],
    'show_error': true
  }) {
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
      if (this.isDecimal(h)) {
        //h = this.Decimal2Hex(h);
        //h = h.padStart(64, '0');
        h = new BigInteger(h).toString(16);
        //console.log('we got a digit, encode to hex');
      }
      //if (!this.isHex(h)) //not needed, we are already checking this in the request to isHexKeyInRange!
      //throw ('Parameter is not in HEX format!');
      h = (h.toString()).padStart(64, '0'); //wif should always be in 32bit/64 chars!
      //console.log('h after: '+h)
      //check if HEXkey is in range!
      if (!this.isHexKeyInRange(h, {
          'show_error': options.show_error
        }))
        throw ('HexKey is not in Range!');
      var keyInDecimal = new BigInteger(h, 16).toString(10);
      //console.log('keyInDecimal: '+keyInDecimal);
      //***Begin address creation
      var r = Crypto.util.hexToBytes(h);
      //***Compressed, is used for bech32 and segwit addresses
      r.push(0x01); //set compress true
      r.unshift(coinjs.priv);
      var hash = Crypto.SHA256(Crypto.SHA256(r, {
        asBytes: true
      }), {
        asBytes: true
      });
      var checksum = hash.slice(0, 4);
      var privKeyWifC = coinjs.base58encode(r.concat(checksum));
      var addressC = coinjs.wif2address(privKeyWifC);
      var pubKeyC = coinjs.wif2pubkey(privKeyWifC);
      //generate additional addresses like bech32 and segwit ?
      var address_formats = {};
      //console.log('options.length: '+options.length);
      //console.log('options: ',options);
      if (options.supports_address.length) {
        if (options.supports_address.includes('bech32')) {
          var swbech32C = coinjs.bech32Address(pubKeyC.pubkey);
          address_formats.bech32 = swbech32C;
        }
        if (options.supports_address.includes('segwit')) {
          var swC = coinjs.segwitAddress(pubKeyC.pubkey);
          address_formats.segwit = swC;
        }
      }
      //console.log('address_formats: ', address_formats);
      //***Uncompressed
      //uncompressed addresses is not supported for bech32 and segwit!
      //var r = r2;
      var unCompressedData = {};
      if (options.supports_address.includes('uncompressed')) {
        var r = Crypto.util.hexToBytes(h);
        r.unshift(coinjs.priv);
        var hash = Crypto.SHA256(Crypto.SHA256(r, {
          asBytes: true
        }), {
          asBytes: true
        });
        var checksum = hash.slice(0, 4);
        var privKeyWifU = coinjs.base58encode(r.concat(checksum));
        var addressU = coinjs.wif2address(privKeyWifU);
        var pubKeyU = coinjs.wif2pubkey(privKeyWifU);
        unCompressedData = {
          'key': privKeyWifU,
          'public_key': pubKeyU.pubkey,
          'public_key_hash': coinjs.address2ripemd160(addressU.address),
          'address': addressU.address,
        };
      }
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
          /*'uncompressed':{
            'key': privKeyWifU,
            'public_key': pubKeyU.pubkey,
            'public_key_hash': coinjs.address2ripemd160(addressU.address),
            'address': addressU.address,
          }
          */
        }
      };
      //is segwit and bech32 addresses generated?
      if (Object.keys(address_formats).indexOf('bech32') !== -1)
        hexGenerated.wif.compressed.bech32 = address_formats.bech32;
      if (Object.keys(address_formats).indexOf('segwit') !== -1)
        hexGenerated.wif.compressed.segwit = address_formats.segwit;
      if (options.supports_address.includes('uncompressed'))
        hexGenerated.wif.uncompressed = unCompressedData;
      //console.log('hexGenerated: ', hexGenerated);
      return hexGenerated;
      //var privKeyWifC= coinjs.privkey2wif(hex);
      //generate segwit and bech32 address 
      //var swbech32 = coinjs.bech32Address(coin.pubkey);
      //var sw = coinjs.segwitAddress(coin.pubkey);
    } catch (err) {
      console.log('ERROR (hexPrivKeyDecode): Out of Range! Error generating ' + coinjs.asset.name + ' address!: ', err)
    }
    return false;
  }
  /**
   * Extracts the BIP protocol from a given derivation path.
   *
   * @param {string} derivationPath - The derivation path to extract the BIP protocol from.
   * @returns {string|null} The extracted BIP protocol or hdkey if not found.
   *
   */
  wally_fn.extractBIPProtocol = function(derivationPath) {
    // Use a regular expression to match the BIP protocol and the first integer after "m"
    const match = derivationPath.match(/m\/(\d+)\/?/);
    // Check if a match was found
    if (match && match.length > 1) {
      const firstInteger = parseInt(match[1], 10);
      // Determine the BIP protocol based on the first integer
      var bipProtocol = 'hdkey'; //default to hdkey/bip32
      if (firstInteger === 44) {
        bipProtocol = 'bip44';
      } else if (firstInteger === 49) {
        bipProtocol = 'bip49';
      } else if (firstInteger === 84) {
        bipProtocol = 'bip84';
      }
    }
    // If no match or unknown integer, return undefined
    return bipProtocol;
  }
  /*@ Decode HD key (prv/pub)*/
  wally_fn.hdKeyDecode = async function(key, options = {
    'supports_address': ['compressed', 'uncompressed'],
    'show_error': true
  }, bip = 'bip44', address_semantics = '', ) {
    console.log('===wally_fn.hdKeyDecode===');
    console.log('===wally_fn.hdKeyDecode=== coin: ', coinjs.asset.name);
    try {
      coinjs.compressed = true;
      var s = key;
      var hex = Crypto.util.bytesToHex(coinjs.base58decode(s).slice(0, 4));
      console.log('hex: ', hex);
      var derive_success = false;
      var is_privkey = false;
      var hdKeyDecoded = {};

      function hdKeycheckAndProcess(prv, pub, type) {
        console.log('hdKeycheckAndProcess hd: ', coinjs.asset.name, type);
        const hex_cmp_prv = Crypto.util.bytesToHex(coinjs.numToBytes(prv, 4).reverse());
        const hex_cmp_pub = Crypto.util.bytesToHex(coinjs.numToBytes(pub, 4).reverse());
        if (hex === hex_cmp_prv || hex === hex_cmp_pub) {
          var hd = coinjs.hd(s);
          console.log(`hdKeycheckAndProcess xPrv ${type}`);
          console.log('hdKeycheckAndProcess hd: ', hd.type);
          console.log('hdKeycheckAndProcess hd type: ', coinjs[type], type, coinjs.asset.name);
          if (hd.type === "private") {
            is_privkey = true;
          }
          hdKeyDecoded.s = s;
          hdKeyDecoded.chain_code = hd.chain_code;
          hdKeyDecoded.hd_type = type;
          hdKeyDecoded.depth = hd.depth;
          hdKeyDecoded.version = `0x${hd.version.toString(16)}`;
          hdKeyDecoded.child_index = hd.child_index;
          hdKeyDecoded.hdwifkey = hd.keys.wif || '';
          hdKeyDecoded.hdhexkey = hd.keys.hexkey || '';
          hdKeyDecoded.hdpubkey = hd.keys.pubkey || '';
          hdKeyDecoded.hdaddress = hd.keys.hdaddress || '';
          hdKeyDecoded.key_type = hd.type;
          hdKeyDecoded.key_type_text = `${hd.depth === 0 && hd.child_index === 0 ? 'Master' : 'Derived'} ${hd.type}`.toLowerCase() + `, Protocol:` + `${hd.bip}`.toUpperCase();
          hdKeyDecoded.parent_fingerprint = Crypto.util.bytesToHex(hd.parent_fingerprint);
          //deriveHDaddress(hd, type);
          console.log(`verifyHDaddress hdKeycheckAndProcess: BIP type: ${type}`);
          derive_success = true;
          return true;
        }
        return false;
      }
      var isHDKey, isBip49, isBip84;
      //check and process BIP derivations
      var isHDKey = hdKeycheckAndProcess(coinjs.hdkey.prv, coinjs.hdkey.pub, 'hdkey'); //same path as bip32,bip39, bip44
      //hdKeyDecoded = isHDKey;
      console.log('hdKeyDecoded1: ', hdKeyDecoded, coinjs.asset.name);
      if (!isHDKey) {
        if (coinjs.bip49?.prv)
          var isBip49 = hdKeycheckAndProcess(coinjs.bip49.prv, coinjs.bip49.pub, 'bip49');
        //hdKeyDecoded = isBip49;
      }
      console.log('hdKeyDecoded2: ', hdKeyDecoded, coinjs.asset.name);
      if (!isHDKey && !isBip49) {
        if (coinjs.bip84?.prv)
          var isBip84 = hdKeycheckAndProcess(coinjs.bip84.prv, coinjs.bip84.pub, 'bip84');
        //hdKeyDecoded = isBip84;
      }
      console.log('derive_success: ', derive_success);
      console.log('hdKeyDecoded3: ', hdKeyDecoded, coinjs.asset.name);
      if (isHDKey || isBip49 || isBip84) {
        if (is_privkey)
          hdKeyDecoded.key_type = 'prv';
        else
          hdKeyDecoded.key_type = 'pub';
      } else
        throw ('No matching BIP key type found.');
      return hdKeyDecoded;
    } catch (err) {
      console.log('===wally_fn.hdKeyDecode=== err: ', err);
      return false;
    }
  }
  wally_fn.getMasterKeyFromMnemonic = async function(password, mnemonic, protocol = '') {
    console.log('===wally_fn.getMasterKeyFromMnemonic===', password, mnemonic, protocol);
    var hd = coinjs.hd();
    //set default bipProtocol
    var bipProtocol = 'bip44';
    if (password !== null) {
      if (protocol.name.includes('electrum'))
        password = password.toLowerCase(); //electrum uses lowercase for passwords
    }
    //check if we have an old electrum seed, if so set 
    if (protocol.name.includes('electrum')) {
      var electrumSeedVersion = wally_fn.seedVersion(mnemonic, 'electrum');
      if (electrumSeedVersion === 'p2pkh') {
        bipProtocol = 'hdkey';
      }
    }
    var keyPair = hd.masterMnemonic(mnemonic, password, bipProtocol);
    //console.log('getMasterKeyFromMnemonic keyPair: ', keyPair);
    var s;
    //Electrum Master Key generation
    if (protocol.name.includes('electrum')) {
      if (electrumSeedVersion === 'p2wpkh') {
        s = keyPair.privkey;
        var hex = Crypto.util.bytesToHex(coinjs.base58decode(s).slice(0, 4));
        hd = coinjs.hd(s);
        //set electrum path promptly
        var derived_electrum = hd.derive_electrum_path("m/0'/0/0", 'bip84', 'hdkey', 'p2wpkh'); //derive from hdkey, a bip84 key, in p2wpkh format :) lol :)
        keyPair.pubkey = derived_electrum.keys_extended.pubkey;
        keyPair.privkey = derived_electrum.keys_extended.privkey;
      }
    }
    /* else {
        //hd = coinjs.hd(s);
      }
      
      console.log('getMasterKeyFromMnemonic hd: ' , hd);
      console.log('getMasterKeyFromMnemonic keyPair.privkey: ' + keyPair.privkey);
      console.log('getMasterKeyFromMnemonic keyPair.pubkey: ' + keyPair.pubkey);
      */
    return keyPair;
  }

  // init address balance structure
  wally_fn.initAddressBalance = function () {
    return {
      "total_sent": 0,
      "total_received": 0,
      "final_balance": 0,
      "n_tx": 0
    };
  }

  /*
   @ Load more Addresses from Master key
   addressType (string), 'both', 'change', 'receive'
  */
  wally_fn.loadWalletSeedAddresses = async function(addressType = 'both') {
    console.log('==wally_fn.loadWalletSeedAddresses==');
    coinbinf.NoticeLoader.setTitle(`<img src="${coinjs.asset.icon}" class="coin-icon icon24"> Loading Addresses...`);
    coinbinf.NoticeLoader.open();
    var masterKey = login_wizard.profile_data.seed.keys.privkey;
    var hd = coinjs.hd(masterKey);
    var isEVM = wally_fn.isEVM();
    var client_wallet_protocol_index = login_wizard.profile_data.seed.protocol.index;
    var clientWallet = login_wizard.clientWallets[client_wallet_protocol_index];
    var hardenedAddress = "";
    if (clientWallet.address.hardened)
      hardenedAddress = "'";
    //generate receive addresses
    var derived = {};
    var receive = [];
    var change = [];
    var tmp = {}; //for tmp storing derived addresses
    var receivePath, changePath;
    var addressesLength = 0; //counts the total addresses for the user
    if (addressType === 'receive' || addressType === 'both') {
      addressesLength = (login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses.receive).length;
      var nextGapLimit = addressesLength + wally_fn.gap.receive;
      //limit receive addresses depending on its chain
      var coinChain = wally_fn.coinChainIs();
      var maxReceiveAddresses = wally_fn.chains.config[coinChain].seed.address.receive.max;
      if (nextGapLimit > maxReceiveAddresses)
        nextGapLimit = maxReceiveAddresses;
      // adapt path to coin slip path
      receivePath = clientWallet.address.receive;
      receivePath = receivePath.replace('{coin}', coinjs.slip_path);
      console.log('receivePath 1: ', receivePath);
      for (var i = addressesLength; i < nextGapLimit; i++) {
        derived = hd.derive_path(receivePath + '/' + i + hardenedAddress, clientWallet.derivationProtocol, clientWallet.derivationProtocol, clientWallet?.address?.semantics);
        coinbinf.NoticeLoader.setContent(`<span class="text-primary">Receive Addresses: <strong>${i+1}</strong>/${nextGapLimit}</span>`);
        await wally_fn.timeout(5);
        //console.log('derived: ', derived);
        if (isEVM) {
          var evm_account = wally_fn.Web3PrivToAddress(derived.keys.privkey);
          derived.keys.address = evm_account.address;
          derived.keys.privkey = evm_account.privkey;
          derived.keys.pubkey = '0x' + derived.keys.pubkey;
        }
        //console.log('derived: ', derived);
        tmp = {
          'address': derived.keys.address,
          'privkey': derived.keys.privkey,
          'pubkey': derived.keys.pubkey,
          'type': derived.type,
          'version': derived.version,
          'wif': derived.keys.wif,
          'ext': wally_fn.initAddressBalance()
        };
        (login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses.receive).push(tmp);
        receive = derived;
        derived = {};
      }
    }
    if (addressType === 'change' || addressType === 'both') {
      addressesLength = (login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses.change).length;
      var nextGapLimit = addressesLength + wally_fn.gap.change;
      //limit receive addresses depending on its chain
      var coinChain = wally_fn.coinChainIs();
      var maxChangeAddresses = wally_fn.chains.config[coinChain].seed.address.change.max;
      //limit receive addresses depending on its chain
      if (nextGapLimit > maxChangeAddresses)
        nextGapLimit = maxChangeAddresses;
      // adapt path to coin slip path
      changePath = clientWallet.address.change;
      changePath = changePath.replace('{coin}', coinjs.slip_path);
      console.log('changePath 1: ', changePath);
      for (var i = addressesLength; i < nextGapLimit; i++) {
        derived = hd.derive_path(changePath + '/' + i + hardenedAddress, clientWallet.derivationProtocol, clientWallet.derivationProtocol, clientWallet?.address?.semantics);
        coinbinf.NoticeLoader.setContent(`<span class="text-primary">Change Addresses: <strong>${i+1}</strong>/${nextGapLimit}</span>`);
        await wally_fn.timeout(5);
        //console.log('derived: ', derived);
        if (isEVM) {
          var evm_account = wally_fn.Web3PrivToAddress(derived.keys.privkey);
          derived.keys.address = evm_account.address;
          derived.keys.privkey = evm_account.privkey;
          derived.keys.pubkey = '0x' + derived.keys.pubkey;
        }
        //console.log('derived: ', derived);
        tmp = {
          'address': derived.keys.address,
          'privkey': derived.keys.privkey,
          'pubkey': derived.keys.pubkey,
          'type': derived.type,
          'version': derived.version,
          'wif': derived.keys.wif,
          'ext': wally_fn.initAddressBalance()
        };
        (login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses.change).push(tmp);
        change = derived;
        derived = {};
      }
    }
    //save generated data settings - user dependent
    if (login_wizard.profile_data.remember)
      storage_s.set('wally.profile', login_wizard.profile_data);
    coinbinf.NoticeLoader.close();
    return {
      receive,
      change
    };
  }
  /*
   @ Generate Addresses from Master key
   derive is an object, including
  */
  wally_fn.getMasterKeyAddresses = async function(masterKey, client_wallet_protocol_index = 0, receive_addresses = true, change_addresses = true) {
    console.log('==wally_fn.getMasterKeyAddresses==', masterKey);
    coinbinf.NoticeLoader.setTitle(`<img src="${coinjs.asset.icon}" class="coin-icon icon24"> Loading Addresses...`);
    coinbinf.NoticeLoader.open();
    var receive = [];
    var change = [];
    var receivePath, changePath;
    //set default bipProtocol
    var bipProtocol = 'bip44';
    var clientWallet = login_wizard.clientWallets[client_wallet_protocol_index];
    console.log('clientWallet: ', clientWallet);
    //var derivation_path = clientWallet.path;
    //if (clientWallet.slug === 'electrum')
    //derivation_path = clientWallet.childPath;
    /*
    console.log('===coinjs.getMasterKeyFromMnemonic=== extraced BIP: ' + bipProtocol);
    console.log('===coinjs.getMasterKeyFromMnemonic=== derivationProtocol: ' + clientWallet.derivationProtocol);
    console.log('===coinjs.getMasterKeyFromMnemonic=== addressSemantics: ' + clientWallet?.address?.semantics);
    console.log('===coinjs.getMasterKeyFromMnemonic=== login_wizard.gapLimit: ' + login_wizard.gapLimit);
    */
    var hd = coinjs.hd(masterKey);
    var hardenedAddress = "";
    if (clientWallet.address.hardened)
      hardenedAddress = "'";
    //generate receive addresses
    var derived;
    /*
              var evm_account = wweb3.eth.accounts.privateKeyToAccount(account_key);

              console.log('evm_account privateKeyToAccount: ', evm_account);
                
              walletAddress[key][i] = {};
              walletAddress[key][i].address = evm_account.address;
              walletAddress[key][i].privateKey = evm_account.privateKey;
              */
    var isEVM = wally_fn.isEVM();

    //EVM has always path m/44'/, EVM default path
    var EVM_path = "";
    if (isEVM && clientWallet.address.evmPath)
      EVM_path = clientWallet.address.evmPath;


    
    

    if (receive_addresses) {
      //limit receive addresses depending on its chain
      var coinChain = wally_fn.coinChainIs();
      var maxReceiveAddresses = wally_fn.chains.config[coinChain].seed.address.receive.max;
      var nextGapLimit = wally_fn.gap.limit;
      if (nextGapLimit > maxReceiveAddresses)
        nextGapLimit = maxReceiveAddresses;
      // adapt path to coin slip path
      receivePath = clientWallet.address.receive;
      receivePath = receivePath.replace('{coin}', coinjs.slip_path);

      // Replace the first characters of receivePath with EVM_path
      if (EVM_path != "")
        receivePath = EVM_path + receivePath.slice(EVM_path.length);

      console.log('receivePath 2: ', receivePath);
      

      for (var i = 0; i < nextGapLimit; i++) {
        //console.log('===coinjs.getMasterKeyFromMnemonic=== receivePath derivation_path: ' + derivation_path+'/'+i);
        derived = hd.derive_path(receivePath + '/' + i + hardenedAddress, clientWallet.derivationProtocol, clientWallet.derivationProtocol, clientWallet?.address?.semantics);
        coinbinf.NoticeLoader.setContent(`<span class="text-primary">Receive Addresses: <strong>${i+1}</strong>/${nextGapLimit}</span>`);
        await wally_fn.timeout(5);
        //console.log('derived: ', derived);
        if (isEVM) {
          var evm_account = wally_fn.Web3PrivToAddress(derived.keys.privkey);
          console.log('evm_account receive: ', evm_account);
          derived.keys.address = evm_account.address;
          derived.keys.privkey = evm_account.privkey;
          derived.keys.pubkey = '0x' + derived.keys.pubkey;
        }
        receive.push(derived);
        derived = {};
      }
    }
    //generate change addresses
    if (change_addresses) {
      //limit receive addresses depending on its chain
      var coinChain = wally_fn.coinChainIs();
      var maxChangeAddresses = wally_fn.chains.config[coinChain].seed.address.change.max;
      if (nextGapLimit > maxChangeAddresses)
        nextGapLimit = maxChangeAddresses;
      // adapt path to coin slip path
      changePath = clientWallet.address.change;
      changePath = changePath.replace('{coin}', coinjs.slip_path);

      // Replace the first characters of receivePath with EVM_path
      if (EVM_path != "")
        changePath = EVM_path + changePath.slice(EVM_path.length);

      console.log('changePath 2: ', changePath);
      for (var i = 0; i < wally_fn.gap.limit; i++) {
        //console.log('===coinjs.getMasterKeyFromMnemonic=== changePath derivation_path: ' + derivation_path+'/'+i);
        derived = hd.derive_path(changePath + '/' + i + hardenedAddress, clientWallet.derivationProtocol, clientWallet.derivationProtocol, clientWallet?.address?.semantics);
        coinbinf.NoticeLoader.setContent(`<span class="text-primary">Change Addresses:  <strong>${i+1}</strong>/${nextGapLimit}</span>`);
        await wally_fn.timeout(5);
        if (isEVM) {
          var evm_account = wally_fn.Web3PrivToAddress(derived.keys.privkey);
          console.log('evm_account change: ', evm_account);
          derived.keys.address = evm_account.address;
          derived.keys.privkey = evm_account.privkey;
          derived.keys.pubkey = '0x' + derived.keys.pubkey;
        }
        change.push(derived);
        derived = {};
      }
    }
    var derivePath = (clientWallet?.childPath) ? clientWallet.childPath : clientWallet.path;
    derivePath = derivePath.replace('{coin}', coinjs.slip_path);
    derivePath = wally_fn.stripLastPathComponent(derivePath);
    var path = {
      'receive': receivePath ?? null,
      'change': changePath ?? null,
      'derivePath': derivePath,
      isHardened: clientWallet.address.hardened
    };
    coinbinf.NoticeLoader.close();
    //console.log('derived: ', derived);
    return {
      receive,
      change,
      path
    };
  };
  /*
   @ generate the EVM address from private hexkey 
   @ param array: h  (hex-string)
  */
  wally_fn.Web3PrivToAddress = function(privkey) {
    var evm_account = wweb3.eth.accounts.privateKeyToAccount(privkey);
    var address = evm_account.address;
    var privateKey = evm_account.privateKey;
    return {
      'address': address,
      'privkey': privateKey
    };
  }

  /*Compress the key-data from derived addresses */
  wally_fn.derivedToCompressed = function(derived) {
    var derivedCompressed = [];
    for (var i = 0; i < derived.length; i++) {
      derivedCompressed[i] = {
        'address': derived[i].keys.address,
        'privkey': derived[i].keys.privkey,
        'wif': derived[i].keys.wif,
        'pubkey': derived[i].keys.pubkey,
        'type': derived[i].type,
        'version': derived[i].version,
        'ext': wally_fn.initAddressBalance()
      };
    }
    return derivedCompressed;
  }
  /*
   @ return if coinjs is set to EVM/Web3 coin
  */
  wally_fn.isEVM = function() {
    var isEVM = (coinjs.asset.chainModel == 'account' || coinjs.asset.platform == 'evm') ? true : false;
    return isEVM
  }
  wally_fn.coinChainIs = function() {
    var coinType;
    if (coinjs.asset.chainModel == 'utxo')
      coinType = 'utxo';
    else if (coinjs.asset.chainModel == 'account' || coinjs.asset.chainModel == 'evm')
      coinType = 'evm';
    return coinType;
  };
  /**
   * Removes the last component from a given path.
   *
   * @param {string} path - The path to remove the last component from.
   * @returns {string} The path with the last component removed.
   */
  wally_fn.stripLastPathComponent = function(path) {
    const lastSlashIndex = path.lastIndexOf('/');
    return lastSlashIndex !== -1 ? path.substring(0, lastSlashIndex) : path;
  }
  /*
  @ Generate Wallet addresses for a coin
  param array: s  (seed or master key)
  */
  wally_fn.generateWalletMnemonicAddresses = async function(p, s, protocol) {
    console.log('=================wally_fn.generateWalletMnemonicAddresses=================', p, s, protocol);
    //check if coin has support for the wallet client / bip brotocol
    if (!coinjs[protocol.bip]) {
      //if (!coinjs.bip84) {
      console.log('===wally_fn.generateWalletMnemonicAddresses=== ERROR: Coin has not support for ' + protocol.bip);
      return;
    }
    var isEVM = wally_fn.isEVM();
    var coinChanIs = wally_fn.coinChainIs();
    var deriveReceiveAddresses = true;
    var deriveChangeAddresses = true;
    if (isEVM) {
      deriveChangeAddresses = false;
    }
    var clientProtocolIndex = protocol.index;
    //switch client to "electrum old" seed generation if new seedVersion is not met!
    var electrumSeedVersion = wally_fn.seedVersion(s, 'electrum');
    if (electrumSeedVersion === 'p2pkh') {
      clientProtocolIndex = 7;
      login_wizard.profile_data.seed.protocol.name = 'electrum_old';
      login_wizard.profile_data.seed.protocol.index = 7;
      login_wizard.profile_data.seed.protocol.bip = 'bip32';
    }
    /* else if (electrumSeedVersion === 'p2wpkh') {
        //nothing here yet...
      }
      */
    //generate mnemonic derivation for each coin/asset
    login_wizard.profile_data.seed.keys = await wally_fn.getMasterKeyFromMnemonic(p, s, protocol);
    //login_wizard.profile_data.seed.addresses
    var seed_addresses = await wally_fn.getMasterKeyAddresses(login_wizard.profile_data.seed.keys.privkey, clientProtocolIndex, deriveReceiveAddresses, deriveChangeAddresses);
    //extract only privkey,pubkey and address from derived data
    var receiveAddresses = wally_fn.derivedToCompressed(seed_addresses.receive);
    var changeAddresses = wally_fn.derivedToCompressed(seed_addresses.change);
    console.log('seed_addresses: ', seed_addresses);
    login_wizard.profile_data.seed.path = seed_addresses.path;
    console.log('receiveAddresses: ', receiveAddresses);
    console.log('changeAddresses: ', changeAddresses);
    console.log('wally_fn.coinChainIs(): ',  coinChanIs);
    var coinGenerated = {
      'chainModel': coinjs.asset.chainModel,
      'seed': {
        'keys': login_wizard.profile_data.seed.keys,
        'protocol': protocol,
        'path': seed_addresses.path,
      },
      0: {
        'address': receiveAddresses[0].address,
        'view': {
          'receive': [],
          'change': []
        },
        'addresses_supported': {
          'compressed': {
            'address': receiveAddresses[0].address,
            'key': coinChanIs === 'utxo' ? receiveAddresses[0].wif : receiveAddresses[0].privkey,
            'wif': coinChanIs === 'utxo' ? receiveAddresses[0].wif : '',
            'hexkey': coinChanIs === 'utxo' ? receiveAddresses[0].privkey : receiveAddresses[0].privkey.slice(2), // Remove the first 2 characters "0x" for EVM coins
            'public_key': receiveAddresses[0].pubkey,
          },
        },
      },
    };
    login_wizard.profile_data.generated[coinjs.asset.slug] = coinGenerated;
        
      // 0 key for single addresses, with multisig for seeds it will change
    login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses = {
      'receive': receiveAddresses,
      'change': changeAddresses
    };
    //if the coin is EVM, apply receive and change addresses to all EVM chains since they use same addresses
    if (isEVM) {
      // Loop through the coins, and if EVM chains are found, add receive addresses to them all
      for (var [key, value] of Object.entries(wally_fn.networks[coinjs.asset.network])) {
        if (value.asset.platform === 'evm') {
          login_wizard.profile_data.generated[value.asset.slug] = coinjs.clone(coinGenerated);  // Clone object, don't share object reference!
        }
      }
    }

    //save generated data settings - user dependent
    if (login_wizard.profile_data.remember)
      storage_s.set('wally.profile', login_wizard.profile_data);
    return {
      coinGenerated,
      'addresses': {
        'receive': receiveAddresses,
        'change': changeAddresses
      }
    };
  }
  /*
  @ Generate Wallet addresses upon Login, compressed or single keys for assets/coins
  param array: h  (hex-string for private key)
  */
  wally_fn.generateAllWalletAddresses = async function(h) {
    console.log('=================wally_fn.generateAllWalletAddresses=================', h);
    let coinListModal = BootstrapDialog.show({
      title: 'Generating Wallet Addresses',
      message: function(dialogRef) {
        var $content = $('<div>Progress: <ul id="initCoinList" class="list-group initCoinList"></ul></div>');
        return $content;
      },
      closable: false,
      verticalCentered: true,
      closeByBackdrop: false,
      closeByKeyboard: false,
      data: {
        'coin-name': '',
      },
      buttons: [{
        label: 'Please wait ...',
        cssClass: 'btn-sm btn-flat-primary',
        action: function(dialogRef) {}
      }]
    });
    var genAddress;
    var walletAddress = {}; //used for regular address generation
    var keys_combined = []; //used for multisig address generation
    var keys_length = h.length;
    console.log('h: ', h);
    console.log('keys_length: ' + keys_length);
    for (var [key, value] of Object.entries(wally_fn.networks[coinjs.asset.network])) {
      //console.log('loop for key, value: '+ key, value);
      //add coin/asset to the object if not found
      if (!walletAddress.hasOwnProperty(key))
        walletAddress[key] = {};
      //UTXO coins
      if (value.asset.chainModel == 'utxo') {
        //asset supports compressed keys?
        if ((value.asset.supports_address).includes('compressed')) {
          $.extend(coinjs, value); //change asset and generate address
          for (var i = 0; i < keys_length; i++) {
            genAddress = this.hexPrivKeyDecode(h[i], {
              'supports_address': value.asset.supports_address
            });
            console.log('genAddress.wif: ', genAddress, i);
            //if passed key is not a privkey, then it is probably a bip master/extended key
            //try to decode the bip key
            var account_key = h[i];
            var account_tmp;
            if (!genAddress) {
              genAddress = await this.hdKeyDecode(account_key, {
                'supports_address': value.asset.supports_address
              }, 'bip44', '');
              if (genAddress) {
                //console.log('genAddress.seed: ', genAddress);
                account_tmp = genAddress;
              }
            }
            //console.log('walletAddress[ key ][i]: ', walletAddress, key, i);
            walletAddress[key][i] = {};
            walletAddress[key][i]['name'] = value.asset.name;
            walletAddress[key][i]['symbol'] = value.asset.symbol;
            walletAddress[key][i]['address'] = genAddress.wif?.compressed?.address || '';

            //add addresses so they have same structure as seed addresses -> addresses -> receieve for password login
            walletAddress[key][i]['addresses'] = {
              'receive': [
                {
                  address: genAddress.wif.compressed.address,
                  wif: genAddress.wif.compressed.key,
                  privkey: genAddress.hex_key,
                  pubkey: genAddress.wif.compressed.public_key,
                  type: "compressed",
                  version: '',
                  key: genAddress.hex_key,
                  ext: wally_fn.initAddressBalance()
                },
                // Check if bech32 exists, then create the object
                genAddress.wif.compressed.bech32 && {
                  address: genAddress.wif.compressed.bech32.address,
                  wif: genAddress.wif.compressed.key,
                  privkey: genAddress.hex_key,
                  pubkey: genAddress.wif.compressed.public_key,
                  redeemscript: genAddress.wif.compressed.bech32.redeemscript,
                  type: genAddress.wif.compressed.bech32.type,
                  version: '',
                  ext: wally_fn.initAddressBalance()
                },
                // Check if segwit exists, then create the object
                genAddress.wif.compressed.segwit && {
                  address: genAddress.wif.compressed.segwit.address,
                  wif: genAddress.wif.compressed.key,
                  privkey: genAddress.hex_key,
                  pubkey: genAddress.wif.compressed.public_key,
                  redeemscript: genAddress.wif.compressed.segwit.redeemscript,
                  type: genAddress.wif.compressed.segwit.type,
                  version: '',
                  ext: wally_fn.initAddressBalance()
                },
                {
                  address: genAddress.wif.uncompressed.address,
                  wif: genAddress.wif.uncompressed.key,
                  privkey: genAddress.hex_key,
                  pubkey: genAddress.wif.uncompressed.public_key,
                  type: "uncompressed",
                  version: '',
                  ext: wally_fn.initAddressBalance()
                }
              ].filter(Boolean) // Filter out undefined values
            };






            walletAddress[key][i]['addresses_supported'] = genAddress.wif;
            walletAddress[key][i]['chainModel'] = value.asset.chainModel;
            //UI rendering
            //login_wizard.initCoinList(coinListModal, {'addresses': genAddress.wif, 'chainModel': value.asset.chainModel});
            login_wizard.initCoinList(coinListModal);
            if (account_tmp) {
              walletAddress[key][i].seed = account_tmp;
            }
            //console.log('walletAddress[ key ][i]: ', walletAddress[ key ][i]);
            //prepare multisig address
            if (keys_length > 1)
              keys_combined.push(genAddress.wif.compressed.public_key);
          }
          //generate multisig address
          if (keys_length > 1) {
            multisig_adr = coinjs.pubkeys2MultisigAddress(keys_combined, keys_length); //create 2-of-2 multisig wallet
            //multisig["address"]; //address, scriptHash, redeemScript
            walletAddress[key].multisig = {};
            walletAddress[key].multisig.address = multisig_adr["address"];
            walletAddress[key].multisig.scriptHash = multisig_adr["scriptHash"];
            walletAddress[key].multisig.redeemScript = multisig_adr["redeemScript"];
            //done! reset for next asset 
            keys_combined = [];
          }
        }
      }
      //Account based coins, like ETH
      if (value.asset.chainModel == 'account' || value.asset.platform == 'evm') {
        if ((value.asset.supports_address).includes('single')) {
          $.extend(coinjs, value); //change asset and generate address
          //var key = 'web3_account';
          for (i = 0; i < keys_length; i++) {
            var account_key = h[i];
            var account_tmp;
            console.log('account_key:' + account_key, i);
            console.log('coinjs:', coinjs.asset);
            //check if we have a bip master key
            if (account_key.length > 64) {
              account_tmp = await this.hdKeyDecode(account_key, {
                'supports_address': value.asset.supports_address
              }, 'bip44', '');
              console.log('evm_account.hd: ', account_tmp);
              if (account_tmp) {
                account_key = account_tmp.hdhexkey;
                console.log('evm_account.key: ', account_key);
                //walletAddress[key][i].seed = account_tmp;
              }
            }
            //var evm_account = wweb3.eth.accounts.privateKeyToAccount('0d11db7762acfdf1fec7518cd5ad5517ccfed719ed4bf228f1d0c5138273a915');
            var evm_account = wweb3.eth.accounts.privateKeyToAccount(account_key);
            evm_account.publicKey = '0x' + coinjs.privkey2pubkey(h[i], true)['pubkey'];
            //console.log('evm_account privateKeyToAccount: ', evm_account);
            walletAddress[key][i] = {};
            walletAddress[key][i].address = evm_account.address;
            walletAddress[key][i].privateKey = evm_account.privateKey;
            walletAddress[key][i].publicKey = evm_account.publicKey;
            walletAddress[key][i]['chainModel'] = value.asset.chainModel;


            //add addresses so they have same structure as seed addresses -> addresses -> receieve for password login
            walletAddress[key][i]['addresses'] = {
              'receive': [
                {
                  address: evm_account.address,
                  wif: '',
                  privkey: evm_account.privateKey,
                  pubkey: evm_account.publicKey,
                  type: "evm",
                  version: '',
                  ext: wally_fn.initAddressBalance()
                }
              ]
            };


            //do we have a token protocol
            //inject network tokens to the main parent
            /*if (value.asset.protocol.protocol_data) {
              console.log('value.asset.name: ', value.asset.name);
              var tokenType = value.asset.protocol.type;
              if (!walletAddress[ key ].tokenType) {
                walletAddress[ key ].tokenType = {}
                walletAddress[ key ].tokenType['protocol']  = {};
                walletAddress[ key ].tokenType['protocol'].type  = value.asset.protocol.type;
                walletAddress[ key ].tokenType['protocol'].parent  = value.asset.protocol.protocol_data.parent;
                walletAddress[ key ].tokenType['protocol'].contract_address  = value.asset.protocol.protocol_data.contract_address;
              }
            }
            */
            if (account_tmp) {
              account_key = account_tmp.hdhexkey;
              console.log('evm_account.key: ', account_key);
              walletAddress[key][i].seed = account_tmp;
            }
            //UI rendering
            //login_wizard.initCoinList(coinListModal);
            //login_wizard.initCoinList(coinListModal, {'addresses': evm_account, 'chainModel': value.asset.chainModel});
            /*
            //since all account based uses same key-pair generation, we limit it to 1 to speed up the process
            if (walletAddress['web3_account'] === undefined) {
              walletAddress['web3_account'] = {};

              walletAddress['web3_account'].address = evm_account.address;
              walletAddress['web3_account'].privateKey = evm_account.privateKey;
            }
            */
          }
        }
      }
      //console.log('walletAddress: ', walletAddress);
      //await wally_fn.nonBlockTick();
      await wally_fn.timeout(5);
    }
    //set asset default to Bitcoin
    $.extend(coinjs, wally_fn.networks.mainnet.bitcoin);
    coinListModal.close() //close modal
    console.log('walletAddress: ', walletAddress);
    return walletAddress;
  }
  //https://stackoverflow.com/questions/53876344/correct-way-to-write-a-non-blocking-function-in-node-js
  //https://jsbin.com/peritogega/edit?js,console,output
  // Note that this could also use requestIdleCallback or requestAnimationFrame
  //setTimeout is synchronous in nature. Its callback get registered by event loop in timer phase which will be executed as an asynchronous manner.
  wally_fn.nonBlockTick = (fn) => new Promise((resolve) => setTimeout(() => resolve(fn), 5));
  //wally_fn.timeout = ms => new Promise(resolve => window.setTimeout(resolve, ms));  //ES6-style
  wally_fn.timeout = function(ms) {
    return new Promise(resolve => window.setTimeout(resolve, ms))
  };
  /*
   Validate/Decode/Convert key to address
   @key in:decimal/hex
   Not used - iceee
  */
  wally_fn.decodeHexPrivKey = function(key) {
    console.log('=wally_fn.decodePrivKey=');
    console.log('key: ', key);
    try {
      //if int, convert to hex and then try to validate address
      if (Number.isInteger(key))
        key = this.Decimal2Hex;
      //check if string is in HEX format
      //if yes, add padding so its value is in 32bit/64char formatwally_fn.generateAllWalletAddresses;
      if (this.isHex(key)) {
        if (key.length < 64)
          key = (key.toString()).padStart(64, '0')
      }
      //try to decode the address
      var wif = '';
      console.log('key: ' + key);
      if (key.length == 64) {
        wif = coinjs.privkey2wif(key);
        //}
        //if(wif.length==51 || wif.length==52){
        var w2address = coinjs.wif2address(wif);
        var w2pubkey = coinjs.wif2pubkey(wif);
        var w2privkey = coinjs.wif2privkey(wif);
        console.log("wally_fn.decodePrivKey .address: " + w2address['address']);
        console.log("wally_fn.decodePrivKey .pubkey: " + w2pubkey['pubkey']);
        console.log("wally_fn.decodePrivKey .privkey: " + w2privkey['privkey']);
        console.log("wally_fn.decodePrivKey .iscompressed: " + w2address['compressed'] ? 'true' : 'false');
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
  wally_fn.address2scripthash = function(a) {
    var bytes = coinjs.base58decode(a);
    var front = bytes.slice(1, bytes.length - 4);
    return Crypto.util.bytesToHex(front);
  }
  /*
   @ Compare if two objects is equal
   param object1, object 2
  */
  wally_fn.isObjectEqual = function(x, y) {
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
    for (let i = 0; i < maxLength; i++) {
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
  wally_fn.shuffleWord = function(word) {
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
  wally_fn.myPromisify = function(fn) {
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
  wally_fn.promisify = function(fn) {
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


  testar3 = wally_fn.promisify( wally_fn.vanityAddress );
  console.log(testar('bay', 50));
  **or
  var testar3 = wally_fn.promisify( wally_fn.vanityAddress );
  wally_fn.sleep(5000);
  testar3('3aa', 50).then((data) => {
      console.log('then yeah', data);
    }).catch((error) => {
      console.log('then catch', error);
    });
  $('#newKeysBtn').click();
  $('#newKeysBtn').click();
  $('#newKeysBtn').click();
  $('#newKeysBtn').click();
  $('#newKeysBtn').click();
  $('#newKeysBtn').click();


  setTimeout(function (theseArgs) { 
    var testar3 = wally_fn.promisify( wally_fn.vanityAddress );
    testar3('3aa', 20).then((data) => {
      console.log('then yeah', data);
    }).catch((error) => {
      console.log('then catch', error);
    });



  }, 100);
    $('#newKeysBtn').click();
  $('#newKeysBtn').click();
  $('#newKeysBtn').click();
  $('#newKeysBtn').click();
  $('#newKeysBtn').click();
  $('#newKeysBtn').click();



  https://stackoverflow.com/questions/26615966/how-to-make-non-blocking-javascript-code
  //begin the program
  console.log('begin');
  nonBlockingIncrement(100, function (currentI, done) {
    
    var testar3 = wally_fn.promisify( wally_fn.vanityAddress );
    testar3('bay', 20).then((data) => {
      console.log('then yeah', data);
    }).catch((error) => {
      console.log('then catch', error);
    });

    if (done) {
      console.log('0 incremented to ' + currentI);
    }
  });
  console.log('do more stuff'); 

  //define the slow function; this would normally be a server call
  function nonBlockingIncrement(n=1000000, callback){
    var i = 0;
    
    function loop () {
      if (i < n) {
        i++;
        callback(i, false);
        (window.requestAnimationFrame || window.setTimeout)(loop);
      }
      else {
        callback(i, true);
      }
    }
    
    loop();
  }
  */
  /*

  BIP 44 derivation paths:

  Bitcoin 0
  BitBay      2125
  LYNX      191
  Zetacoin    719
  Artbyte     720
  InfiniLooP    722
  Vanillacash   724
  PotCoin   81
  Novacoin 50
  Litecoin 2
  Dogecoin 3
  Blackcoin 10
  */
  //Summary API
  //https://chainz.cryptoid.info/explorer/api.dws?q=summary
  //Chain Configuration
  wally_fn.chains = {
    //configuration for different chains
    'config': {
      'utxo': {
        'seed': {
          'address': {
            'receive': {
              'max': Infinity, //no-limit of loading of receive addresses 
            },
            'change': {
              'max': Infinity, //no-limit of loading of change addresses 
            },
          }
        }
      },
      'evm': {
        'seed': {
          'address': {
            'receive': {
              'max': 1, //dont use multiple receive addresses for evm coins
            },
            'change': {
              'max': 0, //no change address for evm coins
            },
          }
        }
      },
    }
  };
  //Tokens
  wally_fn.networks_tokens = {
    "mainnet": {
      "ethereum": {
        "dai": {
          type: 'ERC20',
          platform: 'evm',
          parent: "ethereum",
          protocol: {
            contract_address: "0x6b175474e89094c44da98b954eedeac495271d0f",
            decimals: 18,
          },
          asset: {
            name: 'DAI',
            slug: 'dai',
            symbol: 'DAI',
            symbols: ['dai'],
            icon: './assets/images/crypto/multi-collateral-dai-dai-logo.svg',
          },
        },
        "paxg": {
          type: 'ERC20',
          platform: 'evm',
          parent: "ethereum",
          protocol: {
            contract_address: "0x45804880de22913dafe09f4980848ece6ecbaf78",
            decimals: 18,
          },
          asset: {
            name: 'PAXG',
            slug: 'paxg',
            symbol: 'PAXG', //ticker
            symbols: ['paxg'],
            icon: './assets/images/crypto/pax-gold-paxg-logo.svg',
          },
        },
        "matic": {
          type: 'ERC20',
          platform: 'evm',
          parent: "ethereum",
          protocol: {
            contract_address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            decimals: 18,
          },
          asset: {
            name: 'Polygon',
            slug: 'matic',
            symbol: 'MATIC', //ticker
            symbols: ['matic', 'polygon'],
            icon: './assets/images/crypto/polygon-matic-logo.svg',
          },
        },
        "usdt": {
          type: 'ERC20',
          platform: 'evm',
          parent: "ethereum",
          protocol: {
            contract_address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            decimals: 18,
          },
          asset: {
            name: 'USDT',
            slug: 'usdt',
            symbol: 'USDT', //ticker
            symbols: ['usdt'],
            icon: './assets/images/crypto/tether-usdt-logo.svg',
          },
        },
      },
      "bnb": {
        "dai": {
          type: 'ERC20',
          platform: 'evm',
          parent: "bnb",
          protocol: {
            contract_address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
            decimals: 18,
          },
          asset: {
            name: 'DAI',
            slug: 'dai',
            symbol: 'DAI', //ticker
            symbols: ['dai'],
            icon: './assets/images/crypto/multi-collateral-dai-dai-logo.svg',
          },
        },
        "paxg": {
          type: 'ERC20',
          platform: 'evm',
          parent: "bnb",
          protocol: {
            contract_address: "0x7950865a9140cb519342433146ed5b40c6f210f7",
            decimals: 18,
          },
          asset: {
            name: 'PAXG',
            slug: 'paxg',
            symbol: 'DAI', //ticker
            symbols: ['paxg'],
            icon: './assets/images/crypto/pax-gold-paxg-logo.svg',
          },
        },
        "matic": {
          type: 'ERC20',
          platform: 'evm',
          parent: "bnb",
          protocol: {
            contract_address: "0xcc42724c6683b7e57334c4e856f4c9965ed682bd",
            decimals: 18,
          },
          asset: {
            name: 'Polygon',
            slug: 'matic',
            symbol: 'MATIC', //ticker
            symbols: ['matic', 'polygon'],
            icon: './assets/images/crypto/polygon-matic-logo.svg',
          },
        },
        "usdt": {
          type: 'ERC20',
          platform: 'evm',
          parent: "ethereum",
          protocol: {
            contract_address: "0x55d398326f99059ff775485246999027b3197955",
            decimals: 18,
          },
          asset: {
            name: 'USDT',
            slug: 'usdt',
            symbol: 'USDT', //ticker
            symbols: ['usdt'],
            icon: './assets/images/crypto/tether-usdt-logo.svg',
          },
        },
      },
      "matic": {
        "dai": {
          type: 'ERC20',
          platform: 'evm',
          parent: "matic",
          protocol: {
            contract_address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
            decimals: 18,
          },
          asset: {
            name: 'DAI',
            slug: 'dai',
            symbol: 'DAI', //ticker
            symbols: ['dai'],
            icon: './assets/images/crypto/multi-collateral-dai-dai-logo.svg',
          },
        },
        "usdt": {
          type: 'ERC20',
          platform: 'evm',
          parent: "matic",
          protocol: {
            contract_address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            decimals: 18,
          },
          asset: {
            name: 'USDT',
            slug: 'usdt',
            symbol: 'USDT', //ticker
            symbols: ['usdt'],
            icon: './assets/images/crypto/tether-usdt-logo.svg',
          },
        },
      },
      "avax": {},
    },
    "testnet": {},
  };
  //Coins
  wally_fn.networks = {
    mainnet: {
      bitcoin: {
        symbol: 'BTC', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Bitcoin',
          slug: 'bitcoin',
          symbol: 'BTC',
          symbols: ['btc', 'bitcoin'],
          icon: './assets/images/crypto/bitcoin-btc-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed', 'bech32', 'segwit'],
          
          //https://1209k.com/bitcoin-eye/ele.php?chain=btc

          // API-key is used for "manual pages"
          api: {
            //only key is used for the moment, not the value!
            unspent_outputs: {
              'Blockcypher.com': 'btc',
              'Blockchain.info': 'btc', //no arguments needs to be passed
              //'Blockchair.com': 'bitcoin',
              'Blockstream.info': 'Blockstream.info',
              //'Chain.so': 'BTC',
              'Coinb.in': 'Coinb.in',
              'Cryptoid.info': 'btc',
              //'Mempool.space': 'btc',
              //'ElectrumX-getsrt (SSL)': 'electrum.getsrt.net:50002',
              //'ElectrumX-PipeDream (SSL)': 'pipedream.fiatfaucet.com:50002',
              //'ElectrumX-Fulcrum1 (SSL)': 'fulcrum1.getsrt.net:50002',
              'ElectrumX-api.ordimint.com (TCP)': 'api.ordimint.com:50001',
              'ElectrumX-electrum.coinucopia.io (TCP)': 'electrum.coinucopia.io:50001',
              'ElectrumX-blockstream.info (TCP)': 'blockstream.info:110',
              'ElectrumX-blockstream.info (SSL)': 'blockstream.info:700',
              'ElectrumX-electrum.blockstream.info (SSL)': 'electrum.blockstream.info:50002',
              'ElectrumX-electrum.blockstream.info (TCP)': 'electrum.blockstream.info:50001',
              'ElectrumX-bitcoin.grey.pw (TCP)': 'bitcoin.grey.pw:50001',



              //'ElectrumX-api.ordimint.com (SSL)': 'api.ordimint.com:50002',

            },
            broadcast: {
              'Blockcypher.com': 'btc',
              //'Blockchair.com': 'bitcoin',
              'Blockstream.info': 'Blockstream.info', //no arguments needs to be passed
              //'Chain.so': 'BTC',
              'Coinb.in': '', //no arguments needs to be passed
              'Cryptoid.info': 'btc',
              //'Mempool.space': 'btc',
              'ElectrumX-api.ordimint.com (TCP)': 'api.ordimint.com:50001',
              'ElectrumX-electrum.coinucopia.io (TCP)': 'electrum.coinucopia.io:50001',
              'ElectrumX-blockstream.info (TCP)': 'blockstream.info:110',
              'ElectrumX-blockstream.info (SSL)': 'blockstream.info:700',
              'ElectrumX-electrum.blockstream.info (SSL)': 'electrum.blockstream.info:50002',
              'ElectrumX-electrum.blockstream.info (TCP)': 'electrum.blockstream.info:50001',
              'ElectrumX-bitcoin.grey.pw (TCP)': 'bitcoin.grey.pw:50001',
            },

            // PROVIDERS-key is used for "wallet pages" - isAuth = true
          providers: {
            //only key is used for the moment, not the value!
            balance: {
              //provider name as key
              'blockchain.info': {
                params: { //params if provider requires specific ticker names, case sensitive etc..
                }
              },
              'cryptoid.info': {
                params: {},
              },
              'electrumx': {
                params: {},
              },
            },
            listunspent: {
              'blockchain.info': {
                params: { //params if provider requires specific ticker names, case sensitive etc..
                }
              },
              'cryptoid.info': {
                params: {},
              },
              'electrumx': {
                params: {},
              },
            },
            pushrawtx: {
              'blockchain.info': {
                params: { //params if provider requires specific ticker names, case sensitive etc..
                }
              },
              'cryptoid.info': {
                params: {},
              },
              'electrumx': {
                params: {},
              },
            },
            electrumx: {
              nodes: [
                {
                  name: 'electrum1.cipig.net',
                  url: 'electrum1.cipig.net:10000',
                  protocol: 'tcp',  //ssl/tcp
                },
                {
                  name: 'electrum1.cipig.net',
                  url: 'electrum1.cipig.net:20000',
                  protocol: 'ssl',  //ssl/tcp
                },
                {
                  name: 'electrum2.cipig.net',
                  url: 'electrum2.cipig.net:10000',
                  protocol: 'tcp',  //ssl/tcp
                },
                {
                  name: 'electrum2.cipig.net',
                  url: 'electrum2.cipig.net:20000',
                  protocol: 'ssl',  //ssl/tcp
                },
                {
                  name: 'electrum3.cipig.net',
                  url: 'electrum3.cipig.net:10000',
                  protocol: 'tcp',  //ssl/tcp
                },
                {
                  name: 'electrum3.cipig.net',
                  url: 'electrum3.cipig.net:20000',
                  protocol: 'ssl',  //ssl/tcp
                },
                


                {
                  name: 'bitcoin.aranguren.org',
                  url: 'bitcoin.aranguren.org:50001',
                  protocol: 'tcp',  //ssl/tcp
                },
                {
                  name: 'bitcoin.aranguren.org',
                  url: 'bitcoin.aranguren.org:50002',
                  protocol: 'ssl',  //ssl/tcp
                },
                {
                  name: 'api.ordimint.com',
                  url: 'api.ordimint.com:50001',
                  protocol: 'tcp',
                },
              ],
              custom_nodes: [],  
            },
          },
          },

          


          data: {
            blocktime: 1231006505,
            total_tokens: "19382187.00000000",
          },
          social: {
            discord: {
              official: '',
            },
            telegram: {
              official: '',
              english: '',
            },
            twitter: {
              official: '',
            },
            website: {
              official: '',
            },
          },
        },
        pub: 0x00, //pubKeyHash
        priv: 0x80, //wif
        multisig: 0x05, //scriptHash
        //bip32, xpub
        hdkey: {
          'prv': 0x0488ade4,
          'pub': 0x0488b21e
        },
        //bip32 : {'prv':0x0488ade4, 'pub':0x0488b21e}, //bip32, xpub
        //https://github.com/iancoleman/bip39/blob/master/src/js/segwit-parameters.js
        //bip49/p2wpkhInP2sh - deriving P2WPKH-nested-in-P2SH - segwit, ypub
        bip49: {
          'prv': 0x049d7878,
          'pub': 0x049d7cb2
        }, //bip49 ypub
        //bip84/p2wpkh - Derives segwit + bech32 addresses from seed, zprv/zpub and vprv/vpub in javascript
        bip84: {
          'prv': 0x04b2430c,
          'pub': 0x04b24746
        }, // zpub
        slip_path: 0, //bip path constants are used as hardened derivation.
        //electrumbip: 'bip49', 'derivation': m/0, generate "bc" /  Address (Bech32) insead of segwit
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'bc'
        },
        txExtraTimeField: false, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: true,
        developer: 'bc1qsyd8lmve6se4zwk90w3nwftf0vgg9pzh66gt0e',
      },
      litecoin: {
        symbol: 'LTC', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Litecoin',
          slug: 'litecoin',
          symbol: 'LTC',
          symbols: ['ltc', 'litecoin'],
          icon: './assets/images/crypto/litecoin-ltc-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed', 'bech32', 'segwit'],
          api: {
            //only key is used for the moment, not the value!
            unspent_outputs: {
              'Blockcypher.com': 'ltc',
              //'Blockchair.com': 'litecoin',
              //'Chain.so': 'LTC',
              'Cryptoid.info': 'ltc',
              'ElectrumX-1 (TCP)': 'electrum1.cipig.net:10063',
              'ElectrumX-2 (TCP)': 'electrum2.cipig.net:10063',
              'ElectrumX-3 (TCP)': 'electrum3.cipig.net:10063',
              'ElectrumX-1 (SSL)': 'electrum1.cipig.net:20063',
              'ElectrumX-2 (SSL)': 'electrum2.cipig.net:20063',
              'ElectrumX-3 (SSL)': 'electrum3.cipig.net:20063',
            },
            broadcast: {
              'Blockcypher.com': 'ltc',
              //'Blockchair.com': 'litecoin',
              //'Chain.so': 'LTC',
              'Cryptoid.info': 'ltc',
              'ElectrumX-1 (TCP)': 'electrum1.cipig.net:10063',
              'ElectrumX-2 (TCP)': 'electrum2.cipig.net:10063',
              'ElectrumX-3 (TCP)': 'electrum3.cipig.net:10063',
              'ElectrumX-1 (SSL)': 'electrum1.cipig.net:20063',
              'ElectrumX-2 (SSL)': 'electrum2.cipig.net:20063',
              'ElectrumX-3 (SSL)': 'electrum3.cipig.net:20063',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              electrumx: {
                nodes: [
                  {
                    name: 'electrum1.cipig.net',
                    url: 'electrum1.cipig.net:10063',
                    protocol: 'tcp',
                  },
                  {
                    name: 'electrum1.cipig.net',
                    url: 'electrum1.cipig.net:20063',
                    protocol: 'ssl',
                  },
                  {
                    name: 'electrum2.cipig.net',
                    url: 'electrum2.cipig.net:10063',
                    protocol: 'tcp',  //ssl/tcp
                  },
                  {
                    name: 'electrum2.cipig.net',
                    url: 'electrum2.cipig.net:20063',
                    protocol: 'ssl',  //ssl/tcp
                  },
                  {
                    name: 'electrum3.cipig.net',
                    url: 'electrum3.cipig.net:10063',
                    protocol: 'tcp',
                  },
                  {
                    name: 'electrum3.cipig.net',
                    url: 'electrum3.cipig.net:20063',
                    protocol: 'ssl',
                  },
                ],
                custom_nodes: [],
              },
            },
          },

          
        },


        pub: 0x30, //pubKeyHash
        priv: 0xb0, //wif
        multisig: 0x32, //scriptHash
        hdkey: {
          'prv': 0x019d9cfe,
          'pub': 0x019da462
        },
        //bip49/p2wpkhInP2sh - deriving P2WPKH-nested-in-P2SH - segwit, ypub
        bip49: {
          'prv': 0x01b26792,
          'pub': 0x01b26ef6
        }, //bip49/p2wpkh zpub
        //bip84/p2wpkh - Derives segwit + bech32 addresses from seed, zprv/zpub and vprv/vpub in javascript
        bip84: {
          'prv': 0x04b2430c,
          'pub': 0x04b24746
        }, // zpub
        slip_path: 2,
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'ltc'
        },
        txExtraTimeField: false, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: 'ltc1q6ey3vxe3k83eeaanq8twt9xkfyzfxwjp4a34kv',
      },
      dogecoin: {
        symbol: 'DOGE', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Dogecoin',
          slug: 'dogecoin',
          symbol: 'DOGE',
          symbols: ['doge', 'dogecoin'],
          icon: './assets/images/crypto/dogecoin-doge-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed', 'segwit'],
          api: {
            unspent_outputs: {
              'Blockcypher.com': 'doge',
              'ElectrumX-1 (TCP)': 'electrum1.cipig.net:10060',
              'ElectrumX-2 (TCP)': 'electrum2.cipig.net:10060',
              'ElectrumX-3 (TCP)': 'electrum3.cipig.net:10060',
              'ElectrumX-1-SSL': 'electrum1.cipig.net:20060',
              'ElectrumX-2-SSL': 'electrum2.cipig.net:20060',
              'ElectrumX-3-SSL': 'electrum3.cipig.net:20060',
              //'Blockchair.com': 'dogecoin',
              //'Chain.so': 'DOGE',
            },
            broadcast: {
              'Blockcypher.com': 'doge',
              'ElectrumX-1 (TCP)': 'electrum1.cipig.net:10060',
              'ElectrumX-2 (TCP)': 'electrum2.cipig.net:10060',
              'ElectrumX-3 (TCP)': 'electrum3.cipig.net:10060',
              'ElectrumX-1 (SSL)': 'electrum1.cipig.net:20060',
              'ElectrumX-2 (SSL)': 'electrum2.cipig.net:20060',
              'ElectrumX-3 (SSL)': 'electrum3.cipig.net:20060',
              //'Blockchair.com': 'dogecoin',
              //'Chain.so': 'DOGE',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              electrumx: {
                nodes: [
                  {
                    name: 'electrum1.cipig.net',
                    url: 'electrum1.cipig.net:10060',
                    protocol: 'tcp',
                  },
                  {
                    name: 'electrum1.cipig.net',
                    url: 'electrum1.cipig.net:20060',
                    protocol: 'ssl',
                  },
                  {
                    name: 'electrum2.cipig.net',
                    url: 'electrum2.cipig.net:10060',
                    protocol: 'tcp',  //ssl/tcp
                  },
                  {
                    name: 'electrum2.cipig.net',
                    url: 'electrum2.cipig.net:20060',
                    protocol: 'ssl',  //ssl/tcp
                  },
                  {
                    name: 'electrum3.cipig.net',
                    url: 'electrum3.cipig.net:10060',
                    protocol: 'tcp',
                  },
                  {
                    name: 'electrum3.cipig.net',
                    url: 'electrum3.cipig.net:20060',
                    protocol: 'ssl',
                  },
                ],
                custom_nodes: [],
              },
            },
          },
          
        },
        pub: 0x1e, //pubKeyHash
        priv: 0x9e, //wif
        multisig: 0x16, //scriptHash
        hdkey: {
          'prv': 0x02fac398,
          'pub': 0x02facafd
        },
        slip_path: 3,
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'doge'
        },
        txExtraTimeField: false, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: true,
        developer: 'DEhoLGBcCLArvcaC1UmCzZ4zFy2ZViytu8',
      },
      bitbay: {
        symbol: 'BAY', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'BitBay',
          slug: 'bitbay',
          symbol: 'BAY',
          symbols: ['bay', 'bitbay'],
          icon: './assets/images/crypto/bitbay-bay-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'bay',
              //'BitBay Node': '',
            },
            broadcast: {
              'Cryptoid.info': 'bay',
              //'BitBay Node': '',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'bbnode': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'bbnode': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'bbnode': {
                  params: {},
                },
              }
            },
          }
        },
        pub: 0x19, //pubKeyHash
        priv: 0x99, //wif
        multisig: 0x55, //scriptHash
        hdkey: {
          'prv': 0x02cfbf60,
          'pub': 0x02cfbede
        },
        slip_path: 2125,
        bech32: {},
        txExtraTimeField: true, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: 'BAyEYiJVNyHjoHio5xr8gzHfxMoD8ucMSt',
      },
      blackcoin: {
        symbol: 'BLK', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Blackcoin',
          version: 2, //latest BLK fork version
          slug: 'blackcoin',
          symbol: 'BLK',
          symbols: ['blk', 'blackcoin'],
          icon: './assets/images/crypto/blackcoin-blk-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'blk',
              'ElectrumX-1 (TCP)': 'electrum1.blackcoin.nl:10001',
              'ElectrumX-1 (SSL)': 'electrum1.blackcoin.nl:10002',
              'ElectrumX-2 (TCP)': 'electrum2.blackcoin.nl:20001',
              'ElectrumX-2 (SSL)': 'electrum2.blackcoin.nl:20002',
              'ElectrumX-3 (TCP)': 'electrum3.blackcoin.nl:30001',
              'ElectrumX-3 (SSL)': 'electrum3.blackcoin.nl:30002',
            },
            broadcast: {
              'Cryptoid.info': 'blk',
              'ElectrumX-1 (TCP)': 'electrum1.blackcoin.nl:10001',
              'ElectrumX-1 (SSL)': 'electrum1.blackcoin.nl:10002',
              'ElectrumX-2 (TCP)': 'electrum2.blackcoin.nl:20001',
              'ElectrumX-2 (SSL)': 'electrum2.blackcoin.nl:20002',
              'ElectrumX-3 (TCP)': 'electrum3.blackcoin.nl:30001',
              'ElectrumX-3 (SSL)': 'electrum3.blackcoin.nl:30002',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              electrumx: {
                nodes: [
                  {
                    name: 'electrum1.blackcoin.nl',
                    url: 'electrum1.blackcoin.nl:10001',
                    protocol: 'tcp',  //ssl/tcp
                  },
                  {
                    name: 'electrum1.blackcoin.nl',
                    url: 'electrum1.blackcoin.nl:10002',
                    protocol: 'ssl',  //ssl/tcp
                  },
                  {
                    name: 'electrum2.blackcoin.nl',
                    url: 'electrum2.blackcoin.nl:20001',
                    protocol: 'tcp',  //ssl/tcp
                  },
                  {
                    name: 'electrum2.blackcoin.nl',
                    url: 'electrum2.blackcoin.nl:20002',
                    protocol: 'ssl',  //ssl/tcp
                  },
                  {
                    name: 'electrum3.blackcoin.nl',
                    url: 'electrum3.blackcoin.nl:30001',
                    protocol: 'tcp',
                  },
                  {
                    name: 'electrum3.blackcoin.nl',
                    url: 'electrum3.blackcoin.nl:30002',
                    protocol: 'ssl',
                  },
                ],
                custom_nodes: [],
              },
            },
          }
        },
        pub: 0x19, //pubKeyHash
        priv: 0x99, //wif
        multisig: 0x55, //scriptHash
        hdkey: {
          'prv': 0x02cfbf60,
          'pub': 0x02cfbede
        },
        slip_path: 10,
        bech32: {},
        txExtraTimeField: false, //BLK latest fork, txTime is removed
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: 'BLKMFdeP2wfonsnV2RZkyUzHUmxRPRGKV4',
      },
      lynx: {
        symbol: 'LYNX', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Lynx',
          slug: 'lynx',
          symbol: 'LYNX',
          symbols: ['lynx'],
          icon: './assets/images/crypto/lynx-lynx-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed', 'bech32', 'segwit'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'lynx',
              'ElectrumX-5 (SSL)': 'electrum5.getlynx.io:50002',
              'ElectrumX-6 (SSL)': 'electrum6.getlynx.io:50002',
              'ElectrumX-7 (SSL)': 'electrum7.getlynx.io:50002',
              'ElectrumX-9 (SSL)': 'electrum9.getlynx.io:50002',
            },
            broadcast: {
              'Cryptoid.info': 'lynx',
              'ElectrumX-5 (SSL)': 'electrum5.getlynx.io:50002',
              'ElectrumX-6 (SSL)': 'electrum6.getlynx.io:50002',
              'ElectrumX-7 (SSL)': 'electrum7.getlynx.io:50002',
              'ElectrumX-9 (SSL)': 'electrum9.getlynx.io:50002',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},

                },
                'electrumx': {
                  params: {},
                  nodes: {},
                  custom_nodes: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              electrumx: {
                nodes: [
                  {
                    name: 'electrum5.getlynx.io',
                    url: 'electrum5.getlynx.io:50002',
                    protocol: 'ssl',  //ssl/tcp
                  },
                  {
                    name: 'electrum6.getlynx.io',
                    url: 'electrum6.getlynx.io:50002',
                    protocol: 'ssl',  //ssl/tcp
                  },
                  {
                    name: 'electrum7.getlynx.io',
                    url: 'electrum7.getlynx.io:50002',
                    protocol: 'ssl',
                  },
                  {
                    name: 'electrum8.getlynx.io',
                    url: 'electrum8.getlynx.io:50002',
                    protocol: 'ssl',
                  },
                  {
                    name: 'electrum9.getlynx.io',
                    url: 'electrum9.getlynx.io:50002',
                    protocol: 'ssl',
                  },
                ],
                custom_nodes: [],  
              },
            },
          }
        },
        pub: 0x2d, //pubKeyHash
        priv: 0xad, //wif
        multisig: 0x32, //scriptHash
        hdkey: {
          'prv': 0x0488ade4,
          'pub': 0x0488b21e
        }, //fix this! iceeee
        slip_path: 191,
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'ltc'
        },
        txExtraTimeField: false, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: 'K9w3PqeX9yr9AcYuyafcoa2wDk1VAfEzoH',
      },
      peercoin: {
        symbol: 'PPC', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Peercoin',
          version: 3, //latest BLK fork version
          slug: 'peercoin',
          symbol: 'PPC',
          symbols: ['ppc', 'peercoin'],
          icon: './assets/images/crypto/peercoin-ppc-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'ppc',
              'ElectrumX-1 (SSL)': 'allingas.peercoinexplorer.net:50002',
              'ElectrumX-2 (SSL)': 'electrum.peercoinexplorer.net:50002',
              
            },
            broadcast: {
              'Cryptoid.info': 'ppc',
              'ElectrumX-1 (SSL)': 'allingas.peercoinexplorer.net:50002',
              'ElectrumX-2 (SSL)': 'electrum.peercoinexplorer.net:50002',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              electrumx: {
                nodes: [
                  {
                    name: 'allingas.peercoinexplorer.net',
                    url: 'allingas.peercoinexplorer.net:50002',
                    protocol: 'ssl',  //ssl/tcp
                  },
                  {
                    name: 'allingas.peercoinexplorer.net',
                    url: 'allingas.peercoinexplorer.net:50002',
                    protocol: 'ssl',  //ssl/tcp
                  },
                ],
                custom_nodes: [],
              },
            },
          }
        },
        pub: 0x37, //pubKeyHash
        priv: 0xb7, //wif
        multisig: 0x75, //scriptHash
        hdkey: {
          'prv': 0x0488ade4,
          'pub': 0x0488b21e
        },
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'pc'
        },
        slip_path: 6,
        txExtraTimeField: false, 
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 6,
        txRBFTransaction: false,
        developer: 'PETGpEW1Y1r9ytZ522WJV4UygJ6zBZ2Zkk',
      },
      primecoin: {
        symbol: 'XPM', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Primecoin',
          //version: 1,
          slug: 'primecoin',
          symbol: 'XPM',
          symbols: ['xpm', 'primecoin'],
          icon: './assets/images/crypto/primecoin-xpm-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'xpm',
              'ElectrumX-1 (TCP)': 'electrumx.gemmer.primecoin.org:50011',
              'ElectrumX-2 (TCP)': 'electrumx.mainnet.primecoin.org:50011',
              'ElectrumX-3 (TCP)': 'electrumx.primecoin.org:50001',
              
            },
            broadcast: {
              'Cryptoid.info': 'xpm',
              'ElectrumX-1 (TCP)': 'electrumx.gemmer.primecoin.org:50011',
              'ElectrumX-2 (TCP)': 'electrumx.mainnet.primecoin.org:50011',
              'ElectrumX-3 (TCP)': 'electrumx.primecoin.org:50001',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              electrumx: {
                nodes: [
                  /*{
                    name: '',
                    url: '',
                    protocol: '',  //ssl/tcp
                  },*/
                ],
                custom_nodes: [],
              },
            },
          }
        },
        pub: 0x17,       // pubKeyHash: Primecoin addresses starting with 'A'
        priv: 0x97,      // WIF prefix for private keys
        multisig: 0x53,  // scriptHash: Primecoin multisig addresses starting with 'a'
        hdkey: {
          'prv': 0x0488ade4, // HD private key prefix
          'pub': 0x0488b21e  // HD public key prefix
        },
        
        
        slip_path: 24,
        bech32: {},
        txExtraTimeField: false, 
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: 'AMY1pqBErCinNYmtXRtwPxxW3uU2WNCvo8',
        fee: {
          byte: 100000,  //minimum tx fee 0.001/byte    0.001
          dust: 25000000,   //recommended smallest txout is 0.25
        },
      },
      potcoin: {
        symbol: 'POT', //ticker
        asset: {
          chainModel: 'utxo',
          chainFamily: 'rdd',
          name: 'Potcoin',
          version: 4,
          slug: 'potcoin',
          symbol: 'POT',
          symbols: ['pot', 'potcoin'],
          icon: './assets/images/crypto/potcoin-pot-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'pot',
              'ElectrumX-1 (TCP)': '62.171.189.243:50001',
              'ElectrumX-2 (SSL)': 'pot-duo.ewmcx.net:50012',
            },
            broadcast: {
              'Cryptoid.info': 'pot',
              'ElectrumX-1 (TCP)': '62.171.189.243:50001',
              'ElectrumX-2 (SSL)': 'pot-duo.ewmcx.net:50012',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },

              electrumx: {
                nodes: [
                  {
                    name: 'pot-uno.ewmcx.net',
                    url: 'pot-uno.ewmcx.net:50002',
                    protocol: 'ssl',  //ssl/tcp
                  },
                  {
                    name: 'pot-duo.ewmcx.net',
                    url: 'pot-duo.ewmcx.net:50012',
                    protocol: 'ssl',  //ssl/tcp
                  },
                ],
                custom_nodes: [],  
              },


            },
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
        pub: 0x37, //pubKeyHash
        priv: 0xb7, //wif
        multisig: 0x05, //scriptHash
        hdkey: {
          'prv': 0x0488ade4,
          'pub': 0x0488b21e
        },
        slip_path: 81,
        bech32: {},
        //magic: hex('fbc0b6db'),
        txExtraTimeField: true, //Set to true for PoSV coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: 'PF2BMF6TwjAUp7omwgVJh3XmzjHXEYtpFf',
      },
      reddcoin: {
        symbol: 'RDD', //ticker
        asset: {
          chainModel: 'utxo',
          chainFamily: 'rdd',
          name: 'Reddcoin',
          version: 2,
          slug: 'reddcoin',
          symbol: 'RDD',
          symbols: ['rdd', 'reddcoin'],
          icon: './assets/images/crypto/reddcoin-rdd-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'ElectrumX-1 (SSL)': 'electrum01.reddcoin.com:50002',
              'ElectrumX-2 (SSL)': 'electrum02.reddcoin.com:50002',
              'ElectrumX-3 (SSL)': 'electrum03.reddcoin.com:50002',
            },
            broadcast: {
              'ElectrumX-1 (SSL)': 'electrum01.reddcoin.com:50002',
              'ElectrumX-2 (SSL)': 'electrum02.reddcoin.com:50002',
              'ElectrumX-3 (SSL)': 'electrum03.reddcoin.com:50002',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              
              electrumx: {
                nodes: [
                  {
                    name: 'electrum01.reddcoin.com',
                    url: 'electrum01.reddcoin.com:50002',
                    protocol: 'ssl',  //ssl/tcp
                  },
                  {
                    name: 'electrum02.reddcoin.com',
                    url: 'electrum02.reddcoin.com:50002',
                    protocol: 'ssl',  //ssl/tcp
                  },
                  {
                    name: 'electrum03.reddcoin.com',
                    url: 'electrum03.reddcoin.com:50002',
                    protocol: 'ssl',  //ssl/tcp
                  },
                ],
                custom_nodes: [],  
              },
            },
          },
        },
        pub: 0x3d, //pubKeyHash
        priv: 0xbd, //wif
        multisig: 0x05, //scriptHash
        hdkey: {
          'prv': 0x0488ade4,
          'pub': 0x0488b21e
        },
        slip_path: 4,
        bech32: {},
        //magic: hex('fbc0b6db'),
        txExtraTimeField: true, //Set to true for PoSV coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: 'RcdM87CbTBtyGK6TivE8LkxDyWPBvEKWdd',
      },
      infiniloop: {
        symbol: 'IL8P', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'InfiniLooP',
          slug: 'infiniloop',
          symbol: 'IL8P',
          symbols: ['il8p', 'infiniloop'],
          icon: './assets/images/crypto/infiniloop-il8p-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'il8p'
            },
            broadcast: {
              'Cryptoid.info': 'il8p'
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              electrumx: {
                nodes: [
                  {
                    name: 'il8p.electrumx.transcenders.name',
                    url: 'il8p.electrumx.transcenders.name:50002',
                    protocol: 'ssl',
                  },
                  {
                    name: 'il9p.electrumx.transcenders.name',
                    url: 'il9p.electrumx.transcenders.name:50002',
                    protocol: 'ssl',
                  },
                ],
                custom_nodes: [],
              },
            },
          },
        },
        pub: 0x21, //pubKeyHash
        priv: 0x99, //wif
        multisig: 0x55, //scriptHash
        hdkey: {
          'prv': 0x0488ade4,
          'pub': 0x0488b21e
        },
        slip_path: 722,
        bech32: {},
        txExtraTimeField: true, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: 'EMHj1vHhh8D5kxtK7NbNQw4qoW6Qeyz3Hd',
      },
      artbyte: {
        symbol: 'ABY', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Artbyte',
          slug: 'artbyte',
          symbol: 'ABY',
          symbols: ['aby', 'artbyte'],
          icon: './assets/images/crypto/artbyte-aby-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'aby',
              //'ElectrumX-1': 'elec-seeder-one.artbytecoin.org:50012',
              'ElectrumX-2 (SSL)': 'elec-seeder-two.artbytecoin.org:50012',
              //'ElectrumX-3': 'electrumx-three.artbyte.live:50012',
              //'ElectrumX-4': 'electrumx-four.artbyte.live:50012',
            },
            broadcast: {
              'Cryptoid.info': 'aby',
              //'ElectrumX-1': 'elec-seeder-one.artbytecoin.org:50012',
              'ElectrumX-2 (SSL)': 'elec-seeder-two.artbytecoin.org:50012',
              //'ElectrumX-3': 'electrumx-three.artbyte.live:50012',
              //'ElectrumX-4': 'electrumx-four.artbyte.live:50012',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              electrumx: {
                nodes: [
                  {
                    name: 'aby-ex-four.ewmci.online',
                    url: 'electrum1.cipig.net:10063',
                    protocol: 'tcp',
                  },
                  {
                    name: 'elec-seeder-two.artbytecoin.org',
                    url: 'elec-seeder-two.artbytecoin.org:50012',
                    protocol: 'ssl',
                  },
                  {
                    name: 'electrumx-three.artbyte.live',
                    url: 'electrumx-three.artbyte.live:50012',
                    protocol: 'ssl',
                  },
                ],
                custom_nodes: [],
              },
            },
          },
        },
        pub: 28, //pubKeyHash
        priv: 153, //wif
        multisig: 85, //scriptHash
        hdkey: {
          'prv': 0x0488ade4 /*EXT_SECRET_KEY*/ ,
          'pub': 0x0488b21e /*EXT_PUBLIC_KEY*/
        },
        slip_path: 720,
        bech32: {},
        txExtraTimeField: true, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: 'CeTNuWQ5pC3RS4NexFEeAysF7X25zp1qB4',
      },
      zetacoin: {
        symbol: 'ZET', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Zetacoin',
          slug: 'zetacoin',
          symbol: 'ZET',
          symbols: ['zet', 'zetacoin'],
          icon: './assets/images/crypto/zetacoin-zet-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'zet'
            },
            broadcast: {
              'Cryptoid.info': 'zet'
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              electrumx: {
                nodes: [
                  {
                    name: '207.180.252.200',
                    url: '207.180.252.200:50011',
                    protocol: 'tcp',
                  },
                ],
                custom_nodes: [],
              },
            },
          },
        },
        pub: 20, //pubKeyHash
        priv: 153, //wif
        multisig: 85, //scriptHash
        hdkey: {
          'prv': 0x0488ade4 /*EXT_SECRET_KEY*/ ,
          'pub': 0x0488b21e /*EXT_PUBLIC_KEY*/
        },
        slip_path: 719,
        bech32: {},
        txExtraTimeField: true, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: '9HDfTd3VhF5RsSWfzrHvvonVzGjW3gQPcb',
      },
      vanillacash: {
        symbol: 'XVC', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Vanillacash',
          slug: 'vanillacash',
          symbol: 'XVC',
          symbols: ['xvc', 'vanillacash'],
          icon: './assets/images/crypto/vanillacash-xvc-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'xvc'
            },
            broadcast: {
              'Cryptoid.info': 'xvc'
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              electrumx: {
                nodes: [
                  {
                    name: 'electrumx1.vanillacash.info',
                    url: 'electrumx1.vanillacash.info:50011',
                    protocol: 'tcp',
                  },
                  {
                    name: 'electrumx2.vanillacash.info',
                    url: 'electrumx2.vanillacash.info:50011',
                    protocol: 'tcp',
                  },
                ],
                custom_nodes: [],
              },
            },
          },
        },
        pub: 18, //pubKeyHash, PUBKEY_ADDRESS
        priv: 181, //wif, SECRET_KEY
        multisig: 30, //scriptHash, SCRIPT_ADDRESS
        hdkey: {
          'prv': 0xe1a32b3e /*EXT_SECRET_KEY*/ ,
          'pub': 0xad1b12a4 /*EXT_PUBLIC_KEY*/
        },
        slip_path: 724,
        bech32: {},
        txExtraTimeField: true, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: '8RTwrgaA9sSTokWJsJN5tc9f3QKWJuAdzD',
      },
      novacoin: {
        symbol: 'NVC', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Novacoin',
          slug: 'novacoin',
          symbol: 'NVC',
          symbols: ['nvc', 'novacoin'],
          icon: './assets/images/crypto/novacoin-nvc-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'nvc'
            },
            broadcast: {
              'Cryptoid.info': 'nvc',
              'ElectrumX-1 (SSL)': 'electrumx.nvc.ewmcx.org:50002',
              'ElectrumX-2 (SSL)': 'failover.nvc.ewmcx.biz:50002',
            },
            providers: {
            balance: {
              'cryptoid.info': {
                params: {},
              },
              'electrumx': {
                params: {},
              },
            },
            listunspent: {
              'cryptoid.info': {
                params: {},
              },
              'electrumx': {
                params: {},
              },
            },
            pushrawtx: {
              'cryptoid.info': {
                params: {},
              },
              'electrumx': {
                params: {},
              },
            },
            electrumx: {
              nodes: [
                {
                  name: 'electrumx.nvc.ewmcx.org',
                  url: 'electrumx.nvc.ewmcx.org:50002',
                  protocol: 'ssl',
                },
                {
                  name: 'failover.nvc.ewmcx.biz',
                  url: 'failover.nvc.ewmcx.biz:50002',
                  protocol: 'ssl',
                },
              ],
              custom_nodes: [],
              },
            },
          },
          social: {
            discord: {
              official: 'https://discord.gg/6juXnsSkGa',
            },
            telegram: {
              english: 'https://t.me/NovaCoin_EN',
              russian: 'https://t.me/NovaCoin_RU',
            },
            twitter: {
              official: '',
            },
          },
        },
        pub: 0x08, //pubKeyHash, "pubtype": 8,
        priv: 0x88, //wif, "wiftype": 136,
        multisig: 0x14, //scriptHash, "p2shtype": 20,
        hdkey: {
          'prv': 0x0488ade4 /*EXT_SECRET_KEY*/ ,
          'pub': 0x0488b21e /*EXT_PUBLIC_KEY*/
        }, //bip32
        slip_path: 50,
        bech32: {},
        txExtraTimeField: true, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 6,
        txRBFTransaction: false,
        developer: '4bATCSp4uUrRZzwwUuQJKAJG4vyXhK85fZ',
      },
      ethereum: {
        symbol: 'ETH', //ticker
        asset: {
          chainModel: 'account',
          platform: 'evm',
          name: 'Ethereum',
          slug: 'ethereum',
          symbol: 'ETH',
          symbols: ['eth', 'ethereum'],
          icon: './assets/images/crypto/ethereum-eth-logo.svg',
          network: 'mainnet',
          supports_address: ['single'],
          api: {
            unspent_outputs: {
              '': '',
            },
            broadcast: {
              '': '',
            },
            providers: {
              balance: {
                'etherscan.io': {
                  params: {},
                }
              },
              pushrawtx: {
                'etherscan.io': {
                  params: {},
                }
              }
            },
          },
          protocol: {
            "type": "account", //has no parent
          },
        },
        pub: 0, //not used for account based chains
        priv: 0, //not used for ....
        multisig: 0, //....
        hdkey: {
          'prv': 0x0488ade4,
          'pub': 0x0488b21e
        },
        bip49: {
          'prv': 0x049d7878,
          'pub': 0x049d7cb2
        }, //bip49 ypub
        bip84: {
          'prv': 0x04b2430c,
          'pub': 0x04b24746
        }, // zpub
        slip_path: 60,
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'bc'
        },
        txExtraTimeField: false, //not used for ....
        txExtraTimeFieldValue: false, //....
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 18,
        txRBFTransaction: false,
        developer: '0x183B539FBA8566f0f88bC9a43a6766F601fcFB99',
      },
      bnb: {
        symbol: 'BNB', //ticker
        asset: {
          chainModel: 'account',
          platform: 'evm',
          name: 'BNB',
          slug: 'bnb',
          symbol: 'BNB',
          symbols: ['bnb', 'building and building', 'binance coin'],
          icon: './assets/images/crypto/bnb-bnb-logo.svg',
          network: 'mainnet',
          supports_address: ['single'],
          api: {
            unspent_outputs: {
              '': '',
            },
            broadcast: {
              '': '',
            },
            providers: {
              balance: {
                'bscscan.com': {
                  params: {},
                }
              },
              pushrawtx: {
                'bscscan.com': {
                  params: {},
                }
              }
            },
          },
          protocol: {
            "type": "account", //has no parent
          },
        },
        pub: 0, //not used for account based chains
        priv: 0, //not used for ....
        multisig: 0, //....
        hdkey: {
          'prv': 0x0488ade4,
          'pub': 0x0488b21e
        },
        bip49: {
          'prv': 0x049d7878,
          'pub': 0x049d7cb2
        }, //bip49 ypub
        bip84: {
          'prv': 0x04b2430c,
          'pub': 0x04b24746
        }, // zpub
        slip_path: 714,
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'bc'
        },
        txExtraTimeField: false, //not used for ....
        txExtraTimeFieldValue: false, //....
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 18,
        txRBFTransaction: false,
        developer: '0x183B539FBA8566f0f88bC9a43a6766F601fcFB99',
      },
      avax: {
        symbol: 'AVAX', //ticker
        asset: {
          chainModel: 'account',
          platform: 'evm',
          name: 'Avalanche',
          slug: 'avax',
          symbol: 'AVAX',
          symbols: ['avax', 'avalanche'],
          icon: './assets/images/crypto/avalanche-avax-logo.svg',
          network: 'mainnet',
          supports_address: ['single'],
          api: {
            unspent_outputs: {
              '': '',
            },
            broadcast: {
              '': '',
            },
            providers: {
              balance: {
                'snowtrace.io': {
                  params: {},
                }
              },
              pushrawtx: {
                'snowtrace.io': {
                  params: {},
                }
              }
            },
          },
          protocol: {
            "type": "account", //has no parent
          },
        },
        pub: 0, //not used for account based chains
        priv: 0, //not used for ....
        multisig: 0, //....
        hdkey: {
          'prv': 0x0488ade4,
          'pub': 0x0488b21e
        },
        bip49: {
          'prv': 0x049d7878,
          'pub': 0x049d7cb2
        }, //bip49 ypub
        bip84: {
          'prv': 0x04b2430c,
          'pub': 0x04b24746
        }, // zpub
        slip_path: 9000,
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'bc'
        },
        txExtraTimeField: false, //not used for ....
        txExtraTimeFieldValue: false, //....
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 18,
        txRBFTransaction: false,
        developer: '0x183B539FBA8566f0f88bC9a43a6766F601fcFB99',
      },
      matic: {
        symbol: 'MATIC', //ticker
        asset: {
          chainModel: 'account',
          name: 'Polygon',
          slug: 'matic',
          symbol: 'MATIC',
          symbols: ['matic', 'matic', 'polygon'],
          icon: './assets/images/crypto/polygon-matic-logo.svg',
          network: 'mainnet',
          supports_address: ['single'],
          api: {
            unspent_outputs: {
              '': '',
            },
            broadcast: {
              '': '',
            },
            providers: {
              balance: {
                'polygonscan.com': {
                  params: {},
                }
              },
              pushrawtx: {
                'polygonscan.com': {
                  params: {},
                }
              }
            },
          },
          protocol: {
            "type": "account", //has no parent
          },
        },
        pub: 0, //not used for account based chains
        priv: 0, //not used for ....
        multisig: 0, //....
        hdkey: {
          'prv': 0x0488ade4,
          'pub': 0x0488b21e
        },
        bip49: {
          'prv': 0x049d7878,
          'pub': 0x049d7cb2
        }, //bip49 ypub
        bip84: {
          'prv': 0x04b2430c,
          'pub': 0x04b24746
        }, // zpub
        slip_path: 966,
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'bc'
        },
        txExtraTimeField: false, //not used for ....
        txExtraTimeFieldValue: false, //....
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 18,
        txRBFTransaction: false,
        developer: '0x183B539FBA8566f0f88bC9a43a6766F601fcFB99',
      },
      pinkcoin: {
        symbol: 'PINK', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Pinkcoin',
          slug: 'pinkcoin',
          symbol: 'PINK',
          symbols: ['pink', 'pinkcoin'],
          icon: './assets/images/crypto/pinkcoin-pink-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              'Cryptoid.info': 'pink',
              'ElectrumX-1 (TCP)': 'pink-one.ewm-cx.net:50001',
            },
            broadcast: {
              'Cryptoid.info': 'pink',
              'ElectrumX-1 (TCP)': 'pink-one.ewm-cx.net:50001',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              electrumx: {
                nodes: [
                  {
                    name: 'pink-one.ewm-cx.net',
                    url: 'pink-one.ewm-cx.net:50001',
                    protocol: 'tcp',
                  },
                  {
                    name: 'pink-two.ewm-cx.net',
                    url: 'pink-two.ewm-cx.net:50001',
                    protocol: 'tcp',
                  },
                ],
                custom_nodes: [],
              },
            },
          },
        },
        pub: 0x03, //pubKeyHash, PUBKEY_ADDRESS
        priv: 0x83, //wif, SECRET_KEY
        multisig: 0x1c, //scriptHash, SCRIPT_ADDRESS
        hdkey: {
          'prv': 0x0488ade4 /*EXT_SECRET_KEY*/ ,
          'pub': 0x0488b21e /*EXT_PUBLIC_KEY*/
        },
        slip_path: 117,
        bech32: {},
        txExtraTimeField: true, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: '8RTwrgaA9sSTokWJsJN5tc9f3QKWJuAdzD',
      },
      komodo: {
        symbol: 'KMD', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Komodo',
          slug: 'komodo',
          symbol: 'KMD',
          symbols: ['kmd', 'komodo'],
          icon: './assets/images/crypto/komodo-kmd-logo.svg',
          network: 'mainnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            //only key is used for the moment, not the value!
            unspent_outputs: {
            },
            broadcast: {
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              }
            },
          },
          data: {
            blocktime: '',
            total_tokens: '',
          },
          social: {
            discord: {
              official: '',
            },
            telegram: {
              official: '',
              english: '',
            },
            twitter: {
              official: '',
            },
            website: {
              official: '',
            },
          },
        },
        pub: 0x3c, //pubKeyHash
        priv: 0xbc, //wif
        multisig: 0x55, //scriptHash
        //bip32, xpub
        hdkey: {
          'prv': 0x0488ade4,
          'pub': 0x0488b21e
        },
        slip_path: 141, //bip path constants are used as hardened derivation.
        //electrumbip: 'bip49', 'derivation': m/0, generate "bc" /  Address (Bech32) insead of segwit
        bech32: {},
        txExtraTimeField: false, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: 'RAFGdMU9jM5oZkZ8vMiN4XfXhF7ZkmNtKA',
      },
    },
    //TESTNET
    testnet: {
      bitcoin: {
        symbol: 'tBTC', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Bitcoin',
          slug: 'bitcoin',
          symbol: 'tBTC',
          symbols: ['tbtc', 'bitcoin'],
          icon: './assets/images/crypto/bitcoin-btc-logo.svg',
          network: 'testnet',
          supports_address: ['compressed', 'uncompressed', 'bech32', 'segwit'],
          api: {
            //key is provider, value is the parameter to the provider (if needed)
            //https://github.com/spesmilo/electrum/blob/afa1a4d22a31d23d088c6670e1588eed32f7114d/lib/network.py#L57
            //https://1209k.com/bitcoin-eye/ele.php?chain=tbtc
            //https://github.com/spesmilo/electrum/blob/master/electrum/servers_testnet.json
            unspent_outputs: {
              //'Blockchair.com': 'bitcoin',
              'Blockcypher.com': 'btc',
              'Blockstream.info': 'Blockstream.info',
              //'Chain.so': 'BTCTEST',
              //'Mempool.space': 'testnet',
              'ElectrumX-1 (TCP)': 'testnet.aranguren.org:51001',
              'ElectrumX-1 (SSL)': 'testnet.aranguren.org:51002',
              'ElectrumX-2 (TCP)': 'testnetnode.arihanc.com:51001',
              'ElectrumX-2 (SSL)': 'testnetnode.arihanc.com:51002',
              'ElectrumX-3 (TCP)': 'testnet.hsmiths.com:53011',
              'ElectrumX-3 (SSL)': 'testnet.hsmiths.com:53012',
              'ElectrumX-4 (SSL)': 'bitcoin-testnet.stackwallet.com:51002',
              'ElectrumX-5 (SSL)': 'ax102.blockeng.ch:60002',
              'ElectrumX-6 (TCP)': 'testnet.qtornado.com:51001',
              'ElectrumX-6 (SSL)': 'testnet.qtornado.com:51002',
            },
            broadcast: {
              //'Blockchair.com': 'bitcoin',
              'Blockcypher.com': 'btc',
              'Blockstream.info': 'Blockstream.info',
              //'Chain.so': 'BTCTEST',
              //'Mempool.space': 'testnet',
              'ElectrumX-1 (TCP)': 'testnet.aranguren.org:51001',
              'ElectrumX-1 (SSL)': 'testnet.aranguren.org:51002',
              'ElectrumX-2 (TCP)': 'testnetnode.arihanc.com:51001',
              'ElectrumX-2 (SSL)': 'testnetnode.arihanc.com:51002',
              'ElectrumX-3 (TCP)': 'testnet.hsmiths.com:53011',
              'ElectrumX-3 (SSL)': 'testnet.hsmiths.com:53012',
              'ElectrumX-4 (SSL)': 'bitcoin-testnet.stackwallet.com:51002',
              'ElectrumX-5 (SSL)': 'ax102.blockeng.ch:60002',
              'ElectrumX-6 (TCP)': 'testnet.qtornado.com:51001',
              'ElectrumX-6 (SSL)': 'testnet.qtornado.com:51002',
              
              'ElectrumX-7 (TCP)': 'electrum3.cipig.net:10068',
              'ElectrumX-7 (SSL)': 'electrum3.cipig.net:20068',

              'ElectrumX-8 (TCP)': 'testnet.aranguren.org:51001',
            },
            providers: {
              balance: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              listunspent: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              },
              pushrawtx: {
                'cryptoid.info': {
                  params: {},
                },
                'electrumx': {
                  params: {},
                },
              }
            },
          }
        },
        pub: 0x6f, //pubKeyHash
        priv: 0xef, //wif
        multisig: 0xc4, //scriptHash
        hdkey: {
          'prv': 0x04358394,
          'pub': 0x043587cf
        },
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'tb'
        },
        //bip49/p2wpkhInP2sh - deriving P2WPKH-nested-in-P2SH - segwit, ypub
        // p2wpkh in p2sh
        bip49: {
          'prv': 0x044a4e28,
          'pub': 0x044a5262
        }, //bip49/p2wpkh zpub
        //bip84/p2wpkh - Derives segwit + bech32 addresses from seed, zprv/zpub and vprv/vpub in javascript
        bip84: {
          'prv': 0x045f18bc,
          'pub': 0x045f1cf6
        }, // zpub
        slip_path: 1,
        txExtraTimeField: false, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: true,
        developer: 'moZx3Vhdj4xe1JbEp7BegcpVdMNWTpzWHh',
      },
      /*
      "bitcoin-cash" : {
        symbol: 'tBCH',      //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Bitcoin-Cash',
          slug: 'bitcoin-cash',
          symbol: 'tBCH',
          symbols: ['bch', 'bitcoin-cash'],
          icon: './assets/images/crypto/bitcoin-cash-bch-logo.svg',
          network: 'testnet',
          supports_address : ['compressed', 'uncompressed', 'bech32', 'segwit'],
          api : {
              
            unspent_outputs: {
              

            },
            broadcast: {
              


            }
          }
        },
        pub : 0x6f,      //pubKeyHash
        priv : 0xef,     //wif
        multisig : 0xc4, //scriptHash
          hdkey : {'prv':0x04358394, 'pub':0x043587cf}, //iceeee: fix this
          bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':1, 'hrp':'bchtest:'},
          //bech32 : {},
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: true,
        developer: 'moZx3Vhdj4xe1JbEp7BegcpVdMNWTpzWHh',
      },
      */
      'ethereum-goerli': {
        symbol: 'ETH-Goerli', //ticker
        asset: {
          chainModel: 'account',
          name: 'Ethereum-Goerli',
          slug: 'ethereum-goerli',
          symbol: 'ETH-Goerli',
          symbols: ['eth-goerli', 'ethereum-goerli', 'goerli', 'teth'],
          icon: './assets/images/crypto/ethereum-eth-logo.svg',
          network: 'testnet',
          supports_address: ['single'],
          api: {
            unspent_outputs: {
              '': '',
            },
            broadcast: {
              '': '',
            }
          },
          protocol: {
            "type": "account", //has no parent
          },
        },
        pub: 0, //not used for account based chains
        priv: 0, //not used for ....
        multisig: 0, //....
        hdkey: {},
        bech32: {},
        slip_path: 1,
        txExtraTimeField: false, //not used for account/evm based coins ....
        txExtraTimeFieldValue: false, //....
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 18,
        txRBFTransaction: false,
        developer: '0x000',
      },
      litecoin: {
        symbol: 'tLTC', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Litecoin',
          slug: 'litecoin',
          symbol: 'tLTC',
          symbols: ['ltc', 'litecoin'],
          icon: './assets/images/crypto/litecoin-ltc-logo.svg',
          network: 'testnet',
          supports_address: ['compressed', 'uncompressed'],
          api: {
            unspent_outputs: {
              //'Chain.so': 'LTCTEST',
            },
            broadcast: {
              //'Chain.so': 'LTCTEST',
            }
          }
        },
        pub: 0x6f, //pubKeyHash
        priv: 0xef, //wif
        multisig: 0xc4, //scriptHash
        hdkey: {
          'prv': 0x04358394,
          'pub': 0x043587cf
        },
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'tltc'
        },
        //bip49/p2wpkhInP2sh - deriving P2WPKH-nested-in-P2SH - segwit, ypub
        bip49: {
          'prv': 0x04358394,
          'pub': 0x043587cf
        }, //bip49/p2wpkh zpub
        //bip84/p2wpkh - Derives segwit + bech32 addresses from seed, zprv/zpub and vprv/vpub in javascript
        bip84: {
          'prv': 0x04358394,
          'pub': 0x043587cf
        }, // zpub
        slip_path: 1,
        txExtraTimeField: false, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: false,
        developer: 'mkBRJRKFA7YL7ezXW6tyXUsEzK9Jnpv842',
      },
      dogecoin: {
        symbol: 'tDOGE', //ticker
        asset: {
          chainModel: 'utxo',
          name: 'Dogecoin',
          slug: 'dogecoin',
          symbol: 'tDOGE',
          symbols: ['doge', 'dogecoin'],
          icon: './assets/images/crypto/dogecoin-doge-logo.svg',
          network: 'testnet',
          supports_address: ['compressed', 'uncompressed', 'segwit'],
          api: {
            unspent_outputs: {
              //'Chain.so': 'DOGETEST',
            },
            broadcast: {
              //'Chain.so': 'DOGETEST',
            }
          }
        },
        pub: 0x71, //pubKeyHash
        priv: 0xf1, //wif
        multisig: 0xc4, //scriptHash
        hdkey: {
          'prv': 0x04358394,
          'pub': 0x043587cf
        },
        //bip49/p2wpkhInP2sh - deriving P2WPKH-nested-in-P2SH - segwit, ypub
        bip49: {
          'prv': 0x04358394,
          'pub': 0x043587cf
        }, //bip49/p2wpkh zpub
        //bip84/p2wpkh - Derives segwit + bech32 addresses from seed, zprv/zpub and vprv/vpub in javascript
        bip84: {
          'prv': 0x04358394,
          'pub': 0x043587cf
        }, // zpub
        slip_path: 1,
        bech32: {
          'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
          'version': 0,
          'hrp': 'dogecointestnet'
        },
        txExtraTimeField: false, //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 8,
        txRBFTransaction: true,
        developer: 'ncFA1iJD9RtPeAsQrwrHesN4tMtPwuYTTo',
      },
      /*
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
      */
      wally: {
        symbol: 'Wally-Goerli', //ticker
        asset: {
          chainModel: 'ERC20',
          name: 'Happy Walrus Coin',
          slug: 'wally',
          symbol: 'Wally',
          symbols: ['wally', 'walrus'],
          icon: './assets/images/crypto/walrus-wally-logo.svg',
          network: 'testnet',
          supports_address: ['single'],
          api: {
            unspent_outputs: {
              '': '',
            },
            broadcast: {
              '': '',
            }
          },
          protocol: {
            "type": "ERC20",
            "protocol_data": {
              "platform": "ethereum", //-> parent_coin: "ETH",
              "contract_address": "0x1CE0c2827e2eF14D5C4f29a091d735A204794041"
            }
          },
        },
        pub: 0, //not used for account based chains
        priv: 0, //not used for ....
        multisig: 0, //....
        hdkey: {},
        bech32: {},
        slip_path: 1,
        txExtraTimeField: false, //not used for ....
        txExtraTimeFieldValue: false, //....
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces: 18,
        txRBFTransaction: false,
        developer: '0x000',
      },
      /*
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


    //pub : 0xfd,      //pubKeyHash     OP_PUBKEYHASH = 0xfd, https://github.com/Nexusoft/Legacy/blob/v0.2.0.0/src/wallet/script.h
        //priv : 0xfe,     //wif            OP_PUBKEY = 0xfe,
        //multisig : 0xfb, //scriptHash     OP_PUBKEYS = 0xfb, OP_PUBKEYSCRIPT



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
      */
    }
  }
  /**
   * Sorts the keys of an object in either ascending (ASC) or descending (DESC) order.
   * @param {Object} obj - The object to sort.
   * @param {boolean} [descending=false] - Whether to sort in descending order (DESC). Default is false (ASC).
   * @returns {Object} - A new object with sorted keys.
   */
  wally_fn.sortObjectKeys = function(obj, descending = false) {
    const sortedKeys = Object.keys(obj).sort();
    if (descending) {
      sortedKeys.reverse();
    }
    const sortedObj = {};
    for (const key of sortedKeys) {
      sortedObj[key] = obj[key];
    }
    return sortedObj;
  }
  //sorted assets in ASC order in the object
  //https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
  wally_fn.networks.mainnet = Object.fromEntries(Object.entries(wally_fn.networks.mainnet).sort());
  wally_fn.networks.testnet = Object.fromEntries(Object.entries(wally_fn.networks.testnet).sort());
  wally_fn.networks_tokens.mainnet = Object.fromEntries(Object.entries(wally_fn.networks_tokens.mainnet).sort());
  wally_fn.networks_tokens.testnet = Object.fromEntries(Object.entries(wally_fn.networks_tokens.testnet).sort());
  // Sort token names within each chain in mainnet
  wally_fn.networks_tokens.mainnet = wally_fn.sortObjectKeys(wally_fn.networks_tokens.mainnet);
  // Sort token names within each chain in testnet
  wally_fn.networks_tokens.testnet = wally_fn.sortObjectKeys(wally_fn.networks_tokens.testnet);
  /**
   * Get tokens from a specific chain (mainnet or testnet).
   * @param {string} chain - The chain to get tokens from (e.g., 'mainnet' or 'testnet').
   * @param {boolean} [testnet=false] - Whether to get tokens from testnet. Default is false (mainnet).
   * @returns {Object} - An object containing tokens for the specified chain, or an empty object if the chain is not found.
   */
  function getTokensFromChain(chain, testnet = false) {
    const selectedChain = testnet ? wally_fn.networks_tokens.testnet : wally_fn.networks_tokens.mainnet;
    if (!selectedChain.hasOwnProperty(chain))
      return {}; // Return an empty object if the chain is not found.
    return selectedChain[chain];
  }
  // Usage examples:
  //const mainnetTokens = getTokensFromChain('ethereum'); // Get tokens from mainnet (default).
  //const testnetTokens = getTokensFromChain('nonexistentChain', true); // Get tokens from testnet, which will return an empty object.
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
  wally_fn.getNetworks = function(chainType = 'all') {
    //defaults to mainnet, or else set to testnet
    var listChainTypes = ["all", "mainnet", "testnet"];
    try {
      if (!listChainTypes.includes(chainType))
        throw ('Network type "' + chainType + '" not found!');
      if (chainType == "all") {
        console.log('list ' + chainType + ': ', this.networks);
        return this.networks;
      }
      //if(!this.networks.hasOwnProperty(chainType))
      //throw('Network type "'+chainType+'" not found!')
      console.log('list ' + chainType + ': ', this.networks[chainType]);
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
      wally_fn.host = document.location.origin + '/';
      //wally_fn.host = document.protocol+document.location.host;
      console.log('running on server');
    } else { //running locally
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
  /**
   * Calculates SHA-512 hash and HMAC with SHA-512 for a given seed.
   * 
   * @param {string} seed - The seed string for which to calculate the hash and HMAC.
   * @param {string} [client='electrum'] - The client name (optional, default is 'electrum').
   * @returns {boolean} - Returns true if the calculation was successful, false if there was an error.
   */
  wally_fn.seedVersion = function(seed, client = 'electrum') {
    if (!seed) {
      console.error("Seed is not set.");
      return false;
    }
    var hmac = false;
    try {
      var seedText = 'Bitcoin seed';
      if (client === 'electrum')
        seedText = 'Seed version';
      var sha = new jsSHA(seed, "TEXT");
      var hash = sha.getHash("SHA-512", "HEX");
      //console.log("SHA-512 hash:", hash);
      hmac = sha.getHMAC(seedText, "TEXT", "SHA-512", "HEX");
      if (client === 'electrum') {
        // Extract the first 3 characters from the HMAC string
        const [char0, char1, char2] = hmac;
        if (char0 === '0' && char1 === '1') {
          return 'p2pkh'; // Standard wallet, m/0 path, xprv, p2pkh
        } else if (char0 === '1' && char1 === '0') {
          return (char2 === '0') ? 'p2wpkh' : false; // Segwit or unsupported two-factor authenticated wallets
        }
        return false;
      }
      //console.log("HMAC with SHA-512:", hmac);
    } catch (error) {
      console.error("===wally_fn.seedVersion=== ERROR::", error);
    }
    return hmac;
  }




  wally_fn.createElectrumSeedOld = function (seedType = 'p2wpkh') {

    //if(bip39.validate(s)) {
    if (!seedType.includes('p2pkh, p2wpkh'))
    return;
    
    var s;
    var loopCount = 0;
    bip39.setProtocol('electrum');
    seedType = 'p2wpkh';


    while (true) {
      s = bip39.generateMnemonic((12 / 3) * 32);  // Generate a 12-word mnemonic

      if (this.wally_fn.seedVersion(s, 'electrum') == seedType) {
        break;  // Break the loop when the condition is met
      }

      loopCount++;
      if (loopCount >= 10000) {
        break;  // Break the loop after 100 iterations
      }

    }
    console.log('s: ', s);
    console.log('bip39.validate(s): ', bip39.validate(s));

    

    //Make sure the mnemonic we generate is not also a valid bip39 seed
    //by accident. Note that this test has not always been done historically,
    //so it cannot be relied upon.
    /*if bip39_is_checksum_valid(seed, wordlist=self.wordlist) == (True, True):
      continue;
    if is_new_seed(seed, prefix):
      break;
    */

    return s;


  }

//https://github.com/spesmilo/electrum/blob/4aa319e5c31543883346e28a5459fa3642601be6/electrum/mnemonic.py#L190-L222
wally_fn.createElectrumSeed = async function (seedType = 'p2wpkh') {
  console.log('===wally_fn.createElectrumSeed===');
  if (!seedType.includes('p2pkh') && !seedType.includes('p2wpkh')) {
    return false;
  }

  const maxLoops = 99999; //set a limit when looping
  const protocol = 'electrum';
  var usedProtocol = bip39.getProtocol();
  bip39.setProtocol('electrum');

  for (let loopCount = 0; loopCount < maxLoops; loopCount++) {
    const s = bip39.generateMnemonic(128); // 128 bits for 12 words

    if (wally_fn.seedVersion(s, protocol) == seedType) {
      //console.log('s: ', s);
      //console.log('bip39.validate(s): ', bip39.validate(s));
      console.log('loopCount: ', loopCount);
      return s;
    }

    //implement later or skip it basically since it cannot be relied upon.
    //Make sure the mnemonic we generate is not also a valid bip39 seed
    //by accident. Note that this test has not always been done historically,
    //so it cannot be relied upon.
    /*if bip39_is_checksum_valid(seed, wordlist=self.wordlist) == (True, True):
      continue;
    if is_new_seed(seed, prefix):
      break;
    */
    await wally_fn.timeout(1);
  }

  bip39.setProtocol(usedProtocol);  //set back the used protocol

  return false; //no Electrum seed was created
}



function getRandomInt(bound) {
  // Create a typed array to store random bytes
  const randomBytes = new Uint8Array(1);
  let randomInt;

  do {
    crypto.getRandomValues(randomBytes);
    // Convert the random byte to an integer and scale it to [1, bound)
    randomInt = randomBytes[0] % bound + 1;
  } while (randomInt >= bound);

  return randomInt;
}



  wally_fn.createElectrumSeedFromEntropy = async function (seedType = 'p2wpkh', maxLoops = 9999) {
    console.log('===wally_fn.createElectrumSeedFromEntropy===');
    if (!seedType.includes('p2pkh') && !seedType.includes('p2wpkh')) {
      return false;
    }

    const delayAfterIterations = 500;
    const protocol = 'electrum';
    const usedProtocol = bip39.getProtocol();
    //bip39.setProtocol('electrum');
    const numBits = 132; // 12 words require 128 bits of entropy

    const entropyArray = new Uint8Array(numBits / 8);
    crypto.getRandomValues(entropyArray); // Generate random entropy once

    //const entropyHex = '0x' + Array.from(entropyArray, byte => byte.toString(16).padStart(2, '0')).join('');
    const entropyHex = '0x' + Array.from({ length: numBits / 8 }, () =>
        getRandomInt(256-1).toString(16).padStart(2, '0')
      ).join('');
    
    
    //cat combine comfort hen simple symbol brush broken apple remove peanut general
    //console.log('entropyHex: ', entropyHex);
    let nonce = 0n;
    let entropy = BigInt(entropyHex);

    let loopCount;
    await wally_fn.timeout(50);
    for (loopCount = 0; loopCount < maxLoops; loopCount++) {
      
      while (true) {
        nonce += 1n;
        entropy = BigInt(entropyHex) + nonce;
        // Ensure the entropy string has a minimum length of 32 characters by padding it with '0' to the right if needed.
        const s = bip39.entropyToMnemonicElectrum(entropy.toString(16).padEnd(32, '0'), numBits);

        if (wally_fn.seedVersion(s, protocol) === seedType) {
          console.log('loopCount: ', loopCount, s, wally_fn.seedVersion(s, protocol));
          return s;
        }
        loopCount++;
        if (loopCount % delayAfterIterations === 0)
          await wally_fn.timeout(1);
      }
      loopCount++; // Increment loopCount one more time if seed is not found
    }

    //bip39.setProtocol(usedProtocol);
    return false;
  }








  // Usage with the seed and an optional client argument
  /*const result = wally_fn.seedVersion('enough tourist luggage comfort view garment picture assume dish void tide shed');
  if (result) {
      // The seed was processed successfully
  } else {
      // There was an error
  }
  */
  /*
  wally_fn.api = {};
  wally_fn.api.coingecko.balance = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,bitbay,potcoin,reddcoin,lynx,artbyte,infiniloop&vs_currencies=btc&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true';
  wally_fn.api.coingecko.AllMarketData = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y&locale=en';
  wally_fn.api.coingecko.supportedMarketData = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,bitbay,potcoin,reddcoin,lynx,artbyte,infiniloop&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y&locale=en';
  */
  /**
   * Counts the number of words in a given string.
   *
   * @param {string} str - The input string to count words in.
   * @returns {number} The count of words in the input string.
   */
  wally_fn.wordCount = function(str) {
    // Handle the case where 'str' is not a valid string or is empty
    if (typeof str !== 'string' || str.trim() === '')
      return false;

    return str.split(" ").length;
  }
  /**
   * Check if the last character of a string is a single quote, 'M', or 'm'.
   *
   * @param {string} str - The input string to check.
   * @returns {boolean} Returns `true` if the last character is a single quote, 'M', or 'm', `false` otherwise.
   */
  wally_fn.strIsHardened = function(str) {
    const strLength = str.length;
    if (typeof str !== 'string' || strLength === 0) {
      return false; // Return false for empty or non-string input
    }
    const lastChar = str[strLength - 1];
    return lastChar === "'" || lastChar === 'M' || lastChar === 'm';
  }


/**
 * Retrieve both receive and change addresses based on login type and coin key.
 *
 * @returns {{receive: string[], change: string[]}} An object containing arrays of receive and change addresses.
 */
wally_fn.getReceiveAndChangeAddresses = function() {
  console.log('===wall_fn.getReceiveAndChangeAddresses===');
  // Get the login type ('password' or 'mnemonic') and coin key
  const loginType = login_wizard.profile_data.login_type;
  const coinKey = coinjs.asset.slug;

  // Retrieve the addresses data
  const addressesData = login_wizard.profile_data.generated[coinKey][0].addresses;

  // Initialize arrays to store receive and change addresses
  let receiveAddresses = [];
  let changeAddresses = [];

  // Check the login type to determine which addresses to include
  if (loginType === 'password') {
    receiveAddresses = addressesData.receive.map(item => item.address);
  } else if (loginType === 'mnemonic') {
    // For mnemonic login, include both receive and change addresses
    receiveAddresses = addressesData.receive.map(item => item.address);
    changeAddresses = addressesData.change.map(item => item.address);
  }

  //console.log('===wall_fn.getReceiveAndChangeAddresses=== receiveAddresses: ', receiveAddresses);
  //console.log('===wall_fn.getReceiveAndChangeAddresses=== changeAddresses: ', changeAddresses);

  // Return an object with 'receive' and 'change' properties
  return { receive: receiveAddresses, change: changeAddresses };
}


/**
 * Retrieve the receive addresses based on login type and wallet type.
 *
 * @returns {string[]} An array of receive addresses.
 */
wally_fn.getReceiveAddresses = function() {
  const loginType = login_wizard.profile_data.login_type; // password, mnemonic
  const walletType = login_wizard.profile_data.wallet_type; // regular, mnemonic_wallet
  const coinKey = coinjs.asset.slug;
  const addressesData = login_wizard.profile_data.generated[coinKey][0].addresses.receive; // Get non-multisig addresses
  let addresses;

  if (loginType === 'password') {
    // No receive addresses for non-seed login
  } else if (loginType === 'mnemonic') {
    // Seed login has receive addresses
  }
  // Extract all addresses from the 'receive' array of objects
  addresses = addressesData.map(item => item.address);

  console.log(addresses);
  return addresses;
}



/**
 * Retrieve the change addresses based on login type and wallet type.
 *
 * @returns {string[]} An array of change addresses.
 */
wally_fn.getChangeAddresses = function() {
  const loginType = login_wizard.profile_data.login_type; // password, mnemonic
  const walletType = login_wizard.profile_data.wallet_type; // regular, mnemonic_wallet
  const coinKey = coinjs.asset.slug;
  let addressesData;
  let addresses = [];

  if (loginType === 'password') {
    // No change addresses for none-seed login
  } else if (loginType === 'mnemonic') {
    // Seed login has both change and receive addresses
    addressesData = login_wizard.profile_data.generated[coinKey][0].addresses;
    // Extract all addresses from the 'change' array of objects
    addresses = addressesData.change.map(item => item.address);
  }

  console.log(addresses);
  return addresses;
}



/**
 * Sets balance information for a specific address.
 *
 * @param {string} providerName - The API provider-name
 * @param {string} addressType - The type of address ('receive' or 'change').
 * @param {number} index - The index of the address in the addresses array.
 * @param {object} matchingApiResponse - The balance information to set for the address.
 */
wally_fn.setAddressBalanceInfo = function (providerName, addressType, index, matchingApiResponse) {
  console.log('setAddressBalanceInfo 1');
  // Ensure 'ext' field exists for the wallet address
  const walletAddress = login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses[addressType][index];

  if (!walletAddress.ext) {
    walletAddress.ext = {};
  }

  // Internal function to normalize balance data based on the provider
  function normalizeBalance(providerName, response) {
    let balance = {
      final_balance: 0,
      n_tx: 0,
      total_received: 0,
      total_sent: 0,
    };

    if (!response) {
      return normalized;
    }

    switch (providerName) {
      case 'electrumx':
        balance.final_balance = parseInt(response.confirmed, 10) || 0;
        balance.unconfirmed = parseInt(response.unconfirmed, 10) || 0;
        break;

      case 'blockchain.info':
        balance.final_balance = parseInt(response.final_balance, 10) || 0;
        balance.n_tx = parseInt(response.n_tx, 10) || 0;
        balance.total_received = parseInt(response.total_received, 10) || 0;
        break;

      case 'cryptoid.info':
        balance.final_balance = parseInt(response.final_balance, 10) || 0;
        balance.n_tx = parseInt(response.n_tx, 10) || 0;
        balance.total_received = parseInt(response.total_received, 10) || 0;
        balance.total_sent = parseInt(response.total_sent, 10) || 0;
        break;

      case 'evm':
        balance.final_balance = parseInt(response.balance, 10) || 0;
        break;

      default:
        console.warn(`Unknown provider: ${providerName}`);
        break;
    }

    return balance;
  }

  // Normalize the matching API response based on the provider
  const normalizedBalance = normalizeBalance(providerName, matchingApiResponse);

  // Store the normalized balance in the wallet address
  //walletAddress.ext.balance = normalizedBalance;
  walletAddress.ext.balance = normalizedBalance;

  const walletAddressView = login_wizard.profile_data.generated[coinjs.asset.slug][0].view[addressType][index];
  walletAddressView.ext = normalizedBalance;

  //login_wizard.profile_data.generated[coinjs.asset.slug][0].view[addressType][index].ext = normalizedBalance;

  //console.log('setAddressBalanceInfo 2:', normalizedBalance);


  //login_wizard.profile_data.generated[coinjs.asset.slug][0].view[addressType] = receiveArr;

  console.log(
    `Balance updated for provider: ${providerName}, ${addressType}[${index}], Script Hash: ${matchingApiResponse?.id || 'N/A'}`,
    normalizedBalance
  );
};


wally_fn.setAddressBalanceInfo2 = function (providerName, addressType, index, matchingApiResponse) {

  
  // Ensure 'ext' field exists for the wallet address
  // 'ext' field is used to store external data associated with the wallet address, such as balance and transaction inputs (listunspent).
  const walletAddress = login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses[addressType][index];
  
  if (!walletAddress.ext) {
    walletAddress.ext = {};
  }
  
  // Store balance information in the 'ext' field
  walletAddress.ext.balance = matchingApiResponse;

  // Update the original object with the modified walletAddress
  login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses[addressType][index].ext.balance = walletAddress.ext.balance;



  console.log('wally_fn.setBalanceInfo updated');

  /*
  unified keys for balance:
      "final_balance": 0,
      "n_tx": 0,
      "total_received": 0

  balance structure:
  cryptoid.info & blockchain.info
  "balance": {
    "address": "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
    "total_sent": 199541,
    "total_received": 199541,
    "final_balance": 0,
    "n_tx": 26
  }
{
      "address": "38xPY27A6fiRXHSDRbRkLfV2xQb7UmKpXv",
      "final_balance": 0,
      "n_tx": 0,
      "total_received": 0,
      "total_sent": 0
    },

  blockchain.info response:
  {
    "final_balance": 0,
    "n_tx": 0,
    "total_received": 0
  }
  
  Electrum response:
  {
    "confirmed": "121324",
    "unconfirmed": "0"
  },


  EVM response:
  {
    "account": "0x2b5ad5c4795c026514f8317c7a215e218dccd6cf",
    "balance": "3310800000000"
  },

  */
}



// Function to update nodes in wally_fn.networks.mainnet
/*wally_fn.updateElectrumNodes = function() {

// Fetch the JSON data from the file
fetch('./json/komodo_filtered_data.json')
  .then(response => response.json())
  .then(komodoFilteredData => {
    const nodes = wally_fn.networks.mainnet;

    komodoFilteredData.forEach(item => {
      // Find the coin key in networks.mainnet by matching the symbol
      for (let coinKey in nodes) {
        const coinData = nodes[coinKey];
        if (coinData.symbol === item.coin) {
          // Add the server and protocol as a node in electrumx.nodes
          const electrumNodes = coinData.asset.api.providers.electrumx.nodes;
          electrumNodes.push({
            name: item.server.split(":")[0], // Extract name from the server URL
            url: item.server, // Full server URL
            protocol: item.protocol.toLowerCase() // Convert protocol to lowercase
          });
          // No break here to allow adding all relevant nodes for the coin
        }
      }
    });
    
  })
  .catch(error => console.error('Error loading komodoFilteredData JSON:', error));
};

// Update wally_fn with komodoFilteredData
wally_fn.updateElectrumNodes();
*/

wally_fn.updateElectrumNodes2 = async function() {
  // Fetch the JSON data from the file
  fetch('./json/komodo_filtered_data.json')
    .then(response => response.json())
    .then(komodoFilteredData => {
      const nodes = wally_fn.networks.mainnet;

      if (Array.isArray(komodoFilteredData) && komodoFilteredData.length > 0) {
        komodoFilteredData.forEach(item => {
          // Only proceed if the coin is present in networks.mainnet
          if (item.coin && item.server && item.protocol) {
            for (let coinKey in nodes) {
              const coinData = nodes[coinKey];
              // Matching the symbol of the coin with item.coin
              if (coinData.symbol === item.coin) {
                // Ensure electrumx exists in the coin's API structure
                if (!coinData.asset.api.providers.electrumx) {
                  // Initialize electrumx if not already present
                  console.log(`KOMODO API - missing coin: ${coinKey}, provider set to empty`)
                  coinData.asset.api.providers.electrumx = {
                    nodes: [],
                    custom_nodes: [],
                  };
                }

                const electrumNodes = coinData.asset.api.providers.electrumx.nodes;
                // Ensure we're not duplicating nodes
                if (!electrumNodes.some(node => node.url === item.server)) {
                  console.log(`KOMODO API - missing node: ${coinKey}, node added`)
                  electrumNodes.push({
                    name: item.server.split(":")[0], // Extract name from the server URL
                    url: item.server, // Full server URL
                    protocol: item.protocol.toLowerCase() // Convert protocol to lowercase
                  });
                }
              }
            }
            //console.log(`KOMODO API coin: ${item.coin}`);
          }
        });
      } else {
        console.error('Invalid or empty komodoFilteredData');
      }
    })
    .catch(error => console.error('Error loading komodoFilteredData JSON:', error));
};

wally_fn.updateElectrumNodes = async function() {
  // Fetch the JSON data from the file
  fetch('./json/komodo_filtered_data.json')
    .then(response => response.json())
    .then(komodoFilteredData => {
      const nodes = wally_fn.networks.mainnet;

      if (Array.isArray(komodoFilteredData) && komodoFilteredData.length > 0) {
        komodoFilteredData.forEach(item => {
          // Only proceed if the coin is present in networks.mainnet
          if (item.coin && item.server && item.protocol) {
            for (let coinKey in nodes) {
              const coinData = nodes[coinKey];
              // Matching the symbol of the coin with item.coin
              if (coinData.symbol === item.coin) {
                // Ensure electrumx exists in the coin's API structure
                if (!coinData.asset.api.providers.electrumx) {
                  console.log(`KOMODO API - missing coin: ${coinKey}, provider set to empty`);
                  coinData.asset.api.providers.electrumx = {
                    nodes: [],
                    custom_nodes: [],
                  };
                }

                const electrumNodes = coinData.asset.api.providers.electrumx.nodes;

                // Ensure we're not duplicating nodes
                if (!electrumNodes.some(node => node.url === item.server)) {
                  console.log(`KOMODO API - missing node: ${coinKey}, node added`);
                  electrumNodes.push({
                    name: item.server.split(":")[0], // Extract name from the server URL
                    url: item.server, // Full server URL
                    protocol: item.protocol.toLowerCase(), // Convert protocol to lowercase
                  });

                  // Add the nodes to unspent_outputs and broadcast
                  const nodeName = `ElectrumX-${electrumNodes.length} (${item.protocol.toUpperCase()})`;

                  if (!coinData.asset.api.unspent_outputs) {
                    coinData.asset.api.unspent_outputs = {};
                  }
                  if (!coinData.asset.api.broadcast) {
                    coinData.asset.api.broadcast = {};
                  }

                  coinData.asset.api.unspent_outputs[nodeName] = item.server;
                  coinData.asset.api.broadcast[nodeName] = item.server;

                  console.log(
                    `KOMODO API - node added to unspent_outputs and broadcast: ${nodeName} -> ${item.server}`
                  );
                }
              }
            }
          }
        });
      } else {
        console.error("Invalid or empty komodoFilteredData");
      }
    })
    .catch(error => console.error("Error loading komodoFilteredData JSON:", error));
};

// Update wally_fn coins with komodoFilteredData
(async () => {
    try {
        await wally_fn.updateElectrumNodes();
        console.log('Electrum nodes updated successfully.');
    } catch (error) {
        console.error('Error updating electrum nodes:', error);
    }
})();



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