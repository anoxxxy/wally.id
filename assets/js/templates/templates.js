'use strict';

console.log('===init.Mikado.Templates===');
/* Mikado Templates */

//* Wallet Logged in Templates
//template for rendering all supported coins
/*data.name
data.icon
data.chainModel
data.symbol
*/

function convertToMainUnit(value, decimals = 8, asString = true) {
  if (value === 0) {
    return asString ? '0' : 0;
  }

  const mainUnitValue = value / Math.pow(10, decimals);
  return asString ? mainUnitValue.toFixed(decimals) : mainUnitValue;
}

const walletAssetsTplOld = `
  <div class="list-border position-relative">
    <div class="list-wrapper">
      <div class="list-name">
        <div class="coin-icon">
          <div class="icon icon36">
            <img src="{{data.icon}}">
          </div>
        </div>
        <div class="coin-info">
          <span class="title">
            <a href="#wallet/asset/{{data.slug}}" class="stretched-link">{{data.name}}</a>
            <span class="badge badge-primary chain_model ml-1">{{data.chainModel}}</span>
          </span>
          <span class="subtitle">
            <span class="balance"></span> <span> {{data.symbol}}</span></span>
        </div>
      </div>
      <div class="list-details">
        <div class="calendar">
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-flat-primary">
              <img src="./assets/images/send.svg" class="icon24"> <span>Send</span></button>
            <button type="button" class="btn btn-sm btn-flat-primary dropdown-toggle dropdown-toggle-split dropdown-without-arrow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="bi bi-caret-down"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item" href="#wallet/send/{{data.slug}}">
                <img src="./assets/images/send.svg" class="icon28"> <span>Send</span> </a>
              <a class="dropdown-item" href="#wallet/receive/{{data.slug}}">
                <img src="./assets/images/receive.svg" class="icon28"> <span>Receive</span></a>
              <a class="dropdown-item" href="#wallet/settings/{{data.slug}}">
                <img src="./assets/images/settings.svg" class="icon28"> <span>Settings</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  const walletAssetsTpl = `
  <div class="list-border position-relative">
    <div class="list-wrapper">
      <div class="list-name">
        <div class="coin-icon">
          <div class="icon icon36">
            <img src="{{data.icon}}">
          </div>
        </div>
        <div class="coin-info">
          <span class="title">
            <a href="#wallet/asset/{{data.slug}}" class="stretched-link">{{data.name}}</a>
            <span class="badge badge-primary chain_model ml-1">{{data.chainModel}}</span>
          </span>
          <span class="subtitle">
            <span class="balance">0</span> <span> {{data.symbol}}</span></span>
        </div>
      </div>
      <div class="list-details">
        <div class="">
          <div class="">
            <button type="button" class="btn btn-sm btn-flat-primary">
              $0
              </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;

const containerWalletAssets = document.getElementById("userWalletAssets");
console.log('containerWalletAssets: ', containerWalletAssets);
const tplWalletAssetsTplC = Mikado.compile(walletAssetsTpl);
wally_fn.tpl.seed.viewWalletAssets  = Mikado(containerWalletAssets, tplWalletAssetsTplC, {
  on: {
    create: function(node) {
      //console.log("Mikado.Templates.viewReceiveAddresses - created:", node);
    },
    insert: function(node) {
      //console.log("Mikado.Templates.viewReceiveAddresses - inserted:", node);
    },
    update: function(node) {
      //console.log("Mikado.Templates.viewReceiveAddresses - updated:", node);
    },
    change: function(node) {
      //console.log("Mikado.Templates.viewReceiveAddresses - changed:", node);
    },
    remove: function(node) {
      //console.log("Mikado.Templates.viewReceiveAddresses - removed:", node);
    },
    cache: false,
  }
});


//template for rendering receive addresses
const seedReceiveAddressesTpl = `
<li class="flex-list m-1 p-1 mb-2">
  <div class="d-flex ml-1">
    <div class="d-flex align-items-center mr-1">
      <div class="blockie_wrapper blockie_address" ><img class="icon icon24" src="{{=data.blockieIcon}}"></div>
    </div>
    <div class="d-flex flex-column flex-grow-1">
      <div class="d-flex justify-content-between">
        <div>
          <div class="mb-0 d-inline-block truncate-sm fs-3 coin_address coin_receive_address">{{=data.addr}} </div>
        </div>
        <div class="d-flex align-items-start">
          <div class="address_path mb-1 text-black-50 date-time"><span>{{ (data.path == true ? 'path:' : '') }}</span> <span class="coin_address_path text-primary">{{=data.derivedPath}}</span></div>
        </div>        
      </div>
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <div class="d-flex flex-row">
            <div class="font-weight-bold">
            <span class="badge badge-light fs-3 p-1 text-muted mr-1"><span class="coin_address_balance">{{=convertToMainUnit(data.ext.final_balance)}}</span> <span class="coin_symbol ml-1"> {{=data.coin}}</span></span> 
            </div>
          </div>
        </div>
        <div>
          <div class="list-action">
            <div class="btn-group">
              
              <a href="#addressInfoModal" role="button" data-toggle="modal" data-address="{{=data.addr}}" data-blockieicon="{{=data.blockieIcon}}" data-coin="{{=data.coin}}" data-pubkey="{{=data.pubkey}}" data-privkey="{{=data.privkey}}" data-privkeyhex="{{=data.privkeyhex}}" data-derived-path={{=data.derivedPath}} class="btn btn-sm btn-flat-primary"><i class="bi bi-info-circle"></i> <span> info</span></a>
              
              <button type="button" class="btn btn-sm btn-flat-primary dropdown-toggle dropdown-toggle-split dropdown-without-arrow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="bi bi-caret-down"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#"><img src="./assets/images/send.svg" class="icon28" /> <span>Send</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/receive.svg" class="icon28" /> <span>Receive</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/qr-code.svg" class="icon28" /> <span>QR code</span></a>
                <a class="dropdown-item" href="#addressInfoModal" role="button" data-toggle="modal" data-address="{{=data.addr}}" data-blockieicon="{{=data.blockieIcon}}" data-coin="{{=data.coin}}" data-pubkey="{{=data.pubkey}}" data-privkey="{{=data.privkey}}" data-privkeyhex="{{=data.privkeyhex}}" data-derived-path={{=data.derivedPath}}><img src="./assets/images/info.svg" class="icon28" /> <span>Info</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</li>`;
const containerSeedReceiveAddresses = document.getElementById("receiveAddressesTpl");
console.log('containerSeedReceiveAddresses: ', containerSeedReceiveAddresses);
const tplSeedReceiveAddressesC = Mikado.compile(seedReceiveAddressesTpl);
wally_fn.tpl.seed.viewReceiveAddresses  = Mikado(containerSeedReceiveAddresses, tplSeedReceiveAddressesC, {
  on: {
    create: function(node) {
      //console.log("Mikado.Templates.viewReceiveAddresses - created:", node);
    },
    insert: function(node) {
      //console.log("Mikado.Templates.viewReceiveAddresses - inserted:", node);
    },
    update: function(node) {
      //console.log("Mikado.Templates.viewReceiveAddresses - updated:", node);
    },
    change: function(node) {
      //console.log("Mikado.Templates.viewReceiveAddresses - changed:", node);
    },
    remove: function(node) {
      //console.log("Mikado.Templates.viewReceiveAddresses - removed:", node);
    },
    cache: false,
  }
});


//template for rendering change addresses
const seedChangeAddressesTpl = `
<li class="flex-list m-1 p-1 mb-2">
  <div class="d-flex ml-1">
    <div class="d-flex align-items-center mr-1">
      <div class="blockie_wrapper blockie_address" ><img class="icon icon24" src="{{=data.blockieIcon}}"></div>
    </div>
    <div class="d-flex flex-column flex-grow-1">
      <div class="d-flex justify-content-between">
        <div>
          <div class="mb-0 d-inline-block truncate-sm fs-3 coin_address coin_receive_address">{{=data.addr}} </div>
        </div>
        <div class="d-flex align-items-start">
          <div class="address_path mb-1 text-black-50 date-time"><span if="data.path">path:</span> <span class="coin_address_path text-primary">{{=data.derivedPath}}</span></div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <div class="d-flex flex-row">
            <div class="font-weight-bold">
            <span class="badge badge-light fs-3 p-1 text-muted mr-1"><span class="coin_address_balance">{{=convertToMainUnit(data.ext.final_balance)}}</span> <span class="coin_symbol ml-1"> {{=data.coin}}</span></span> 
            </div>
          </div>
        </div>
        <div>
          <div class="list-action">
            <div class="btn-group">
              <a href="#addressInfoModal" role="button" data-toggle="modal" data-address="{{=data.addr}}" data-blockieicon="{{=data.blockieIcon}}" data-coin="{{=data.coin}}" data-pubkey="{{=data.pubkey}}" data-privkey="{{=data.privkey}}" data-privkeyhex="{{=data.privkeyhex}}" data-derived-path={{=data.derivedPath}} class="btn btn-sm btn-flat-primary"><i class="bi bi-info-circle"></i> <span> info</span></a>
              <button type="button" class="btn btn-sm btn-flat-primary dropdown-toggle dropdown-toggle-split dropdown-without-arrow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="bi bi-caret-down"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#"><img src="./assets/images/send.svg" class="icon28" /> <span>Send</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/receive.svg" class="icon28" /> <span>Receive</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/qr-code.svg" class="icon28" /> <span>QR code</span></a>
                <a class="dropdown-item" href="#addressInfoModal" role="button" data-toggle="modal" data-address="{{=data.addr}}" data-blockieicon="{{=data.blockieIcon}}" data-coin="{{=data.coin}}" data-pubkey="{{=data.pubkey}}" data-privkey="{{=data.privkey}}" data-privkeyhex="{{=data.privkeyhex}}" data-derived-path={{=data.derivedPath}}><img src="./assets/images/info.svg" class="icon28" /> <span>Info</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</li>`;

const containerSeedChangeAddresses = document.getElementById("changeAddressesTpl");
const tplSeedChangeAddressesC = Mikado.compile(seedChangeAddressesTpl);

wally_fn.tpl.seed.viewChangeAddresses  = Mikado(containerSeedChangeAddresses, tplSeedChangeAddressesC, {
  on: {
    create: function(node) {
      //console.log("Mikado.Templates.viewChangeAddresses - created:", node);
    },
    insert: function(node) {
      //console.log("Mikado.Templates.viewChangeAddresses - inserted:", node);
    },
    update: function(node) {
      //console.log("Mikado.Templates.viewChangeAddresses - updated:", node);
    },
    change: function(node) {
      //console.log("Mikado.Templates.viewChangeAddresses - changed:", node);
    },
    remove: function(node) {
      //console.log("Mikado.Templates.viewChangeAddresses - removed:", node);
    },
    cache: false,
  }
});



function capitalizeFirstLetter (strName){
    return strName.charAt(0).toUpperCase() + strName.slice(1);
}

//template for rendering wallet provider options for balance 
const apiBalanceProviderOptionsTpl = `
<option value="{{=data.name}}">{{=capitalizeFirstLetter(data.name)}}</option>
`;

const containerApiBalanceProviderSelect = document.getElementById("apiBalanceProviderSelector");
const tplApiBalanceProviderOptionsC = Mikado.compile(apiBalanceProviderOptionsTpl);

wally_fn.tpl.seed.viewBalanceProviderOptions  = Mikado(containerApiBalanceProviderSelect, tplApiBalanceProviderOptionsC, {
  on: {
    create: function(node) {
      console.log("Mikado.Templates.viewBalanceProviderOptions - created:", node);
    },
    insert: function(node) {
      console.log("Mikado.Templates.viewBalanceProviderOptions - inserted:", node);
    },
    update: function(node) {
      console.log("Mikado.Templates.viewBalanceProviderOptions - updated:", node);
    },
    change: function(node) {
      console.log("Mikado.Templates.viewBalanceProviderOptions - changed:", node);
    },
    remove: function(node) {
      console.log("Mikado.Templates.viewBalanceProviderOptions - removed:", node);
    },
    async: true,
    reuse: true,
    cache: false,
  }
});


//template for rendering wallet provider options for listunspent
const apiListunspentProviderOptionsTpl = `
<option value="{{=data.name}}">{{=capitalizeFirstLetter(data.name)}}</option>
`;

const containerApiListunspentProviderSelect = document.getElementById("apiListunspentProviderSelector");
const tplListunspentProviderOptionsC = Mikado.compile(apiListunspentProviderOptionsTpl);

wally_fn.tpl.seed.viewListunspentProviderOptions  = Mikado(containerApiListunspentProviderSelect, tplListunspentProviderOptionsC, {
  on: {
    create: function(node) {
      //console.log("Mikado.Templates.viewListunspentProviderOptions - created:", node);
    },
    insert: function(node) {
      //console.log("Mikado.Templates.viewListunspentProviderOptions - inserted:", node);
    },
    update: function(node) {
      //console.log("Mikado.Templates.viewListunspentProviderOptions - updated:", node);
    },
    change: function(node) {
      //console.log("Mikado.Templates.viewListunspentProviderOptions - changed:", node);
    },
    remove: function(node) {
      //console.log("Mikado.Templates.viewListunspentProviderOptions - removed:", node);
    },
    async: true,
    reuse: true,
    cache: false,
  }
});


//template for rendering wallet provider options for listunspent
const apiPushrawtxProviderOptionsTpl = `
<option value="{{=data.name}}">{{=capitalizeFirstLetter(data.name)}}</option>
`;

const containerApiPushrawtxProviderSelect = document.getElementById("apiPushrawtxProviderSelector");
const tplPushrawtxProviderOptionsC = Mikado.compile(apiPushrawtxProviderOptionsTpl);

wally_fn.tpl.seed.viewPushrawtxProviderOptions  = Mikado(containerApiPushrawtxProviderSelect, tplPushrawtxProviderOptionsC, {
  on: {
    create: function(node) {
      //console.log("Mikado.Templates.viewPushrawtxProviderOptions - created:", node);
    },
    insert: function(node) {
      //console.log("Mikado.Templates.viewPushrawtxProviderOptions - inserted:", node);
    },
    update: function(node) {
      //console.log("Mikado.Templates.viewPushrawtxProviderOptions - updated:", node);
    },
    change: function(node) {
      //console.log("Mikado.Templates.viewPushrawtxProviderOptions - changed:", node);
    },
    remove: function(node) {
      //console.log("Mikado.Templates.viewPushrawtxProviderOptions - removed:", node);
    },
    async: true,
    reuse: true,
    cache: false,
  }
});

//ElectrumX nodes template settings

//template for rendering wallet provider options for balance 
const apiBalanceProviderNodeOptionsTpl = `
<option value="{{=data.url}}">{{=data.name}} ({{=data.protocol}})</option>
`;

const containerApiBalanceProviderNodeSelect = document.getElementById("apiBalanceProviderNodeSelector");
const tplApiBalanceProviderNodeOptionsC = Mikado.compile(apiBalanceProviderNodeOptionsTpl);

wally_fn.tpl.seed.viewBalanceProviderNodeOptions  = Mikado(containerApiBalanceProviderNodeSelect, tplApiBalanceProviderNodeOptionsC, {
  on: {
    create: function(node) {
      //console.log("Mikado.Templates.viewBalanceProviderNodeOptions - created:", node);
    },
    insert: function(node) {
      //console.log("Mikado.Templates.viewBalanceProviderNodeOptions - inserted:", node);
    },
    update: function(node) {
      //console.log("Mikado.Templates.viewBalanceProviderNodeOptions - updated:", node);
    },
    change: function(node) {
      //console.log("Mikado.Templates.viewBalanceProviderNodeOptions - changed:", node);
    },
    remove: function(node) {
      //console.log("Mikado.Templates.viewBalanceProviderNodeOptions - removed:", node);
    },
    async: false,
    reuse: true,
    cache: true,
  }
});


//template for rendering wallet provider options for listunspent
const apiListunspentProviderNodeOptionsTpl = `
<option value="{{=data.url}}">{{=data.name}} ({{=data.protocol}})</option>
`;

const containerApiListunspentProviderNodeSelect = document.getElementById("apiListunspentProviderNodeSelector");
const tplListunspentProviderNodeOptionsC = Mikado.compile(apiListunspentProviderNodeOptionsTpl);

wally_fn.tpl.seed.viewListunspentProviderNodeOptions  = Mikado(containerApiListunspentProviderNodeSelect, tplListunspentProviderNodeOptionsC, {
  on: {
    create: function(node) {
      //console.log("Mikado.Templates.viewListunspentProviderNodeOptions - created:", node);
    },
    insert: function(node) {
      //console.log("Mikado.Templates.viewListunspentProviderNodeOptions - inserted:", node);
    },
    update: function(node) {
      //console.log("Mikado.Templates.viewListunspentProviderNodeOptions - updated:", node);
    },
    change: function(node) {
      //console.log("Mikado.Templates.viewListunspentProviderNodeOptions - changed:", node);
    },
    remove: function(node) {
      //console.log("Mikado.Templates.viewListunspentProviderNodeOptions - removed:", node);
    },
    async: false,
    reuse: true,
    cache: true,
  }
});


//template for rendering wallet provider options for listunspent
const apiPushrawtxProviderNodeOptionsTpl = `
<option value="{{=data.url}}">{{=data.name}} ({{=data.protocol}})</option>
`;

const containerApiPushrawtxProviderNodeSelect = document.getElementById("apiPushrawtxProviderNodeSelector");
const tplPushrawtxProviderNodeOptionsC = Mikado.compile(apiPushrawtxProviderNodeOptionsTpl);

wally_fn.tpl.seed.viewPushrawtxProviderNodeOptions  = Mikado(containerApiPushrawtxProviderNodeSelect, tplPushrawtxProviderNodeOptionsC, {
  on: {
    create: function(node) {
      //console.log("Mikado.Templates.viewPushrawtxProviderNodeOptions - created:", node);
    },
    insert: function(node) {
      //console.log("Mikado.Templates.viewPushrawtxProviderNodeOptions - inserted:", node);
    },
    update: function(node) {
      //console.log("Mikado.Templates.viewPushrawtxProviderNodeOptions - updated:", node);
    },
    change: function(node) {
      //console.log("Mikado.Templates.viewPushrawtxProviderNodeOptions - changed:", node);
    },
    remove: function(node) {
      //console.log("Mikado.Templates.viewPushrawtxProviderNodeOptions - removed:", node);
    },
    async: false,
    reuse: true,
    cache: true,
  }
});


