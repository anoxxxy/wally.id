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


        $.extend(coinjs, wally_fn.networks[network_var][asset_var]);
        //Object.assign(coinjs, (wally_fn.networks[network_var][asset_var]))
        //options.showMessage = true;

        wally_fn.chainModel = coinjs.asset.chainModel;

        //hide/show fields relative to updated Network
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
          + newNetwork.asset.name + ' <strong>('+newNetwork.asset.symbol+' '+newNetwork.asset.network+')</strong> <div class="alert alert-light text-muted mb-2">If this is not correct, head over to <a href="#settings" data-pagescroll="page_tab">Settings</a> page. </div></div>';
        modalMessage += '<img src="'+newNetwork.asset.icon+'" class="icon-center icon64 mb-2">'
        modalMessage += '<div class="text-center text-muted">API Providers:<br> Unspent outputs: '+wally_fn.provider.utxo+'<br>Broadcast: '+wally_fn.provider.broadcast+'</div>';

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
  @ Check if Network Type is set
  */

  wally_kit.routerSettings = async function () {
    console.log('===routerSettings===');



//title: "(string|element|function)",
/*<<< Start Router*/
    var show_about = function () {
        alert('This is the application "About".\n\nCopyright ©2018-2019 Wally.id');
    }

    var show_number = function (num) {
        alert('Number: ' + num);
        console.log('num: ', num)
    }

    var prepareAddAll = function (data) {
      console.log('===prepareAddAll===');
      wally_kit.pageHandler();
      console.log('data: ', data);
    }

    Router
        .add(/home(.*)/, prepareAddAll)
        .add(/newAddress(.*)/, prepareAddAll)
        .add(/newSegWit(.*)/, prepareAddAll)
        .add(/newMultiSig(.*)/, prepareAddAll)
        .add(/newHDaddress(.*)/, prepareAddAll)
        .add(/newTimeLocked(.*)/, prepareAddAll)
        .add(/newTransaction(.*)/, prepareAddAll)
        .add(/kalle(.*)/, prepareAddAll)
        .add(/wallet(.*)/, function(data) {
          console.log('wallet page');
          //alert('sign page');
          prepareAddAll(data);

          //
          //set view to (history-hash) wallet type
          if (Router.urlParams.login) {
            $('#js_folder-content li.folder-item[data-wallet-type="'+Router.urlParams.login+'"]').click();
          }
        })
        .add(/about(.*)/, prepareAddAll)
        .add(/(verify)(.*)/, function(data) {
          console.log('verify page');
          //alert('verify page');
          prepareAddAll(data);
        })
        .add(/(sign)(.*)/, function(data) {
          console.log('sign page');
          //alert('sign page');
          prepareAddAll(data);
        })
        .add(/(broadcast)(.*)/, function(data) {
          console.log('broadcast page');
          //alert('broadcast page');
          prepareAddAll(data);
        })
        .add(/(converter)(.*)/, function(data) {
          console.log('converter page');
          //alert('converter page');
          prepareAddAll(data);
        })
        .add(/(fee)(.*)/, prepareAddAll)
        //.add(/(settings\/)(.*)/, function(data) {
        .add(/(settings)(.*)/, function(data) {
            console.log('settings page', data);
            console.log('parsedUrl: ', Router.urlParams);
            prepareAddAll(data);
        })

        /*.add(/(number)=([0-9]+)&(n)=([0-9]+)/i, function(params) {
            console.log('number=page, data:', params);
            prepareAddAll;
            
        })
        */
        //.add(/number=([0-9]+)/i, show_number)

        //default page
        .add('', function(data) {
          console.log('===EMPTY_PAGE_HASH===');
          console.log('__REDIRECT_TO_STARTPAGE_PERHAPS__');
          prepareAddAll;
          //Router.navigate('home', 'Start');
        })
        .apply()
        .start();

    //Router.navigate();

/*<<< End Router*/



    var network_var = 'mainnet', asset_var = 'bitcoin';

    //get all url params
    //var urlParams = wally_fn.getAllUrlParams();

    //get & set Network type, default(mainnet)
    if (Router.urlParams.network !== undefined) {
      if(Router.urlParams.network == 'testnet')
        network_var = Router.urlParams.network;
    }

    console.log('network: ' + network_var);
    console.log('coinjs.asset: ' + coinjs.asset);
    console.log('Router.urlParams.asset: ' + Router.urlParams.asset);

    //get & set asset type, default(bitcoin)
    if (Router.urlParams.asset !== undefined) {
      console.log('check for Router.urlParams.asset: ' + Router.urlParams.asset);
      /*
      if (wally_fn.networks[ network ][ urlParams.asset] ) {
        console.log ('network: ' + network + '|  asset: ' + urlParams.asset );
      }
      */
      //search for asset name and symbol for i.e (bitcoin/btc)
      for (var [key, value] of Object.entries(wally_fn.networks[ network_var ])) {
        console.log('loop for key, value: '+ key);

        if ( (value.asset.symbols).includes(Router.urlParams.asset) ) {
          asset_var = key;
          console.log('asset was found: ', value.asset.symbol);
          console.log('asset key was found: ', key);

          await this.setNetwork(network_var, asset_var, {saveSettings: true, showMessage: true, renderFields: true});
        }
      }

      //if(!listChainTypes.includes(chainType))

    }



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
  @ Initialize Network Settings!
  */
  wally_kit.initNetwork = async function (networkTypesRadio) {

    console.log('===initNetwork===');
    try {
      //set Host
      wally_fn.setHost();

      //get pageURL Parameters
      await this.routerSettings();

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

    //list donation addresses
    var donationList = '';
    for (var [key, value] of Object.entries(wally_fn.networks.mainnet)) {
      console.log(key+':'+value.developer);
      console.log(value.asset.icon)
      donationList +=('<a class="list-group-item list-group-item-action" alt="Donate to us in '+value.asset.name+' ('+value.asset.symbol+')" href="'+key+':'+value.developer+'"><img src="'+value.asset.icon+'" class="icon32"> '+value.asset.name+' ('+value.asset.symbol+')</a>');
    }

    

    $('#about .donation_list').html('<div class="list-group">'+donationList+'</div>');

      //list donation addresses


  } catch (e) {
      console.log('wally_kit.initNetwork ERROR: ', e)
  }
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


    //default asset if nothing is set!    
    
    console.log('asset_var before: '+asset_var);

    console.log('wally_fn.asset before: ', wally_fn.asset);
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

    var i=0;
    for (var [key, value] of Object.entries(wally_fn.networks[wally_fn.network][wally_fn.asset].asset.api.broadcast)) {
      selectNetworkBroadcastAPI.append('<option value="'+value+'" data-icon="" >'+key+'</option>');
      selectNetworkBroadcastAPIwIcons.append('<li data-icon="./assets/images/providers_icon.svg" data-broadcast-provider="'+value+'" data-broadcast-provider-name="'+key+'"><img src="./assets/images/providers_icon.svg" class="icon32"> '+key+'</li>');

      if(i==0) {//set broadcast asset
          $('#coinjs_broadcast_api_select button').html('<img src="./assets/images/providers_icon.svg" class="icon32"> '+key);
          wally_fn.provider.broadcast = key;
          console.log('Broadcast provider: ' + key);
        }
      i++;
    }

    i=0;
    for (var [key, value] of Object.entries(wally_fn.networks[wally_fn.network][wally_fn.asset].asset.api.unspent_outputs)) {
      selectNetworkUtxoAPI.append('<option value="'+value+'" data-icon="" >'+key+'</option>');
      selectNetworkUtxoAPIwIcons.append('<li data-icon="./assets/images/providers_icon.svg" data-utxo-provider="'+value+'" data-utxo-provider-name="'+key+'"><img src="./assets/images/providers_icon.svg" class="icon32"> '+key+'</li>');


      if (i==0) {//set utxo provider asset
        $('#coinjs_utxo_api_select button').html('<img src="./assets/images/providers_icon.svg" class="icon32"> '+key);
        wally_fn.provider.utxo = key;
        console.log('UTXO provider: ' + key);
      }
      i++;
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


/*
 @ Handles the navigation to the selected page
 use transition, animation, scroll etc...
*/
wally_fn.pageNavigator = function (_elId_ = Router.urlParams.page) {

/*
var pageElement = document.getElementById(_elId_);
//sections.hide(250);
//$(_elId_).show(250);


const pageAnimation = anime.timeline({
  easing: "easeOutCubic",
  autoplay: true });

const scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement;

pageAnimation.
add({
  targets: scrollElement,
  //scrollTop: 0,
  scrollTop: pageElement.offsetTop,
  
  duration: 500,
  easing: 'easeInOutQuad',
  changeBegin: function() {
    //document.querySelector('#js_folder-content').style.position = "absolute";
  }
});


return;
*/


var target = document.getElementById(_elId_);
if(target === null)
          return;


if(_elId_ == "home" || _elId_ == "about"){
  window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  //window.scrollBy({ top: -400, left: 0, behavior: 'smooth' });
  console.log('scroll top')
}else{
  console.log('scroll specific')
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    /*
    var onePromise = new Promise((resolve, reject) => {
      try {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        resolve();
      } catch (e) {
            reject('boo');
      }
    });
      
    onePromise.then((successMessage) => {
      // successMessage is whatever we passed in the resolve(...) function above.
      // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
      console.log(successMessage);
      window.scrollBy({ top: -24, left: 0, behavior: 'smooth' });
      console.log('promise done!');
      //window.scrollBy(0, -30);
    }).catch((reason) => {
        console.log(reason);
    });
    */



  }
  
  


}

  wally_kit.pageHandler = function (pageHash, show=false) {
    
    console.log('===wally_kit.landingPage===');
    //show landing page specific active page/tab
    if (Router.urlParams.page == "home" || Router.urlParams.page == "about") {
      $('.landing_box').removeClass("hidden");
    }else 
      $('.landing_box').addClass("hidden");

    //remove active class from the previous active page
    var tabPages = document.querySelectorAll('.tab-pane.tab-content.active');
    tabPages.forEach(allTabs => {
          if (allTabs.classList.contains('active')) {
            allTabs.classList.remove("active");
            console.log("navigationPageHideAll --> active pages removed!");
          }
      });


    if (wally_fn.navigationPages[Router.urlParams.page].includes(wally_fn.chainModel)) {
      console.log(Router.urlParams.page + ' is availabe for: '+ wally_fn.navigationPages[Router.urlParams.page].toString());
    } else {
      console.log(Router.urlParams.page + ' is ONLY availabe for: '+ wally_fn.navigationPages[Router.urlParams.page].toString());
    }

    //Pagehandling for UTXO model
    //todo: remain on same page when clicking on hashtags inside a page (which also is hashtag based) (for i.e inputs/outputs tab)
    if (wally_fn.chainModel == 'utxo') {

      //set active page if set
      if (Router.urlParams.page && Router.urlParams.page != 'home') {
        document.getElementById(Router.urlParams.page).classList.add("active");
        //smooth scroll to active page
        wally_fn.pageNavigator();
      } else {
        document.getElementById('home').classList.add("active");
        $('.landing_box').removeClass("hidden");
        //no active pag is set, show start page/landing page
      }

    }

    //Pagehandling for Account model
    if (wally_fn.chainModel == 'account') {

      new BootstrapDialog.alert({
        title: 'Whooops...', 
        message: 'Transactions for this asset is not implemented yet!',
        buttonLabel: 'Okidoki',
      });

      //set active page if set
      if (Router.urlParams.page != 'home') {
        document.getElementById('settings').classList.add("active");
        //smooth scroll to active page
        wally_fn.pageNavigator();
      } else {
        document.getElementById('home').classList.add("active");
        $('.landing_box').removeClass("hidden");
        //no active pag is set, show start page/landing page
      }

      
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


  //remove "_select" from id to get it equivalent select element
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

  

  //change portfolio type
  $('a[data-set-wallet-type]').on('click', function() {
    console.log('===setWalletPortfolio===');
    var setWalletPortfolio = $(this).attr('data-set-wallet-type');
    console.log('wallet_type_clicked: ', setWalletPortfolio);

    //$('#js_folder-content li.folder-item[data-wallet-type="'+setWalletPortfolio+'"]').click();

  });

  




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