'use strict';
/*
 @ Developed by Anoxy for Wally.id
 * Wally.id functions and DOM handler!
*/
(function() {
  var wally_kit = window.wally_kit = function() {};
  /*
  @ Set Blockchain Network Settings
  @params
    network
    asset
    options (saveSettings, showMessage (about updated settings) )
  */
  wally_kit.setNetwork = async function(network_var = 'mainnet', asset_var = 'bitcoin', options = {
    saveSettings: true,
    showMessage: false,
    renderFields: true,
    isAuth: false
  }) {
    console.log(' ');
    console.log('===wally_kit.setNetwork===');
    /*
    //confirm in console
    console.log('coinjs.pub: ' +coinjs.pub);
    console.log('coinjs.priv: ' +coinjs.priv);
    console.log('coinjs.multisig: ' +coinjs.multisig);
    console.log('coinjs.hdkey: ', coinjs.hdkey);
    console.log('coinjs.bech32: ', coinjs.bech32);
    console.log('coinjs.supports_address: ', coinjs.supports_address);
    */
    //defaults to mainnet, or else set to testnet
    var listNetworkTypes = ["mainnet", "testnet"];
    var modalTitle = 'Network Settings',
      modalMessage, newNetwork;
    try {
      wally_fn.asset = asset_var;
      //set default chain type to Mainnet
      if (!listNetworkTypes.includes(network_var))
        network_var = 'mainnet';
      //set default network to Bitcoin
      if (!wally_fn.networks[network_var].hasOwnProperty(asset_var)) {
        asset_var = 'bitcoin';
        console.log('reset network to: ' + asset_var);
      }
      newNetwork = wally_fn.networks[network_var][asset_var];
      console.log('Network:: ' + network_var);
      console.log('Asset: ' + asset_var);
      console.log('Network/Asset Info: ', newNetwork);
      //update coinjs settings: merge variable settings with coinjs and overwrite existing properties,
      if (options.saveSettings) {
        //is user logged in? if so do:
        //check if coin has support for the wallet client / bip brotocol
        if (options.isAuth) {

          let loginType = login_wizard.profile_data.login_type;
          //for seed login
          if (loginType === 'seed' || loginType === 'mnemonic' ) {

            var protocol = login_wizard.profile_data.seed.protocol.bip;
            //hdkey, bip32, bip44 has same address master keys
            protocol = (protocol === "bip32" || protocol === "bip44") ? "hdkey" : protocol;
            if (!wally_fn.networks[network_var][asset_var][protocol]) {
              throw (asset_var.toUpperCase() + ' has no support for ' + protocol.toUpperCase());
              alert('danger');
              return;
            }
          }

          //update coin info 
          wally_kit.setCoinInfo({
            'name': coinjs.asset.name,
            'network': coinjs.asset.network,
            'slug': coinjs.asset.slug,
            'symbol': coinjs.asset.symbol,
            'chainModel': coinjs.asset.chainModel,
          });

          //set address info to empty (for rendering specific address info later)
          wally_kit.setAddressInfo({});

        }
        //extend coinjs with the updated asset configuration
        //"remove" bip types which is not common among other coins/assets
        delete coinjs.bip49; //delete property
        delete coinjs.bip84;
        $.extend(coinjs, wally_fn.networks[network_var][asset_var]);
        coinjs.bip32 = wally_fn.networks[network_var][asset_var].hdkey;
        coinjs.bip44 = wally_fn.networks[network_var][asset_var].hdkey;
        //render BIP types on UI, ( Protocol Options ) popover
        var bip, bip_name, bip_options = '';;
        for (var i = 0; i < coinjs.biptypes.length; i++) {
          //compare if version matches bip-type prv or pub 
          bip = coinjs.biptypes[i];
          if (coinjs[coinjs.biptypes[i]] && Object.keys(coinjs[coinjs.biptypes[i]]).length === 2) {
            bip_name = bip;
            if (bip === 'hdkey')
              bip_name = 'bip32';
            bip_options += `
            <label class="btn btn-outline-primary waves-effect text-uppercase" data-bip-option="${bip}">
              <input type="radio" name="radio_bip_protocol" value="${bip}" > ${bip_name}
            </label>`;
            //show BIP Tab and its content
            console.log('setNetwork show BIP: ' + bip);
            coinbinf[bip + 'Tab'].removeClass('hidden');
            coinbinf[bip + 'TabContent'].removeClass('hidden');
          } else {
            console.log('setNetwork hide BIP: ' + bip);
            coinbinf[bip + 'Tab'].addClass('hidden');
            coinbinf[bip + 'TabContent'].addClass('hidden');
          }
        }
        //remove check from Electrum Wallet derivation
        coinbinf.bipMnemonicClientProtocol.prop('checked', false).trigger('change');
        //Set bip44 as default
        coinbinf.deriveFromBipProtocol.val('BIP44').trigger('change');
        //set BIP coin path
        coinbinf.bipCoinPathTabContent.val(coinjs.slip_path);
        //set BIP cointype
        coinbinf.bippath.val("m/0");
        coinbinf.bip32path.val("m/0");
        coinbinf.bip44path.val("m/44'/" + coinjs.slip_path + "'/0'/0");
        coinbinf.bip49path.val("m/49'/" + coinjs.slip_path + "'/0'/0");
        coinbinf.bip84path.val("m/84'/" + coinjs.slip_path + "'/0'/0");
        //set BIP44 tab as default
        coinbinf.bip32Tab.click();
        $('#popBIPSettingsJBox .bip-options-group').html(bip_options);
        //Set bip44 as default
        var popoverBipOptionsGroup = $('#popBIPSettingsJBox label[data-bip-option]');
        popoverBipOptionsGroup.filter('[data-bip-option="bip44"]').addClass('active').find('input').prop('checked', true);
        //set coin slip/bip path settings
        //iceee kalle
        //$("#verifyHDaddress #coin-bip44").val(coinjs.slip_path);
        //$("#verifyHDaddress #bip44-path").val("m/44'/"+coinjs.slip_path+"'/0'/0");
        //disable bip49, bip84 for none bech32 coins
        /*
        if( (coinjs.asset.supports_address).includes('bech32') || (coinjs.asset.supports_address).includes('segwit')) {
          $('#bipDerivationTabBip49').addClass('hidden');
          $('#bipDerivationTabBip84').addClass('hidden');
          $('#bipTab49').addClass('hidden');
          $('#bipTab84').addClass('hidden');
        } {
          $('#bipDerivationTabBip49').addClass('hidden');
          $('#bipDerivationTabBip84').addClass('hidden');
          $('#bipTab49').addClass('hidden');
          $('#bipTab84').addClass('hidden');
        }
        */
        /*
        //check and render only supported bip types
        var bipOptionsGroup = $('#popBIPSettingsJBox label[data-bip-option]');

        // A flag to check if any element is checked
        var anyChecked = false;
        

        console.log('bipOptionsGroup: ', bipOptionsGroup);
        // Iterate through elements with the data-bip-option attribute
        bipOptionsGroup.each(function() {
            var bipOptionValue = $(this).data('bip-option');
            
            // Check if bipOptionValue exists in coinjs
            if (coinjs[bipOptionValue] && Object.keys(coinjs[bipOptionValue]).length === 2) {
              $(this).removeClass('hidden active');

              

            } else  {
              $(this).addClass('hidden').removeClass('active');
              // Check if this element is checked
              if ($(this).is(':checked'))
                  anyChecked = true;

            }
        });

        // If no element is checked, find the element with data-bip-option="bip44" and check it
        //if (!anyChecked) {
          bipOptionsGroup.filter('[data-bip-option="bip44"]').addClass('active').find('input').prop('checked', true);
        //}
        */
        //Object.assign(coinjs, (wally_fn.networks[network_var][asset_var]))
        //dabi, save copy of "asset" object, for data-binding purpose (UI) !
        Object.assign(wally_fn.assetInfo, coinjs.asset);
        $('.coin_symbol').text(coinjs.asset.symbol);
        $('.coin_name').text(coinjs.asset.name);
        wally_fn.chainModel = coinjs.asset.chainModel;
        console.log('#modalChangeAsset input[name="set-asset-group"][value="' + asset_var + '"]');
        //set new selected asset in modal dialog
        document.querySelector('#modalChangeAsset input[name="set-asset-group"][value="' + asset_var + '"]').checked = true;
        //make this own function
        //hide/show fields for updated Network protocol
        if (coinjs.txRBFTransaction) {
          $("#txRbfTransactionOptional").show();
          $('#txRBF').prop('checked', false);
        } else {
          $("#txRbfTransactionOptional").hide();
          $('#txRBF').prop('checked', false);
        }
        //for PoS coins
        if (coinjs.txExtraTimeField) {
          $("#nTime").val(Date.now() / 1000 | 0);
          $("#txTimeOptional").show();
          $("#verifyTransactionData .txtime").show();
          console.log('show extra TX TIME field!');
        } else {
          $("#txTimeOptional").hide();
          $("#verifyTransactionData .txtime").hide();
          $('#nTime').val('');
        }
        //check if asset needs extra unit field?
        if (coinjs.txExtraUnitField) {
          coinjs.txExtraUnitFieldValue = $("#nUnit").val() * 1;
          $('#txUnitOptional').show();
          $("#verifyTransactionData .txunit").show();
        } else {
          $('#txUnitOptional').hide();
          $("#verifyTransactionData .txunit").hide();
          $('#nUnit').val('');
        }
      }
      //update list for supported assets for choosen network 
      if (options.renderFields)
        this.settingsListAssets(network_var);
      //show message for changing network & asset
      if (options.showMessage) {
        var parentTokenBadge = wally_kit.getParentTokenBadge(newNetwork.asset.chainModel, newNetwork.asset.protocol);
        modalMessage = '<div class="text-center text-primary mb-3"><p class="mb-2">You have updated Blockchain Network settings to:</p>' +
          newNetwork.asset.name + ' <strong>(' + newNetwork.asset.symbol + ' ' + newNetwork.asset.network + ')</strong> </div>';
        modalMessage += '<div class="settings_saved icon_with_badge"><img src="' + newNetwork.asset.icon + '" class="icon-center icon64 mb-2">' + parentTokenBadge + '</div>'
        modalMessage += '<div class="text-center text-muted">API Providers:<br> Unspent outputs: ' + wally_fn.provider.utxo + '<br>Broadcast: ' + wally_fn.provider.broadcast + '</div> <br> <div class="alert alert-light text-muted mb-2">If this is not correct, head over to <a href="#settings" data-pagescroll="page_tab" data-dismiss="modal">Settings</a> page. </div>';
        custom.showModal(modalTitle, modalMessage);
      }
      return true;
    } catch (e) {
      console.log('wally_kit.setNetwork ERROR: ', e);
      modalTitle = 'Settings'
      modalMessage = 'ERROR: <br>' + e;
      custom.showModal(modalTitle, modalMessage, 'danger', {
        'buttons': {
          'cancel': false
        }
      });
      return false;
      //console.warn("");
    }
  }

  /**
 * Sets the coin information in the login_wizard.profile_data.coin object.
 * @param {object} coinInfo - The coin information object.
 */
wally_kit.setCoinInfo = function (coinInfo) {
    // Set the property in the coin object
    login_wizard.profile_data.coin.name = coinInfo.name;
    login_wizard.profile_data.coin.network = coinInfo.network;
    login_wizard.profile_data.coin.slug = coinInfo.slug;
    login_wizard.profile_data.coin.symbol = coinInfo.symbol;
    login_wizard.profile_data.coin.chainModel = coinInfo.chainModel;
};


  /**
 * Sets the address information in the login_wizard.profile_data.coin object.
 * @param {object} addressInfo - The address information object.
 */
  wally_kit.setAddressInfo = function (addressInfo) {
      // Check if the provided addressInfo object is empty
      if (Object.keys(addressInfo).length === 0) {
          // If empty, set address_info object to an empty object
          login_wizard.profile_data.coin.address_info = {};
      } else {
          // If not empty, set address_info object to the provided addressInfo
          login_wizard.profile_data.coin.address_info = addressInfo;
      }
  };
/*
  wally_kit.renderAddressInfo = function (addressInfo) {
    
    const coin = coinjs.asset.slug;
    const coinSymbol = coinjs.asset.symbol;
    const addr = addressInfo.address;

    //Create QR code
    $("#addressInfoQrCode").text("");
    var qrcode = new QRCode("qrcode_el");
    //qrcode.makeCode("bitcoin:"+address);
    qrcode.makeCode(coin+':'+addr);

    addressInfo.qrCode = qrcode._el.innerHTML;

    //wally_kit.setAddressInfo(addressInfo);

    wally_fn.tpl.viewAddressInfo.render(addressInfo);
    //$('#addressInfoModal').modal('show');
    
  };
*/

  /*
  @ Wallet Router settings
  */
  wally_kit.initRouter = async function() {
    console.log('===initRouter===');
    /*<<< Start Router*/
    var show_about = function() {
      alert('This is the application "About".\n\nCopyright ©2020-2023 Wally.id');
    }
    var show_number = function(num) {
      alert('Number: ' + num);
      console.log('num: ', num)
    }
    var setVerifyScript = function() {
      document.getElementById('verifyScript').value = Router.urlParams.decode;
    }
    var loginWalletInteraction = function() {
      //if user is logged in navigate to wallet page
      const userIsAuth = $('body').attr('data-user');
      if (userIsAuth === "auth" && ((login_wizard.profile_data).hasOwnProperty('hex_key') && login_wizard.profile_data.hex_key.length)) {
        Router.navigate('wallet');
        return;
      }
      console.log('Router.urlParams: ', Router.urlParams);
      //portfolio panel is not active/Set, route back to open portfolio
      if (login_wizard.openWalletType == '')
        Router.navigate('login');
      console.log('login wallet portfolio in target: ' + login_wizard.openWalletType);
      console.log('Router.urlParams.wallet_type: ' + Router.urlParams.wallet_type);
      //set view to (history-hash) wallet type
      if (Router.urlParams.wallet_type) { //we navigate only to the selected portfolio, even after a refresh
        //if (Router.urlParams.wallet_type && Router.urlParams.wallet_type == login_wizard.openWalletType) { //we navigate only to the selected portfolio, even after a refresh
        $('#js_folder-content li.folder-item[data-wallet-type="' + Router.urlParams.wallet_type + '"]').click();
        console.log('wallet portfolio: ' + Router.urlParams.wallet_type);
        console.log('openWalletType: ' + login_wizard.openWalletType);
      } else {
        console.log('not listed');
      }
      //if(data[1] == '/login=multisig_wallet')
      if (Router.urlParams.wallet_type == 'regular_wallet') {
        //hide next button
        $('#openBtnNext').removeClass('hidden');
        //show open wallet button
        $('#openBtn').addClass('hidden');
      }
      if (Router.urlParams.wallet_type == 'multisig_wallet') {
        $('#openBtnNext').removeClass('hidden');
        $('#openBtn').addClass('hidden');
      }
      if (Router.urlParams.wallet_type == 'masterket_wallet') {
        $('#openBtnNext').removeClass('hidden');
        $('#openBtn').addClass('hidden');
        coinbinf, openClientWallet.find("option[value='0']").prop("disabled", false);
      }
      if (Router.urlParams.wallet_type == 'import_wallet') {
        $('#openBtnNext').removeClass('hidden');
        $('#openBtn').addClass('hidden');
      }
      if (Router.urlParams.wallet_type == 'mnemonic_wallet') {
        $('#openBtnNext').removeClass('hidden');
        $('#openBtn').addClass('hidden');
        //if (coinbinf.openClientWallet.val() == 0) {
        //coinbinf.openClientWallet.
        //var openClientWalletIndex = coinbinf.openClientWallet.find('option:selected').val();
        //coinbinf.openClientWallet.find('option:contains("Electrum")').prop('disabled', true);
        //disable bitcoin core wallet client for mnemonic login
        coinbinf.openClientWallet.find("option[value='0']").prop("disabled", true);
        if (coinbinf.openClientWallet.val() == 0 || coinbinf.openClientWallet.val() === null) {
          coinbinf.openClientWallet.val(1).find("option[value='1']").prop("selected", true);
          console.log('change');
        } else {
          console.log('dont change');
        }
      }
      if (Router.urlParams.wallet_type == 'hdmaster_wallet') {
        $('#openBtnNext').removeClass('hidden');
        $('#openBtn').addClass('hidden');
      }
      if (Router.urlParams.wallet_type == 'terms') {
        //$('#openBtnNext').addClass('hidden');
        //$('#openBtn').addClass('hidden'); 
        //console.log('hideeeeeeeeeeeeeen');
      }
    }
    Router
      /*.add(/^(\?)/, function(data) {

        //index.html?asset=bay&decode=1232123
        //-->index.html#home?asset=bay&decode=1232123
        console.log('**re-route page start******************');

        console.log('**re-route page**', data);
        console.log('**re-route page end******************', data[2]);
        //alert('converter page');
        //Router.navigate( Router.urlParams.page );
        console.log('data: ', data);
        //window.location.search = '';
        
        data = data[0].split('?');
        window.location.hash = 'home?'+data[data.length-1];
        window.location.search = '';

        
      })
      */
      .add(/^$/, function(data) {
        console.log('**empty string page**');
        Router.urlParams.page = 'home';
      })
      .add(/home(.*)/, function(data) {})
      .add(/error_404/, function(data) {
        console.log('**error_404 page**');
        //wally_kit.removeActivePages();
        $('.landing_box').addClass('hidden');
        document.getElementById('error_404').classList.add("active");
      })
      .add(/newAddress(.*)/, function(data) {})
      .add(/newSegWit(.*)/, function(data) {})
      .add(/newMultiSig(.*)/, function(data) {})
      .add(/newHDaddress(.*)/, function(data) {})
      .add(/newTimeLocked(.*)/, function(data) {})
      //.add(/(newTransaction)(.*)/, function(data){  //catch #newTransaction/txinputs
      //.add(/(newTransaction|(?<=newTransaction.*)[^\/?\r\n]+)/g, function(data){  //catch #newTransaction/txinputs
      .add(/(\bnewTransaction\b|(?<=\bnewTransaction\/.*)[^\/?]+|(?<=\bnewTransaction\?.*)(?<=\?).*)/g, function(data) { //https://regex101.com/r/2RtRfv/6/codegen?language=javascript
        /*
        index.html#newTransaction/txinputs/attans?key=value&param=paramValue
        gives:
        [
          "newTransaction",
          "txinputs",
          "attans",
          "key=value&param=paramValue"
        ]
        */
        //.add(/(newTransaction)(.*)\?(\w.*)/, function(data){  //catch #newTransaction/txinputs
        console.log('**newTransaction page**')
        console.log('data: ', data[1]);
        //show nested/child route
        if (data[1])
          $('#newTransaction [data-target="#' + data[1] + '"]').tab('show');
      })
      .add(/(\bwallet\b|(?<=\bwallet\/.*)[^\/?]+|(?<=\bwallet\?.*)(?<=\?).*)/g, async function(data) {
        //https://stackoverflow.com/questions/4419000/regex-match-everything-after-question-mark
        //.add(/(wallet|(?<=wallet\/.*)[^/?]+|(?<=\?).*)/g, function(data){  //https://regex101.com/r/2RtRfv/6/codegen?language=javascript
        console.log('**wallet page**', data);
        /*
        index.html#wallet/send/attans?key=value&param=paramValue
        gives:
        [
          "wallet",
          "send",
          "attans",
          "key=value&param=paramValue"
        ]
        */
        console.log('data: ', data);
        // Check if the provided data corresponds to a valid wallet asset subpage
        var walletSubPage = false; // Variable to store the wallet subpage
        var walletAssetTabs = ['asset', 'send', 'receive', 'addresses', 'contacts', 'settings'];

        if (walletAssetTabs.includes(data[1])) {
            // Activate the corresponding tab for navigation when navigating back and forth
            $('#walletAsset [data-target="#' + data[0] + '_' + data[1] + '"]').tab('show');
            walletSubPage = data[1]; // Store the active subpage


            // Reset the page tab navigation slider to the first tab if the active subpage is 'asset'
            if (walletSubPage === 'asset') {
                const $subPageNavTabs = $("#walletAsset .nav-tabs");
                const $subPageNavSlider = $("#walletAsset .nav-slider");

                // Set the active tab to the first one and adjust the slider position and width
                const activeTab = $subPageNavTabs.find("li:first");
                $subPageNavSlider.css({ "left": 0, "width": 90 });
            }


        }
        console.log('walletSubPage before: ' + walletSubPage);
        //get asset name
        const choosenAsset = data[data.length - 1].toLowerCase();
        console.log('walletSubPage choosenAsset: ' + choosenAsset);

        //is coin supported
        var isAssetFound = false;
        var assetKeyInObject = '';
        if (!walletAssetTabs.includes(choosenAsset) && choosenAsset != 'wallet') {

        //if (choosenAsset != 'wallet') {
          
          if (wally_fn.networks[wally_fn.network].hasOwnProperty(choosenAsset)) {
              var value = wally_fn.networks[wally_fn.network][choosenAsset];
              
              // The asset was found, and value contains the asset information
              isAssetFound = true;
              assetKeyInObject = choosenAsset;
              
              // Try changing the asset to the selected one
              // (assuming 'coinjs' and other variables are defined somewhere)
              if (coinjs.asset.symbol !== value.asset.symbol) {
                  var coinSupportsProtocol = await wally_kit.setNetwork('mainnet', assetKeyInObject, {
                      saveSettings: true,
                      showMessage: false,
                      renderFields: true,
                      isAuth: true
                  });
                  if (!coinSupportsProtocol) {
                      Router.navigate('wallet');
                      return;
                  }
              }
          }
        }
        
        //Render specific subpage
        //Show Coin page or Overview page?
        if (walletSubPage) {
          $('#walletOverview').addClass('hidden');
          $('#walletAsset').removeClass('hidden');
          console.log('Wallet Overview - page');
          
        } else {
          $('#walletOverview').removeClass('hidden');
          $('#walletAsset').addClass('hidden');
          console.log('Wallet Coin -page');
          return;
        }


        const coinChain = wally_fn.coinChainIs();

        //Render Api Provider Options
        var apiProviderBalance = wally_kit.getCoinProvidersForApiService(coinjs.asset.api.providers, 'balance');
        var apiProviderListunspent = wally_kit.getCoinProvidersForApiService(coinjs.asset.api.providers, 'listunspent');
        var apiProviderPushrawtx = wally_kit.getCoinProvidersForApiService(coinjs.asset.api.providers, 'pushrawtx');

        wally_fn.tpl.seed.viewBalanceProviderOptions.render(apiProviderBalance);
        wally_fn.tpl.seed.viewListunspentProviderOptions.render(apiProviderListunspent);
        wally_fn.tpl.seed.viewPushrawtxProviderOptions.render(apiProviderPushrawtx);



        //wallet settings page
        if (walletSubPage == 'settings') {
          console.log('wallet settings page - update provider API list');

          if (coinChain == 'utxo')
            coinbinf.coinUTXO.removeClass('hidden');
          else
           coinbinf.coinUTXO.addClass('hidden');
        }


        //coin has not been changed or no such coin -> exit
        if (!isAssetFound) {
          console.log('Coin Not Changed or Not Found! ', coinjs.name);
          return;
        }



        //render password addresses / generate and render mnemonic addresses if they are not present
        if (login_wizard.profile_data.login_type === 'password') {
          $('[data-login-type="seed"]').addClass('hidden');

          var addrObj = {
            'addresses': login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses,
            'chainModel': coinjs.asset.chainModel
          };
          //render the addresses
          //wally_kit.walletRenderAddresses(addrObj);
          await wally_kit.walletRenderPasswordAddresses(addrObj);

          
        } else if (login_wizard.profile_data.login_type === 'mnemonic') {
          $('[data-login-type="seed"]').removeClass('hidden');
          //check if addresses for a mnemonic/ seed /master has been generated
          //has the addresses been generated, if not generate them for the choosen coin/asset!
          console.log('wallet page login_wizard.profile_data.generated: ', login_wizard.profile_data.generated);
          console.log('wallet page slug: ', [coinjs.asset.slug]);

          if (!login_wizard.profile_data.generated[coinjs.asset.slug]) {
            //init master key generation of keys for mnemonic and first gapLimit addresses
            var p = login_wizard.profile_data.seed.passphrase;
            var s = login_wizard.profile_data.seed.mnemonic;
            var protocol = login_wizard.profile_data.seed.protocol;
            await wally_fn.generateWalletMnemonicAddresses(p, s, protocol);
          }
          console.log('mnemonic -> walletRenderSeedAddresses');
          wally_kit.walletRenderSeedAddresses();
          /*
          var getSumPromise = wally_fn.myPromisify(wally_fn.decodeHexPrivKey);
          getSumPromise('3ö').then((data) => {
            console.log('====***wally_fn.myPromisify SUCCESS: ', data);
          }).catch((error) => {
            console.log('====***wally_fn.myPromisify ERROR: ', error);
          });
          */
        }

        //init default API Providers for the coin
        if(!login_wizard.profile_data.generated[coinjs.asset.slug].api_provider) {
          login_wizard.profile_data.generated[coinjs.asset.slug].api_provider = {
            'balance':  Object.keys(coinjs.asset.api.providers?.balance)[0] ?? null, //set the first provider as default, default to null if there is no provider
            'listunspent': coinjs.asset.api.providers?.listunspent && typeof coinjs.asset.api.providers.listunspent === 'object' ? Object.keys(coinjs.asset.api.providers.listunspent)[0] : null,
            'pushrawtx': Object.keys(coinjs.asset.api.providers?.pushrawtx)[0] ?? null,
          };
        }


        //set the user prefered API Provider
        if (login_wizard.profile_data.generated[coinjs.asset.slug].api_provider.balance) {
          coinbinf.apiBalanceProviderSelector.val(login_wizard.profile_data.generated[coinjs.asset.slug].api_provider.balance);
        }
        if (login_wizard.profile_data.generated[coinjs.asset.slug].api_provider.listunspent) {
          coinbinf.apiListunspentProviderSelector.val(login_wizard.profile_data.generated[coinjs.asset.slug].api_provider.listunspent);
        }
        if (login_wizard.profile_data.generated[coinjs.asset.slug].api_provider.pushrawtx) {
          coinbinf.apiPushrawtxProviderSelector.val(login_wizard.profile_data.generated[coinjs.asset.slug].api_provider.pushrawtx);
        }

        //coin - get balance
        await wally_kit.apiGetCoinBalance(coinbinf.apiBalanceProviderSelector.val());

        //pass over the asset and update wallet menu
        //wally_kit.pageMenuUpdate(coinjs.asset.slug);  //deprecated


        //render UI relative to utxo /evm
        if (coinjs.asset.chainModel === "utxo") {
          $('#wallet_advanced_options_dropdown').removeClass('hidden')
          //hide segwit and bech32 options by default
          $('#walletToSegWit').addClass('hidden');
          $('#walletToSegWitBech32').addClass('hidden');
          if (coinjs.asset.supports_address.includes('bech32'))
            $('#walletToSegWitBech32').removeClass('hidden');
          if (coinjs.asset.supports_address.includes('segwit'))
            $('#walletToSegWit').removeClass('hidden')
        } else {
          $('#wallet_advanced_options_dropdown').addClass('hidden')
        }
        $('.coin_name').text(coinjs.asset.name)
        $('.coin_symbol').text(coinjs.asset.symbol)
        $('.coin_chain').text(coinjs.asset.chainModel)
        if (coinjs.asset.chainModel == "utxo" || coinjs.asset.chainModel == "account" || coinjs.asset.chainModel == "evm") {
          $('.avatar_main.coin_icon').attr('src', coinjs.asset.icon).removeClass('hidden');
          $('.avatar_badge.coin_icon').text(coinjs.asset.name).addClass('hidden'); //hide the parent badge asset token->parentchain asset-icon
        } else {
          //check if it is a token, show token icon and its parent badge icon
          if ((coinjs.asset).hasOwnProperty('protocol')) {
            //set parent icon
            var parentChainKey = coinjs.asset.protocol.protocol_data.platform;
            var parentAsset = wally_fn.networks[wally_fn.network].parentChain;
            $('.avatar_badge.coin_icon').attr('src', parentAsset.asset.icon).removeClass('hidden');
            //set asset icon
            $('.avatar_main.coin_icon').attr('src', coinjs.asset.icon).removeClass('hidden');
          }
        }
        //if no data is present, exit
        if (!login_wizard.profile_data?.api)
          return;
        var coininfo = login_wizard.profile_data.api?.assets;
        // API call request denied, skip rendering asset coininfo data
        if (coininfo[assetKeyInObject]?.coininfos === undefined) {
          console.log('Could not retrieve API asset chain info!')
          return;
        }
        $('.coin_price_change_24h').text(parseFloat(coininfo[assetKeyInObject].coininfos.price_change_24h).toFixed(8) + ' (' + parseFloat(coininfo[assetKeyInObject].coininfos.price_change_percentage_24h).toFixed(2) + '%)')
        $('.coin_price').text('$' + parseFloat(coininfo[assetKeyInObject].coininfos.current_price).toFixed(8));
        var coinSupplyTotal = parseFloat(coininfo[assetKeyInObject].coininfos.total_supply);
        if (isNaN(coinSupplyTotal) || coinSupplyTotal === 0)
          coinSupplyTotal = '-';
        else
          coinSupplyTotal = wally_fn.formatNumberWithCommas(coinSupplyTotal);
        $('.coin_supply_total').text(coinSupplyTotal)
        var coinSupplyCirculation = parseFloat(coininfo[assetKeyInObject].coininfos.circulating_supply);
        if (isNaN(coinSupplyCirculation) || coinSupplyCirculation === 0)
          coinSupplyCirculation = '-';
        else
          coinSupplyCirculation = wally_fn.formatNumberWithCommas(coinSupplyCirculation);
        $('.coin_supply_circulation').text(coinSupplyCirculation)
        var coinVolume = parseFloat(coininfo[assetKeyInObject].coininfos.total_volume);
        if (isNaN(coinVolume) || coinVolume === 0)
          coinVolume = '-';
        else
          coinVolume = wally_fn.formatNumberWithCommas(coinVolume);
        $('.coin_volume').text('$' + coinVolume)
        //coininfo[assetKeyInObject].coininfos.name
        //coininfo[assetKeyInObject].coininfos.low_24h
        //coininfo[assetKeyInObject].coininfos.circulating_supply
        //coininfo[assetKeyInObject].coininfos.total_supply
        //coininfo[assetKeyInObject].coininfos.total_volume
        //coininfo[assetKeyInObject].coininfos.price_change_24h
        //coininfo[assetKeyInObject].coininfos.price_change_percentage_7d_in_currency
        //coininfo[assetKeyInObject].coininfos.high_24h
        //coininfo[assetKeyInObject].coininfos.current_price
        //coininfo[assetKeyInObject].coininfos.atl
        //coininfo[assetKeyInObject].coininfos.atl_date
        //coininfo[assetKeyInObject].coininfos.ath
        //coininfo[assetKeyInObject].coininfos.ath_date
        //coininfo[assetKeyInObject].coininfos.apitime
        //coininfo[assetKeyInObject].coininfos.ath_change_percentage
        //coininfo[assetKeyInObject].coininfos.market_cap
        //coininfo[assetKeyInObject].coininfos.market_cap_rank
        //coininfo[assetKeyInObject].coininfos.price_change_percentage_1y_in_currency
        //coininfo[assetKeyInObject].coininfos.fully_diluted_valuation
        //coininfo[assetKeyInObject].coininfos.roi
        //coininfo[assetKeyInObject].coininfos.last_updated
        //coininfo[assetKeyInObject].coininfos.
        //coininfo[assetKeyInObject].coininfos.
      })
      /*
              .add(/txoutputs/, function(data){
                console.log('**newTransaction/txoutputs**')
                //Router.navigate('newTransaction/txoutputs');
              })
              .add(/txinputs/, function(data){
                console.log('**newTransaction/txinputs**')
                //Router.navigate('newTransaction/txinputs');
              })
              */
      //.add(/kalle(.*)/, function(data){})
      .add(/login(.*)/, function(data) {
        console.log('**login page**');

        // check if user is logged in
        const userIsAuth = $('body').attr('data-user');
        if (userIsAuth === "auth") {
          Router.navigate('wallet');
          return;
        }
        
        //proceed with interaction with login page
        loginWalletInteraction();
        


        
      })
      .add(/logout(.*)/, function(data) {
        console.log('**logout page**');

        //empty receive/change addresses
        wally_fn.tpl.seed.viewReceiveAddresses.render([]);
        wally_fn.tpl.seed.viewChangeAddresses.render([]);
        //alert('sign page');
        //if user is logged in navigate to wallet page
        const userIsAuth = $('body').attr('data-user');
        if (userIsAuth === "guest") {
          Router.navigate('home');
          return;
        }
        //render stuff - hide wallet menu for auth user
        $('.zeynep.left-panel').attr('data-user', 'guest');
        $('[data-user-show="auth"]').addClass('hidden');
        $('[data-user-show="guest"]').removeClass('hidden');


        //remove session if remember me is false
        //if (!login_wizard.profile_data.remember)
        storage_s.remove('wally.profile');
        $('body').attr('data-user', 'guest');
        login_wizard.profile_data = {};
        //clear all inputs
        $('input[type=text], input[type=password]').val('');
        $('textarea').val('');
        //from old coding
        //$("#openEmail").val("");
        //$("#openPass").val("");
        //$("#openPass-confirm").val("");
        //$("#login").removeClass('hidden');
        //$("#openLogin").show();
        //$("#wallet").addClass("hidden");
        $("#walletAddress").html("");
        $("#walletHistory").attr('href', "");
        $("#walletQrCode").html("");
        var qrcode = new QRCode("walletQrCode");
        qrcode.makeCode("bitcoin:");
        $("#walletKeys .privkey").val("");
        $("#walletKeys .pubkey").val("");
        $("#openLoginStatus").html("").hide();

        //enable next on wallet login, and disable open wallet
        $('#openBtn').prop('disabled', true).addClass('hidden');
        $('#openBtnNext').prop('disabled', false).removeClass('hidden');
        //uncheck remember me
        $('#loginRemember').prop('checked', false);

        
        //uncheck terms and wallet backup
        $('#walletLoginFormAccept .alert').removeClass('alert-success').addClass('alert-danger')
        $('#openCheckBackupAlreadySaved').prop('checked', false)
        $('#openCheckAcceptTerms').prop('checked', false)

        
      })
      .add(/about(.*)/, function(data) {
        console.log('**about page**');
      })
      //.add(/(.*)(verify)(.*)/, function(data) {
      .add(/(verify)(.*)/, function(data) {
        console.log('**verify page**');
        //console.log('data: ', data);
        if (Router.urlParams._params_.decode) {
          setVerifyScript();
        }
      })
      .add(/(sign)(.*)/, function(data) {
        console.log('**sign page**');
        //alert('sign page');
      })
      .add(/(broadcast)(.*)/, function(data) {
        console.log('**broadcast page**');
        //alert('broadcast page');
      })
      .add(/(converter)(.*)/, function(data) {
        console.log('**converter page**');
        //alert('converter page');
      })
      .add(/(fee)(.*)/, function(data) {})
      //.add(/(settings\/)(.*)/, function(data) {
      .add(/(settings)\?(.*)/, function(data) {
        console.log('**settings subpage**', data);
        console.log('parsedUrl: ', Router.urlParams);
      })
      .add(/(settings)(.*)/, function(data) {
        console.log('**settings first page**', data);
        console.log('parsedUrl: ', Router.urlParams);
      })
      .add(/(way-token)(.*)/, function(data) {
        console.log('**way-token page**');
        //alert('converter page');
      })
      .add(/(components)(.*)/, function(data) {
        console.log('**components page**');
        //alert('converter page');
      })
      /*.add(/(number)=([0-9]+)&(n)=([0-9]+)/i, function(params) {
          console.log('number=page, data:', params);
          
      })
      */
      //.add(/number=([0-9]+)/i, show_number)
      //default page (when routes above isn't matched)
      .add(/(.*)/, function(data) {
        console.log('**empty page**');
        console.log('===EMPTY_PAGE_HASH===');
        console.log('__REDIRECT_TO_STARTPAGE_PERHAPS__');
        //$('#tab-content .tab-pane.tab-content').removeClass('active');
        //$('#error_404').addClass('active');
        //Router.navigate('home', 'Start');
        //window.location.hash = "#error_404";
        //Router.navigate('error_404');
      })
      .beforeAll(function(data) {
        //try {
        console.log(' ');
        console.log('==Run Before All Routes!')
        //if not page is set, default to home
        if (Router.urlParams.page == '')
          Router.urlParams.page = 'home';
        wally_kit.pageHandler(data);
      })
      .afterAll(function(data) {
        console.log(' ');
        console.log('==Run After All Routes!')
      })
      .apply()
      .start();
    //Router.navigate();
    /*<<< End Router*/
    /*
        console.log('network: ' + default_network);
        console.log('coinjs.asset: ' + coinjs.asset);
        console.log('Router.urlParams.asset: ' + Router.urlParams.asset);
        */
    //set Network depending on URL parameters
    //is network and asset set by page url?
    /*
    var _getNetworkParam = wally_fn._searchURLParam("network");
    var _getAssetParam = wally_fn._searchURLParam("asset");
    console.log('_searchURLParam setAsset to: ' + _getAssetParam);
    console.log('_searchURLParam setNetwork to: ' + _getNetworkParam);


    //Load pages depending on URL parameters
    var _getBroadcast = wally_fn._searchURLParam("broadcast");
    if(_getBroadcast[0]){
      $("#rawTransaction").val(_getBroadcast[0]);
      $("#rawSubmitBtn").click();
      window.location.hash = "#broadcast";
    }

    var _getVerify = wally_fn._searchURLParam("verify");
    if(_getVerify[0]){
      $("#verifyScript").val(_getVerify[0]);
      $("#verifyBtn").click();
      window.location.hash = "#verify";
    }
    */
  }
  /*
  @ Check if asset and network type is set by URL
  */
  wally_kit.checkUrlParams = async function() {
    //get & set asset type, default is bitcoin
    if (Router.urlParams.asset !== undefined) {
      console.log('==Router.urlParams.asset==', Router.urlParams);
      var default_network = 'mainnet',
        default_asset = 'bitcoin';
      //check if network type is set, or else set to default!
      //if (Router.urlParams.network !== undefined) {
      if ((Router.urlParams).hasOwnProperty('network')) {
        if (Router.urlParams.network == 'mainnet' || Router.urlParams.network == 'testnet') {
          default_network = Router.urlParams.network;
          console.log('default_network is correct!');
        } else {
          Router.urlParams.network = default_network;
          console.log('default_network was reset to default!');
        }
      }
      console.log('check for Router.urlParams.asset: ' + Router.urlParams.asset);
      console.log('check for Router.urlParams.network: ' + Router.urlParams.network);
      //if (wally_fn.networks[ network ][ urlParams.asset] ) {
      //console.log ('network: ' + network + '|  asset: ' + urlParams.asset );
      //}
      //search for asset name and symbol for i.e (bitcoin/btc)
      for (var [key, value] of Object.entries(wally_fn.networks[default_network])) {
        console.log('loop for key, value: ' + key);
        if ((value.asset.symbols).includes(Router.urlParams.asset)) {
          default_asset = key;
          console.log('asset was found: ', value.asset.symbol);
          console.log('asset key was found: ', key);
          await this.setNetwork(default_network, default_asset, {
            saveSettings: true,
            showMessage: true,
            renderFields: true
          });
          break;
        }
      }
    }
  }
  /*
  @ Initialize Network Settings!
  */
  wally_kit.initNetwork = async function(networkTypesRadio) {
    console.log(' ');
    console.log('===wallt_kit.initNetwork===');
    try {
      //set Host
      wally_fn.setHost();
      //set binders
      //***UI variable/object-bind (change to DOM)
      //bind/change select coin icon
      DaBi(".dabi-selectedAsset", wally_fn.assetInfo, "icon", "src");
      //List supported assets, footer page, quick asset change in modal, donations list etc...
      this.listAssets();
      //check if user is auth
      login_wizard.openUserWallet();
      //set default Chain Network 
      //if (!coinjs.asset)
      await this.setNetwork('mainnet', 'bitcoin', {
        saveSettings: true,
        showMessage: false,
        renderFields: true
      });
      //get pageURL Parameters
      await this.initRouter();
      await this.checkUrlParams();
      console.log('networkType: ', networkTypesRadio);
      //if defined, set to selected/active Network
      if (coinjs.asset.network) {
        networkTypesRadio.parent().removeClass('active');
        $('input[type=radio][name=radio_selectNetworkType][data-network-type=mainnet]').trigger('change').prop('checked', true).parent().addClass('active');
        var ice = $('input[type=radio][name=radio_selectNetworkType][data-network-type=mainnet]');
        //$('input[type=radio][name=radio_selectNetworkType][data-network-type='+coinjs.asset.network+']').prop('checked', true).parent().addClass('active');
        console.log('Network Type is already set!');
        //show providers for i.e Broadcast and UTXO API
        //wally_kit.settingsListAssets(coinjs.asset.network)
        //wally_kit.settingsListChainProviders(coinjs.asset.network)
      } else {
        //no network is choosen, set default to mainnet
        networkTypesRadio.parent().removeClass('active');
        $('input[type=radio][name=radio_selectNetworkType][data-network-type=mainnet]').prop('checked', true).parent().addClass('active');
        console.log('No Network Type! Set to Default!');
        throw ('No Network Type! Set to Default!')
      }
    } catch (e) {
      console.log('wally_kit.initNetwork ERROR: ', e)
    }
  }
  /*
  @ Quick Update Asset 
  */
  wally_kit.quickSetAsset = function(asset) {
    //settings page
    $('#settings .dropdown-select li[data-asset="' + asset + '"]').click();
    $('#settingsBtn').click();
    //bottom menu
    document.querySelector('#modalChangeAsset input[name="set-asset-group"][value="' + asset + '"]').checked = true;
  }
  /*
  @ get token badge (depending of chainModel and if it has any parent, like ERC20 tokens)
  */
  wally_kit.getParentTokenBadge = function(chain, protocol) {
    var parentTokenBadge = '';
    if (chain.includes('ERC20') || chain.includes('BEP-20') || chain.includes('PLG-20')) {
      if (chain.includes('ERC20'))
        parentTokenBadge = '<img src="./assets/images/crypto/ethereum-eth-logo.svg" class="icon16 icon-badge">';
      if (chain.includes('BEP20'))
        parentTokenBadge = '<img src="./assets/images/crypto/binance-bep-logo.svg" class="icon16 icon-badge">';
      if (chain.includes('PLG20'))
        parentTokenBadge = '<img src="./assets/images/crypto/polygon-plg-logo.svg" class="icon16 icon-badge">';
      /*
      if (protocol.protocol_data === undefined){
        //if (protocol.protocol_data.platform === undefined)  //this has no parent, clear the badge
          parentTokenBadge = '';
      }
      */
    }
    return parentTokenBadge;
  }
  /*
  @ show a list of Chains: Bitcoin, Litecoin, Bitbay etc..
  */
  wally_kit.settingsListAssets = function(network_var = 'mainnet') {
    console.log('===settingsListAssets===');
    try {
      wally_fn.network = network_var;
      console.log('Network: ' + network_var);
      console.log('Asset: ' + wally_fn.asset);
      //set network type
      //wally_kit.setNetwork(network_var, 'bitcoin', false);
      //element vars
      var assetSelectEl = $('#coinjs_network');
      assetSelectEl.text('');
      var assetSelectwIconsEl = $('#coinjs_network_select ul');
      assetSelectwIconsEl.text('');
      //iterate through the networks vars and add to the select-network-element
      var i = 0;
      for (var [key, value] of Object.entries(wally_fn.networks[network_var])) {
        if (i == 0) { //render button-select content
          //if (coinjs.asset !== undefined) {
          // $('#coinjs_network_select button').html('<img src="'+coinjs.asset.icon+'" class="icon32"> '+coinjs.asset.name+' ('+coinjs.asset.symbol+')'); 
          //$('#coinjs_network').val(coinjs.asset.slug).attr('selected','selected');
          //$('#coinjs_network option[value="'+coinjs.asset.slug+'"]').attr('selected','selected');
          //console.log('trigger select change');
          //}else
          $('#coinjs_network_select button').html('<img src="' + value.asset.icon + '" class="icon32"> ' + value.asset.name + ' (' + value.asset.symbol + ') ');
        }
        //check ERC/BEP/PLG-20 Compability
        var parentTokenBadge = wally_kit.getParentTokenBadge(value.asset.chainModel, value.asset.protocol);
        //selected asset
        if (coinjs.asset.slug == key) {
          assetSelectEl.append('<option value="' + key + '" data-icon="' + value.asset.icon + '" selected="selected">' + value.asset.name + ' (' + value.asset.symbol + ')</option>');
          $('#coinjs_network_select button').html('<div class="icon_with_badge"><img src="' + value.asset.icon + '" class="icon32">' + parentTokenBadge + '</div> ' + value.asset.name + ' (' + value.asset.symbol + ') <span class="badge badge-primary chain_model">' + value.asset.chainModel + '</span>');
          console.log('trigger selected icon');
        } else {
          assetSelectEl.append('<option value="' + key + '" data-icon="' + value.asset.icon + '" >' + value.asset.name + ' (' + value.asset.symbol + ')</option>');
          //$('#coinjs_network_select button').html('<img src="'+coinjs.asset.icon+'" class="icon32"> '+coinjs.asset.name+' ('+coinjs.asset.symbol+')'); 
          console.log('not triggered');
        }
        //list rest of assets
        assetSelectwIconsEl.append('<li data-icon="' + value.asset.icon + '" data-asset="' + key + '"><img src="' + value.asset.icon + '" class="icon32">' + parentTokenBadge + ' ' + value.asset.name + ' (' + value.asset.symbol + ') <div class="chain_model"><small><span class="badge badge-primary ">' + value.asset.chainModel + '</span></small></div></li>');
        i++;
      }
      this.settingsListNetworkProviders();
    } catch (e) {
      console.log('wally_kit.settingsListAssets ERROR:', e);
    }
  }
  /*
  @ Set Providers for chosen network!
  */
  wally_kit.settingsListNetworkProviders = function(asset_var) {
    console.log('===settingsListNetworkProviders===');
    var selectNetworkBroadcastAPI = $('#coinjs_broadcast_api').text('');
    var selectNetworkBroadcastAPIwIcons = $('#coinjs_broadcast_api_select ul').text('');
    var selectNetworkUtxoAPI = $('#coinjs_utxo_api').text('');
    var selectNetworkUtxoAPIwIcons = $('#coinjs_utxo_api_select ul').text('');
    //console.log('asset_var before: '+asset_var);
    //console.log('wally_fn.asset before: ', wally_fn.asset);
    //no asset, set the default asset 
    if (asset_var !== undefined) {
      //update select button content relative to asset
      $('#coinjs_network_select button').text('');
      if (wally_fn.networks[wally_fn.network][asset_var] !== undefined) {
        wally_fn.asset = asset_var;
        console.log('update asset to: ' + asset_var);
        console.log('updated asset to: ' + wally_fn.asset);
        //check ERC/BEP/PLG-20 Compability
        var parentTokenBadge = wally_kit.getParentTokenBadge(wally_fn.networks[wally_fn.network][asset_var].asset.chainModel, wally_fn.networks[wally_fn.network][asset_var].asset.protocol);
        $('#coinjs_network_select button').html('<div class="icon_with_badge"><img src="' + wally_fn.networks[wally_fn.network][asset_var].asset.icon + '" class="icon32"> ' + parentTokenBadge + '</div> ' + wally_fn.networks[wally_fn.network][asset_var].asset.name + ' (' + wally_fn.networks[wally_fn.network][asset_var].asset.symbol + ') <span class="badge badge-primary chain_model">' + wally_fn.networks[wally_fn.network][asset_var].asset.chainModel + '</span></small>');
      }
    }
    if (wally_fn.asset == '') {
      wally_fn.asset = 'bitcoin';
      console.log('update default asset to: ' + wally_fn.asset);
    }
    //$('#coinjs_network_select li[data-asset="'+asset_var+'"]').click();
    console.log('wally_fn.asset after: ', wally_fn.asset);
    $('#coinjs_broadcast_api_select button').text('');
    var i = 0,
      electrumXContent = '';
    for (var [key, value] of Object.entries(wally_fn.networks[wally_fn.network][wally_fn.asset].asset.api.broadcast)) {
      //show ElectrumX server in list
      if (key.includes('ElectrumX'))
        electrumXContent = ' <small>' + value + '</small>';
      selectNetworkBroadcastAPI.append('<option value="' + key + '" data-icon="" >' + key + '</option>');
      selectNetworkBroadcastAPIwIcons.append('<li data-icon="./assets/images/providers_icon.svg" data-broadcast-provider="' + value + '" data-broadcast-provider-name="' + key + '"><img src="./assets/images/providers_icon.svg" class="icon32"> ' + key + electrumXContent + ' <i class="icon bi"></i></li>');
      if (i == 0) { //set broadcast asset
        $('#coinjs_broadcast_api_select button').html('<img src="./assets/images/providers_icon.svg" class="icon32"> ' + key);
        wally_fn.provider.broadcast = key;
        console.log('Broadcast provider: ' + key);
      }
      electrumXContent = '';
      i++;
    }
    i = 0;
    $('#coinjs_utxo_api_select button').text('');
    for (var [key, value] of Object.entries(wally_fn.networks[wally_fn.network][wally_fn.asset].asset.api.unspent_outputs)) {
      //show ElectrumX server in list
      if (key.includes('ElectrumX'))
        electrumXContent = ' <small>' + value + '</small>';
      selectNetworkUtxoAPI.append('<option value="' + key + '" data-icon="" >' + key + '</option>');
      selectNetworkUtxoAPIwIcons.append('<li data-icon="./assets/images/providers_icon.svg" data-utxo-provider="' + value + '" data-utxo-provider-name="' + key + '"><img src="./assets/images/providers_icon.svg" class="icon32"> ' + key + electrumXContent + ' <i class="icon bi"></i></li>');
      if (i == 0) { //set utxo provider asset
        $('#coinjs_utxo_api_select button').html('<img src="./assets/images/providers_icon.svg" class="icon32"> ' + key);
        wally_fn.provider.utxo = key;
        console.log('UTXO provider: ' + key);
      }
      electrumXContent = '';
      i++;
    }
  }
  wally_kit.listAssets = function() {
    // List Assets
    var donationList = '';
    var assetListInModal = '';
    var assetListInModalDefault = '';
    var supportedAssets = '';
    for (var [key, value] of Object.entries(wally_fn.networks.mainnet)) {
      //console.log(key+':'+value.developer);
      //console.log(value.asset.icon)
      //list donation addresses
      donationList += ('<a class="list-group-item list-group-item-action" alt="Donate to us in ' + value.asset.name + ' (' + value.asset.symbol + ')" href="' + key + ':' + value.developer + '"><img src="' + value.asset.icon + '" class="icon32"> ' + value.asset.name + ' (' + value.asset.symbol + ')</a>');
      //list assets in modal dialog
      var parentTokenBadge = wally_kit.getParentTokenBadge(value.asset.chainModel, value.asset.protocol);
      assetListInModalDefault = (value.asset.slug == wally_fn.asset ? 'checked="checked"' : '') //set as default 
      assetListInModal += ('<tr data-asset="' + value.asset.slug + '">        <td>         <div class="icon_with_badge"><img class="icon icon32" src="' + value.asset.icon + '" /> ' + parentTokenBadge + '        </div>        </td>        <td>' + value.asset.symbol + ' <small class="d-block text-muted">' + value.asset.name + ' <span class="badge badge-primary chain_model">' + value.asset.chainModel + '</span></small></td>        <td>          <input type="radio" name="set-asset-group" value="' + value.asset.slug + '" ' + assetListInModalDefault + '/>        </td>       </tr>');
      //footer page supported assets
      supportedAssets += '<li class="mb-1"><a href="javascript:void(0)"><img src="' + value.asset.icon + '" class="icon tokens">' + value.asset.name + '</a></li>';
    }
    $('#about .donation_list').html('<div class="list-group">' + donationList + '</div>');
    $('#modalChangeAsset table tbody').html(assetListInModal);
    $('#footer_supported_assets').html(supportedAssets);
  }
  /*
   @ render supported assets
  */
  wally_kit.walletRenderAssets = function() {
    console.log('===wally_kit.walletRenderAssets===');
    let userAssetList = '';
    let userAssetListArr = [];
    //var walletAssets = $('#userWalletAssets');
    //walletAssets.text('');

    let loginType = login_wizard.profile_data.login_type;
    //for seed login
    if (loginType === 'seed' || loginType === 'mnemonic' ) {
      //render only if coin has support for the wallet client / bip brotocol
      var protocol = login_wizard.profile_data.seed.protocol.bip;
      //hdkey, bip32, bip44 has same address master keys
      protocol = (protocol === "bip32" || protocol === "bip44") ? "hdkey" : protocol;
    }

    //for (var [key, value] of Object.entries(wally_fn.networks[ wally_fn.network ])) {
    for (var [key, value] of Object.entries(wally_fn.networks[coinjs.asset.network])) {
      //coin doesnt support bip type, skip to next coin!
      if (loginType === 'seed' || loginType === 'mnemonic' ) {
        if (!wally_fn.networks[coinjs.asset.network][key][protocol])
          continue; // Skip the current iteration and move to the next one
      }

      userAssetListArr.push({'name': value.asset.name, 'icon': value.asset.icon, 'chainModel': value.asset.chainModel, 'symbol': value.asset.symbol, 'slug': key});

    }
    //add user assets to the list
    // $('#userWalletAssets').html(userAssetList);
    wally_fn.tpl.seed.viewWalletAssets.render(userAssetListArr);
  };
  /*
   @ generate a list of wallet addresses from an object, 'addresses' and 'chainModel' in the object
  */
  wally_kit.walletRenderAddressesOld = function(addrObj) {
    console.log('===wally_kit.walletRenderAddressesOld=== ', addrObj);
    //var addr = login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses_supported;
    var addr = addrObj.addresses;
    var chain = addrObj.chainModel;
    var receiveArr = [];
    var receiveAddressesTotal = 0;
    
    // init address balance structure
    var init_balance = {
      "total_sent": 0,
      "total_received": 0,
      "final_balance": 0,
      "n_tx": 0
    };
    
    if (chain === 'utxo') {
      if (addr.compressed) {
        // Legacy Address
        //addr.compressed.key
        //addr.compressed.public_key
        //addr.compressed.address
        var blockieIcon = makeBlockie(addr.compressed.address);
        receiveArr.push({'blockieIcon': blockieIcon, 'addr': addr.compressed.address, 'derivedPath': 'Compressed Legacy', 'path': false, 'ext': init_balance});
        receiveAddressesTotal++;
        // Bech32 Address (p2wpkh)
        if (addr.compressed?.bech32) {
          //addr.compressed.bech32.address
          //addr.compressed.bech32.redeemscript
          var blockieIcon = makeBlockie(addr.compressed.bech32.address);
          receiveArr.push({'blockieIcon': blockieIcon, 'addr': addr.compressed.bech32.address, 'derivedPath': 'Bech32', 'path': false, 'ext': init_balance});
          receiveAddressesTotal++;
        }
        ///P2SH Segwit Address
        if (addr.compressed?.segwit) {
          //addr.compressed.bech32.address
          //addr.compressed.bech32.redeemscript
          var blockieIcon = makeBlockie(addr.compressed.segwit.address);
          receiveArr.push({'blockieIcon': blockieIcon, 'addr': addr.compressed.segwit.address, 'derivedPath': 'SegWit', 'path': false, 'ext': init_balance});
          receiveAddressesTotal++;
        }
      }
      if (addr.uncompressed) {
        //addr.uncompressed.key
        //addr.uncompressed.public_key
        //addr.uncompressed.address
        var blockieIcon = makeBlockie(addr.uncompressed.address);
        receiveArr.push({'blockieIcon': blockieIcon, 'addr': addr.uncompressed.address, 'derivedPath': 'Uncompressed Legacy', 'path': false, 'ext': init_balance});
        receiveAddressesTotal++;
      }
    } else if (chain === 'account') {

      console.log('addr: ', addr);

      var blockieIcon = makeBlockie(addr.address);
      receiveArr.push({'blockieIcon': blockieIcon, 'addr': addr.address, 'derivedPath': 'EVM', 'ext': init_balance});
      receiveAddressesTotal++;
    }
    wally_fn.tpl.seed.viewReceiveAddresses.render(receiveArr);
    //password/key login has no change addresses, set to empty!
    //wally_fn.tpl.seed.viewChangeAddresses.render([]);
    coinbinf.changeAddresses.addClass('hidden');
    $('.coin_receive_addresses_total').text(receiveAddressesTotal);

  }

  /*
   @ generate a list of wallet addresses from an object, 'addresses' and 'chainModel' in the object
  */
  wally_kit.walletRenderPasswordAddresses = async function(addrObj) {
    console.log('===wally_kit.walletRenderPasswordAddresses=== ', addrObj);
    //var addr = login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses_supported;
    var addresses = addrObj.addresses.receive;  //password login, has only receive addresses
    var pubkey ='', privkey = '', privkeyhex = '';
    var chain = addrObj.chainModel;
    var receiveArr = [];
    var receiveAddressesTotal = addresses.length;
    var coin = coinjs.asset.symbol;

    console.log('addresses: ', addresses);
    /*// address balance structure
    {
      "total_sent": 0,
      "total_received": 0,
      "final_balance": 0,
      "n_tx": 0
    };
    */
    
    for (var i = 0; i < receiveAddressesTotal; i++) {
    
      var balance = addresses[i].ext;
      var blockieIcon = makeBlockie(addresses[i].address);
      pubkey = addresses[i].pubkey;
      privkey = addresses[i].wif;
      privkeyhex = addresses[i].privkey;

      // derived path in this case is compressed, uncompressed, bech32, segwit, evm etc...
      receiveArr.push({'coin': coin, 'blockieIcon': blockieIcon, 'addr': addresses[i].address, 'pubkey': pubkey, 'privkey': privkey, 'privkeyhex': privkeyhex, 'derivedPath': addresses[i].type, 'path': true, 'ext': balance});
    }

    console.log('receiveArr: ', receiveArr);

    wally_fn.tpl.seed.viewReceiveAddresses.render(receiveArr);
    //password/key login has no change addresses, set to empty!
    //wally_fn.tpl.seed.viewChangeAddresses.render([]);
    coinbinf.changeAddresses.addClass('hidden');
    $('.coin_receive_addresses_total').text(receiveAddressesTotal);

  }

  /*
   @ generate a list of wallet addresses for a seed
  */
  wally_kit.walletRenderSeedAddresses = function(addressType = 'both') {
    console.log('===wally_kit.walletRenderSeedAddresses===');
    try {
      /*var protocol = login_wizard.profile_data.generated[coinjs.asset.slug].seed.protocol.bip;

      if (!coinjs[protocol]) {
        throw('===wally_kit.walletRenderSeedAddresses=== ERROR: Coin has not support for '+ protocol);
        return ;
      }
      */
      var derived = login_wizard.profile_data.generated[coinjs.asset.slug][0].addresses;
      var coinReceivePath = login_wizard.profile_data.generated[coinjs.asset.slug].seed.path.receive;
      var coinChangePath = login_wizard.profile_data.generated[coinjs.asset.slug].seed.path.change;
      var pathIsHardened = login_wizard.profile_data.generated[coinjs.asset.slug].seed.path.isHardened;
      var receiveArr = [];
      var changeArr = [];
      var addr = '', pubkey ='', privkey = '', privkeyhex = '';
      var path = '';
      var derivedPath = '';
      var hardenedAddress = "";
      var receiveAddressesTotal = 0;
      var changeAddressesTotal = 0;
      var coin = coinjs.asset.symbol;

      // address balance structure
      /*var balance = {
        "total_sent": 0,
        "total_received": 0,
        "final_balance": 0,
        "n_tx": 0
      };
      */
      var balance;

      if (pathIsHardened)
        hardenedAddress = "'";
      if (addressType === 'both' || addressType === 'receive') {
        receiveAddressesTotal = (derived.receive).length;
        for (var i = 0; i < receiveAddressesTotal; i++) {
          derivedPath = coinReceivePath + '/' + i + hardenedAddress;
          if (derived.receive[i].address.redeemscript === undefined) //check if redeemscript is present
            addr = derived.receive[i].address;
          else
            addr = derived.receive[i].address.address;

          pubkey = derived.receive[i].pubkey;
          privkey = derived.receive[i].wif;
          privkeyhex = derived.receive[i].privkey;

          balance = derived.receive[i].ext
          var blockieIcon = makeBlockie(addr);
          receiveArr.push({'coin': coin, 'blockieIcon': blockieIcon, 'addr': addr, 'pubkey': pubkey, 'privkey': privkey, 'privkeyhex': privkeyhex, 'derivedPath': derivedPath, 'path': true, 'ext': balance});

        }
      }

      if (addressType === 'both' || addressType === 'change') {
        changeAddressesTotal = (derived.change).length;
        for (var i = 0; i < (derived.change).length; i++) {
          derivedPath = coinChangePath + '/' + i + hardenedAddress;
          if (derived.change[i].address.redeemscript === undefined) //check if redeemscript is present
            addr = derived.change[i].address;
          else
            addr = derived.change[i].address.address;

          pubkey = derived.change[i].pubkey;
          privkey = derived.change[i].wif;
          privkeyhex = derived.change[i].privkey;

          var blockieIcon = makeBlockie(addr);
          changeArr.push({'coin': coin, 'blockieIcon': blockieIcon, 'addr': addr, 'pubkey': pubkey, 'privkey': privkey, 'privkeyhex': privkeyhex, 'derivedPath': derivedPath, 'path': true, 'ext': balance});

        }
      }
      //add user assets to the list
      if (receiveArr.length) {
        coinbinf.receiveAddresses.removeClass('hidden');
        $('.coin_receive_addresses_total').text(receiveAddressesTotal);
        console.log('receiveArr: ', receiveArr);
        wally_fn.tpl.seed.viewReceiveAddresses.render(receiveArr);
      } else
        coinbinf.receiveAddresses.addClass('hidden');

      if (changeArr.length) {
        coinbinf.changeAddresses.removeClass('hidden');
        $('.coin_change_addresses_total').text(changeAddressesTotal);
        console.log('changeArr: ', changeArr);
        wally_fn.tpl.seed.viewChangeAddresses.render(changeArr);
      } else
        coinbinf.changeAddresses.addClass('hidden');

    } catch (e) {
      console.log('===wally_kit.walletRenderSeedAddresses=== ERROR: ', e);
    }

    $('.coin_name').text(coinjs.asset.name)
    $('.coin_symbol').text(coinjs.asset.symbol)
  }
  /**
   * Fetches coin information from Coingecko API and updates wallet assets data.
   * @function
   */
  wally_kit.getCoinInfo = async function() {
    console.log('===wally_kit.getCoinInfo===');
    try {
      //fetch coininfo from Coingecko
      // Get the current timestamp
      var currentTimestamp = new Date().getTime();
      // Check if enough time has passed since the last API call (e.g., 60 seconds)
      if (currentTimestamp - login_wizard.profile_data.api.coingecko >= 60000) {
        //if (currentTimestamp - wally_kit.ApiCallTimestamp.coingecko >= 60000) {
        // You can make the API call because 60 seconds have passed since the last call
        // Assuming you have your login_wizard.profile_data.generated object
        var walletAssets = login_wizard.profile_data.generated;
        var walletApiData = login_wizard.profile_data.api;
        //get user's assets "coinids"
        var coinids = Object.keys(login_wizard.profile_data.generated).join(",");
        // API URL
        //var apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,bitbay,potcoin,reddcoin,lynx,artbyte,infiniloop&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y&locale=en";
        var apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" + coinids + "&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y&locale=en";
        // Fetch data from Coingecko
        $.ajax({
          url: apiUrl,
          method: "GET",
          success: function(data) {
            var currentTimestamp = new Date().getTime();
            data.forEach(function(coin) {
              var coinId = coin.id;
              //add assetKey if undefined
              if (walletApiData.assets[coinId] === undefined) {
                walletApiData.assets[coinId] = {};
                console.log('walletApiData asset not found in api call: ', coinId)
              }
              //check if any coin is matched from the Coingecko API
              if (walletAssets[coinId]) {
                coin.apiname = 'Coingecko';
                coin.apitime = currentTimestamp; // Update the api_timestamp in the object
                walletApiData.assets[coinId].coininfos = coin;
              }
            });
            //reference update doesnt work, bypass it by manually updating the profile variable
            walletApiData.coingecko = currentTimestamp;
            //login_wizard.profile_data.api = walletApiData;
            //login_wizard.profile_data.api.assets = walletApiData.assets;
            console.log('walletApiData.coingecko: ', walletApiData.coingecko)
            console.log('walletApiData.coingecko currentTimestamp: ', currentTimestamp)
            console.log('walletApiData storage_s before: ', storage_s.get('wally.profile'));
            wally_fn.sleep(100);
            storage_s.set('wally.profile', login_wizard.profile_data);
            console.log('walletApiData storage_s after: ', storage_s.get('wally.profile'));
            console.log('walletApiData profile_data: ', login_wizard.profile_data);
          },
          error: function(error) {
            console.error("Error fetching data from Coingecko:", error);
          }
        });
        //login_wizard.profile_data.api.assets = walletApiData.assets;
        // Update the last API call timestamp
        //wally_kit.ApiCallTimestamp.coingecko = currentTimestamp;
        //login_wizard.profile_data.api.coingecko = currentTimestamp;
      } else {
        // Rate limit exceeded, do not make the API call
        console.log("wally_kit.getCoinInfo ERROR: Coingecko Rate limit exceeded. Skipping API call.");
      }
    } catch (e) {
      console.log('wally_kit.getCoinInfo ERROR: ', e);
      Router.navigate('logout');
    }
  }


/***************CryptoProviderAPI Requests - START *************************/


/**
 * Process and update address balance information for the EVM API provider.
 *
 * @param {Object} apiResponse - The API response containing address data.
 * @param {Object} addressesData - Object containing receive and change addresses.
 */
function processAddressesForEvm(apiResponse, addressesData) {
  const apiResult = apiResponse.result;

  if (!apiResult || !Array.isArray(apiResult) || apiResult.length === 0) {
    console.log('Addresses are empty for the EVM API provider!');
    return;
  }

  /**
   * Process addresses of a specific type and update balance information.
   *
   * @param {string} addressType - The type of address (e.g., "receive" or "change").
   * @param {Array} addresses - Array of addresses of the specified type.
   */
  function processAddress(addressType, addresses) {
    addresses.forEach((address, i) => {
      const matchingApiResponse = apiResult.find(apiAddress => apiAddress.account === address);

      if (matchingApiResponse) {
        const balanceWei = matchingApiResponse.balance || '0';
        const balanceEth = wweb3.utils.fromWei(balanceWei, 'ether');
        
        const balanceInfo = {
          final_balance: balanceEth, // Convert Wei to Ether
          // Other properties can be extracted and added here if needed
        };

        wally_fn.setAddressBalanceInfo(addressType, i, balanceInfo);
        console.log(`EVM - ${addressType} Address: found balance: ${address}`);
      } else {
        console.log(`EVM - ${addressType} Address: no balance: ${address}`);
      }
    });
  }

  processAddress('receive', addressesData.receive);
  processAddress('change', addressesData.change);
}



/**
 * Process and update address balance information for the "cryptoid.info" provider.
 *
 * @param {Object} apiResponse - The API response containing address data.
 * @param {Object} addressesData - Object containing receive and change addresses.
 */
function processAddressesForCryptoId(apiResponse, addressesData) {
  const apiAddresses = apiResponse.addresses;

  if (!apiAddresses.length) {
    console.log('Addresses are empty for Cryptoid!');
    return;
  }

   /**
   * Process addresses of a specific type and update balance information.
   *
   * @param {string} addressType - The type of address (e.g., "receive" or "change").
   * @param {Array} addresses - Array of addresses of the specified type.
   */
  function processAddress(addressType, addresses) {
    addresses.forEach((address, i) => {
      const matchingApiResponse = apiAddresses.find(apiAddress => apiAddress.address === address);
      if (matchingApiResponse) {
        delete matchingApiResponse.address;
        wally_fn.setAddressBalanceInfo(addressType, i, matchingApiResponse);
        console.log(`Cryptoid - ${addressType} Address: found balance: ${address}`);
      } else {
        console.log(`Cryptoid - ${addressType} Address: no balance: ${address}`);
      }
    });
  }

  processAddress('receive', addressesData.receive);
  processAddress('change', addressesData.change);
}

/**
 * Process and update address balance information for the "blockchain.info" provider.
 *
 * @param {Object} apiResponse - The API response containing address data in the specified format.
 * @param {Object} addressesData - Object containing receive and change addresses.
 */
function processAddressesForBlockchainInfo(apiResponse, addressesData) {
  /**
   * Object with address balances from the API response.
   * @type {Object}
   */
  const addressBalances = apiResponse;

  /**
   * Process addresses of a specific type and update balance information.
   *
   * @param {string} addressType - The type of address (e.g., "receive" or "change").
   * @param {Array} addresses - Array of addresses of the specified type.
   */
  function processAddress(addressType, addresses) {
    addresses.forEach((address, i) => {
      /**
       * Balance information for the current address.
       * @type {Object|undefined}
       */
      const balanceInfo = addressBalances[address];

      if (balanceInfo) {
        wally_fn.setAddressBalanceInfo(addressType, i, balanceInfo);
        console.log(`Blockchain.info - ${addressType} Address: found balance: ${address}`);
      } else {
        console.log(`Blockchain.info - ${addressType} Address: no balance: ${address}`);
      }
    });
  }

  // Process receive and change addresses
  processAddress('receive', addressesData.receive);
  processAddress('change', addressesData.change);
}



async function fetchApiDataWithRateLimit(apiUrl, providerName) {
  return await apiProvider.makeRateLimitedRequest(providerName, async () => {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  });
}



/**
 * Retrieves the balance of a specific cryptocurrency coin.
 * @function
 */
/**
 * Fetch API response from the given URL using async/await.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Object} - The parsed JSON response.
 */
async function fetchApiResponse(url) {
  const apiResponse = await fetch(url);
  /*const apiResponse = await (async () => {
      try {
        const response = await new Promise((resolve) => {
          coinjs.ajax(url, resolve, 'GET');
        });
        console.log('Response received1:', response);
        // You can add your code to process the response data here
        return $.parseJSON(response);
      } catch (error) {
        console.error('Error:', error);
        console.error('Request failed:', response.status, response.statusText);
        return;
      }
    })();
    */

  if (!apiResponse.ok) {
    throw new Error(`Request failed: ${apiResponse.status} ${apiResponse.statusText}`);
  }

  return await apiResponse.json();
}

/**
 * Build the API URL for the specified provider.
 *
 * @param {string} providerName - The name of the API provider.
 * @param {string} coinTicker - The ticker symbol (e.g., BTC, LTC, ETH).
 * @param {Array} mergedAddresses - The merged array of addresses.
 * @returns {string} - The API URL.
 */
function buildApiUrl(providerName, coinTicker, mergedAddresses) {
  const network = wally_fn.network;
  const chainType = wally_fn.chainModel;
  const unifiedProviders = apiProvider.getUnifiedProviders(chainType, network);
  const coinChain = wally_fn.coinChainIs();
  const coinName = coinjs.asset.slug;
  const networkType = coinjs.asset.network;

  // Check if the provider exists in unified providers
  if (unifiedProviders[providerName]) {
    // Use the provider from unified providers to build the URL
    const provider = unifiedProviders[providerName];
    return apiProvider.buildProviderURL(provider, {
      coin: coinTicker,
      address: mergedAddresses,
    });
  } else {
    // If the provider is not in unified providers, try coin-specific providers
    const coinProviders = apiProvider.getCoinProviders(coinName, coinChain, networkType);
    const provider = coinProviders[providerName];

    if (!provider) {
      throw new Error(`No API Provider "${providerName}" for the coin: ${coinTicker}`);
    }

    // Build the URL using the coin-specific provider
    return apiProvider.buildProviderURL(provider, {
      address: mergedAddresses,
    });
  }
}

/**
 * Process and update address balance information based on the provider.
 *
 * @param {string} providerName - The name of the API provider.
 */
wally_kit.apiGetCoinBalance = async function (providerName) {
  try {
    console.log('===wally_kit.apiGetCoinBalance===', providerName);

    const coinTicker = coinjs.asset.symbol;
    const addressesData = wally_fn.getReceiveAndChangeAddresses();
    const mergedAddresses = [...addressesData.receive, ...addressesData.change];
    let url = buildApiUrl(providerName, coinTicker, mergedAddresses);

    /*
    CORS issue fixed By Cryptoid.info - confirm iceee
    if (url.includes('chainz.cryptoid.info/btc')) {
      url = url.replace('chainz.cryptoid', 'btc.cryptoid');
    }
    */

    console.log('apiProvider.providerRateLimits before: ', apiProvider.providerRateLimits);
    //const apiResponse = await fetchApiResponse(url);
    const apiResponse = await fetchApiDataWithRateLimit(url, providerName);
    
    if (!apiResponse)
      throw('Rate Limit exceeded!')

    console.log('Response on addresses balance:', apiResponse);

    console.log('apiProvider.providerRateLimits after: ', apiProvider.providerRateLimits);
    
    //adapt the response from the API providers (balance info object info)
    const coinChain = wally_fn.coinChainIs();

    // Call the appropriate function based on the provider
    if (coinChain == 'utxo') {
      if (providerName === 'cryptoid.info') {
        processAddressesForCryptoId(apiResponse, addressesData);
      } else if (providerName === 'blockchain.info') {
        processAddressesForBlockchainInfo(apiResponse, addressesData);
      } else {
        console.log(`Unsupported provider: ${providerName}`);
      }
    } else if (coinChain == 'evm') {
      processAddressesForEvm(apiResponse, addressesData);
    }


    
  } catch (error) {
    const modalTitle = 'API Provider';
    const modalMessage = `Unable to get Balance!<br>${error}`;
    custom.showModal(modalTitle, modalMessage, 'danger', {
      'buttons': {
        'cancel': false
      }
    });
  }
};


/**
 * Retrieves a list of unspent transaction outputs (UTXOs) for a cryptocurrency coin.
 * @function
 */
wally_kit.apiGetListUnspent = async function() {
  // Your code for fetching list of UTXOs here
}

/**
 * Broadcasts a signed raw transaction to the network.
 * @function
 */
wally_kit.apiPushRawTX = async function() {
  // Your code for broadcasting raw transaction here
}




/**
 * Get a unified provider for a specific asset and API service.
 *
 * @param {string} asset - The asset symbol (e.g., 'bitcoin', 'ethereum').
 * @param {string} apiService - The API service (e.g., 'balance', 'listunspent', 'pushrawtx').
 * @param {string} chainType - The type of blockchain (e.g., 'utxo', 'evm').
 * @param {string} network - The network type (e.g., 'mainnet', 'testnet').
 * @returns {Object|null} - The selected provider with its type ('unified') or null if not found.
 */
wally_kit.apiGetUnifiedProviderForCoin = function(asset, apiService, chainType, network) {
  

  try {
    const providersKey = wally_fn.networks[network][asset].asset.api.providers[apiService];
    if (providersKey) {
      // Check if there are any unified providers for the specified API service
      const unifiedProviders = apiProvider.getUnifiedProviders(chainType, network);

      for (const providerName in providersKey) {
        if (unifiedProviders && unifiedProviders[providerName]) {
          // Return the unified provider name and mark it as a unified provider
          return { name: providerName, type: 'unified' };
        }
      }
    }
  } catch (error) {
    console.error('Error when getting unified provider:', error);
  }

  // If no suitable unified providers are found, return null
  return null;
}

/**
 * Get a coin-specific provider for a specific asset and API service.
 *
 * @param {string} asset - The asset symbol (e.g., 'bitcoin', 'ethereum').
 * @param {string} apiService - The API service (e.g., 'balance', 'listunspent', 'pushrawtx').
 * @param {string} chainType - The type of blockchain (e.g., 'utxo', 'evm').
 * @param {string} network - The network type (e.g., 'mainnet', 'testnet').
 * @returns {Object|null} - The selected provider with its type ('coin-specific') or null if not found.
 */
wally_kit.getCoinProviderForCoin = function(asset, apiService, chainType, network) {
  

  try {
    const providersKey = wally_fn.networks[network][asset].asset.api.providers[apiService];
    if (providersKey) {
      // Check if there are any coin-specific providers for the specified API service
      const coinProviders = apiProvider.getCoinProviders(asset, chainType, network);

      for (const providerName in providersKey) {
        if (coinProviders && coinProviders[providerName]) {
          // Return the coin-specific provider name and mark it as a coin-specific provider
          return { name: providerName, type: 'coin-specific' };
        }
      }
    }
  } catch (error) {
    console.error('Error when getting coin-specific provider:', error);
  }

  // If no suitable coin-specific providers are found, return null
  return null;
}
/*
// Example usage:
const asset = 'bitcoin';
const apiService = 'balance'; // 'balance', 'listunspent', etc.
const chainType = 'utxo'; // 'utxo', 'evm', etc.
const network = wally_fn.network; // 'mainnet' or 'testnet'
let provider;

const selectedUnifiedProvider = wally_kit.apiGetUnifiedProviderForCoin(asset, apiService, chainType, network);

try {
  if (selectedUnifiedProvider) {
    provider = selectedUnifiedProvider;
  } else {
    const selectedCoinProvider = wally_kit.getCoinProviderForCoin(asset, apiService, chainType, network);
    provider = selectedCoinProvider;
  }
} catch (error) {
  console.error('Error when selecting the provider:', error);
}

if (provider) {
  console.log(`Selected ${provider.type} provider for ${asset} (${network}) - ${apiService}: ${provider.name}`);
} else {
  console.log(`No providers found for ${asset} (${network}) - ${apiService}`);
}



*/
  /*
  get electrumx active nodes:
  https://electrum-status.dragonhound.info/api/v1/electrums_status
  https://1209k.com/bitcoin-eye/ele.php?chain=lynx
  https://stats.kmd.io/atomicdex/electrum_status/
  
  */

/**
 * Recursively collect all coin providers from a nested object.
 *
 * @param {Object} obj - The object containing coin providers information. (coinjs.asset.api.providers)
 * @param {number} depth - The current depth level (used for recursion, default is 0).
 * @returns {Object} - An object containing all coin providers.
 */
wally_kit.collectAllCoinProviders = function (obj, depth = 0) {
  const result = {};
  const spaces = '  '.repeat(depth);
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      result[key] = wally_kit.collectAllCoinProviders(obj[key], depth + 1);
    } else {
      result[key] = obj[key];
    }
  }

  return result;
}



/**
 * Recursively collect all coin providers for a specific API service from a nested object.
 *
 * @param {Object} obj - The object containing coin providers information.
 * @param {string} apiService - The specific API service to collect providers for.
 * @param {Array} results - An array to collect the provider objects.
 */
wally_kit.getCoinProvidersForApiService = function (obj, apiService, results = []) {
  if (apiService in obj) {
    for (const providerName in obj[apiService]) {
      results.push({ name: providerName, params: obj[apiService][providerName].params });
    }
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      wally_kit.getCoinProvidersForApiService(obj[key], apiService, results);
    }
  }

  return results;
}
/*
Use like:

var apiService = 'balance';

var providersForApiService = wally_kit.getCoinProvidersForApiService(coinjs.asset.api.providers, 'apiService');

console.log(providersForApiService);

*/



/***************CryptoProviderAPI Requests - END *************************/


  /*
  @ Switch Blockchain Network Settings
  */
  /*
  wally_kit.settingsListProviders = function (network_var = 'mainnet', asset_var = 'bitcoin') {

    if(network_var == 'mainnet')
      network_var = wally_fn.networks.mainnet;
    else
      network_var = wally_fn.networks.testnet;

    if(coinjs.asset.network)
      network_var = wally_fn.networks[coinjs.asset.network];

    //element vars
    var selectNetwork = $('#coinjs_network').text('');
    var selectNetworkBroadcastAPI = $('#coinjs_broadcast_api').text('');
    var selectNetworkUtxoAPI = $('#coinjs_broadcast_utxo').text('');


    //iterate through the networks vars and add to the select-elements
    var networksMainnet = wally_fn.networks.mainnet;
    console.log('networksMainnet: ', network_var);
    for (var [key, value] of Object.entries(network_var)) {
      console.log(key);
      console.log('property: ', value.asset.name);
      console.log('property: ', value.asset.symbol);
      console.log('property: ', value.asset.icon);

      selectNetwork.append('<option value="'+key+'" data-icon="'+value.asset.icon+'" >'+value.asset.name+' ('+value.asset.symbol+')</option>');

      
      for (var [bkey, bvalue] of Object.entries(networksMainnet[key].asset.api.broadcast)) {
        console.log(bkey);
        console.log('property: ', bvalue);

        selectNetworkBroadcastAPI.append('<option value="'+bvalue+'" data-icon="" >'+bkey+'</option>');
      }
    }
   
  }
  */
  /*
   https://easings.net/
   @ Scroll to Element or Top
  */
  wally_kit.scrollToElement = function(elId, offset) {
    var scrollContainer = window.document.scrollingElement || window.document.documentElement || window.document.body;
    var el = document.getElementById(elId);
    if (el === null)
      return;
    var sEl = scrollContainer,
      box = el.getBoundingClientRect(),
      sElPos, distance, duration,
      compStyles = window.getComputedStyle(sEl),
      topBorderOffset = parseInt(compStyles.getPropertyValue('border-top-width'));
    //offset = topBorderOffset + (offset || 0);
    if (elId == "home" || elId == "about")
      offset = 0;
    else
      offset = box.top + pageYOffset - offset;
    distance = Math.abs(pageYOffset - offset);
    distance = Math.min(distance, 500);
    duration = Math.max(distance / 200 * 1000, 800) / 3;
    anime({
      targets: sEl,
      scrollTop: offset,
      duration: duration,
      easing: 'easeInOutCirc' //easeOutQuart
    });
  }
  wally_kit.removeActivePages = function() {
    $('.landing_box').addClass("hidden");
    //document.querySelector('.landing_box').classList.add("hidden");
    var tabPages = document.querySelectorAll('#tab-content .tab-pane.tab-content.active');
    tabPages.forEach(allTabs => {
      if (allTabs.classList.contains('active')) {
        allTabs.classList.remove("active");
        console.log("navigationPageHideAll --> active pages removed!");
      }
    });
  }
  /*
   @ Handles the navigation to the selected page
   use transition, animation, scroll etc...
  */
  wally_kit.pageNavigator = function(_elId_ = Router.urlParams.page) {
    //scroll only smaller screens
    if (window.innerWidth <= 768)
      wally_kit.scrollToElement(_elId_, 10);
    return;
    /*
    var target = document.getElementById(_elId_);
    if(target === null)
              return;


    if(_elId_ == "home" || _elId_ == "about"){
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      //window.scrollBy({ top: -400, left: 0, behavior: 'smooth' });
      //console.log('scroll top')
    }else{
      //console.log('scroll specific')
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    */
  }
  wally_kit.pageHandler = function(pageHash, show = false) {
    try {
      console.log('=wally_kit.pageHandler=');
      console.log('Router.urlParams.page: ' + Router.urlParams.page);
      //if any other page param is set other then supported pages, throw error
      /*
      if (!wally_fn.navigationPages.hasOwnProperty(Router.urlParams.page) )
        if (Router.urlParams.page != '')
          throw ('...')
      

      */
      //remove active-class from pages
      this.removeActivePages();
      if (!wally_fn.navigationPages.hasOwnProperty(Router.urlParams.page)) {
        throw ('...');
      }
      console.log('Router.urlParams.page: ' + Router.urlParams.page);
      //show landing page for specific active page/tab
      if (Router.urlParams.page == "home" || Router.urlParams.page == "about" || Router.urlParams.page == "way-token") {
        $('.landing_box').removeClass("hidden");
      } else {
        $('.landing_box').addClass("hidden");
      }
      /*
      //Check if url hash exists
      if(location.hash.length > 0) {
        console.log('yep')
      }else {
         console.log('nop')
      }
      */
      //check if page is available for the current chainModel
      //check if asset is supported on the navigated page
      if (wally_fn.navigationPages[Router.urlParams.page].includes(wally_fn.chainModel) || wally_fn.navigationPages[Router.urlParams.page].includes('all')) {
        console.log('=page "' + Router.urlParams.page + '" is availabe for the chainModel: ' + wally_fn.navigationPages[Router.urlParams.page].toString());
        //add active to navigated page element
        if (Router.urlParams.page != 'home') {
          document.getElementById(Router.urlParams.page).classList.add("active");
          //smooth scroll to active page
          this.pageNavigator();
        } else {
          document.getElementById('home').classList.add("active");
          $('.landing_box').removeClass("hidden");
          //no active pag is set, show start page/landing page
        }
      } else {
        console.log(Router.urlParams.page + ' is ONLY availabe for: ' + wally_fn.navigationPages[Router.urlParams.page].toString());
        console.log('chainModel is : ', wally_fn.chainModel);
        var modalTitle = 'Whooops...';
        var modalMessage = '<div class="alert alert-danger text-center"><p>This page is not available for this asset yet.</p> <p><img src="' + coinjs.asset.icon + '" class="icon-center icon64 mt-3 mb-2"></p> <strong>' + coinjs.asset.name + ' (' + coinjs.asset.symbol + ') <br>' + coinjs.asset.network + '</strong> </div>';
        custom.showModal(modalTitle, modalMessage);
        //no active page is set, show start-page
        Router.navigate('home');
      }
    } catch (e) {
      document.getElementById('error_404').classList.add("active");
      console.log('wally_kit.pageHandler ERROR: ', e);
      /*
      var modalTitle = '404 Error';
      var modalMessage = '<div class="alert alert-danger text-center"><p>Whooops 404!</p> <p><img src="./assets/images/logo/wally_logo_new.svg" class="icon-center icon128 mt-3 mb-2" style="width: 240px;"></p> </div>';
      custom.showModal(modalTitle, modalMessage);
      */
      Router.navigate('error_404');
    }
  }


  //update wallet menu and the links relative to the choosen asset
    wally_kit.pageMenuUpdate = function(asset) {
      
      $(".walletMenu a[data-wallet-menu-update]").each(function() {

      //$("#walletOptions a").each(function() {
        var originalHref = $(this).attr("href");
        // Remove any existing coin name from the originalHref
        var newPath = originalHref.split('/').slice(0, -1).join('/');
        // Add the new coin name to the path
        var newHref = newPath + "/" + asset;
        //console.log('newHref: ', newHref)
        $(this).attr("href", newHref);
        $(this).attr("data-asset", asset);
      });
    }


  /*
https://benalman.com/projects/jquery-hashchange-plugin/

https://gist.github.com/atelierbram/18d7489b81dc9acf0747

https://alloyui.com/api/files/yui3_src_history_js_history-hash.js.html#
*/
})();
$(document).ready(function() {
  // Auto-upgrade Math.random with a more secure implementation only if crypto is available
  //https://github.com/mdn/sprints/issues/2510
  (function() {
    var rng = window.crypto || window.msCrypto;
    if (rng === undefined)
      return;
    // Source: https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues#Examples
    Math.random = function() {
      return rng.getRandomValues(new Uint32Array(1))[0] / 4294967296;
    };
  })();
  /*@ Copy text to clipboard */
  wally_kit.copyContent = $('body [data-copy-content]');
  wally_kit.copyContent.click(function(e) {
    console.log('===wally_kit.copyContent===');
    var contentToCopy = $(this).attr('data-copy-content');
    navigator.clipboard.writeText(`${contentToCopy}`);
    //$(this).attr('title', 'Copied');
    //change tooltip to copied, if tooltip target exists!
    var tooltipTarget = $(this).attr('data-tooltip-id');
    console.log('tooltipTarget: ', tooltipTarget);
    if (tooltipTarget) {
      var tooltipBox = $('#' + tooltipTarget + ' .jBox-content')
      var tooltipBoxOriginalContent = tooltipBox.text();
      tooltipBox.text('Copied!');
      //set back the default content for the tooltip
      setTimeout(() => {
        tooltipBox.text(tooltipBoxOriginalContent);
      }, 2000);
    }
  });
  /*<<< START PROMISE FUNCTION*/
  /*
  let url = "https://api.chucknorris.io/jokes/random";

  // A function that returns a promise to resolve into the data //fetched from the API or an error
  let getChuckNorrisFact = (url) => {
    return new Promise(
      (resolve, reject) => {
        request.get(url, function(error, response, data){
          if (error) reject(error);
            
  let content = JSON.parse(data);
          let fact = content.value;
          resolve(fact);
        })
     }
   );
  };

  getChuckNorrisFact(url).then(
     fact => console.log(fact) // actually outputs a string
  ).catch(
     error => console.(error)
  );
  */
  var promiseIt = function(data) {
    return new Promise((resolve, reject) => {
        // ...  
        return;
      })
      .then(data => {
        /* Do something with data */ })
      .catch(err => {
        /* Handle error */ });
  }
  //https://github.com/g6123/promisify
  //https://www.freecodecamp.org/news/how-to-make-a-promise-out-of-a-callback-function-in-javascript-d8ec35d1f981/
  //https://zellwk.com/blog/converting-callbacks-to-promises/
  /*
  const shootPeasPromise = (...args) => {
    return new Promise((resolve, reject) => {
      // This is not a Node styled callback. 
      // 1. data is the first argument 
      // 2. err is the second argument
      shootPeas(...args, (data, err) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }
  */
  /*<<<END PROMISE FUNCTION*/
  //***Vars
  var portfolioNetworkType = $('input[type=radio][name=radio_selectNetworkType]');
  var portfolioAsset = $('#coinjs_network');
  var portfolioAssetwIcons = $('#coinjs_network_select');
  var portfolioProviderUtxo = $('#coinjs_utxo_api');
  var portfolioProviderBroadcast = $('#coinjs_broadcast_api');
  //***Set default Network
  //wally_kit.initNetwork(portfolioNetworkType);
  $("#coinjs_network_select").on('show.bs.dropdown', function(e) {
    console.log('coinjs_network_select open', e);
    /*if($(this).attr("keep-open") == "true") {
        $(this).addClass("open");
        $(this).removeAttr("keep-open");
    }
    */
    //$("body").append("<div class='modal-backdrop fade show'></div>");
    coinbinf.backdrop();
  });
  $("#coinjs_network_select").on('hidden.bs.dropdown', function(e) {
    console.log('coinjs_network_select hidden', e);
    /*if($(this).attr("keep-open") == "true") {
        $(this).addClass("open");
        $(this).removeAttr("keep-open");
    }
    */
    //$(".modal-backdrop").hide();
    coinbinf.backdrop(false);
  });
  /*
  @ Network Settings on Change handler!
  - Changes Blockchain and lists relative Broadcast and UTXO API
  */
  portfolioNetworkType.on('change', function(e) {
    console.log('Network Type changed: ', this);
    //console.log('Network Type changed: ' , e);
    //console.log('Network Type to: ' , $(this).attr('data-network-type'));
    //wally_kit.settingsListAssets($(this).attr('data-network-type'));
    wally_kit.setNetwork($(this).attr('data-network-type'), '', {
      saveSettings: false,
      showMessage: false,
      renderFields: true
    });
  });
  portfolioAsset.on('change', function(e) {
    console.log('===portfolioAsset===');
    //console.log('Network Type changed: ' , this);
    //console.log('Network Type changed: ' , e);
    //console.log('Network Type to: ' , $(this).attr('data-network-type'));
    //wally_kit.settingsListAssets($(this).attr('data-network-type'));
    $('#verifyScript').val('').trigger('change'); //clear verifyscript
    console.log('portfolioAsset this.value: ' + this.value);
    //$('#coinjs_network_select li[data-asset="'+this.value+'"]').click();
    //update network type and providers
    //wally_kit.setNetwork(wally_fn.network, this.value, {saveSettings: false, showMessage: false});
    wally_kit.settingsListNetworkProviders(this.value);
    //wally_fn.asset = asset_var;
  });
  portfolioProviderUtxo.on('change', function(e) {
    console.log('===portfolioProviderUtxo Change===');
    var optionsText = this.options[this.selectedIndex].text;
    //wally_fn.provider.utxo = optionsText;
    console.log('changed UTXO Provider to: ' + optionsText);
  });
  portfolioProviderBroadcast.on('change', function(e) {
    console.log('===portfolioProviderUtxo Change===');
    var optionsText = this.options[this.selectedIndex].text;
    //wally_fn.provider.broadcast = optionsText;
    console.log('changed Broadcast Provider to: ' + optionsText);
    console.log('changed Broadcast Provider to: ', e);
    console.log('this.selectedIndex: ' + this.selectedIndex);
    console.log('this.options: ', this.options);
  });
  /*Settings dropdown-select listener*/
  $("body").on("click", "#settings .dropdown-select li", function(e) {
    console.log('#settings .dropdown-select li');
    var _this_ = $(this);
    var getValue = _this_.html();
    var parentId = _this_.parent().parent().attr('id');
    var parentBtn = _this_.parent().parent().children('button');
    parentBtn.html(getValue); //this sets the UTXO outputs and Broadcast button content
    //console.log('parent: ', $(this).parent().parent());
    //console.log('children: ', $(this).parent().parent().children());
    //remove "_select" from id to get its equivalent select element
    var eqSelectId = parentId.replace('_select', ''),
      setSelectValue;
    if (eqSelectId == 'coinjs_network') {
      //console.log('change asset!', e);
      setSelectValue = $(this).attr('data-asset');
      console.log('set Asset to:' + setSelectValue);
    } else if (eqSelectId == 'coinjs_utxo_api') {
      setSelectValue = $(this).attr('data-utxo-provider-name');
      //wally_fn.provider.utxo = $(this).attr('data-utxo-provider-name');
    } else if (eqSelectId == 'coinjs_broadcast_api') {
      setSelectValue = $(this).attr('data-broadcast-provider-name');
      //wally_fn.provider.broadcast = $(this).attr('data-broadcast-provider-name');
    }
    $('#' + eqSelectId).val(setSelectValue).change();
    //add a check-mark/icon to the selected item
    _this_.parent().find('i.icon').removeClass('bi-check'); //remove all checkmarks
    _this_.find('i.icon').addClass('bi-check'); //remove all checkmarks
    //#settings .dropdown-select li
  });
  //load more receive and change addresses
  coinbinf.loadReceiveAddresses.on('click', async function(e) {
    console.log('==coinbinf.loadReceiveAddresses==');
    $(this).prop('disabled', true);
    var spinner = coinbinf.loadReceiveAddresses.find('.spinner-border');
    spinner.removeClass('hidden');
    await wally_fn.loadWalletSeedAddresses('receive');
    wally_kit.walletRenderSeedAddresses();
    spinner.addClass('hidden');
    await wally_fn.timeout(wally_fn.gap.timeout);
    $(this).prop('disabled', false);
  });
  coinbinf.loadChangeAddresses.on('click', async function(e) {
    console.log('==coinbinf.loadChangeAddresses==');
    $(this).prop('disabled', true);
    var spinner = coinbinf.loadChangeAddresses.find('.spinner-border');
    spinner.removeClass('hidden');
    await wally_fn.loadWalletSeedAddresses('change');
    wally_kit.walletRenderSeedAddresses();
    spinner.addClass('hidden');
    //add timeout, user can only load addresses once per gapTimeout
    await wally_fn.timeout(wally_fn.gap.timeout);
    $(this).prop('disabled', false);
  });

  
  coinbinf.walletMenu.on('click', function(e) {
    console.log('===coinbinf.walletMenu===');
    $(this).find('input[type=radio]').prop('checked', true);
  });

  $('.login-again').on('click', function(e) {
    login_wizard.setActivePanel('mnemonic_wallet');
    window.location.href = "#login?wallet_type=mnemonic_wallet";
    
  });
  
/**
 * Search for wallet assets in DOM elements based on user input.
 * @param {Array} viewWalletAssets - An array of DOM element references.
 * @param {string} searchQuery - The user's search query.
 */
function searchForAssets(viewWalletAssets, searchQuery) {
    viewWalletAssets.forEach(item => {
        const data = item._data; // Access the data associated with each element

        // Combine the fields you want to search
        const combinedFields = `${data.chainModel} ${data.name} ${data.slug} ${data.symbol}`.toLowerCase();

        // Check if the search query exists in any of the fields
        if (combinedFields.includes(searchQuery)) {
            // Show the corresponding DOM element
            $(item).removeClass('hidden');
        } else {
            // Hide the corresponding DOM element
            $(item).addClass('hidden');
        }
    });
}
const $searchInput = $('#searchInput');

// Attach an event listener to the search input field
$searchInput.on('input change', function() {
    let timer;
    clearTimeout(timer); // Clear any previous timers
    const viewWalletAssets = wally_fn.tpl.seed.viewWalletAssets.where({});
    const searchQuery = $(this).val().toLowerCase();
    

    // Set a new timer to delay the asset search
    timer = setTimeout(function() {
        searchForAssets(viewWalletAssets, searchQuery);
    }, 300); // Adjust the delay time (in milliseconds) as needed
});

// Attach a click event to the "x" icons with the class "clear-input"
$('.input-clear').on('click', function() {
    // Find the input field within the same parent and clear its value
    $(this).closest('.input-group').find('input').val('').trigger('change');
});

// API provider selector events
 // Add a change event listener
  coinbinf.apiBalanceProviderSelector.on('change', function() {
    const selectedValue = $(this).val(); // Get the selected value

    // Update the variable with the selected value
    if (login_wizard.profile_data.generated && coinjs.asset.slug) {
      login_wizard.profile_data.generated[coinjs.asset.slug].api_provider.balance = selectedValue;
    }
  });


 // Add a change event listener
  coinbinf.apiListunspentProviderSelector.on('change', function() {
    const selectedValue = $(this).val(); // Get the selected value

    // Update the variable with the selected value
    if (login_wizard.profile_data.generated && coinjs.asset.slug) {
      login_wizard.profile_data.generated[coinjs.asset.slug].api_provider.listunspent = selectedValue;
    }
  });


 // Add a change event listener
  coinbinf.apiPushrawtxProviderSelector.on('change', function() {
    const selectedValue = $(this).val(); // Get the selected value

    // Update the variable with the selected value
    if (login_wizard.profile_data.generated && coinjs.asset.slug) {
      login_wizard.profile_data.generated[coinjs.asset.slug].api_provider.pushrawtx = selectedValue;
    }
  });


  //coinbinf.loadChangeAddresses
  /*
      BootstrapDialog.show({
              title: 'Manipulating Buttons',
              message: function(dialog) {
                  var $content = $('<div><button class="btn btn-success">Revert button status right now.</button></div>');
                  var $footerButton = dialog.getButton('btn-1');
                  $content.find('button').click({$footerButton: $footerButton}, function(event) {
                      event.data.$footerButton.enable();
                      event.data.$footerButton.stopSpin();
                      dialog.setClosable(true);
                  });
                  
                  return $content;
              },
              buttons: [{
                  id: 'btn-1',
                  label: 'Click to disable and spin.',
                  action: function(dialog) {
                      var $button = this; // 'this' here is a jQuery object that wrapping the <button> DOM element.
                      $button.disable();
                      $button.spin();
                      dialog.setClosable(false);
                  }
              }]
          });
    */
  /* since the select content is dynamic we need to listen to body > element */
  /*
  $("body").on("click", "#coinjs_network_select li", function(e){
  //$('.dropdown-select .dropdown-menu li').on('click', function() {
    var getValue = $(this).html();
    $('.dropdown-select button').html(getValue);


    console.log('change asset!', e);
    var newAsset = $(this).attr('data-asset');
    console.log('set Asset to:' + newAsset);

    
    $('#coinjs_network').val(newAsset).change();
  });
  */
  //wally_fn.assetInfo.icon = './assets/images/providers_icon.svg';
});