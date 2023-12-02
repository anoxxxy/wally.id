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
const walletAssetsTpl = `
  <div class="list-border position-relative">
    <div class="list-wrapper">
      <div class="list-name">
        <div class="coin-icon">
          <div class="icon icon32">
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
              <a class="dropdown-item" href="#wallet/send/{{data.slug}">
                <img src="./assets/images/send.svg" class="icon28"> <span>Send</span> </a>
              <a class="dropdown-item" href="#wallet/receive/{{data.slug}">
                <img src="./assets/images/receive.svg" class="icon28"> <span>Receive</span></a>
              <a class="dropdown-item" href="#wallet/settings/{{data.slug}}">
                <img src="./assets/images/settings.svg" class="icon28"> <span>Settings</span></a>
            </div>
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
            <span class="badge badge-light fs-3 p-1 text-muted mr-1"><span class="coin_address_balance">{{=data.ext.final_balance}}</span> <span class="coin_symbol ml-1"> {{=data.coin}}</span></span> <span class="badge badge-light fs-4 pl-2 text-muted mr-1"><i class="bi bi-arrow-down-left"></i> <span>{{=data.ext.total_received}}</span></span> <span class="badge badge-light fs-4 pl-2 text-muted "><i class="bi bi-arrow-down-up"></i> <span class="font-weight-normal">TX:</span><span> {{=data.ext.n_tx}}</span></span>
            </div>
          </div>
        </div>
        <div>
          <div class="list-action">
            <div class="btn-group">
              
              <a href="#addressInfoModal" role="button" data-toggle="modal" data-address="{{=data.addr}}" data-blockieicon="{{=data.blockieIcon}}" data-coin="{{=data.coin}}" data-pubkey="{{=data.pubkey}}" data-privkey="{{=data.privkey}}" data-privkeyhex="{{=data.privkeyhex}}" data-derived-path="{{=data.derivedPath}}" class="btn btn-sm btn-flat-primary"><i class="bi bi-info-circle"></i> <span> info</span></a>
              
              <button type="button" class="btn btn-sm btn-flat-primary dropdown-toggle dropdown-toggle-split dropdown-without-arrow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="bi bi-caret-down"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#"><img src="./assets/images/send.svg" class="icon28" /> <span>Send</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/receive.svg" class="icon28" /> <span>Receive</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/qr-code.svg" class="icon28" /> <span>QR code</span></a>
                <a class="dropdown-item" href="#addressInfoModal" role="button" data-toggle="modal" data-address="{{=data.addr}}" data-blockieicon="{{=data.blockieIcon}}" data-coin="{{=data.coin}}" data-pubkey="{{=data.pubkey}}" data-privkey="{{=data.privkey}}" data-privkeyhex="{{=data.privkeyhex}}" data-derived-path="{{=data.derivedPath}}"><img src="./assets/images/info.svg" class="icon28" /> <span>Info</span></a>
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
            <span class="badge badge-light fs-3 p-1 text-muted mr-1"><span class="coin_address_balance">{{=data.ext.final_balance}}</span> <span class="coin_symbol ml-1"> {{=data.coin}}</span></span> <span class="badge badge-light fs-4 pl-2 text-muted mr-1"><i class="bi bi-arrow-down-left"></i> <span>{{=data.ext.total_received}}</span></span> <span class="badge badge-light fs-4 pl-2 text-muted "><i class="bi bi-arrow-down-up"></i> <span><span class="font-weight-normal">TX:</span><span> {{=data.ext.n_tx}}</span></span>
            </div>
          </div>
        </div>
        <div>
          <div class="list-action">
            <div class="btn-group">
              <a href="#addressInfoModal" role="button" data-toggle="modal" data-address="{{=data.addr}}" data-blockieicon="{{=data.blockieIcon}}" data-coin="{{=data.coin}}" data-pubkey="{{=data.pubkey}}" data-privkey="{{=data.privkey}}" data-privkeyhex="{{=data.privkeyhex}}" data-derived-path="{{=data.derivedPath}}" class="btn btn-sm btn-flat-primary"><i class="bi bi-info-circle"></i> <span> info</span></a>
              <button type="button" class="btn btn-sm btn-flat-primary dropdown-toggle dropdown-toggle-split dropdown-without-arrow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="bi bi-caret-down"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#"><img src="./assets/images/send.svg" class="icon28" /> <span>Send</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/receive.svg" class="icon28" /> <span>Receive</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/qr-code.svg" class="icon28" /> <span>QR code</span></a>
                <a class="dropdown-item" href="#addressInfoModal" role="button" data-toggle="modal" data-address="{{=data.addr}}" data-blockieicon="{{=data.blockieIcon}}" data-coin="{{=data.coin}}" data-pubkey="{{=data.pubkey}}" data-privkey="{{=data.privkey}}" data-privkeyhex="{{=data.privkeyhex}}" data-derived-path="{{=data.derivedPath}}"><img src="./assets/images/info.svg" class="icon28" /> <span>Info</span></a>
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

function capitalizeFirstLetter (strName){
    return strName.charAt(0).toUpperCase() + strName.slice(1);
}
//template for rendering wallet provider options for listunspent
const apiListunspentProviderOptionsTpl = `
<option value="{{=data.name}}">{{=capitalizeFirstLetter(data.name)}}</option>
`;

const containerApiListunspentProviderSelect = document.getElementById("apiListunspentProviderSelector");
const tplListunspentProviderOptionsC = Mikado.compile(apiListunspentProviderOptionsTpl);

wally_fn.tpl.seed.viewListunspentProviderOptions  = Mikado(containerApiListunspentProviderSelect, tplListunspentProviderOptionsC, {
  on: {
    create: function(node) {
      console.log("Mikado.Templates.viewListunspentProviderOptions - created:", node);
    },
    insert: function(node) {
      console.log("Mikado.Templates.viewListunspentProviderOptions - inserted:", node);
    },
    update: function(node) {
      console.log("Mikado.Templates.viewListunspentProviderOptions - updated:", node);
    },
    change: function(node) {
      console.log("Mikado.Templates.viewListunspentProviderOptions - changed:", node);
    },
    remove: function(node) {
      console.log("Mikado.Templates.viewListunspentProviderOptions - removed:", node);
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
      console.log("Mikado.Templates.viewPushrawtxProviderOptions - created:", node);
    },
    insert: function(node) {
      console.log("Mikado.Templates.viewPushrawtxProviderOptions - inserted:", node);
    },
    update: function(node) {
      console.log("Mikado.Templates.viewPushrawtxProviderOptions - updated:", node);
    },
    change: function(node) {
      console.log("Mikado.Templates.viewPushrawtxProviderOptions - changed:", node);
    },
    remove: function(node) {
      console.log("Mikado.Templates.viewPushrawtxProviderOptions - removed:", node);
    },
    async: true,
    reuse: true,
    cache: false,
  }
});




/*
//template for rendering wallet address info
const addressInfoTpl = `
<div>
<div class="input-group-callout" data-adress-info="qr_code_address">
  <div class="callout-title text-muted text-primary d-flex justify-content-center mx-auto mb-2">QR code of Address</div>
  <div id="addressInfoQrCode" class="d-flex justify-content-center mx-auto"><div>{{#=data.qrCode}}</div></div>
</div>
<div class="input-group-callout" data-adress-info="address">
  <div class="callout-title text-muted text-primary">
    <span class="coin_symbol"></span> Address
  </div>
  <div class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text cursor-pointer mr-0 ml-0 pr-2 pl-2">
        <img class="blockieIcon icon icon24" src="{{=data.blockieIcon}}">
        
      </span>
    </div>
    <input id="" type="text" class="form-control addr" value="{{=data.addr}}" readonly />
    <div class="input-group-append">
      <span class="input-group-text cursor-pointer" title="Copy Address" data-copy-content="{{=data.addr}}">
        <i class="bi bi-copy icon"></i>
      </span>
    </div>
  </div>
</div>
<div class="input-group-callout" data-adress-info="path_type">
  <div class="callout-title text-muted text-primary">Path/Type</div>
  <div class="input-group">
    <input id="" type="text" class="form-control path_type" value="{{=data.derivedPath}}" readonly />
    <div class="input-group-append">
      <span class="input-group-text cursor-pointer" title="Copy" data-copy-content="{{=data.derivedPath}}">
        <i class="bi bi-copy icon"></i>
      </span>
    </div>
  </div>
</div>
<div class="input-group-callout" data-adress-info="pubkey">
  <div class="callout-title text-muted text-primary">Public Key</div>
  <div class="input-group">
    <input id="" type="text" class="form-control pubkey" value="{{=data.pubkey}}" readonly />
    <div class="input-group-append">
      <span class="input-group-text cursor-pointer" title="Copy Public Key" data-copy-content="{{=data.pubkey}}">
        <i class="bi bi-copy icon"></i>
      </span>
    </div>
  </div>
</div>
<div class="input-group-callout" data-adress-info="privkey">
  <div class="callout-title text-muted text-primary">Private Key (WIF)</div>
  <div class="input-group">
    <input id="" type="password" class="form-control privkey" value="{{=data.privkey}}" readonly />
    <div class="input-group-append">
      <span class="showKey input-group-text cursor-pointer">
        <i class="bi bi-eye-fill"></i>
      </span>
    </div>
    <div class="input-group-append">
      <span class="input-group-text cursor-pointer" title="Copy Private Key (WIF)" data-copy-content="{{=data.privkey}}">
        <i class="bi bi-copy icon"></i>
      </span>
    </div>
  </div>
</div>
<div class="input-group-callout" data-adress-info="privkeyhex">
  <div class="callout-title text-muted text-primary">Private Key (HEX)</div>
  <div class="input-group">
    <input id="" type="password" class="form-control privkeyhex" value="{{=data.privkeyhex}}" readonly />
    <div class="input-group-append">
      <span class="showKey input-group-text cursor-pointer">
        <i class="bi bi-eye-fill"></i>
      </span>
    </div>
    <div class="input-group-append">
      <span class="input-group-text cursor-pointer" title="Copy Private  Key (HEX)" data-copy-content="{{=data.privkeyhex}}">
        <i class="bi bi-copy icon"></i>
      </span>
    </div>
  </div>
</div>
</div>
`;

const containerAddressInfoTpl = document.getElementById("addressInfo");
const tplAddressInfoC = Mikado.compile(addressInfoTpl);

wally_fn.tpl.viewAddressInfo  = Mikado(containerAddressInfoTpl, tplAddressInfoC, {
  on: {
    create: function(node) {
      console.log("Mikado.Templates.viewAddressInfo - created:", node);
    },
    insert: function(node) {
      console.log("Mikado.Templates.viewAddressInfo - inserted:", node);
    },
    update: function(node) {
      console.log("Mikado.Templates.viewAddressInfo - updated:", node);
    },
    change: function(node) {
      console.log("Mikado.Templates.viewAddressInfo - changed:", node);
    },
    remove: function(node) {
      console.log("Mikado.Templates.viewAddressInfo - removed:", node);
    },
    async: true,
    reuse: true,
    cache: false,
  }
});
*/
