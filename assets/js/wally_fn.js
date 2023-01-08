/*
 @ Developed by Anoxy for Wally.id
 * Custom Misc. Functions for Wally.id
*/

(function () {

  var wally_fn = window.wally_fn = function () { };

  wally_fn.host = '';
  wally_fn.network = 'mainnet';
  wally_fn.provider = {utxo:'', broadcast:''};
  
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
  wally_fn.isHexKeyInRange = function (key) {

    try {
      console.log('key before: '+ key);
      

      //use max safe integer to determine if key is valid
      if (key <= 9007199254740991 )//Number.MAX_SAFE_INTEGER
        return true;
      
      //we got a BIG number! validate it!
      //var lastHexKeyInRange = new BigInteger('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140', 16).toString(16);
      var lastDecKeyinRange = new BigInteger('115792089237316195423570985008687907852837564279074904382605163141518161494336');


      var keyBig, keyLength = key.length;

      if (this.isDecimal(key)) { 
        console.log('is DIGIT');

        //just to reduce time for this function!
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
      console.log('isHexKeyInRange :', err)
    }
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
  wally_fn.hexPrivKeyDecode = function (h, option = {'supports_address':[]}) {

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
    try {
      
      
      //convert decimal to hex if needed
      console.log('h before: '+h)
      if(this.isDecimal(h)){
        //h = this.Decimal2Hex(h);
        //h = h.padStart(64, '0');
        h = new BigInteger(h).toString(16);
        console.log('we got a digit in hexdecode');
      }

      h = h.padStart(64, '0');  //wif should always be in 32bit/64 chars!

      console.log('h after: '+h)

      //check if HEXkey is in range!
      if (!this.isHexKeyInRange(h))
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
      console.log('option.length: '+option.length);
      if (option.supports_address.length){
        if (option.supports_address.includes('bech32')){
          var swbech32C = coinjs.bech32Address(pubKeyC.pubkey);
          address_formats.bech32 = swbech32C;
        }
        if (option.supports_address.includes('segwit')){
          var swC = coinjs.segwitAddress(pubKeyC.pubkey);
          address_formats.segwit = swC;
        }
        
      }
      console.log('address_formats: ', address_formats);

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
        
      
      console.log('hexGenerated: ', hexGenerated);
      return hexGenerated;

      //var privKeyWifC= coinjs.privkey2wif(hex);


      //generate segwit and bech32 address 
      
      //var swbech32 = coinjs.bech32Address(coin.pubkey);
      //var sw = coinjs.segwitAddress(coin.pubkey);
    } catch (err){
      console.log('ERROR (hexPrivKeyDecode): Out of Range! Error generating Bitcoin address!: ', err)
    }

  }

/*
 Validate/Decode/Convert key to address
 @key in:decimal/hex
*/
wally_fn.decodeHexPrivKey = function(key){
    
    console.log('=wally_fn.decodePrivKey=');

    try {
      //if int, convert to hex and then try to validate address
      if (Number.isInteger(key))
        key = this.Decimal2Hex;

      //check if string is in HEX format
      //if yes, add padding so its value is in 32bit/64char format
      if (this.isHex(key)) {
        if(key.length < 64)
          key = key.padStart(64, '0');
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
          return isEqual && wally_fn.isObjectEqual(x[key], y[key]);
        }, true) : (x === y);
  }


  wally_fn.networks = {
    mainnet : {
      bitcoin : {
        coinName: 'Bitcoin',
        symbol: 'BTC',      //ticker
        asset: {
          name: 'Bitcoin',
          slug: 'bitcoin',
          symbol: 'BTC',
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
            },
            broadcast: {
              'Blockchair.com': 'bitcoin',
              'Blockcypher.com': 'btc',
              'Blockstream.info': 'Blockstream.info', //no arguments needs to be passed
              'Chain.so': 'BTC',
              'Coinb.in': 'Coinb.in',                 //no arguments needs to be passed
              'Cryptoid.info': 'btc',
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
        developer: 'iceeeee',
      },
      litecoin : {
        coinName: 'Litecoin',
        symbol: 'LTC',      //ticker
        asset: {
          name: 'Litecoin',
          slug: 'litecoin',
          symbol: 'LTC',
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
        developer: 'iceeeee',
      },
      dogecoin : {
        coinName: 'Dogecoin',
        symbol: 'DOGE',      //ticker
        asset: {
          name: 'Dogecoin',
          slug: 'dogecoin',
          symbol: 'DOGE',
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
          //bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'ltc'},
          bech32 : {},
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'iceeeee',
      },
      bitbay : {
        coinName: 'BitBay',
        symbol: 'BAY',      //ticker
        asset: {
          name: 'BitBay',
          slug: 'bitbay',
          symbol: 'BAY',
          icon: './assets/images/crypto/bitbay-bay-logo-purple.svg',
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
        developer: 'iceeeee',
      },
      blackcoin : {
        coinName: 'Blackcoin',
        symbol: 'BLK',      //ticker
        asset: {
          name: 'Blackcoin',
          slug: 'blackcoin',
          symbol: 'BLK',
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
        developer: 'iceeeee',
      },
      lynx : {
        coinName: 'Lynx',
        symbol: 'LYNX',      //ticker
        asset: {
          name: 'Lynx',
          slug: 'lynx',
          symbol: 'LYNX',
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
        developer: 'iceeeee',
      },
    },
    testnet : {
      bitcoin : {
        coinName: 'Bitcoin',
        symbol: 'tBTC',      //ticker
        asset: {
          name: 'Bitcoin',
          slug: 'bitcoin',
          symbol: 'tBTC',
          icon: './assets/images/crypto/bitcoin-btc-logo.svg',
          network: 'testnet',
          supports_address : ['compressed', 'uncompressed', 'bech32', 'segwit'],
          api : {
              //only key is used for the moment, not the value!
            unspent_outputs: {
              'Blockchair.com': 'bitcoin',
              'Blockcypher.com': 'btc',
              //'Blockstream.info': 'Blockstream.info',
              'Chain.so': 'BTCTEST',
            },
            broadcast: {
              'Blockchair.com': 'bitcoin',
              'Blockcypher.com': 'btc',
              'Blockstream.info': 'Blockstream.info',
              'Chain.so': 'BTCTEST',
            }
          }
        },
        pub : 0x6f,      //pubKeyHash
        priv : 0xef,     //wif
        multisig : 0xc4, //scriptHash
          hdkey : {'prv':0x04358394, 'pub':0x043587cf},
          //bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'tp'},
          bech32 : {},
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: true,
        developer: 'iceeeee',
      },
      litecoin : {
        coinName: 'Litecoin',
        symbol: 'tLTC',      //ticker
        asset: {
          name: 'Litecoin',
          slug: 'litecoin',
          symbol: 'tLTC',
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
          bech32 : {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'ltc'},
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'iceeeee',
      },
      dogecoin : {
        coinName: 'Dogecoin',
        symbol: 'tDOGE',      //ticker
        asset: {
          name: 'Dogecoin',
          slug: 'dogecoin',
          symbol: 'tDOGE',
          icon: './assets/images/crypto/dogecoin-doge-logo.svg',
          network: 'testnet',
          supports_address : ['compressed', 'uncompressed'],
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
          bech32 : {},
          
        txExtraTimeField: false,    //Set to true for PoS coins
        txExtraTimeFieldValue: false,
        txExtraUnitField: false,
        txExtraUnitFieldValue: false,
        decimalPlaces:8,
        txRBFTransaction: false,
        developer: 'iceeeee',
      },
    }

  };

  

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
