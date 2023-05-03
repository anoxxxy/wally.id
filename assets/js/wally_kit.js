/*
 @ Developed by Anoxy for Wally.id
 * Wally.id functions and DOM handler!
*/

(function () {

  var wally_kit = window.wally_kit = function () { };



  /*
  @ Set Blockchain Network Settings
  @params
    network
    asset
    options (saveSettings, showMessage (about updated settings) )
  */
  wally_kit.setNetwork = async function (network_var = 'mainnet', asset_var = 'bitcoin', options = {saveSettings: false, showMessage: false, renderFields: true}) {
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
    var modalTitle = 'Network Settings', modalMessage, newNetwork;
    try {
      
      wally_fn.asset = asset_var;

      //set default chain type to Mainnet
      if(!listNetworkTypes.includes(network_var))
        network_var = 'mainnet';

      //set default network to Bitcoin
      if(!wally_fn.networks[network_var].hasOwnProperty(asset_var)) {
        asset_var = 'bitcoin';
        console.log('reset network to: '+ asset_var);
      }

      newNetwork = wally_fn.networks[network_var][asset_var];

      console.log('Network:: '+ network_var);
      console.log('Asset: '+ asset_var);
      console.log('Network/Asset Info: ', newNetwork);

      //update coinjs settings: merge variable settings with coinjs and overwrite existing properties,
      if (options.saveSettings) {


        //extend coinjs with the updated asset configuration
        $.extend(coinjs, wally_fn.networks[network_var][asset_var]);
        //Object.assign(coinjs, (wally_fn.networks[network_var][asset_var]))
        

        //dabi, save copy of "asset" object, for data-binding purpose (UI) !
        Object.assign(wally_fn.assetInfo, coinjs.asset);
        $('.coin_symbol').text(coinjs.asset.symbol);
        $('.coin_name').text(coinjs.asset.name);

        wally_fn.chainModel = coinjs.asset.chainModel;

        console.log('#modalChangeAsset input[name="set-asset-group"][value="'+asset_var+'"]');

        //update the selected asset in modal dialog for quick changing asset
        document.querySelector('#modalChangeAsset input[name="set-asset-group"][value="'+asset_var+'"]').checked = true;


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
          console.log('show extra field!');
        } else {
          $("#txTimeOptional").hide();
          $("#verifyTransactionData .txtime").hide();
          $('#nTime').val('');
        }
        //check if asset needs extra unit field?
        if (coinjs.txExtraUnitField) {
          coinjs.txExtraUnitFieldValue = $("#nUnit").val()*1;
          $('#txUnitOptional').show();
          $("#verifyTransactionData .txunit").show();

        } else {
          $('#txUnitOptional').hide();
          $("#verifyTransactionData .txunit").hide();
          $('#nUnit').val('');
        }

      }

      //update list for supported assets for choosen network 
      if(options.renderFields)
        this.settingsListAssets(network_var);

      //show message for changing network & asset
      if (options.showMessage) {
        modalMessage = '<div class="text-center text-primary mb-3"><p class="mb-2">You have updated Blockchain Network settings to:</p>' 
          + newNetwork.asset.name + ' <strong>('+newNetwork.asset.symbol+' '+newNetwork.asset.network+')</strong> </div>';
        modalMessage += '<img src="'+newNetwork.asset.icon+'" class="icon-center icon64 mb-2">'
        modalMessage += '<div class="text-center text-muted">API Providers:<br> Unspent outputs: '+wally_fn.provider.utxo+'<br>Broadcast: '+wally_fn.provider.broadcast+'</div> <br> <div class="alert alert-light text-muted mb-2">If this is not correct, head over to <a href="#settings" data-pagescroll="page_tab" data-dismiss="modal">Settings</a> page. </div>';

        custom.showModal(modalTitle, modalMessage);
      }



      
    } catch (e) {
      console.log('wally_kit.setNetwork ERROR: ', e);
      modalTitle = 'Blockchain Network: ERROR!'
      modalMessage = 'ERROR (wally_kit.setNetwork): Change blockchain network settings failed! ' + e;
      custom.showModal(modalTitle, modalMessage, 'danger');
      //console.warn("");
    }
    
  }

  /*
  @ Wallet Router settings
  */

  wally_kit.initRouter = async function () {
    console.log('===initRouter===');




  /*<<< Start Router*/
    var show_about = function () {
        alert('This is the application "About".\n\nCopyright ©2020-2023 Wally.id');
    }

    var show_number = function (num) {
        alert('Number: ' + num);
        console.log('num: ', num)
    }

    var setVerifyScript = function () {
        document.getElementById('verifyScript').value = Router.urlParams.decode;
    }
    var loginWalletInteraction = function () {
          
          console.log('Router.urlParams: ', Router.urlParams);
          
          //portfolio panel is not active/Set, route back to open portfolio
          if(login_wizard.openWalletType == '')
            Router.navigate('login');  

          console.log('login wallet portfolio in target: ' + login_wizard.openWalletType);
          console.log('Router.urlParams.wallet_type: '+ Router.urlParams.wallet_type);

          //set view to (history-hash) wallet type
          if (Router.urlParams.wallet_type ) { //we navigate only to the selected portfolio, even after a refresh
          //if (Router.urlParams.wallet_type && Router.urlParams.wallet_type == login_wizard.openWalletType) { //we navigate only to the selected portfolio, even after a refresh
            $('#js_folder-content li.folder-item[data-wallet-type="'+Router.urlParams.wallet_type+'"]').click();
            

            console.log('wallet portfolio: ' + Router.urlParams.wallet_type);
            console.log('openWalletType: ' + login_wizard.openWalletType);

          } else {
            console.log('not listed');
          }
            

          
          //if(data[1] == '/login=multisig_wallet')
          if (Router.urlParams.wallet_type == 'regular_wallet'){
            //hide next button
            $('#openBtnNext').removeClass('hidden');
            //show open wallet button
            $('#openBtn').addClass('hidden');
          }
          if (Router.urlParams.wallet_type == 'multisig_wallet'){
            $('#openBtnNext').removeClass('hidden');
            $('#openBtn').addClass('hidden'); 
          }
          if (Router.urlParams.wallet_type == 'privatekey_wallet'){
            $('#openBtnNext').removeClass('hidden');
            $('#openBtn').addClass('hidden'); 
            
          }
          if (Router.urlParams.wallet_type == 'import_wallet'){
            $('#openBtnNext').removeClass('hidden');
            $('#openBtn').addClass('hidden'); 
            
          }
          if (Router.urlParams.wallet_type == 'mnemonic_wallet'){
            $('#openBtnNext').removeClass('hidden');
            $('#openBtn').addClass('hidden'); 
            
          }
          if (Router.urlParams.wallet_type == 'hdmaster_wallet'){
            $('#openBtnNext').removeClass('hidden');
            $('#openBtn').addClass('hidden'); 
          }
          if (Router.urlParams.wallet_type == 'terms'){
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
        .add(/home(.*)/, function(data){})
        .add(/newAddress(.*)/, function(data){})
        .add(/newSegWit(.*)/, function(data){})
        .add(/newMultiSig(.*)/, function(data){})
        .add(/newHDaddress(.*)/, function(data){})
        .add(/newTimeLocked(.*)/, function(data){})
        //.add(/(newTransaction)(.*)/, function(data){  //catch #newTransaction/txinputs
        //.add(/(newTransaction|(?<=newTransaction.*)[^\/?\r\n]+)/g, function(data){  //catch #newTransaction/txinputs
        .add(/(\bnewTransaction\b|(?<=\bnewTransaction\/.*)[^\/?]+)/g, function(data){  //https://regex101.com/r/2RtRfv/6/codegen?language=javascript


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
          if(data[1])
            $('#newTransaction [data-target="#' + data[1] + '"]').tab('show');

        })/*
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
          //alert('sign page');
          
          
          loginWalletInteraction();


        })
        .add(/about(.*)/, function(data){
          console.log('**about page**');
        })
        //.add(/(.*)(verify)(.*)/, function(data) {
        
        .add(/(verify)(.*)/, function(data) {
          console.log('**verify page**');
          //console.log('data: ', data);

          if(Router.urlParams._params_.decode) {
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
        .add(/(fee)(.*)/, function(data){})
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
          
          //Router.navigate('home', 'Start');
        })
        .beforeAll( function(data) {
            console.log(' ');
            console.log('==Run Before All Routes!')
            wally_kit.pageHandler(data);
        })
        .afterAll( function(data) {
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

  wally_kit.checkUrlParams = async function () {

    //get & set asset type, default is bitcoin
    if (Router.urlParams.asset !== undefined) {

      console.log('==Router.urlParams.asset==', Router.urlParams);
      var default_network = 'mainnet', default_asset = 'bitcoin';

      //check if network type is set, or else set to default!
      //if (Router.urlParams.network !== undefined) {
      if ( (Router.urlParams).hasOwnProperty('network') ) {
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
      for (var [key, value] of Object.entries(wally_fn.networks[ default_network ])) {
        console.log('loop for key, value: '+ key);

        if ( (value.asset.symbols).includes(Router.urlParams.asset) ) {
          default_asset = key;
          console.log('asset was found: ', value.asset.symbol);
          console.log('asset key was found: ', key);

          await this.setNetwork(default_network, default_asset, {saveSettings: true, showMessage: true, renderFields: true});
          break;
        }
      }


    }

  }

  /*
  @ Initialize Network Settings!
  */
  wally_kit.initNetwork = async function (networkTypesRadio) {
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
      wally_kit.listAssets();

      //get pageURL Parameters
      await this.initRouter();
      await this.checkUrlParams();
      console.log('networkType: ', networkTypesRadio);

      

      //set default Chain Network 
      if (coinjs.asset === undefined)
        this.setNetwork('mainnet', 'bitcoin', {saveSettings: true, showMessage: false, renderFields: true});

      //if defined, set to selected/active Network
      if(coinjs.asset.network) {
        networkTypesRadio.parent().removeClass('active');
        $('input[type=radio][name=radio_selectNetworkType][data-network-type='+coinjs.asset.network+']').prop('checked', true).parent().addClass('active');
        console.log('Network Type is already set!');

        //show providers for i.e Broadcast and UTXO API
        //wally_kit.settingsListAssets(coinjs.asset.network)
        //wally_kit.settingsListChainProviders(coinjs.asset.network)

    } else {
      //no network is choosen, set default to mainnet
      networkTypesRadio.parent().removeClass('active');
      $('input[type=radio][name=radio_selectNetworkType][data-network-type=mainnet]').prop('checked', true).parent().addClass('active');
      console.log('No Network Type! Set to Default!');
      throw('No Network Type! Set to Default!')
    }

  


  } catch (e) {
      console.log('wally_kit.initNetwork ERROR: ', e)
  }
}

  /*
  @ Quick Update Asset 
  */

  wally_kit.quickSetAsset = function (asset) {
    //settings page
    $('#settings .dropdown-select li[data-asset="'+asset+'"]').click();
    $('#settingsBtn').click();

    //bottom menu
    document.querySelector('#modalChangeAsset input[name="set-asset-group"][value="'+asset+'"]').checked = true;

  }

  /*
  @ show a list of Chains: Bitcoin, Litecoin, Bitbay etc..
  */
  wally_kit.settingsListAssets = function (network_var = 'mainnet') {

    console.log('===settingsListAssets===');
    try {
      wally_fn.network = network_var;

      console.log('Network: '+network_var);
      console.log('Asset: '+wally_fn.asset);
      
      //set network type
      //wally_kit.setNetwork(network_var, 'bitcoin', false);

      //element vars
      var assetSelectEl = $('#coinjs_network');
      assetSelectEl.text('');
      
      var assetSelectwIconsEl = $('#coinjs_network_select ul');
      assetSelectwIconsEl.text('');

      //iterate through the networks vars and add to the select-network-element
      
      var i=0;
      for (var [key, value] of Object.entries(wally_fn.networks[network_var])) {

        if (i==0) {//render button-select content
          //if (coinjs.asset !== undefined) {
           // $('#coinjs_network_select button').html('<img src="'+coinjs.asset.icon+'" class="icon32"> '+coinjs.asset.name+' ('+coinjs.asset.symbol+')'); 

            //$('#coinjs_network').val(coinjs.asset.slug).attr('selected','selected');
            //$('#coinjs_network option[value="'+coinjs.asset.slug+'"]').attr('selected','selected');
            //console.log('trigger select change');
          //}else
            $('#coinjs_network_select button').html('<img src="'+value.asset.icon+'" class="icon32"> '+value.asset.name+' ('+value.asset.symbol+')'); 
        }

        //selected asset
        if (coinjs.asset.slug == key){
          assetSelectEl.append('<option value="'+key+'" data-icon="'+value.asset.icon+'" selected="selected">'+value.asset.name+' ('+value.asset.symbol+')</option>');
          $('#coinjs_network_select button').html('<img src="'+value.asset.icon+'" class="icon32"> '+value.asset.name+' ('+value.asset.symbol+')'); 
          console.log('trigger selected icon');
        } else {
          assetSelectEl.append('<option value="'+key+'" data-icon="'+value.asset.icon+'" >'+value.asset.name+' ('+value.asset.symbol+')</option>');
          //$('#coinjs_network_select button').html('<img src="'+coinjs.asset.icon+'" class="icon32"> '+coinjs.asset.name+' ('+coinjs.asset.symbol+')'); 
          console.log('not triggered');
          
        }

        //list rest of assets
        assetSelectwIconsEl.append('<li data-icon="'+value.asset.icon+'" data-asset="'+key+'"><img src="'+value.asset.icon+'" class="icon32"> '+value.asset.name+' ('+value.asset.symbol+')</li>');

        
        
        
        i++;
      }
      assetSelectwIconsEl.append('<li>&nbsp;</li>');

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
    if(asset_var !== undefined) {
      

      //update select button content relative to asset
      if( wally_fn.networks[wally_fn.network][asset_var] !== undefined ) {

        wally_fn.asset = asset_var;
        console.log('update asset to: '+asset_var);
        console.log('updated asset to: '+wally_fn.asset);

        $('#coinjs_network_select button').html('<img src="'+wally_fn.networks[wally_fn.network][asset_var].asset.icon+'" class="icon32"> '+wally_fn.networks[wally_fn.network][asset_var].asset.name+' ('+wally_fn.networks[wally_fn.network][asset_var].asset.symbol+')'); 
      }
    }

    if (wally_fn.asset == '') {
      wally_fn.asset = 'bitcoin';
      console.log('update default asset to: '+wally_fn.asset);
    }
    
    
    //$('#coinjs_network_select li[data-asset="'+asset_var+'"]').click();
    



    console.log('wally_fn.asset after: ', wally_fn.asset);

    var i=0, electrumXContent ='';
    for (var [key, value] of Object.entries(wally_fn.networks[wally_fn.network][wally_fn.asset].asset.api.broadcast)) {
      
      //show ElectrumX server in list
      if (key.includes('ElectrumX'))
        electrumXContent = ' <small>'+value+'</small>';

      selectNetworkBroadcastAPI.append('<option value="'+value+'" data-icon="" >'+key+'</option>');
      selectNetworkBroadcastAPIwIcons.append('<li data-icon="./assets/images/providers_icon.svg" data-broadcast-provider="'+value+'" data-broadcast-provider-name="'+key+'"><img src="./assets/images/providers_icon.svg" class="icon32"> '+key+electrumXContent+'</li>');

      if(i==0) {//set broadcast asset
          $('#coinjs_broadcast_api_select button').html('<img src="./assets/images/providers_icon.svg" class="icon32"> '+key);
          wally_fn.provider.broadcast = key;
          console.log('Broadcast provider: ' + key);
        }
      electrumXContent='';
      i++;
    }

    i=0;

    for (var [key, value] of Object.entries(wally_fn.networks[wally_fn.network][wally_fn.asset].asset.api.unspent_outputs)) {
      
        //show ElectrumX server in list
      if (key.includes('ElectrumX'))
        electrumXContent = ' <small>'+value+'</small>';

      selectNetworkUtxoAPI.append('<option value="'+value+'" data-icon="" >'+key+'</option>');
      selectNetworkUtxoAPIwIcons.append('<li data-icon="./assets/images/providers_icon.svg" data-utxo-provider="'+value+'" data-utxo-provider-name="'+key+'"><img src="./assets/images/providers_icon.svg" class="icon32"> '+key+electrumXContent+'</li>');


      if (i==0) {//set utxo provider asset
        $('#coinjs_utxo_api_select button').html('<img src="./assets/images/providers_icon.svg" class="icon32"> '+key);
        wally_fn.provider.utxo = key;
        console.log('UTXO provider: ' + key);
      }
      electrumXContent='';
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
        donationList +=('<a class="list-group-item list-group-item-action" alt="Donate to us in '+value.asset.name+' ('+value.asset.symbol+')" href="'+key+':'+value.developer+'"><img src="'+value.asset.icon+'" class="icon32"> '+value.asset.name+' ('+value.asset.symbol+')</a>');

        //list assets in modal dialog
        assetListInModalDefault = (value.asset.slug == wally_fn.asset ? 'checked="checked"' : '')  //set as default 
        assetListInModal += ('<tr data-asset="'+value.asset.slug+'">        <td>         <i class="icon">          <img class="icon icon32" src="./assets/images/crypto/'+(value.asset.slug)+'-'+(value.asset.symbol).toLowerCase()+'-logo.svg" />         </i>        </td>        <td>'+value.asset.symbol+' <small class="d-block text-muted">'+value.asset.name+'</small></td>        <td>          <input type="radio" name="set-asset-group" value="'+value.asset.slug+'" '+assetListInModalDefault+'/>        </td>       </tr>');

        //footer page supported assets
        supportedAssets += '<li class="mb-1"><a href="javascript:void(0)"><img src="./assets/images/crypto/'+(value.asset.slug)+'-'+(value.asset.symbol).toLowerCase()+'-logo.svg" class="icon tokens">'+value.asset.name+'</a></li>';
      }

      $('#about .donation_list').html('<div class="list-group">'+donationList+'</div>');
      $('#modalChangeAsset table tbody').html(assetListInModal);

      $('#footer_supported_assets').html(supportedAssets);
      
      
      
  }

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

         wally_kit.scrollToElement = function (elId, offset) {
            var scrollContainer = window.document.scrollingElement || window.document.documentElement || window.document.body;
            var el = document.getElementById(elId);
            
            if(el === null)
              return;

            var sEl             = scrollContainer,
                box             = el.getBoundingClientRect(),
                sElPos, distance, duration,
                compStyles      = window.getComputedStyle(sEl),
                topBorderOffset = parseInt(compStyles.getPropertyValue('border-top-width'));

            //offset = topBorderOffset + (offset || 0);

            if(elId == "home" || elId == "about")
              offset = 0;
            else
              offset   = box.top + pageYOffset - offset;

            distance = Math.abs(pageYOffset - offset);            

            distance = Math.min(distance, 500);
            duration = Math.max(distance / 200 * 1000, 800)/3;

            anime({
                targets: sEl,
                scrollTop: offset,
                duration: duration,
                easing: 'easeInOutCirc' //easeOutQuart
            });

        }


/*
 @ Handles the navigation to the selected page
 use transition, animation, scroll etc...
*/
wally_fn.pageNavigator = function (_elId_ = Router.urlParams.page) {


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

  wally_kit.pageHandler = function (pageHash, show=false) {
    
    console.log('=wally_kit.pageHandler=');

    //console.log('===wally_kit.landingPage===');
    //show landing page for specific active page/tab
    if (Router.urlParams.page == "home" || Router.urlParams.page == "about" || Router.urlParams.page == "way-token") {
      $('.landing_box').removeClass("hidden");
    }else {
      $('.landing_box').addClass("hidden");
    }

    //remove active-class from pages
    var tabPages = document.querySelectorAll('.tab-pane.tab-content.active');
    tabPages.forEach(allTabs => {
          if (allTabs.classList.contains('active')) {
            allTabs.classList.remove("active");
            console.log("navigationPageHideAll --> active pages removed!");
          }
      });

    /*
    //Check if url hash exists
    if(location.hash.length > 0) {
      console.log('yep')
    }else {
       console.log('nop')
    }
    */


    //if no page-hash or non-valid page-hash is set, default to "home"
    //if (Router.urlParams.page == '' || !wally_fn.navigationPages.hasOwnProperty(Router.urlParams.page) )
    if (!wally_fn.navigationPages.hasOwnProperty(Router.urlParams.page) )
      Router.urlParams.page = 'home';

    //check if page is available for the current chainModel
    //check if asset is supported on the navigated page
    if (wally_fn.navigationPages[Router.urlParams.page].includes(wally_fn.chainModel) || wally_fn.navigationPages[Router.urlParams.page].includes('all')) {
      console.log('=page "'+Router.urlParams.page + '" is availabe for the chainModel: '+ wally_fn.navigationPages[Router.urlParams.page].toString());


      //add active to navigated page element
      if (Router.urlParams.page != 'home') {
        document.getElementById(Router.urlParams.page).classList.add("active");
        //smooth scroll to active page
        wally_fn.pageNavigator();
      } else {
        document.getElementById('home').classList.add("active");
        $('.landing_box').removeClass("hidden");
        //no active pag is set, show start page/landing page
      }

    } else {
      console.log(Router.urlParams.page + ' is ONLY availabe for: '+ wally_fn.navigationPages[Router.urlParams.page].toString());

      console.log('chainModel is : ', wally_fn.chainModel);

      var modalTitle = 'Whooops...';
      var modalMessage = '<div class="alert alert-danger text-center"><p>We do not have fully support for this asset yet.</p> <p><img src="'+coinjs.asset.icon+'" class="icon-center icon64 mt-3 mb-2"></p> <strong>'+coinjs.asset.name + ' ('+coinjs.asset.symbol+') <br>'+coinjs.asset.network+'</strong> </div>';
      custom.showModal(modalTitle, modalMessage);

      //no active page is set, show start-page
      Router.navigate('home');
    }



  }

  /*
https://benalman.com/projects/jquery-hashchange-plugin/

https://gist.github.com/atelierbram/18d7489b81dc9acf0747

https://alloyui.com/api/files/yui3_src_history_js_history-hash.js.html#
*/

})();


$(document).ready(function() {
    'use strict';




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


var promiseIt = function (data) {
  return new Promise ((resolve, reject) => {
    // ...  
    return;
  })
  .then(data => {/* Do something with data */})
  .catch(err => {/* Handle error */});
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

  /*
  @ Network Settings on Change handler!
  - Changes Blockchain and lists relative Broadcast and UTXO API
  */
  portfolioNetworkType.on('change', function(e) {
    //console.log('Network Type changed: ' , this);
    //console.log('Network Type changed: ' , e);
    //console.log('Network Type to: ' , $(this).attr('data-network-type'));
    //wally_kit.settingsListAssets($(this).attr('data-network-type'));
    wally_kit.setNetwork($(this).attr('data-network-type'), '',{saveSettings: false, showMessage: false, renderFields: true});
  });

  portfolioAsset.on('change', function(e) {
    console.log('===portfolioAsset===');
    //console.log('Network Type changed: ' , this);
    //console.log('Network Type changed: ' , e);
    //console.log('Network Type to: ' , $(this).attr('data-network-type'));
    //wally_kit.settingsListAssets($(this).attr('data-network-type'));

    
    $('#verifyScript').val('').trigger('change');   //clear verifyscript

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
    console.log('changed UTXO Provider to: '+ optionsText);
  });

  portfolioProviderBroadcast.on('change', function(e) {
    console.log('===portfolioProviderUtxo Change===');

    var optionsText = this.options[this.selectedIndex].text;
    //wally_fn.provider.broadcast = optionsText;
    
    console.log('changed Broadcast Provider to: '+ optionsText);
    console.log('changed Broadcast Provider to: ', e);
    console.log('this.selectedIndex: '+ this.selectedIndex);
    console.log('this.options: ', this.options);

  });

/*Settings dropdown-select listener*/
$("body").on("click", "#settings .dropdown-select li", function(e){
  var _this_ = $(this);
  var getValue = _this_.html();

  var parentId = _this_.parent().parent().attr('id');
  var parentBtn = _this_.parent().parent().children('button');

  parentBtn.html(getValue);

  //console.log('parent: ', $(this).parent().parent());
  //console.log('children: ', $(this).parent().parent().children());


  //remove "_select" from id to get its equivalent select element
  var eqSelectId = parentId.replace('_select', ''), setSelectValue;
  ;
  if (eqSelectId == 'coinjs_network'){
    //console.log('change asset!', e);
    setSelectValue = $(this).attr('data-asset');
    console.log('set Asset to:' + setSelectValue);

    
    
  }else if (eqSelectId == 'coinjs_utxo_api'){
    setSelectValue = $(this).attr('data-utxo-provider');
    //wally_fn.provider.utxo = $(this).attr('data-utxo-provider-name');
  }else if (eqSelectId == 'coinjs_broadcast_api'){
    setSelectValue = $(this).attr('data-broadcast-provider');
    //wally_fn.provider.broadcast = $(this).attr('data-broadcast-provider-name');
  }

  $('#'+eqSelectId).val(setSelectValue).change();

  //#settings .dropdown-select li
});
  
  
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
  




/*
  https://github.com/twbs/bootstrap/issues/3722#issuecomment-26392191
  //Generate Password Popover
  $('.generatePasswordSettings').popover({
    html: true,
    //content: $("#generatePasswordSettings").html(),
    content: function () {
        console.log('content popover return generatePasswordSettings');
        return $("#generatePasswordSettings").html();
    }
  }).on('hidden.bs.popover', function () {
      //$(".popover.show.generatePassword").append($("#generatePasswordSettings"));
      //$("#myPopoverContentContainer").append($("#generatePasswordSettings"));
      //console.log('content popover append generatePasswordSettings');
      //$("#generatePasswordSettings").append($("#generatePasswordSettings"));
  });

*/


});

/*
https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript


var url = "http://www.example.com/folder/mypage.html?myparam1=1&myparam2=2#something";

function URLParser(u){
    var path="",query="",hash="",params;
    if(u.indexOf("#") > 0){
        hash = u.substr(u.indexOf("#") + 1);
        u = u.substr(0 , u.indexOf("#"));
    }
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));
        query = u.substr(u.indexOf("?") + 1);
        params= query.split('&');
    }else
        path = u;
    return {
        getHost: function(){
            var hostexp = /\/\/([\w.-]*)/;
            var match = hostexp.exec(path);
            if (match != null && match.length > 1)
                return match[1];
            return "";
        },
        getPath: function(){
            var pathexp = /\/\/[\w.-]*(?:\/([^?]*))/;
            var match = pathexp.exec(path);
            if (match != null && match.length > 1)
                return match[1];
            return "";
        },
        getHash: function(){
            return hash;
        },
        getParams: function(){
            return params
        },
        getQuery: function(){
            return query;
        },
        setHash: function(value){
            if(query.length > 0)
                query = "?" + query;
            if(value.length > 0)
                query = query + "#" + value;
            return path + query;
        },
        setParam: function(name, value){
            if(!params){
                params= new Array();
            }
            params.push(name + '=' + value);
            for (var i = 0; i < params.length; i++) {
                if(query.length > 0)
                    query += "&";
                query += params[i];
            }
            if(query.length > 0)
                query = "?" + query;
            if(hash.length > 0)
                query = query + "#" + hash;
            return path + query;
        },
        getParam: function(name){
            if(params){
                for (var i = 0; i < params.length; i++) {
                    var pair = params[i].split('=');
                    if (decodeURIComponent(pair[0]) == name)
                        return decodeURIComponent(pair[1]);
                }
            }
            console.log('Query variable %s not found', name);
        },
        hasParam: function(name){
            if(params){
                for (var i = 0; i < params.length; i++) {
                    var pair = params[i].split('=');
                    if (decodeURIComponent(pair[0]) == name)
                        return true;
                }
            }
            console.log('Query variable %s not found', name);
        },
        removeParam: function(name){
            query = "";
            if(params){
                var newparams = new Array();
                for (var i = 0;i < params.length;i++) {
                    var pair = params[i].split('=');
                    if (decodeURIComponent(pair[0]) != name)
                          newparams .push(params[i]);
                }
                params = newparams;
                for (var i = 0; i < params.length; i++) {
                    if(query.length > 0)
                        query += "&";
                    query += params[i];
                }
            }
            if(query.length > 0)
                query = "?" + query;
            if(hash.length > 0)
                query = query + "#" + hash;
            return path + query;
        },
    }
}

document.write("Host: " + URLParser(url).getHost() + '<br>');
document.write("Path: " + URLParser(url).getPath() + '<br>');
document.write("Query: " + URLParser(url).getQuery() + '<br>');
document.write("Hash: " + URLParser(url).getHash() + '<br>');
document.write("Params Array: " + URLParser(url).getParams() + '<br>');
document.write("Param: " + URLParser(url).getParam('myparam1') + '<br>');
document.write("Has Param: " + URLParser(url).hasParam('myparam1') + '<br>');

document.write(url + '<br>');

// Remove the first parameter
url = URLParser(url).removeParam('myparam1');
document.write(url + ' - Remove the first parameter<br>');

// Add a third parameter
url = URLParser(url).setParam('myparam3',3);
document.write(url + ' - Add a third parameter<br>');

// Remove the second parameter
url = URLParser(url).removeParam('myparam2');
document.write(url + ' - Remove the second parameter<br>');

// Add a hash
url = URLParser(url).setHash('newhash');
document.write(url + ' - Set Hash<br>');

// Remove the last parameter
url = URLParser(url).removeParam('myparam3');
document.write(url + ' - Remove the last parameter<br>');

// Remove a parameter that doesn't exist
url = URLParser(url).removeParam('myparam3');
document.write(url + ' - Remove a parameter that doesn\"t exist<br>');
*/