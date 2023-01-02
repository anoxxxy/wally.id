/*
 @ Developed by Anoxy for Wally.id
 * Wally.id functions and DOM handler!
*/

(function () {

  var wally_kit = window.wally_kit = function () { };



  /*
  @ Network Settings
  */
  wally_kit.setNetwork = function (network) {
    var savedParams = {
      'pub':coinjs.pub,
      'priv':coinjs.priv,
      'multisig':coinjs.multisig,
            //'hdkey':coinjs.hdkey,
            //'bech32':coinjs.bech32,
            //'supports_address':coinjs.supports_address,
    };

    //***PoS and other coins
    coinjs.txExtraTimeField = false;    //Set to true for PoS coins
    coinjs.txExtraTimeFieldValue = false;
    coinjs.txExtraUnitField = false;
    coinjs.txExtraUnitFieldValue = false;

    coinjs.decimalPlaces = 8;

    //confirm in console
    console.log('coinjs.pub: ' +coinjs.pub);
    console.log('coinjs.priv: ' +coinjs.priv);
    console.log('coinjs.multisig: ' +coinjs.multisig);
    console.log('coinjs.hdkey: ', coinjs.hdkey);
    console.log('coinjs.bech32: ', coinjs.bech32);
    console.log('coinjs.supports_address: ', coinjs.supports_address);

  }

  wally_kit.listNetwork = function (network) {

    console.log('mainnet list: ', wally_fn.networks.mainnet);
    console.log('testnet list: ', wally_fn.networks.testnet);
  };


})();


