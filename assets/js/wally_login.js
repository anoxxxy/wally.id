(function () {

  var login_wizard = window.login_wizard = function () { };

  //***Keep user data
  login_wizard.profile_data = {};

  /*  vars */
  login_wizard.openWalletType ='';  //variable to define what type of login wallet type is choosen
  
  login_wizard.openBtnNextStepPanel = ''; //keep track of login wallet "internal wizard steps for panel"
  login_wizard.panelStepNames = ["regular_wallet", "multisig_wallet", "privatekey_wallet", "import_wallet", "mnemonic_wallet", "hdmaster_wallet", "terms"];

  login_wizard.wallet_credentials = "";

  //***Error message handling!
  login_wizard.error = true;
  login_wizard.errorMessage = '';

  login_wizard.clientWallets = {
    0: {
      "client": "Bitcoin Core",
      "slug": "bitcoin_core",
      "path": "m/0'/0'",
      "supports": {
        "passphrase": false,
        "login": {
          "mnemonic": false,
          "masterkey": true,
        },
      },
      "derivationProtocol": "hdkey",
      "address": {
        "semantics": "",
        "hardened": true,
        "receive": "m/0'/0'",
        "change": "m/0'/1'",
      }
    },
    1: {
      "client": "Blockchain.info",
      "slug": "blockchain_info",
      "path": "m/44'/0'/0'",
      "supports": {
        "passphrase": true,
        "login": {
          "mnemonic": true,
          "masterkey": true,
        },
      },
      "derivationProtocol": "bip44",
      "address": {
        "semantics": "",
        "hardened": false,
        "receive": "m/44'/0'/0'",
        "change": "m/44'/0'/1'",
      }
    },
    5: {
      "client": "Coinb.in",
      "slug": "coinb_in",
      "path": "m",
      "supports": {
        "passphrase": true,
        "login": {
          "mnemonic": true,
          "masterkey": true,
        },
      },
      "derivationProtocol": "hdkey",
      "address": {
        "semantics": "",
        "hardened": false,
        "receive": "m/0",
        "change": "m/1",
      }
    },
    3: {
      "client": "Coinomi, Ledger",
      "slug": "coinomi_ledger",
      //"path": "m/44'/0'/0'",
      "path": "m/44'/{coin}'/0'",
      "supports": {
        "passphrase": true,
        "login": {
          "mnemonic": true,
          "masterkey": true,
        },
      },
      "derivationProtocol": "bip44",
      "address": {
        "semantics": "",
        "hardened": false,
        //"receive": "m/44'/0'/0'",
        //"change": "m/44'/0'/1'",
        "receive": "m/44'/{coin}'/0'",
        "change": "m/44'/{coin}'/1'",
      }
    },
    4: {
      "client": "Electrum",
      "slug": "electrum",
      "path": "m/0'/0",
      "childPath": "m/0",
      "supports": {
        "passphrase": true,
        "login": {
          "mnemonic": true,
          "masterkey": true,
        },
      },
      "passphrase": "lowercase",
      "wordCount": 12,
      "derivationProtocol": "bip84",
      "address": {
        "semantics": "p2wpkh",
        "hardened": false,
        "receive": "m/0",
        "change": "m/1",
      }
    },
    7: {
      "client": "Electrum (Old)",
      "slug": "electrum_old",
      "path": "m/0",
      "childPath": "m/0",
      "supports": {
        "passphrase": true,
        "login": {
          "mnemonic": true,
          "masterkey": true,
        },
      },
      "passphrase": "lowercase",
      "wordCount": 12,
      "derivationProtocol": "hdkey",
      "address": {
        "semantics": "p2pkh",
        "hardened": false,
        "receive": "m/0",
        "change": "m/1",
      }
    },
    2: {
      "client": "Multibit HD",
      "slug": "multibit_hd",
      "path": "m/0'/0",
      "supports": {
        "passphrase": true,
        "login": {
          "mnemonic": true,
          "masterkey": true,
        },
      },
      "derivationProtocol": "hdkey",
      "address": {
        "semantics": "",
        "hardened": false,
        "receive": "m/0'/0",
        "change": "m/0'/1",
      }
    },
    6: {
      "client": "Trezor",
      "slug": "trezor",
      "path": "m/44'/0'/0'",
      "supports": {
        "passphrase": true,
        "login": {
          "mnemonic": true,
          "masterkey": true,
        },
      },
      "derivationProtocol": "bip44",
      "address": {
        "semantics": "",
        "hardened": false,
        "receive": "m/44'/0'/0'",
        "change": "m/44'/0'/1'",
      }
    }
  };


  


  //***Validate Wallet login fields
  login_wizard.validateLogin = async function (loginType, walletType, signatures) {
    console.log('===============validateLogin===============', loginType, walletType, signatures );

    try {
      login_wizard.profile_data = {};
      if (walletType === 'regular' || walletType === 'multisig') {
        console.log('login_wizard.validateLogin regular_wallet or multisig_wallet: ', login_wizard.profile_data);

        //error variables
        var confirmedPassError = 0;
        var confirmedEmailError = 0;
        var passwordHasError = 0;
        //***Get input fields

        //get passwords
        var loginPass = [];
        var loginPassEl = document.getElementsByName("openPass");
        for(var i = 0; i < loginPassEl.length; i++) {
          loginPass.push((loginPassEl[i].value).trim());
        }

        console.log('loginPass: ', loginPass);
        console.log('loginPass: ', loginPass[0]);

        //get confirmed passwords 
        var loginPassConfirm = [];
        var loginPassConfirmEl = document.getElementsByName("openPass-confirm");
        for(var i = 0; i < loginPassConfirmEl.length; i++) {
          loginPassConfirm.push((loginPassConfirmEl[i].value).trim());
        }
        console.log('loginPassConfirm: ', loginPassConfirm);
        console.log('loginPassConfirm: ', loginPassConfirm[0]);

        //get email and confirmed email
        var loginEmailEl = $("#openEmail");
        var loginEmail = loginEmailEl.val().toLowerCase().trim();
        var loginEmailConfirmEl = $("#openEmail-confirm");
        var loginEmailConfirm = loginEmailConfirmEl.val().toLowerCase().trim();

        

        //***Validate the input fields
        if(!wally_fn.validateEmail(loginEmail)) {
          login_wizard.errorMessage += '<p>&#8226; Email is not valid!</p>';
          $(loginEmailEl).removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
        }else
          $(loginEmailEl).removeClass('is-invalid').addClass('is-valid').removeClass('animate__shakeX');


        console.log('loginEmail: ', loginEmail);
        console.log('loginEmailConfirm: ', loginEmailConfirm);

        if(!wally_fn.validatePassword(loginPass[0])) {
          
          
          passwordHasError = 1;
          $(loginPassEl[0]).removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
        }else
          $(loginPassEl[0]).removeClass('is-invalid').addClass('is-valid').removeClass('animate__shakeX');

          //***Confirm Fields?
        var confirmFields = $("#confirmPass");
        var confirmFieldsIsChecked = confirmFields.is(":checked");
        //check if confirm-field is not available, if hidden skip the below step
        //if true, match the confirmed fields!
        if(!confirmFields.hasClass('hidden')) {
          console.log('confirmFieldsIsChecked: ' + confirmFieldsIsChecked);
        }

        //check if Confirmation (email and password) is needed for regular login
        if(confirmFieldsIsChecked){

          
          if(!wally_fn.validateEmail(loginEmailConfirm)) {
            login_wizard.errorMessage += '<p>&#8226; Confirmed Email is not valid!</p>';
            confirmedEmailError = 1;
            //$(loginEmailConfirmEl).removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
          }

          if(loginEmail != loginEmailConfirm) {
            login_wizard.errorMessage += '<p>&#8226; Email and Confirmed Email is not the same!</p>';          
            confirmedEmailError = 1;
          }

          if(confirmedEmailError)
            $(loginEmailConfirmEl).removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
          else
            $(loginEmailConfirmEl).removeClass('is-invalid').addClass('is-valid').removeClass('animate__shakeX');



          
          if(!wally_fn.validatePassword(loginPassConfirm[0])) {
            login_wizard.errorMessage += '<p>&#8226; Confirmed Password is not valid!</p>';
            //$(loginPassConfirmEl[0]).removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
            confirmedPassError=1;
          }

          //compare password and confirmed password
          if(loginPass[0] != loginPassConfirm[0]) {
            login_wizard.errorMessage += '<p>&#8226; "Password" and "Confirmed Password" is not the same!</p>';
            confirmedPassError=1;
            //$(loginPassConfirmEl[0]).removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
          }

          if(confirmedPassError)
            $(loginPassConfirmEl[0]).removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
          else
            $(loginPassConfirmEl[0]).removeClass('is-invalid').addClass('is-valid').removeClass('animate__shakeX');

        }

        //validate multisig wallet
        if(walletType == 'multisig') {
          
          //Password1 & Password2 should not be the same!
          if(loginPass[0] == loginPass[1]) {
            login_wizard.errorMessage += '<p>&#8226; You must use different passwords!</p>';
            $(loginPassEl[1]).removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
          }else
            $(loginPassEl[1]).removeClass('is-invalid').addClass('is-valid').removeClass('animate__shakeX');


          if(!wally_fn.validatePassword(loginPass[1])) {
            passwordHasError = 1;
            $(loginPassEl[1]).removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
          }else
            $(loginPassEl[1]).removeClass('is-invalid').addClass('is-valid').removeClass('animate__shakeX');
          
          

          //check if Confirmation fields (email and password) is needed for multisig login
          if(confirmFieldsIsChecked){
            
            if(!wally_fn.validatePassword(loginPassConfirm[1])) {
              login_wizard.errorMessage += '<p>&#8226; Confirmed Password2 is not valid!</p>';
              confirmedPassError=1;
            }
            if(loginPass[1] != loginPassConfirm[1]) {
              login_wizard.errorMessage += '<p>&#8226; "Password2" and "Confirmed Password2" is not the same!</p>';
              confirmedPassError=1;

            }
            if(confirmedPassError)
              $(loginPassConfirmEl[1]).removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
            else
              $(loginPassConfirmEl[1]).removeClass('is-invalid').addClass('is-valid').removeClass('animate__shakeX');
          }else{
            $(loginPassConfirmEl[1]).removeClass('is-invalid').addClass('is-valid').removeClass('animate__shakeX');
            console.log('pass 2 is valid');
          }

          profile_data.signatures = 2;  //this is a multisig account!
          profile_data.wallet_type = "multisig";  //this is a multisig account! we might remove this field later on since we can detect the signatures from variable above!

        }

        
        //show only password validation error once for all fields
        if(passwordHasError)
          login_wizard.errorMessage += '<p class="mt-2">&#8226; Password must be between 16-255 chars and must include minimum:<br>1 number <br>1 uppercase letter <br>1 lowercase letter <br>1 special character from \"!#$€%&\'()*+,-./:;<=>?@[\]^_`{|}~¤¨½§ </p>';


        //***Errror occured!
        if(login_wizard.errorMessage)
          throw(login_wizard.errorMessage);


        //***No Errors! Proceed Login - with private key generation!
        console.log('**No Errors! Proceed Login - with private key generation!');
        //prepare values for profile data
        //login_wizard.profile_data.choosen = {"coin": "coin_name", "address" : "coin_address"};  //choosen coin to handle
        
        login_wizard.profile_data.login_type = loginType;
        login_wizard.profile_data.wallet_type = walletType;

        /*login_wizard.profile_data.pubkey_sorted = false;
        login_wizard.profile_data.private_keys = [];
        login_wizard.profile_data.public_keys = [];
        login_wizard.profile_data.address = [];
        */
        
        
        
        //prepare values for profile data
        login_wizard.profile_data.login_type = loginType;
        login_wizard.profile_data.coin = {};
        login_wizard.profile_data.coin.name = coinjs.asset.name;
        login_wizard.profile_data.coin.slug = coinjs.asset.slug;
        login_wizard.profile_data.coin.symbol = coinjs.asset.symbol;
        login_wizard.profile_data.coin.chainModel = coinjs.asset.chainModel;
        login_wizard.profile_data.coin.network = coinjs.asset.network;
        

        
        //password regular/multisig
        login_wizard.profile_data.password = {};
        login_wizard.profile_data.password.email = loginEmail;
        login_wizard.profile_data.password.passwords = loginPass.filter(n => n);  //remove empty passwords from the stack
        login_wizard.profile_data.password.signatures = signatures;
          
        login_wizard.profile_data.password.keys = {};
        login_wizard.profile_data.password.keys.hex_key = [];


        //hide and empty error box and message
        $("#walletLoginStatusBox .walletLoginStatusMessage").text('').fadeOut();
        $('#walletLoginStatusBox').velocity('fadeOut').addClass('hidden');
        

        

        //***Save wallet credentials so user can download it
        var hexKey = '';
        //login_wizard.wallet_credentials = 'email: '+loginEmail+'\n';
        for(var i = 0; i < (login_wizard.profile_data.password.passwords).length; i++) {
          login_wizard.wallet_credentials += 'password '+(i+1)+': '+login_wizard.profile_data.password.passwords[i]+'\n';
          
          //**Check if HEX-privkey is within range?
          //if(!wally_fn.isHexKeyInRange('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141')) //<<-- throws error since it is out of range!
          if(!wally_fn.isHexKeyInRange(wally_fn.passwordHasher(loginEmail, login_wizard.profile_data.password.passwords[i])))
            throw ('Error in generating ' + coinjs.asset.name+ ' address!');
            
          (login_wizard.profile_data.password.keys.hex_key).push(wally_fn.passwordHasher(loginEmail, login_wizard.profile_data.password.passwords[i]));

          hexKey += 'hex '+(i+1)+': '+login_wizard.profile_data.password.keys.hex_key[i]+'\n'
          

        }
        //login_wizard.wallet_credentials += hexKey.trim();

        //generate all wallet addresses, pass over the HEX key!
        login_wizard.profile_data.generated = {}; //holds all addresses, inclusive mulitisig addresses
        login_wizard.profile_data.generated = await wally_fn.generateAllWalletAddresses(login_wizard.profile_data.password.keys.hex_key);


      } else if (walletType === 'mnemonic_wallet') {
        console.log('login_wizard.validateLogin mnemonic_wallet: ', login_wizard.profile_data);

        //generate xprv/xpub from seed
        coinjs.compressed = true;
        var success = false;
        var s  = $("#openSeed").val().trim(); //seed
        

        var clientWalletProtocolIndex = $('#openClientWallet').val();
          
        console.log('clientWalletProtocolIndex: ', clientWalletProtocolIndex);
        if (clientWalletProtocolIndex == 4 || clientWalletProtocolIndex == 7) {  //isElectrumProtocol
          bip39.setProtocol('electrum');
          console.log('setProtocol electrum');
        } else {
          bip39.setProtocol('mnemonic');
          console.log('setProtocol bip39');
        }


        //validate bip39 mnemonic
        if(bip39.validate(s))
          success = true;
        else {
          success = false;
          console.log('error in validating bip seed');
        }

        //return if seed words doesnt equal 12 words!
        var clientWordCount = login_wizard.clientWallets[clientWalletProtocolIndex]?.wordCount;
        if (clientWordCount) {
          if (wally_fn.wordCount(s) !== login_wizard.clientWallets[clientWalletProtocolIndex]?.wordCount)
          success = false;  
        }
        console.log('wally_fn.wordCount(s): ', wally_fn.wordCount(s))
        //console.log('login_wizard.clientWallets[clientWalletProtocolIndex]?.wordCount ', login_wizard.clientWallets[clientWalletProtocolIndex]?.wordCount)
        
        if (!success) {
          login_wizard.errorMessage += '<p>&#8226; Wrong Seed, please try again!!</p>';
          $('#openSeed').addClass('border-danger');
          //***Errror occured!
          throw(login_wizard.errorMessage);
        }
        
        var p  = ($("#newOpenSeedBrainwalletCheck").is(":checked")) ? coinbinf.openSeedPassword.val() : null; //user bip passphrase

        //if client wallet doesnt support passphrase, null it
        if (!login_wizard.clientWallets[clientWalletProtocolIndex].supports.passphrase)
          p = null;

        //***No Errors! Proceed Login - with key/address derivation!
        console.log('**No Errors! Proceed Login - with private key generation!');

        //some wallet client uses lowercase passphrases
        if (p !== null){
          if (login_wizard.clientWallets[clientWalletProtocolIndex]?.passphrase === 'lowercase')
            p = p.toLowerCase(); //som clients like electrum uses lower-case for passphrases
  
        }
        
        console.log('Client Wallet: ', login_wizard.clientWallets[clientWalletProtocolIndex].client);
        

        //prepare values for profile data
        login_wizard.profile_data.login_type = loginType;
        login_wizard.profile_data.wallet_type = walletType;
        login_wizard.profile_data.coin = {};
        login_wizard.profile_data.coin.name = coinjs.asset.name;
        login_wizard.profile_data.coin.slug = coinjs.asset.slug;
        login_wizard.profile_data.coin.symbol = coinjs.asset.symbol;
        login_wizard.profile_data.coin.chainModel = coinjs.asset.chainModel;
        login_wizard.profile_data.coin.network = coinjs.asset.network;
        

        login_wizard.profile_data.generated = {}; //holds all addresses, inclusive mulitisig addresses
        
        //mnemonic seed
        login_wizard.profile_data.seed = {};
        login_wizard.profile_data.seed.mnemonic = s;
        login_wizard.profile_data.seed.passphrase = p;
        
        var clientProtocol = {
          'name': login_wizard.clientWallets[clientWalletProtocolIndex].slug,
          'index': clientWalletProtocolIndex,
          'bip': login_wizard.clientWallets[clientWalletProtocolIndex].derivationProtocol
        };

        login_wizard.profile_data.seed.protocol = clientProtocol;
        login_wizard.profile_data.seed.path = '';

        
        //if selected asset has no support for the client wallet / bip protocol, set bitcoin as default coin
        var protocol = login_wizard.profile_data.seed.protocol.bip;

        //hdkey, bip32, bip44 has same address master keys
        protocol = (protocol === "bip32" || protocol === "bip44") ? "hdkey" : protocol;

        //coin doesnt support bip type, set bitcoin as default coin before proceeding!
        if (!wally_fn.networks[ coinjs.asset.network ][coinjs.asset.slug][protocol]) {
           await wally_kit.setNetwork();
        }




        //init master key generation of keys for mnemonic and first gapLimit addresses
        await wally_fn.generateWalletMnemonicAddresses(p, s, clientProtocol);



        /*
        //generate mnemonic derivation for each coin/asset
        login_wizard.profile_data.seed.keys = await wally_fn.getMasterKeyFromMnemonic(p, s, protocol, clientWalletProtocolIndex);
        //login_wizard.profile_data.seed.addresses
        var seed_addresses = await wally_fn.getMasterKeyAddresses(login_wizard.profile_data.seed.keys.privkey, clientWalletProtocolIndex);
        
        //extract only privkey,pubkey and address from derived data
        var receiveAddresses = wally_fn.derivedToCompressed(seed_addresses.receive);
        var changeAddresses = wally_fn.derivedToCompressed(seed_addresses.change);
        
        console.log('seed_addresses: ', seed_addresses);
        login_wizard.profile_data.seed.path = seed_addresses.path;

        console.log('receiveAddresses: ', receiveAddresses);
        console.log('changeAddresses: ', changeAddresses);
        console.log('wally_fn.coinChainIs(): ', wally_fn.coinChainIs());
        var coinGenerated = {
          'name': coinjs.asset.name,
          'chainModel': coinjs.asset.chainModel,
          'symbol': coinjs.asset.symbol,
          'seed': {
            'keys': login_wizard.profile_data.seed.keys,
            'protocol': protocol,
            'protocolIndex': clientWalletProtocolIndex,
            'path': seed_addresses.path,
          },
          0: {
            'address': receiveAddresses[0].address,
            'addresses_supported': {
              'compressed': {
                'address': receiveAddresses[0].address,
                'key': ((wally_fn.coinChainIs() == 'utxo') ? receiveAddresses[0].wif: receiveAddresses[0].privkey),
                'wif': ((wally_fn.coinChainIs() == 'utxo') ? receiveAddresses[0].wif: ''),
                'hexkey': ((wally_fn.coinChainIs() == 'utxo') ? receiveAddresses[0].privkey : (receiveAddresses[0].privkey).slice(2)),
                'public_key': receiveAddresses[0].pubkey,
              },
            },
          },
        };

        login_wizard.profile_data.generated = {};
        login_wizard.profile_data.generated[coinjs.asset.slug] = coinGenerated;
        login_wizard.profile_data.generated[coinjs.asset.slug].addresses = {'receive': receiveAddresses, 'change': changeAddresses};
        */
        


        //generate receiver and change addresses relative to the choosen protocol
        //login_wizard.profile_data.generated = await wally_fn.generateAddressesFromMasterKey(login_wizard.profile_data.seed.keys.privkey, protocol);

/*
profile_data:
        {
  "login_type": "mnemonic",
  "coin": {
    "name": "Bitcoin",
    "slug": "bitcoin",
    "symbol": "BTC",
    "chainModel": "utxo",
    "network": "mainnet"
  },
  "seed": {
    "mnemonic": "toss install grocery peasant crane melt ranch raise afraid meat pave gown",
    "passphrase": null,
    "protocol": "electrum",
    "path": "",
    "keys": {
      "privkey": "zprvAZxQ7JpbFGnPtkXNn3dpYSd7LEX5ECKeDgAdxhNyfwJonxZFqoBjCbh3hMkE7xuDe2ReCixmjjJEGWo3zpLcSpz3c643217xSzvtaaeNyDe",
      "pubkey": "zpub6nwkWpMV5eLh7Ebqt5ApuaZqtGMZdf3Vau6Em5nbEGqnfktQPLVykQ1XYb8Z8Q8r8C2YgJaqWEhWnQpo6brYJAJSK3gGbt6bxkuEewydp2r"
    }
  },
  "remember": false,
  "api": {
    "coingecko": 0,
    "coinmarketcap": 0,
    "assets": {}
  }
}
*/

      }
      
      $('#walletLoginStatusBox').addClass('hidden');
      $('#openSeed').removeClass('border-danger');

      //empty default error message content
      login_wizard.errorMessage ='';

      //set remember me in profile_data to default false
      login_wizard.profile_data.remember = false;

      /* Keep Track of API request timestamps*/
      login_wizard.profile_data.api = {
        coingecko: 0, // Initialize to 0 for Coingecko
        coinmarketcap: 0, // Initialize to 0 for Coinmarketcap
        assets: {}, // To store individual asset timestamps
      };
      
      //generate a wallet backup for downloading
      login_wizard.generateWalletBackup();




      //login_wizard.wallet_credentials = (login_wizard.wallet_credentials).slice(0, -2); //remove last newline



      //h = h.padStart(64, '0');
/*
last hexkey in address: fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140 

27688699d95b14058c1823401c5f6cd9c437af25be9de10aed323ee3499a4a02
75a9a7a84e5828793ff8ec8e492865e90072de55799be71b6082e8c5bea130f

hex key should not be higher then that!
*/
      console.log('profile_data: ', login_wizard.profile_data);
      //openUserWallet(profile_data); //checkUserLogin

      //***Set next step to terms and navigate to it
      
      login_wizard.openBtnNextStepPanel = 'terms';  //this makes it -> //setActivePanel('terms');, the function is unreachable from here, thus the workaround
      $('#openBtnNext').click();

      //hide next button
      $('#openBtnNext').addClass('hidden');

      //show open wallet button
      $('#openBtn').removeClass('hidden');

      //now we need to open an account with all addresses related to the specific hex key!
      //iceeeeeeeeeee
      
      return ;

    } catch (err) {
      console.log('LOGIN.ERROR Catch: ', err);
      //show Next button
      //$('#openBtnNext').addClass('hidden');

      login_wizard.openBtnNextStepPanel = ''; //error, validate fields again on login next button click
      login_wizard.errorMessage = err;
      //$('#walletLoginValidationInfo').removeClass('animate__fadeInDown').addClass('animate__fadeOutUp').fadeOut();
      login_wizard.animateElementVelocity('#walletLoginValidationInfo', false);



      $('#walletLoginStatusBox').velocity('fadeIn').removeClass('hidden');
      $("#walletLoginStatusBox .walletLoginStatusMessage").html(login_wizard.errorMessage).prepend('<i class="bi bi-exclamation-triangle-fill"></i> Dude, we got some errors...<br>').fadeIn();

    }
    login_wizard.errorMessage = ''; //we need to empty the error message after it is shown!


    /*
// Wait Example 
    wait(function(runNext){
        log('Furst animation started');
        
        $('#div1').animate({
            top: 30
        }, 1000, function(){
            runNext(1,2); //some arguments
        });
        
    }).wait(function(runNext, a, b){
        log('Second animation started, a='+a+' b='+b ); //arguments from previous chunk call
        
        $('#div2').animate({
            top: 50
        }, 1000, runNext);
        
    }).wait(function(runNext){
        log('Wait 2 seconds');
        
        setTimeout(function(){
            log('2 seconts is passed')
            runNext();
        }, 1000);
        
    }).wait(function(runNext){
        log('Third animation started');
        
        $('#div3').animate({
            left: 50
        }, 1000, runNext);
        
    }).wait(function(runNext){
        log('Last animation');
        
        $('#div1').animate({
            top: 0,
            left: 45
        }, 1000, runNext);
        
    }).wait(function(){
        log('The end');
        
    });
    */

}

/*
 @ Generate an object for Wallet Backup
*/
login_wizard.generateWalletBackup = function() {
  console.log('===login_wizard.generateWalletBackup===', login_wizard.profile_data);

  var tmp = login_wizard.profile_data;
  var walletBackup = {};
  //walletBackup.assets = {};
  //walletBackup.hex_key = tmp.hex_key;

  if (tmp.login_type === 'password') {
    walletBackup.email = tmp.password.email;
    walletBackup.passwords = tmp.password.passwords;  
  }

  if (tmp.login_type === 'mnemonic') {
    console.log('login_type: mnemonic', tmp);
    walletBackup.mnemonic = tmp.seed.mnemonic;
    walletBackup.protocol = tmp.seed.protocol;
    
    if (tmp.seed.passphrase)
      walletBackup.passphrase = tmp.seed.passphrase;

    console.log('login_type: mnemonic', tmp, walletBackup);
  }


  /*
  tmp = login_wizard.profile_data.generated;

  var keys_length = (login_wizard.profile_data.hex_key).length;
  var i = 1;

  
  if (keys_length == 1)
    walletBackup.assets = tmp;
  else if (keys_length > 1) { //remove regular addresses for multisig wallet accounts
    //loop through the assets

    for (var asset in tmp) {
      //console.log('asset: ' + asset);
      //console.log('tmp[asset]: ' , tmp[asset]);
        walletBackup.assets[asset] = {};
        for (var [key, value] of Object.entries(tmp[asset])) {

          if (key != 'multisig') {  //get the private keys of each regular address
            //console.log('key: '+key);
            //console.log('value: ', value);


            
            if (value.privateKey) //for EVM coins (Ethereum)
              walletBackup.assets[asset]['private_key_'+i] = value.privateKey;
            else  //for UTXO coins
              walletBackup.assets[asset]['private_key_'+i] = value.addresses_supported.compressed.key;
            
            //if (Object.keys(value.addresses_supported) === 1) 
            //if (value.addresses_supported.compressed.key !== undefined) //for UTXO coins
            //  walletBackup.assets[asset]['private_key_'+i] = value.addresses_supported.compressed.key;
            //else  //for EVM coins (Ethereum)
            //  walletBackup.assets[asset]['private_key_'+i] = value.privateKey;
            
          } else
            walletBackup.assets[asset][key] = value;
          i++;
        }
        i=1;  //reset key to 1, since we can have multiple (for i.e 1,2,3) ..private keys of each asset
    }
    
  }
  */
  console.log('walletBackup: ', walletBackup);

  return walletBackup;

}



/**
 *
 * @ Coin address rendering upon login, 
 * params: object modal, addr object with 'chainModel' and 'addresses' (compressed and uncompressed addresses)
 *  
 **/
login_wizard.initCoinList = function(coinListModal, addrObj) {
  //addresses tab when logged in
  //wally_kit.walletRenderAddresses(addrObj);

  //for modal UI
  coinListModal.getModalBody().find('.initCoinList').html(`<li class="list-group-item"><img src="${coinjs.asset.icon}" class="coin-icon icon32"> Generating <span class="text-muted font-weight-bold">${coinjs.asset.name}</span> address</li>`);


}


//***START Login/OpenWallet
  /*
  @Check/Handle account Login (is user auth?)
  */
  login_wizard.openUserWallet = async function() {
    console.log('===login_wizard.openUserWallet===');
    //check if we have data in localstorage
    userData = storage_s.get('wally.profile');

    //***If the userData is empty: exit-> login error! !
    if(userData === null || userData === undefined || Object.keys(userData).length === 0) {
      return ;
    }
    
    //user is auth, proceed!

    //update global variable for user data
    login_wizard.profile_data = userData;


    wally_kit.ApiCallTimestamp = {
      coingecko: 0, // Initialize to 0 for Coingecko
      coinmarketcap: 0, // Initialize to 0 for Coinmarketcap
      assets: {}, // To store individual asset timestamps
    };

    //fetch coininfo from Coingecko
    //await wally_kit.getCoinInfo();

    //todo: render dom with coininfo
    //this is done in router settings
    //

    //generate a list of user assets
    wally_kit.walletRenderAssets();
    wally_kit.walletRenderSeedAddresses();

    $('#openBtn').click();
    return ;

    var privkeyaes, privkeyaes2;

    //login_type = ["password", "privatekey_wallet", "import_wallet", "mnemonic_wallet", "hdmaster_wallet", "terms"];
    //wallet_type = ["regular", "multisig"]
    //***Handle login with importing backup wallet
    if (userData.login_type == 'import_wallet') {
      console.log('Login by Importing wallet backup');
    }

    //***Handle login with Private Key wallet
    if (userData.login_type == 'privatekey_wallet') {
      console.log('Login with Private Key');
    }

    //***Handle login with Mnemonic Wallet
    if (userData.login_type == 'mnemonic_wallet') {
      console.log('Login with Mnemonic Seed');
    }
    //***Handle login with BIP32/HDMaster Key
    if (userData.login_type == 'hdmaster_wallet') {
      console.log('Login with BIP32/HDMaster Key');
    }

    //***Handle login with "email + password" wallet
    if (userData.login_type == 'password') {

      console.log('Login with Email+Password');

      /*
      


      profile_data.private_keys = [];
      profile_data.public_keys = [];

      //generate first private key
      coinjs.compressed = true;
      var s = wally_fn.passwordHasher(userData.email, userData.passwords[0]);
      var keys = coinjs.newKeys(s);

      //check if generated Regular pubkey is valid
      if (!coinjs.pubkeydecompress(keys.pubkey)) {
        $(".walletLoginStatus").html("Error while creating Regular wallet address").removeClass("hidden").fadeOut().fadeIn();
        return;
      }

      profile_data.public_keys.push(keys.pubkey);
      profile_data.private_keys.push(keys.wif);
      */

      //we got a regular wallet address, save key-data to backup-fields
      if (userData.wallet_type == "regular") {
        /*
        profile_data.address = keys.address; //wif, pubkey, address
        var privkeyaes = CryptoJS.AES.encrypt(keys.wif, s);
        */
      }


      //is wallet multisig?
      if (userData.wallet_type == "multisig") {

        /*
        //create Multisig address
        var s2 = wally_fn.passwordHasher(userData.email, userData.passwords[1]);
        var keys2 = coinjs.newKeys(s2);
        var keys_combined = [keys.pubkey, keys2.pubkey];

        //check if generated Multisig pubkeys is valid
        if (!coinjs.pubkeydecompress(keys.pubkey) && !coinjs.pubkeydecompress(keys2.pubkey)) {
          $(".walletLoginStatus").html("Error while creating Multisig wallet address").removeClass("hidden").fadeOut().fadeIn();
          return;
        }
        profile_data.public_keys.push(keys2.pubkey);
        profile_data.private_keys.push(keys2.wif);

        var multisig = coinjs.pubkeys2MultisigAddress(keys_combined, 2); //create 2-of-2 multisig wallet
        profile_data.address = multisig["address"]; //[address, scriptHash, redeemScript]

        privkeyaes = CryptoJS.AES.encrypt(keys.wif, s);
        //console.log('keys.wif: ', keys.wif);
        //console.log('s: ', s);
        privkeyaes2 = CryptoJS.AES.encrypt(keys2.wif, s2);
        //console.log('keys2.wif: ', keys.wif);
        //console.log('s2: ', s2);

        //save key-data to backup-fields
        profile_data.redeem_script = multisig["redeemScript"];
        */

      }
    }


    //***Validation and profile settings done,
    //All good! Go on! 
    //UI Settings
    if (userData.wallet_type == "regular") {
      /*
      $('.walletPubKeys .redeemScript_wallet').parent().addClass('hidden');
      $('.wallet_multisig_keys').addClass('hidden');
      $('#walletKeys .privkey2').addClass('hidden');
      $('.walletPubKeys .pubkey2').parent().addClass('hidden');
      $("#walletKeys .privkeyaes2").addClass('hidden');
      */
    }

    /*
    $("#walletKeys .privkey").val(profile_data.private_keys[0]);
    $(".walletPubKeys .pubkey").val(profile_data.public_keys[0]);
    $("#walletKeys .privkeyaes").val(privkeyaes);
    */

    //is wallet multisig?
    if (userData.wallet_type == "multisig") {
      /*
      $(".walletPubKeys .redeemScript_wallet").val(profile_data.redeem_script).parent().removeClass('hidden');;
      $('.wallet_multisig_keys').removeClass('hidden');

      $("#walletKeys .privkey2").val(profile_data.private_keys[1]).removeClass("hidden");
      $(".walletPubKeys .pubkey2").val(profile_data.public_keys[1]).parent().removeClass("hidden");
      $("#walletKeys .privkeyaes2").val(privkeyaes2).removeClass("hidden");
      $(".walletPubKeys .redeemScript_wallet").removeClass("hidden");

      $(".switch_pubkeys").removeClass("hidden");

      
      //Check if pubkey is sorted
      profile_data.pubkey_sorted = isArraySorted(profile_data.public_keys);

      
      //publickey sort notification
      //if(profile_data.login_type != "import_wallet"){
        //$('.publicKeySortNotification').removeClass('hidden')

        if(profile_data.pubkey_sorted){
          $('.publicKeyIsSorted').removeClass('hidden');
          $('.publicKeyIsUnSorted').addClass('hidden');
        }else{
          $('.publicKeyIsSorted').addClass('hidden');
          $('.publicKeyIsUnSorted').removeClass('hidden');
        }
      //}

      */
    }
    /*
    $(".amountCoinSymbol").text(coinjs.symbol);
    //$("#walletMail").html(email);
    $("#walletAddress").html(profile_data.address);
    $("#walletAddressExplorer").html(profile_data.address);
    //$("#walletAddressExplorer").attr('href','http://explorer.bitbay.market/address/'+address);
    //$("#walletHistory").attr('href','http://explorer.bitbay.market/address/'+address);
    $("#walletAddressExplorer").attr('href', 'https://chainz.cryptoid.info/bay/address.dws?' + profile_data.address + '.htm');
    $("#walletHistory").attr('href', 'https://chainz.cryptoid.info/bay/address.dws?' + profile_data.address + '.htm');


    $("#walletQrCode").html("");
    var qrcode = new QRCode("walletQrCode");
    qrcode.makeCode(wally_fn.asset+":" + profile_data.address);
    //qrcode.makeCode("bitcoin:" + profile_data.address);

    //console.log('keys: ', keys);
    $(".walletPubKeys .address").val(profile_data.address);

    //Remember me - store the userData on the Client side with HTML5 sessionStorage 
    if (userData.remember_me)
      HTML5.sessionStorage('profile_data').set(userData);
    else
      HTML5.sessionStorage('profile_data').remove();


    //Menu Account Info
    $(".walletAddress").text(profile_data.address);
    $(".walletAddress").attr("data-original-title", "Wallet Address");

    $(".walletLogin").hide();
    $("#openWallet").removeClass("hidden").show();
    $("body").addClass("loggedin").removeClass("loggedout");



    //Update user balance and set loop for updating the users balance!
    walletBalance();
    checkBalanceLoop();
    */
    console.log('End of checkUserLogin');

    return;

  }

//***END Login/OpenWallet


  //* Sleep functions
  login_wizard.sleep = function (milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  login_wizard.sleepPromise = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //sleep(2000).then(() => { console.log("World!"); });
  /*
  https://www.sitepoint.com/delay-sleep-pause-wait/
  async function delayedGreeting() {
    console.log("Hello");
    await sleep(2000);
    console.log("World!");
    await sleep(2000);
    console.log("Goodbye!");
  }
  */


login_wizard.animateElementVelocity = function (el, show) {
  
  var elementsArr = el.split(',');
  //console.log('elementsArr.length: ' + elementsArr.length);
  var slideDirection, fadeDirection;
  if(show) {
    slideDirection = 'slideDown';
    fadeDirection = 'fadeIn';

    
  }else {
    
    slideDirection = 'slideUp';
    fadeDirection = 'fadeOut';
  }
  var con;
  elementsArr.forEach(elem => {
      //console.log('elem: ' + elem);
    $(elem).velocity(slideDirection, { duration: 200 });
    //$(elem).velocity(fadeDirection, { display: "" }).velocity(slideDirection, { duration: 200 });
    //document.querySelector(elem).velocity(slideDirection, { duration: 500 });
  });
};


login_wizard.animateElement2 = function (el, show) {

  //var el = '.form-email-confirm,.form-password-confirm,.form-password2-confirm';
  var elementsArr = el.split(',');
  var inputHeight = 40;

  const tl = anime.timeline({ duration: 500, loop: false });


  if(show) {
    elementsArr.forEach(elem => {
      console.log('elem: ' + elem);
        tl.add({
        targets: elem,
        opacity: 1,
        scale: 1,
        height: inputHeight+'px',
        transition: 'linear',
        duration: 200, // duration of the animation step in ms
        changeBegin: function(e) {
          document.querySelector(elem).style.visibility = 'inherit';
        },
        changeComplete: function() {
          
        }
      });
    });
  }else {
    elementsArr.forEach(elem => {
      console.log('elem: ' + elem);

      tl.add({
        targets: elem,
        opacity: 0,
        scale: 0,
        height: 0,
        transition: 'linear',
        duration: 200, // duration of the animation step in ms
        changeComplete: function() {
          document.querySelector(elem).style.visibility = 'hidden';
        }
      });
    });
  }

 
  }




/*
 Download Backup file of wallet
 https://stackoverflow.com/questions/65050679/javascript-a-simple-way-to-save-a-text-file
*/
login_wizard.downloadFile = function (filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}


login_wizard.downloadFileBlob = function (filename, text) {
  let element = document.createElement('a');
    element.download = filename;

    //let blob = new Blob(['Hello, world!'], {type: 'text/plain'});
    let blob = new Blob([text], {type: 'text/plain'});

    element.href = URL.createObjectURL(blob);
    element.click();
    URL.revokeObjectURL(element.href);

    element.remove();
}

  //user data
  var profile_data = {};
})();


//DomReady.ready(function() {
  $(document).ready(function() {
    
    

    coinbinf.openClientWallet.on("change", openClientWalletChanged);
    function openClientWalletChanged(e) {
      console.log('===openClientWalletChanged===', e);
      var selectedOptionText = coinbinf.openClientWallet.find('option:selected').text();
      var clientIndex = coinbinf.openClientWallet.val();

      
      var selectedOption = login_wizard.clientWallets[clientIndex];
      
      //console.log(`selectedOptionText: "${selectedOptionText}"`);
      //console.log('selectedOption: ', selectedOption);

      //hide passPhrase field if wallet client doesnt support it
      if (selectedOption?.supports.passphrase){
        if (coinbinf.openClientWalletPassphrase[0].style.display == 'none' || coinbinf.openClientWalletPassphrase[0].classList.contains("hidden"))
          coinbinf.openClientWalletPassphrase.removeClass('hidden').velocity('slideDown');
      } else {
        if (coinbinf.openClientWalletPassphraseCheck.is(':checked'))  
          coinbinf.openClientWalletPassphraseCheck.click();
        coinbinf.openClientWalletPassphrase.velocity('slideUp')
      }
    }



  var loginBtn = document.getElementById('openBtn');
  
  //var loginBtnNext = document.getElementById('openBtnNext');

  //var loginBtn = document.getElementById('openBtn');
  var loginBtnNext = $('#openBtnNext');



  //FORM WIZARD START >>
// Code By Webdevtrick ( https://webdevtrick.com )

//set form wizard to step 0
var currentFormStep = document.getElementById('wallet_formwizard_current_step');
currentFormStep.value = 0;

const wizardEl = {
  stepsForm: document.getElementById('multisteps-form__panels'),
  stepsFormTextareas: document.querySelectorAll('.multisteps-form__textarea'),
  stepFormPanelClass: 'multisteps-form__panel',
  stepFormPanels: document.querySelectorAll('.multisteps-form__panel'),
  stepPrevBtnClass: 'js-btn-prev',
  stepNextBtnClass: 'js-btn-next' };


  //var stepNextAnimation = 'animate__fadeInRight';
  //var stepPrevAnimation = 'animate__fadeInLeft';
  var stepNextAnimation = 'animate__fadeInUp';
  var stepPrevAnimation = 'animate__fadeInUp';


const removeClasses = (elemSet, className) => {

  elemSet.forEach(elem => {

    elem.classList.remove(className);
    elem.classList.add('hidden');

  });

};


 
/*
 pass over name from form panels and set its number and return it
*/
const getStepNumberFromName = stepName => {


  var stepFound=-1;
  if(stepName == 'regular_wallet') {  //hide the multisig fields (multisig-group)
    stepFound=1;
  }
  if(stepName == 'multisig_wallet'){  //redirect to regular_wallet and show the multisig fields (multisig-group)
    stepFound=1;
  }
  if(stepName == 'privatekey_wallet'){
    stepFound=2;
  }
  if(stepName == 'import_wallet'){
    stepFound=3;
  }
  
  if(stepName == 'mnemonic_wallet'){
    stepFound=4;
  }
  if(stepName == 'hdmaster_wallet'){
    stepFound=5;
  }

  //save to the choosen wallet type to the variable
  if(stepFound >=0)
    login_wizard.openWalletType = stepName;

  if(stepName == 'terms'){
    stepFound=9;
  }
  

  //console.log('stepName: ' + stepName);
  //console.log('stepFound: ' + stepFound);

  
  return stepFound;

};

//which form wizard step is currently active?
const getActivePanel = () => {

  let activePanel;

  wizardEl.stepFormPanels.forEach(elem => {

    if (elem.classList.contains('js-active')) {
      activePanel = elem;
      elem.classList.remove('hidden');
    }

  });

  return activePanel;

};

const setActivePanel = (activePanelNum, setClassName='animate__fadeInUp') => {

  console.log('===============setActivePanel:'+activePanelNum+'===============');
  removeClasses(wizardEl.stepFormPanels, 'js-active');
  removeClasses(wizardEl.stepFormPanels, stepNextAnimation);
  removeClasses(wizardEl.stepFormPanels, stepPrevAnimation);

  var activePanelName;

  //get Form step from name
  if (!Number.isInteger(activePanelNum)) {
    activePanelName = activePanelNum;
    activePanelNum = getStepNumberFromName(activePanelNum);
    console.log('called getStepNumberFromName: '+ activePanelNum);
    currentFormStep.value = activePanelNum;
  }
  //return if no step is found!
  if(activePanelNum == -1)
    return;

    

  wizardEl.stepFormPanels.forEach((elem, index) => {
    
    if (index < activePanelNum){
        elem.classList.add(stepPrevAnimation);
    }else if (index > activePanelNum){
        elem.classList.add(stepNextAnimation);
    }
    if (index === activePanelNum) {

        //console.log('index: '+ index + ', activePanelNum: '+ activePanelNum);

      elem.classList.remove('hidden');
      elem.classList.add('js-active');
      
      //check if animateClassName exists, add it
      if(setClassName)
        elem.classList.add(setClassName);
      
      
      

      //setFormHeight(elem);
    }

    
    
    //http://site.com#products/param1=val1&param2&val2.....
    //Router.navigate('login?wallet_type='+activePanelName);
    window.location.hash = '#login?wallet_type='+activePanelName;

  });

      //enable Next button if step Form  is of wallet type: regular, multisig, private key, import, mnemonic, hdmaster
    if(activePanelNum==1 || activePanelNum==3 || activePanelNum==4 || activePanelNum==5 || activePanelNum==6) {
      //loginBtnNext.velocity.fadeOut();
      $(loginBtnNext).velocity('fadeOut');
      loginBtnNext.attr('disabled', false);
      //loginBtnNext.fadeIn();
      $(loginBtnNext).velocity('fadeIn');
      
      console.log('loginNext enable');

      
    }



  //show/hide multisig fields on form wizard
  /*
  if(activePanelNum == 1 && activePanelName == 'regular_wallet')
    login_wizard.animateElementVelocity('.multisig-group', false);
  if(activePanelNum == 1 && activePanelName == 'multisig_wallet')
    login_wizard.animateElementVelocity('.multisig-group', true);
  */

  //hide multisig fields when regular wallet is choosen and empty the input fields
  if(login_wizard.openWalletType == "regular_wallet"){
    login_wizard.animateElementVelocity('.multisig-group', false);
    $('.multisig-group input').val('');

  }

  if(login_wizard.openWalletType == "multisig_wallet") {
    login_wizard.animateElementVelocity('.multisig-group', true);

    login_wizard.animateElementVelocity('.form-password2', true);

    if(document.getElementById("confirmPass").checked ) {
      login_wizard.animateElementVelocity('.form-password2-confirm', true);
      //console.log('confirm-pass2: true');
    }
    else{
      login_wizard.animateElementVelocity('.form-password2-confirm', false);
      //console.log('confirm-pass2: false');
    }

  }


}

/*

const findParent = (elem, parentClass) => {

  let currentNode = elem;

  while (!currentNode.classList.contains(parentClass)) {
    currentNode = currentNode.parentNode;
  }

  return currentNode;

}

wizardEl.stepsForm.addEventListener('click', e => {

  const eventTarget = e.target;

  if (!(eventTarget.classList.contains(`${wizardEl.stepPrevBtnClass}`) || eventTarget.classList.contains(`${wizardEl.stepNextBtnClass}`)))
  {
    return;
  }

  if(eventTarget.id == 'wallet_formwizard_next' )
    return;
  if(eventTarget.id == 'wallet_formwizard_previous')
    return;

  console.log ('eventTarget: ', eventTarget);
  console.log ('classList: ', eventTarget.classList);
  const activePanel = findParent(eventTarget, `${wizardEl.stepFormPanelClass}`);

  let activePanelNum = Array.from(wizardEl.stepFormPanels).indexOf(activePanel);
  console.log('arr from: ', Array.from(wizardEl.stepFormPanels));

  var transitionType;
  if (eventTarget.classList.contains(`${wizardEl.stepPrevBtnClass}`)) {
    activePanelNum--;
    transitionType = 'animate__shakeX';
  } else {

    activePanelNum++;
    transitionType = 'animate__tada';

  }

  setActivePanel(activePanelNum, transitionType);

})
*/

/*
//changing animation
//setAnimationType('animate.css.add');
const setAnimationType = newType => {
  wizardEl.stepFormPanels.forEach(elem => {
    elem.dataset.animation = newType;
  });
};




document.getElementById('wallet_formwizard_next').addEventListener('click', e => {

    var getCurrentStep = parseInt(currentFormStep.value);
    var nextStep = getCurrentStep+1;
    

    if(nextStep >= 0 && nextStep <= 4) {
        currentFormStep.value = nextStep;

        //setActivePanel(nextStep);
        setActivePanel(nextStep, stepNextAnimation);
        console.log('Step to Next: ' + nextStep);
        console.log(stepNextAnimation);
    }else
        console.log('Error - No such step: ' + nextStep);

    return;
});

document.getElementById('wallet_formwizard_previous').addEventListener('click', e => {

    var getCurrentStep = parseInt(currentFormStep.value);
    var nextStep = getCurrentStep-1;
    

    if(nextStep >= 0 && nextStep <= 4) {
        currentFormStep.value = nextStep;

        //setActivePanel(nextStep);
        setActivePanel(nextStep, stepPrevAnimation);
        console.log('Step to Previous: ' + nextStep);
        console.log(stepPrevAnimation);
    }else
        console.log('Error - No such step:' + nextStep);

    return;
});

*/

/*
 Manual click login Option

var manualStepLoginLinks = document.querySelectorAll('a[data-formwizard-step]');

  manualStepLoginLinks.forEach(manualStepLinks => {
      manualStepLinks.addEventListener("click", function (e) {

        //e.preventDefault();

        console.log('manualStepLinks clicked: ', manualStepLinks);
        console.log('manualStepLinks hash: ', this.hash);
        console.log('manualStepLinks step: ', this.attributes['data-formwizard-step'].value);

        
        var panelStep = currentFormStep.value;

        console.log('panelStep: ' + panelStep);

        $('#modalOpenWalletType').modal('show');

      });
    });
*/


/*Form Wizard - jump from steps*/
/*
$('#openBtnSetActivePanel').on("click",function() {
  console.log('===============openBtnSetActivePanel===============');

  console.log('nextStep: ' + login_wizard.openBtnNextStepPanel);
  setActivePanel(login_wizard.openBtnNextStepPanel);
});
*/


//<< FORM WIZARD END





  /*
   @ Enable/Disable Login button 
   * enabled if 
      * wallet backup is downloaded
      * terms is accepted
   * else disabled
  */
  function loginBtnProceed() {

    var termsIsChecked = document.getElementById('openCheckAcceptTerms').checked;
    var backupDownloadIsChecked = document.getElementById('openCheckBackupDownloaded').checked;
    var backupIsAlreadySavedChecked = document.getElementById('openCheckBackupAlreadySaved').checked;
    var loginFormAccept = $('#walletLoginFormAccept');
    

    if (termsIsChecked && (backupDownloadIsChecked || backupIsAlreadySavedChecked)) {
      loginBtn.disabled = false;
      //loginBtn.insertAdjacentHTML('afterbegin', '<i class="bi bi-person-check-fill"></i> ');
      loginBtn.querySelector('span').innerHTML = '<i class="bi bi-person-check-fill"></i>';
      
      loginFormAccept.children('.alert').removeClass('alert-danger').addClass('alert-success');
    }else {
      loginFormAccept.children('.alert').removeClass('alert-success').addClass('alert-danger');
      loginBtn.disabled = true;
      //remove the icon on the button if terms and backup isnt checked
      if(loginBtn.querySelector('i'))
        loginBtn.querySelector('i').remove();
    }

    //var loginBtn = document.getElementById('openBtn').querySelector('span').innerHTML = '<i class="bi bi-person-check-fill"></i>';
  }


  /*
  //listener for: 
  // * if wallet backup is downloaded download
  // * if terms is accepted
  // @ only required for email + password login!
  */
  document.getElementById('openCheckBackupDownloaded').addEventListener('change', e => {
    loginBtnProceed();
  });
  document.getElementById('openCheckBackupAlreadySaved').addEventListener('change', e => {
    loginBtnProceed();
  });
  document.getElementById('openCheckAcceptTerms').addEventListener('change', e => {
    loginBtnProceed();
  });
  


  /*
   Download Wallet Credentials/Backup file
  */
  document.getElementById('openBtnDownloadBackup').addEventListener('click', e => {

      // Start file download.
      //login_wizard.downloadFile("wally.wallet_credentials.txt", login_wizard.wallet_credentials);
      login_wizard.downloadFile("wally.wallet_credentials.txt", JSON.stringify(login_wizard.generateWalletBackup(), null, 2));

      document.getElementById('openCheckBackupDownloaded').checked = true;
      document.getElementById('openCheckBackupAlreadySaved').checked = true;

      loginBtnProceed();

      BootstrapDialog.show({
                    title: 'Backup Wallet Credentials',
                    message: 'Great, you have a backup file of your wallet credentials now. <br>You may proceed with the login!',
                    closable: true,
                    verticalCentered:true,
                    buttons: [{
                        label: 'Great, let me in!',
                        cssClass: 'btn-sm btn-flat-primary',
                        action: function(dialogRef){
                            dialogRef.close();
                        }
                    }]
                });


  });


  //Enable/Disable confirm email/pass
  /*
  $('#confirmPass').on("change",function() {
    console.log("confirmPass changed");

    var elements = ".form-email-confirm,.form-password-confirm";
    if($(".form-password2").is(":visible") )
      elements += ",.form-password2-confirm";

    if($(this).is(":checked")) {
      $(elements).removeClass("hidden");
    }else{
      $(elements).addClass("hidden");
      $('#openEmail-confirm').val('').removeClass("unconfirmed");
      $('#openPass-confirm').val('').removeClass("unconfirmed");
      $('#openPass2-confirm').val('').removeClass("unconfirmed");
      
    }
  });
  */
  /*
  document.querySelector('#confirmPass').addEventListener("change",function() {
    console.log("confirmPass changed");
    
    var elements = ".form-email-confirm,.form-password-confirm";
    if(document.querySelector(".form-password2").is(":visible") )
      elements += ",.form-password2-confirm";

    if(document.querySelector(this).is(":checked")) {
      document.querySelector(elements).classList.remove("hidden");
    }else{
      document.querySelector(elements).classList.add("hidden");
      document.querySelector('#openEmail-confirm').val('').classList.remove("unconfirmed");
      document.querySelector('#openPass-confirm').val('').classList.remove("unconfirmed");
      document.querySelector('#openPass2-confirm').val('').classList.remove("unconfirmed");
      
    }
  });
*/

const animateCSS = (element, animation, prefix = 'animate__', keep_animation=0) =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    //const node = document.querySelector(element);
    const node = element;

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      if(keep_animation == 0)
        node.classList.remove(`${prefix}animated`, animationName);    //dont remove the animate_animated class!
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });

/*
animateCSS('.my-element', 'bounce');

// or
animateCSS('.my-element', 'bounce').then((message) => {
  // Do something after the animation
});

*/
document.getElementById("confirmPass").addEventListener('change', e => {


    //get confirm input fields for regular wallet
    var elements = ".form-email-confirm,.form-password-confirm";
    //if(document.querySelector(".form-password2").is(":visible") )

    //should we show confirm-field for multisig wallet?
    if(login_wizard.openWalletType == "multisig_wallet")
      elements += ",.form-password2-confirm";


    console.log('elements: ', elements);
    console.log('e.target.checked: ' + e.target.checked);

    //if confirm Credentials is checked, show confirm fields or else hide them!
    if(e.target.checked) {
      //document.querySelector(elements).classList.remove("hidden");

       
        //elem.classList.remove('hidden');
        login_wizard.animateElementVelocity(elements, true);
        //login_wizard.animateElement2(elements, true);
        console.log('show  confirm fields');
        

        //elem.classList.remove('hide_animate');

    }else{
      //document.querySelector(elements).classList.add("hidden");

        
        
        login_wizard.animateElementVelocity(elements, false);
        //login_wizard.animateElement2(elements, false);

        
        //elem.classList.add('hidden');
        console.log('hide confirm fields');
        

        //elem.classList.remove('show_animate');
        //elem.classList.add('hide_animate');


    }

      //reset confirmation fields when check is unchecked
      document.getElementById("openEmail-confirm").value = '';
      document.getElementById("openEmail-confirm").classList.remove('is-valid');
      document.getElementById("openEmail-confirm").classList.remove('is-invalid');
      document.getElementById("openEmail-confirm").classList.remove('animate__shakeX');


      document.getElementById("openPass-confirm").value = '';
      document.getElementById("openPass-confirm").classList.remove('is-valid');
      document.getElementById("openPass-confirm").classList.remove('is-invalid');
      document.getElementById("openPass-confirm").classList.remove('animate__shakeX');

      document.getElementById("openPass2-confirm").value = '';
      document.getElementById("openPass2-confirm").classList.remove('is-valid');
      document.getElementById("openPass2-confirm").classList.remove('is-invalid');
      document.getElementById("openPass2-confirm").classList.remove('animate__shakeX');

  });


/*
not used for the moment
icee -- remove
Open Wallet Type Modal

//select handling for buy/sell swap in modal

var swapBuyDialog = document.querySelectorAll('#modalOpenWalletType .custom-table tbody tr');

swapBuyDialog.forEach(box => {
  box.addEventListener('click', function () {
    var radioEl = this.querySelector('input[name="wallet_type_group"]');
    this.querySelector('input[name="wallet_type_group"]').checked = true;

    console.log('this.dataset: ' , this.dataset);

    console.log('choosen wallet_type:', this.dataset.walletType);
    console.log('choosen formwizard-step:', this.dataset.formwizardStep);


  });
});
*/

/*Open Wallet Type Button Anime.js */
//const toggleFolder = document.getElementById("js_toggle-folder");
const toggleFolder = $("#js_toggle-folder");

// --------- ANIMATION

const showFolderContentAnimation = anime.timeline({
  easing: "easeOutCubic",
  autoplay: false });


showFolderContentAnimation.
add({
  targets: "#js_folder-content",
  height: [0,0],
  duration: 1,
  changeBegin: function() {
    //document.querySelector('#js_folder-content').style.position = "absolute";
  }
}).

add(
{
  targets: "#js_folder-content",
  height: [0, 344],
  opacity: [0, 1],
  duration: 330/*,
  changeComplete: function() {
    document.getElementById('js_folder-content').style.height = '240px';
  }*/
}).
add(
{
  targets: "#js_folder-summary-walleticon",
  opacity: [1, 0],
  duration: 400 },

"-=350").

add(
{
  targets: "#js_folder-collapse-button",
  opacity: [0, 1],
  duration: 400 },

"-=300").

add(
{
  targets: "#js_folder-collapse-button-icon",
  duration: 300,
  translateX: ["-50%", "-50%"],
  translateY: ["-50%", "-50%"],
  rotate: ["0deg", "180deg"] },

"-=400").

add(
{
  targets: ".js_folder-item",
  translateY: [20, 0],
  opacity: [0, 1],
  duration: 80,
  delay: (el, i, l) => i * 120 },

"-=275");


// --------- TRIGGER
var toogleButton = document.querySelector('#js_folder-content');
//var toogleFolderBackdrop = document.getElementById('js_folder-backdrop');
var toogleFolderBackdrop = $('#js_folder-backdrop');


toggleFolder.on('click', function(e) {
//toggleFolder.addEventListener("click", (e) => {

  //console.log('this', toggleFolder.parentNode);
  //console.log('pos: ', document.querySelector('#js_folder-content'));

  
  
  if(showFolderContentAnimation.progress < 100){
    toogleButton.style.position = "absolute";
    
    //toggleFolder.parentNode.classList.add('show');
    toggleFolder.parent().addClass('show');
    //toogleFolderBackdrop.classList.add('show');
    toogleFolderBackdrop.addClass('show');

    //console.log('showFolderContentAnimation.progress < 100');
  }
/*
  if(toogleButton.style.position == 'relative' || toogleButton.style.position == '') {
    toogleButton.style.position = 'absolute';
    console.log('change to relative!');
  }
  else{
    toogleButton.style.position = 'relative';
    console.log('change to absolute!');
  }
  
*/

  if (showFolderContentAnimation.began) {
    showFolderContentAnimation.reverse();

    if (
    showFolderContentAnimation.progress === 100 &&
    showFolderContentAnimation.direction === "reverse")
    {
      showFolderContentAnimation.completed = false;
    }
  }

  if (showFolderContentAnimation.paused) {
    showFolderContentAnimation.play();
  }
  
     showFolderContentAnimation.finished.then( e => {

        /*
        console.log('toogleButton: ', toogleButton);
        console.log('toogleButton height: ', toogleButton.style.height);
        console.log('toogleButton position: ', toogleButton.style.position);
        console.log('animation is finished', showFolderContentAnimation);
        
        console.log('toogleButton.style.height: ' + toogleButton.style.height);
        */
        /*if(toogleButton.style.height == "0px"){
          toogleButton.style.position = "relative";
          //toggleFolder.parentNode.classList.remove('show');
          toggleFolder.parent().removeClass('show');
          //toogleFolderBackdrop.classList.remove('show');
          toogleFolderBackdrop.removeClass('show');
        }else{
          toogleButton.style.position = "absolute";
          //toggleFolder.parentNode.classList.add('show');
          toggleFolder.parent().addClass('show');
          //toogleFolderBackdrop.classList.add('show');
          toogleFolderBackdrop.addClass('show');
        }
        */

        if(showFolderContentAnimation.completed && showFolderContentAnimation.direction =='normal' && showFolderContentAnimation.progress == 100) {
          toogleButton.style.position = "absolute";
          //toggleFolder.parentNode.classList.add('show');
          toggleFolder.parent().addClass('show');
          //toogleFolderBackdrop.classList.add('show');
          toogleFolderBackdrop.addClass('show');


        }
        if(showFolderContentAnimation.completed && showFolderContentAnimation.direction =='reverse' && showFolderContentAnimation.progress == 0) {

          toogleButton.style.position = "relative";
          //toggleFolder.parentNode.classList.remove('show');
          toggleFolder.parent().removeClass('show');
          //toogleFolderBackdrop.classList.remove('show');
          toogleFolderBackdrop.removeClass('show');
        }
        
      });



    /*
    showFolderContentAnimation.finished.then( e => {

        
        console.log('toogleButton: ', toogleButton);
        console.log('toogleButton height: ', toogleButton.style.height);
        console.log('toogleButton position: ', toogleButton.style.position);
        console.log('animation is finished', showFolderContentAnimation);
        
        console.log('toogleButton.style.height: ' + toogleButton.style.height);
        if(toogleButton.style.height == "0px"){
          toogleButton.style.position = "relative";
          //toggleFolder.parentNode.classList.remove('show');
          toggleFolder.parent().removeClass('show');
          //toogleFolderBackdrop.classList.remove('show');
          toogleFolderBackdrop.removeClass('show');
        }else{
          toogleButton.style.position = "absolute";
          //toggleFolder.parentNode.classList.add('show');
          toggleFolder.parent().addClass('show');
          //toogleFolderBackdrop.classList.add('show');
          toogleFolderBackdrop.addClass('show');
        }
        
      });
    */

});

// Click inside folder content
const folderContentItems = document.querySelectorAll(".folder-content li.js_folder-item");
  
  folderContentItems.forEach(elem => {

      elem.addEventListener("click", async (e) => {
        //update toggleButton content

        //console.log('elem', elem);

        $('.folder-summary__details__name').text(elem.children[1].children[0].innerText).velocity('fadeIn', { duration: 200 });
        $('.folder-summary__details__subname').text(elem.children[1].children[1].innerText).velocity('fadeIn', { duration: 200 });

        document.querySelector('.folder-summary__wallet-icon img').src = elem.children[0].children[0].attributes.src.value;
        //document.querySelector('.folder-summary__details__name').innerText = elem.children[1].children[0].innerText; //wallet name
        //document.querySelector('.folder-summary__details__subname').innerText = elem.children[1].children[1].innerText; //wallet subname

        toggleFolder.click();
        await login_wizard.sleepPromise(300);
        setActivePanel(elem.dataset.walletType);
        loginBtnNext.prop('disabled', false); //enable Next button when Portfolio type is changed!
        console.log('dataset.walletType: '+elem.dataset.walletType);

      });
  });

  
  /*
  @ nested/child tab show (routing related)
  */
  //$('[data-target="#txoutputs"], [data-target="#txinputs"]').on('click', function(e) {
  $('ul.nav-tabs a.nav-link[data-target]').on('click', function(e) {

    
    var data_target = $(this).attr('data-target').slice(1); //slice hashtag (#)
    
    console.log('-->tab.show [data-target='+data_target+']');
    console.log( 'attr: ' + $(this).attr('data-target'));

    var childTarget = '';
    if (data_target.includes('/')) {
      childTarget = data_target.split('/').slice(-1)[0];
      console.log('childTarget1: '+ childTarget);
    }
    if (data_target.includes('_')) {
      childTarget = data_target.split('_').slice(-1)[0];
      console.log('childTarget2: '+ childTarget);
    }
    
    //check if we should pass over any asset link
    var data_asset = $(this).attr('data-asset');
    if (data_asset)
      data_asset = '/'+data_asset;

    //check if a nested/child tab is clicked, for.i.e #newTransaction/txinputs
    if (Router.urlParams.page  != data_target) {
      
      if (childTarget)
        Router.navigate(Router.urlParams.page + '/' + childTarget + data_asset);
      else
        Router.navigate(Router.urlParams.page + '/' + data_target + data_asset);
    } else {
      console.log('Data-target: No tab is set!');
    }
  });

  /*
  $('[data-target="#txoutputs1"], [data-target="#txinputs1"]').on('click', function(e) {
    
    var data_target = $(this).attr('data-target')
    //data_target = data_target.slice(1); //slice hashtag (#)
    console.log( 'attr: ' + data_target);
    
    if(data_target == '#txinputs')
      Router.navigate('newTransaction/txinputs');
    else
      Router.navigate('newTransaction/txoutputs');
  });
  */

    /*document click*/
    $('body').on('click', function(e) {
      console.log('nothing to dismiss');

      //**Only for modal links
      //this goes for modal hashtag navigation when a data-dismiss="modal" is clicked
      //close modal and navigate to HashLink
      if(e.target.dataset.dismiss == 'modal' && (e.target.attributes).hasOwnProperty('href')) {
        console.log('e.target: ', e.target);
        var targetHash = e.target.hash;

        if(targetHash.charAt(0) == '#') {
          targetHash = targetHash.substring(1);
          Router.navigate(targetHash);
        }
      }

      //if(inputFor.charAt(0) == '#')
             //inputFor = inputFor.substring(1);

      /***** Dismiss all popovers by clicking outside, don't dismiss if clicking inside the popover content  **************/
      if ($('.popover').hasClass('show')) {
        //console.log('popover is open! e:', e);
        //console.log('popover is open!', $('.popover'));
        if (typeof $(e.target).data('original-title') == 'undefined' &&
           !$(e.target).parents().is('.popover.show')) {
          $('[data-original-title]').popover('hide');
          console.log('dismiss-popover')
        }
        /*
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
          $(this).popover('hide');
        }
        */

      }

      //**hide wallet portfolio dropdown if visible
      if ($('#js_folder-backdrop').hasClass('show')) {        
        //console.log('portfolio is open');
        if ($(e.target).attr('id') == 'js_folder-backdrop') {
          //console.log('dismiss-portfolio');
          toggleFolder.click();
        }

      }

    });


///*** Open Wallet - Next button
loginBtnNext.on("click",function() {
  console.log('====loginBtnNext click===');
  console.log('login_wizard.openBtnNextStepPanel:  '+login_wizard.openBtnNextStepPanel);
  console.log('login_wizard.openWalletType:  '+login_wizard.openWalletType);


  //if any internal step is added navigate to that step
  if(login_wizard.openBtnNextStepPanel != ''){
    
    //validate form wizard panel name!
    if(login_wizard.panelStepNames.includes(login_wizard.openBtnNextStepPanel)) {
      
      setActivePanel(login_wizard.openBtnNextStepPanel);
      
      //reset login wizard panel, validate fields again on login next button click (validation must be fulfilled if user chooses another portfolio!)
      login_wizard.openBtnNextStepPanel = '';   
      loginBtnNext.prop('disabled', true);
    }

    return;
  }
  

  //first step  when selecting a portfolio
  var walletType='';
  try {
    //login_wizard.openWalletType = "";
      login_wizard.openWalletType == "regular_wallet"; //icee default login for now, remove once other login options is possible

      //***Get login type
    if(login_wizard.openWalletType == "regular_wallet"){
      walletType = "regular";
      login_wizard.validateLogin('password', walletType, 1);
    }
    if(login_wizard.openWalletType == "multisig_wallet"){
      walletType = "multisig";
      login_wizard.validateLogin('password', walletType, 2);
    }
    if(login_wizard.openWalletType == "privatekey_wallet"){
      walletType = "multisig/regular";
      //login_wizard.validateLogin('private_key', walletType, 'm-of-n');
    }
    if(login_wizard.openWalletType == "import_wallet"){
      walletType = "multisig/regular";
      //login_wizard.validateLogin('import', walletType, 'm-of-n');
    }
    if(login_wizard.openWalletType == "mnemonic_wallet"){
      walletType = "mnemonic_wallet";
      login_wizard.validateLogin('mnemonic', walletType, 1);
      console.log('mnemonic_wallet');

    }
    if(login_wizard.openWalletType == "hdmaster_wallet"){
      walletType = "regular";
      //login_wizard.validateLogin('hdmaster', walletType, 1);
    }
    if(login_wizard.openWalletType == "terms"){
      walletType = "terms";
      console.log('we are in terms!')
      //login_wizard.validateLogin('hdmaster', walletType, 1);
    }


    //***Errror occured!
    //No Wallet type choosen
    //if(walletType == '')
      //throw ('Wrong Wallet type! <br>Please choose correct Wallet type!');

  } catch (err) {
    login_wizard.errorMessage = err;
    //***Show Error
    $('#walletLoginStatusBox').velocity('fadeIn').removeClass('hidden');
    $("#walletLoginStatusBox .walletLoginStatusMessage").html(login_wizard.errorMessage).prepend('<i class="bi bi-exclamation-triangle-fill"></i> ').fadeIn();
    //$.Velocity(document.querySelector(".walletLoginStatusBox"), { opacity: 0.5 }, { duration: 1000 });
  }




  


});

    //*** File reader - Import wallet backup
  // highlight drag area
  $('.file-input').on('dragenter focus click', function() {
    $(this)[0].parentElement.classList.add('is-active');
  });

  // back to normal state
  $('.file-input').on('dragleave blur drop', function(e) {
    $(this)[0].parentElement.classList.remove('is-active');
  });


// change inner text
  $('.file-input').on('change', async function(e) {
    var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev();

    if (filesCount === 1) {
      // if single file is selected, show file name
      var fileName = $(this).val().split('\\').pop();
      $textContainer.text(fileName);
    } else {
      // otherwise show number of files
      $textContainer.text(filesCount + ' files selected');
    }
  });



  //**Validation of Input fields for Login
/*$('#openLogin input').on('input change',function(e){
 console.log('===============openLogin input===============');

 console.log('Changed!', e.target);
 console.log('$this:', $(this));
 console.log('this:', this);
 console.log('value:', this.value);
});
*/

//validate fields when  focus is lost, "on blur"
$('#openLogin input[type="password"], #openLogin input[type="text"], #openLogin input[type="email"]').on('blur',function(e){

  console.log('===============openLogin input blur===============');

  var inputField = $(this);
  //get input type attribute
  var inputType = inputField.attr('data-input-type');

  
  var acceptedInputFields = ['email', 'password'];

  if(!acceptedInputFields.includes(inputType)) {
    console.log('inputType: '+ inputType);
    return;
  }

  //console.log('this:', this);
  //console.log('value:', this.value);

 try {
  var inputValue = this.value;
  
  var inputPlaceholder = inputField.attr('placeholder');

  console.log('inputType: '+ inputType);
  console.log('inputPlaceholder: '+ inputPlaceholder);

  login_wizard.errorMessage ='';
  if(inputType == 'email') {
    if(inputValue.length <= 6){
      inputField.removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
      login_wizard.errorMessage = '1';
    }

    console.log('inputValue.length: '+ inputValue.length);
    //check if email is valid
    if(inputValue.length >6){
      
      console.log('check validation');
      if(wally_fn.validateEmail(inputValue)){
        inputField.removeClass('is-invalid').addClass('is-valid').fadeIn();
        console.log('validated!');
        
      }else{
        inputField.removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
        console.log('not validated!');
        login_wizard.errorMessage = '1';



      }

    }
  }

  if(inputType == 'password') {
    if(inputValue.length < 16){
      inputField.removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
      login_wizard.errorMessage = '1';
    }

    console.log('inputValue.length: '+ inputValue.length);
    //check if password is valid
    if(inputValue.length >=16){
      
      if(wally_fn.validatePassword(inputValue)){
        inputField.removeClass('is-invalid').addClass('is-valid').fadeIn();
      }else{
        inputField.removeClass('is-valid').addClass('is-invalid').fadeIn().addClass('animate__shakeX');
        login_wizard.errorMessage = '1';

      }

    }
  }

    //** We got errors, show info about validation if walletLoginStatusMessage is not visible
  if(login_wizard.errorMessage != ''){
    if ($('#walletLoginStatusBox').hasClass('hidden'))
      $('#walletLoginValidationInfo').removeClass('hidden');
  }

  //empty errorMessage since it is used in other functions as well!
  login_wizard.errorMessage = ''; 

  /*
  //***Errror occured!
  if(login_wizard.errorMessage)
    throw(login_wizard.errorMessage);

  //hide and empty error box and message
  $("#walletLoginStatusBox .walletLoginStatusMessage").text('').fadeOut();
  $('#walletLoginStatusBox').velocity('fadeOut').addClass('hidden');
  login_wizard.errorMessage='';
  */

} catch (err) {
  /*login_wizard.errorMessage = err;
  
  $('#walletLoginStatusBox').velocity('fadeIn').removeClass('hidden');
  $("#walletLoginStatusBox .walletLoginStatusMessage").html(login_wizard.errorMessage).prepend('<i class="bi bi-exclamation-triangle-fill"></i> ').fadeIn();
  */
}

  //minimum length for email is 6 for validation fn to trigger, for i.e: i@i.io
/*
    //***Validate the input fields
  if(!wally_fn.validateEmail(loginEmail)) login_wizard.errorMessage += 'Email is not valid!<br/>';

  console.log('loginEmail: ', loginEmail);
  console.log('loginEmailConfirm: ', loginEmailConfirm);

  if(!wally_fn.validatePassword(loginPass[0])) login_wizard.errorMessage += 'Your Password must have between 16-255 chars and must include minimum 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character from \"!#$€%&\'()*+,-./:;<=>?@[\]^_`{|}~¤¨½§ <br>';
*/

  //minimum length for pass is also 3 for validation fn to triger

});


coinbinf.openClientWalletPassphraseCheck.on("click", function(e){
  console.log('===login_wizard.openClientWalletPassphraseCheck===', e);
  if($(this).is(":checked")){
    coinbinf.openSeedPassword.parent().parent().removeClass('hidden').velocity('slideDown');
  } else {
    coinbinf.openSeedPassword.parent().parent().velocity('slideUp');
  }
});

  

}); //End DOM ready

