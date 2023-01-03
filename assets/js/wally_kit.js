/*
 @ Developed by Anoxy for Wally.id
 * Wally.id functions and DOM handler!
*/

(function () {

  var wally_kit = window.wally_kit = function () { };



  /*
  @ Set Blockchain Network Settings
  */
  wally_kit.setNetwork = function (network_var = 'mainnet', asset_var = 'bitcoin', showChangeMessage = true) {

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
    var modalTitle = 'Blockchain Network', modalMessage, newNetwork;
    try {
      //set default chain type to Mainnet
      if(!listNetworkTypes.includes(network_var))
        network_var = 'mainnet';

      //set default network to Bitcoin
      if(!wally_fn.networks[network_var].hasOwnProperty(asset_var))
        asset_var = 'bitcoin';

      newNetwork = wally_fn.networks[network_var][asset_var];

      console.log('network_var : '+ network_var);
      console.log('asset : '+ asset_var);
      console.log('network info : ', newNetwork);

      //update coinjs settings: merge settings with coinjs and overwrite existing properties,
      $.extend(coinjs, wally_fn.networks[network_var][asset_var])
      //Object.assign(coinjs, (wally_fn.networks[network_var][asset_var]))

      if (showChangeMessage) {
        modalMessage = '<div class="text-center text-primary"><p>You just switched Blockchain network:</p>' 
          + newNetwork.asset.name + ' ('+newNetwork.asset.symbol+' '+newNetwork.asset.network+')</div>';
        modalMessage += '<img src="'+newNetwork.asset.icon+'" class="icon-center icon64 ">'

        custom.showModal(modalTitle, modalMessage);
      }

      
    } catch (e) {
      console.log('wally_kit.setNetwork ERROR: ', e);
      modalTitle = 'Blockchain Network: ERROR!'
      modalMessage = 'ERROR (wally_kit.setNetwork): Switching Blockchain Network Failed! ' + e;
      custom.showModal(modalTitle, modalMessage, 'danger');
      //console.warn("");
    }
    
  }

  /*
  @ Check if Network Type is set
  */




  /*
  @ Initialize Network Settings!
  */
  wally_kit.initNetwork = function (networkTypesRadio) {

    console.log('===initNetwork===');
    try {
      console.log('networkType: ', networkTypesRadio);

      //set default Chain Network 
      if (coinjs.asset === undefined)
        wally_kit.setNetwork('mainnet', 'bitcoin', false);

      //if defined, set to currenct Chain Network
      if(coinjs.asset.network) {
        networkTypesRadio.parent().removeClass('active');
        $('input[type=radio][name=radio_selectNetworkType][data-network-type='+coinjs.asset.network+']').prop('checked', true).parent().addClass('active');
        console.log('Network Type is already set!');

        //show providers for i.e Broadcast and UTXO API
        wally_kit.settingsListAssets(coinjs.asset.network)
        //wally_kit.settingsListChainProviders(coinjs.asset.network)
      } 

    } catch (e) {
      //not network is choosen, default to mainnet
        networkTypesRadio.parent().removeClass('active');
        $('input[type=radio][name=radio_selectNetworkType][data-network-type=mainnet]').prop('checked', true).parent().addClass('active');
        console.log('No Network Type! Set to Default!', e);
    }

  }

  /*
  @ show a list of Chains: Bitcoin, Litecoin, Bitbay etc..
  */
  wally_kit.settingsListAssets = function (network_var = 'mainnet') {

    console.log('===settingsListAssets===');
    try {
      wally_fn.network = network_var;

      networks = wally_fn.networks[network_var];
      console.log('networks: '+network_var);
      
      //set network type
      wally_kit.setNetwork(network_var, 'bitcoin', false);

      //element vars
      var assetSelectEl = $('#coinjs_network').text('');

      //iterate through the networks vars and add to the select-network-element
      for (var [key, value] of Object.entries(networks)) {
        assetSelectEl.append('<option value="'+key+'" data-icon="'+value.asset.icon+'" >'+value.asset.name+' ('+value.asset.symbol+')</option>');
      }

      wally_kit.settingsListNetworkProviders();
    } catch (e) {
      console.log('wally_kit.settingsListAssets ERROR:', e);
    }
  }

  /*
  @ Set Providers for chosen network!
  */
  wally_kit.settingsListNetworkProviders = function() {

    var selectNetworkBroadcastAPI = $('#coinjs_broadcast_api').text('');
    var selectNetworkUtxoAPI = $('#coinjs_utxo_api').text('');

    for (var [key, value] of Object.entries(coinjs.asset.api.broadcast)) {
      selectNetworkBroadcastAPI.append('<option value="'+value+'" data-icon="" >'+key+'</option>');
    }

    for (var [key, value] of Object.entries(coinjs.asset.api.unspent_outputs)) {
      selectNetworkUtxoAPI.append('<option value="'+value+'" data-icon="" >'+key+'</option>');
    }
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

  


})();


$(document).ready(function() {

  //***Vars
  var portfolioNetworkType = $('input[type=radio][name=radio_selectNetworkType]');
  var portfolioAsset = $('#coinjs_network');

  //***Set default Network
  wally_kit.initNetwork(portfolioNetworkType);

  /*
  @ Network Settings on Change handler!
  - Changes Blockchain and lists relative Broadcast and UTXO API
  */
  portfolioNetworkType.on('change', function(e) {
    //console.log('Network Type changed: ' , this);
    //console.log('Network Type changed: ' , e);
    //console.log('Network Type to: ' , $(this).attr('data-network-type'));
    wally_kit.settingsListAssets($(this).attr('data-network-type'));
  });

  portfolioAsset.on('change', function(e) {
    //console.log('Network Type changed: ' , this);
    //console.log('Network Type changed: ' , e);
    //console.log('Network Type to: ' , $(this).attr('data-network-type'));
    //wally_kit.settingsListAssets($(this).attr('data-network-type'));

    

    console.log('this.value: ' + this.value);


    //update network type and providers
    wally_kit.setNetwork(wally_fn.network, this.value, false);
    wally_kit.settingsListNetworkProviders();
  });


  

  




});