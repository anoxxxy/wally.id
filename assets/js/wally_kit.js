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
    


    //***PoS and other coins
    coinjs.txExtraTimeField = false;    //Set to true for PoS coins
    coinjs.txExtraTimeFieldValue = false;
    coinjs.txExtraUnitField = false;
    coinjs.txExtraUnitFieldValue = false;

    coinjs.decimalPlaces = 8;

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

    try {
      //set default chain type to Mainnet
      if(!listChainTypes.includes(chainType))
        chainType = 'mainnet';

      //set default network to Bitcoin
      if(!wally_fn.networks[chainType].hasOwnProperty(network))
        network = 'bitcoin';


      console.log('chainType : '+ chainType);
      console.log('network : '+ network);
      console.log('network info : ', wally_fn.networks[chainType][network]);

      //update coinjs settings: merge settings with coinjs and overwrite existing properties,
      $.extend(coinjs, wally_fn.networks[chainType][network])
      //Object.assign(coinjs, (wally_fn.networks[chainType][network]))
      //coinjs = wally_fn.networks[chainType][network];
      return wally_fn.networks[chainType][network];

    } catch (e) {
      console.log('wally_kit.setNetwork ERROR: ', e);
      //console.warn("");
    }
    return false;

  }

  


})();


