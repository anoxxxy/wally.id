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
            <span class="balance">0</span> <span> {{data.symbol}}</span></span>
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
      <div class="blockie_wrapper blockie_address" ><img class="icon icon24" src="{{data.blockieIcon}}"></div>
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
            <span class="badge badge-light fs-3 p-1 text-muted mr-1"><span class="coin_address_balance">-</span> <span class="coin_symbol"> {{=data.coin}}</span></span> <span class="badge badge-light fs-4 pl-2 text-muted mr-1"><i class="bi bi-arrow-down-left"></i> <span>0</span></span> <span class="badge badge-light fs-4 pl-2 text-muted "><i class="bi bi-arrow-down-up"></i> <span>TX: 0</span></span>
            </div>
          </div>
        </div>
        <div>
          <div class="list-action">
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-flat-primary"><i class="bi bi-info-circle"></i> <span> info</span></button>
              <button type="button" class="btn btn-sm btn-flat-primary dropdown-toggle dropdown-toggle-split dropdown-without-arrow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="bi bi-caret-down"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#"><img src="./assets/images/send.svg" class="icon28" /> <span>Send</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/receive.svg" class="icon28" /> <span>Receive</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/qr-code.svg" class="icon28" /> <span>QR code</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/info.svg" class="icon28" /> <span>Info</span></a>
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
      <div class="blockie_wrapper blockie_address" ><img class="icon icon24" src="{{data.blockieIcon}}"></div>
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
            <span class="badge badge-light fs-3 p-1 text-muted mr-1"><span class="coin_address_balance">-</span> <span class="coin_symbol"> {{=data.coin}}</span></span><span class="badge badge-light fs-4 pl-2 text-muted mr-1"><i class="bi bi-arrow-down-left"></i> <span>0</span></span> <span class="badge badge-light fs-4 pl-2 text-muted "><i class="bi bi-arrow-down-up"></i> <span>TX: 0</span></span>
            </div>
          </div>
        </div>
        <div>
          <div class="list-action">
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-flat-primary"><i class="bi bi-info-circle"></i> <span> info</span></button>
              <button type="button" class="btn btn-sm btn-flat-primary dropdown-toggle dropdown-toggle-split dropdown-without-arrow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="bi bi-caret-down"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#"><img src="./assets/images/send.svg" class="icon28" /> <span>Send</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/receive.svg" class="icon28" /> <span>Receive</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/qr-code.svg" class="icon28" /> <span>QR code</span></a>
                <a class="dropdown-item" href="#"><img src="./assets/images/info.svg" class="icon28" /> <span>Info</span></a>
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