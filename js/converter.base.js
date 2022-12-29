//Data Converter functions
$(document).ready( function() {

    var PUBLIC_KEY_VERSION = coinjs.pub;
    var PRIVATE_KEY_VERSION = coinjs.priv;
    var PUBLIC_KEY_VERSION = 0x00;
    var PRIVATE_KEY_VERSION = 0x80;

    console.log('PUBLIC_KEY_VERSION:' + PUBLIC_KEY_VERSION);
    console.log('PRIVATE_KEY_VERSION:' + PRIVATE_KEY_VERSION);
    // --- converter ---
    var TIMEOUT = 600;
    var timeout = null;

    var from = '';
    var to = 'hex';

    function update_enc_from() {
        
        from = $(this).attr('id').substring(5);
        translate();
        //console.log('from: ' + from);
    }

    function update_enc_to() {

        
        to = $(this).attr('id').substring(3);
        //console.log('to: ' + to);
        translate();
    }

    function parseBase58Check(address) {
        //var bytes = Bitcoin.Base58.decode(address);
        var bytes = coinjs.base58decode(address);
        var end = bytes.length - 4;
        var hash = bytes.slice(0, end);
        var checksum = Crypto.SHA256(Crypto.SHA256(hash, {asBytes: true}), {asBytes: true});
        if (checksum[0] != bytes[end] ||
            checksum[1] != bytes[end+1] ||
            checksum[2] != bytes[end+2] ||
            checksum[3] != bytes[end+3])
                throw new Error("Wrong checksum");
        var version = hash.shift();
        return [version, hash];
    }

    // stringToBytes, exception-safe
    function stringToBytes(str) {
      try {
        var bytes = Crypto.charenc.UTF8.stringToBytes(str);
      } catch (err) {
        var bytes = [];
        for (var i = 0; i < str.length; ++i)
           bytes.push(str.charCodeAt(i));
      }
      return bytes;
    }

    // bytesToString, exception-safe
    function bytesToString(bytes) {
      try {
        var str = Crypto.charenc.UTF8.bytesToString(bytes);
      } catch (err) {
        var str = '';
        for (var i = 0; i < bytes.length; ++i)
            str += String.fromCharCode(bytes[i]);
      }
      return str;
    }


    function isHex(str) {
        return !/[^0123456789abcdef]+/i.test(str);
    }

    function isBase58(str) {
        return !/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+/.test(str);
    }

    function isBase64(str) {
        return !/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=]+/.test(str) && (str.length % 4) == 0;
    }

    function isBin(str) {
      return !/[^01 \r\n]+/i.test(str);
    }

    function isDec(str) {
      return !/[^0123456789]+/i.test(str);
    }

    function issubset(a, ssv, min_words) {
        var b = ssv.trim().split(' ');
        if (min_words>b.length)
            return false;
        for (var i = 0; i < b.length; i++) {
            if (a.indexOf(b[i].toLowerCase()) == -1
                && a.indexOf(b[i].toUpperCase()) == -1)
            return false;
        }
        return true;
    }

    function isEasy16(str) {
      return !/[^asdfghjkwertuion \r\n]+/i.test(str);
    }

    function autodetect(str) {
        var enc = [];
        var bstr = str.replace(/[ :,\n]+/g,'').trim();
        if ( isBin(bstr) )
            enc.push('bin');
        if (isDec(bstr) )
            enc.push('dec');
        if (isHex(bstr))
            enc.push('hex');
        if (isBase58(bstr)) {
            // push base58check first (higher priority)
            try {
                var res = parseBase58Check(bstr);
                enc.push('base58check');
            } catch (err) {};
        }
        if (issubset(mn_words, str, 3))
            enc.push('mnemonic');
        if (issubset(rfc1751_wordlist, str, 6))
            enc.push('rfc1751');
        /*if (isEasy16(bstr))
          enc.push('easy16');*/
        if (isBase64(bstr))
            enc.push('base64');
        if (str.length > 0) {
            enc.push('text');
            enc.push('rot13');
        }
        if (isBase58(bstr)) {
          // arbitrary text should have higher priority than base58
          enc.push('base58');
        }
        return enc;
    }

    function update_toolbar(enc_list) {
        var reselect = false;

        //console.log('enc_list', enc_list);

        $.each($('#enc_from').children(), function() {
            $(this).children().removeClass('active');

            var enc = $(this).children().attr('id').substring(5);
            var disabled = (enc_list && enc_list.indexOf(enc) == -1);
            if (disabled && $(this).hasClass('active')) {
                $(this).removeClass('active');
                reselect = true;
            }
            //console.log('encid:'+ enc);
            
            //console.log('enc_list.indexOf(enc)' + enc_list.indexOf(enc));

            //which from types is found?
            if((enc_list && enc_list.indexOf(enc) == -1)) {
                //$(this).removeClass('disabled');
                //console.log('encid NOT found:');
                $(this).addClass('disabled');
                $(this).removeClass('active');
            }else{
                //$(this).addClass('disabled');
                //console.log('encid found!');
                $(this).removeClass('disabled');
                }

            //$(this).attr('disabled', disabled);
            //$(this).addClass('disabled');
            //console.log('id: ' , $(this).children().attr('id'));
            //console.log('$(this).children() : ' , $(this).children());

            /*
            if(enc_list.indexOf(enc)) {
                $(this).removeClass('disabled');
            }
            */
            

            

            //console.log('all enc:'. enc);
        });

        $('#from_' + from).addClass('active');


        if (enc_list && enc_list.length > 0) {
            if (reselect || from=='') {
              from = enc_list[0];
              $('#from_' + from).click();
            }
        }
    }

    function rot13(str) {
        return str.replace(/[a-zA-Z]/g, function(c) {
          return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    }

    function fromEasy16(str) {
      var keys = str.split('\n');
      var res = [];
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i].replace(' ','');
        var raw = Crypto.util.hexToBytes(armory_map(k, armory_f, armory_t));
        data = raw.slice(0, 16);
        res = res.concat(data);
      }
      return res;
    }

    function toEasy16(bytes) {
        var keys = armory_encode_keys(bytes,[]);
        var lines = keys.split('\n');
        var res = [];
        for (var i in lines) {
          if (lines[i].trim(' ').split(' ').length==9)
            res.push(lines[i]);
        }
        return res.join('\n');
    }

    function toBin(bytes)
    {
      var arr = [];
      for (var i=0; i<bytes.length;i++)
      {
        var s = (bytes[i]).toString(2);
        arr.push(('0000000' + s).slice(-8));
      }
      return arr.join(' ');
    }

    function fromBin(str)
    {
      var arr = str.trim().split(/[\r\n ]+/);
      arr = [arr.join('')]; // this line actually kills separating bytes with spaces (people get confused), comment it out if you want
      var res = [];
      for (var i=0; i<arr.length; i++)
      {
        var bstr = arr[i];
        var s = ('0000000'+bstr).slice(-Math.ceil(bstr.length/8)*8); // needs padding
        var chunks = s.match(/.{1,8}/g);
         for (var j=0;j<chunks.length;j++)
          res.push(parseInt(chunks[j], 2));
      }
      return res;
    }

    function fromDec(str)
    {
        var h = new BigInteger(str).toString(16);
        return Crypto.util.hexToBytes(h.length%2?'0'+h:h);
    }

    function toDec(bytes)
    {
        var h = Crypto.util.bytesToHex(bytes);
        return new BigInteger(h,16).toString(10);
    }

    function enct(id) {
        return $('#from_'+id).parent().text();
    }

    function pad_array(bytes, n)
    {
      if (n==0) // remove padding
      {
        var res = bytes.slice(0);
        while (res.length>1 && res[0]==0)
          res.shift();
        return res;
      }

      // align to n bytes
      var len = bytes.length;
      var padding = Math.ceil(len/n)*n - len;
      var res = bytes.slice(0);
      for (i=0;i<padding;i++)
        res.unshift(0);
      return res;
    }

    function translate() {

        var str = $('#src').val();

        if (str.length == 0) {
          update_toolbar(null);
          $('#hint_from').text('');
          $('#hint_to').text('');
          $('#dest').val('');
          return;
        }

        text = str;

        var enc = autodetect(str);

        update_toolbar(enc);

        bytes = stringToBytes(str);

        //console.log('bytes: ', bytes)

        var type = '';
        var addVersionByte = coinjs.compressed; // for base58check

        if (bytes.length > 0) {
            var bstr = str.replace(/[ :,\n]+/g,'').trim();

            //console.log('from: ' + from);
            if (from == 'base58check') {
                try {
                    var res = parseBase58Check(bstr);
                    type = ' ver. 0x' + Crypto.util.bytesToHex([res[0]]);
                    bytes = res[1];
                    if (!addVersionByte)
                      bytes.unshift(res[0]);
                } catch (err) {};
            } else if (from == 'base58') {
                //bytes = Bitcoin.Base58.decode(bstr);
                bytes = coinjs.base58decode(bstr);
            } else if (from == 'hex') {
                bytes = Crypto.util.hexToBytes(bstr.length%2?'0'+bstr:bstr); // needs padding
            } else if (from == 'rfc1751') {
                try { bytes = english_to_key(str); } catch (err) { type = ' ' + err; bytes = []; };
            } else if (from == 'mnemonic') {
                bytes = Crypto.util.hexToBytes(mn_decode(str.trim()));
            } else if (from == 'base64') {
                try { bytes = Crypto.util.base64ToBytes(bstr); } catch (err) {}
            } else if (from == 'rot13') {
                bytes = stringToBytes(rot13(str));
            } else if (from == 'bin') {
                bytes = fromBin(str);
            } else if (from == 'easy16') {
                bytes = fromEasy16(str);
            } else if (from == 'dec') {
                bytes = fromDec(bstr);
            }

            var ver = '';
            if (to == 'base58check') {
               var version = bytes.length <= 20 ? coinjs.pub : coinjs.priv;
               console.log('bytes.length: ' + bytes.length)
               console.log('version: ' + version)
               var buf = bytes.slice();
               console.log('buf ', buf);
               /*
               var buf = bytes.slice();
               console.log('buf ', buf);

               if (!addVersionByte) {
                version = buf.shift();
                console.log('!addVersionByte', version);
                }
               var addr = new Bitcoin.Address(buf);

               console.log('addr: ', addr);
               addr.version = version;
               text = addr.toString();
               ver = ' ver. 0x' + Crypto.util.bytesToHex([addr.version]);
aedcbc765262782å
               */
               if (!addVersionByte) { //coinjs.compressed == false
                version = buf[0];
                //version = buf.shift();
                
                console.log('not compressed!')

               }else {
                
                console.log('compressed!')  //error is here
                //buf.shift();
                //buf.push(0x01);
                buf.unshift(version);
              }

               //console.log('buf.unshift: ', buf.unshift(coinjs.priv));
              //text = coinjs.pubkey2address(Crypto.util.bytesToHex(bytes));

              var iya = coinjs.privkey2wif(Crypto.util.bytesToHex([buf]));
              console.log('iya: ', iya);
              var hash = Crypto.SHA256(Crypto.SHA256(buf, {asBytes: true}), {asBytes: true});
              var checksum = hash.slice(0, 4);

              console.log('buf last: ', buf);

              text = coinjs.base58encode(buf.concat(checksum));
              console.log('text: ', text);
              //text = coinjs.base58encode(buf);


              ver = ' ver. 0x' + Crypto.util.bytesToHex([version]);
              /*
               var hash = Crypto.SHA256(buf, {asBytes: true});
               //Crypto.util.bytesToHex(Crypto.SHA256(hash, {asBytes: true}))
               var r = Crypto.util.bytesToHex(Crypto.SHA256(hash, {asBytes: true}));
               */


            } else if (to == 'base58') {
                text = coinjs.base58encode(bytes);
            } else if (to == 'hex') {
                text = Crypto.util.bytesToHex(bytes);
            } else if (to == 'text') {
                text = bytesToString(bytes);
            } else if (to == 'rfc1751') {
                text = key_to_english(pad_array(bytes,8));
            } else if (to == 'mnemonic') {
                text = mn_encode(Crypto.util.bytesToHex(pad_array(bytes,4)));
            } else if (to == 'base64') {
                text = Crypto.util.bytesToBase64(bytes);
            } else if (to == 'rot13') {
                text = rot13(bytesToString(bytes));
            } else if (to == 'bin') {
                text = toBin(bytes);
            } else if (to == 'easy16') {
                text = toEasy16(pad_array(bytes,32));
            } else if (to == 'dec') {
                text = toDec(bytes);
            }
        }

        $('#hint_from').text(enct(from) + type + ' (' + bytes.length + ' byte' + (bytes.length == 1 ? ')' : 's)'));
        $('#hint_to').text(enct(to) + ver + ' (' + text.length + ' character' + (text.length == 1 ? ')' : 's)'));
        $('#dest').val(text);
    }

    function onChangeFrom() {
        clearTimeout(timeout);
        timeout = setTimeout(translate, TIMEOUT);
    }

    function onInput(id, func) {
        $(id).bind("input keyup keydown keypress change blur", function() {
            if ($(this).val() != jQuery.data(this, "lastvalue")) {
                func();
            }
            jQuery.data(this, "lastvalue", $(this).val());
        });
        $(id).bind("focus", function() {
           jQuery.data(this, "lastvalue", $(this).val());
        });
    }

	


  // converter

        onInput('#src', onChangeFrom);

        $('#enc_from label input').on('change', update_enc_from );
        $('#enc_to label input').on('change', update_enc_to );
        $('#enc_to label:first-child').addClass('active');



});


