//'use strict';
/*
 Coinjs 0.01 beta by OutCast3k{at}gmail.com
 A bitcoin framework.

 http://github.com/OutCast3k/coinjs or http://coinb.in/coinjs
*/

(function () {

	var coinjs = window.coinjs = function () { };

	/* public vars */
	coinjs.pub = 0;
	coinjs.priv = 0x80;
	coinjs.multisig = 0x05;
	coinjs.hdkey = {'prv':0x0488ade4, 'pub':0x0488b21e};
	coinjs.bech32 = {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'bc'};
	coinjs.base32pref = '';	//prefix for address like BCH -> q
	//coinjs.bip32 = coinjs.hdkey;
	coinjs.bip44 = coinjs.hdkey;
	//bip49/p2wpkhInP2sh - deriving P2WPKH-nested-in-P2SH - segwit, ypub
  coinjs.bip49 = {'prv':0x049d7878, 'pub':0x049d7cb2}; //bip49 ypub
  //bip84/p2wpkh - Derives segwit + bech32 addresses from seed, zprv/zpub and vprv/vpub in javascript
  coinjs.bip84 = {'prv':0x04b2430c, 'pub':0x04b24746}; // zpub
  
  coinjs.bippath = 0;  //bip path constants are used as hardened derivation.
	coinjs.biptypes = ['bip32', 'bip44', 'bip49', 'bip84'];	//supported bip types

	//for PoS coins!
	coinjs.txExtraTimeField = false;
	coinjs.txExtraTimeFieldValue = false;
	coinjs.txExtraUnitField = false;
	coinjs.txExtraUnitFieldValue = false;

	coinjs.decimalPlaces = 8;
	coinjs.symbol = 'BTC';
	coinjs.coinName = 'Bitcoin';
	coinjs.asset = {
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
              'Blockcypher.com': 'btc',
              'Blockchain.info': 'btc', //no arguments needs to be passed
              //'Blockchair.com': 'bitcoin',
              
              'Blockstream.info': 'Blockstream.info',
              //'Chain.so': 'BTC',
              'Coinb.in': 'Coinb.in',
              'Cryptoid.info': 'btc',
              //'Mempool.space': 'btc',
            },
            broadcast: {
              'Blockcypher.com': 'btc',
              //'Blockchair.com': 'bitcoin',
              
              'Blockstream.info': 'Blockstream.info', //no arguments needs to be passed
              //'Chain.so': 'BTC',
              'Coinb.in': '',                 //no arguments needs to be passed
              'Cryptoid.info': 'btc',
              //'Mempool.space': 'btc',
            }
          },
          data: {
            blocktime: 1231006505,
            total_tokens: "19382187.00000000",
          },
          social: {
            discord : {
              official: '',
            },
            telegram : {
              official: '',
              english: '',
            },
            twitter : {
              official: '',
            },
            website: {
              official: '',
            },
          },

        };



/*
var types = {
  MULTISIG: 'multisig',
  NONSTANDARD: 'nonstandard',
  NULLDATA: 'nulldata',
  P2PK: 'pubkey',
  P2PKH: 'pubkeyhash',
  P2SH: 'scripthash',
  P2WPKH: 'witnesspubkeyhash',
  P2WSH: 'witnessscripthash',
  WITNESS_COMMITMENT: 'witnesscommitment'
}

module.exports = {
  classifyInput: classifyInput,
  classifyOutput: classifyOutput,
  classifyWitness: classifyWitness,
  multisig: multisig,
  nullData: nullData,
  pubKey: pubKey,
  pubKeyHash: pubKeyHash,
  scriptHash: scriptHash,
  witnessPubKeyHash: witnessPubKeyHash,
  witnessScriptHash: witnessScriptHash,
  witnessCommitment: witnessCommitment,
  types: types
}

<option value="litecoin_testnet" rel="0x6f;0xef;0xc4;0x43587cf;0x4358394;NOT.SET;NOT.SET">Litecoin (testnet)</option>
<option value="dogecoin_testnet" rel="0x71;0xf1;0xc4;0x43587cf;0x4358394;NOT.SET;NOT.SET">Bitcoin (testnet)</option>

libs.bitcoin.networks.crown = {
  messagePrefix: 'unused',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,


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



	coinjs.pub = 0x19;
	coinjs.priv = 0x99;
	coinjs.multisig = 0x55;
	coinjs.multisig_str = "55";
	coinjs.hdkey = {'prv':0x02cfbf60, 'pub':0x02cfbede};
	coinjs.bech32 = {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'bc'};

	https://chainz.cryptoid.info/bay/api.dws?q=multiaddr&active=bEt6ewGusWxrAbWUQLQZeJJTEHvSzGR8Uy|BJLZ29gAk9aGW9HoAnsEzqmWp6BX7tZEN8|bSg6gu7nH8aHwz2FTqfNF3h6TBExozfkMc|BEWNxapAtBtj2hqQGbQ8Ae6xNyyz5qcMrJ|bNZQjohFer1caZT8YbbvDqA5A4VRuY1NZ7&key=fcda1e67b06e&n=0

https://chainz.cryptoid.info/bay/api.dws?q=multiaddr&active=bEt6ewGusWxrAbWUQLQZeJJTEHvSzGR8Uy|BJLZ29gAk9aGW9HoAnsEzqmWp6BX7tZEN8|bSg6gu7nH8aHwz2FTqfNF3h6TBExozfkMc|BEWNxapAtBtj2hqQGbQ8Ae6xNyyz5qcMrJ|bNZQjohFer1caZT8YbbvDqA5A4VRuY1NZ7&key=fcda1e67b06e&n=0

73 addresses
*/


	coinjs.compressed = false;

	/* other vars */
	coinjs.developer = ''; //donation address

	/* bit(coinb.in) api vars */
	coinjs.hostname	= ((document.location.hostname.split(".")[(document.location.hostname.split(".")).length-1]) == 'onion') ? 'coinbin3ravkwb24f7rmxx6w3snkjw45jhs5lxbh3yfeg3vpt6janwqd.onion' : 'coinb.in';
	coinjs.host = ('https:'==document.location.protocol?'https://':'http://')+coinjs.hostname+'/api/';
	coinjs.uid = '1';
	coinjs.key = '12345678901234567890123456789012';

	/* start of address functions */

	/* generate a private and public keypair, with address and WIF address */
	coinjs.newKeys = function(input){
		var privkey = (input) ? Crypto.SHA256(input) : this.newPrivkey();
		var pubkey = this.newPubkey(privkey);
		return {
			'privkey': privkey,
			'pubkey': pubkey,
			'address': this.pubkey2address(pubkey),
			'wif': this.privkey2wif(privkey),
			'compressed': this.compressed
		};
	}

	/* generate a new random private key */
	coinjs.newPrivkey = function(){
		var x = window.location;
		x += (window.screen.height * window.screen.width * window.screen.colorDepth);
		x += coinjs.random(64);
		x += (window.screen.availHeight * window.screen.availWidth * window.screen.pixelDepth);
		x += navigator.language;
		x += window.history.length;
		x += coinjs.random(64);
		x += navigator.userAgent;
		x += 'coinb.in';
		x += (Crypto.util.randomBytes(64)).join("");
		x += x.length;
		var dateObj = new Date();
		x += dateObj.getTimezoneOffset();
		x += coinjs.random(64);
		x += (document.getElementById("entropybucket")) ? document.getElementById("entropybucket").innerHTML : '';
		x += x+''+x;
		var r = x;
		for(i=0;i<(x).length/25;i++){
			r = Crypto.SHA256(r.concat(x));
		}
		var checkrBigInt = new BigInteger(r);
		var orderBigInt = new BigInteger("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
		while (checkrBigInt.compareTo(orderBigInt) >= 0 || checkrBigInt.equals(BigInteger.ZERO) || checkrBigInt.equals(BigInteger.ONE)) {
			r = Crypto.SHA256(r.concat(x));
			checkrBigInt = new BigInteger(r);
		}
		return r;
	}

	/* generate a public key from a private key */
	coinjs.newPubkey = function(hash){
		var privateKeyBigInt = BigInteger.fromByteArrayUnsigned(Crypto.util.hexToBytes(hash));
		var curve = EllipticCurve.getSECCurveByName("secp256k1");

		var curvePt = curve.getG().multiply(privateKeyBigInt);
		var x = curvePt.getX().toBigInteger();
		var y = curvePt.getY().toBigInteger();

		var publicKeyBytes = EllipticCurve.integerToBytes(x, 32);
		publicKeyBytes = publicKeyBytes.concat(EllipticCurve.integerToBytes(y,32));
		publicKeyBytes.unshift(0x04);

		if(coinjs.compressed==true){
			var publicKeyBytesCompressed = EllipticCurve.integerToBytes(x,32)
			if (y.isEven()){
				publicKeyBytesCompressed.unshift(0x02)
			} else {
				publicKeyBytesCompressed.unshift(0x03)
			}
			return Crypto.util.bytesToHex(publicKeyBytesCompressed);
		} else {
			return Crypto.util.bytesToHex(publicKeyBytes);
		}
	}

	/* provide a public key and return address */
	coinjs.pubkey2address = function(h, byte){
		var r = ripemd160(Crypto.SHA256(Crypto.util.hexToBytes(h), {asBytes: true}));
		r.unshift(byte || coinjs.pub);
		var hash = Crypto.SHA256(Crypto.SHA256(r, {asBytes: true}), {asBytes: true});
		var checksum = hash.slice(0, 4);
		return coinjs.base58encode(r.concat(checksum));
	}

	/* provide a scripthash and return address */
	coinjs.scripthash2address = function(h){
		var x = Crypto.util.hexToBytes(h);
		x.unshift(coinjs.pub);
		var r = x;
		r = Crypto.SHA256(Crypto.SHA256(r,{asBytes: true}),{asBytes: true});
		var checksum = r.slice(0,4);
		return coinjs.base58encode(x.concat(checksum));
	}

	/* provide an address and return ripemd160 hash of public key */
	coinjs.address2ripemd160 = function(a){
		var bytes = coinjs.base58decode(a);
    var front = bytes.slice(1, bytes.length-4);
    return Crypto.util.bytesToHex(front);
	}

	/* new multisig address, provide the pubkeys AND required signatures to release the funds */
	coinjs.pubkeys2MultisigAddress = function(pubkeys, required) {
		var s = coinjs.script();
		s.writeOp(81 + (required*1) - 1); //OP_1
		for (var i = 0; i < pubkeys.length; ++i) {
			s.writeBytes(Crypto.util.hexToBytes(pubkeys[i]));
		}
		s.writeOp(81 + pubkeys.length - 1); //OP_1 
		s.writeOp(174); //OP_CHECKMULTISIG
		var x = ripemd160(Crypto.SHA256(s.buffer, {asBytes: true}), {asBytes: true});
		x.unshift(coinjs.multisig);
		var r = x;
		r = Crypto.SHA256(Crypto.SHA256(r, {asBytes: true}), {asBytes: true});
		var checksum = r.slice(0,4);
		var redeemScript = Crypto.util.bytesToHex(s.buffer);
		var address = coinjs.base58encode(x.concat(checksum));

		if(s.buffer.length > 520){ // too large
			address = 'invalid';
			redeemScript = 'invalid';
		}

		return {'address':address, 'redeemScript':redeemScript, 'size': s.buffer.length};
	}

	/* new time locked address, provide the pubkey and time necessary to unlock the funds.
	   when time is greater than 500000000, it should be a unix timestamp (seconds since epoch),
	   otherwise it should be the block height required before this transaction can be released. 

	   may throw a string on failure!
	*/
	coinjs.simpleHodlAddress = function(pubkey, checklocktimeverify) {

		if(checklocktimeverify < 0) {
			throw "Parameter for OP_CHECKLOCKTIMEVERIFY is negative.";
		}

		var s = coinjs.script();
		if (checklocktimeverify <= 16 && checklocktimeverify >= 1) {
			s.writeOp(0x50 + checklocktimeverify);//OP_1 to OP_16 for minimal encoding
		} else {
			s.writeBytes(coinjs.numToScriptNumBytes(checklocktimeverify));
		}
		s.writeOp(177);//OP_CHECKLOCKTIMEVERIFY
		s.writeOp(117);//OP_DROP
		s.writeBytes(Crypto.util.hexToBytes(pubkey));
		s.writeOp(172);//OP_CHECKSIG

		var x = ripemd160(Crypto.SHA256(s.buffer, {asBytes: true}), {asBytes: true});
		x.unshift(coinjs.multisig);
		var r = x;
		r = Crypto.SHA256(Crypto.SHA256(r, {asBytes: true}), {asBytes: true});
		var checksum = r.slice(0,4);
		var redeemScript = Crypto.util.bytesToHex(s.buffer);
		var address = coinjs.base58encode(x.concat(checksum));

		return {'address':address, 'redeemScript':redeemScript};
	}

	/* create a new segwit address */
	coinjs.segwitAddress = function(pubkey){
		var keyhash = [0x00,0x14].concat(ripemd160(Crypto.SHA256(Crypto.util.hexToBytes(pubkey), {asBytes: true}), {asBytes: true}));
		var x = ripemd160(Crypto.SHA256(keyhash, {asBytes: true}), {asBytes: true});
		x.unshift(coinjs.multisig);
		var r = x;
		r = Crypto.SHA256(Crypto.SHA256(r, {asBytes: true}), {asBytes: true});
		var checksum = r.slice(0,4);
		var address = coinjs.base58encode(x.concat(checksum));

		return {'address':address, 'type':'segwit', 'redeemscript':Crypto.util.bytesToHex(keyhash)};
	}

	/* create a new segwit bech32 encoded address */
	coinjs.bech32Address = function(pubkey){
		var program = ripemd160(Crypto.SHA256(Crypto.util.hexToBytes(pubkey), {asBytes: true}), {asBytes: true});
		var address = coinjs.bech32_encode(coinjs.bech32.hrp, [coinjs.bech32.version].concat(coinjs.bech32_convert(program, 8, 5, true))); 
		return {'address':address, 'type':'bech32', 'redeemscript':Crypto.util.bytesToHex(program)};
	}

	/* extract the redeemscript from a bech32 address */
	coinjs.bech32redeemscript = function(address){
		var r = false;
		var decode = coinjs.bech32_decode(address);
		if(decode){
			decode.data.shift();
			return Crypto.util.bytesToHex(coinjs.bech32_convert(decode.data, 5, 8, false));
		}
		return r;
	}

	
	/* provide a privkey and return an WIF  */
	coinjs.privkey2wif = function(h){
		var r = Crypto.util.hexToBytes(h);

		
		if(coinjs.compressed==true){
			r.push(0x01);
			h = (h.toString()).padStart(64, '0');
		}

		r.unshift(coinjs.priv);
		var hash = Crypto.SHA256(Crypto.SHA256(r, {asBytes: true}), {asBytes: true});
		var checksum = hash.slice(0, 4);

		return coinjs.base58encode(r.concat(checksum));
	}

	/* convert a privkey to pubkey*/
	coinjs.privkey2pubkey = function (h, compressed = true) {


		if (compressed==true) 
			coinjs.compressed = true;
		else
			coinjs.compressed = false;

		console.log('coinjs.privkey2pubkey: ', h)
		var pubkey = coinjs.newPubkey(h);
		return {'pubkey':pubkey,'compressed':coinjs.compressed};
	}

	/* convert a wif key back to a private key */
	coinjs.wif2privkey = function(wif){
		var compressed = false;
		var decode = coinjs.base58decode(wif);
		var key = decode.slice(0, decode.length-4);
		key = key.slice(1, key.length);
		if(key.length>=33 && key[key.length-1]==0x01){
			key = key.slice(0, key.length-1);
			compressed = true;
		}
		return {'privkey': Crypto.util.bytesToHex(key), 'compressed':compressed};
	}

	/* convert a wif to a pubkey */
	coinjs.wif2pubkey = function(wif){
		var compressed = coinjs.compressed;
		var r = coinjs.wif2privkey(wif);
		coinjs.compressed = r['compressed'];
		var pubkey = coinjs.newPubkey(r['privkey']);
		coinjs.compressed = compressed;
		return {'pubkey':pubkey,'compressed':r['compressed']};
	}

	/* convert a wif to a address */
	coinjs.wif2address = function(wif){
		var r = coinjs.wif2pubkey(wif);
		return {'address':coinjs.pubkey2address(r['pubkey']), 'compressed':r['compressed']};
	}

	/* decode or validate an address and return the hash */
	coinjs.addressDecode = function(addr){
		try {
			var bytes = coinjs.base58decode(addr);
			var front = bytes.slice(0, bytes.length-4);
			var back = bytes.slice(bytes.length-4);
			var checksum = Crypto.SHA256(Crypto.SHA256(front, {asBytes: true}), {asBytes: true}).slice(0, 4);
			if (checksum+"" == back+"") {

				var o = {};
				o.bytes = front.slice(1);
				o.version = front[0];

				if(o.version==coinjs.pub){ // standard address
					o.type = 'standard';

				} else if (o.version==coinjs.multisig) { // multisig address
					o.type = 'multisig';

				} else if (o.version==coinjs.priv){ // wifkey
					o.type = 'wifkey';

				} else if (o.version==42) { // stealth address
					o.type = 'stealth';

					o.option = front[1];
					if (o.option != 0) {
						alert("Stealth Address option other than 0 is currently not supported!");
						return false;
					};

					o.scankey = Crypto.util.bytesToHex(front.slice(2, 35));
					o.n = front[35];

					if (o.n > 1) {
						alert("Stealth Multisig is currently not supported!");
						return false;
					};
				
					o.spendkey = Crypto.util.bytesToHex(front.slice(36, 69));
					o.m = front[69];
					o.prefixlen = front[70];
				
					if (o.prefixlen > 0) {
						alert("Stealth Address Prefixes are currently not supported!");
						return false;
					};
					o.prefix = front.slice(71);

				} else { // everything else
					o.type = 'other'; // address is still valid but unknown version
				}

				return o;
			} else {
				throw "Invalid checksum";
			}
		} catch(e) {
			if(coinjs.bech32.charset !== undefined) {
				bech32rs = coinjs.bech32redeemscript(addr);
				if(bech32rs)
					return {'type':'bech32', 'redeemscript':bech32rs};
			}
			return false;
		}
	}

	/* retreive the balance from a given address */
	coinjs.addressBalance = function(address, callback){
		coinjs.ajax(coinjs.host+'?uid='+coinjs.uid+'&key='+coinjs.key+'&setmodule=addresses&request=bal&address='+address+'&r='+Math.random(), callback, "GET");
	}

	/* decompress an compressed public key */
	coinjs.pubkeydecompress = function(pubkey) {
		if((typeof(pubkey) == 'string') && pubkey.match(/^[a-f0-9]+$/i)){
			var curve = EllipticCurve.getSECCurveByName("secp256k1");
			try {
				var pt = curve.curve.decodePointHex(pubkey);
				var x = pt.getX().toBigInteger();
				var y = pt.getY().toBigInteger();

				var publicKeyBytes = EllipticCurve.integerToBytes(x, 32);
				publicKeyBytes = publicKeyBytes.concat(EllipticCurve.integerToBytes(y,32));
				publicKeyBytes.unshift(0x04);
				return Crypto.util.bytesToHex(publicKeyBytes);
			} catch (e) {
				// console.log(e);
				return false;
			}
		}
		return false;
	}

	coinjs.bech32_polymod = function(values) {
		var chk = 1;
		var BECH32_GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
		for (var p = 0; p < values.length; ++p) {
			var top = chk >> 25;
			chk = (chk & 0x1ffffff) << 5 ^ values[p];
			for (var i = 0; i < 5; ++i) {
				if ((top >> i) & 1) {
					chk ^= BECH32_GENERATOR[i];
				}
			}
		}
		return chk;
	}

	coinjs.base32polymod = function(data) {
	  let GENERATOR = [0x98f2bc8e61n, 0x79b76d99e2n, 0xf33e5fb3c4n, 0xae2eabe2a8n, 0x1e4f43e470n];
	  let checksum = 1n;
	  for (let i=0; i< data.length; ++i) {
	    let value = data[i];
	    let topBits = checksum >> 35n;
	    checksum = ((checksum & 0x07ffffffffn) << 5n) ^ BigInt(value);
	    for (let j=0; j< GENERATOR.length; ++j) {
	      if (((topBits >> BigInt(j)) & 1n) == 1n) {
	        checksum = checksum ^ BigInt(GENERATOR[j]);
	      }
	    }
	  }
	  return checksum ^ 1n;
	}

	coinjs.bech32_hrpExpand = function(hrp) {
		var ret = [];
		var p;
		for (p = 0; p < hrp.length; ++p) {
			ret.push(hrp.charCodeAt(p) >> 5);
		}
		ret.push(0);
		for (p = 0; p < hrp.length; ++p) {
			ret.push(hrp.charCodeAt(p) & 31);
		}
		return ret;
	}	

	coinjs.	bech32_verifyChecksum = function(hrp, data) {
		return coinjs.bech32_polymod(coinjs.bech32_hrpExpand(hrp).concat(data)) === 1;
	}

	coinjs.bech32_createChecksum = function(hrp, data) {
		var values = coinjs.bech32_hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
		var mod = coinjs.bech32_polymod(values) ^ 1;
		var ret = [];
		for (var p = 0; p < 6; ++p) {
			ret.push((mod >> 5 * (5 - p)) & 31);
		}	
		return ret;
	}

	coinjs.bech32_encode = function(hrp, data) {
		var combined = data.concat(coinjs.bech32_createChecksum(hrp, data));
		var ret = hrp + '1';
		for (var p = 0; p < combined.length; ++p) {
			ret += coinjs.bech32.charset.charAt(combined[p]);
		}
		return ret;
	}

	coinjs.bech32_decode = function(bechString) {
		var p;
		var has_lower = false;
		var has_upper = false;
		for (p = 0; p < bechString.length; ++p) {
			if (bechString.charCodeAt(p) < 33 || bechString.charCodeAt(p) > 126) {
				return null;
			}
			if (bechString.charCodeAt(p) >= 97 && bechString.charCodeAt(p) <= 122) {
				has_lower = true;
			}
			if (bechString.charCodeAt(p) >= 65 && bechString.charCodeAt(p) <= 90) {
				has_upper = true;
			}
		}
		if (has_lower && has_upper) {
			return null;
		}
		bechString = bechString.toLowerCase();
		var pos = bechString.lastIndexOf('1');
		if (pos < 1 || pos + 7 > bechString.length || bechString.length > 90) {
			return null;
		}
		var hrp = bechString.substring(0, pos);
		var data = [];
		for (p = pos + 1; p < bechString.length; ++p) {
			var d = coinjs.bech32.charset.indexOf(bechString.charAt(p));
			if (d === -1) {
				return null;
			}
			data.push(d);
		}
		if (!coinjs.bech32_verifyChecksum(hrp, data)) {
			return null;
		}
		return {
			hrp: hrp,
			data: data.slice(0, data.length - 6)
		};
	}

	coinjs.bech32_convert = function(data, inBits, outBits, pad) {
		var value = 0;
		var bits = 0;
		var maxV = (1 << outBits) - 1;

		var result = [];
		for (var i = 0; i < data.length; ++i) {
			value = (value << inBits) | data[i];
			bits += inBits;

			while (bits >= outBits) {
				bits -= outBits;
				result.push((value >> bits) & maxV);
			}
		}

		if (pad) {
			if (bits > 0) {
				result.push((value << (outBits - bits)) & maxV);
			}
		} else {
			if (bits >= inBits) throw new Error('Excess padding');
			if ((value << (outBits - bits)) & maxV) throw new Error('Non-zero padding');
		}

		return result;
	}


	// Helper function to convert 5-bit words into 8-bit bytes
	coinjs.bech32_convertBits = function(data, fromBits, toBits, pad) {
	    var acc = 0;
	    var bits = 0;
	    var result = [];
	    var maxV = (1 << toBits) - 1;

	    for (var i = 0; i < data.length; i++) {
	        acc = (acc << fromBits) | data[i];
	        bits += fromBits;
	        while (bits >= toBits) {
	            bits -= toBits;
	            result.push((acc >> bits) & maxV);
	        }
	    }

	    if (pad) {
	        if (bits > 0) {
	            result.push((acc << (toBits - bits)) & maxV);
	        }
	    } else if (bits >= fromBits || (acc << (toBits - bits)) & maxV) {
	        return null; // Invalid padding
	    }

	    return result;
	};
	coinjs.CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
	coinjs.CHARSET_INVERSE_INDEX = {
  'q': 0, 'p': 1, 'z': 2, 'r': 3, 'y': 4, '9': 5, 'x': 6, '8': 7,
  'g': 8, 'f': 9, '2': 10, 't': 11, 'v': 12, 'd': 13, 'w': 14, '0': 15,
  's': 16, '3': 17, 'j': 18, 'n': 19, '5': 20, '4': 21, 'k': 22, 'h': 23,
  'c': 24, 'e': 25, '6': 26, 'm': 27, 'u': 28, 'a': 29, '7': 30, 'l': 31,
};

	coinjs.convertBits = function(data, from, to) {
	  let length = Math.ceil(data.length * from / to);
	  let mask = (1 << to) - 1;
	  let result = [];
	  for(let i=0; i< length; ++i) { result.push(0); }
	  let index = 0;
	  let accumulator = 0;
	  let bits = 0;
	  for (let i=0; i< data.length; ++i) {
	    let value = data[i];
	    accumulator = (accumulator << from) | value;
	    bits += from;
	    while (bits >= to) {
	      bits -= to;
	      result[index] = (accumulator >> bits) & mask;
	      ++index;
	    }
	  }
	  if (bits > 0) {
	    result[index] = (accumulator << (to - bits)) & mask;
	    ++index;
	  }
	  return result;
	};


var decodeBase32AsBytes = function(string) {
  let data = [];
  for (let i = 0; i < string.length; ++i) {
    let value = string[i];
    data.push(coinjs.CHARSET_INVERSE_INDEX[value]);
  }
  data = data.slice(0,data.length-8); // minus checksum
  let bytes = coinjs.convertBits(data, 5,8);
  bytes = bytes.slice(0, bytes.length-1);
  let probe = coinjs.encodeBytesToBase32(bytes);
  if (probe != string) {
    return false;
  }
  return bytes;
};

	coinjs.encodeBytesToBase32 = function (bytes) {
  let data = coinjs.convertBits(bytes, 8, 5);
  //let data = coinjs.bech32_convertBits(bytes, 8, 5);

  let prefixToUint5Array = function(prefix) {
    let result = [];
    for (let i=0; i < prefix.length; ++i) {
      result.push(prefix[i].charCodeAt(0) & 31);
    }
    return result;
  }
  let chksumx = prefixToUint5Array(coinjs.base32pref);		//bch bitcoincash prefix fix iceeeeeeeeeeeee
  //let chksumx = prefixToUint5Array(coinjs.bech32.hrp);
  
  chksumx.push(0);
  chksumx.push(...data);
  chksumx.push(...[0,0,0,0, 0,0,0,0]);
  let checksumToUint5Array = function(checksum) {
    let result = [0,0,0,0, 0,0,0,0];
    for (let i= 0; i< 8; ++i) {
      result[7 - i] = Number(checksum & 31n);
      checksum = checksum >> 5n;
    }
    return result;
  }
  data.push(...checksumToUint5Array(coinjs.base32polymod(chksumx)));
  let base32 = '';
  for (let i = 0; i < data.length; ++i) {
    let value = data[i];
    base32 += coinjs.CHARSET[value];
    //base32 += coinjs.bech32.charset[value];

  }
  return base32;
};

coinjs.createBCHQAddress = function(publicKeyHex) {
    coinjs.base32pref = 'q';	//Set base prefix for BCH
    // Step 1: SHA256 of public key
    let sha256Key = Crypto.SHA256(Crypto.util.hexToBytes(publicKeyHex));
    
    // Step 2: RIPEMD160 of SHA256 result
    let ripemd160Key = ripemd160(Crypto.util.hexToBytes(sha256Key));
    
    // Step 3: Add version byte for P2PKH (0)
    let versionAndRipemd = [0x00].concat((ripemd160Key));
    
    // Step 4: Encode using the existing function which handles prefix and checksum
    let address = coinjs.encodeBytesToBase32(versionAndRipemd);
    
    console.log('Final address:', address);
    return address;
}
/*
// Example usage
var publicKeyHex = '030397E43C21A639F85305C438771A1BCC3B8AF52138ADDB4D9CE35B933FA9898B';
var bchQAddress = coinjs.createBCHQAddress(publicKeyHex);
console.log('Generated BCH Q Address:', bchQAddress);
*/
	coinjs.testdeterministicK = function() {
		// https://github.com/bitpay/bitcore/blob/9a5193d8e94b0bd5b8e7f00038e7c0b935405a03/test/crypto/ecdsa.js
		// Line 21 and 22 specify digest hash and privkey for the first 2 test vectors.
		// Line 96-117 tells expected result.

		var tx = coinjs.transaction();

		var test_vectors = [
			{
				'message': 'test data',
				'privkey': 'fee0a1f7afebf9d2a5a80c0c98a31c709681cce195cbcd06342b517970c0be1e',
				'k_bad00': 'fcce1de7a9bcd6b2d3defade6afa1913fb9229e3b7ddf4749b55c4848b2a196e',
				'k_bad01': '727fbcb59eb48b1d7d46f95a04991fc512eb9dbf9105628e3aec87428df28fd8',
				'k_bad15': '398f0e2c9f79728f7b3d84d447ac3a86d8b2083c8f234a0ffa9c4043d68bd258'
			},
			{
				'message': 'Everything should be made as simple as possible, but not simpler.',
				'privkey': '0000000000000000000000000000000000000000000000000000000000000001',
				'k_bad00': 'ec633bd56a5774a0940cb97e27a9e4e51dc94af737596a0c5cbb3d30332d92a5',
				'k_bad01': 'df55b6d1b5c48184622b0ead41a0e02bfa5ac3ebdb4c34701454e80aabf36f56',
				'k_bad15': 'def007a9a3c2f7c769c75da9d47f2af84075af95cadd1407393dc1e26086ef87'
			},
			{
				'message': 'Satoshi Nakamoto',
				'privkey': '0000000000000000000000000000000000000000000000000000000000000002',
				'k_bad00': 'd3edc1b8224e953f6ee05c8bbf7ae228f461030e47caf97cde91430b4607405e',
				'k_bad01': 'f86d8e43c09a6a83953f0ab6d0af59fb7446b4660119902e9967067596b58374',
				'k_bad15': '241d1f57d6cfd2f73b1ada7907b199951f95ef5ad362b13aed84009656e0254a'
			},
			{
				'message': 'Diffie Hellman',
				'privkey': '7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f',
				'k_bad00': 'c378a41cb17dce12340788dd3503635f54f894c306d52f6e9bc4b8f18d27afcc',
				'k_bad01': '90756c96fef41152ac9abe08819c4e95f16da2af472880192c69a2b7bac29114',
				'k_bad15': '7b3f53300ab0ccd0f698f4d67db87c44cf3e9e513d9df61137256652b2e94e7c'
			},
			{
				'message': 'Japan',
				'privkey': '8080808080808080808080808080808080808080808080808080808080808080',
				'k_bad00': 'f471e61b51d2d8db78f3dae19d973616f57cdc54caaa81c269394b8c34edcf59',
				'k_bad01': '6819d85b9730acc876fdf59e162bf309e9f63dd35550edf20869d23c2f3e6d17',
				'k_bad15': 'd8e8bae3ee330a198d1f5e00ad7c5f9ed7c24c357c0a004322abca5d9cd17847'
			},
			{
				'message': 'Bitcoin',
				'privkey': 'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140',
				'k_bad00': '36c848ffb2cbecc5422c33a994955b807665317c1ce2a0f59c689321aaa631cc',
				'k_bad01': '4ed8de1ec952a4f5b3bd79d1ff96446bcd45cabb00fc6ca127183e14671bcb85',
				'k_bad15': '56b6f47babc1662c011d3b1f93aa51a6e9b5f6512e9f2e16821a238d450a31f8'
			},
			{
				'message': 'i2FLPP8WEus5WPjpoHwheXOMSobUJVaZM1JPMQZq',
				'privkey': 'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140',
				'k_bad00': '6e9b434fcc6bbb081a0463c094356b47d62d7efae7da9c518ed7bac23f4e2ed6',
				'k_bad01': 'ae5323ae338d6117ce8520a43b92eacd2ea1312ae514d53d8e34010154c593bb',
				'k_bad15': '3eaa1b61d1b8ab2f1ca71219c399f2b8b3defa624719f1e96fe3957628c2c4ea'
			},
			{
				'message': 'lEE55EJNP7aLrMtjkeJKKux4Yg0E8E1SAJnWTCEh',
				'privkey': '3881e5286abc580bb6139fe8e83d7c8271c6fe5e5c2d640c1f0ed0e1ee37edc9',
				'k_bad00': '5b606665a16da29cc1c5411d744ab554640479dd8abd3c04ff23bd6b302e7034',
				'k_bad01': 'f8b25263152c042807c992eacd2ac2cc5790d1e9957c394f77ea368e3d9923bd',
				'k_bad15': 'ea624578f7e7964ac1d84adb5b5087dd14f0ee78b49072aa19051cc15dab6f33'
			},
			{
				'message': '2SaVPvhxkAPrayIVKcsoQO5DKA8Uv5X/esZFlf+y',
				'privkey': '7259dff07922de7f9c4c5720d68c9745e230b32508c497dd24cb95ef18856631',
				'k_bad00': '3ab6c19ab5d3aea6aa0c6da37516b1d6e28e3985019b3adb388714e8f536686b',
				'k_bad01': '19af21b05004b0ce9cdca82458a371a9d2cf0dc35a813108c557b551c08eb52e',
				'k_bad15': '117a32665fca1b7137a91c4739ac5719fec0cf2e146f40f8e7c21b45a07ebc6a'
			},
			{
				'message': '00A0OwO2THi7j5Z/jp0FmN6nn7N/DQd6eBnCS+/b',
				'privkey': '0d6ea45d62b334777d6995052965c795a4f8506044b4fd7dc59c15656a28f7aa',
				'k_bad00': '79487de0c8799158294d94c0eb92ee4b567e4dc7ca18addc86e49d31ce1d2db6',
				'k_bad01': '9561d2401164a48a8f600882753b3105ebdd35e2358f4f808c4f549c91490009',
				'k_bad15': 'b0d273634129ff4dbdf0df317d4062a1dbc58818f88878ffdb4ec511c77976c0'
			}
		];

		var result_txt = '\n----------------------\nResults\n----------------------\n\n';

		for (i = 0; i < test_vectors.length; i++) {
			var hash = Crypto.SHA256(test_vectors[i]['message'].split('').map(function (c) { return c.charCodeAt (0); }), { asBytes: true });
			var wif = coinjs.privkey2wif(test_vectors[i]['privkey']);

			var KBigInt = tx.deterministicK(wif, hash);
			var KBigInt0 = tx.deterministicK(wif, hash, 0);
			var KBigInt1 = tx.deterministicK(wif, hash, 1);
			var KBigInt15 = tx.deterministicK(wif, hash, 15);

			var K = Crypto.util.bytesToHex(KBigInt.toByteArrayUnsigned());
			var K0 = Crypto.util.bytesToHex(KBigInt0.toByteArrayUnsigned());
			var K1 = Crypto.util.bytesToHex(KBigInt1.toByteArrayUnsigned());
			var K15 = Crypto.util.bytesToHex(KBigInt15.toByteArrayUnsigned());

			if (K != test_vectors[i]['k_bad00']) {
				result_txt += 'Failed Test #' + (i + 1) + '\n       K = ' + K + '\nExpected = ' + test_vectors[i]['k_bad00'] + '\n\n';
			} else if (K0 != test_vectors[i]['k_bad00']) {
				result_txt += 'Failed Test #' + (i + 1) + '\n      K0 = ' + K0 + '\nExpected = ' + test_vectors[i]['k_bad00'] + '\n\n';
			} else if (K1 != test_vectors[i]['k_bad01']) {
				result_txt += 'Failed Test #' + (i + 1) + '\n      K1 = ' + K1 + '\nExpected = ' + test_vectors[i]['k_bad01'] + '\n\n';
			} else if (K15 != test_vectors[i]['k_bad15']) {
				result_txt += 'Failed Test #' + (i + 1) + '\n     K15 = ' + K15 + '\nExpected = ' + test_vectors[i]['k_bad15'] + '\n\n';
			};
		};

		if (result_txt.length < 60) {
			result_txt = 'All Tests OK!';
		};

		return result_txt;
	};

	/* start of hd functions, thanks bip32.org */
	coinjs.hd = function(data, bip_derive_child = '', bip_address_semantics = ''){

		var r = {};

		/* some hd value parsing */
		r.parse = function() {

			var bytes = [];

			// some quick validation
			if(typeof(data) == 'string'){
				var decoded = coinjs.base58decode(data);
				if(decoded.length == 82){
					var checksum = decoded.slice(78, 82);
					var hash = Crypto.SHA256(Crypto.SHA256(decoded.slice(0, 78), { asBytes: true } ), { asBytes: true } );
					if(checksum[0]==hash[0] && checksum[1]==hash[1] && checksum[2]==hash[2] && checksum[3]==hash[3]){
						bytes = decoded.slice(0, 78);
					}
				}
			}

			// actual parsing code
			if(bytes && bytes.length>0) {
 				r.version = coinjs.uint(bytes.slice(0, 4) , 4);
 				r.depth = coinjs.uint(bytes.slice(4, 5) ,1);
				r.parent_fingerprint = bytes.slice(5, 9);
				r.child_index = coinjs.uint(bytes.slice(9, 13), 4);
 				r.chain_code = bytes.slice(13, 45);
				r.key_bytes = bytes.slice(45, 78);

				var c = coinjs.compressed; // get current default
				coinjs.compressed = true;

				//check bip type, hdkey/bip32, bip49, bip84
				var bip = 'hdkey';	//set default to bip32
				for (var i=0; i< coinjs.biptypes.length;i++){
					//compare if version matches bip-type prv or pub 
						if (coinjs[coinjs.biptypes[i]]?.prv === r.version || coinjs[coinjs.biptypes[i]]?.pub === r.version) {
							bip = coinjs.biptypes[i];
						}
				}
				r.bip = bip;
				//r.bip_derive_protocol = bip;

				if (bip_derive_child !== '')
					r.bip = bip_derive_child;
				
				if (bip_address_semantics !== '')
					r.bip_address_semantics = bip_address_semantics;


				/*
				//for debugging purpose, add debug variable later
				iceeeeeeeeeee
				console.log('coinjs.hd.parse bip: '+ bip);
				console.log('coinjs.hd parse version: '+ r.version);
				console.log('coinjs.hd parse bip: '+ bip);
				console.log('coinjs.hd parse bip_address_semantics: '+ bip_address_semantics);
				*/


				if(r.key_bytes[0] == 0x00) {
					r.type = 'private';
					var privkey = (r.key_bytes).slice(1, 33);
					var privkeyHex = Crypto.util.bytesToHex(privkey);
					var pubkey = coinjs.newPubkey(privkeyHex);

					var address;
					address = r.derive_to_address(pubkey, r.bip, r.bip_address_semantics);
					/*
					if(bip === 'bip49'){
						address = coinjs.segwitAddress(pubkey);
					} else if(bip === 'bip84'){
						address = coinjs.bech32Address(pubkey);
					} else {
						address = coinjs.pubkey2address(pubkey)
					}
					*/

					r.keys = {
						'privkey':privkeyHex,
						'pubkey':pubkey,
						'address':address,
						//'address':coinjs.pubkey2address(pubkey),
						'wif':coinjs.privkey2wif(privkeyHex),
						};

				} else if(r.key_bytes[0] == 0x02 || r.key_bytes[0] == 0x03) {
					r.type = 'public';
					var pubkeyHex = Crypto.util.bytesToHex(r.key_bytes);


					var address;
					address = r.derive_to_address(pubkeyHex, r.bip, r.bip_address_semantics);

					/*
					if(bip === 'bip49'){
						address = coinjs.segwitAddress(pubkeyHex);
					} else if(bip === 'bip84'){
						address = coinjs.bech32Address(pubkeyHex);
					} else {
						address = coinjs.pubkey2address(pubkeyHex)
					}
					*/

					r.keys = {'pubkey': pubkeyHex,
						
						'address':address};
						//'address':coinjs.pubkey2address(pubkeyHex)};
				} else {
					r.type = 'invalid';
				}

				r.keys_extended = r.extend();
				r.bip_master_key = data;

				coinjs.compressed = c; // reset to default
			}

			return r;
		}
		// derive to address
		// @keyHex can be either pub or priv
		r.derive_to_address = function(keyHex, bip = 'hdkey', address_semantics = '') {
			var address;
			//console.log('===r.derive_to_address fn.bip: '+ bip);
			/*//bip = r.bip_derive_protocol;
			console.log('r.derive_to_address bip: '+ bip);
			console.log('r.derive_to_address r.bip: '+ bip);
			console.log('r.derive_to_address r.bip_derive_protocol: '+ r.bip_derive_protocol);
			console.log('r.derive_to_address this.bip_derive_protocol: '+ this.bip_derive_protocol);
			*/
			if(bip === 'bip49'){
					//console.log('r.derive_to_address bip49');
					if (coinjs.bip49?.prv || coinjs.bip49?.pub){
						address = coinjs.segwitAddress(keyHex);
						//console.log('r.derive_to_address bip49 address: ', address);
					}
				} else if(bip === 'bip84'){
					if (coinjs.bip84?.prv || coinjs.bip84?.pub){
						address = coinjs.bech32Address(keyHex);
						//console.log('r.derive_to_address bip84 address: ', address);
					}
				} else {
					if (address_semantics === 'p2wpkh') {
						/*console.log('r.derive_to_address address_semantics electrum : ', address_semantics);
						console.log('r.derive_to_address address_semantics electrum keyHex : ', keyHex);
						*/
						if (coinjs.bip84?.prv || coinjs.bip84?.pub){
							address = coinjs.bech32Address(keyHex);
						}
					}
					else
						address = coinjs.pubkey2address(keyHex)

					/*console.log('r.derive_to_address address_semantics: ', address_semantics);
					console.log('r.derive_to_address address_semantics hdkey address: ', address);
					*/

				}
				return address;
		}

		// extend prv/pub key
		r.extend = function(){
			var hd = coinjs.hd();
			//console.log('r.bip: ', r.bip);
			//console.log('r.extend: ');
			return hd.make({'depth':(this.depth*1)+1,
				'parent_fingerprint':this.parent_fingerprint,
				'child_index':this.child_index,
				'chain_code':this.chain_code,
				'privkey':this.keys.privkey,
				'pubkey':this.keys.pubkey,
				'bip': r.bip,
			});
		}

		// derive from path
		r.derive_path = function(path, bip = 'hdkey', derivation_protocol = 'hdkey', bip_address_semantics = '') {

			r.bip = bip;
			//r.bip_derive_protocol = derivation_protocol;
			

			//console.log('===r.derive_path: r', r);
			//console.log('===r.derive_path: derivation_protocol', derivation_protocol);
			if( path == 'm' || path == 'M' || path == 'm\'' || path == 'M\'' ) return this;

			var p = path.split('/');
			var hdp = coinjs.clone(this);  // clone hd path
			//console.log('==r.derive_path=== before hdp: ', hdp);
			for( var i in p ) {
				//console.log('========r.derive_path i: ' + i);
				if((( i == 0 ) && c != 'm') || i == 'remove'){
					continue;
				}

				var c = p[i];

				var use_private = (c.length > 1) && (c[c.length-1] == '\'');
				var child_index = parseInt(use_private ? c.slice(0, c.length - 1) : c) & 0x7fffffff;
				if(use_private)
					child_index += 0x80000000;

				//hdp.bip_derive_protocol = derivation_protocol;

				//console.log(`==derive_path=== hdp child_index: ${child_index}, bip: ${bip}, derivation_protocol: ${derivation_protocol}, ${bip_address_semantics}`)
				hdp = hdp.derive(child_index, derivation_protocol, bip_address_semantics);
				//if(!hdp)
					//return;
				//console.log('==derive_path=== hdp: ', hdp);
				var key = ((hdp.keys_extended.privkey) && hdp.keys_extended.privkey!='') ? hdp.keys_extended.privkey : hdp.keys_extended.pubkey;
				//console.log('==derive_path=== hdp key: ', key);
				//if (i === 1)
					hdp.bip_master_key = key;
					//this.bip_electrum = key;

				//console.log('==r.derive_path i:'+i+' child_index: ', child_index);
				//console.log('==r.derive_path i:'+i+' hdp1: ', hdp);
				//console.log('==r.derive_path i:'+i+' key: ', key);
				//key.bip_derive_protocol = derivation_protocol;
				//if (key != '')
				hdp = coinjs.hd(key, derivation_protocol, bip_address_semantics);
				//console.log('==derive_path=== hdp coinjs.hd hdp: ', hdp);
				//console.log('==r.derive_path i:'+i+' hdp2: ', hdp);
				//hdp.bip_derive_protocol = derivation_protocol;
				
			}
			return hdp;
		}

		r.derive_electrum_path = function(path, bip = 'hdkey', derivation_protocol = 'hdkey', bip_address_semantics = 'p2wpkh') {
			console.log('==derive_electrum_path===');
			r.bip = bip;
			//r.bip_derive_protocol = derivation_protocol;
			

			//console.log('===r.derive_electrum_path: r', r);
			//console.log('===r.derive_electrum_path: derivation_protocol', derivation_protocol);
			if( path == 'm' || path == 'M' || path == 'm\'' || path == 'M\'' ) return this;

			var p = path.split('/');
			var hdp = coinjs.clone(this);  // clone hd path
			//console.log('==r.derive_electrum_path=== before hdp: ', hdp);
			for( var i in p ) {
				if (i != 1)
					continue;

				//console.log('========r.derive_electrum_path i: ' + i);
				if((( i == 0 ) && c != 'm') || i == 'remove'){
					continue;
				}

				var c = p[i];

				var use_private = (c.length > 1) && (c[c.length-1] == '\'');
				var child_index = parseInt(use_private ? c.slice(0, c.length - 1) : c) & 0x7fffffff;
				if(use_private)
					child_index += 0x80000000;
				
				//hdp.bip_derive_protocol = derivation_protocol;
				hdp = hdp.derive(child_index, derivation_protocol, bip_address_semantics);
				console.log('==derive_electrum_path=== hdp: ', hdp);
				var key = ((hdp.keys_extended.privkey) && hdp.keys_extended.privkey!='') ? hdp.keys_extended.privkey : hdp.keys_extended.pubkey;
				
				return hdp;

				//console.log('==r.derive_electrum_path i:'+i+' child_index: ', child_index);
				//console.log('==r.derive_electrum_path i:'+i+' hdp1: ', hdp);
				//console.log('==r.derive_electrum_path i:'+i+' key: ', key);

				//key.bip_derive_protocol = derivation_protocol;
				//if (key != '')
				//hdp = coinjs.hd(key, derivation_protocol, bip_address_semantics);

				
				//console.log('==r.derive_electrum_path i:'+i+' hdp2: ', hdp);
				//hdp.bip_derive_protocol = derivation_protocol;
				
			}
			return hdp;
		}

		// derive key from index
		r.derive = function(i, derivation_protocol, bip_address_semantics = ''){
			//console.log('===r.derive=== bip_derive_protocol i: ', i, derivation_protocol, bip_address_semantics);

			//if (!this.keys)	//WTF, no object? return!
				//return;

			//console.log('===r.derive=== bip_derive_protocol: ', this.keys);
			//console.log('===r.derive=== bip_derive_protocol this.keys.privkey: ', this.keys.privkey);
			i = (i)?i:0;
			//http://aaronjaramillo.org/bip-44-hierarchical-deterministic-wallets
			//m / 0x8000002C / 0x80000000 / 0x80000000 / 0x00 / 0x01
			/*
			The first three levels of a BIP 44 key structure are derived via hardened derivation 
			which is signaled by setting the highest order bit of the index to 1. 
			Levels with hardened derivation are denoted with the “prime” symbol (x’).

				m / purpose' / coin_type' / account' / change / address_index
				m / 44' / 0' / 0' / 0 / 1

				This key path, with the highest bit set, would be derived from the following indices in hexadecimal.
				m / 0x8000002C / 0x80000000 / 0x80000000 / 0x00 / 0x01

			BIP 44 defines six generations of child keys derived by using an index specific to the keys use case. 
			This allows the user to store the mnemonic of the seed and be able to generate keys based on their purpose.
			*/

			//this works with coinomi ledger, seed: xprv9s21ZrQH143K43m2VZ51HrLrMZuv4D4E7Yv58qw1KVSejmRUUmm1PRgLS19GPXVdbMz6Ge9qZN75CaLMkTSCCPLaDMTV9kiZYgrvXSkfrZ8

			if (derivation_protocol === 'bip44') {
				//console.log('===r.derive=== bip_derive_protocol bip44 ');
				//console.log('===r.derive=== bip_derive_protocol i: ', i);
				if (i == 0x00) {
					//console.log('===r.derive=== bip_derive_protocol 0x00 i: ', i);
					var blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i,4).reverse());
				} else if (i <= 0x01) {
					//console.log('===r.derive=== bip_derive_protocol 0x01 i: ', i);
					var blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i,4).reverse());
				} else if (i < 0x80000000) {
					//console.log('===r.derive=== bip_derive_protocol 0x80000000 i: ', i);
					var blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i,4).reverse());
					//var blob = (Crypto.util.hexToBytes("00").concat(Crypto.util.hexToBytes(this.keys.privkey)).concat(coinjs.numToBytes(i,4).reverse()));
				} else if (i <= 0x8000002c) {
					//console.log('===r.derive=== bip_derive_protocol 0x8000002c i: ', i);
					//var blob = (Crypto.util.hexToBytes("00").concat(Crypto.util.hexToBytes(this.keys.privkey)).concat(coinjs.numToBytes(i,4).reverse()));
					var blob = (Crypto.util.hexToBytes("00").concat(Crypto.util.hexToBytes(this.keys.privkey)).concat(coinjs.numToBytes(i,4).reverse()));
				} else {
					//console.log('===r.derive=== bip_derive_protocol else i: ', i);
					//var blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i,4).reverse());
					var blob = (Crypto.util.hexToBytes("00").concat(Crypto.util.hexToBytes(this.keys.privkey)).concat(coinjs.numToBytes(i,4).reverse()));
					//var blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i,4).reverse());
				}

			} else {
				/*console.log('===r.derive=== bip_derive_protocol ELSE: ', i);
				if (i == 0x00) {
					console.log('===r.derive=== bip_derive_protocol ELSE 0x00 i: ', i);
					var blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i,4).reverse());
				} else if (i <= 0x01) {
					console.log('===r.derive=== bip_derive_protocol ELSE 0x01 i: ', i);
					var blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i,4).reverse());
				} else if (i >= 0x80000000) {
					console.log('===r.derive=== bip_derive_protocol ELSE 0x80000000 i: ', i);
					var blob = (Crypto.util.hexToBytes("00").concat(Crypto.util.hexToBytes(this.keys.privkey)).concat(coinjs.numToBytes(i,4).reverse()));
				} else {
					console.log('===r.derive=== bip_derive_protocol ELSE ELSE i: ', i);
					//var blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i,4).reverse());
					var blob = (Crypto.util.hexToBytes("00").concat(Crypto.util.hexToBytes(this.keys.privkey)).concat(coinjs.numToBytes(i,4).reverse()));

				}
				*/

				if (i >= 0x80000000) {
					var blob = (Crypto.util.hexToBytes("00").concat(Crypto.util.hexToBytes(this.keys.privkey)).concat(coinjs.numToBytes(i,4).reverse()));
				} else {
					var blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i,4).reverse());
				}

				/*
				if (i >= 0x80000000) {
					var blob = (Crypto.util.hexToBytes("00").concat(Crypto.util.hexToBytes(this.keys.privkey)).concat(coinjs.numToBytes(i,4).reverse()));
				} else {
					var blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i,4).reverse());
				}
				*/
				//var blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i,4).reverse());
			}
			

			var j = new jsSHA(Crypto.util.bytesToHex(blob), 'HEX');
 			var hash = j.getHMAC(Crypto.util.bytesToHex(r.chain_code), "HEX", "SHA-512", "HEX");

			var il = new BigInteger(hash.slice(0, 64), 16);
			var ir = Crypto.util.hexToBytes(hash.slice(64,128));

			var ecparams = EllipticCurve.getSECCurveByName("secp256k1");
			var curve = ecparams.getCurve();

			var k, key, pubkey, o;

			o = coinjs.clone(this);
			o.chain_code = ir;
			o.child_index = i;

			var address;

			if(this.type=='private'){
				// derive key pair from from a xprv key
				k = il.add(new BigInteger([0].concat(Crypto.util.hexToBytes(this.keys.privkey)))).mod(ecparams.getN());
				key = Crypto.util.bytesToHex(k.toByteArrayUnsigned());

				key = (key.toString()).padStart(64, '0');

				pubkey = coinjs.newPubkey(key);

				//address = r.derive_to_address(key, derivation_protocol, bip_address_semantics);
				//ice check if this is necessary later
				//coinjs.privkey2wif('0x8dbe5faa0e6c1404a2ad6c5f8fa6f0c6b82ce567e17c99b3506a0fabbe04da')
				//8dbe5faa0e6c1404a2ad6c5f8fa6f0c6b82ce567e17c99b3506a0fabbe04da01
				//8dbe5faa0e6c1404a2ad6c5f8fa6f0c6b82ce567e17c99b3506a0fabbe04da

				o.keys = {'privkey':key,
					'pubkey':pubkey,
					'wif': coinjs.privkey2wif(key),	//fix since "8dbe5faa0e6c1404a2ad6c5f8fa6f0c6b82ce567e17c99b3506a0fabbe04da" gives wifkey: 5JtiETBX35EUBRkjESwQWxMjeafrhopn6AzyzSo4NtdE5bcP35X, when it should generate "KwEncJtsqdtGDA7hEtmoQi1xU3hLo4P1Xv6cpucsAPUsdHSmDb5i"
					//'address':address};
					'address':coinjs.pubkey2address(pubkey)};

			} else if (this.type=='public'){
				// derive xpub key from an xpub key
				q = ecparams.curve.decodePointHex(this.keys.pubkey);
				var curvePt = ecparams.getG().multiply(il).add(q);

				var x = curvePt.getX().toBigInteger();
				var y = curvePt.getY().toBigInteger();

				var publicKeyBytesCompressed = EllipticCurve.integerToBytes(x,32)
				if (y.isEven()){
					publicKeyBytesCompressed.unshift(0x02)
				} else {
					publicKeyBytesCompressed.unshift(0x03)
				}
				//pubkey = Crypto.util.bytesToHex(publicKeyBytesCompressed);

				address = r.derive_to_address(pubkey, derivation_protocol, bip_address_semantics);
				//ice check if this is necessary later


				o.keys = {'pubkey':pubkey,
					//'address':address};
					'address':coinjs.pubkey2address(pubkey)};
			} else {
				// fail
			}
			//console.log('===r.derive=== bip_derive_protocol ELSE ELSE address: ', address, pubkey, o.keys);
			//console.log('===r.derive=== bip_derive_protocol ELSE ELSE key: ', key);
			//console.log('===r.derive=== bip_derive_protocol ELSE ELSE coinjs.privkey2wif(key): ', coinjs.privkey2wif(key));

			o.parent_fingerprint = (ripemd160(Crypto.SHA256(Crypto.util.hexToBytes(r.keys.pubkey),{asBytes:true}),{asBytes:true})).slice(0,4);
			o.keys_extended = o.extend();
			return o;
		}

		// make a master hd xprv/xpub
		r.master = function(pass) {
			var seed = (pass) ? Crypto.SHA256(pass) : coinjs.newPrivkey();
			var hasher = new jsSHA(seed, 'HEX');
			var I = hasher.getHMAC("Bitcoin seed", "TEXT", "SHA-512", "HEX");

			var privkey = Crypto.util.hexToBytes(I.slice(0, 64));
			var chain = Crypto.util.hexToBytes(I.slice(64, 128));

			var hd = coinjs.hd();
			return hd.make({'depth':0,
				'parent_fingerprint':[0,0,0,0],
				'child_index':0,
				'chain_code':chain,
				'privkey':I.slice(0, 64),
				'pubkey':coinjs.newPubkey(I.slice(0, 64))});
		}

		// make a master hd xprv/xpub
		r.masterMnemonic = function(seed, pass, bip = 'hdkey') {
			
			var seed = seed.normalize('NFKD');
			var pass = (pass !== null) ? pass.normalize('NFKD') : pass;

			var seeder = bip39.mnemonicToSeed(seed, pass);

			var hasher = new jsSHA(seeder, 'HEX');
			var I = hasher.getHMAC("Bitcoin seed", "TEXT", "SHA-512", "HEX");

			//console.log('seeder: ', seeder);
			//console.log('hasher: ', hasher);
			//console.log('I: ', I);

			var isl64 = I.slice(0, 64);
			var privkey = Crypto.util.hexToBytes(isl64);
			var chain = Crypto.util.hexToBytes(I.slice(64, 128));

			var hd = coinjs.hd();
			return hd.make({'depth':0,
				'parent_fingerprint':[0,0,0,0],
				'child_index':0,
				'chain_code':chain,
				'privkey':isl64,
				'pubkey':coinjs.newPubkey(isl64),
				'bip': bip,
			});
		}


		// encode data to a base58 string
		r.make = function(data){ // { (int) depth, (array) parent_fingerprint, (int) child_index, (byte array) chain_code, (hex str) privkey, (hex str) pubkey}
			var k = [];

			//depth
			k.push(data.depth*1);

			//parent fingerprint
			k = k.concat(data.parent_fingerprint);

			//child index
			k = k.concat((coinjs.numToBytes(data.child_index, 4)).reverse());

			//Chain code
			k = k.concat(data.chain_code);

			var o = {}; // results

			//set bip to hdkey as default
			if (data.bip === undefined)
					data.bip = 'hdkey';

			//encode xprv key
			if(data.privkey){
				var prv = (coinjs.numToBytes(coinjs[data.bip].prv, 4)).reverse();
				prv = prv.concat(k);
				prv.push(0x00);
				prv = prv.concat(Crypto.util.hexToBytes(data.privkey));
				var hash = Crypto.SHA256( Crypto.SHA256(prv, { asBytes: true } ), { asBytes: true } );
				var checksum = hash.slice(0, 4);
				var ret = prv.concat(checksum);
				o.privkey = coinjs.base58encode(ret);
			}

			//encode xpub key
			if(data.pubkey){
				var pub = (coinjs.numToBytes(coinjs[data.bip].pub, 4)).reverse();
				pub = pub.concat(k);
				pub = pub.concat(Crypto.util.hexToBytes(data.pubkey));
				var hash = Crypto.SHA256( Crypto.SHA256(pub, { asBytes: true } ), { asBytes: true } );
				var checksum = hash.slice(0, 4);
				var ret = pub.concat(checksum);
				o.pubkey = coinjs.base58encode(ret);
			}
			return o;
		}

		return r.parse();
	}


	/* start of script functions */
	coinjs.script = function(data) {
		var r = {};

		if(!data){
			r.buffer = [];
		} else if ("string" == typeof data) {
			r.buffer = Crypto.util.hexToBytes(data);
		} else if (coinjs.isArray(data)) {
			r.buffer = data;
		} else if (data instanceof coinjs.script) {
			r.buffer = data.buffer;
		} else {
			r.buffer = data;
		}

		/* parse buffer array */
		r.parse = function () {

			var self = this;
			r.chunks = [];
			var i = 0;

			function readChunk(n) {
				self.chunks.push(self.buffer.slice(i, i + n));
				i += n;
			};

			while (i < this.buffer.length) {
				var opcode = this.buffer[i++];
				if (opcode >= 0xF0) {
 					opcode = (opcode << 8) | this.buffer[i++];
				}

				var len;
				if (opcode > 0 && opcode < 76) { //OP_PUSHDATA1
					readChunk(opcode);
				} else if (opcode == 76) { //OP_PUSHDATA1
					len = this.buffer[i++];
					readChunk(len);
				} else if (opcode == 77) { //OP_PUSHDATA2
 					len = (this.buffer[i++] << 8) | this.buffer[i++];
					readChunk(len);
				} else if (opcode == 78) { //OP_PUSHDATA4
					len = (this.buffer[i++] << 24) | (this.buffer[i++] << 16) | (this.buffer[i++] << 8) | this.buffer[i++];
					readChunk(len);
				} else {
					this.chunks.push(opcode);
				}

				if(i<0x00){
					break;
				}
			}

			return true;
		};

		/* decode the redeemscript of a multisignature transaction */
		r.decodeRedeemScript = function(script){
			var r = false;
			try {
				var s = coinjs.script(Crypto.util.hexToBytes(script));
				if((s.chunks.length>=3) && s.chunks[s.chunks.length-1] == 174){//OP_CHECKMULTISIG
					r = {};
					r.signaturesRequired = s.chunks[0]-80;
					var pubkeys = [];
					for(var i=1;i<s.chunks.length-2;i++){
						pubkeys.push(Crypto.util.bytesToHex(s.chunks[i]));
					}
					r.pubkeys = pubkeys;
					var multi = coinjs.pubkeys2MultisigAddress(pubkeys, r.signaturesRequired);
					r.address = multi['address'];
					r.type = 'multisig__'; // using __ for now to differentiat from the other object .type == "multisig"
					var rs = Crypto.util.bytesToHex(s.buffer);
					r.redeemscript = rs;

				} else if((s.chunks.length==2) && (s.buffer[0] == 0 && s.buffer[1] == 20)){ // SEGWIT
					r = {};
					r.type = "segwit__";
					var rs = Crypto.util.bytesToHex(s.buffer);
					r.address = coinjs.pubkey2address(rs, coinjs.multisig);
					r.redeemscript = rs;

				} else if(s.chunks.length == 5 && s.chunks[1] == 177 && s.chunks[2] == 117 && s.chunks[4] == 172){
					// ^ <unlocktime> OP_CHECKLOCKTIMEVERIFY OP_DROP <pubkey> OP_CHECKSIG ^
					r = {}
					r.pubkey = Crypto.util.bytesToHex(s.chunks[3]);
					r.checklocktimeverify = coinjs.bytesToNum(s.chunks[0].slice());
					r.address = coinjs.simpleHodlAddress(r.pubkey, r.checklocktimeverify).address;
					var rs = Crypto.util.bytesToHex(s.buffer);
					r.redeemscript = rs;
					r.type = "hodl__";
				}
			} catch(e) {
				// console.log(e);
				r = false;
			}
			return r;
		}

		/* create output script to spend */
		r.spendToScript = function(address){
			var addr = coinjs.addressDecode(address);
			var s = coinjs.script();
			if(addr.type == "bech32"){
				s.writeOp(0);
				s.writeBytes(Crypto.util.hexToBytes(addr.redeemscript));
			} else if(addr.version==coinjs.multisig){ // multisig address
				s.writeOp(169); //OP_HASH160
				s.writeBytes(addr.bytes);
				s.writeOp(135); //OP_EQUAL
			} else { // regular address
				s.writeOp(118); //OP_DUP
				s.writeOp(169); //OP_HASH160
				s.writeBytes(addr.bytes);
				s.writeOp(136); //OP_EQUALVERIFY
				s.writeOp(172); //OP_CHECKSIG
			}
			return s;
		}

		/* geneate a (script) pubkey hash of the address - used for when signing */
		r.pubkeyHash = function(address) {
			var addr = coinjs.addressDecode(address);
			var s = coinjs.script();
			s.writeOp(118);//OP_DUP
			s.writeOp(169);//OP_HASH160
			s.writeBytes(addr.bytes);
			s.writeOp(136);//OP_EQUALVERIFY
			s.writeOp(172);//OP_CHECKSIG
			return s;
		}

		/* write to buffer */
		r.writeOp = function(op){
			this.buffer.push(op);
			this.chunks.push(op);
			return true;
		}

		/* write bytes to buffer */
		r.writeBytes = function(data){
			if (data.length < 76) {	//OP_PUSHDATA1
				this.buffer.push(data.length);
			} else if (data.length <= 0xff) {
				this.buffer.push(76); //OP_PUSHDATA1
				this.buffer.push(data.length);
			} else if (data.length <= 0xffff) {
				this.buffer.push(77); //OP_PUSHDATA2
				this.buffer.push(data.length & 0xff);
				this.buffer.push((data.length >>> 8) & 0xff);
			} else {
				this.buffer.push(78); //OP_PUSHDATA4
				this.buffer.push(data.length & 0xff);
				this.buffer.push((data.length >>> 8) & 0xff);
				this.buffer.push((data.length >>> 16) & 0xff);
				this.buffer.push((data.length >>> 24) & 0xff);
			}
			this.buffer = this.buffer.concat(data);
			this.chunks.push(data);
			return true;
		}

		r.parse();
		return r;
	}

	/* start of transaction functions */

	/* create a new transaction object */
	coinjs.transaction = function() {

		var r = {};
		//r.version = 1;
		r.version = (coinjs.asset.version !== undefined ? coinjs.asset.version : 1);
		r.lock_time = 0;
		r.ins = [];
		r.outs = [];
		r.witness = false;
		r.timestamp = null;
		r.block = null;

		r.rawTxSerialized = '';

		//PoS coins
		if (coinjs.txExtraTimeField) {
			//r.nTime = (Date.now() / 1000)*1;
			r.nTime = $("#nTime").val()*1;
			console.log('extra time field added');
		}
		if (coinjs.txExtraUnitField) {
			r.nUnit = 0;
			//r.nUnit = $("#nUnit").val()*1;
			//coinjs.txExtraUnitFieldValue = $("#nUnit").val()*1;
			console.log('extra unit field added');
		}

		/* add an input to a transaction */
		r.addinput = function(txid, index, script, sequence){
			var o = {};
			o.outpoint = {'hash':txid, 'index':index};
			o.script = coinjs.script(script||[]);
			o.sequence = sequence || ((r.lock_time==0) ? 4294967295 : 0);
			return this.ins.push(o);
		}

		/* add an output to a transaction */
		r.addoutput = function(address, value){
			var o = {};
			o.value = new BigInteger('' + Math.round((value*1) * ("1e"+coinjs.decimalPlaces)), 10);
			var s = coinjs.script();
			o.script = s.spendToScript(address);

			return this.outs.push(o);
		}

		/* add two outputs for stealth addresses to a transaction */
		r.addstealth = function(stealth, value){
			var ephemeralKeyBigInt = BigInteger.fromByteArrayUnsigned(Crypto.util.hexToBytes(coinjs.newPrivkey()));
			var curve = EllipticCurve.getSECCurveByName("secp256k1");
			
			var p = EllipticCurve.fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
			var a = BigInteger.ZERO;
			var b = EllipticCurve.fromHex("7");
			var calccurve = new EllipticCurve.CurveFp(p, a, b);
			
			var ephemeralPt = curve.getG().multiply(ephemeralKeyBigInt);
			var scanPt = calccurve.decodePointHex(stealth.scankey);
			var sharedPt = scanPt.multiply(ephemeralKeyBigInt);
			var stealthindexKeyBigInt = BigInteger.fromByteArrayUnsigned(Crypto.SHA256(sharedPt.getEncoded(true), {asBytes: true}));
			
			var stealthindexPt = curve.getG().multiply(stealthindexKeyBigInt);
			var spendPt = calccurve.decodePointHex(stealth.spendkey);
			var addressPt = spendPt.add(stealthindexPt);
			
			var sendaddress = coinjs.pubkey2address(Crypto.util.bytesToHex(addressPt.getEncoded(true)));
			
			
			var OPRETBytes = [6].concat(Crypto.util.randomBytes(4)).concat(ephemeralPt.getEncoded(true)); // ephemkey data
			var q = coinjs.script();
			q.writeOp(106); // OP_RETURN
			q.writeBytes(OPRETBytes);
			v = {};
			v.value = 0;
			v.script = q;
			
			this.outs.push(v);
			
			var o = {};
			o.value = new BigInteger('' + Math.round((value*1) * ("1e"+coinjs.decimalPlaces)), 10);
			var s = coinjs.script();
			o.script = s.spendToScript(sendaddress);
			
			return this.outs.push(o);
		}

		/* add data to a transaction */
		r.adddata = function(data){
			var r = false;
			if(((data.match(/^[a-f0-9]+$/gi)) && data.length<160) && (data.length%2)==0) {
				var s = coinjs.script();
				s.writeOp(106); // OP_RETURN
				s.writeBytes(Crypto.util.hexToBytes(data));
				o = {};
				o.value = 0;
				o.script = s;
				return this.outs.push(o);
			}
			return r;
		}

		/* list unspent transactions */
		r.listUnspent = function(address, callback) {
			coinjs.ajax(coinjs.host+'?uid='+coinjs.uid+'&key='+coinjs.key+'&setmodule=addresses&request=unspent&address='+address+'&r='+Math.random(), callback, "GET");
		}

		/* list transaction data */
		r.getTransaction = function(txid, callback) {
			coinjs.ajax(coinjs.host+'?uid='+coinjs.uid+'&key='+coinjs.key+'&setmodule=bitcoin&request=gettransaction&txid='+txid+'&r='+Math.random(), callback, "GET");
		}

		/* add unspent to transaction */
		r.addUnspent = function(address, callback, script, segwit, sequence){
			var self = this;
			this.listUnspent(address, function(data){
				var s = coinjs.script();
				var value = 0;
				var total = 0;
				var x = {};

				if (window.DOMParser) {
					parser=new DOMParser();
					xmlDoc=parser.parseFromString(data,"text/xml");
				} else {
					xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
					xmlDoc.async=false;
					xmlDoc.loadXML(data);
				}

				var unspent = xmlDoc.getElementsByTagName("unspent")[0];

				if(unspent){ 
					for(i=1;i<=unspent.childElementCount;i++){
						var u = xmlDoc.getElementsByTagName("unspent_"+i)[0]
						var txhash = (u.getElementsByTagName("tx_hash")[0].childNodes[0].nodeValue).match(/.{1,2}/g).reverse().join("")+'';
						var n = u.getElementsByTagName("tx_output_n")[0].childNodes[0].nodeValue;
						var scr = script || u.getElementsByTagName("script")[0].childNodes[0].nodeValue;

						if(segwit){
							/* this is a small hack to include the value with the redeemscript to make the signing procedure smoother. 
							It is not standard and removed during the signing procedure. */

							s = coinjs.script();
							s.writeBytes(Crypto.util.hexToBytes(script));
							s.writeOp(0);
							s.writeBytes(coinjs.numToBytes(u.getElementsByTagName("value")[0].childNodes[0].nodeValue*1, 8));
							scr = Crypto.util.bytesToHex(s.buffer);
						}

						var seq = sequence || false;
						self.addinput(txhash, n, scr, seq);
						value += u.getElementsByTagName("value")[0].childNodes[0].nodeValue*1;
						total++;
					}
				}

				x.result = xmlDoc.getElementsByTagName("result")[0].childNodes[0].nodeValue;
				x.unspent = unspent;
				x.value = value;
				x.total = total;
				x.response = xmlDoc.getElementsByTagName("response")[0].childNodes[0].nodeValue;

				return callback(x);
			});
		}

		/* add unspent and sign */
		r.addUnspentAndSign = function(wif, callback){
			var self = this;
			var address = coinjs.wif2address(wif);
			self.addUnspent(address['address'], function(data){
				self.sign(wif);
				return callback(data);
			});
		}

		/* broadcast a transaction */
		r.broadcast = function(callback, txhex){
			var tx = txhex || this.serialize();
			coinjs.ajax(coinjs.host+'?uid='+coinjs.uid+'&key='+coinjs.key+'&setmodule=bitcoin&request=sendrawtransaction', callback, "POST", ["rawtx="+tx]);
		}

		/* generate the transaction hash to sign from a transaction input */
		r.transactionHash = function(index, sigHashType) {

			var clone = coinjs.clone(this);
			var shType = sigHashType || 1;

			/* black out all other ins, except this one */
			for (var i = 0; i < clone.ins.length; i++) {
				if(index!=i){
					clone.ins[i].script = coinjs.script();
				}
			}

			var extract = this.extractScriptKey(index);
			clone.ins[index].script = coinjs.script(extract['script']);


			if((clone.ins) && clone.ins[index]){

				/* SIGHASH : For more info on sig hashs see https://en.bitcoin.it/wiki/OP_CHECKSIG
					and https://bitcoin.org/en/developer-guide#signature-hash-type */

				if(shType == 1){
					//SIGHASH_ALL 0x01

				} else if(shType == 2){
					//SIGHASH_NONE 0x02
					clone.outs = [];
					for (var i = 0; i < clone.ins.length; i++) {
						if(index!=i){
							clone.ins[i].sequence = 0;
						}
					}

				} else if(shType == 3){

					//SIGHASH_SINGLE 0x03
					clone.outs.length = index + 1;

					for(var i = 0; i < index; i++){
						clone.outs[i].value = -1;
						clone.outs[i].script.buffer = [];
					}

					for (var i = 0; i < clone.ins.length; i++) {
						if(index!=i){
							clone.ins[i].sequence = 0;
						}
					}

				} else if (shType >= 128){
					//SIGHASH_ANYONECANPAY 0x80
					clone.ins = [clone.ins[index]];

					if(shType==129){
						// SIGHASH_ALL + SIGHASH_ANYONECANPAY

					} else if(shType==130){
						// SIGHASH_NONE + SIGHASH_ANYONECANPAY
						clone.outs = [];

					} else if(shType==131){
                                                // SIGHASH_SINGLE + SIGHASH_ANYONECANPAY
						clone.outs.length = index + 1;
						for(var i = 0; i < index; i++){
							clone.outs[i].value = -1;
							clone.outs[i].script.buffer = [];
						}
					}
				}

				var buffer = Crypto.util.hexToBytes(clone.serialize());
				buffer = buffer.concat(coinjs.numToBytes(parseInt(shType), 4));
				var hash = Crypto.SHA256(buffer, {asBytes: true});
				var r = Crypto.util.bytesToHex(Crypto.SHA256(hash, {asBytes: true}));
				console.log('generated TXID: ', r);

				this.rawTxSerialized = clone.serialize();	//added for REDD-family, iceee
				console.log('_cloneTx '+index+': ', this.rawTxSerialized);



				return r;
			} else {
				return false;
			}
		}

		/* generate a segwit transaction hash to sign from a transaction input */
		r.transactionHashSegWitV0 = function(index, sigHashType){
			/* 
			   Notice: coinb.in by default, deals with segwit transactions in a non-standard way.
			   Segwit transactions require that input values are included in the transaction hash.
			   To save wasting resources and potentially slowing down this service, we include the amount with the 
			   redeem script to generate the transaction hash and remove it after its signed.
			*/

			// start redeem script check
			var extract = this.extractScriptKey(index);
			if(extract['type'] != 'segwit'){
				return {'result':0, 'fail':'redeemscript', 'response':'redeemscript missing or not valid for segwit'};
			}

			if(extract['value'] == -1){
				return {'result':0, 'fail':'value', 'response':'unable to generate a valid segwit hash without a value'};				
			}

			var scriptcode = Crypto.util.hexToBytes(extract['script']);

			// end of redeem script check

			/* P2WPKH */
			if(scriptcode.length == 20){
				scriptcode = [0x00,0x14].concat(scriptcode);
			}

			if(scriptcode.length == 22){
				scriptcode = scriptcode.slice(1);
				scriptcode.unshift(25, 118, 169);
				scriptcode.push(136, 172);
			}

			var value = coinjs.numToBytes(extract['value'], 8);

			// start

			var zero = coinjs.numToBytes(0, 32);
			var version = coinjs.numToBytes(parseInt(this.version), 4);

			var bufferTmp = [];
			if(!(sigHashType >= 80)){	// not sighash anyonecanpay 
				for(var i = 0; i < this.ins.length; i++){
					bufferTmp = bufferTmp.concat(Crypto.util.hexToBytes(this.ins[i].outpoint.hash).reverse());
					bufferTmp = bufferTmp.concat(coinjs.numToBytes(this.ins[i].outpoint.index, 4));
				}
			}
			var hashPrevouts = bufferTmp.length >= 1 ? Crypto.SHA256(Crypto.SHA256(bufferTmp, {asBytes: true}), {asBytes: true}) : zero; 

			var bufferTmp = [];
			if(!(sigHashType >= 80) && sigHashType != 2 && sigHashType != 3){ // not sighash anyonecanpay & single & none
				for(var i = 0; i < this.ins.length; i++){
					bufferTmp = bufferTmp.concat(coinjs.numToBytes(this.ins[i].sequence, 4));
				}
			}
			var hashSequence = bufferTmp.length >= 1 ? Crypto.SHA256(Crypto.SHA256(bufferTmp, {asBytes: true}), {asBytes: true}) : zero; 

			var outpoint = Crypto.util.hexToBytes(this.ins[index].outpoint.hash).reverse();
			outpoint = outpoint.concat(coinjs.numToBytes(this.ins[index].outpoint.index, 4));

			var nsequence = coinjs.numToBytes(this.ins[index].sequence, 4);
			var hashOutputs = zero;
			var bufferTmp = [];
			if(sigHashType != 2 && sigHashType != 3){		// not sighash single & none
				for(var i = 0; i < this.outs.length; i++ ){
					bufferTmp = bufferTmp.concat(coinjs.numToBytes(this.outs[i].value, 8));
					bufferTmp = bufferTmp.concat(coinjs.numToVarInt(this.outs[i].script.buffer.length));
					bufferTmp = bufferTmp.concat(this.outs[i].script.buffer);
				}
				hashOutputs = Crypto.SHA256(Crypto.SHA256(bufferTmp, {asBytes: true}), {asBytes: true});

			} else if ((sigHashType == 2) && index < this.outs.length){ // is sighash single
				bufferTmp = bufferTmp.concat(coinjs.numToBytes(this.outs[index].value, 8));
				bufferTmp = bufferTmp.concat(coinjs.numToVarInt(this.outs[i].script.buffer.length));
				bufferTmp = bufferTmp.concat(this.outs[index].script.buffer);
				hashOutputs = Crypto.SHA256(Crypto.SHA256(bufferTmp, {asBytes: true}), {asBytes: true});
			}

			var locktime = coinjs.numToBytes(this.lock_time, 4);
			var sighash = coinjs.numToBytes(sigHashType, 4);

			var buffer = []; 
			buffer = buffer.concat(version);
			buffer = buffer.concat(hashPrevouts);
			buffer = buffer.concat(hashSequence);
			buffer = buffer.concat(outpoint);
			buffer = buffer.concat(scriptcode);
			buffer = buffer.concat(value);
			buffer = buffer.concat(nsequence);
			buffer = buffer.concat(hashOutputs);
			buffer = buffer.concat(locktime);
			buffer = buffer.concat(sighash);

			var hash = Crypto.SHA256(buffer, {asBytes: true});
			return {'result':1,'hash':Crypto.util.bytesToHex(Crypto.SHA256(hash, {asBytes: true})), 'response':'hash generated'};
		}

		/* extract the scriptSig, used in the transactionHash() function */
		r.extractScriptKey = function(index) {
			if(this.ins[index]){
				if((this.ins[index].script.chunks.length==5) && this.ins[index].script.chunks[4]==172 && coinjs.isArray(this.ins[index].script.chunks[2])){ //OP_CHECKSIG
					// regular scriptPubkey (not signed)
					return {'type':'scriptpubkey', 'signed':'false', 'signatures':0, 'script': Crypto.util.bytesToHex(this.ins[index].script.buffer)};
				} else if((this.ins[index].script.chunks.length==2) && this.ins[index].script.chunks[0][0]==48 && this.ins[index].script.chunks[1].length == 5 && this.ins[index].script.chunks[1][1]==177){//OP_CHECKLOCKTIMEVERIFY
					// hodl script (signed)
					return {'type':'hodl', 'signed':'true', 'signatures':1, 'script': Crypto.util.bytesToHex(this.ins[index].script.buffer)};
				} else if((this.ins[index].script.chunks.length==2) && this.ins[index].script.chunks[0][0]==48){ 
					// regular scriptPubkey (probably signed)
					return {'type':'scriptpubkey', 'signed':'true', 'signatures':1, 'script': Crypto.util.bytesToHex(this.ins[index].script.buffer)};
				} else if(this.ins[index].script.chunks.length == 5 && this.ins[index].script.chunks[1] == 177){//OP_CHECKLOCKTIMEVERIFY
					// hodl script (not signed)
					return {'type':'hodl', 'signed':'false', 'signatures': 0, 'script': Crypto.util.bytesToHex(this.ins[index].script.buffer)};
				} else if((this.ins[index].script.chunks.length <= 3 && this.ins[index].script.chunks.length > 0) && ((this.ins[index].script.chunks[0].length == 22 && this.ins[index].script.chunks[0][0] == 0) || (this.ins[index].script.chunks[0].length == 20 && this.ins[index].script.chunks[1] == 0))){
					var signed = ((this.witness[index]) && this.witness[index].length==2) ? 'true' : 'false';
					var sigs = (signed == 'true') ? 1 : 0;
					var value = -1; // no value found
					if((this.ins[index].script.chunks[2]) && this.ins[index].script.chunks[2].length==8){
						value = coinjs.bytesToNum(this.ins[index].script.chunks[2]);  // value found encoded in transaction (THIS IS NON STANDARD)
					}
					return {'type':'segwit', 'signed':signed, 'signatures': sigs, 'script': Crypto.util.bytesToHex(this.ins[index].script.chunks[0]), 'value': value};
				} else if (this.ins[index].script.chunks[0]==0 && this.ins[index].script.chunks[this.ins[index].script.chunks.length-1][this.ins[index].script.chunks[this.ins[index].script.chunks.length-1].length-1]==174) { // OP_CHECKMULTISIG
					// multisig script, with signature(s) included
					sigcount = 0;
					for(i=1; i<this.ins[index].script.chunks.length-1;i++){
						if(this.ins[index].script.chunks[i]!=0){
							sigcount++;
						}
					}

					return {'type':'multisig', 'signed':'true', 'signatures':sigcount, 'script': Crypto.util.bytesToHex(this.ins[index].script.chunks[this.ins[index].script.chunks.length-1])};
				} else if (this.ins[index].script.chunks[0]>=80 && this.ins[index].script.chunks[this.ins[index].script.chunks.length-1]==174) { // OP_CHECKMULTISIG
					// multisig script, without signature!
					return {'type':'multisig', 'signed':'false', 'signatures':0, 'script': Crypto.util.bytesToHex(this.ins[index].script.buffer)};
				} else if (this.ins[index].script.chunks.length==0) {
					// empty
					return {'type':'empty', 'signed':'false', 'signatures':0, 'script': ''};
				} else {
					// something else
					return {'type':'unknown', 'signed':'false', 'signatures':0, 'script':Crypto.util.bytesToHex(this.ins[index].script.buffer)};
				}
			} else {
				return false;
			}
		}

		/* generate a signature from a transaction hash */
		r.transactionSig = function(index, wif, sigHashType, txhash){

			console.log('===r.transactionSig===');
			function serializeSig(r, s) {
				var rBa = r.toByteArraySigned();
				var sBa = s.toByteArraySigned();

				var sequence = [];
				sequence.push(0x02); // INTEGER
				sequence.push(rBa.length);
				sequence = sequence.concat(rBa);

				sequence.push(0x02); // INTEGER
				sequence.push(sBa.length);
				sequence = sequence.concat(sBa);

				sequence.unshift(sequence.length);
				sequence.unshift(0x30); // SEQUENCE

				return sequence;
			}
/*
			function REDDFamilySign(txhash) {
				var timestamp = txHash.slice(-8);	//get the timestamp
				
				for every (index)
					txhash = txhash.slice(0, -8) + '01000000';	//for#strip the posv timestamp and add the hashcode (needs to be done before signing)

				1. deserialise the rawtx
				2. remove ALL script 	(newtx["ins"][i]["script"] = '') from INPUTS except for the currenct index input
				3. serialize the rawtx
				4. sign with low level s signature


			}
*/
			var shType = sigHashType || 1;
			/*Add SIGHASH_FORKID by default for Bitcoin Cash 
			if (coinjs.shf == 0x40) {
	       
	      shType = shType | 0x40;
	    }
	    */

			//var hash = txhash || Crypto.util.hexToBytes(this.transactionHash(index, shType, rawTx));
			var hash = txhash || this.transactionHash(index, shType);

			


				//RDD & POT requires special transaction txinputs
				if (coinjs.asset?.chainFamily === 'rdd') {
					if (coinjs.txExtraTimeField) {
						//hash = Crypto.SHA256(Crypto.SHA256())
						//console.log('1: ', Crypto.SHA256(Crypto.SHA256(hash, {asBytes: true}), {asBytes: true}) );
						//console.log('2: ', Crypto.util.bytesToHex(Crypto.SHA256(Crypto.SHA256(hash, {asBytes: true}), {asBytes: true}) ));
						//console.log('3: ', Crypto.util.bytesToHex(Crypto.SHA256(Crypto.SHA256(hash, {asBytes: false}), {asBytes: true}) ));
						//console.log('4: ', (Crypto.SHA256(Crypto.SHA256(hash, {asBytes: false}), {asBytes: false}) ));
						//hash = Crypto.SHA256(Crypto.SHA256(hash));

						//var scriptPOSv_timestamp = this.rawTxSerialized.slice(-8);	//get the timestamp
						this.rawTxSerialized = this.rawTxSerialized.slice(0, -8) + '01000000';	//for POSv coins, remove timestamp, needs to be done before signing

						//console.log('this.rawTxSerialized redd: ', this.rawTxSerialized);

						var hashPOT= Crypto.util.bytesToHex(Crypto.SHA256(coinjs.hexToString(this.rawTxSerialized),  {asBytes: true}));
						hash = Crypto.util.bytesToHex(Crypto.SHA256(coinjs.hexToString(hashPOT),  {asBytes: true}));
						console.log('hash RDD/POT: ',hash);
						hash = Crypto.util.hexToBytes(hash);
					}
				}else 
					hash = txhash || Crypto.util.hexToBytes(this.transactionHash(index, shType));

			//console.log('hash before: ', hash);
			//hash = Crypto.util.hexToBytes(hash);
			//console.log('hash after: ', hash);

			// Generate a low-S ECDSA signature
			if(hash){
				var curve = EllipticCurve.getSECCurveByName("secp256k1");
				var key = coinjs.wif2privkey(wif);
				var priv = BigInteger.fromByteArrayUnsigned(Crypto.util.hexToBytes(key['privkey']));
				var n = curve.getN();
				var e = BigInteger.fromByteArrayUnsigned(hash);
				var badrs = 0
				do {
					var k = this.deterministicK(wif, hash, badrs);
					var G = curve.getG();
					var Q = G.multiply(k);
					var r = Q.getX().toBigInteger().mod(n);

					var s = k.modInverse(n).multiply(e.add(priv.multiply(r))).mod(n);

					badrs++
				} while (r.compareTo(BigInteger.ZERO) <= 0 || s.compareTo(BigInteger.ZERO) <= 0);

				// Force lower s values per BIP62
				var halfn = n.shiftRight(1);
				if (s.compareTo(halfn) > 0) {
					s = n.subtract(s);
				};
				

				var sig = serializeSig(r, s);

				//console.log('**sig: ', Crypto.util.bytesToHex(sig))
				sig.push(parseInt(shType, 10));

				//console.log('**sig.push: ', Crypto.util.bytesToHex(sig));


				return Crypto.util.bytesToHex(sig);
				
			} else {
				return false;
			}
		}


/**
 * Generate a low-S ECDSA signature
 * @param {string} key - The private key in hexadecimal format
 * @param {string} message - The message to sign
 * @returns {Array} - The r and s components of the signature, as hexadecimal strings
 *

	function signNumberLowS(key, number) {
	  const curve = EllipticCurve.getSECCurveByName("secp256k1");
	  const G = curve.getG();
	  const order = curve.n;	//curve.getN();

	  const privateKey = new BigInteger(key);
	  const eckey = new ECKey(privateKey);

	  const sig = eckey.sign(BigInteger.fromHex(number), false);  // false means we do not want to use deterministic k

	  let s = sig.s;
	  if (s.compareTo(order.divide(BigInteger.valueOf(2))) > 0) {
	    s = order.subtract(s);
	  }

	  const r = sig.r;
	  return [r.toString(16), s.toString(16)];
	}

var ECDSA = {
  signNumberLowSOlder: function(key, number) {
    const curve = EllipticCurve.getSECCurveByName("secp256k1");
    const G = curve.getG();
    const order = curve.n;

    const privateKey = potcoin.BigInteger.fromHex(key);
console.log('privateKey: ', privateKey);
    const eckey = potcoin.potcoin.ECKey.fromWIF(privateKey);
console.log('eckey: ', eckey);

    const hash = potcoin.BigInteger.fromHex(number);
    const sig = ECDSA.sign(eckey, hash);
console.log('sig: ', sig);

    let s = sig.s;
    if (s.compareTo(order.divide(BigInteger.valueOf(2))) > 0) {
      s = order.subtract(s);
    }

    const r = sig.r;
    return [r.toString(16), s.toString(16)];
  },

  sign: function(eckey, hash) {
    const d = eckey.priv;
    const n = EllipticCurve.getSECCurveByName("secp256k1").getN();
    const e = hash;

    let k = null;
    let r = null;
    let s = null;

    do {
      k = ECDSA.generateK(n);
      const Q = G.multiply(k);
      r = Q.getX().toBigInteger().mod(n);
      s = k.modInverse(n).multiply(e.add(d.multiply(r))).mod(n);
    } while (s.compareTo(n.divide(BigInteger.valueOf(2))) > 0);

    return new Bitcoin.ECSignature(r, s);
  },

  generateK: function(n) {
    const secureRandom = new SecureRandom();
    const bytes = new Array(32);
    secureRandom.nextBytes(bytes);
    return BigInteger.fromByteArrayUnsigned(bytes).mod(n);
  }
};

ECDSA.signNumberLowS('ed457c36da2618d0d467b24dbb67c75186511164e823a82aaaf6f6410f08ae59', 1)

function signNumberLowS_older(key, number) {
  var network = bitcoinjs.networks.bitcoin;
console.log('network: ', network);
  var keyPair = bitcoinjs.ECPair.fromPrivateKey(bitcoinjs.Buffer.from(key, 'hex'), { network });
  var message = bitcoinjs.Buffer.from(number, 'hex');
  //var hash = CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
	var hash = Crypto.SHA256(message);
  var signature = keyPair.sign(bitcoinjs.Buffer.from(hash, 'hex'), { lowR: true });
  var curve = bitcoinjs.ECPair.curve;
  var order = curve.n;
  var s = signature.s;
  if (s.cmp(order.div(2)) > 0) {
    s = order.sub(s);
  }
  return [signature.r.toString(16), s.toString(16)];
}

function signNumberLowS(key, number) {
  const network = bitcoinjs.networks.bitcoin;
  const keyPair = bitcoinjs.ECPair.fromPrivateKey(bitcoinjs.Buffer.from(key, 'hex'), { network });
  const message = bitcoinjs.Buffer.from(number, 'hex');
  //const hash = CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
var hash = Crypto.SHA256(message);
  const signature = keyPair.sign(bitcoinjs.Buffer.from(hash, 'hex'), { lowR: true });
  const curve = keyPair.getPublicKeyBuffer().slice(0, 1)[0] === 0x02 ? bitcoinjs.ECKey.Secp256k1 : bitcoinjs.ECKey.Secp256k1p;
  const order = curve.getN();
  let s = signature.s;
  if (s.cmp(order.div(2)) > 0) {
    s = order.sub(s);
  }
  return [signature.r.toString(16), s.toString(16)];
}

 signNumberLowS('936d57bc58e6b65840b9cdaa4f60ff4331f0f0eec0c75ed0fed6dce13997de7c', '68656c6c6f');




*/


		// https://tools.ietf.org/html/rfc6979#section-3.2
		r.deterministicK = function(wif, hash, badrs) {
			// if r or s were invalid when this function was used in signing,
			// we do not want to actually compute r, s here for efficiency, so,
			// we can increment badrs. explained at end of RFC 6979 section 3.2

			// wif is b58check encoded wif privkey.
			// hash is byte array of transaction digest.
			// badrs is used only if the k resulted in bad r or s.

			// some necessary things out of the way for clarity.
			badrs = badrs || 0;
			var key = coinjs.wif2privkey(wif);
			var x = Crypto.util.hexToBytes(key['privkey'])
			var curve = EllipticCurve.getSECCurveByName("secp256k1");
			var N = curve.getN();

			// Step: a
			// hash is a byteArray of the message digest. so h1 == hash in our case

			// Step: b
			var v = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

			// Step: c
			var k = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			// Step: d
			k = Crypto.HMAC(Crypto.SHA256, v.concat([0]).concat(x).concat(hash), k, { asBytes: true });

			// Step: e
			v = Crypto.HMAC(Crypto.SHA256, v, k, { asBytes: true });

			// Step: f
			k = Crypto.HMAC(Crypto.SHA256, v.concat([1]).concat(x).concat(hash), k, { asBytes: true });

			// Step: g
			v = Crypto.HMAC(Crypto.SHA256, v, k, { asBytes: true });

			// Step: h1
			var T = [];

			// Step: h2 (since we know tlen = qlen, just copy v to T.)
			v = Crypto.HMAC(Crypto.SHA256, v, k, { asBytes: true });
			T = v;

			// Step: h3
			var KBigInt = BigInteger.fromByteArrayUnsigned(T);

			// loop if KBigInt is not in the range of [1, N-1] or if badrs needs incrementing.
			var i = 0
			while (KBigInt.compareTo(N) >= 0 || KBigInt.compareTo(BigInteger.ZERO) <= 0 || i < badrs) {
				k = Crypto.HMAC(Crypto.SHA256, v.concat([0]), k, { asBytes: true });
				v = Crypto.HMAC(Crypto.SHA256, v, k, { asBytes: true });
				v = Crypto.HMAC(Crypto.SHA256, v, k, { asBytes: true });
				T = v;
				KBigInt = BigInteger.fromByteArrayUnsigned(T);
				i++
			};

			return KBigInt;
		};

		/* sign a "standard" input */
		r.signinput = function(index, wif, sigHashType, rawTx){
			var key = coinjs.wif2pubkey(wif);
			var shType = sigHashType || 1;
			var signature = this.transactionSig(index, wif, shType);
			//var signature = this.transactionSig(index, wif, shType, rawTx);
			var s = coinjs.script();
			s.writeBytes(Crypto.util.hexToBytes(signature));
			s.writeBytes(Crypto.util.hexToBytes(key['pubkey']));
			this.ins[index].script = s;
			return true;
		}

		/* signs a time locked / hodl input */
		r.signhodl = function(index, wif, sigHashType){
			var shType = sigHashType || 1;
			var signature = this.transactionSig(index, wif, shType);
			var redeemScript = this.ins[index].script.buffer
			var s = coinjs.script();
			s.writeBytes(Crypto.util.hexToBytes(signature));
			s.writeBytes(redeemScript);
			this.ins[index].script = s;
			return true;
		}
		
		/* sign a multisig input */
		r.signmultisig = function(index, wif, sigHashType){

			function scriptListPubkey(redeemScript){
				var r = {};
				for(var i=1;i<redeemScript.chunks.length-2;i++){
					r[i] = Crypto.util.hexToBytes(coinjs.pubkeydecompress(Crypto.util.bytesToHex(redeemScript.chunks[i])));
				}
				return r;
			}
	
			function scriptListSigs(scriptSig){
				var r = {};
				var c = 0;
				if (scriptSig.chunks[0]==0 && scriptSig.chunks[scriptSig.chunks.length-1][scriptSig.chunks[scriptSig.chunks.length-1].length-1]==174){
					for(var i=1;i<scriptSig.chunks.length-1;i++){				
						if (scriptSig.chunks[i] != 0){
							c++;
							r[c] = scriptSig.chunks[i];
						}
					}
				}
				return r;
			}

			var redeemScript = (this.ins[index].script.chunks[this.ins[index].script.chunks.length-1]==174) ? this.ins[index].script.buffer : this.ins[index].script.chunks[this.ins[index].script.chunks.length-1];

			var pubkeyList = scriptListPubkey(coinjs.script(redeemScript));
			var sigsList = scriptListSigs(this.ins[index].script);

			var shType = sigHashType || 1;
			var sighash = Crypto.util.hexToBytes(this.transactionHash(index, shType));
			var signature = Crypto.util.hexToBytes(this.transactionSig(index, wif, shType));

			sigsList[coinjs.countObject(sigsList)+1] = signature;

			var s = coinjs.script();

			s.writeOp(0);

			for(x in pubkeyList){
				for(y in sigsList){
					this.ins[index].script.buffer = redeemScript;
					sighash = Crypto.util.hexToBytes(this.transactionHash(index, sigsList[y].slice(-1)[0]*1));
					if(coinjs.verifySignature(sighash, sigsList[y], pubkeyList[x])){
						s.writeBytes(sigsList[y]);
					}
				}
			}

			s.writeBytes(redeemScript);
			this.ins[index].script = s;
			return true;
		}

		/* sign segwit input */
		r.signsegwit = function(index, wif, sigHashType){
			var shType = sigHashType || 1;

			var wif2 = coinjs.wif2pubkey(wif);
			var segwit = coinjs.segwitAddress(wif2['pubkey']);
			var bech32 = coinjs.bech32Address(wif2['pubkey']);

			if((segwit['redeemscript'] == Crypto.util.bytesToHex(this.ins[index].script.chunks[0])) || (bech32['redeemscript'] == Crypto.util.bytesToHex(this.ins[index].script.chunks[0]))){
				var txhash = this.transactionHashSegWitV0(index, shType);

				if(txhash.result == 1){

					var segwitHash = Crypto.util.hexToBytes(txhash.hash);
					var signature = this.transactionSig(index, wif, shType, segwitHash);

					// remove any non standard data we store, i.e. input value
					var script = coinjs.script();
					script.writeBytes(this.ins[index].script.chunks[0]);	
					this.ins[index].script = script;

					if(!coinjs.isArray(this.witness)){
						this.witness = [];
					}

					this.witness.push([signature, wif2['pubkey']]);

					/* attempt to reorder witness data as best as we can. 
					   data can't be easily validated at this stage as 
					   we dont have access to the inputs value and 
					   making a web call will be too slow. */

					var witness_order = [];
					var witness_used = [];
					for(var i = 0; i < this.ins.length; i++){
						for(var y = 0; y < this.witness.length; y++){
							if(!witness_used.includes(y)){
								var sw = coinjs.segwitAddress(this.witness[y][1]);
								var b32 = coinjs.bech32Address(this.witness[y][1]);
								var rs = '';

								if(this.ins[i].script.chunks.length>=1){
									rs = Crypto.util.bytesToHex(this.ins[i].script.chunks[0]);
								} else if (this.ins[i].script.chunks.length==0){
									rs = b32['redeemscript'];
								}

								if((sw['redeemscript'] == rs) || (b32['redeemscript'] == rs)){
									witness_order.push(this.witness[y]);
									witness_used.push(y);

									// bech32, empty redeemscript
									if(b32['redeemscript'] == rs){
										this.ins[index].script = coinjs.script();
									}
									break;
								}
							}
						}
					}

					this.witness = witness_order;
				}
			}
			return true;
		}

		/* sign inputs */
		r.sign = function(wif, sigHashType, rawTx){
			var shType = sigHashType || 1;

			console.log('===r.sign===');
			console.log('rawTx: ', rawTx);

			for (var i = 0; i < this.ins.length; i++) {
				var d = this.extractScriptKey(i);

				var w2a = coinjs.wif2address(wif);
				var script = coinjs.script();
				var pubkeyHash = script.pubkeyHash(w2a['address']);

				if(((d['type'] == 'scriptpubkey' && d['script']==Crypto.util.bytesToHex(pubkeyHash.buffer)) || d['type'] == 'empty') && d['signed'] == "false"){
					this.signinput(i, wif, shType, rawTx);

				} else if (d['type'] == 'hodl' && d['signed'] == "false") {
					this.signhodl(i, wif, shType);

				} else if (d['type'] == 'multisig') {
					this.signmultisig(i, wif, shType);

				} else if (d['type'] == 'segwit') {
					this.signsegwit(i, wif, shType);

				} else {
					// could not sign
				}
			}
			return this.serialize();
		}

		/* serialize a transaction */
		r.serialize = function(){
			var buffer = [];

			//version
			buffer = buffer.concat(coinjs.numToBytes(parseInt(this.version),4));

			//time, PoS coins, add extra timefield to TX
			if(coinjs.asset?.chainFamily !== 'rdd'){
				if (coinjs.txExtraTimeField) {
					buffer = buffer.concat(coinjs.numToBytes(parseInt(this.nTime),4));
				}
			}

			//witness
			if(coinjs.isArray(this.witness)){
				buffer = buffer.concat([0x00, 0x01]);
			}

			buffer = buffer.concat(coinjs.numToVarInt(this.ins.length));
			for (var i = 0; i < this.ins.length; i++) {
				var txin = this.ins[i];
				buffer = buffer.concat(Crypto.util.hexToBytes(txin.outpoint.hash).reverse());
				buffer = buffer.concat(coinjs.numToBytes(parseInt(txin.outpoint.index),4));
				var scriptBytes = txin.script.buffer;
				buffer = buffer.concat(coinjs.numToVarInt(scriptBytes.length));
				buffer = buffer.concat(scriptBytes);
				buffer = buffer.concat(coinjs.numToBytes(parseInt(txin.sequence),4));
			}
			buffer = buffer.concat(coinjs.numToVarInt(this.outs.length));

			for (var i = 0; i < this.outs.length; i++) {
				var txout = this.outs[i];
 				buffer = buffer.concat(coinjs.numToBytes(txout.value,8));
				var scriptBytes = txout.script.buffer;
				buffer = buffer.concat(coinjs.numToVarInt(scriptBytes.length));
				buffer = buffer.concat(scriptBytes);
			}

			if((coinjs.isArray(this.witness)) && this.witness.length>=1){
				for(var i = 0; i < this.witness.length; i++){
	 				buffer = buffer.concat(coinjs.numToVarInt(this.witness[i].length));
					for(var x = 0; x < this.witness[i].length; x++){
		 				buffer = buffer.concat(coinjs.numToVarInt(Crypto.util.hexToBytes(this.witness[i][x]).length));
						buffer = buffer.concat(Crypto.util.hexToBytes(this.witness[i][x]));
					}
				}
			}

			//locktime
			buffer = buffer.concat(coinjs.numToBytes(parseInt(this.lock_time),4));

			//time, PoS coins, add extra timefield to TX
			if(coinjs.asset?.chainFamily === 'rdd'){
				if (coinjs.txExtraTimeField) {
					buffer = buffer.concat(coinjs.numToBytes(parseInt(this.nTime),4));
				}
			}

			//Additional TxUnit field, add extra unit field to TX
			if (coinjs.txExtraUnitField) {
				buffer = buffer.concat(coinjs.numToBytes(parseInt(coinjs.txExtraUnitFieldValue),1));
			}

			return Crypto.util.bytesToHex(buffer);
		}

		/* deserialize a transaction */
		r.deserialize = function(buffer){

			try {
				if (typeof buffer == "string") {
					buffer = Crypto.util.hexToBytes(buffer)
				}

				console.log('r.deserialize buffer: ', buffer);
				console.log('r.deserialize buffer.length: ', buffer.length);
				var pos = 0;
				var witness = false;

				var readAsInt = function(bytes) {
					if (bytes == 0) return 0;
					pos++;

					//dont go any further then buffer.length
					if (pos > buffer.length)
						throw ('Not Within Buffer Range (length), No need to read more!');

					//console.log('pos: '+ pos);
					return buffer[pos-1] + readAsInt(bytes-1) * 256;
				}

				var readVarInt = function() {
					pos++;
					if (buffer[pos-1] < 253) {
						return buffer[pos-1];
					}
					return readAsInt(buffer[pos-1] - 251);
				}

				var readBytes = function(bytes) {
					pos += bytes;
					return buffer.slice(pos - bytes, pos);
				}

				var readVarString = function() {
					var size = readVarInt();
					return readBytes(size);
				}

				var obj = new coinjs.transaction();
				obj.version = readAsInt(4);

				//PoS coins
				if(coinjs.asset?.chainFamily !== 'rdd'){
					if (coinjs.txExtraTimeField) {
						console.log('txExtra:');
						obj.nTime = readAsInt(4);
					}
				}

				if(buffer[pos] == 0x00 && buffer[pos+1] == 0x01){
					// segwit transaction
					witness = true;
					obj.witness = [];
					pos += 2;
				}

				var ins = readVarInt();
				for (var i = 0; i < ins; i++) {
					obj.ins.push({
						outpoint: {
							hash: Crypto.util.bytesToHex(readBytes(32).reverse()),
	 						index: readAsInt(4)
						},
						script: coinjs.script(readVarString()),
						sequence: readAsInt(4)
					});
				}

				var outs = readVarInt();
				for (var i = 0; i < outs; i++) {
					obj.outs.push({
						value: coinjs.bytesToNum(readBytes(8)),
						script: coinjs.script(readVarString())
					});
				}

				if(witness == true){
					for (i = 0; i < ins; ++i) {
						var count = readVarInt();
						var vector = [];
						for(var y = 0; y < count; y++){
							var slice = readVarInt();
							pos += slice;
							if(!coinjs.isArray(obj.witness[i])){
								obj.witness[i] = [];
							}
							obj.witness[i].push(Crypto.util.bytesToHex(buffer.slice(pos - slice, pos)));
						}
					}
				}

	 			obj.lock_time = readAsInt(4);

	 			//Additional TxUnit field
	 			if (coinjs.txExtraUnitField) {
					obj.nUnit = readAsInt(1);
				}

				//PoS coins
				if(coinjs.asset?.chainFamily === 'rdd'){
					if (coinjs.txExtraTimeField) {
						console.log('txExtra:');
						obj.nTime = readAsInt(4);
					}
				}
/*
// Read multiplier length and multiplier
				if (buffer.length >= 81) {
                var multiplierLength = buffer[80];
                console.log('multiplierLength: ', multiplierLength);
                var multiplierBytes = buffer.slice(81, 81 + multiplierLength);
                console.log('multiplierBytes: ', multiplierBytes);
                var bnPrimeChainMultiplier = new BigInteger(Crypto.util.bytesToHex(multiplierBytes), 16);
                console.log('bnPrimeChainMultiplier: ', bnPrimeChainMultiplier);

              } else{
              	console.log('no multiplierBytes!');
              }
              */
/*
				var multiplierLength = buffer[80]; // Byte 80 indicating the length
console.log('multiplierLength: ', multiplierLength);

// Ensure buffer has enough data for the multiplier
if (buffer.length >= 81 + multiplierLength) {
    var multiplierBytes = buffer.slice(81, 81 + multiplierLength); // Extract multiplier bytes
    console.log('multiplierBytes: ', multiplierBytes);

    // Convert bytes to a BigInteger
    var bnPrimeChainMultiplier = new BigInteger(Crypto.util.bytesToHex(multiplierBytes), 16);
    console.log('bnPrimeChainMultiplier (BigInteger object): ', bnPrimeChainMultiplier);

    // Convert the BigInteger to a usable string or numeric value
    var multiplierAsHex = bnPrimeChainMultiplier.toString(16); // Hexadecimal representation
    var multiplierAsDecimal = bnPrimeChainMultiplier.toString(10); // Decimal representation

    console.log('Multiplier as Hex: ', multiplierAsHex);
    console.log('Multiplier as Decimal: ', multiplierAsDecimal);

    // If you need it as a number (careful with large integers):
    var multiplierAsNumber = parseInt(multiplierAsDecimal, 10);
    console.log('Multiplier as Number: ', multiplierAsNumber);
} else {
    console.error('Insufficient buffer length for multiplierBytes.');
}
*/

/*
// Check if there's enough buffer left for byte 80
if (buffer.length > pos) {
    var multiplierLength = readAsInt(1); // Byte 80
    console.log('multiplierLength: ', multiplierLength);

    // Ensure the length of the multiplier doesn't exceed the remaining buffer
    if (pos + multiplierLength <= buffer.length) {
        obj.multiplier = Crypto.util.bytesToHex(readBytes(multiplierLength)); // Multiplier data
        console.log('obj.multiplier: ', obj.multiplier);
    } else {
        console.error('Multiplier length exceeds buffer length. Malformed transaction.');
        obj.multiplier = null; // Handle as a failed case
    }
} else {
    console.error('Byte 80 does not exist. Malformed transaction.');
    obj.multiplier = null; // Handle as a failed case
}
*/



				return obj;
			} catch (e) {
				console.log('r.deserialize error: ', e);
			}
			return false;
		}

		/* deserialize a transaction */
		r.adeserialize = function(buffer, options = {}){

			try {
				if (typeof buffer == "string") {
					buffer = Crypto.util.hexToBytes(buffer)
				}

				console.log('r.adeserialize buffer: ', buffer);
				console.log('r.adeserialize buffer.length: ', buffer.length);
				var pos = 0;
				var witness = false;

				var readAsInt = function(bytes) {
					if (bytes == 0) return 0;
					pos++;

					//dont go any further then buffer.length
					if (pos > buffer.length)
						throw ('Not Within Buffer Range (length), No need to read more!');

					//console.log('pos: '+ pos);
					return buffer[pos-1] + readAsInt(bytes-1) * 256;
				}

				var readVarInt = function() {
					pos++;
					if (buffer[pos-1] < 253) {
						return buffer[pos-1];
					}
					return readAsInt(buffer[pos-1] - 251);
				}

				var readBytes = function(bytes) {
					pos += bytes;
					return buffer.slice(pos - bytes, pos);
				}

				var readVarString = function() {
					var size = readVarInt();
					return readBytes(size);
				}

				var obj = new coinjs.transaction();
				obj.version = readAsInt(4);

				//PoS coins
				/*
				if(coinjs.asset.slug != 'potcoin'){
					if (coinjs.txExtraTimeField) {
						console.log('txExtra:');
						obj.nTime = readAsInt(4);
					}
				}
				*/

				if(buffer[pos] == 0x00 && buffer[pos+1] == 0x01){
					// segwit transaction
					witness = true;
					obj.witness = [];
					pos += 2;
				}

				var ins = readVarInt();
				for (var i = 0; i < ins; i++) {
					obj.ins.push({
						outpoint: {
							hash: Crypto.util.bytesToHex(readBytes(32).reverse()),
	 						index: readAsInt(4)
						},
						script: coinjs.script(readVarString()),
						sequence: readAsInt(4)
					});
				}

				var outs = readVarInt();
				for (var i = 0; i < outs; i++) {
					obj.outs.push({
						value: coinjs.bytesToNum(readBytes(8)),
						script: coinjs.script(readVarString())
					});
				}

				if(witness == true){
					for (i = 0; i < ins; ++i) {
						var count = readVarInt();
						var vector = [];
						for(var y = 0; y < count; y++){
							var slice = readVarInt();
							pos += slice;
							if(!coinjs.isArray(obj.witness[i])){
								obj.witness[i] = [];
							}
							obj.witness[i].push(Crypto.util.bytesToHex(buffer.slice(pos - slice, pos)));
						}
					}
				}

	 			obj.lock_time = readAsInt(4);

	 			//Additional TxUnit field
	 			if (coinjs.txExtraUnitField) {
					obj.nUnit = readAsInt(1);
				}

				/*
				//PoSv coins, we have already stripped out the txtime field before signing, coinbin.js around line: 26x9

				if(coinjs.asset.slug == 'potcoin'){
					if (coinjs.txExtraTimeField) {
						console.log('txExtra:');
						obj.nTime = readAsInt(4);
					}
				}
				*/


				return obj;
			} catch (e) {
				console.log('r.deserialize error: ', e);
			}
			return false;
		}

		r.size = function(){
			return ((this.serialize()).length/2).toFixed(0);
		}

		return r;
	}

	/* start of signature vertification functions */

	coinjs.verifySignature = function (hash, sig, pubkey) {

		function parseSig (sig) {
			var cursor;
			if (sig[0] != 0x30)
				throw new Error("Signature not a valid DERSequence");

			cursor = 2;
			if (sig[cursor] != 0x02)
				throw new Error("First element in signature must be a DERInteger"); ;

			var rBa = sig.slice(cursor + 2, cursor + 2 + sig[cursor + 1]);

			cursor += 2 + sig[cursor + 1];
			if (sig[cursor] != 0x02)
				throw new Error("Second element in signature must be a DERInteger");

			var sBa = sig.slice(cursor + 2, cursor + 2 + sig[cursor + 1]);

			cursor += 2 + sig[cursor + 1];

			var r = BigInteger.fromByteArrayUnsigned(rBa);
			var s = BigInteger.fromByteArrayUnsigned(sBa);

			return { r: r, s: s };
		}

		var r, s;

		if (coinjs.isArray(sig)) {
			var obj = parseSig(sig);
			r = obj.r;
			s = obj.s;
		} else if ("object" === typeof sig && sig.r && sig.s) {
			r = sig.r;
			s = sig.s;
		} else {
			throw "Invalid value for signature";
		}

		var Q;
		if (coinjs.isArray(pubkey)) {
			var ecparams = EllipticCurve.getSECCurveByName("secp256k1");
			Q = EllipticCurve.PointFp.decodeFrom(ecparams.getCurve(), pubkey);
		} else {
			throw "Invalid format for pubkey value, must be byte array";
		}
		var e = BigInteger.fromByteArrayUnsigned(hash);

		return coinjs.verifySignatureRaw(e, r, s, Q);
	}

	coinjs.verifySignatureRaw = function (e, r, s, Q) {
		var ecparams = EllipticCurve.getSECCurveByName("secp256k1");
		var n = ecparams.getN();
		var G = ecparams.getG();

		if (r.compareTo(BigInteger.ONE) < 0 || r.compareTo(n) >= 0)
			return false;

		if (s.compareTo(BigInteger.ONE) < 0 || s.compareTo(n) >= 0)
			return false;

		var c = s.modInverse(n);

		var u1 = e.multiply(c).mod(n);
		var u2 = r.multiply(c).mod(n);

		var point = G.multiply(u1).add(Q.multiply(u2));

		var v = point.getX().toBigInteger().mod(n);

		return v.equals(r);
	}

	/* start of privates functions */

	/* base58 encode function */
	coinjs.base58encode = function(buffer) {
		var alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
		var base = BigInteger.valueOf(58);

		var bi = BigInteger.fromByteArrayUnsigned(buffer);
		var chars = [];

		while (bi.compareTo(base) >= 0) {
			var mod = bi.mod(base);
			chars.unshift(alphabet[mod.intValue()]);
			bi = bi.subtract(mod).divide(base);
		}

		chars.unshift(alphabet[bi.intValue()]);
		for (var i = 0; i < buffer.length; i++) {
			if (buffer[i] == 0x00) {
				chars.unshift(alphabet[0]);
			} else break;
		}
		return chars.join('');
	}

	/* base58 decode function */
	coinjs.base58decode = function(buffer){
		var alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
		var base = BigInteger.valueOf(58);
		var validRegex = /^[1-9A-HJ-NP-Za-km-z]+$/;

		var bi = BigInteger.valueOf(0);
		var leadingZerosNum = 0;
		for (var i = buffer.length - 1; i >= 0; i--) {
			var alphaIndex = alphabet.indexOf(buffer[i]);
			if (alphaIndex < 0) {
				throw "Invalid character";
			}
			bi = bi.add(BigInteger.valueOf(alphaIndex).multiply(base.pow(buffer.length - 1 - i)));

			if (buffer[i] == "1") leadingZerosNum++;
			else leadingZerosNum = 0;
		}

		var bytes = bi.toByteArrayUnsigned();
		while (leadingZerosNum-- > 0) bytes.unshift(0);
		return bytes;		
	}

	/* raw ajax function to avoid needing bigger frame works like jquery, mootools etc */
	coinjs.ajax = function(u, f, m='GET', a){	//url, callbackFunction, method, a?isAwhat? =parameters for POST
		/*
		console.log('u:', u);
		console.log('f:', f);
		console.log('m:', m);
		console.log('a:', a);
		*/

		var x = false;
		try{
			x = new ActiveXObject('Msxml2.XMLHTTP')
		} catch(e) {
			try {
				x = new ActiveXObject('Microsoft.XMLHTTP')
			} catch(e) {
				x = new XMLHttpRequest()
			}
		}

		if(x==false) {
			return false;
		}

		x.open(m, u, true);
		x.onreadystatechange=function(){
			if((x.readyState==4) && f){
				console.log('back to callBackFunc!');
				f(x.responseText);
				}
		};

		if(m == 'POST'){
			x.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		}

		x.send(a);
	}

	/* clone an object */
	coinjs.clone = function(obj) {
		if(obj == null || typeof(obj) != 'object') return obj;
		var temp = new obj.constructor();

		for(var key in obj) {
			if(obj.hasOwnProperty(key)) {
				temp[key] = coinjs.clone(obj[key]);
			}
		}
 		return temp;
	}

	coinjs.numToBytes = function(num,bytes) {
		if (typeof bytes === "undefined") bytes = 8;
		if (bytes == 0) { 
			return [];
		} else if (num == -1){
			return Crypto.util.hexToBytes("ffffffffffffffff");
		} else {
			return [num % 256].concat(coinjs.numToBytes(Math.floor(num / 256),bytes-1));
		}
	}

	function scriptNumSize(i) {
		return i > 0x7fffffff ? 5
			: i > 0x7fffff ? 4
			: i > 0x7fff ? 3
			: i > 0x7f ? 2
			: i > 0x00 ? 1
			: 0;
	}

	coinjs.numToScriptNumBytes = function(_number) {
		var value = Math.abs(_number);
		var size = scriptNumSize(value);
		var result = [];
		for (var i = 0; i < size; ++i) {
			result.push(0);
		}
		var negative = _number < 0;
		for (i = 0; i < size; ++i) {
			result[i] = value & 0xff;
			value = Math.floor(value / 256);
		}
		if (negative) {
			result[size - 1] |= 0x80;
		}
		return result;
	}

	coinjs.numToVarInt = function(num) {
		if (num < 253) {
			return [num];
		} else if (num < 65536) {
			return [253].concat(coinjs.numToBytes(num,2));
		} else if (num < 4294967296) {
			return [254].concat(coinjs.numToBytes(num,4));
		} else {
			return [255].concat(coinjs.numToBytes(num,8));
		}
	}

	coinjs.bytesToNum = function(bytes) {
		if (bytes.length == 0) return 0;
		else return bytes[0] + 256 * coinjs.bytesToNum(bytes.slice(1));
	}

	coinjs.uint = function(f, size) {
		if (f.length < size)
			throw new Error("not enough data");
		var n = 0;
		for (var i = 0; i < size; i++) {
			n *= 256;
			n += f[i];
		}
		return n;
	}

	coinjs.isArray = function(o){
		return Object.prototype.toString.call(o) === '[object Array]';
	}

	coinjs.countObject = function(obj){
		var count = 0;
		var i;
		for (i in obj) {
			if (obj.hasOwnProperty(i)) {
				count++;
			}
		}
		return count;
	}

	coinjs.random = function(length) {
		var r = "";
		var l = length || 25;
		var chars = "!$%^&*()_+{}:@~?><|\./;'#][=-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		for(x=0;x<l;x++) {
			r += chars.charAt(Math.floor(Math.random() * 62));
		}
		return coinjs.generatePass();
	}

	coinjs.formatAmount = function(amount) {
		return (amount/("1e"+coinjs.decimalPlaces)).toString() + " " + coinjs.symbol;
	}

	coinjs.generatePass = function(length) {
  var generatePass = (
  //length = 20,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~'
) =>
  Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');

  return generatePass();  
}

//https://emn178.github.io/online-tools/js/main.js
	coinjs.hexToString = function(hex) {
    if (!hex.match(/^[0-9a-fA-F]+$/)) {
      throw new Error('is not a hex string.');
    }
    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }
    var bytes = [];
    for (var n = 0; n < hex.length; n += 2) {
      var code = parseInt(hex.substr(n, 2), 16)
      bytes.push(code);
    }
    return bytes;
  }

  coinjs.addressToOutputScript = function(address){
  	var script = coinjs.script();
  	var pubkeyHashScript = Crypto.util.bytesToHex( script.pubkeyHash(address).buffer, {asBytes: false});
  	return pubkeyHashScript;
  }

  /*
 	@ for ElectrumX integration
 	address to scriptHash in reversed order
  */
  coinjs.addressToScriptHash = function(address) {
    var outputScript;

    // Check if the address is Bech32
    var decoded = coinjs.bech32_decode(address);
    if (decoded !== null && decoded.data) {
        // Handle Bech32 SegWit address
        var data = coinjs.bech32_convert(decoded.data.slice(1), 5, 8, false);
        if (!data) {
            throw new Error("Invalid Bech32 conversion");
        }

        // Determine the type of SegWit address
        if (data.length === 20) {
            // P2WPKH: OP_0 0x14 <20-byte-hash>
            outputScript = "0014" + Crypto.util.bytesToHex(data);
        } else if (data.length === 32) {
            // P2WSH: OP_0 0x20 <32-byte-hash>
            outputScript = "0020" + Crypto.util.bytesToHex(data);
        } else {
            throw new Error("Invalid witness program length for Bech32");
        }
    } else {
        // Assume it's a legacy address (P2PKH or P2SH)
        var script = coinjs.script();
        var pubkeyHashScript = coinjs.hexToString(
            Crypto.util.bytesToHex(script.pubkeyHash(address).buffer, { asBytes: true })
        );

        // Hash the legacy pubkey script with SHA-256
        var pubkeyHashScriptSHA256 = Crypto.SHA256(pubkeyHashScript);

        // Reverse the hash bytes for legacy addresses
        var pubkeyHashScriptSHA256Reversed = Crypto.util.bytesToHex(
            Crypto.util.hexToBytes(pubkeyHashScriptSHA256).reverse()
        );

        return pubkeyHashScriptSHA256Reversed; // Return for legacy addresses
    }

    // Hash the output script with SHA-256 for Bech32 addresses
    var scriptHash = Crypto.SHA256(Crypto.util.hexToBytes(outputScript));

    // Reverse the hash bytes
    var reversedHash = Crypto.util.bytesToHex(Crypto.util.hexToBytes(scriptHash).reverse());

    return reversedHash; // Return for Bech32 addresses
};

  coinjs.addressToScriptHashLegacy = function(address) {
  	/*
  	

  	For example, the legacy Bitcoin address from the genesis block:
		1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa

		has P2PKH script:
		76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac

		with SHA256 hash:
		6191c3b590bfcfa0475e877c302da1e323497acf3b42c08d8fa28e364edf018b

		which is sent to the server reversed as:
		8b01df4e368ea28f8dc0423bcf7a4923e3a12d307c875e47a0cfbf90b5c39161


function hexToString(hex) {
    if (!hex.match(/^[0-9a-fA-F]+$/)) {
      throw new Error('is not a hex string.');
    }
    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }
    var bytes = [];
    for (var n = 0; n < hex.length; n += 2) {
      var code = parseInt(hex.substr(n, 2), 16)
      bytes.push(code);
    }
    return bytes;
  }

var script = coinjs.script();
var address = 'CeTNuWQ5pC3RS4NexFEeAysF7X25zp1qB4';


var pubkeyHashScript = hexToString(Crypto.util.bytesToHex( script.pubkeyHash(address).buffer, {asBytes: true}));
console.log('pubkeyHashScript: ', pubkeyHashScript);
var pubkeyHashScriptSHA256 = Crypto.SHA256(pubkeyHashScript);
console.log('pubkeyHashScriptSHA256: ', pubkeyHashScriptSHA256);

var pubkeyHashScriptSHA256Reversed = Crypto.util.bytesToHex(Crypto.util.hexToBytes(pubkeyHashScriptSHA256).reverse());
console.log('pubkeyHashScriptSHA256Reversed: ', pubkeyHashScriptSHA256Reversed);


		*/
  	var script = coinjs.script();
		//var address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';


		var pubkeyHashScript = coinjs.hexToString(Crypto.util.bytesToHex( script.pubkeyHash(address).buffer, {asBytes: true}));
		//console.log('pubkeyHashScript: ', pubkeyHashScript);
		var pubkeyHashScriptSHA256 = Crypto.SHA256(pubkeyHashScript);
		//console.log('pubkeyHashScriptSHA256: ', pubkeyHashScriptSHA256);

		var pubkeyHashScriptSHA256Reversed = Crypto.util.bytesToHex(Crypto.util.hexToBytes(pubkeyHashScriptSHA256).reverse());
		//console.log('pubkeyHashScriptSHA256Reversed: ', pubkeyHashScriptSHA256Reversed);

		return pubkeyHashScriptSHA256Reversed;

  }


  //https://bitcoin.stackexchange.com/questions/68565/scripthash-from-bitcoin-address-with-bitcoinjs
  //bc1qqmpt7u5e9hfznljta5gnvhyvfd2kdd0r90hwue ->  1929acaaef3a208c715228e9f1ca0318e3a6b9394ab53c8d026137f847ecf97b
  


})();

