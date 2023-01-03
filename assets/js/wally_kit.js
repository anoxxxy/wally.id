/*
 @ Developed by Anoxy for Wally.id
 * Wally.id functions and DOM handler!
*/

(function () {

  var wally_kit = window.wally_kit = function () { };



  /*
  @ Network Settings
  */
  wally_kit.setNetwork = function (chainType = 'mainnet', network = 'bitcoin') {

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
    var listChainTypes = ["mainnet", "testnet"];
    var modalTitle = 'Blockchain Network', modalMessage, newNetwork;
    try {
      //set default chain type to Mainnet
      if(!listChainTypes.includes(chainType))
        chainType = 'mainnet';

      //set default network to Bitcoin
      if(!wally_fn.networks[chainType].hasOwnProperty(network))
        network = 'bitcoin';

      newNetwork = wally_fn.networks[chainType][network];

      console.log('chainType : '+ chainType);
      console.log('network : '+ network);
      console.log('network info : ', newNetwork);

      //update coinjs settings: merge settings with coinjs and overwrite existing properties,
      $.extend(coinjs, wally_fn.networks[chainType][network])
      //Object.assign(coinjs, (wally_fn.networks[chainType][network]))
      //coinjs = wally_fn.networks[chainType][network];

      modalMessage = '<div class="text-center text-primary"><p>You just switched Blockchain network:</p>' 
        + newNetwork.asset.name + ' ('+newNetwork.asset.symbol+' '+newNetwork.asset.network+')</div>';
      modalMessage += '<img src="'+newNetwork.asset.icon+'" class="icon-center icon64 ">'

      custom.showModal(modalTitle, modalMessage);
    } catch (e) {
      console.log('wally_kit.setNetwork ERROR: ', e);
      modalTitle = 'Blockchain Network: ERROR!'
      modalMessage = 'ERROR (wally_kit.setNetwork): Switching Blockchain Network Failed! ' + e;
      custom.showModal(modalTitle, modalMessage, 'danger');
      //console.warn("");
    }
    
  }

  


})();


