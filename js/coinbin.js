'use strict';
var bip39 = new BIP39('en');
var wweb3 = new Web3(new Web3.providers.HttpProvider(''));

var coinbinf = window.coinbinf = function () { };
//var coinbinjs = {}; 

$(document).ready(function() {

		console.log('coinbinf.init');

		//custom modal
  	coinbinf.backdropEl = $('.modal-backdrop');
  	coinbinf.backdrop = function(open = true) {
  		//$("body").append("<div class='modal-backdrop fade show'></div>");
  		if(open)
  			coinbinf.backdropEl.removeClass('hidden');
  		else
  			coinbinf.backdropEl.addClass('hidden');

  	}
	


  	//Init POPUP for BIP PROTOCOLS AND CLIENTS DERIVATION <- Manual Pages
  	var popoverBIPProtocol = new jBox('Tooltip', {
    attach: '.newMnemonicWords',
    width: 280,
    trigger: 'click',
    class: 'popover',
    closeOnClick: 'body',
    addClass: 'JBoxPopover hidden',
    overlayClass: 'ice-car',
    id: 'popBIPSettingsJBox',
    //closeOnMouseleave: true,
    animation: 'zoomIn',
    content: $('#popBIPSettings').html(),
    createOnInit: true,
    onInit: function() { 
    	console.log('this: ', this);
    	//this.wrapper[0].classList.add('hidden icee');
    	/*this.open(); 
    	this.close(10);
    	this.wrapper[0].classList.add('hidden');
    	*/
    },
    onOpen: function () {
    	//$("body").append("<div class='modal-backdrop fade show'></div>");
    	coinbinf.backdrop();
      //this.source.addClass('active').html('Now scroll');
			
			//console.log('this: ', this);
			//console.log('this.source: ', this.source);
			//if (this.wrapper[0].classList.contains('hidden'))
				//this.wrapper[0].classList.remove('hidden');
			
    },
    onClose: function () {
      //this.source.removeClass('active').html('Click me');
      coinbinf.backdrop(false);
      
    }
  });

  $('#popBIPSettingsJBox').removeClass('hidden');

	//Init POPUP for Seed Login <- Login Page
	var popoverBIPProtocol = new jBox('Tooltip', {
    attach: '.newMnemonicLoginWords',
    width: 280,
    trigger: 'click',
    class: 'popover',
    closeOnClick: 'body',
    addClass: 'JBoxPopover hidden',
    overlayClass: 'ice-car',
    id: 'popSeedLoginSettingsJBox',
    //closeOnMouseleave: true,
    animation: 'zoomIn',
    content: $('#popBIPLoginSettings').html(),
    createOnInit: true,
    position: {
	    x: 'left',
	    y: 'bottom'
	  },
    onInit: function() { 
    	console.log('this: ', this);
    },
    onOpen: function () {
    	//coinbinf.backdrop();
    },
    onClose: function () {
      coinbinf.backdrop(false);
      
    }
  });

  $('#popSeedLoginSettingsJBox').removeClass('hidden');


  	//BIP Path to render from
  	coinbinf.bippath = $("#bip_path");

  	//derive from BIP Protocol on Mnemonic page
  	coinbinf.deriveFromBipProtocol = $('#popBIPSettingsJBox #bipProtocol');

  	//select - client wallet
  	coinbinf.bip32Client = $("#bip32-client");
  	coinbinf.bipMnemonicClientProtocol = $('#popBIPSettingsJBox .bipMnemonicClientProtocol');

  	coinbinf.newMnemonicPubInput = $('#newMnemonicPub');
  	coinbinf.newMnemonicPrvInput = $('#newMnemonicPrv');

  	  // BIP Tab names
  coinbinf.hdkeyTab = $('#bipDerivationTabBip32');
  coinbinf.bip32Tab = $('#bipDerivationTabBip32');
  coinbinf.bip44Tab = $('#bipDerivationTabBip44');
  coinbinf.bip49Tab = $('#bipDerivationTabBip49');
  coinbinf.bip84Tab = $('#bipDerivationTabBip84');

  //BIP Tab Content
  coinbinf.hdkeyTabContent = $('#bipTab32');
  coinbinf.bip32TabContent = $('#bipTab32');
  coinbinf.bip44TabContent = $('#bipTab44');
  coinbinf.bip49TabContent = $('#bipTab49');
  coinbinf.bip84TabContent = $('#bipTab84');
  
  //BIP Path
  coinbinf.bip32path = $('#bip32-path');
  coinbinf.bip44path = $('#bip44-path');
  coinbinf.bip49path = $('#bip49-path');
  coinbinf.bip84path = $('#bip84-path');

  //BIP Coin BIP/SLIP path
  coinbinf.bipCoinPathTabContent = $('#bipDerivationTabContents input.coin');

  //BIP Verify Script
  coinbinf.verifyScript = $("#verifyScript");

  coinbinf.bipAddressSemantics = 'p2wpkh';	//added for electrum address derivation

  //Login
  coinbinf.openClientWalletPassphrase = $('#openSeedPasswordBox');
  coinbinf.openClientWalletPassphraseCheck = $('#newOpenSeedBrainwalletCheck');
  coinbinf.openSeedPassword = $('#openSeedPassword')
  coinbinf.openClientWallet = $('#openClientWallet');
  coinbinf.openSeed = $('#openSeed');

  coinbinf.openSeedElectrumOptions = $('#openSeedElectrumOptions');
  coinbinf.openSeedElectrumAddressOptionRadio = $("input[name='openSeedElectrumAddressOption']");
  coinbinf.openSeedElectrumAddressSemanticsInput = $("#openSeedElectrumAddressSemanticsInput");

  

  //Mnemonic User related
  coinbinf.receiveAddresses = $('#receiveAddresses');
  coinbinf.changeAddresses = $('#changeAddresses');

  	//buttons for loading more seed addresses
  coinbinf.loadReceiveAddresses = $('.loadReceiveAddresses');
  coinbinf.loadChangeAddresses = $('.loadChangeAddresses');
  

  // top wallet menu when logged in
  coinbinf.walletMenu = $('#walletMenu a');

	//***Initialize/Set default Network
  wally_kit.initNetwork($('input[type=radio][name=radio_selectNetworkType]'));



	/* open wallet code */

	var explorer_tx = "https://coinb.in/tx/"
	var explorer_addr = "https://coinb.in/addr/"
	var explorer_block = "https://coinb.in/block/"



/*
profile_data = { 
			"address" : "",
			"email" : loginEmail,
			"login_type" : "", //"password" (email & password login), "private_key" login, "import_wallet", mnemonic" login, "hdmaster" login
			"wallet_type" : walletType,	//regular (login normal address), multisig //same as total signatures
			"redeem_script" : "",
			"remember_me" : loginRemember,
			"pubkey_sorted": false,	// check this when generating the private keys! - (it must be sorted if user wants to import to BitBay Client Wallet)
			"signatures" : signatures,	//total signatures/private keys needs for signing a transaction!
			
			"public_keys" : [
				//{loginPass[0]["password"]},
				//{loginPass[1]["password"]}
			],
			"passwords" : [
				loginPass
				//{loginPass[0]["password"]},
				//{loginPass[1]["password"]}
			],
			"hex_keys" : [
				{""},
				{""}
			],
			"private_keys" : [
				{""},
				{""}
			],
			"deterministic" : [
				{"xpub" : ""},
				{"xprv" : ""},
				{"seed" : ""}
			],
			"imported_wallet" : [
			{"file1": ""},
			{"file2": ""},
			]
		};
		*/
	



	$("#openBtn").click( async function(){

		console.log('openBtn clicked');

		//no generated coin data -> exit
		if (!login_wizard.profile_data.generated)
			return;

		//Remember me?
      	const loginRemember = $('#loginRemember').is(':checked');

    //save to localStorage if remember is checked, or else remove user data
    if (loginRemember) {
			login_wizard.profile_data.remember = loginRemember;
			storage_s.set('wally.profile', login_wizard.profile_data);
		} else {
			storage_s.remove('wally.profile');
		}



		var tmp = login_wizard.profile_data;
		let modalTitle = 'Wallet Login - Success';
		let modalMessage = 'Welcome to the decentralized non-custodial wallet';

		console.log('tmp: ', tmp);
		if (login_wizard.profile_data === undefined) {
			modalTitle = 'Wallet Login - Failed!'
			modalMessage = 'ERROR (#openBtn): Unable to login, Bad credentials! ';
      		custom.showModal(modalTitle, modalMessage, 'danger');
      		return;
		}

  		custom.showModal(modalTitle, modalMessage, 'success');


		if (login_wizard.profile_data.wallet_type === 'multisig') {
			var totalKeys = login_wizard.profile_data.hex_key.length;
			//generate public keys from the hex key
		}

		var choosenCoin = coinjs.asset.slug;
		//console.log('choosenCoin: ', choosenCoin);
		//console.log('login_wizard.profile_data.generated: ', login_wizard.profile_data.generated[choosenCoin]);

		var adr_legacy = login_wizard.profile_data.generated[choosenCoin][0].address;	//legacy (compressed)
		var wif = login_wizard.profile_data.generated[choosenCoin][0].addresses_supported.compressed.key;	
		var pubkey = login_wizard.profile_data.generated[choosenCoin][0].addresses_supported.compressed.public_key;	
		var hexkey = login_wizard.profile_data.generated[choosenCoin][0].addresses_supported.compressed.hexkey || '';	

		var coinType = wally_fn.coinChainIs();
		if (coinType === 'utxo') {
			//disabled for mnemonic login
			if (login_wizard.profile_data.login_type === 'password') {
				var adr_legacy_uncompressed = login_wizard.profile_data.generated[choosenCoin][0].addresses_supported.uncompressed.address;		//legacy (compressed)
				var wif_uncompressed = login_wizard.profile_data.generated[choosenCoin][0].addresses_supported.uncompressed.key;	
				var pubkey_uncompressed = login_wizard.profile_data.generated[choosenCoin][0].addresses_supported.uncompressed.public_key;	

				var adr_bech32 = login_wizard.profile_data.generated[choosenCoin][0].addresses_supported.compressed.bech32.address;	//bech32
				var adr_bech32_redeem = login_wizard.profile_data.generated[choosenCoin][0].addresses_supported.compressed.bech32.redeemscript;	//segwit

				var adr_segwit = login_wizard.profile_data.generated[choosenCoin][0].addresses_supported.compressed.segwit.address;	//segwit
				var adr_segwit_redeem = login_wizard.profile_data.generated[choosenCoin][0].addresses_supported.compressed.segwit.redeemscript;	//segwit

				console.log('hexkey: ', hexkey);
				if (hexkey == '' || !hexkey)
					hexkey = login_wizard.profile_data.password.keys.hex_key;
			}
		}
		
		var address = adr_legacy;

		var walletToAddress = 'Legacy <small>(Compressed)</small>';

		if (coinType === 'utxo') {
			$("#walletKeys .walletSegWitRS").addClass("hidden");
			if($("#walletSegwit").is(":checked")){
				if($("#walletSegwitBech32").is(":checked")){
					address = adr_bech32;
					var address_redeem = adr_bech32_redeem
					walletToAddress = 'Bech32';
				} else {
					address = adr_segwit;
					var address_redeem = adr_segwit_redeem;
					walletToAddress = 'SegWit';
				}

				$("#walletKeys .walletSegWitRS").removeClass("hidden");
				$("#walletKeys .walletSegWitRS input:text").val(address_redeem);
			} else {
				if ($('#walletLegacyUncompressed').is(':checked')) {
					address = adr_legacy_uncompressed;
					wif = wif_uncompressed;
					pubkey = pubkey_uncompressed;
					walletToAddress = 'Legacy <small>(Uncompressed)</smafll>';
				}
			}
		} else if (coinType === 'evm') {
			walletToAddress = 'EVM';
		}

		$(".walletToAddress").text(walletToAddress);

		console.log('login address: ', address);
		$("#walletAddress").val(address);
		$(".walletAddress").text(address);
		$("#walletHistory").attr('href',explorer_addr+address);

		$("#walletQrCode").html("");
		var qrcode = new QRCode("walletQrCode");
		//qrcode.makeCode("bitcoin:"+address);
		qrcode.makeCode(coinjs.asset.slug+':'+address);

		$("#walletKeys .privkey").val(wif);
		$("#walletKeys .privkeyhex").val(hexkey);
		$("#walletKeys .pubkey").val(pubkey);

		Router.navigate('wallet');
		//$("#login").addClass('hidden');
		//$("#openLogin").hide();
		//$("#wallet").removeClass("hidden");

		//walletBalance();

		//generate a list of user assets
		wally_kit.walletRenderAssets();


		//render wallet menu for auth user
		$('.zeynep.left-panel').attr('data-user', 'auth');

		//re-render guest/auth elements
		$('[data-user-show="auth"]').removeClass('hidden');
    $('[data-user-show="guest"]').addClass('hidden');

    //set body to user is auth!
		$('body').attr('data-user', 'auth');

		//generate key addresses
		//if (login_wizard.profile_data.login_type === 'password')
		//wally_kit.walletlistKeyAddresses();

		//generate mnemonic addresses
		//if (login_wizard.profile_data.login_type === 'mnemonic' || login_wizard.profile_data.login_type === 'seed')
			//await wally_kit.walletListSeedAddresses();


		
		
	});

	/*
	$("#walletLogout").click(function(){
		
	});
	*/

	$("#walletSegwit").click(function(){
		if($(this).is(":checked")){
			$("#walletLegacy")[0].checked = false;
			$(".walletSegwitType").attr('disabled',false);
			$('.walletLegacyType').attr('disabled',true);

		} else {
			$("#walletLegacy")[0].checked = true;
			$(".walletSegwitType").attr('disabled',true);
			$('.walletLegacyType').attr('disabled',false);
		}
	});

	$("#walletLegacy").click(function(){
		if($(this).is(":checked")){
			$("#walletSegwit")[0].checked = false;
			$(".walletSegwitType").attr('disabled',true);
			$('.walletLegacyType').attr('disabled',false);
		} else {
			$("#walletSegwit")[0].checked = true;
			$(".walletSegwitType").attr('disabled',false);
			$('.walletLegacyType').attr('disabled',true);
		}
	});

	$("#walletToSegWit").click(function(){
		$("#walletToAddress").html('SegWit <span class="caret"></span>');
		$(".walletToAddress").text('SegWit');
		$(".walletSegwitType").attr('disabled',false);
		$('.walletLegacyType').attr('disabled',true);

		$("#walletLegacy")[0].checked = false;
		$("#walletSegwit")[0].checked = true;

		$("#walletSegwitp2sh")[0].checked = true;
		//$("#openBtn").click();
	});

	$("#walletToSegWitBech32").click(function(){
		$("#walletToAddress").html('Bech32 <span class="caret"></span>');
		$(".walletToAddress").text('Bech32');
		$(".walletSegwitType").attr('disabled',false);
		$('.walletLegacyType').attr('disabled',true);

		$("#walletLegacy")[0].checked = false;
		$("#walletSegwit")[0].checked = true;

		$("#walletSegwitBech32")[0].checked = true;		
		//$("#openBtn").click();
	});

	$("#walletToLegacy").click(function(){
		$("#walletToAddress").html('Legacy <small>(Compressed)</small> <span class="caret"></span>');
		$(".walletToAddress").html('Legacy <small>(Compressed)</small>');
		$(".walletSegwitType").attr('disabled',true);
		$('.walletLegacyType').attr('disabled',false);

		$("#walletLegacy")[0].checked = true;
		$("#walletSegwit")[0].checked = false;
		
		
		$(".walletLegacyType")[0].checked = true;

		//$("#openBtn").click();
	});

	$("#walletToLegacyUncompressed").click(function(){
		$("#walletToAddress").html('Legacy <small>(Uncompressed)</small> <span class="caret"></span>');
		$(".walletToAddress").html('Legacy <small>(Uncompressed)</small>');
		$(".walletSegwitType").attr('disabled',true);
		$('.walletLegacyType').attr('disabled',false);

		$("#walletLegacy")[0].checked = true;
		$("#walletSegwit")[0].checked = false;
		
		$(".walletLegacyType")[1].checked = true;

		//$("#openBtn").click();
	});


	$("#walletBalance, #walletQrCode").click(function(){
		walletBalance();
	});

	$("#walletConfirmSend").click(function(){
		var thisbtn = $(this);
		var tx = coinjs.transaction();
		var txfee = $("#txFee");
		var devaddr = coinjs.developer;
		var devamount = $("#developerDonation");

		if((devamount.val()*1)>0){
			tx.addoutput(devaddr, devamount.val()*1);
		}

		var total = (devamount.val()*1) + (txfee.val()*1);

		$.each($("#walletSpendTo .output"), function(i,o){
			var addr = $('.addressTo',o);
			var amount = $('.amount',o);
			if(amount.val()*1>0){
				total += amount.val()*1;
				tx.addoutput(addr.val(), amount.val()*1);
			}
		});

		thisbtn.attr('disabled',true);

		var script = false;
		if($("#walletSegwit").is(":checked")){
			if($("#walletSegwitBech32").is(":checked")){
				var sw = coinjs.bech32Address($("#walletKeys .pubkey").val());
			} else {
				var sw = coinjs.segwitAddress($("#walletKeys .pubkey").val());
			}
			script = sw.redeemscript;
		}

		var sequence = 0xffffffff-1;
		if($("#walletRBF").is(":checked")){
			sequence = 0xffffffff-2;
		}

		tx.addUnspent($("#walletAddress").html(), function(data){

			//var dvalue = (data.value/100000000).toFixed(8) * 1;	//iceee remove
			var dvalue = data.value/("1e"+coinjs.decimalPlaces);
			total = (total*1).toFixed(coinjs.decimalPlaces) * 1;

			if(dvalue>=total){
				var change = dvalue-total;
				if((change*1)>0){
					tx.addoutput($("#walletAddress").html(), change);
				}

				// clone the transaction with out using coinjs.clone() function as it gives us trouble
				var tx2 = coinjs.transaction(); 
				var txunspent = tx2.deserialize(tx.serialize());

				// then sign
				var signed = txunspent.sign($("#walletKeys .privkey").val());

				// and finally broadcast!

				tx2.broadcast(function(data){
					if($(data).find("result").text()=="1"){
						$("#walletSendConfirmStatus").removeClass('hidden').addClass('alert-success').html('txid: <a href="https://coinb.in/tx/'+$(data).find("txid").text()+'" target="_blank">'+$(data).find("txid").text()+'</a>');
					} else {
						$("#walletSendConfirmStatus").removeClass('hidden').addClass('alert-danger').html(unescape($(data).find("response").text()).replace(/\+/g,' '));
						$("#walletSendFailTransaction").removeClass('hidden');
						$("#walletSendFailTransaction textarea").val(signed);
						thisbtn.attr('disabled',false);
					}

					// update wallet balance
					walletBalance();

				}, signed);
			} else {
				$("#walletSendConfirmStatus").removeClass("hidden").addClass('alert-danger').html("You have a confirmed balance of "+dvalue+" BTC unable to send "+total+" BTC").fadeOut().fadeIn();
				thisbtn.attr('disabled',false);
			}

			$("#walletLoader").addClass("hidden");

		}, script, script, sequence);
	});

	$("#walletSendBtn").click(function(){

		$("#walletSendFailTransaction").addClass('hidden');
		$("#walletSendStatus").addClass("hidden").html("");

		var thisbtn = $(this);
		var txfee = $("#txFee");
		var devamount = $("#developerDonation");

		if((!isNaN(devamount.val())) && devamount.val()>=0){
			$(devamount).parent().removeClass('has-error');
		} else {
			$(devamount).parent().addClass('has-error')
		}

		if((!isNaN(txfee.val())) && txfee.val()>=0){
			$(txfee).parent().removeClass('has-error');
		} else {
			$(txfee).parent().addClass('has-error');
		}

		var total = (devamount.val()*1) + (txfee.val()*1);

		$.each($("#walletSpendTo .output"), function(i,o){
			var amount = $('.amount',o);
			var address = $('.addressTo',o);

			total += amount.val()*1;

			if((!isNaN($(amount).val())) && $(amount).val()>0){
				$(amount).parent().removeClass('has-error');
			} else {
				$(amount).parent().addClass('has-error');			
			}

			if(coinjs.addressDecode($(address).val())){
				$(address).parent().removeClass('has-error');
			} else {
				$(address).parent().addClass('has-error');
			}
		});

		total = total.toFixed(coinjs.decimalPlaces);

		if($("#walletSpend .has-error").length==0){
			var balance = ($("#walletBalance").html()).replace(/[^0-9\.]+/g,'')*1;
			if(total<=balance){
				$("#walletSendConfirmStatus").addClass("hidden").removeClass('alert-success').removeClass('alert-danger').html("");
				$("#spendAmount").html(total);
				$("#modalWalletConfirm").modal("show");
				$("#walletConfirmSend").attr('disabled',false);
			} else {
				$("#walletSendStatus").removeClass("hidden").html("You are trying to spend "+total+' but have a balance of '+balance);
			}
		} else {
			$("#walletSpend .has-error").fadeOut().fadeIn();
			$("#walletSendStatus").removeClass("hidden").html('<i class="bi bi-exclamation-triangle-fill"></i> One or more input has an error');
		}
	});

/*
	$("#walletSpendTo .addressAdd").click(function(){
		var clone = '<div class="form-horizontal output py-2">'+$(this).parent().parent().parent().html()+'</div>';
		$("#walletSpendTo").append(clone);
		$("#walletSpendTo .bi-plus:last").removeClass('bi-plus').addClass('bi-dash');
		$("#walletSpendTo .bi-dash:last").parent().parent().removeClass('addressAdd').addClass('addressRemove');
		$("#walletSpendTo .addressRemove").unbind("");
		$("#walletSpendTo .addressRemove").click(function(){
			$(this).parent().parent().fadeOut().remove();
		});
	});
	*/

	$("#addressAdd").click(function(){

		var clone = '<div class="form-horizontal output callout py-2 hidden">'+$('#walletSpendTo .form-horizontal.output:first-child').html()+'</div>';
		$("#walletSpendTo").append(clone);

		$('#walletSpendTo .form-horizontal.output:last-child').removeClass('hidden').velocity('slideDown', { duration: 200 });

		$("#walletSpendTo .form-horizontal.output:last-child .bi-plus:last").removeClass('bi-plus').addClass('bi-dash');
		$("#walletSpendTo .form-horizontal.output:last-child .bi-dash:last").parent().parent().removeClass('addressAdd').addClass('addressRemove').removeClass('hidden').attr('title', 'Remove recipient');
		$("#walletSpendTo .addressRemove").unbind("");
		$("#walletSpendTo .addressRemove").click(function(){
			//$(this).parent().parent().fadeOut().remove();
			var parent_row = $(this).parent().parent();
				parent_row.velocity('slideUp', { duration: 200, complete: function() { parent_row.remove() }});


		});
	});

	

	function walletBalance(){
		if($("#walletLoader").hasClass("hidden")){
			var tx = coinjs.transaction();
			$("#walletLoader").removeClass("hidden");
			coinjs.addressBalance($("#walletAddress").html(),function(data){
				if($(data).find("result").text()==1){
					//var v = $(data).find("balance").text()/100000000;	//iceee remove
					var v = $(data).find("balance").text()/("1e"+coinjs.decimalPlaces);
					$("#walletBalance").html(v+" BTC").attr('rel',v).fadeOut().fadeIn();
				} else {
				$("#walletBalance").html("0.00 BTC").attr('rel',v).fadeOut().fadeIn();
				}

				$("#walletLoader").addClass("hidden");
			});
		}
	}

	/* new -> address code */

	$("#newKeysBtn").click(function(){
		coinjs.compressed = false;
		if($("#newCompressed").is(":checked")){
			coinjs.compressed = true;
		}
		var s = ($("#newBrainwallet").is(":checked")) ? $("#brainwallet").val() : null;
		var coin = coinjs.newKeys(s);
		$("#newBitcoinAddress").val(coin.address);
		$("#newPubKey").val(coin.pubkey);
		$("#newPrivKey").val(coin.wif);
		$("#newPrivKeyHex").val(coinjs.wif2privkey(coin.wif)['privkey']);



		/* encrypted key code */
		if((!$("#encryptKey").is(":checked")) || $("#aes256pass").val()==$("#aes256pass_confirm").val()){
			$("#aes256passStatus").addClass("hidden");
			if($("#encryptKey").is(":checked")){
				$("#aes256wifkey").removeClass("hidden");
			}
		} else {
			$("#aes256passStatus").removeClass("hidden");
		}
		$("#newPrivKeyEnc").val(CryptoJS.AES.encrypt(coin.wif, $("#aes256pass").val())+'');
	});
	
	$("#newPaperwalletBtn").click(function(){
		if($("#newBitcoinAddress").val()==""){
			$("#newKeysBtn").click();
		}

		var paperwallet = window.open();
		paperwallet.document.write('<h2>BTC PaperWallet</h2><hr><div style="margin-top: 5px; margin-bottom: 5px"><div><h3 style="margin-top: 0">Address (Share)</h3></div><div style="text-align: center;"><div id="qraddress"></div><p>'+$("#newBitcoinAddress").val()+'</p></div></div><hr><div style="margin-top: 5px; margin-bottom: 5px"><div><h3 style="margin-top: 0">Public Key</h3></div><div style="text-align: center;"><div id="qrpubkey"></div><p>'+$("#newPubKey").val()+'</p></div></div><hr><div style="margin-top: 5px; margin-bottom: 5px"><div><h3 style="margin-top: 0">Private Key (KEEP SECRET!)</h3></div><div style="text-align: center;"><div id="qrprivkey"></div><p>'+$("#newPrivKey").val()+'</p></div></div>');
		paperwallet.document.close();
		paperwallet.focus();
		new QRCode(paperwallet.document.getElementById("qraddress"), {text: $("#newBitcoinAddress").val(), width: 125, height: 125});
		new QRCode(paperwallet.document.getElementById("qrpubkey"), {text: $("#newPubKey").val(), width: 125, height: 125});
		new QRCode(paperwallet.document.getElementById("qrprivkey"), {text: $("#newPrivKey").val(), width: 125, height: 125});
		paperwallet.print();
		paperwallet.close();
	});

	$("#newBrainwallet").click(function(){
		if($(this).is(":checked")){
			$("#brainwallet").parent().removeClass("hidden");
		} else {
			$("#brainwallet").parent().addClass("hidden");
		}
	});



	$("#newSegWitBrainwallet").click(function(){
		if($(this).is(":checked")){
			$("#brainwalletSegWit").parent().removeClass("hidden");
		} else {
			$("#brainwalletSegWit").parent().addClass("hidden");
		}
	});

	$("#encryptKey").click(function(){
		if($(this).is(":checked")){
			$("#aes256passform").removeClass("hidden");
		} else {
			$("#aes256wifkey, #aes256passform, #aes256passStatus").addClass("hidden");
		}
	});

	/* new -> segwit code */
	$("#newSegWitKeysBtn").click(function(){

		try {
			if(Object.keys(coinjs.bech32).length === 0)
				throw('Segwit not supported!');



			var compressed = coinjs.compressed;
			coinjs.compressed = true;

			var s = ($("#newSegWitBrainwallet").is(":checked")) ? $("#brainwalletSegWit").val() : null;
			var coin = coinjs.newKeys(s);

			if($("#newSegWitBech32addr").is(":checked")){
				var sw = coinjs.bech32Address(coin.pubkey);
			} else {
				var sw = coinjs.segwitAddress(coin.pubkey);
			}

			$("#newSegWitAddress").val(sw.address);
			$("#newSegWitRedeemScript").val(sw.redeemscript);
			$("#newSegWitPubKey").val(coin.pubkey);

			$("#newSegWitPrivKey").val(coin.wif);
			$("#newSegWitPrivKeyHex").val(coinjs.wif2privkey(coin.wif)['privkey']);
			coinjs.compressed = compressed;
		} catch (e) {
			console.log('ERROR newSegWitKeysBtn!');
		}
	});

	$("#newSegwitPaperwalletBtn").click(function(){
		if($("#newSegWitAddress").val()==""){
			$("#newSegWitKeysBtn").click();
		}

		var paperwallet = window.open();
		paperwallet.document.write('<h2>BTC SegWit PaperWallet</h2><hr><div style="margin-top: 5px; margin-bottom: 5px"><div><h3 style="margin-top: 0">Address (Share)</h3></div><div style="text-align: center;"><div id="qraddress"></div><p>'+$("#newSegWitAddress").val()+'</p></div></div><hr><div style="margin-top: 5px; margin-bottom: 5px"><div><h3 style="margin-top: 0">Public Key</h3></div><div style="text-align: center;"><div id="qrpubkey"></div><p>'+$("#newSegWitPubKey").val()+'</p></div></div><hr><div style="margin-top: 5px; margin-bottom: 5px"><div><h3 style="margin-top: 0">Redeem Script</h3></div><div style="text-align: center;"><div id="qrredeem"></div><p>'+$("#newSegWitRedeemScript").val()+'</p></div></div><hr><div style="margin-top: 5px; margin-bottom: 5px"><div><h3 style="margin-top: 0">Private Key (KEEP SECRET!)</h3></div><div style="text-align: center;"><div id="qrprivkey"></div><p>'+$("#newSegWitPrivKey").val()+'</p></div></div>');
		paperwallet.document.close();
		paperwallet.focus();
		new QRCode(paperwallet.document.getElementById("qraddress"), {text: $("#newSegWitAddress").val(), width: 110, height: 110});
		new QRCode(paperwallet.document.getElementById("qrpubkey"), {text: $("#newSegWitPubKey").val(), width: 110, height: 110});
		new QRCode(paperwallet.document.getElementById("qrredeem"), {text: $("#newSegWitRedeemScript").val(), width: 110, height: 110});
		new QRCode(paperwallet.document.getElementById("qrprivkey"), {text: $("#newSegWitPrivKey").val(), width: 110, height: 110});
		paperwallet.print();
		paperwallet.close();
	});

	/* new -> multisig code */

	$("#newMultiSigAddress").click(function(){
		var parentRow = $("#multisigPubKeys .pubkey").parent().parent();
		var inputKeys = $("#multisigPubKeys input.pubkey");

		$("#multiSigData").removeClass('show').addClass('hidden').fadeOut();

		inputKeys.removeClass('is-invalid');
		parentRow.removeClass('has-error');
		$("#releaseCoins").parent().removeClass('has-error');
		$("#multiSigErrorMsg").hide();

		if((isNaN($("#releaseCoins option:selected").html())) || ((!isNaN($("#releaseCoins option:selected").html())) && ($("#releaseCoins option:selected").html()>$("#multisigPubKeys .pubkey").length || $("#releaseCoins option:selected").html()*1<=0 || $("#releaseCoins option:selected").html()*1>8))){
			$("#releaseCoins").parent().addClass('has-error');
			$("#multiSigErrorMsg").html(' Minimum signatures required is greater than the amount of public keys provided').fadeIn();
			return false;
		}

		var keys = [];
		$.each($("#multisigPubKeys .pubkey"), function(i,o){
			if(coinjs.pubkeydecompress($(o).val())){
				keys.push($(o).val());
				$(o).parent().parent().removeClass('has-error');
				$(o).removeClass('is-invalid');
			} else {
				$(o).parent().parent().addClass('has-error');
				$(o).addClass('is-invalid');
			}
		});

		if((parentRow.hasClass('has-error')==false) && $("#releaseCoins").parent().hasClass('has-error')==false){
			var sigsNeeded = $("#releaseCoins option:selected").html();
			var multisig =  coinjs.pubkeys2MultisigAddress(keys, sigsNeeded);
			if(multisig.size <= 520){
				$("#multiSigData .address").val(multisig['address']);
				$("#multiSigData .script").val(multisig['redeemScript']);
				//$("#multiSigData .scriptUrl").val(document.location.origin+''+document.location.pathname+'?verify='+multisig['redeemScript']+'#verify');

				$("#multiSigData .scriptUrl").val(wally_fn.host+'?asset='+coinjs.asset.slug+'&verify='+multisig['redeemScript']+'#verify');
				history.pushState({}, null, $("#multiSigData .scriptUrl").val());


				$("#multiSigData").removeClass('hidden').addClass('show').fadeIn();
				$("#releaseCoins").removeClass('has-error');
			} else {
				$("#multiSigErrorMsg").html('<i class="bi bi-exclamation-triangle-fill"></i> Your generated redeemscript is too large (>520 bytes) it can not be used safely').fadeIn();
			}
		} else {
			$("#multiSigErrorMsg").html('<i class="bi bi-exclamation-triangle-fill"></i> One or more public key is invalid!').fadeIn();
		}
	});

	$("#multisigPubKeys .pubkeyAdd").click(function(){
		if($("#multisigPubKeys .pubkeyRemove").length<=16){
			var pubKeysNumber = $('#multisigPubKeys .pubkey').length;
			var nextPubKeysNumber = (pubKeysNumber+1);

			var clone = '<div class="row hidden" data-pubkey-number="'+nextPubKeysNumber+'">'+$(this).parent().parent().html()+'</div>';
			$("#multisigPubKeys").append(clone);

			$('#multisigPubKeys .row[data-pubkey-number="'+nextPubKeysNumber+'"] .pubkeyNumber').text(nextPubKeysNumber);
			$('#multisigPubKeys .row[data-pubkey-number="'+nextPubKeysNumber+'"]').removeClass('hidden').velocity('slideDown', { duration: 200 });


			$("#multisigPubKeys .bi-plus:last").removeClass('bi-plus').addClass('bi-dash');
			$("#multisigPubKeys .bi-dash:last").parent().removeClass('pubkeyAdd').addClass('pubkeyRemove');

			$("#multisigPubKeys input.pubkey").change();
		}
	});



	$("body").on("click", "#multisigPubKeys .pubkeyRemove", async function(e){

	//$("#multisigPubKeys .pubkeyRemove").click(function(){

				var aa = $(this).parent().parent();

				aa.velocity(
				  "slideUp",	//transition.slideUpIn
				  { 
				    duration: 200,
				    complete: function() {
				      console.log("animation complete")

				      aa.remove();

				    	var allPubKeysElements = $("#multisigPubKeys .row");
				    	var i=1;
						allPubKeysElements.each(function(){
						  //$(this).blah//refers to jquery object.
						  //$(this).text(i++);

						  /*
						  console.log('======');
						  console.log('data attr: ' + $(this).attr('data-pubkey-number'));
						  console.log('$this: ', $(this));
						  console.log('this', this);
						  */

						  //if ($(this).attr('data-pubkey-number') != '') {
						  if ($(this)) {
						  	
						  	$(this).attr('data-pubkey-number', i);
						  	$(this).find('.pubkeyNumber').text(i).fadeIn();
						  	//console.log('NOT hidden row!')
						  	//console.log('child: ', $(this).find('.pubkeyNumber'));
						  	//console.log('new number: '+ $(this).find('.pubkeyNumber').text())
						  	i++;

						  } else {
						  	/*console.log('hidden row!')
						  	$(this).find('.pubkeyNumber').text(i);
						  	console.log('child: ', $(this).find('.pubkeyNumber'));
						  	console.log('new number: '+ $(this).find('.pubkeyNumber').text())
						  	*/
						  }

						  

						});


				    }
				  });

				/*
				// Using Velocity's utility function... *
				$.Velocity.animate(aa, { opacity: 1, duration: 100  })
				    // Callback to fire once the animation is complete.
				    .then(function(elements) { console.log("Resolved."); 

				    	aa.remove();

				    	var allPubKeysElements = $("#multisigPubKeys .row");
				    	var i=1;
						allPubKeysElements.each(function(){
						  if ($(this)) {						  	
						  	$(this).attr('data-pubkey-number', i);
						  	$(this).find('.pubkeyNumber').text(i).fadeIn();
						  	i++;
						  }
						});
				    })
				    // Callback to fire if an error occurs. 
				    .catch(function(error) { console.log("Rejected."); });
				    */

				$("#multisigPubKeys input.pubkey").change();
			});

	$("#mediatorList").change(function(){
		var data = ($(this).val()).split(";");
		$("#mediatorPubkey").val(data[0]);
		$("#mediatorEmail").val(data[1]);
		$("#mediatorFee").val(data[2]);
	}).change();

	$("#mediatorAddKey").click(function(){
		var count = 0;
		var len = $(".pubkeyRemove").length;
		if(len<=16){
			$.each($("#multisigPubKeys .pubkey"),function(i,o){
				if($(o).val()==''){
					$(o).val($("#mediatorPubkey").val()).fadeOut().fadeIn();
					$("#mediatorClose").click();
					return false;
				} else if(count==len){
					$("#multisigPubKeys .pubkeyAdd").click();
					$("#mediatorAddKey").click();
					return false;
				}
				count++;
			});

			$("#mediatorClose").click();
		}
	});

	/* new -> time locked code */
	$("#timeLockedDateTimePicker.flatpickr").flatpickr({
		defaultHour: 0,
		defaultMinute: 0,
		allowInvalidPreload: true,
		/*allowInput: true,*/
		minDate: "today",
		enableTime: true,
    	time_24hr: true,
    	dateFormat: "m/d/Y H:i",
    	allowInvalidPreload: true,
    	wrap: true,
    	disableMobile :true,

    	//appendTo: $('#timeLockedDateTimePicker .flatpickr'),
	});
	
	
	$('#timeLockedRbTypeBox input').change(function(){
		if ($('#timeLockedRbTypeDate').is(':checked')){
			$('#timeLockedDateTimePicker').show();
			$('#timeLockedBlockHeight').hide();
		} else {
			$('#timeLockedDateTimePicker').hide();
			$('#timeLockedBlockHeight').removeClass('hidden').show();
		}
	});

    $("#newTimeLockedAddress").click(function(){

        $("#timeLockedData").removeClass('show').addClass('hidden').fadeOut();
        $("#timeLockedPubKey").parent().removeClass('has-error');
        $("#timeLockedDateTimePicker").parent().removeClass('has-error');
        $("#timeLockedErrorMsg").hide();

        if(!coinjs.pubkeydecompress($("#timeLockedPubKey").val())) {
        	$('#timeLockedPubKey').parent().addClass('has-error');
        }

        var nLockTime = -1;

        if ($('#timeLockedRbTypeDate').is(':checked')){
        	// by date
	        var date = parseInt(Math.floor(new Date($('#timeLockedDateTimePicker input.flatpickr-input').val()).getTime() / 1000));	//make it unix timestamp
	        var date = new Date($('#timeLockedDateTimePicker input.flatpickr-input').val());
	        /*
	        if(!date || !date.isValid()) {
	        	$('#timeLockedDateTimePicker').parent().addClass('has-error');
	        }
	        */

	        //https://stackoverflow.com/a/1353711
	        if (Object.prototype.toString.call(date) === "[object Date]") {
			  if (isNaN(date)) { // d.getTime() or d.valueOf() will also work
			    // date object is not valid
			    $('#timeLockedDateTimePicker').parent().addClass('has-error');
			    $('#timeLockedDateTimePicker input.flatpickr-input').addClass('is-invalid').removeClass('is-valid');
			  } else {
			    // date object is valid
			    $('#timeLockedDateTimePicker').parent().removeClass('has-error');
			  	$('#timeLockedDateTimePicker input.flatpickr-input').removeClass('is-invalid').addClass('is-valid');
			  }
			} else {
			  // not a date object
			  $('#timeLockedDateTimePicker').parent().addClass('has-error');
			  $('#timeLockedDateTimePicker input.flatpickr-input').addClass('is-invalid').removeClass('is-valid');
			}


			  
	        nLockTime = parseInt(Math.floor(date.getTime()) / 1000);
	        if (nLockTime < 500000000) {
	        	$('#timeLockedDateTimePicker').parent().addClass('has-error');
	        	$('#timeLockedDateTimePicker input.flatpickr-input').addClass('is-invalid').removeClass('is-valid');
	        }
        } else {
			nLockTime = parseInt($('#timeLockedBlockHeightVal').val(), 10);
	        if (nLockTime >= 500000000) {
	        	$('#timeLockedDateTimePicker').parent().addClass('has-error');
	        	$('#timeLockedDateTimePicker input.flatpickr-input').addClass('is-invalid').removeClass('is-valid');
	        }
        }

        if(($("#timeLockedPubKey").parent().hasClass('has-error')==false) && $("#timeLockedDateTimePicker").parent().hasClass('has-error')==false){
        	try {
	            var hodl = coinjs.simpleHodlAddress($("#timeLockedPubKey").val(), nLockTime);
	            $("#timeLockedData .address").val(hodl['address']);
	            $("#timeLockedData .script").val(hodl['redeemScript']);
	            //$("#timeLockedData .scriptUrl").val(document.location.origin+''+document.location.pathname+'?verify='+hodl['redeemScript']+'#verify');

	            $("#timeLockedData .scriptUrl").val(wally_fn.host+'?asset='+coinjs.asset.slug+'&verify='+hodl['redeemScript']+'#verify');
				history.pushState({}, null, $("#timeLockedData .scriptUrl").val());

	            $("#timeLockedData").removeClass('hidden').addClass('show').fadeIn();
	        } catch(e) {
	        	$("#timeLockedErrorMsg").html('<i class="bi bi-exclamation-triangle-fill"></i> ' + e).fadeIn();
	        }
        } else {
            $("#timeLockedErrorMsg").html('<i class="bi bi-exclamation-triangle-fill"></i> Public key and/or date is invalid!').fadeIn();
        }
    });

	/* new -> Hd address code */

	$(".deriveHDbtn").click(function(){
		coinbinf.verifyScript.val($("input[type='text']",$(this).parent().parent()).val());
		window.location = "#verify";
		$("#verifyBtn").click();
	});

	$("#newHDKeysBtn").click(function(){
		coinjs.compressed = true;
		var s = ($("#newHDBrainwallet").is(":checked")) ? $("#HDBrainwallet").val() : null;
		var hd = coinjs.hd();
		var pair = hd.master(s);
		$("#newHDxpub").val(pair.pubkey);
		$("#newHDxprv").val(pair.privkey);

		$('#newHDaddress .deriveHDbtn').attr('disabled',false);

	});

	$("#newHDBrainwallet").click(function(){
		if($(this).is(":checked")){
			$("#HDBrainwallet").parent().removeClass("hidden");
		} else {
			$("#HDBrainwallet").parent().addClass("hidden");
		}
	});


	/* new -> Mnemonic address code */
	$(".deriveSeedbtn").click(function(){
		coinbinf.verifyScript.val($("input[type='text']",$(this).parent().parent()).val());
		window.location = "#verify";
		$("#verifyBtn").click();
	});

	coinbinf.deriveFromBipProtocol.on('change', function(e) {
		var protocol = this.value;
		console.log('coinbinf.deriveFromBipProtocol');
		$('#newMnemonicAddress .bipProtocolStr').text(protocol);
	});



	//coinbinf.deriveFromBipProtocol.on('')
	/*Popover event listener for BIP protocol*/
	$("body").on("change", '#popBIPSettingsJBox input[name="radio_bip_protocol"]', function(e){
		var poppis = $('.popover.show');
		var bipProtocolRadio = poppis.find('input[name="radio_bip_protocol"]');
		
		//clear master keys
		coinbinf.newMnemonicPubInput.val("");
		coinbinf.newMnemonicPrvInput.val("");

		//get bip protocol value
		bipProtocolVal = $(this).val();
		 console.log( 'is checked: ' + $(this).is(":checked"));
		 console.log( 'bipProtocol val: ' + bipProtocolVal);
		
		//var choosenBipProtocol = bipProtocolRadio.val();

		
		//list of supported bip-types, bip44 is added here for registered coin types/slip support 
		//https://github.com/satoshilabs/slips/blob/master/slip-0044.md
		var bipTypes = ['bip32', 'bip44', 'bip49', 'bip84'];
		
		//check bip type, hdkey/bip32, bip44, bip49, bip84
		if (bipTypes.includes(bipProtocolVal)) {
			console.log('bip supported: '+ bipProtocolVal);
		} else {
			console.log('bip NOT supported: ' + bipProtocolVal);
			bipProtocolVal = 'bip32';	//Default BIP (=bip32) if no BIP type is choosen
		}

		coinbinf.deriveFromBipProtocol.val(bipProtocolVal).trigger('change');

		$(this).val(bipProtocolVal);

		
	});

	
	//Check if we have custom BIP Derivation protocols like Electrum
	$("body").on("change", '#popBIPSettingsJBox .bipMnemonicClientProtocol', function(e){
		
		//clear master keys
		coinbinf.newMnemonicPubInput.val("");
		coinbinf.newMnemonicPrvInput.val("");

		//should we use electrum for derivating bip master keys?
		var useClientProtocol = $(this).is(":checked");

		//get popup element inputs
		var poppis = $('#popBIPSettingsJBox');
		var mnemonicLengthEl = poppis.find('.bipMnemonicLength');
		var mnemonicProtocols = poppis.find('.bipMnemonicProtocols');

		//Element - Protocol string
		var bipProtocolStr = $('#newMnemonicAddress .bipProtocolStr');


		//for electrum maximum 12 words is used
		if (useClientProtocol) {
			//mnemonicProtocols.find('label').not('[data-bip-option="bip84"]').addClass('disabled').removeClass('active');
			mnemonicProtocols.find('label').addClass('disabled');//.removeClass('active');
			mnemonicLengthEl.val(12).prop('disabled', true);
			//mnemonicProtocols.find('label[data-bip-option="bip84"]').addClass('active').find('input').prop('checked', true);
			
			//coinbinf.deriveFromBipProtocol.val('bip84').trigger('change');
			
			//coinbinf.bip32Client.find('option:contains("Electrum")').prop('selected', true);
			//coinbinf.bip32Client.prop('disabled', true);
			//coinbinf.bippath.val("m/0'/0");
			coinbinf.bip32Client.val('custom');//.prop('disabled', false);
			coinbinf.bippath.val("m/0");//.prop('disabled', true);
			//coinbinf.bip32path.val("m/0'/0").prop('readonly', true);
			
			//coinbinf.bip32path.val("m/0").prop('disabled', true);

			//render UI path
			bipProtocolStr.text( 'Electrum Path' );
		}
		else {
			//mnemonicProtocols.find('label').not('[data-bip-option="bip84"]').removeClass('disabled');
			mnemonicProtocols.find('label').removeClass('disabled');//.removeClass('active');
			mnemonicProtocols.find('label.active').text();

			mnemonicLengthEl.prop('disabled', false)
			coinbinf.bip32Client.val('custom');//.prop('disabled', false);
			//coinbinf.bip32path.val("m/0'/0").prop('disabled', false);
			coinbinf.bippath.val("m/0");//.prop('disabled', false);

			//render UI path
			bipProtocolStr.text(mnemonicProtocols.find('label.active').text() );
		}
	});

	/*Popover for Mnemonic Login Options*/
	$(".newMnemonicLoginGenerate").on("click", async function(e){
		e.preventDefault();
		$(this).attr('disabled', true);
		console.log('===newMnemonicLoginSeed===');

		//get elements in opened/active popover
		var poppis = $('#popSeedLoginSettingsJBox');
		var mnemonicLengthEl = poppis.find('#seedLoginMnemonicLength');
		var mnemonicLength = 	mnemonicLengthEl.val();

		console.log('mnemonic length1: '+ mnemonicLength);
		//set default to 24, if out of range. 12 <= mnemonicLength <= 24
		if (isNaN(mnemonicLength) ||  mnemonicLength > 24 )
			mnemonicLength = 24;
		
		if (isNaN(mnemonicLength) || mnemonicLength < 12  )
			mnemonicLength = 12;
		mnemonicLengthEl.val(mnemonicLength);

		var s;
		
		//generate either Electrum seed (new, old) else BIP39 seed!
		var clientWalletIndex = parseInt(coinbinf.openClientWallet.val());

		if (coinbinf.openClientWallet.val() == 4) {
			
			var spinner = $(this).find('.spinner-border');
    	spinner.removeClass('hidden');

			var electrumAddressSemantics = coinbinf.openSeedElectrumAddressSemanticsInput.val();
			if (electrumAddressSemantics == 'p2wpkh') {
				//s = await wally_fn.createElectrumSeed('p2wpkh');
				s = await wally_fn.createElectrumSeedFromEntropy('p2wpkh');

				//console.log('create Electrum NEW seed');
			}
			else if (electrumAddressSemantics == 'p2pkh') {
				//s = await wally_fn.createElectrumSeed('p2pkh');
				s = await wally_fn.createElectrumSeedFromEntropy('p2pkh');
				//console.log('create Electrum OLD seed');
			}
			
			spinner.addClass('hidden');
		} else {
			s = bip39.generateMnemonic((mnemonicLength/3)*32);
			//console.log('create BIP39 seed');
		}

		coinbinf.openSeed.val(s);
		$(this).attr('disabled', false);

	});



	/*Popover for BIP options*/
	$("body").on("click", ".newMnemonicGenerate", function(e){
		console.log('===newMnemonicGenerate===');
		coinbinf.newMnemonicPubInput.val("");
		coinbinf.newMnemonicPrvInput.val("");

		//get elements in opened/active popover
		var poppis = $('#popBIPSettingsJBox');
		var mnemonicLengthEl = poppis.find('.bipMnemonicLength');
		var mnemonicLength = 	mnemonicLengthEl.val();

		console.log('mnemonic length1: '+ mnemonicLength);
		//set default to 24, if out of range. 12 <= mnemonicLength <= 24
		if (isNaN(mnemonicLength) ||  mnemonicLength > 24 )
			mnemonicLength = 24;
		
		if (isNaN(mnemonicLength) || mnemonicLength < 12  )
			mnemonicLength = 12;
		mnemonicLengthEl.val(mnemonicLength);

		var s = bip39.generateMnemonic((mnemonicLength/3)*32);	//24 mnemonic words!
		$("#newMnemonicWords").val(s);
		$("#newMnemonicWords").removeClass("border-danger");
		$("#newMnemonicWords").parent().removeClass("border-danger").removeAttr('title').attr('title', '').attr("data-original-title", '');
	});



	$("#newMnemonicKeysBtn").click(function(){

		//console.log('checked? ', $("#newMnemonicBrainwalletCheck").is(":checked"));
		coinjs.compressed = true;
		var success = false;
		var s  = $("#newMnemonicWords").val().trim();	//seed
		var p  = ($("#newMnemonicBrainwalletCheck").is(":checked")) ? $("#MnemonicBrainwallet").val() : null;	//user bip passphrase

		var bipProtocolVal  = coinbinf.deriveFromBipProtocol.val();	//get bip protocol

		console.log('bipProtocolVal: '+ bipProtocolVal);

				//convert default bip protocol to "hdkey" if another option is not set (for internal functionality)
		if (bipProtocolVal !== 'bip49' && bipProtocolVal !== 'bip84')
			bipProtocolVal = 'hdkey';

		isElectrumProtocol = coinbinf.bipMnemonicClientProtocol.is(':checked');

		if (isElectrumProtocol){
			bip39.setProtocol('electrum');
			if (p !== null)
				p = p.toLowerCase(); //electrum uses lower-case for passphrases
			//bip39 = new BIP39('en', 'electrum');

			var electrumSeedVersion = wally_fn.seedVersion(s, 'electrum');
			if (electrumSeedVersion === 'p2pkh') {
				//var derived_electrum = hd.derive_electrum_path("m/0", 'hdkey', 'hdkey', '');
				bipProtocolVal = 'hdkey';
				coinbinf.bipAddressSemantics = ''
			} else if (electrumSeedVersion === 'p2wpkh') {
				//var derived_electrum = hd.derive_electrum_path("m/0'/0/0", 'bip84', 'hdkey', 'p2wpkh');
				bipProtocolVal = 'bip84';
				coinbinf.bipAddressSemantics = 'p2wpkh'
			}
		}else {
			bip39.setProtocol('mnemonic');
			//bip39 = new BIP39('en', 'bip39');
		}

		console.log('isElectrumProtocol: ', isElectrumProtocol);
		//validate bip39 mnemonic
		if(bip39.validate(s))
			success = true;
		else
			success = false;

    //return if seed words doesnt equal 12 words!
    if (isElectrumProtocol && wally_fn.wordCount(s) !== 12)
			success = false;

    if (!success) {
	  	coinbinf.newMnemonicPubInput.val("");
			coinbinf.newMnemonicPrvInput.val("");
      $("#newMnemonicWords").addClass("border-danger");
      $("#newMnemonicWords").parent().addClass("border-danger").attr('title', 'Incorrect BIP39 Seed').tooltip();

      $('#newMnemonicAddress .deriveSeedbtn').prop('disabled',true);
      return ;

    }
    //all good proceed!
    //if ($("#newMnemonicWords").hasClass("border-danger")) {
	   $("#newMnemonicWords").removeClass("border-danger");
		 $("#newMnemonicWords").parent().removeClass("border-danger").removeAttr('title');

		 $("#newMnemonicWords .tooltip").remove();
		 $('#newMnemonicAddress .deriveSeedbtn').prop('disabled',false);
		//}
    	//$("#walletSpendTo .addressRemove").find(".tooltip").remove().unbind("");
		


		
		var hd = coinjs.hd();



		var pair = hd.masterMnemonic(s, p, bipProtocolVal);
		/*console.log('hd.masterMnemonic pair: ', pair);
		console.log('hd.masterMnemonic pair.privkey: ', pair.privkey);
		console.log('hd.masterMnemonic pair.pubkey: ', pair.pubkey);
		*/
		
		//render xPub, xPrv elements
		bipProtocolPrvEl = $('.bipProtocolPrv').text( (pair.privkey).charAt(0) );
		bipProtocolPubEl = $('.bipProtocolPub').text( (pair.pubkey).charAt(0) );
		
		//Electrum Master Key generation
		if (isElectrumProtocol) {
			
			
			console.log('electrumSeedVersion: ', electrumSeedVersion);


			//console.log('hd: ', hd);
			var derived_electrum;
			if (electrumSeedVersion === 'p2wpkh') {

				s = pair.privkey;
				console.log('s: ', s);
				var hex = Crypto.util.bytesToHex(coinjs.base58decode(s).slice(0, 4));
				console.log('hex: ', hex);
				var hd = coinjs.hd(s);

				derived_electrum = hd.derive_electrum_path("m/0'/0/0", 'bip84', 'hdkey', 'p2wpkh');
				//console.log('derived_electrum: ', derived_electrum);
				pair.pubkey = derived_electrum.keys_extended.pubkey;
				pair.privkey = derived_electrum.keys_extended.privkey;

			} else {
				//return;	//we do not accept electrum 2fa join accounts sorry!
			}
			
		}

		coinbinf.newMnemonicPubInput.val(pair.pubkey).fadeIn();
		coinbinf.newMnemonicPrvInput.val(pair.privkey).fadeIn();

	});

	$("#newMnemonicBrainwalletCheck").click(function(){
		if($(this).is(":checked")){
			$("#MnemonicBrainwallet").parent().removeClass("hidden");
		} else {
			$("#MnemonicBrainwallet").parent().addClass("hidden");
		}
	});

	/* new -> transaction code */

	$("#recipients .addressAddTo").click(function(){
		if($("#recipients .addressRemoveTo").length<19){
			var clone = '<div class="row no-gutter hidden py-2 recipient">'+$(this).parent().parent().html()+'</div>';
			$("#recipients").append(clone);

			$('#recipients .row:last-child').removeClass('hidden').velocity('slideDown', { duration: 200 });


			$("#recipients .bi-plus:last").removeClass('bi-plus').addClass('bi-dash');
			$("#recipients .bi-dash:last").parent().removeClass('addressAddTo').addClass('addressRemoveTo');
			/*
			$("#recipients .addressRemoveTo").unbind("");
			$("#recipients .addressRemoveTo").click(function(){
				$(this).parent().parent().fadeOut().remove();
				validateOutputAmount();
			});
			*/

			//validateOutputAmount();
		}
	});

	$("body").on("click", "#recipients .addressRemoveTo", function(e){
	//$("#recipients .addressRemoveTo").click(function(){
		var thisRowParent = $(this).parent().parent();
		
		thisRowParent.velocity(
				  "slideUp",	//transition.slideUpIn
				  { 
				    duration: 200,
				    complete: function() {
				      console.log("animation complete")
				      thisRowParent.remove();

				    }
				  });

		validateOutputAmount();

	});

				



	$("#inputs .txidAdd").click(function(){
		var clone = '<div class="row no-gutter py-2 inputs">'+$(this).parent().parent().html()+'</div>';
		$("#inputs").append(clone);
		//$("#inputs .txidClear:last").remove();
		$("#inputs .bi-plus:last").removeClass('bi-plus').addClass('bi-dash');
		$("#inputs .bi-dash:last").parent().removeClass('txidAdd').addClass('txidRemove');
		$("#inputs .txidRemove").unbind("");
		$("#inputs .txidRemove").click(function(){
			$(this).parent().parent().fadeOut().remove();
			totalInputAmount();
		});
		$("#inputs .row:last input").attr('disabled',false);

		$("#inputs .txIdAmount").unbind("").change(function(){
			totalInputAmount();
		}).keyup(function(){
			totalInputAmount();
		});

	});

	$("#transactionBtn").click(function(){
		var tx = coinjs.transaction();
		var estimatedTxSize = 10; // <4:version><1:txInCount><1:txOutCount><4:nLockTime>

		$("#transactionCreate, #transactionCreateStatus, #transactionCreateOptions").addClass("hidden");

		if(($("#nLockTime").val()).match(/^[0-9]+$/g)){
			tx.lock_time = $("#nLockTime").val()*1;
		}

		$("#inputs .row").removeClass('has-error');
		$("#inputs .row input").removeClass('is-invalid');

		//$('#putTabs a[href="#txinputs"], #putTabs a[href="#txoutputs"]').attr('style','');

		$.each($("#inputs .row"), function(i,o){
			if(!($(".txId",o).val()).match(/^[a-f0-9]+$/i)){
				$(o).addClass("has-error");
				$(o).find('.txId').addClass('is-invalid');
			} else if((!($(".txIdScript",o).val()).match(/^[a-f0-9]+$/i))){
				$(o).addClass("has-error");
				$(o).find('.txIdScript').addClass('is-invalid');
			} else if (!($(".txIdN",o).val()).match(/^[0-9]+$/i)){
				$(o).addClass("has-error");
				$(o).find('.txIdN').addClass('is-invalid');
			} else if (!($(".txIdAmount",o).val()).match(/^[0-9.]+$/i)){
				$(o).addClass("has-error");
				$(o).find('.txIdAmount').addClass('is-invalid');
			}

			if(!$(o).hasClass("has-error")){
				var seq = 0xffffffff-1;
				if($("#txRBF").is(":checked")){
					seq = 0xffffffff-2;
				}

				var currentScript = $(".txIdScript",o).val();
				if (currentScript.match(/^76a914[0-9a-f]{40}88ac$/)) {
					estimatedTxSize += 147
				} else if (currentScript.match(/^5[1-9a-f](?:210[23][0-9a-f]{64}){1,15}5[1-9a-f]ae$/)) {
					// <74:persig <1:push><72:sig><1:sighash> ><34:perpubkey <1:push><33:pubkey> > <32:prevhash><4:index><4:nSequence><1:m><1:n><1:OP>
					var scriptSigSize = (parseInt(currentScript.slice(1,2),16) * 74) + (parseInt(currentScript.slice(-3,-2),16) * 34) + 43
					// varint 2 bytes if scriptSig is > 252
					estimatedTxSize += scriptSigSize + (scriptSigSize > 252 ? 2 : 1)
				} else {
					// underestimating won't hurt. Just showing a warning window anyways.
					estimatedTxSize += 147
				}

				tx.addinput($(".txId",o).val(), $(".txIdN",o).val(), $(".txIdScript",o).val(), seq);
				$('#putTabs a[href="#txinputs"]').removeClass('text-danger');
				//console.log('txInputs no error rows');
			} else {
				$('#putTabs a[href="#txinputs"]').addClass('text-danger');
				//console.log('txInputs have error rows');
			}
		});

		$("#recipients .row").removeClass('has-error');
		$("#recipients .row input").removeClass('is-invalid');


		$.each($("#recipients .row"), function(i,o){
			

			var a = ($(".address",o).val());
			var am = ($(".amount",o).val());
			var amIsValid = am.match(/^[0-9.]+$/i);
			var ad = coinjs.addressDecode(a);
			//if(((a!="") && (ad.version == coinjs.pub || ad.version == coinjs.multisig || ad.type=="bech32")) && $(".amount",o).val()!=""){ // address
			if(((a!="") && (ad.version == coinjs.pub || ad.version == coinjs.multisig || ad.type=="bech32")) && amIsValid ){ // address
				// P2SH output is 32, P2PKH is 34
				estimatedTxSize += (ad.version == coinjs.pub ? 34 : 32)
				tx.addoutput(a, am);
			} else if (((a!="") && ad.version === 42) && amIsValid){ // stealth address
				// 1 P2PKH and 1 OP_RETURN with 36 bytes, OP byte, and 8 byte value
				estimatedTxSize += 78
				tx.addstealth(ad, am);
			} else if (((($("#opReturn").is(":checked")) && a.match(/^[a-f0-9]+$/ig)) && a.length<160) && (a.length%2)==0) { // data
				estimatedTxSize += (a.length / 2) + 1 + 8
				tx.adddata(a);
			} else { // neither address nor data
				
			}

			if(!a.match(/^[a-z0-9]+$/i)) {
				$(o).addClass("has-error");
				$(o).find('.address').addClass('is-invalid');
			}
			if (!amIsValid){
				$(o).addClass("has-error");
				$(o).find('.amount').addClass('is-invalid');
			}

			if(!$(o).hasClass("has-error")){
				$('#putTabs a[href="#txoutputs"]').removeClass('text-danger');
				console.log('txOutputs no error rows');
			}else {
				$('#putTabs a[href="#txoutputs"]').addClass('text-danger');
				console.log('txOutputs we have error rows');
			}
			
		});


		if(!$("#recipients .row, #inputs .row").hasClass('has-error')){
			
			$("#transactionCreate textarea").val(tx.serialize());
			$("#transactionCreate .txSize").html(tx.size());

			if($("#feesestnewtx").attr('est')=='y'){
				$("#fees .txhex").val($("#transactionCreate textarea").val());
				$("#feesAnalyseBtn").click();
				$("#fees .txhex").val("");
				window.location = "#fees";
			} else {

				$("#transactionCreate, #transactionCreateOptions").removeClass("hidden");

				// Check fee against hard 0.01 as well as fluid 200 satoshis per byte calculation.
				if($("#transactionFee").val()>=0.01 || $("#transactionFee").val()>= estimatedTxSize * 200 * 1e-8){
					$("#modalWarningFeeAmount").html($("#transactionFee").val());
					$("#modalWarningFee").modal("show");
				}
			}
			$("#feesestnewtx").attr('est','');
		} else {
			$("#transactionCreateStatus").removeClass("hidden").html("One or more input or output is invalid").fadeOut().fadeIn();
		}
	});

	$("#transactionCreateOptions .transactionToSign").on( "click", function() {
		$("#signTransaction").val( $('#transactionCreate textarea').val() ).fadeOut().fadeIn();
		window.location.hash = "#sign";
	});

	$("#transactionCreateOptions .transactionToVerify, #signCreateOptions .verifySignedData").on( "click", function() {
		if ($(this).hasClass('verifySignedData')){
			console.log('verifySignedData');
			coinbinf.verifyScript.val( $('#signedData textarea').val() ).fadeOut().fadeIn();
		}
		else
			coinbinf.verifyScript.val( $('#transactionCreate textarea').val() ).fadeOut().fadeIn();
		
		window.location.hash = "#verify";
		$("#verifyBtn").click();
	});


	$("#feesestnewtx").click(function(){
		$(this).attr('est','y');
		$("#transactionBtn").click();
	});

	$("#feesestwallet").click(function(){
		$(this).attr('est','y');
		var outputs = $("#walletSpendTo .output").length;

		$("#fees .inputno, #fees .outputno, #fees .bytes").html(0);
		$("#fees .slider").val(0);

		var tx = coinjs.transaction();
		tx.listUnspent($("#walletAddress").html(), function(data){
			var inputs = $(data).find("unspent").children().length;
			if($("#walletSegwit").is(":checked")){	
				$("#fees .txi_segwit").val(inputs);
				$("#fees .txi_segwit").trigger('input');
			} else {
				$("#fees .txi_regular").val(inputs);
				$("#fees .txi_regular").trigger('input');
			}

			$.each($("#walletSpendTo .output"), function(i,o){
				var addr = $('.addressTo',o);
				var ad = coinjs.addressDecode(addr.val());
				if (ad.version == coinjs.pub){ // p2pkh
					$("#fees .txo_p2pkh").val(($("#fees .txo_p2pkh").val()*1)+1);
					$("#fees .txo_p2pkh").trigger('input');					
				} else { // p2psh
					$("#fees .txo_p2sh").val(($("#fees .txo_p2sh").val()*1)+1);
					$("#fees .txo_p2sh").trigger('input');
				}
			});

			if(($("#developerDonation").val()*1)>0){
				var addr = coinjs.developer;
				var ad = coinjs.addressDecode(addr);
				if (ad.version == coinjs.pub){ // p2pkh
					$("#fees .txo_p2pkh").val(($("#fees .txo_p2pkh").val()*1)+1);
					$("#fees .txo_p2pkh").trigger('input');	
				} else { // p2psh
					$("#fees .txo_p2sh").val(($("#fees .txo_p2sh").val()*1)+1);
					$("#fees .txo_p2sh").trigger('input');
				}
			}

		});

		//feeStats();
		window.location = "#fees";
	});

	$(".txidClear").click(function(){
		$("#inputs .row:first input").attr('disabled',false);
		$("#inputs .row:first input").val("");
		totalInputAmount();
	});

	$("#inputs .txIdAmount").unbind("").change(function(){
		totalInputAmount();
	}).keyup(function(){
		totalInputAmount();
	});

	$("#donateTxBtn").click(function(){

		var exists = false;

		$.each($("#recipients .address"), function(i,o){
			if($(o).val() == coinjs.developer){
				exists = true;
				$(o).fadeOut().fadeIn();
				return true;
			}
		});

		if(!exists){
			if($("#recipients .recipient:last .address:last").val() != ""){
				$("#recipients .addressAddTo:first").click();
			};

			$("#recipients .recipient:last .address:last").val(coinjs.developer).fadeOut().fadeIn();

			return true;
		}
	});

	/* code for the qr code scanner */

	$(".qrcodeScanner").click(function(){
		if ((typeof MediaStreamTrack === 'function') && typeof MediaStreamTrack.getSources === 'function'){
			MediaStreamTrack.getSources(function(sourceInfos){
				var f = 0;
				$("select#videoSource").html("");
				for (var i = 0; i !== sourceInfos.length; ++i) {
					var sourceInfo = sourceInfos[i];
					var option = document.createElement('option');
					option.value = sourceInfo.id;
					if (sourceInfo.kind === 'video') {
						option.text = sourceInfo.label || 'camera ' + ($("select#videoSource options").length + 1);
						$(option).appendTo("select#videoSource");
 					}
				}
			});

			$("#videoSource").unbind("change").change(function(){
				scannerStart()
			});

		} else {
			$("#videoSource").addClass("hidden");
		}
		scannerStart();
		$("#qrcode-scanner-callback-to").html($(this).attr('forward-result'));
	});

	function scannerStart(){
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || false;
		if(navigator.getUserMedia){
			if (!!window.stream) {
				$("video").attr('src',null);
  			}

			var videoSource = $("select#videoSource").val();
			var constraints = {
				video: {
					optional: [{sourceId: videoSource}]
				}
			};

			navigator.getUserMedia(constraints, function(stream){
				window.stream = stream; // make stream available to console
				var videoElement = document.querySelector('video');
				try {
					videoElement.srcObject = stream;
				} catch {
					videoElement.src = window.URL.createObjectURL(stream);
				}
				videoElement.play();
			}, function(error){ });


			QCodeDecoder().decodeFromVideo(document.getElementById('videoReader'), function(er,data){
				if(!er){
					var match = data.match(/^bitcoin\:([1|3|bc1][a-z0-9]{25,50})/i);
					var result = match ? match[1] : data;
					$(""+$("#qrcode-scanner-callback-to").html()).val(result);
					$("#qrScanClose").click();
				}
			});

		} else {
			$("#videoReaderError").removeClass("hidden");
			$("#videoReader, #videoSource").addClass("hidden");
		}
	}

	coinbinf.clearInputsOnload = function () {
		//$("#inputs .txidRemove, #inputs .txidClear").click();
		$('#recipients input').val('');
		$('#inputs input').val('');

		$('#recipients').children( '.row:not(:first)' ).remove();
		$('#inputs').children( '.row:not(:first)' ).remove();

		$('#totalInput').text( parseFloat('0.00000000').toFixed(coinjs.decimalPlaces) );
		$('#totalOutput').text( parseFloat('0.00000000').toFixed(coinjs.decimalPlaces) );
	}

	/* redeem from button code */

	$("#redeemFromBtn").click(function(){
		console.log('==redeemFromBtn==');
		var redeemEl = $("#redeemFrom");
		var redeemValue = redeemEl.val().trim();
		redeemEl.val(redeemValue);

		var redeem = redeemingFrom(redeemValue);

		$("#redeemFromStatus, #redeemFromAddress").addClass('hidden');
		
		//remove errors on elements
		$("#transactionCreate, #transactionCreateStatus, #transactionCreateOptions").addClass("hidden");
		$('#putTabs a[href="#txinputs"]').removeClass('text-danger');
		$('#putTabs a[href="#txoutputs"]').removeClass('text-danger');

		if(redeem.from=='multisigAddress'){
			$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> You should use the redeem script, not its address!');
			return false;
		}

		if(redeem.from=='other'){
			$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> The string you have entered is invalid, sorry...');
			return false;
		}

		coinbinf.clearInputsOnload();
		

		$("#redeemFromBtn").html("Please wait, loading...").attr('disabled',true);


		if (wally_fn.provider.utxo == 'Blockcypher.com') {
			listUnspentBlockcypher(redeem, coinjs.asset.api.unspent_outputs['Blockcypher.com']);
		} else if (wally_fn.provider.utxo == 'Blockchair.com') {
			listUnspentBlockchair(redeem, coinjs.asset.api.unspent_outputs['Blockchair.com']);
		} else if (wally_fn.provider.utxo == 'Blockstream.info') {
			listUnspentBlockstream(redeem, coinjs.asset.api.unspent_outputs['Blockstream.info']);
			//fix Blockstream for utxo!
		} else if (wally_fn.provider.utxo == 'Chain.so') {
			listUnspentChainso(redeem, coinjs.asset.api.unspent_outputs['Chain.so']);
		} else if (wally_fn.provider.utxo == 'Coinb.in') {
			listUnspentDefault(redeem);
			//fix coinbin utxo here
		} else if (wally_fn.provider.utxo == 'Cryptoid.info') {
			listUnspentCryptoid(redeem, coinjs.asset.api.unspent_outputs['Cryptoid.info']);
		} else if (wally_fn.provider.utxo == 'Blockchain.info') {
			listUnspentBlockhaininfo(redeem, coinjs.asset.api.unspent_outputs['Blockchain.info']);
		} else if ( (wally_fn.provider.utxo).includes('ElectrumX') ) {
			listUnspentElectrumX(redeem, coinjs.asset.api.unspent_outputs['ElectrumX']);
		} 


        

		/*
		var host = $(this).attr('rel');

        // api:             blockcypher     blockchair      chain.so
        // network name     "btc"           "bitcoin"       "BTC/BTCTEST"
        // network name     "ltc"           "litecoin"      "LTC/LTCTEST"
        // network name     "doge"          "dogecoin"      "DOGE/DOGETEST"


		if(host=='chain.so_bitcoinmainnet'){
			listUnspentChainso(redeem, "BTC");
        } else if(host=='chain.so_litecoin'){
			listUnspentChainso(redeem, "LTC");
		} else if(host=='chain.so_dogecoin'){
			listUnspentChainso(redeem, "DOGE");

		} else if(host=='blockcypher_bitcoinmainnet'){
			listUnspentBlockcypher(redeem, "btc");
        } else if(host=='blockcypher_litecoin'){
			listUnspentBlockcypher(redeem, "ltc");
		} else if(host=='blockcypher_dogecoin'){
			listUnspentBlockcypher(redeem, "doge");

		} else if(host=='blockchair_bitcoinmainnet'){
			listUnspentBlockchair(redeem, "bitcoin");
        } else if(host=='blockchair_litecoin'){
			listUnspentBlockchair(redeem, "litecoin");
		} else if(host=='blockchair_dogecoin'){
			listUnspentBlockchair(redeem, "dogecoin");
		
		} else if(host=='chain.so_bitcoin_testnet'){
			listUnspentChainso(redeem, "BTCTEST");
        } else if(host=='chain.so_litecoin_testnet'){
			listUnspentChainso(redeem, "LTCTEST");
		} else if(host=='chain.so_dogecoin_testnet'){
			listUnspentChainso(redeem, "DOGETEST");

		} else if(host=="cryptoid.info_bitbay"){
				listUnspentCryptoid(redeem, "bay");
		} else if(host=="cryptoid.info_blackcoin"){
				listUnspentCryptoid(redeem, "blk");
		} 

		else {
			listUnspentDefault(redeem);
		}
		*/

		if($("#redeemFromStatus").hasClass("hidden")) {
			// An ethical dilemma: Should we automatically set nLockTime?
			if(redeem.from == 'redeemScript' && redeem.type == "hodl__") {
				$("#nLockTime").val(redeem.decodescript.checklocktimeverify);
			} else {
				$("#nLockTime").val(0);
			}
		}
	});

	/* function to determine what we are redeeming from */
	function redeemingFrom(string){
		var r = {};
		var decode = coinjs.addressDecode(string);
		if(decode.version == coinjs.pub){ // regular address
			r.addr = string;
			r.from = 'address';
			r.redeemscript = false;
		} else if (decode.version == coinjs.priv){ // wif key
			var a = coinjs.wif2address(string);
			r.addr = a['address'];
			r.from = 'wif';
			r.redeemscript = false;
		} else if (decode.version == coinjs.multisig){ // mulisig address
			r.addr = '';
			r.from = 'multisigAddress';
			r.redeemscript = false;
		} else if(decode.type == 'bech32'){
			r.addr = string;
			r.from = 'bech32';
			r.decodedRs = decode.redeemscript;
			r.redeemscript = true;
		} else {
			var script = coinjs.script();
			var decodeRs = script.decodeRedeemScript(string);
			if(decodeRs){ // redeem script
				r.addr = decodeRs['address'];
				r.from = 'redeemScript';
				r.decodedRs = decodeRs.redeemscript;
				r.type = decodeRs['type'];
				r.redeemscript = true;
				r.decodescript = decodeRs;
			} else { // something else
				if(string.match(/^[a-f0-9]{64}$/i)){
					r.addr = string;
					r.from = 'txid';
					r.redeemscript = false;
				} else {
					r.addr = '';
					r.from = 'other';
					r.redeemscript = false;
				}
			}
		}
		return r;
	}

	/* mediator payment code for when you used a public key */
	function mediatorPayment(redeem){

		if(redeem.from=="redeemScript"){

			$('#recipients .row[rel="'+redeem.addr+'"]').parent().remove();

			$.each(redeem.decodedRs.pubkeys, function(i, o){
				$.each($("#mediatorList option"), function(mi, mo){

					var ms = ($(mo).val()).split(";");

					var pubkey = ms[0]; // mediators pubkey
					var fee = ms[2]*1; // fee in a percentage
					var payto = coinjs.pubkey2address(pubkey); // pay to mediators address

					if(o==pubkey){ // matched a mediators pubkey?

						var clone = '<span><div class="row recipients mediator mediator_'+pubkey+'" rel="'+redeem.addr+'">'+$("#recipients .addressAddTo").parent().parent().html()+'</div><br></span>';
						$("#recipients").prepend(clone);

						$("#recipients .mediator_"+pubkey+" .bi-plus:first").removeClass('bi-plus');
						$("#recipients .mediator_"+pubkey+" .address:first").val(payto).attr('disabled', true).attr('readonly',true).attr('title','Medation fee for '+$(mo).html());

						var amount = ((fee*$("#totalInput").html())/100).toFixed(coinjs.decimalPlaces);
						$("#recipients .mediator_"+pubkey+" .amount:first").attr('disabled',(((amount*1)==0)?false:true)).val(amount).attr('title','Medation fee for '+$(mo).html());
					}
				});
			});

			validateOutputAmount();
		}
	}

	/* global function to add outputs to page */
	function addOutput(tx, n, script, amount) {
		if(tx){
			if($("#inputs .txId:last").val()!=""){
				$("#inputs .txidAdd").click();
			}

			$("#inputs .row:last input").attr('disabled',true);

			var txid = ((tx).match(/.{1,2}/g).reverse()).join("")+'';

			$("#inputs .txId:last").val(txid);
			$("#inputs .txIdN:last").val(n);
			$("#inputs .txIdAmount:last").val(amount);

			if(((script.match(/^00/) && script.length==44)) || (script.length==40 && script.match(/^[a-f0-9]+$/gi))){
				s = coinjs.script();
				s.writeBytes(Crypto.util.hexToBytes(script));
				s.writeOp(0);
				//s.writeBytes(coinjs.numToBytes((amount*100000000).toFixed(0), 8));	//icee remove
				s.writeBytes(coinjs.numToBytes((amount*("1e"+coinjs.decimalPlaces)).toFixed(0), 8));
				
				script = Crypto.util.bytesToHex(s.buffer);
			}

			$("#inputs .txIdScript:last").val(script);
		}
	}

	/* global function to add inputs to page */
	function addInput(address, amount) {
		if($("#recipients .recipient:last .address:last").val() != ""){
			$("#recipients .addressAddTo:first").click();
		};

		$("#recipients .address:last").val(address);
		$("#recipients .amount:last").val(amount);
	}


	/* default function to retreive unspent outputs*/	
	function listUnspentDefault(redeem){

		var tx = coinjs.transaction();

		// unspent from transaction; double spend and RBF.

		if(redeem.from == 'txid'){
			tx.getTransaction(redeem.addr, function(data){

				$("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Attempted to rebuild transaction id <a href="'+explorer_tx+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');

				$.each($(data).find("inputs").children(), function(i,o){
					var tx = $(o).find("txid").text();
					var n = $(o).find("output_no").text();
					var amount = (($(o).find("value").text()*1)).toFixed(coinjs.decimalPlaces);

					var scr = $(o).find("script").text();

					addOutput(tx, n, scr, amount);

				});

				$("#recipients .addressRemoveTo").click();
				$("#recipients .address").val("");
				$("#recipients .amount").val("");

				$.each($(data).find("outputs").children(), function(i,o){
					addInput($(o).find("address").text(), $(o).find("value").text());
				});

				$("#redeemFromBtn").html("Load").attr('disabled',false);
				totalInputAmount();
				validateOutputAmount();

			});

			return;
		}

		// unspent from address

		tx.listUnspent(redeem.addr, function(data){
			if(redeem.addr) {
				$("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved unspent inputs from address <a href="'+explorer_addr+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');

				$.each($(data).find("unspent").children(), function(i,o){
					var tx = $(o).find("tx_hash").text();
					var n = $(o).find("tx_output_n").text();
					var script = (redeem.redeemscript==true) ? redeem.decodedRs : $(o).find("script").text();
					//var amount = (($(o).find("value").text()*1)/100000000).toFixed(coinjs.decimalPlaces);	//iceee remove
					var amount = (($(o).find("value").text()*1)/("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces);
					

					addOutput(tx, n, script, amount);
				});
			}

			$("#redeemFromBtn").html("Load").attr('disabled',false);
			totalInputAmount();

			mediatorPayment(redeem);
		});
	}


	/* retrieve unspent data from blockcypher */
	function listUnspentBlockcypher(redeem,network){

		var apiUrl = 'https://api.blockcypher.com/v1/'+network+'/main/addrs/'+redeem.addr+'?includeScript=true&unspentOnly=true';
		
		if (coinjs.asset.network == 'testnet')
			apiUrl = 'https://api.blockcypher.com/v1/'+network+'/test3/addrs/'+redeem.addr+'?includeScript=true&unspentOnly=true';
		

		$.ajax ({
			type: "GET",
			//url: "https://api.blockcypher.com/v1/"+network+"/main/addrs/"+redeem.addr+"?includeScript=true&unspentOnly=true",
			url: apiUrl,
			dataType: "json",
			error: function(data) {
				$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs!');
			},
			success: function(data) {
				if (data.address) { // address field will always be present, txrefs is only present if there are UTXOs
					$("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved unspent inputs from address <a href="https://live.blockcypher.com/'+network+'/address/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
					for(var i in data.txrefs){
						var o = data.txrefs[i];
						var tx = ((""+o.tx_hash).match(/.{1,2}/g).reverse()).join("")+'';
						if(tx.match(/^[a-f0-9]+$/)){
							var n = o.tx_output_n;
							var script = (redeem.redeemscript==true) ? redeem.decodedRs : o.script;
							//var amount = ((o.value.toString()*1)/100000000).toFixed();	//icee remove
							var amount = ((o.value.toString()*1)/("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces);
							
							addOutput(tx, n, script, amount);
						}
					}
				} else {
					$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs.');
				}
			},
			complete: function(data, status) {
				$("#redeemFromBtn").html("Load").attr('disabled',false);
				totalInputAmount();
			}
		});
	}

	function listUnspentBlockstream(redeem, network){
			console.log('===getBalanceBlockstream===');
			https://blockstream.info/api/address/1Kr6QSydW9bFQG1mXiPNNu6WpJGmUa9i1g/utxo
			var apiUrl = 'https://blockstream.info/api/', explorerUrl = 'https://blockstream.info/address/'+redeem.addr;
			//if(coinjs.asset.network == 'mainnet')
				//apiUrl = 'https://blockstream.info/api/';	//https://blockstream.info/api/address/1JnfbQerGjFHVq28945y1bhoUHpn6vKM9v
			if(coinjs.asset.network == 'testnet') {
				apiUrl = 'https://blockstream.info/testnet/api/';		//https://blockstream.info/testnet/api/address/mxxT1fTdPuJ9gphSJfpS7zsqpjGLM27bne
				explorerUrl = 'https://blockstream.info/testnet/'+redeem.addr;
			}

			$.ajax ({
				type: "GET",
				//url: "https://api.blockcypher.com/v1/"+network+"/main/addrs/"+redeem.addr+"?includeScript=true&unspentOnly=true",
				url: apiUrl+'/address/'+redeem.addr+'/utxo',
				dataType: "json",
				error: function(data) {
					$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs!');
					console.log('data: ', data);
				},
				success: function(data) {
					if (data) { // address field will always be present
						$("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved unspent inputs from address <a href="'+explorerUrl+'" target="_blank">'+redeem.addr+'</a>');


						for(var i in data){
							var o = data[i];
							var tx = ((""+o.txid).match(/.{1,2}/g).reverse()).join("")+'';
							if(tx.match(/^[a-f0-9]+$/) && o.status.confirmed == true){
								var n = o.vout;
								var script = (redeem.redeemscript==true) ? redeem.decodedRs : coinjs.addressToOutputScript(redeem.addr);
								var amount = ((o.value.toString()*1)/("1e"+coinjs.decimalPlaces)).toFixed((coinjs.decimalPlaces));
								addOutput(tx, n, script, amount);
							}
						}



						
					} else {
						$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs.');
					}
				},
				complete: function(data, status) {
					$("#redeemFromBtn").html("Load").attr('disabled',false);
					totalInputAmount();
				}
			});


		}

	/* retrieve unspent data from blockchair */
	function listUnspentBlockchair(redeem,network){

		var apiUrl = 'https://api.blockchair.com/'+network+'/dashboards/address/'+redeem.addr;
		
		if (coinjs.asset.network == 'testnet')
			apiUrl = 'https://api.blockchair.com/'+network+'/testnet/dashboards/address/'+redeem.addr;

		


		$.ajax ({
			type: "GET",
			//url: "https://api.blockchair.com/"+network+"/dashboards/address/"+redeem.addr,
			url: apiUrl,
			dataType: "json",
			error: function(data) {
				$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs! <div class="alert alert-light">'+data+' </div>');
				console.log('error: ', data);
			},
			success: function(data) {
				if((data.context && data.data) && data.context.code =='200'){
					$("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved unspent inputs from address <a href="'+explorer_addr+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
					var all_info = data.data[redeem.addr];
					
					for(var i in all_info.utxo){
						var o = all_info.utxo[i];
						var tx = ((""+o.transaction_hash).match(/.{1,2}/g).reverse()).join("")+'';
						if(tx.match(/^[a-f0-9]+$/)){
							var n = o.index;
							var script = (redeem.redeemscript==true) ? redeem.decodedRs : all_info.address.script_hex;
							//var amount = ((o.value.toString()*1)/100000000).toFixed(8);	//icee remove
							var amount = ((o.value.toString()*1)/("1e"+coinjs.decimalPlaces)).toFixed((coinjs.decimalPlaces));

							addOutput(tx, n, script, amount);
						}
					}
				} else {
					$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs. <div class="alert alert-light">'+data.context.error+' </div>');
				}
			},
			complete: function(data, status) {
				$("#redeemFromBtn").html("Load").attr('disabled',false);
				totalInputAmount();
			}
		});
	}


	/* retrieve unspent data from chainso */
	function listUnspentChainso(redeem, network){
		
		console.log('redeem: ', redeem);
		$.ajax ({
			type: "GET",
			url: "https://chain.so/api/v2/get_tx_unspent/"+network+"/"+redeem.addr,
			dataType: "json",
			error: function(data) {
				$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs!');
			},
			success: function(data) {
				if((data.status && data.data) && data.status=='success'){
					$("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved unspent inputs from address <a href="https://chain.so/address/'+network+'/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
					for(var i in data.data.txs){
						var o = data.data.txs[i];
						var tx = ((""+o.txid).match(/.{1,2}/g).reverse()).join("")+'';
						if(tx.match(/^[a-f0-9]+$/)){
							var n = o.output_no;
							var script = (redeem.redeemscript==true) ? redeem.decodedRs : o.script_hex;
							var amount = o.value;
							addOutput(tx, n, script, amount);
						}
					}
				} else {
					$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs.');
				}
			},
			complete: function(data, status) {
				$("#redeemFromBtn").html("Load").attr('disabled',false);
				totalInputAmount();
			}
		});
	}



	// retrieve unspent data from chainz.cryptoid.info (mainnet and testnet)
	function listUnspentBlockhaininfo(redeem, network){ 
		console.log("listUnspentBlockhaininfo");
		//https://blockchain.info/unspent?active=bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d

		$.ajax ({
		  type: "GET",
		  url: "https://blockchain.info/unspent?active="+ redeem.addr,
		  dataType: "json",
		  error: function() {
			$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs! ');
		  },
		  success: function(data) {
			//if($(data).find("unspent_outputs").text()==1){
			  $("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved unspent inputs from address <a href="https://www.blockchain.com/explorer/addresses/'+network+'/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');

				for(i = 0; i < data.unspent_outputs.length; ++i){
					var o = data.unspent_outputs[i];
					var tx = ((""+o.tx_hash_big_endian).match(/.{1,2}/g).reverse()).join("")+'';
					if(tx.match(/^[a-f0-9]+$/)){
						var n = o.tx_output_n;
						var script = (redeem.redeemscript==true) ? redeem.decodedRs : o.script;
						console.log('script: '+ script);
						//var amount = (o.value /100000000).toFixed(8);;		//icee remove
						var amount = (o.value /("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces);
						
						console.log(tx, n, script, amount)
						addOutput(tx, n, script, amount);
					}
				}

		   },
		  complete: function(data, status) {
			$("#redeemFromBtn").html("Load").attr('disabled',false);
			totalInputAmount();
		  }
		});
	}

	// retrieve unspent data from chainz.cryptoid.info (mainnet and testnet)
	function listUnspentCryptoid(redeem, network){ 
		console.log("listUnspentCryptoid: ", redeem);
		$.ajax ({
		  type: "GET",
		  url: "https://chainz.cryptoid.info/"+network+"/api.dws?key=1205735eba8c&q=unspent&active="+ redeem.addr,
		  dataType: "json",
		  error: function() {
			$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs!');
		  },
		  success: function(data) {
			//if($(data).find("unspent_outputs").text()==1){
			  $("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved unspent inputs from address <a href="https://chainz.cryptoid.info/'+network+'/address.dws?'+redeem.addr+'.htm" target="_blank">'+redeem.addr+'</a>');

				for(i = 0; i < data.unspent_outputs.length; ++i){
					var o = data.unspent_outputs[i];
					var tx = ((""+o.tx_hash).match(/.{1,2}/g).reverse()).join("")+'';
					if(tx.match(/^[a-f0-9]+$/)){
						var n = o.tx_ouput_n;
						var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : o.script;
						var amount = (o.value /100000000).toFixed(8);	//Cryptoid returns 8 decimals independently from the assets decimals number
						//var amount = (o.value /("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces);
						
						console.log(tx, n, script, amount)
						addOutput(tx, n, script, amount);
					}
				}

		   },
		  complete: function(data, status) {
			$("#redeemFromBtn").html("Load").attr('disabled',false);
			totalInputAmount();
		  }
		});
	}

	// retrieve unspent data from ElectrumX
	//https://wally.id/api/x.php?asset=aby&method=blockchain.scripthash.listunspent&scripthash=f2c773074a10d44ee5f9d196d9f7bf5da8d173e4a608aa3e752ec35b8be286c9&server=electrumx-four.artbyte.live:50012
	/*
	{
    "jsonrpc": "2.0",
    "result": [
        {
            "tx_hash": "f99a629faf971ec9e45819585dbac14f2653a6c7dea5bb52aa9960c1fb03718f",
            "tx_pos": 0,
            "height": 1088828,
            "value": 11040000000
        }
    ],
    "id": "aby"
}

only send scriptHash of multisig address to ElectrumX, not the redeemscripts
*/

	function listUnspentElectrumX(redeem, network){ 
		console.log("listUnspentElectrumX: ", redeem);

		//var electrum_node = 'electrumx-four.artbyte.live:50012';	//network
		var electrum_node = coinjs.asset.api.unspent_outputs[wally_fn.provider.utxo];
		var use_ssl = (wally_fn.provider.utxo).includes('(SSL)') ? "useSSL=true&" : "";

		var ticker = (coinjs.asset.symbol).toLowerCase();
		$.ajax ({
		  type: "GET",
		  //https://wally.id/api/x.php?asset=aby&method=blockchain.scripthash.listunspent&scripthash=3f677078a1a9ad42d277fd91e38c102ff89d5cb5160f1a9595dca6552e84561c&server=electrumx-four.artbyte.live:50012
		  url: "https://wally.id/api/x.php?"+use_ssl+"asset="+ticker+"&method=blockchain.scripthash.listunspent&scripthash="+ coinjs.addressToScriptHash(redeem.addr) + '&server='+electrum_node,
		  dataType: "json",
		  error: function() {
			$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs!');
		  },
		  success: function(data) {



			var r;

        	if (data.result) {
				
				

				for(i = 0; i < data.result.length; ++i){
					var o = data.result[i];
					var tx = ((""+o.tx_hash).match(/.{1,2}/g).reverse()).join("")+'';
					if(tx.match(/^[a-f0-9]+$/)){
						var n = o.tx_pos;
						var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : coinjs.addressToOutputScript(redeem.addr);
						var amount = (o.value /100000000).toFixed(8);	//Cryptoid returns 8 decimals independently from the assets decimals number
						//var amount = (o.value /("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces);
						
						console.log(tx, n, script, amount)
						addOutput(tx, n, script, amount);
					}
				}

				$("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved unspent inputs from address: '+redeem.addr+ ', ElectrumX node: '+electrum_node);


			} else if (data.hasOwnProperty('error') ) {
				r = 'Unexpected error. ElectrumX response: <br>'
				r += '<div class="alert alert-light">'+data.error.message+'</div>';
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<i class="bi bi-exclamation-triangle-fill"></i> ');
			} else {
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again later...').prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
			}

		   },
		  complete: function(data, status) {
			$("#redeemFromBtn").html("Load").attr('disabled',false);
			totalInputAmount();
		  }
		});
	}





	/* math to calculate the inputs and outputs */

	function totalInputAmount(){
		console.log('===totalInputAmount===');
		$("#totalInput").text('0.00');
		var ia =0;
		$.each($("#inputs .txIdAmount"), function(i,o){
			ia = $(o).val()*1
			if(isNaN(ia)){
				$(o).parent().addClass('has-error');
				$(o).addClass('is-invalid');
			} else {
				$(o).parent().removeClass('has-error');
				$(o).removeClass('is-invalid');
				var f = 0;
				if(!isNaN(ia)){
					f += ia*1;
				}
				//$("#totalInput").text((($("#totalInput").text()*1) + (f)).toFixed(8));	//icee removee
				$("#totalInput").text((($("#totalInput").text()*1) + (f*1)).toFixed(coinjs.decimalPlaces));
			}
		});
		totalFee();
	}

	function validateOutputAmount(){
		console.log('===validateOutputAmount===');
		
		$("body").on("keyup", "#recipients .amount", function(e){
		//$("#recipients .amount").keyup(function(){
			if(isNaN($(this).val())){
				$(this).parent().addClass('has-error');
				$(this).addClass('is-invalid');
			} else {
				$(this).parent().removeClass('has-error');
				$(this).removeClass('is-invalid');
				var f = 0;
				$.each($("#recipients .amount"),function(i,o){
					if(!isNaN($(o).val())){
						f += $(o).val()*1;
					}
				});
				//$("#totalOutput").text((f).toFixed(8));	//ICEEE REmoveeeeeee
				$("#totalOutput").text((f).toFixed(coinjs.decimalPlaces));
			}
			totalFee();
		}).keyup();
	}

	$("body").on("keyup", "#recipients .address", function(e){
		//$("#recipients .address").keyup(function(){
		/*if (wally_fn.isHex($(this).val()))
			$(this).removeClass('is-invalid');
		else
			$(this).addClass('is-invalid');
		*/
	});

	function totalFee(){
		console.log('===totalFee===');
		//var fee = (($("#totalInput").text()*1) - ($("#totalOutput").text()*1)).toFixed(8);	//iceee removeee
		var fee = (($("#totalInput").text()*1) - ($("#totalOutput").text()*1)).toFixed(coinjs.decimalPlaces);
		console.log('insAmount:'+$("#totalInput").text()*1);
		console.log('outsAmount:'+$("#totalOutput").text()*1);
		$("#transactionFee").val((fee>0)?fee:'0.00');
	}



	/* broadcast a transaction */

	$("#rawSubmitBtn").click(function(){

		if (wally_fn.provider.broadcast == 'Blockcypher.com') {
			rawSubmitBlockcypher(this, coinjs.asset.api.broadcast['Blockcypher.com']);
		} else if (wally_fn.provider.broadcast == 'Blockchair.com') {
			rawSubmitBlockchair(this, coinjs.asset.api.broadcast['Blockchair.com']);
		} else if (wally_fn.provider.broadcast == 'Blockstream.info') {
			rawSubmitBlockstream(this, coinjs.asset.api.broadcast['Blockstream.info']);
			//fix Blockstream for broadcast!
		} else if (wally_fn.provider.broadcast == 'Chain.so') {
			rawSubmitChainso(this, coinjs.asset.api.broadcast['Chain.so']);
		} else if (wally_fn.provider.broadcast == 'Coinb.in') {
			rawSubmitDefault(this);
			//fix coinbin broadcast here
		} else if (wally_fn.provider.broadcast == 'Cryptoid.info') {
			rawSubmitCryptoid(this, coinjs.asset.api.broadcast['Cryptoid.info']);
		//} else if (wally_fn.provider.broadcast == 'ElectrumX') {
		} else if (wally_fn.provider.broadcast == 'Blockchain.info') {
			rawSubmitBlockhaininfo(this, coinjs.asset.api.broadcast['Blockchain.info']);
		} else if ( (wally_fn.provider.broadcast).includes('ElectrumX') ) {
			rawSubmitElectrumX(this, coinjs.asset.api.broadcast['ElectrumX']);
		} else {
			rawSubmitDefault(this);
		}
	});

	

	// broadcast transaction via coinbin (default)
	function rawSubmitDefault(btn){ 
		var thisbtn = btn;		
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: coinjs.host+'?uid='+coinjs.uid+'&key='+coinjs.key+'&setmodule=bitcoin&request=sendrawtransaction',
			data: {'rawtx':$("#rawTransaction").val()},
			dataType: "xml",
			error: function(data) {
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(" There was an error submitting your request, please try again").prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
			},
              success: function(data) {
				$("#rawTransactionStatus").html(unescape($(data).find("response").text()).replace(/\+/g,' ')).removeClass('hidden');
				if($(data).find("result").text()==1){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html('Your transaction was sent!<br> TXID: ' + $(data).find("txid").text() + '<br> <a href="https://coinb.in/tx/' + $(data).find("txid").text() + '" target="_blank">View on Blockchain</a>');
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').prepend('<i class="bi bi-exclamation-triangle-fill"></i> ');
				}
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}

	// broadcast transaction via chain.so (mainnet and testnet)
	function rawSubmitChainso(thisbtn, network){ 
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: "https://chain.so/api/v2/send_tx/"+network+"/",
			data: {"tx_hex":$("#rawTransaction").val()},
			dataType: "json",
			error: function(data) {
				var obj = $.parseJSON(data.responseText);
				var r = ' ';
				r += (obj.data.tx_hex) ? obj.data.tx_hex : '';
				r = (r!='') ? r : ' Failed to broadcast'; // build response 
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<i class="bi bi-exclamation-triangle-fill"></i> ');
			},
                        success: function(data) {
				if(data.status && data.data.txid){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' TXID: ' + data.data.txid + '<br> <a href="https://chain.so/tx/'+network+'/' + data.data.txid + '" target="_blank">View on Blockchain Explorer</a>');
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
				}				
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}

	// broadcast transaction via chainz.cryptoid.info (mainnet and testnet)
	function rawSubmitCryptoid(thisbtn, network){ 
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		//console.log("rawSubmitCryptoid: " + $("#rawTransaction").val());
/*
		var testurl = "https://chainz.cryptoid.info/"+network+"/api.dws?q=pushtx&key=1205735eba8c";
          var hej = coinjs.ajax(testurl, (data) => {
              
             console.log('data: ', data);
     

            //reduce the amount of API calls: add this to checkURLTime so we dont overload APIs

          }, 'POST', 'tx_hex='+$("#rawTransaction").val());
*/

		$.ajax ({

		  type: "POST",
          url: "https://chainz.cryptoid.info/"+network+"/api.dws?q=pushtx",
          data: $("#rawTransaction").val(), 
          dataType: "text", //"json",
          error: function(data, status, error) {
            
            var dataJson, r = 'Failed to broadcast!<br>';
            try {
            	dataJson = $.parseJSON((data.responseText).split('\n', 1)[0]);	//get the first line
            	r += 'Error: '+dataJson.error.code+"<br>";
	            r += 'Message: '+dataJson.error.message;
	            r += '<br><div class="alert alert-light">'+data.responseText+'</div>';
            } catch (e) {
            	dataJson = ((data.responseText).split('\n', 1)[0]);	//get the first line
            }
            //var data = data.responseText;
            /*
            //console.log('broadcast cryptoid: error');
            //console.log('data: ', data);
            //console.log('status: ', status);
            //console.log('error: ', error);

            console.log(dataJson);
            console.log('dataJson.error.code: ' + dataJson.error.code);
            console.log('dataJson.error.message: ' + dataJson.error.message);

            if(status == 'error') {
            	console.log('Failed to broadcast!');
            }
            */
            

            

            $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
          },
            success: function(data) {
            
            //console.log('data: ', data);
			//var txid = ((data).split('\n', 1)[0]);	//get the first line
            //console.log('broadcast cryptoid: succes');
            
			var txid = (data.match(/[a-f0-9]{64}/gi)[0]);
			//if(txid.match(/^[a-f0-9]+$/)){
			if(txid){
              $("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' TXID: ' + txid + '<br> <a href="https://chainz.cryptoid.info/'+network+'/tx.dws?'+txid+'.htm" target="_blank">View on Blockchain Explorer</a>');
            } else {
              $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
            }
          },
          complete: function(data, status) {
            $("#rawTransactionStatus").fadeOut().fadeIn();
            $(thisbtn).val('Submit').attr('disabled',false);
          }

		});

	}



	
	

		// broadcast transaction via blockstream.com (mainnet)
	//https://tbtc.bitaps.com/broadcast
	//https://live.blockcypher.com/btc-testnet/decodetx/

	function rawSubmitBlockstream(thisbtn, network){ 

		var 
			apiUrl = 'https://blockstream.info/api/tx',
			txUrl = 'live.blockcypher.com';

		if(coinjs.asset.network == 'testnet'){
			apiUrl = 'https://blockstream.info/testnet/api/tx';
			txUrl = 'live.blockcypher.com/btc-testnet';
		}


		console.log('===rawSubmitBlockstream===');
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: apiUrl,
			data: $("#rawTransaction").val(),
			dataType: "json", 
			error: function(data) {
				console.log('Blockstream error data: ', data);
				var r = 'Failed to broadcast - Error Code: ' + data.status.toString() + ' ' + data.statusText;
				r += '<br>'+data.responseText;;
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<i class="bi bi-exclamation-triangle-fill"></i> ');
			},
            success: function(data) {
            	console.log('Blockstream success data: ', data);
            	var txid = (data.match(/[a-f0-9]{64}/gi)[0]);
            	if(txid){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden")
                    .html(' TXID: ' + txid + '<br> <a href="https://'+txUrl+'/tx/' + txid + '" target="_blank">View on Blockchain Explorer</a>');
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
				}
			},
			complete: function(data, status) {
				console.log('Blockstream complete data: ', data);
				console.log('Blockstream status data: ', status);
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}

	// broadcast transaction via electrumx node
	function rawSubmitElectrumX(thisbtn, ticker){ 
		//https://wally.id/api/x.php?asset=nvc&method=blockchain.transaction.broadcast&server=failover.nvc.ewmcx.biz:50002&rawtx=01000000c6c84364019b3797aaa753f7edbe8810d49c32a07df4a6e56eaf5db4d08430ea0c6de03fae010000006a473044022041280eca4f49bb346c9a20a273de67f7da92e913e92f6655fe8cef09ac91f0fd02202ebbb0255a724e11a437b628c175a662dcfdef3d4201a6b54dea2d4d1294ad7c012103d928fc52610164842551bdd92597f7b22c9a1673f63c36741e40a42f8a24d174feffffff010003164e020000001976a914e40ec92c5974904ad43f03a1b156bb2b6de4c9fd88ac00000000

		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		var electrum_node = coinjs.asset.api.broadcast[wally_fn.provider.broadcast];
		var use_ssl = (wally_fn.provider.broadcast).includes('(SSL)') ? "useSSL=true&" : "";


		var ticker = (coinjs.asset.symbol).toLowerCase();
		var rawtx = $("#rawTransaction").val();
		$.ajax ({
			type: "POST",
			url: "https://wally.id/api/x.php?"+use_ssl+"asset="+ticker+"&method=blockchain.transaction.broadcast&server="+electrum_node+"&rawtx="+rawtx,
			data: rawtx,
			error: function(data) {
				var r = 'Failed to broadcast';
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
			},
            success: function(data) {
					
            	var r;

            	if (data.result) {
					var txid = data.result;
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' TXID: ' + txid + '<br> <a href="https://chainz.cryptoid.info/'+ticker+'/tx.dws?'+txid+'.htm" target="_blank">View on Blockchain Explorer</a>');
				} else if (data.hasOwnProperty('error') ) {
					r = 'Failed to Broadcast. ElectrumX response: <br>'
					r += '<div class="alert alert-light">'+data.error.message+'</div>';
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<i class="bi bi-exclamation-triangle-fill"></i> ');
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again later...').prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
				}

			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);
			}
		});
	}

	// broadcast transaction via blockcypher.com (mainnet)
	function rawSubmitBlockcypher(thisbtn, network){ 
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);

		if(coinjs.asset.network == 'mainnet') {
			txUrl = 'live.blockcypher.com';

		}
		if(coinjs.asset.network == 'mainnet'){
			txUrl = 'live.blockcypher.com/btc-testnet';
		}


		$.ajax ({
			type: "POST",
			url: "https://api.blockcypher.com/v1/"+network+"/main/txs/push",
			data: JSON.stringify({"tx":$("#rawTransaction").val()}),
			error: function(data) {
				var r = 'Failed to broadcast: error code=' + data.status.toString() + ' ' + data.statusText;
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<i class="bi bi-exclamation-triangle-fill"></i> ');
			},
                        success: function(data) {
				if((data.tx) && data.tx.hash){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden")
                    .html(' TXID: ' + data.tx.hash + '<br> <a href="https://'+txUrl+'/tx/' + data.tx.hash + '" target="_blank">View on Blockchain Explorer</a>');
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
				}
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}

	// broadcast transaction via blockchair
	function rawSubmitBlockchair(thisbtn, network){
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
                $.ajax ({
                        type: "POST",
                        url: "https://api.blockchair.com/"+network+"/push/transaction",
                        data: {"data":$("#rawTransaction").val()},
                        dataType: "json",
                        error: function(data) {
				var r = 'Failed to broadcast: error code=' + data.status.toString() + ' ' + data.statusText;
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
			//	console.error(JSON.stringify(data, null, 4));
                        },
                        success: function(data) {
			//	console.info(JSON.stringify(data, null, 4));
				if((data.context && data.data) && data.context.code=='200'){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden")
                    .html(' TXID: ' + data.data.transaction_hash + '<br> <a href="https://blockchair.com/'+network+'/transaction/' + data.data.transaction_hash + '" target="_blank">View on Blockchain Explorer</a>');
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
				}
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
                        }
                });
	}


	coinbinf.getBalance = function () {

		console.log('===getBalance()===');
		/*console.log('==redeemFromBtn==');
		var redeemEl = $("#redeemFrom");
		var redeemValue = redeemEl.val().trim();
		redeemEl.val(redeemValue);
		var redeem = redeemingFrom(redeemValue);
		*/

		var redeem = redeemingFrom('1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD');
		getBalanceBlockcypher(redeem, coinjs.asset.api.unspent_outputs['Blockcypher.com']);
		return;
		

		if (wally_fn.provider.utxo == 'Blockcypher.com') {
			getBalanceBlockcypher(redeem, coinjs.asset.api.unspent_outputs['Blockcypher.com']);
		} else if (wally_fn.provider.utxo == 'Blockchair.com') {
			listUnspentBlockchair(redeem, coinjs.asset.api.unspent_outputs['Blockchair.com']);
		} else if (wally_fn.provider.utxo == 'Blockstream.info') {
			getBalanceBlockstream(redeem, coinjs.asset.api.unspent_outputs['Blockstream.info']);
			//fix Blockstream for utxo!
		} else if (wally_fn.provider.utxo == 'Chain.so') {
			//listUnspentChainso(redeem, coinjs.asset.api.unspent_outputs['Chain.so']);
		} else if (wally_fn.provider.utxo == 'Coinb.in') {
			getBalanceDefault(redeem);
		} else if (wally_fn.provider.utxo == 'Cryptoid.info') {
			getBalanceCryptoid(redeem, coinjs.asset.api.unspent_outputs['Cryptoid.info']);
		} else if (wally_fn.provider.utxo == 'Blockchain.info') {
			getBalanceBlockhaininfo(redeem, coinjs.asset.api.unspent_outputs['Blockchain.info']);
		} else if ( (wally_fn.provider.utxo).includes('ElectrumX') ) {
			getBalanceElectrumX(redeem, coinjs.asset.api.unspent_outputs['ElectrumX']);
		} 


		function getBalanceDefault(redeem, network) {
/*
			http://coinb.in/api/?uid=1&key=12345678901234567890123456789012&setmodule=addresses&request=bal&address=1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY&r=0.310425492702052

			response:
			<request>
<result>1</result>
<confirmed>63372434180</confirmed>
<unconfirmed>0</unconfirmed>
<balance>63372434180</balance>
<response>balance+returned</response>
</request>
*/

			coinjs.addressBalance(redeem.addr,function(data){
				if($(data).find("result").text()==1){
					//var v = $(data).find("balance").text()/100000000;	//iceee remove
					var v = $(data).find("balance").text()/("1e"+coinjs.decimalPlaces);
					console.log('Balance is '+v+' BTC');
				} else {
					console.log('Unexpected error, unable to retrieve Balance!');
				}

				$("#walletLoader").addClass("hidden");
			});

		}

		//url: "https://chainz.cryptoid.info/"+network+"/api.dws?key=1205735eba8c&q=unspent&active="+ redeem.addr,
		//https://btc.cryptoid.info/btc/api.dws?key=1205735eba8c&q=getbalance&a=bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97
		/*

		response text
		*/
		function getBalanceCryptoid(redeem, network) {

			var ticker = (coinjs.asset.symbol).toLowerCase();
			console.log("getBalanceCryptoid: ", redeem);
			$.ajax ({
			  type: "GET",
			  url: "https://chainz.cryptoid.info/"+ticker+"/api.dws?key=1205735eba8c&q=getbalance&a="+ redeem.addr,
			  dataType: "json",
			  error: function() {
				//$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve Balance!');
				console.log('Unexpected error, unable to retrieve Balance!');
			  },
			  success: function(data) {
				//if($(data).find("unspent_outputs").text()==1){
				  $("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved Balance from address <a href="https://chainz.cryptoid.info/'+network+'/address.dws?'+redeem.addr+'.htm" target="_blank">'+redeem.addr+'</a>');

				  console.log('Retrieved Balance from address <a href="https://chainz.cryptoid.info/'+network+'/address.dws?'+redeem.addr+'.htm" target="_blank">'+redeem.addr+'</a>', data);

			   },
			  complete: function(data, status) {
				//$("#redeemFromBtn").html("Load").attr('disabled',false);
				//totalInputAmount();
			  }
			});


		}

		function getBalanceElectrumX(redeem, network) {
			//https://wally.id/api/x.php?asset=aby&method=blockchain.scripthash.get_balance&scripthash=f2c773074a10d44ee5f9d196d9f7bf5da8d173e4a608aa3e752ec35b8be286c9&server=electrumx-four.artbyte.live:50012

			/*response:
			{
				"jsonrpc": "2.0",
				"result": {
				    "confirmed": 11040000000,
				    "unconfirmed": 0
			},
				"id": "aby"
			}
			*/

			var ticker = (coinjs.asset.symbol).toLowerCase();

			var electrum_node = coinjs.asset.api.unspent_outputs[wally_fn.provider.utxo];
			var use_ssl = (wally_fn.provider.utxo).includes('(SSL)') ? "useSSL=true&" : "";


			console.log("getBalanceCryptoid: ", redeem);
			$.ajax ({
			  type: "GET",
			  url: "https://wally.id/api/x.php?"+use_ssl+"asset="+ticker+"&method=blockchain.scripthash.get_balance&scripthash="+ coinjs.addressToScriptHash(redeem.addr) + '&server='+electrum_node,

			  dataType: "json",
			  error: function() {
				//$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve Balance!');
				console.log('Unexpected error, unable to retrieve Balance!');
			  },
			  success: function(data) {
				//if($(data).find("unspent_outputs").text()==1){
				  $("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved Balance from address <a href="https://chainz.cryptoid.info/'+network+'/address.dws?'+redeem.addr+'.htm" target="_blank">'+redeem.addr+'</a>');

				  console.log('Retrieved Balance from address: '+redeem.addr, data + ', ElectrumX node: '+electrum_node);

			   },
			  complete: function(data, status) {
				//$("#redeemFromBtn").html("Load").attr('disabled',false);
				//totalInputAmount();
			  }
			});


		}

		/*
		
		https://blockchain.info/balance?active=bc1qjh0akslml59uuczddqu0y4p3vj64hg5mc94c40

		response text
		*/

		function getBalanceBlockhaininfo(redeem, network) {

			var ticker = (coinjs.asset.symbol).toLowerCase();
			console.log("getBalanceCryptoid: ", redeem);

			$.ajax ({
			  type: "GET",
			  url: 'https://blockchain.info/q/addressbalance/'+redeem.addr+'?confirmations=3',
			  dataType: "json",
			  error: function() {
				//$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve Balance!');
				console.log('Unexpected error, unable to retrieve Balance!');
			  },
			  success: function(data) {
				//if($(data).find("unspent_outputs").text()==1){
				  $("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved Balance from address <a href="https://www.blockchain.com/explorer/addresses/btc/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');

				  console.log('Retrieved Balance from address <a href="https://www.blockchain.com/explorer/addresses/btc/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>', data);
				  
				  var amount = ((data.toString()*1)/("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces);
				  console.log('amount: ' + amount);


			   },
			  complete: function(data, status) {
				//$("#redeemFromBtn").html("Load").attr('disabled',false);
				//totalInputAmount();
			  }
			});

		}

		/*
		API docs
		https://documenter.getpostman.com/view/12131330/TVCZYVRa
		https://www.blockcypher.com/dev/bitcoin/?javascript#address-balance-endpoint

		*/
		function getBalanceBlockcypher(redeem, network) {
			//https://api.blockcypher.com/v1/btc/main/addrs/1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD/balance
			//https://api.blockcypher.com/v1/btc/test3/addrs/n1EyXjxZiordizSr2c12Rf1zTtcbFTMD7E/balance

			var apiUrl = 'https://api.blockcypher.com/v1/'+network+'/main/addrs/'+redeem.addr;
			var explorerUrl = 'https://live.blockcypher.com/btc/address/'+redeem.addr;
			
			if (coinjs.asset.network == 'testnet'){
				apiUrl = 'https://api.blockcypher.com/v1/'+network+'/test3/addrs/'+redeem.addr;
				var explorerUrl = 'live.blockcypher.com/btc-testnet/address/'+redeem.addr;
			}

			$.ajax ({
				type: "GET",
				//url: "https://api.blockcypher.com/v1/"+network+"/main/addrs/"+redeem.addr+"?includeScript=true&unspentOnly=true",
				url: apiUrl,
				dataType: "json",
				error: function(data) {
					console.log('Unexpected error, unable to retrieve Balance!');
				},
				success: function(data) {
					if (data.address) { // address field will always be present
						//$("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved Balance from address <a href="https://live.blockcypher.com/'+network+'/address/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');

						if (data.final_balance) {
							var amount = ((data.final_balance.toString()*1)/("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces);
							console.log('amount: ' + amount);

							console.log('Retrieved Balance from address <a href="'+explorerUrl+'" target="_blank">'+redeem.addr+'</a>', data);
						}

						
					} else {
						//$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve Balance.');
					}
				},
				complete: function(data, status) {
					//$("#redeemFromBtn").html("Load").attr('disabled',false);
					//totalInputAmount();
				}
			});


		}

		
		function getBalanceBlockstream(redeem, network){
			console.log('===getBalanceBlockstream===');
			
			var apiUrl = 'https://blockstream.info/api/', explorerUrl = 'https://blockstream.info/address/'+redeem.addr;
			//if(coinjs.asset.network == 'mainnet')
				//apiUrl = 'https://blockstream.info/api/';	//https://blockstream.info/api/address/1JnfbQerGjFHVq28945y1bhoUHpn6vKM9v
			if(coinjs.asset.network == 'testnet') {
				apiUrl = 'https://blockstream.info/testnet/api/';		//https://blockstream.info/testnet/api/address/mxxT1fTdPuJ9gphSJfpS7zsqpjGLM27bne
				explorerUrl = 'https://blockstream.info/testnet/'+redeem.addr;
			}

			$.ajax ({
				type: "GET",
				//url: "https://api.blockcypher.com/v1/"+network+"/main/addrs/"+redeem.addr+"?includeScript=true&unspentOnly=true",
				url: apiUrl+'/address/'+redeem.addr,
				dataType: "json",
				error: function(data) {
					$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve Balance!');
				},
				success: function(data) {
					if (data.address) { // address field will always be present
						$("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved Balance from address <a href="'+explorerUrl+'" target="_blank">'+redeem.addr+'</a>');

						var amount_left = data.funded_txo_sum - data.spent_txo_sum;

						if (amount_left) {
							var amount = ((amount_left.toString()*1)/("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces);
							console.log('amount: ' + amount_left);
						}

						
					} else {
						$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve Balance.');
					}
				},
				complete: function(data, status) {
					$("#redeemFromBtn").html("Load").attr('disabled',false);
					totalInputAmount();
				}
			});


		}


	}
	

	/* verify script code */

	$("#verifyBtn").click(function(){
		$(".verifyData").addClass("hidden");
		$("#verifyStatus").hide();
		$('#verifyScript').val($('#verifyScript').val().trim());
		try {
			if(!decodeRedeemScript()){
				if(!decodeTransactionScript()){
					if(!decodePrivKey()){
						if(!decodePubKey()){
							if(!decodeHDaddress()){
								$("#verifyStatus").removeClass('hidden').fadeOut().fadeIn();
							}
						}
					}
				}
			}

			//add link for sharing to verify page
			if ($("#verifyStatus").hasClass('hidden')) {
				var network_slug = '';
				if(coinjs.asset.network != 'mainnet')
					network_slug = '&network='+coinjs.asset.network;

				//$("#verify a.verifyLink").attr('href','verify='+coinbinf.verifyScript.val()+'/asset='+coinjs.asset.slug+network_slug);
				//$("#verify a.verifyLink").attr('href','#verify/asset='+coinjs.asset.slug+network_slug+'&decode='+coinbinf.verifyScript.val());
				var verifyScript = coinbinf.verifyScript.val();
				$("#verify input.verifyLink").val(wally_fn.host+'#verify?asset='+coinjs.asset.slug+network_slug+'&decode='+verifyScript).trigger('change');
				//console.log(wally_fn.host+'#verify?asset='+coinjs.asset.slug+network_slug+'&decode='+verifyScript);
				
				//Router.navigate('verify?asset='+coinjs.asset.slug+network_slug+'&decode='+verifyScript);
				
				/*
				window.location.hash = "#verify";
				history.pushState({}, null, $("#verify input.verifyLink").val());
				*/
				console.log('add share link');
			} else
				console.log('dont add share link');

		} catch (e) {
			console.log('verifyBtn: ', e);
		}

	});

	function decodeRedeemScript(){
		console.log('===coinjs.decodeRedeemScript===');
		
		var script = coinjs.script();
		var decode = script.decodeRedeemScript(coinbinf.verifyScript.val());
		if(decode){
			var decodeSuccess = false;

			$("#verifyRsDataMultisig").addClass('hidden');
			$("#verifyRsDataHodl").addClass('hidden');
			$("#verifyRsDataSegWit").addClass('hidden');
			$("#verifyRsData").addClass("hidden");


			if(decode.type == "multisig__") {
				$("#verifyRsDataMultisig .multisigAddress").val(decode['address']);
				$("#verifyRsDataMultisig .signaturesRequired").html(decode['signaturesRequired']);
				$("#verifyRsDataMultisig table tbody").html("");
				for(var i=0;i<decode.pubkeys.length;i++){
					var pubkey = decode.pubkeys[i];
					var address = coinjs.pubkey2address(pubkey);
					$('<tr><td width="30%"><input type="text" class="form-control" value="'+address+'" readonly></td><td><input type="text" class="form-control" value="'+pubkey+'" readonly></td></tr>').appendTo("#verifyRsDataMultisig table tbody");
				}
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataMultisig").removeClass('hidden');
				decodeSuccess = true;
			} else if(decode.type == "segwit__"){
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataSegWit .segWitAddress").val(decode['address']);
				$("#verifyRsDataSegWit").removeClass('hidden');
				decodeSuccess = true;
			} else if(decode.type == "hodl__") {
				var d = $("#verifyRsDataHodl .date").data("DateTimePicker");
				$("#verifyRsDataHodl .address").val(decode['address']);
				$("#verifyRsDataHodl .pubkey").val(coinjs.pubkey2address(decode['pubkey']));
				$("#verifyRsDataHodl .date").val(decode['checklocktimeverify'] >= 500000000? moment.unix(decode['checklocktimeverify']).format("MM/DD/YYYY HH:mm") : decode['checklocktimeverify']);
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataHodl").removeClass('hidden');
				decodeSuccess = true;
			}

			return decodeSuccess;
		}
		return false;
	}

	function decodeTransactionScript(){
		console.log('===coinjs.decodeTransactionScript===');
		var tx = coinjs.transaction();
		console.log('tx: ', tx);
		/*
		var regex = /^[0-9a-fA-F]{64}$/ig;
var tx = '1200900900002000001100000000990000000900000000000000000000000001';
    console.log('testar: ',  regex.test(tx));
		*/
		try {
			var decode = tx.deserialize(coinbinf.verifyScript.val());
			console.log('decode: ', decode);
			if (!decode)
				return false;
			//if the transaction has no inputs: this is not a transaction!
			if (!decode.ins.length)	//iceeee add back
				throw false;

			$("#verifyTransactionData .transactionVersion").html(decode['version']);
			
			if (decode['nTime']){
				$("#verifyTransactionData .txtime").removeClass("hidden");
				$("#verifyTransactionData .transactionTime").html(new Date(decode['nTime']*1000).toUTCString() + '<small> (<b>Unix timestamp:</b> '+ decode['nTime']+')</small>');
			}else {
				if (!$("#verifyTransactionData .txtime").hasClass("hidden"))
					$("#verifyTransactionData .txtime").addClass("hidden");
			}

			$("#verifyTransactionData .transactionSize").html(decode.size()+' <i>bytes</i>');
			//$("#verifyTransactionData .transactionLockTime").html(decode['lock_time']);
			$("#verifyTransactionData .transactionLockTime").html((decode['lock_time'] >= 500000000)? (new Date(decode['lock_time']*1000).toUTCString()) : ('<span class="text-muted">Block height '+decode['lock_time']+'</span>') );

			if (decode['unit']){
				$("#verifyTransactionData .txunit").removeClass("hidden");
				$("#verifyTransactionData .transactionUnit").html(String.fromCharCode(decode['nUnit']));
			} else  {
				if (!$("#verifyTransactionData .txunit").hasClass("hidden"))
					$("#verifyTransactionData .txunit").addClass("hidden");
			}

			$("#verifyTransactionData .transactionRBF").hide();
			$("#verifyTransactionData .transactionSegWit").hide();
			if (decode.witness.length>=1) {
				$("#verifyTransactionData .transactionSegWit").show();
			}
			
			$("#verifyTransactionData tbody").html("");

			//add lock time information to the user
			if(decode['lock_time'] != 0)
				$("#verifyTransactionData .transactionLockTime").html($("#verifyTransactionData .transactionLockTime").html() + '<br><div class="alert alert-danger">This is a Time Locked Address, unlock the funds after this Date/Block.</div>' );

			var h = '';
			$.each(decode.ins, function(i,o){
				console.log('decode.ins: ', decode.ins);
				var s = decode.extractScriptKey(i);
				console.log('s: ', s);
				h += '<tr>';
				h += '<td><input class="form-control" type="text" value="'+o.outpoint.hash+'" readonly></td>';
				h += '<td class="col-1">'+o.outpoint.index+'</td>';
				h += '<td class="col-2"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
				h += '<td class="col-1"> <span class="bi bi-'+((s.signed=='true' || (decode.witness[i] && decode.witness[i].length==2))?'check':'x')+'-circle-fill"></span>';
				if(s['type']=='multisig' && s['signatures']>=1){
					h += ' '+s['signatures'];
				}
				h += '</td>';
				h += '<td class="col-1">';
				if(s['type']=='multisig'){
					var script = coinjs.script();
					var rs = script.decodeRedeemScript(s.script);
					h += rs['signaturesRequired']+' of '+rs['pubkeys'].length;
				} else {
					h += '<i class="bi bi-x-circle-fill"></i>';
				}
				h += '</td>';
				h += '</tr>';

				//debug
				if(parseInt(o.sequence)<(0xFFFFFFFF-1)){
					$("#verifyTransactionData .transactionRBF").show();
				}
			});

			$(h).appendTo("#verifyTransactionData .ins tbody");

			h = '';
			$.each(decode.outs, function(i,o){

				if(o.script.chunks.length==2 && o.script.chunks[0]==106){ // OP_RETURN

					var data = Crypto.util.bytesToHex(o.script.chunks[1]);
					var dataascii = hex2ascii(data);
					console.log('dataascii: ', dataascii);

					if(dataascii.match(/^[\s\d\w]+$/ig)){
						data = dataascii;
					}

					h += '<tr>';
					h += '<td><input type="text" class="form-control" value="(OP_RETURN) '+data+'" readonly></td>';
					h += '<td class="col-5"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
					h += '<td class="col-1">'+(o.value/("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces)+'</td>';
					h += '</tr>';
				} else {

					var addr = '';
					if(o.script.chunks.length==5){
						addr = coinjs.scripthash2address(Crypto.util.bytesToHex(o.script.chunks[2]));
					} else if((o.script.chunks.length==2) && o.script.chunks[0]==0){
						addr = coinjs.bech32_encode(coinjs.bech32.hrp, [coinjs.bech32.version].concat(coinjs.bech32_convert(o.script.chunks[1], 8, 5, true)));
					} else {
						var pub = coinjs.pub;
						coinjs.pub = coinjs.multisig;
						addr = coinjs.scripthash2address(Crypto.util.bytesToHex(o.script.chunks[1]));
						coinjs.pub = pub;
					}

					h += '<tr>';
					h += '<td><input class="form-control" type="text" value="'+addr+'" readonly></td>';
					h += '<td class="col-5"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
					h += '<td class="col-1">'+(o.value/("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces)+'</td>';
					h += '</tr>';
				}
			});

			$("#verifyTransactionData").removeClass("hidden");


			$(h).appendTo("#verifyTransactionData .outs tbody");

			console.log('return decodeTransactionScript');
			return true;
		} catch(e) {
			console.log('decodeTransactionScript: ', e);
			return false;
		}
	}

	$("#verifyTransactionData .verifyToSign").on( "click", function() {
		$("#signTransaction").val( $('#verifyScript').val() ).fadeOut().fadeIn();
		$('#signedData').addClass('hidden');
		window.location.hash = "#sign";
	});

	$("#verifyTransactionData .verifyToBroadcast, #signCreateOptions .broadcastSignedData").on( "click", function() {
		if ($(this).hasClass('broadcastSignedData'))
			$("#broadcast #rawTransaction").val( $('#signedData textarea').val() ).fadeOut().fadeIn();
		else
			$("#broadcast #rawTransaction").val( $('#verifyScript').val() ).fadeOut().fadeIn();
		
		window.location.hash = "#broadcast";
	});


	function hex2ascii(hex) {
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	}

	function decodePrivKey(){
		console.log('===coinjs.decodePrivKey===');

		try {
			var privkey = coinbinf.verifyScript.val();

			// Remove "0x" prefix from privkey if present
			if (privkey.startsWith("0x"))
			    privkey = privkey.slice(2);

			//try to decode WIF key
			if(privkey.length==51 || privkey.length==52){
				var w2address = coinjs.wif2address(privkey);
				var w2pubkey = coinjs.wif2pubkey(privkey);
				var w2privkey = coinjs.wif2privkey(privkey);
				var w2pubkeyhash = coinjs.address2ripemd160(w2address['address']);
				

				var privkeyHex = (w2privkey['privkey']).replace(/^0+/, '');	//remove leading zeros
				privkeyHex = (privkeyHex.toString()).padStart(64, '0');


				console.log('w2pubkeyhash: ',w2pubkeyhash);

				$("#verifyPrivKey .address").val(w2address['address']);
				$("#verifyPrivKey .pubkey").val(w2pubkey['pubkey']);
				$("#verifyPrivKey .pubkeyHash").val(w2pubkeyhash);
				$("#verifyPrivKey .privkey").val(privkeyHex);
				
				

				var isCompressed = w2address['compressed']?'true':'false';
				$("#verifyPrivKey .iscompressed").text(isCompressed);

				$("#verifyPrivKey .privkey_format").text( isCompressed == 'true' ? 'Compressed' : 'Uncompressed');
				

				$("#verifyPrivKey").removeClass("hidden");
				return true;
			}

			//wif decoding didnt work
			//try to decode private key, either in HEX-format or Decimal-format


			var hexDecoded = wally_fn.hexPrivKeyDecode(privkey.toLowerCase(), {'supports_address': coinjs.asset.supports_address, 'show_error': false});
			console.log('hexDecoded: ', hexDecoded);
			if (!hexDecoded)
				return ;

			//for single based coins/assets, like ETH etc..
			if ( (coinjs.asset.supports_address).includes('single')) {
				$("#verifyPrivHexKey .singleAddress").removeClass('hidden');
				
			} else {
				$("#verifyPrivHexKey .singleAddress").addClass('hidden');
				$("#verifyPrivHexKey .singleAddress input").val('');
			}

			//for BTC and UTXO based coins/assets
			if ( (coinjs.asset.supports_address).includes('uncompressed')) {
				$("#verifyPrivHexKey .uncompressed").removeClass('hidden');
				$("#verifyPrivHexKey .uncompressed .address").val(hexDecoded.wif.uncompressed.address);
				$("#verifyPrivHexKey .uncompressed .pubkey").val(hexDecoded.wif.uncompressed.public_key);
				$("#verifyPrivHexKey .uncompressed .pubkeyHash").val(hexDecoded.wif.uncompressed.public_key_hash);
				$("#verifyPrivHexKey .uncompressed .privkey").val(hexDecoded.wif.uncompressed.key);
			} else {
				$("#verifyPrivHexKey .uncompressed").addClass('hidden');
				$("#verifyPrivHexKey .uncompressed input").val('');
			}


			//for BTC and UTXO based coins/assets
			if ( (coinjs.asset.supports_address).includes('compressed')) {
				$("#verifyPrivHexKey .compressed").removeClass('hidden');
				//if(hexDecoded.wif.compressed.segwit)
				if ( (coinjs.asset.supports_address).includes('segwit')) {
					$("#verifyPrivHexKey .compressed .addressCSegwit").val(hexDecoded.wif.compressed.segwit.address).parent().removeClass('hidden');
					$("#verifyPrivHexKey .compressed .CSegwitRedeemscript").val(hexDecoded.wif.compressed.segwit.redeemscript).parent().removeClass('hidden');
				} else {
					$("#verifyPrivHexKey .compressed .addressCSegwit").val('').parent().addClass('hidden');
					$("#verifyPrivHexKey .compressed .CSegwitRedeemscript").val('').parent().addClass('hidden');
				}


				if ( (coinjs.asset.supports_address).includes('bech32')) {
					$("#verifyPrivHexKey .compressed .addressCBech32").val(hexDecoded.wif.compressed.bech32.address).parent().removeClass('hidden');
					$("#verifyPrivHexKey .compressed .CBech32Redeemscript").val(hexDecoded.wif.compressed.bech32.redeemscript).parent().removeClass('hidden');
				} else {
					$("#verifyPrivHexKey .compressed .addressCBech32").val('').parent().addClass('hidden');
					$("#verifyPrivHexKey .compressed .CBech32Redeemscript").val('').parent().addClass('hidden');
				}

				
				
				$("#verifyPrivHexKey .compressed .address").val(hexDecoded.wif.compressed.address);
				$("#verifyPrivHexKey .compressed .pubkey").val(hexDecoded.wif.compressed.public_key);
				$("#verifyPrivHexKey .compressed .pubkeyHash").val(hexDecoded.wif.compressed.public_key_hash);
				$("#verifyPrivHexKey .compressed .privkey").val(hexDecoded.wif.compressed.key);
			} else {
				$("#verifyPrivHexKey .compressed").addClass('hidden');
				$("#verifyPrivHexKey .compressed input").val('');
			}

			
			$("#verifyPrivHexKey .misc .privkeyHex").val(hexDecoded.hex_key);
			$("#verifyPrivHexKey .misc .privkeyDecimal").val(hexDecoded.decimal_key);

			$("#verifyPrivHexKey").removeClass("hidden");

			return true;
		} catch (e) {
			console.log('coinbin.decodePrivKey error: ', e);
		}
		return false;
	}

	function decodePubKey(){
		console.log('===coinjs.decodePubKey===')
		var pubkey = coinbinf.verifyScript.val();
		
		// Remove "0x" prefix from pubkey if present
		if (pubkey.startsWith("0x"))
		    pubkey = pubkey.slice(2);

		if(pubkey.length==66 || pubkey.length==130){
			try {
				console.log('correct format!')
				$("#verifyPubKey .verifyDataSw").addClass('hidden');
				$("#verifyPubKey .address").val(coinjs.pubkey2address(pubkey));
				if(pubkey.length == 66){


					//check if other address types is supported!
					if ( (coinjs.asset.supports_address).includes('segwit')) {
						console.log('segwit support');
						var sw = coinjs.segwitAddress(pubkey);
						$("#verifyPubKey .addressSegWit").val(sw.address);
						$("#verifyPubKey .addressSegWitRedeemScript").val(sw.redeemscript);
						$("#verifyPubKey .verifyDataSw").removeClass('hidden');
					}


					if ( (coinjs.asset.supports_address).includes('bech32')) {
						console.log('bech32 support');
						var b32 = coinjs.bech32Address(pubkey);
						$("#verifyPubKey .addressBech32").val(b32.address);
						$("#verifyPubKey .addressBech32RedeemScript").val(b32.redeemscript);
						$("#verifyPubKey .verifyDataBech32").removeClass('hidden');
					}

				}
				$("#verifyPubKey").removeClass("hidden");

				return true;
			} catch (e) {
				console.log('decodePubKey error: ', e);
				return false;
			}
		} else {
			return false;
		}
	}

	function decodeHDaddress(){
		
		console.log('===coinjs.decodeHDaddress===');
		
		try {
			coinjs.compressed = true;
			var s = coinbinf.verifyScript.val().trim();
			var hex = Crypto.util.bytesToHex(coinjs.base58decode(s).slice(0, 4));
			console.log('hex: ', hex);
			var hd_type;
			var derive_success = false;
			var is_privkey = false;

			function checkAndProcessHDKey(prv, pub, type) {
			    const hex_cmp_prv = Crypto.util.bytesToHex(coinjs.numToBytes(prv, 4).reverse());
			    const hex_cmp_pub = Crypto.util.bytesToHex(coinjs.numToBytes(pub, 4).reverse());

			    console.log(`type ${type}  hex_cmp_prv:  ${hex_cmp_prv}`);
			    console.log(`type ${type}  hex_cmp_prv:  ${hex_cmp_pub}`);
			    
			    if (hex == hex_cmp_prv || hex == hex_cmp_pub) {

				    var hd = coinjs.hd(s);
				    console.log(`checkAndProcessHDKey xPrv ${type}`);
				    console.log('checkAndProcessHDKey hd: ', hd);

				    if (hd.type === "private") {
				    	is_privkey = true;
				    }

				    $("#verifyHDaddress .hdKey").html(s);
				    $("#verifyHDaddress .chain_code").val(Crypto.util.bytesToHex(hd.chain_code));
				    $("#verifyHDaddress .depth").val(hd.depth);
				    $("#verifyHDaddress .version").val(`0x${hd.version.toString(16)}`);
				    $("#verifyHDaddress .child_index").val(hd.child_index);
				    //$("#verifyHDaddress .hdwifkey").val(hd.keys.wif || '');
				    $("#verifyHDaddress .hdhexkey").val(hd.keys.privkey || '');
				    $("#verifyHDaddress .hdpubkey").val(hd.keys.pubkey || '');
				    $("#verifyHDaddress .hdaddress").val(hd.keys.hdaddress || '');

				    $("#verifyHDaddress .key_type").text(`${hd.depth === 0 && hd.child_index === 0 ? 'Master' : 'Derived'} ${hd.type}` + `, Protocol:` + `${hd.bip}`.toUpperCase() );
				    $("#verifyHDaddress .parent_fingerprint").val(Crypto.util.bytesToHex(hd.parent_fingerprint));
				    $("#verifyHDaddress .derived_data table tbody").html("");
				    

				    deriveHDaddress(hd, type);

				    $("#verifyHDaddress").removeClass("hidden");

				    //console.log(`verifyHDaddress checkAndProcessHDKey: BIP type: ${type}`);
		        derive_success = true;
		        return true;
			    }

			    return false;
			}

			//check and process BIP derivations
			if (
			    checkAndProcessHDKey(coinjs.hdkey.prv, coinjs.hdkey.pub, 'hdkey') ||
			    checkAndProcessHDKey(coinjs.bip49?.prv, coinjs.bip49?.pub, 'bip49') ||
			    checkAndProcessHDKey(coinjs.bip84?.prv, coinjs.bip84?.pub, 'bip84')
			) {
				if (is_privkey)
			    	$('#verifyHDaddress .verifyLinkGroup').addClass('hidden');
			    else
			    	$('#verifyHDaddress .verifyLinkGroup').removeClass('hidden');

			} else {
				$('#verifyHDaddress .verifyLinkGroup').removeClass('hidden');
			    console.log('No matching BIP key type found.');
			}


			// type now contains the BIP type if a match was found
			return derive_success;


		} catch (e) {
			console.log('===coinjs.decodeHDaddress=== ERROR:', e);
			return false;
		}
	}


	function deriveHDaddress(decoded, bip_protocol = 'bip32') {
		try {
		console.log('===coinjs.deriveHDaddress===');
		console.log('===coinjs.deriveHDaddress=== bip_protocol: ' + bip_protocol);

		
		const bip32_custom_master_keys = $('#bip32-custom-keys');
		const bip_electrum_prv = $('#bip32-custom-key-electrum-prv');
		const bip_electrum_pub = $('#bip32-custom-key-electrum-pub');

		//var hd = coinjs.hd($("#verifyHDaddress .hdKey").text());
		var hd = decoded;
		//console.log('hdKey: ', hd);
		var index_start = $("#bipDerivationIndexStart").val();
		if ((index_start.length > 1) && (index_start[index_start.length - 1] == '\'')) {
			var use_private_index = '\'';
			index_start = index_start.replace(/[']/, "") * 1;
		} else {
			var use_private_index = '';
			index_start = index_start.replace(/[']/, "") * 1;
		}
		var index_end = $("#bipDerivationIndexEnd").val().replace(/[']/, "") * 1;
		$("#bipDerivationIndexEnd").val(index_end + use_private_index);
		var html = '';
		$("#verifyHDaddress .derived_data table tbody").html("");

		if (coinbinf.bip32Client.find('option:selected').text() === 'Electrum' || coinbinf.bipMnemonicClientProtocol.is(':checked')) {
			
		}else
			coinbinf.bipAddressSemantics = '';
		

		var d_prvkey ='';
		var d_pubkey ='';
		var d_addr = '';

		//console.log(`index_start: ${index_end}, index_end: ${index_end}`)
		for(var i=index_start;i<=index_end;i++){
			//if($("#hdpathtype option:selected").val()=='simple'){
				//var derived = hd.derive(i);
			//} else {
				var bip_path = coinbinf.bippath.val();
				bip_path = bip_path.replace("h", "'");
				bip_path = bip_path.replace("H", "'");
				coinbinf.bippath.val(bip_path);

				var derivation_path = (bip_path.replace(/\/+$/, ""));
				var derivation_path_protocol = wally_fn.extractBIPProtocol(derivation_path);

				
				/*console.log('===coinjs.deriveHDaddress=== extraced BIP: ' + bip_protocol);
				console.log('===coinjs.deriveHDaddress=== derivation_path: ' + derivation_path_protocol);
				console.log('===coinjs.deriveHDaddress=== derivation_path electrum: ' + derivation_path+'/'+i+use_private_index);
				console.log('===coinjs.deriveHDaddress=== derivation_path derivation_path: ' + derivation_path);
				*/
				
				//if (derivation_path == 44)
					//bip_protocol = 'bip44';
				
				

				var derived = hd.derive_path(derivation_path+'/'+i+use_private_index, bip_protocol, derivation_path_protocol, coinbinf.bipAddressSemantics);
				
				//console.log('===coinjs.deriveHDaddress=== derived: ', derived)
				//check if electrum master key should be generated
				//do it only once!	
				if (coinbinf.bip32Client.find('option:selected').text() === 'Electrum') {
					if (i == index_start) {
						
						var derived_electrum = hd.derive_electrum_path(derivation_path+'/'+i+use_private_index, bip_protocol, derivation_path_protocol, coinbinf.bipAddressSemantics);
						//console.log('verifyHDaddress Electrum Key derived_electrum: '+i+':', derived_electrum);

						bip_electrum_prv.val(derived_electrum.keys_extended.privkey);
						bip_electrum_pub.val(derived_electrum.keys_extended.pubkey);
						bip32_custom_master_keys.removeClass('hidden');
					}
				} else {
					bip32_custom_master_keys.addClass('hidden');
				} 

				if (coinjs.asset.chainModel == 'utxo'){
					//console.log('utxo model');
					d_prvkey = (derived.keys.wif)?derived.keys.wif:'';
					d_pubkey = (derived.keys.pubkey)?derived.keys.pubkey:'';
					d_addr = derived.keys.address;
				} else if (coinjs.asset.chainModel == 'account') {
					console.log('account model');
					//d_prvkey = (derived.keys.privkey)? '0x'+derived.keys.privkey : '';
					d_pubkey = (derived.keys.pubkey)? '0x'+derived.keys.pubkey : '';
					evm_account = wweb3.eth.accounts.privateKeyToAccount(derived.keys.privkey);

					d_addr = evm_account.address;
          d_prvkey = evm_account.privateKey;
          console.log('d_addr: ', d_addr);
          if (!d_addr)
          	throw('Error Deriving '+coinjs.asset.name+' address')
				}
				

				//get the Electrum Master Key
				//if(i == index_start ) {
					//console.log('verifyHDaddress Electrum Key '+i+': ', derived);
					//console.log('verifyHDaddress Electrum Key '+i+':', derived.bip_electrum);
					
				//}
			//}
			//console.log('derived: ', derived);
			html += '<tr>';
			html += '<td>'+i+'</td>';

			html += '<td>';
			if (coinjs.asset.chainModel == 'utxo'){
				if (derived.keys.address.redeemscript === undefined)	//check if redeemscript is present
					html += '<input type="text" class="form-control" value="'+d_addr+'" readonly>';
				else {
					html += '<input type="text" class="form-control" value="'+d_addr.address+'" readonly>';
					html += '<br><input type="text" class="form-control" value="'+d_addr.redeemscript+'" readonly>';
				}
			} else if (coinjs.asset.chainModel == 'account') {
				html += '<input type="text" class="form-control" value="'+d_addr+'" readonly>';
			}

			html += '</td>';

			html += '<td><input type="text" class="form-control" value="'+d_pubkey+'" readonly></td>';
			
			

			html += '<td><input type="text" class="form-control" value="'+d_prvkey+'" readonly></td>';
			
			//html += '<td><input type="text" class="form-control" value="'+derived.keys_extended.pubkey+'" readonly></td>';
			//html += '<td><input type="text" class="form-control" value="'+((derived.keys_extended.privkey)?derived.keys_extended.privkey:'')+'" readonly></td>';
			html += '</tr>';
			
		}
		$(html).appendTo("#verifyHDaddress .derived_data table tbody");

		} catch(err) {
			console.log('===coinjs.deriveHDaddress=== error:', err);
		}
	}

	/* sign code */

	$("#signBtn").click(function(){
		var wifkey = $("#signPrivateKey");
		var script = $("#signTransaction");

		if(coinjs.addressDecode(wifkey.val())){
			$(wifkey).parent().removeClass('has-error');
		} else {
			$(wifkey).parent().addClass('has-error');
		}

		if((script.val()).match(/^[a-f0-9]+$/ig)){
			$(script).parent().removeClass('has-error');
		} else {
			$(script).parent().addClass('has-error');
		}

		if($("#sign .has-error").length==0){
			$("#signedDataError").addClass('hidden');
			try {

				console.log('try to sign!');
				
				var tx = coinjs.transaction();
				//var t = tx.deserialize(script.val());
				var t;
				
/*
				//if POSv coin
				var scriptPOSv_rawtx, scriptPOSv_timestamp, script_rawtx = script.val();

				if(coinjs.asset.slug == 'potcoin'){
					scriptPOSv_rawtx = script_rawtx;
					
					console.log('scriptPOSv_rawtx.length before: ', scriptPOSv_rawtx.length);

					scriptPOSv_timestamp = scriptPOSv_rawtx.slice(-8);	//get the timestamp
					scriptPOSv_rawtx = scriptPOSv_rawtx.slice(0, -8) + '01000000';	//for POSv coins, remove timestamp, needs to be done before signing

					t = tx.adeserialize(scriptPOSv_rawtx);

				}else {
					t = tx.deserialize(script_rawtx);
				}
				*/
				t = tx.deserialize(script.val());

				console.log('tx.deserialize: ', t);

				var signed = t.sign(wifkey.val(), $("#sighashType option:selected").val(), script.val());	// script.val() -> rawtx

				console.log('signed: ', signed);

				//time, PoS coins, add extra timefield to TX
				if(coinjs.asset.slug == 'potcoin'){
					//signed = scriptPOSv_rawtx.slice(0, -8) + scriptPOSv_timestamp;	//for POSv coins
				}

				


				$("#signedData textarea").val(signed);
				$("#signedData .txSize").html(t.size());
				$("#signedData").removeClass('hidden').fadeIn();
			} catch(e) {
				 console.log(e);
			}
		} else {
			$("#signedDataError").removeClass('hidden');
			$("#signedData").addClass('hidden');
		}
	});

	$("#sighashType").change(function(){
		$("#sighashTypeInfo").html($("option:selected",this).attr('rel')).fadeOut().fadeIn();
	});

	$("#signAdvancedCollapse").click(function(){
		if($("#signAdvanced").hasClass('hidden')){
			$("span",this).removeClass('glyphicon-collapse-down').addClass('glyphicon-collapse-up');
			$("#signAdvanced").removeClass("hidden");
		} else {
			$("span",this).removeClass('glyphicon-collapse-up').addClass('glyphicon-collapse-down');
			$("#signAdvanced").addClass("hidden");
		}
	});


	/*
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		if(e.target.hash == "#fees"){
			feeStats();
		}
	});
	*/

	$(".qrcodeBtn").click(function(){
		$("#qrcode").html("");
		var thisbtn = $(this).parent().parent();
		var qrstr = false;
		var ta = $("textarea",thisbtn);

		if(ta.length>0){
			var w = (screen.availWidth > screen.availHeight ? screen.availWidth : screen.availHeight)/3;
			var qrcode = new QRCode("qrcode", {width:w, height:w});
			qrstr = $(ta).val();
			if(qrstr.length > 1024){
				$("#qrcode").html("<p>Sorry the data is too long for the QR generator.</p>");
			}
		} else {
			var qrcode = new QRCode("qrcode");
			qrstr = "bitcoin:"+$('.address',thisbtn).val();
		}

		if(qrstr){
			qrcode.makeCode(qrstr);
		}
	});




/*
	$('a[data-toggle="popover"], button[data-toggle="popover"]').popover({
    	
  	})

  	@ set Popover to DOM-target function
  	*/
  	
  	
  	//$('a[data-toggle="popover"][data-target], button[data-toggle="popover"][data-target], div[data-toggle="popover"][data-target], span[data-toggle="popover"][data-target]').each(function (i, e) {
  	$('a[data-toggle="popover"], button[data-toggle="popover"], div[data-toggle="popover"], span[data-toggle="popover"]').each(function (i, e) {
    	

	  	//console.log('index: ', i);
	  	//console.log('el: ', e);
	    var data = $(e).data(), pooppis;

	    //if target is set, clone the original element to popover
	    if (data.target) {
	    	console.log('popover has target!');
    		//console.log('target found!'+ data.target);
    		var targetEl = $(data.target);

	        //var contentHtml = targetEl.html();

	        //var contentTitle, contentFooter;
	        //var contentBody = $(data.target + ' .popover-body').html();

	        //this is for generating passwords on popover so we can bind the generated value to the password-input field of the page!
	        var inputFor = $(e).attr( "data-input-for");
    			//console.log('inputFor: '+ inputFor);
    		if(inputFor !== undefined && (inputFor.charAt(0) == '#'))
    			inputFor = inputFor.substring(1);

    		console.log('$(data.target ): ', $(data.target ));
    		$(data.target ).find('.pwdGenerate').attr('data-input-for', inputFor);

	        //console.log('contentBody: ', $(data.target ).find('#pwdGenerate').attr('data-input-for', inputFor));
	        //console.log('contentBody data-input-for: ', $(data.target + ' #pwdGenerate').attr('data-input-for'));

	        var contentBody = $(data.target + ' .popover-body').clone();	//https://stackoverflow.com/questions/23391444/how-to-keep-content-of-bootstrap-popover-after-hiding-it-or-how-to-really-hide


	        console.log('contentBody: ', contentBody);
	        /*
	        //this is for generating passwords on popover so we can bind the generated value to the password-input field of the page!
	        var inputFor = $(e).attr( "data-input-for");

	        contentBody = $(data.target + ' .popover-body').find('#pwdGenerate').attr('data-input-for', inputFor);
	        contentBody = $(data.target + ' .popover-body').html();
	        
	        console.log('contentBody: ', contentBody);
	        console.log('contentBody data-input-for: ', $(data.target + ' .popover-body #pwdGenerate').attr('data-input-for'));

/*
 jBox


new jBox('Tooltip', {
    attach: '.brainWalletPwdGenerator',
    width: 280,
    trigger: 'click',
    class: 'popover',
    closeOnClick: 'body',
    //closeOnMouseleave: true,
    animation: 'zoomIn',
    content: $('#popPasswordSettings').html(),
    onOpen: function () {
      //this.source.addClass('active').html('Now scroll');
    },
    onClose: function () {
      //this.source.removeClass('active').html('Click me');
    }
  });
  
	        */
	        

	        if ( $(data.target + ' .popover-title').length > 0 )
	        	var contentTitle = $(data.target + ' .popover-title').html();

	        if ( $(data.target + ' .popover-footer').length > 0 )
	        	var contentFooter = $(data.target + ' .popover-footer').html();

	        
	        //console.log('data.footer: ', contentFooter);

	  	    pooppis = $(e).popover( {
		    	title: contentTitle,
		    	//content: contentBody,
		    	content: function () {
			        return contentBody;
			        //var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
			        //return clone;
			        //popPasswordSettingsContainer
			    },
		    	footer: contentFooter,
		    	html: true,
	  			delay: { "show": 100, "hide": 200 },
	  			//customClass: 'animate__animated animate__slideInDown',
		    });
	  	    //console.log('popover poppis1: ', pooppis);

	  	    //var open = $(e).attr('data-easein');
	  	    //pooppis.velocity('transition.' + open);

	  	  
		    //var open = $(e).attr('data-easein');
		    //console.log('open: ' + open);
		    //targetEl.velocity('transition.' + open);


		    
	    } else {	//else show a regular popover
	    	console.log('popover has no target!');
	    	/*
	    	pooppis = $(e).popover( {
		    	html: true,
	  			delay: { "show": 100, "hide": 200 },
	  			customClass: '',
	  			//customClass: 'animate__animated animate__slideInDown',
		    });
		    */
		    
	  	    //console.log('popover poppis2: ', pooppis);
	    }
	  })
  	.on('show.bs.popover', function (e) {
    	//	$("body").append("<div class='modal-backdrop fade show'></div>")

	//}).on('hide.bs.popover', function (e) {
	}).on('hidden.bs.popover', function (e) {
		console.log('e: ', e)
		//$("#popPasswordSettingsContainer").append($("#popPasswordSettings"));
    	//$(".modal-backdrop").remove();
	});
  	/*
	  $('button[data-toggle="popover"], a[data-toggle="popover"], div[data-toggle="popover"], span[data-toggle="popover"]').popover({
  		html: true,
  		delay: { "show": 100, "hide": 500 },
  		customClass: '',
  	});
  	*/

	  

	  //dismiss popover, close button
	  $('body').on('click', '.popover > .popover-header [data-dismiss="popover"], .popover > .popover-header .close', function(e){
  		console.log('popover toggle');	
  		$(this).parent().parent().popover('hide');
  	});

	 /*
// close previously opened popovers by clicking outside them
  $(document).on('click', function(e) {
    $('input').each(function() {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide');
      }
    });
  });
	 */

	//tooltip & jBox tooltip
	//$('input[title!=""], abbr[title!=""]').tooltip({'placement':'bottom', delay: { "show": 100, "hide": 300 }});
	//$('[title]').tooltip({'placement':'bottom', delay: { "show": 100, "hide": 300 }});

	
	


	//init load #hashpage
	//load browser #hashpage on load
	


	$(".showKey").click(function(){
		var parentNode = $(this).parent().parent();
		var inputField = parentNode.find('input');

		
		if (inputField.attr('type') == 'text') {
		//if ($(this).data("hidden") === false) {
			inputField.attr('type','password');
			//$(this).data("hidden", true);
			$(this).html('<i class="bi bi-eye-fill"></i>');
		} else {
			inputField.attr('type','text');
			//$(this).data("hidden", false);
			$(this).html('<i class="bi bi-eye-slash-fill"></i>');
		}

	});

	



	/* add three pubkeys for multisig address creation*/
	for(var i=1;i<3;i++){
		$("#multisigPubKeys .pubkeyAdd").click();
	}

	validateOutputAmount();

	/* settings page code */

	$("#coinjs_pub").val('0x'+(coinjs.pub).toString(16));
	$("#coinjs_priv").val('0x'+(coinjs.priv).toString(16));
	$("#coinjs_multisig").val('0x'+(coinjs.multisig).toString(16));

	$("#coinjs_hdpub").val('0x'+(coinjs.hdkey.pub).toString(16));
	$("#coinjs_hdprv").val('0x'+(coinjs.hdkey.prv).toString(16));	

	$("#settingsBtn").click(function(){
		//wally_kit.setNetwork(wally_fn.network, $('#coinjs_network').val());
		//wally_kit.setNetwork(wally_fn.network, $('#coinjs_network').val(), {saveSettings: true, showMessage: true});
		console.log('settingsBtn $(#coinjs_network).val(): '+ $('#coinjs_network').val());
		//wally_fn.provider.broadcast = $('#coinjs_broadcast_api ').val();
		wally_fn.provider.broadcast = $('#coinjs_broadcast_api option:selected').text();

		//wally_fn.provider.utxo = $('#coinjs_utxo_api').val();
		wally_fn.provider.utxo = $('#coinjs_utxo_api option:selected').text();
		console.log('settingsBtn wally_fn.asset: '+ wally_fn.asset);


		wally_kit.setNetwork(wally_fn.network, wally_fn.asset, {saveSettings: true, showMessage: true, renderFields: false});
		
		//clear manual transaction data
		coinbinf.clearInputsOnload();
		$("#redeemFromStatus, #redeemFromAddress").addClass('hidden');
		$("#transactionFee").val( parseFloat('0.00000000').toFixed(coinjs.decimalPlaces) );



		return;
	});

	/*
	$("#settingsBtnOld").click(function(){

		// log out of openwallet
		$("#walletLogout").click();

		$("#statusSettings").removeClass("alert-success").removeClass("alert-danger").addClass("hidden").html("");
		$("#settings .has-error").removeClass("has-error");


		$.each($(".coinjssetting"),function(i, o){
			if(!$(o).val().match(/^0x[0-9a-f]+$/)){
				console.log('i: ', i);
				console.log('$(o): ', $(o));
				console.log('$(o).val(): '+ $(o).val());
				$(o).parent().addClass("has-error");
			}
		});
		


		if($("#settings .has-error").length==0){

			coinjs.pub =  $("#coinjs_pub").val()*1;
			coinjs.priv =  $("#coinjs_priv").val()*1;
			coinjs.multisig =  $("#coinjs_multisig").val()*1;

			coinjs.hdkey.pub =  $("#coinjs_hdpub").val()*1;
			coinjs.hdkey.prv =  $("#coinjs_hdprv").val()*1;

			//added for PoS coins
			coinjs.txExtraTimeField = ($("#coinjs_extratimefield").val() == "true");
			if (coinjs.txExtraTimeField) {
				$("#nTime").val(Date.now() / 1000 | 0);
				$("#txTimeOptional").show();
				$("#verifyTransactionData .txtime").show();
				console.log('show extra field!');
			} else {
				$("#txTimeOptional").hide();
				$("#verifyTransactionData .txtime").hide();
			}
			
			coinjs.txExtraUnitField = ($("#coinjs_extraunitfieldvalue").val() !== "false");
			if (coinjs.txExtraUnitField) {
				coinjs.txExtraUnitFieldValue = $("#coinjs_extraunitfieldvalue").val()*1;
				$("#verifyTransactionData .txunit").show();
			} else {
				$("#verifyTransactionData .txunit").hide();
			}
			
			coinjs.decimalPlaces = $("#coinjs_decimalplaces").val()*1;

			coinjs.coinName = $("#coinjs_coinname").val();
			coinjs.symbol = $("#coinjs_symbol").val();
			coinjs.bech32.hrp = $("#coinjs_bech32").val()

			configureBroadcast();
			configureGetUnspentTx();

            if (coinjs.pub == 0x30){   // LTC
                explorer_addr = "https://chain.so/address/LTC/";
                coinjs.bech32.hrp = "ltc";
            }
            else if (coinjs.pub == 0x1e){   // DOGE
                explorer_addr = "https://chain.so/address/DOGE/";
            }

            var selectedNetwork = $("#coinjs_coin option:selected").text();
            console.log('selectedNetwork: ', selectedNetwork);

			$("#statusSettings").addClass("alert-success").removeClass("hidden").html("<span class=\"glyphicon glyphicon-ok\"></span> Network settings updated to: "+selectedNetwork).fadeOut().fadeIn();
		} else {
			$("#statusSettings").addClass("alert-danger").removeClass("hidden").html("There is an error with one or more of your settings");	
		}
	});

	
	$("#coinjs_coin").change(function(){

		var selected_option = $("option:selected",this);
			console.log('selected_option: ', selected_option)
		var o = (selected_option.attr("rel")).split(";");

		// deal with broadcasting settings
		if(o[5]=="false"){
			$("#coinjs_broadcast, #rawTransaction, #rawSubmitBtn, #openBtn").attr('disabled',true);
			$("#coinjs_broadcast").val("coinb.in");			
		} else {
			$("#coinjs_broadcast").val(o[5]);
			$("#coinjs_broadcast, #rawTransaction, #rawSubmitBtn, #openBtn").attr('disabled',false);
		}

		// deal with unspent output settings
		if(o[6]=="false"){
			$("#coinjs_utxo, #redeemFrom, #redeemFromBtn, #openBtn, .qrcodeScanner").attr('disabled',true);			
			$("#redeemFrom").val("Loading of address inputs is currently not available for " + this.options[ this.selectedIndex ].text);
			//$("#coinjs_utxo").val("coinb.in");
		} else {
			$("#coinjs_utxo").val(o[6]);
			$("#redeemFrom").val("");
			$("#coinjs_utxo, #redeemFrom, #redeemFromBtn, #openBtn, .qrcodeScanner").attr('disabled',false);
		}

		// deal with the reset
		$("#coinjs_pub").val(o[0]);
		$("#coinjs_priv").val(o[1]);
		$("#coinjs_multisig").val(o[2]);
		$("#coinjs_hdpub").val(o[3]);
		$("#coinjs_hdprv").val(o[4]);

		// deal with PoS coins
		if(selected_option[0].value == "bitbay_mainnet" ||  selected_option[0].value == "blackcoin_mainnet"){
			$("#coinjs_extratimefield").val("true");
			console.log('show extra field!');
		}else{
			$("#coinjs_extratimefield").val("false");
		}

		// hide/show custom screen
		if($("option:selected",this).val()=="custom"){
			$("#settingsCustom").removeClass("hidden");
		} else {
			$("#settingsCustom").addClass("hidden");
		}
	});
	

	function configureBroadcast(){
		var host = $("#coinjs_broadcast option:selected").val();

        // api:             blockcypher     blockchair      chain.so
        // network name     "btc"           "bitcoin"       "BTC/BTCTEST"
        // network name     "ltc"           "litecoin"      "LTC/LTCTEST"
        // network name     "doge"          "dogecoin"      "DOGE/DOGETEST"

        console.log('configureBroadcast: ', this)
		$("#rawSubmitBtn").unbind("");
		if(host=="chain.so_bitcoinmainnet"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitChainso(this, "BTC");
			});
		} else if(host=="chain.so_litecoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitChainso(this, "LTC");
			});
		} else if(host=="chain.so_dogecoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitChainso(this, "DOGE");
			});
		} else if(host=="blockcypher_bitcoinmainnet"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitblockcypher(this, "btc");
			});
		} else if(host=="blockcypher_litecoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitblockcypher(this, "ltc");
			});
		} else if(host=="blockcypher_dogecoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitblockcypher(this, "doge");
			});
		} else if(host=="blockchair_bitcoinmainnet"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitblockchair(this, "bitcoin");
			});
		} else if(host=="blockchair_litecoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitblockchair(this, "litecoin");
			});
		} else if(host=="blockchair_dogecoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitblockchair(this, "dogecoin");
			});
		} else if(host=='blockstream.info_bitcoin'){
			$("#rawSubmitBtn").click(function(){
				console.log('Blockstream push broadcast');
				rawSubmitBlockstream(this);
			});
		}  else if(host=='chain.so_bitcoin_testnet'){
			$("#rawSubmitBtn").click(function(){
				rawSubmitChainso(this, "BTCTEST");
			});
	    } else if(host=='chain.so_litecoin_testnet'){
			$("#rawSubmitBtn").click(function(){
				rawSubmitChainso(this, "LTCTEST");
			});
		} else if(host=='chain.so_dogecoin_testnet'){
			$("#rawSubmitBtn").click(function(){
				rawSubmitChainso(this, "DOGETEST");
			});
		
		} else if(host=="cryptoid.info_bitbay"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitCryptoid(this, "bay");
			});
		} else if(host=="cryptoid.info_blackcoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitCryptoid(this, "blk");
			});
		} 

		else {
			$("#rawSubmitBtn").click(function(){
				rawSubmitDefault(this); // revert to default
			});
		}
	}
	
	function configureGetUnspentTx(){
		$("#redeemFromBtn").attr('rel',$("#coinjs_utxo option:selected").val());
	}
	*/

	/**/
	//verifyLink
	//$("body").on("change", "#verify input.verifyLink", function(e){
	$("#verify input.verifyLink").on('change', function(e) {
		
		console.log('input.verifyLink changed!', e.target);
		//$("#verify a.verifyLink").attr('href','?asset='+coinjs.asset.slug+'&verify='+coinbinf.verifyScript.val());
		
		var network_slug = '';
		if(coinjs.asset.network != 'mainnet')
			network_slug = '&network='+coinjs.asset.network;

		$("#verify a.verifyLink").attr('href','#verify?asset='+coinjs.asset.slug+network_slug+'&decode='+coinbinf.verifyScript.val());
	});

	// clear results when data changed
	$("#verify #verifyScript").on('input change', function(){
		$("#verify .verifyData").addClass("hidden");
		$("#verify #verifyStatus").addClass("hidden");

	});

	$("#sign #signTransaction, #sign #signPrivateKey").on('input change', function(){
		$("#sign #signedData").addClass("hidden");
	});

	$("#multisigPubKeys").on('input change', '.pubkey', function(){
		$("#multiSigData").addClass("hidden");
	});


	/* fees page code */

	$("#fees .slider").on('input', function(){
		$('.'+$(this).attr('rel')+' .inputno, .'+$(this).attr('rel')+' .outputno',$("#fees")).html($(this).val());
		$('.'+$(this).attr('rel')+' .estimate',$("#fees")).removeClass('hidden');
	});

	$("#fees .txo_p2pkh").on('input', function(){
		var outputno = $('.'+$(this).attr('rel')+' .outputno',$("#fees .txoutputs")).html();
		$('.'+$(this).attr('rel')+' .bytes',$("#fees .txoutputs")).html((outputno*$("#est_txo_p2pkh").val())+(outputno*9));
		mathFees();
	});

	$("#fees .txo_p2sh").on('input', function(){
		var outputno = $('.'+$(this).attr('rel')+' .outputno',$("#fees .txoutputs")).html();
		$('.'+$(this).attr('rel')+' .bytes',$("#fees .txoutputs")).html((outputno*$("#est_txo_p2sh").val())+(outputno*9));
		mathFees();
	});

	$("#fees .txi_regular").on('input', function(){
		var inputno = $('.'+$(this).attr('rel')+' .inputno',$("#fees .txinputs")).html();
		$('.'+$(this).attr('rel')+' .bytes',$("#fees .txinputs")).html((inputno*$("#est_txi_regular").val())+(inputno*41));
		mathFees();
	});

	$("#fees .txi_segwit").on('input', function(){
		var inputno = $('.'+$(this).attr('rel')+' .inputno',$("#fees .txinputs")).html();
		var bytes = 0;
		if(inputno >= 1){
			bytes = 2;
			bytes += (inputno*32);
			bytes += (inputno*$("#est_txi_segwit").val());
			bytes += (inputno*(41))
		}

		bytes = bytes.toFixed(0);
		$('.'+$(this).attr('rel')+' .bytes',$("#fees .txinputs")).html(bytes);
		mathFees();
	});

	$("#fees .txi_multisig").on('input', function(){
		var inputno = $('.'+$(this).attr('rel')+' .inputno',$("#fees .txinputs")).html();
		$('.'+$(this).attr('rel')+' .bytes',$("#fees .txinputs")).html((inputno*$("#est_txi_multisig").val())+(inputno*41));
		mathFees();
	});

	$("#fees .txi_hodl").on('input', function(){
		var inputno = $('.'+$(this).attr('rel')+' .inputno',$("#fees .txinputs")).html();
		$('.'+$(this).attr('rel')+' .bytes',$("#fees .txinputs")).html((inputno*$("#est_txi_hodl").val())+(inputno*41));
		mathFees();
	});

	$("#fees .txi_unknown").on('input', function(){
		var inputno = $('.'+$(this).attr('rel')+' .inputno',$("#fees .txinputs")).html();
		$('.'+$(this).attr('rel')+' .bytes',$("#fees .txinputs")).html((inputno*$("#est_txi_unknown").val())+(inputno*41));
		mathFees();
	});

	$("#fees .sliderbtn.down").click(function(){
		var val = $(".slider",$(this).parent().parent()).val()*1;
		if(val>($(".slider",$(this).parent().parent()).attr('min')*1)){
			$(".slider",$(this).parent().parent()).val(val-1);
			$(".slider",$(this).parent().parent()).trigger('input');
		}
	});

	$("#fees .sliderbtn.up").click(function(){
		var val = $(".slider",$(this).parent().parent()).val()*1;
		if(val<($(".slider",$(this).parent().parent()).attr('max')*1)){
			$(".slider",$(this).parent().parent()).val(val+1);
			$(".slider",$(this).parent().parent()).trigger('input');
		}
	});

	$("#advancedFeesCollapse").click(function(){
		if($("#advancedFees").hasClass('hidden')){
			$("span",this).removeClass('glyphicon-collapse-down').addClass('glyphicon-collapse-up');
			$("#advancedFees").removeClass("hidden");
		} else {
			$("span",this).removeClass('glyphicon-collapse-up').addClass('glyphicon-collapse-down');
			$("#advancedFees").addClass("hidden");
		}
	});

	$("#feesAnalyseBtn").click(function(){
		if(!$("#fees .txhex").val().match(/^[a-f0-9]+$/ig)){
			alert('You must provide a hex encoded transaction');
			return;
		}

		var tx = coinjs.transaction();
		var deserialized = tx.deserialize($("#fees .txhex").val());

		$("#fees .txoutputs .outputno, #fees .txinputs .inputno").html("0");
		$("#fees .txoutputs .bytes, #fees .txinputs .bytes").html("0");
		$("#fees .slider").val(0);

		for(var i = 0; i < deserialized.ins.length; i++){
			var script = deserialized.extractScriptKey(i);
			var size = 41;
			if(script.type == 'segwit'){
				if(deserialized.witness[i]){
					size += deserialized.ins[i].script.buffer.length / 2;
					for(w in deserialized.witness[i]){
						size += (deserialized.witness[i][w].length / 2) /4;
					}
				} else {
					size += $("#est_txi_segwit").val()*1;
				}
				$("#fees .segwit .inputno").html(($("#fees .segwit .inputno").html()*1)+1);
				$("#fees .txi_segwit").val(($("#fees .txi_segwit").val()*1)+1);
				$("#fees .segwit .bytes").html(($("#fees .segwit .bytes").html()*1)+size);
							
			} else if(script.type == 'multisig'){
				var s = coinjs.script();
				var rs = s.decodeRedeemScript(script.script);
				size += 4 + ((script.script.length / 2) + (73 * rs.signaturesRequired));
				$("#fees .multisig .inputno").html(($("#fees .multisig .inputno").html()*1)+1);
				$("#fees .txi_multisig").val(($("#fees .txi_multisig").val()*1)+1);
				$("#fees .multisig .bytes").html(($("#fees .multisig .bytes").html()*1)+size);

			} else if(script.type == 'hodl'){
				size += 78;
				$("#fees .hodl .inputno").html(($("#fees .hodl .inputno").html()*1)+1);
				$("#fees .txi_hodl").val(($("#fees .txi_hodl").val()*1)+1);
				$("#fees .hodl .bytes").html(($("#fees .hodl .bytes").html()*1)+size);

			} else if(script.type == 'empty' || script.type == 'scriptpubkey'){
				if(script.signatures == 1){
					size += script.script.length / 2;
				} else {
					size += $("#est_txi_regular").val()*1;
				}

				$("#fees .regular .inputno").html(($("#fees .regular .inputno").html()*1)+1);
				$("#fees .txi_regular").val(($("#fees .txi_regular").val()*1)+1);
				$("#fees .regular .bytes").html(($("#fees .regular .bytes").html()*1)+size);

			} else if(script.type == 'unknown'){
				size += script.script.length / 2;
				$("#fees .unknown .inputno").html(($("#fees .unknown .inputno").html()*1)+1);
				$("#fees .txi_unknown").val(($("#fees .txi_unknown").val()*1)+1);
				$("#fees .unknown .bytes").html(($("#fees .unknown .bytes").html()*1)+size);
			}
		}

		for(var i = 0; i < deserialized.outs.length; i++){
			if(deserialized.outs[i].script.buffer[0]==118){
				$("#fees .txoutputs .p2pkh .outputno").html(($("#fees .txoutputs .p2pkh .outputno").html()*1)+1);
				$("#fees .txoutputs .p2pkh .bytes").html(($("#fees .txoutputs .p2pkh .bytes").html()*1)+34);
				$("#fees .txo_p2pkh").val(($("#fees .txo_p2pkh").val()*1)+1);
			} else if (deserialized.outs[i].script.buffer[0]==169){
				$("#fees .txoutputs .p2sh .outputno").html(($("#fees .txoutputs .p2sh .outputno").html()*1)+1);
				$("#fees .txoutputs .p2sh .bytes").html(($("#fees .txoutputs .p2sh .bytes").html()*1)+32);
				$("#fees .txo_p2sh").val(($("#fees .txo_p2sh").val()*1)+1);
			} 
		}

		 feeStats();
	});

	$("#feeStatsReload").click(function(){
		feeStats();
	});

	function mathFees(){

		var inputsTotal = 0;
		var inputsBytes = 0;
		$.each($(".inputno"), function(i,o){
			inputsTotal += ($(o).html()*1);
			inputsBytes += ($(".bytes",$(o).parent()).html()*1);
		});
		
		$("#fees .txinputs .txsize").html(inputsBytes.toFixed(0));
		$("#fees .txinputs .txtotal").html(inputsTotal.toFixed(0));

		var outputsTotal = 0;
		var outputsBytes = 0;
		$.each($(".outputno"), function(i,o){
			outputsTotal += ($(o).html()*1);
			outputsBytes += ($(".bytes",$(o).parent()).html()*1);
		});
		
		$("#fees .txoutputs .txsize").html(outputsBytes.toFixed(0));
		$("#fees .txoutputs .txtotal").html(outputsTotal.toFixed(0));

		var totalBytes = 10 + outputsBytes + inputsBytes;
		if((!isNaN($("#fees .feeSatByte:first").html())) && totalBytes > 10){
			//var recommendedFee = ((totalBytes * $(".feeSatByte").text())/100000000).toFixed(8);	//icee remove
			var recommendedFee = ((totalBytes * $(".feeSatByte").text())/("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces);
			
			$(".recommendedFee").html(recommendedFee);
			$(".feeTxSize").html(totalBytes);
		} else {
			$(".recommendedFee").html((0).toFixed(coinjs.decimalPlaces));
			$(".feeTxSize").html(0);
		}
	};

	function feeStats(){
		$("#feeStatsReload").attr('disabled',true);
		$.ajax ({
			type: "GET",
			url: "https://coinb.in/api/?uid=1&key=12345678901234567890123456789012&setmodule=fees&request=stats",
			dataType: "xml",
			error: function(data) {
			},
			success: function(data) {
				$("#fees .recommended .blockHeight").html('<a href="https://coinb.in/height/'+$(data).find("height").text()+'" target="_blank">'+$(data).find("height").text()+'</a>');
				$("#fees .recommended .blockHash").html($(data).find("block").text());
				$("#fees .recommended .blockTime").html($(data).find("timestamp").text());
				$("#fees .recommended .blockDateTime").html(unescape($(data).find("datetime").text()).replace(/\+/g,' '));
				$("#fees .recommended .txId").html('<a href="https://coinb.in/tx/'+$(data).find("txid").text()+'" target="_blank">'+$(data).find("txid").text()+'</a>');
				$("#fees .recommended .txSize").html($(data).find("txsize").text());
				$("#fees .recommended .txFee").html($(data).find("txfee").text());
				$("#fees .feeSatByte").html($(data).find("satbyte").text());

				mathFees();
			},
			complete: function(data, status){
				$("#feeStatsReload").attr('disabled', false);
			}
		});
	}

	/* capture mouse movement to add entropy */
	var IE = document.all?true:false // Boolean, is browser IE?
	if (!IE) document.captureEvents(Event.MOUSEMOVE)
	document.onmousemove = getMouseXY;
	function getMouseXY(e) {
		
		var tempX = 0;
		var tempY = 0;
		if (IE) { // If browser is IE
			tempX = event.clientX + document.body.scrollLeft;
			tempY = event.clientY + document.body.scrollTop;
		} else {
			tempX = e.pageX;
			tempY = e.pageY;
		};

		//console.log(tempX, tempY);
		if (tempX < 0){tempX = 0};
		if (tempY < 0){tempY = 0};
		var xEnt = Crypto.util.bytesToHex([tempX]).slice(-2);
		var yEnt = Crypto.util.bytesToHex([tempY]).slice(-2);
		var addEnt = xEnt.concat(yEnt);

		if ($("#entropybucket").html().indexOf(xEnt) == -1 && $("#entropybucket").html().indexOf(yEnt) == -1) {
			$("#entropybucket").html(addEnt + $("#entropybucket").html());
		};

		if ($("#entropybucket").html().length > 128) {
			$("#entropybucket").html($("#entropybucket").html().slice(0, 128))
		};

		return true;
	};

/*
$(document).ready( function() {
  $(this).on('mousemove touchstart touchmove touchcancel touchend scroll', getMouseXY);
});
*/

/*
 * BIP Derivation Path functions, borrowed from 
 * https://github.com/iancoleman/bip39
 */

//const bip141semantics = $(".bip141-semantics");


const bipTabs = $("#bipDerivationTabs a");
var bipTabSelected = 'bipTab32';


const bipHardenedAddresses = $("#bip-hardened-addresses");
const bip32pathWally = coinbinf.bippath;


const bipTab44coin = $("#bipTab44 .coin");

const bipAccounts = $("#bipDerivationTabContents input.account");
const bipChange = $("#bipDerivationTabContents input.change");


const bipClients = [
    {
        name: "Bitcoin Core",
        onSelect: function() {
            coinbinf.bip32path.val("m/0'/0'");
            bip32pathWally.val("m/0'/0'");
            coinbinf.bipAddressSemantics = ''
            bipHardenedAddresses.prop('checked', true).trigger('change');
        },
    },
    {
        name: "Blockchain.info",
        onSelect: function() {
            coinbinf.bip32path.val("m/44'/0'/0'");
            bip32pathWally.val("m/44'/0'/0'");
            coinbinf.bipAddressSemantics = ''
            bipHardenedAddresses.prop('checked', false).trigger('change');
        },
    },
    {
        name: "MultiBit HD",
        onSelect: function() {
            coinbinf.bip32path.val("m/0'/0");
            bip32pathWally.val("m/0'/0");
            coinbinf.bipAddressSemantics = ''
            bipHardenedAddresses.prop('checked', false).trigger('change');
        },
    },
    {
        name: "Coinomi, Ledger",
        onSelect: function() {
            coinbinf.bip32path.val("m/44'/"+bipTab44coin.val()+"'/0'");
            bip32pathWally.val("m/44'/"+bipTab44coin.val()+"'/0'");
            coinbinf.bipAddressSemantics = ''
            bipHardenedAddresses.prop('checked', false).trigger('change');
        },
    },
    {
        name: "Electrum",
        onSelect: function() {
            coinbinf.bip32path.val("m/0'/0");
            bip32pathWally.val("m/0'/0");
            coinbinf.bipAddressSemantics = 'p2wpkh';
            bipHardenedAddresses.prop('checked', false).trigger('change');
        },
    },
    {
        name: "Coinb.in",
        onSelect: function() {
            coinbinf.bip32path.val("m");
            bip32pathWally.val("m");
            coinbinf.bipAddressSemantics = ''
            bipHardenedAddresses.prop('checked', false).trigger('change');
        },
    },
    {
        name: "Trezor",
        onSelect: function() {
            coinbinf.bip32path.val("m/44'/"+bipTab44coin.val()+"'/0'/0");
            bip32pathWally.val("m/44'/"+bipTab44coin.val()+"'/0'/0");
            coinbinf.bipAddressSemantics = ''
            bipHardenedAddresses.prop('checked', false).trigger('change');
        },
    },
]

//coinbinf.bipAddressSemantics.on("input", calcForDerivationPath);

bipAccounts.on("input", calcForDerivationPath);
bipChange.on("input", calcForDerivationPath);

function calcForDerivationPath() {
	
	isbipHardenedAddresses = bipHardenedAddresses.is(':checked');
	console.log('=calcForDerivationPath=', isbipHardenedAddresses);
	
	const bip_index_start_El = $("#bipDerivationIndexStart");
	const bip_index_end_El = $("#bipDerivationIndexEnd");
	
	var bip_index_start_val= bip_index_start_El.val();
	var bip_index_end_val= bip_index_end_El.val();

	
	
	if (isbipHardenedAddresses) {
		bip_index_start_El.val(bip_index_start_val.replace("'", "")+"'");
		bip_index_end_El.val(bip_index_end_val.replace("'", "")+"'");		
	} else {
		bip_index_start_El.val( parseIntNoNaN(bip_index_start_val.replace("'", "")) );
		bip_index_end_El.val( parseIntNoNaN(bip_index_end_val.replace("'", "")) );

	}
	derivationPath = getDerivationPath();

	//render only if success
	if (derivationPath)
		bipRootKeyChanged();
}

bipHardenedAddresses.on("change", calcForDerivationPath);

coinbinf.bip32Client.on("change", bip32ClientChanged);
function bip32ClientChanged(e) {
    var clientIndex = coinbinf.bip32Client.val();
    if (clientIndex == "custom") {	//hide custom input in bip32 tab
        coinbinf.bip32path.val("m/0").prop("disabled", true).parent().parent().addClass('hidden');
        coinbinf.bippath.fadeOut().fadeIn();
    } else {
        coinbinf.bip32path.prop("disabled", true).parent().parent().removeClass('hidden');
        bipClients[clientIndex].onSelect();
        bipRootKeyChanged();
    }
}


    function segwitSelected() {
        return bip49TabSelected() || bip84TabSelected() || bip141TabSelected();
    }

    function p2wpkhSelected() {
        return bip84TabSelected() ||
                bip141TabSelected() && bip141semantics.val() === "p2wpkh";
    }

    function p2wpkhInP2shSelected() {
        return bip49TabSelected() ||
            (bip141TabSelected() && bip141semantics.val() === "p2wpkh-p2sh");
    }


bipTabs.on("shown.bs.tab", bipTabChanged);

function bipTabChanged() {

	console.log('=bipTabChanged=');
	console.log('=bipTabChanged= this', this);
	console.log('=bipTabChanged= this', $(this));

	var bipTabName = this.innerText;
	var bipTabHash = this.hash;
	
	//get the cpins bip-path for the choosen bip tab
	var bipTabContentId = bipTabHash.substring(1);
	bipTabSelected = bipTabContentId;
	
	if (coinbinf.verifyScript.val() !== '')
		calcForDerivationPath();
	
	/*console.log('bipTabSelected: '+ bipTabSelected);
	var getCoinPath = $('#'+bipTabContentId).find('.bip-coin-path').val();
	bip32pathWally.val(getCoinPath);
	*/

	
}


function bipRootKeyChanged() {
	//$("#verifyBtn").click();
	if(!decodeHDaddress()){
		$("#verifyStatus").removeClass('hidden').fadeOut().fadeIn();
	}
}


function getDerivationPath() {
	console.log('=getDerivationPath=');
	var selectedTab = $('#'+bipTabSelected);
	const bipTypeArr = bipTabSelected.match(/\d/g);
	const bipType = parseInt(bipTypeArr.join(''), 10);
	const bipCoinPath = selectedTab.find('input.bip-coin-path');
	

	console.log('=getDerivationPath= bipTabSelected: '+ bipTabSelected);
	//console.log('=getDerivationPath= selectedTab: ', selectedTab);
	console.log('=getDerivationPath= bipType: '+ bipType);

    if (bipType === 44 || bipType === 49 || bipType === 84) {

    	//$("#verifyHDaddress #coin-bip44").val(coinjs.bip_path);
		//$("#verifyHDaddress #bip44-path").val("m/44'/"+coinjs.bip_path+"'/0'/0");

        var purpose = parseIntNoNaN(selectedTab.find('.purpose').val(), bipType);
        //var coin = parseIntNoNaN(selectedTab.find('.coin').val(), 0);

        var coin = parseIntNoNaN(coinjs.bip_path, 0);
        var account = parseIntNoNaN(selectedTab.find('.account').val(), 0);
        var change = parseIntNoNaN(selectedTab.find('.change').val(), 0);

        var path = "m/";
        path += purpose + "'/";
        path += coin + "'/";
        path += account + "'/";
        path += change;

        //bipCoinPath.val(path);

        bip32pathWally.val(path);

        var derivationPath = path;
        console.log("Using derivation path from BIP"+bipType+" tab: " + derivationPath);
        return derivationPath;
    } else if (bipType == 32) {
    	//var path = coinbinf.bip32path.val();
    	var path = bip32pathWally.val();
    	bip32pathWally.val(bip32pathWally.val());
        var derivationPath = path;
        console.log("Using derivation path from BIP32 tab: " + derivationPath);
        return derivationPath;
    }
    else {
        console.log("Unknown derivation path");
    }
    return false
}

function findDerivationPathErrors(path) {
    // TODO is not perfect but is better than nothing
    // Inspired by
    // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#test-vectors
    // and
    // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#extended-keys
    var maxDepth = 255; // TODO verify this!!
    var maxIndexValue = Math.pow(2, 31); // TODO verify this!!
    if (path[0] != "m") {
        return "First character must be 'm'";
    }
    if (path.length > 1) {
        if (path[1] != "/") {
            return "Separator must be '/'";
        }
        var indexes = path.split("/");
        if (indexes.length > maxDepth) {
            return "Derivation depth is " + indexes.length + ", must be less than " + maxDepth;
        }
        for (var depth = 1; depth<indexes.length; depth++) {
            var index = indexes[depth];
            var invalidChars = index.replace(/^[0-9]+'?$/g, "")
            if (invalidChars.length > 0) {
                return "Invalid characters " + invalidChars + " found at depth " + depth;
            }
            var indexValue = parseInt(index.replace("'", ""));
            if (isNaN(depth)) {
                return "Invalid number at depth " + depth;
            }
            if (indexValue > maxIndexValue) {
                return "Value of " + indexValue + " at depth " + depth + " must be less than " + maxIndexValue;
            }
        }
    }
    // Check root key exists or else derivation path is useless!
    if (!bip32RootKey) {
        return "No root key";
    }
    // Check no hardened derivation path when using xpub keys
    var hardenedPath = path.indexOf("'") > -1;
    var hardenedAddresses = bip32TabSelected() && DOM.hardenedAddresses.prop("checked");
    var hardened = hardenedPath || hardenedAddresses;
    var isXpubkey = bip32RootKey.isNeutered();
    if (hardened && isXpubkey) {
        return "Hardened derivation path is invalid with xpub key";
    }
    return false;
}
function parseIntNoNaN(val, defaultVal) {
    var v = parseInt(val);
    if (isNaN(v)) {
        return defaultVal;
    }
    return v;
}


	//Crypto Random Password generator! 
$('.generatePassword').on("click", function () {
	console.log('===generatePassword===');
    var $el = $(this);

    
    //bip seed
    

    console.log($el[0].dataset.inputFor);
    if($el[0].dataset.inputFor == '#newMnemonicWords') {
      coinbinf.newMnemonicPubInput.val("");
      coinbinf.newMnemonicPrvInput.val("");
      console.log('return seed');
      return;
    }

    if($el[0].dataset.inputFor == '#MnemonicBrainwallet') {
      coinbinf.newMnemonicPubInput.val("");
      coinbinf.newMnemonicPrvInput.val("");
    }

    if($el[0].dataset.inputFor == '#HDBrainwallet') {
      $("#newHDxpub").val("");
      $("#newHDxprv").val("");
    }

    if($el[0].dataset.inputFor == '#brainwallet') {
      $("#newBitcoinAddress").val("");
      $("#newPubKey").val("");
      $("#newPrivKey").val("");
      $("#newPrivKeyHex").val("");
    }

    if($el[0].dataset.inputFor == '#brainwalletSegWit') {
      $("#newSegWitAddress").val("");
      $("#newSegWitRedeemScript").val("");
      $("#newSegWitPubKey").val("");
      $("#newSegWitPrivKey").val("");
      $("#newSegWitPrivKeyHex").val("");
    }

    


    var inputElPass = $el.attr( "data-input-for");
    console.log('inputElPass: ', inputElPass);
    $(inputElPass).val( wally_fn.generatePassword() ).fadeOut().fadeIn();
  });




const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol
}

$("body").on("click", ".pwdGenerate", function(e){
	console.log('===pwdGenerate===');
	//console.log('this data-input-for: ', $(this).attr( "data-input-for"));
	var inputId = $(this).attr( "data-input-for");
	console.log('this data-input-for: ', inputId);
	var generatePwdField = $('#'+ inputId);

	//get elements in opened/active popover
	var poppis = $('.popover.show');
	var lengthIs = 	poppis.find('#pwdLength').val();
	var hasLower = 	((poppis.find('#pwdLowercase').is(":checked")) ? 1 : 0);;
	var hasUpper = 	((poppis.find('#pwdUppercase').is(":checked")) ? 1 : 0);
	var hasNumber = 	((poppis.find('#pwdNumbers').is(":checked")) ? 1 : 0);
	var hasSymbol = 	((poppis.find('#pwdSymbols').is(":checked")) ? 1 : 0);

	/*
	console.log('lengthIs: '+ lengthIs);
	console.log('hasLower: '+ hasLower);
	console.log('hasUpper: '+ hasUpper);
	console.log('hasNumber: '+ hasNumber);
	console.log('hasSymbol: '+ hasSymbol);
	*/

	console.log('generatePwdField: ', generatePwdField);

	generatePwdField.val( GeneratePasswordInPop(lengthIs, hasLower, hasUpper, hasNumber, hasSymbol) );
});

function GeneratePasswordInPop(length=48, lower=1, upper=1, number=1, symbol=1) {
	var generatedPassword = '';
	var typesCount = parseInt(lower + upper + number + symbol);
	//if there is no selected type, act as all checks are set to true	
	if(typesCount <= 0 || typesCount > 4) {
		typesCount = 4;
		lower=1,  upper=1, number=1, symbol=1;
		console.log('reset - use all checks');
	}
	var typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
	
	


	//**set min/max password, if out of range!
	var isPwdInRange = true;
	if (length < 23) {
		length = 24;
		isPwdInRange = false;
	}
	if (length > 3000) {
		length = 3000;
		isPwdInRange = false;
	}

	if (!isPwdInRange) {
		var poppis = $('.popover.show');
		poppis.find('#pwdLength').val(length);
	}
	
	// create a loop
	for(var i=0; i<length; i+=typesCount) {
		typesArr.forEach(type => {
			var funcName = Object.keys(type)[0];
			generatedPassword += randomFunc[funcName]();
		});
	}
	
	var finalPassword = generatedPassword.slice(0, length);
	
	return wally_fn.shuffleWord(finalPassword);
}

function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
	return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

//https://www.tutorialstonight.com/password-generator-in-javascript
//https://w3collective.com/random-password-generator-javascript/
//https://en.wikipedia.org/wiki/List_of_Unicode_characters#Mathematical_symbols
//https://grad.ucla.edu/gasaa/etd/specialcharacters.pdf

//this one is good! https://stackoverflow.com/questions/1497481/javascript-password-generator
//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript


function getRandomSymbol() {
	const symbols = " !\"#$%&'()*+,-./:;¨<=>?@[\]^_`{|}~€£¶½¤";
	return symbols[Math.floor(Math.random() * symbols.length)];
}


/*wallet*/


//Reset Wallet Send Outputs
$("#walletSendReset").click(function(){
	$("#txFee").val("0.00001000");
	$("#developerDonation").val("0.001");
	

	$('#walletSpendTo').children( '.form-horizontal.output:not(:first)' ).remove();

	$('#walletSpendTo input').val('');

	$('#walletSendStatus').addClass('hidden');

});


/*
 @ Blockie Icon
*/

  // Create the blockie image
  var address = '0x138854708D8B603c9b7d4d6e55b6d32D40557F4D';
/*
var img = new Image();
img.src = makeBlockie(address);
img.classList.add('icon');
img.classList.add('icon24');

$(".blockie_address").append(img)
*/
//$(".blockie_address").css("background", "url(" + img.src + ")");

//$(".blockie_address.icon").css("background-image", "url(" + makeBlockie(address) + ")");

$(".blockie_wrapper .icon").css("background-image", "url(" + makeBlockie(address) + ")");
$(".blockie_wrapper .wallet_address").html(address);

$(".blockie_wrapper .icon").css("background-image", "url(" + makeBlockie(address) + ")");
$(".blockie_wrapper .wallet_address").val(address);

$(".blockie_wrapper").attr('title', 'Copy Address').attr('data-copy-content', address);
//$(".blockie_wrapper").css("background-image", "url(" + makeBlockie('0x138854708D8B603c9b7d4d6e55b6d32D40557F4D') + ")");


//jbox content loader
var jbox_loader_id = 'jBoxTooltip-'+Math.floor(Math.random() * 999)+'_'+wally_fn.generatePassword(16, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
coinbinf.NoticeLoader = new jBox('Notice', {
	id: jbox_loader_id,
	title: '<span class="text-muted">Loading...</span>',
  content: '',
  color: 'black',
  autoClose: false,
  addClass: 'jBox-notice-content-loader',
  
  blockScroll: true,
  overlay: true,
  //overlayClass: 'inception-overlay',
  overlayClass: 'modal-backdrop',
  
  // Notices have a fixed position
  // That's why you need to change the attribute option to move them
  attributes: {
    x: 'center',
    y: 'center'
  },
  onClose: function() {
    this.setTitle('');
    this.setContent('');
  }
});
//coinbinf.NoticeLoader.open();

//coinbinf.NoticeLoader.setTitle();
//coinbinf.NoticeLoader.setContent();
//remove tooltip and popover after release, and replace with jBox Tooltip!
$('body [title], body [data-content]').each(function(index, value) {
  var _this_ = $(this);
  //set a unique id for the tooltip/jbox
  var tooltip_id = 'jBoxTooltip-' + Math.floor(Math.random() * 999) + '_' + wally_fn.generatePassword(16, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
  _this_.attr('data-tooltip-id', tooltip_id);
  if (_this_.attr("data-content")) {
    console.log('jbox tooltip content is empty: ', _this_.attr("data-content"));
    if (_this_.attr("data-content") == '')
      return;
    new jBox("Tooltip", {
      id: tooltip_id,
      attach: $(this),
      //content: $(this).attr("data-jbox-content"),
      getTitle: 'title',
      getContent: 'data-content',
      //attach: "#" + $(this).attr("id")
      closeOnMouseleave: true,
    }) //.attach();
  } else {
    if (_this_.attr("title") == '')
      return;
    /*
    var defaultPlacement = 'center';
    var jBoxPlacement = _this_.attr('data-placement');

    if (jBoxPlacement)
    	defaultPlacement = jBoxPlacement;
    */
    new jBox("Tooltip", {
      id: tooltip_id,
      theme: "TooltipDark",
      attach: $(this),
      //getTitle: 'title',
      getContent: 'title',
      position: {
        x: 'center',
        y: 'bottom'
      },
      closeOnMouseleave: false,
    }) //.attach();
  }
});


/*
	$('[data-jbox-content]').each(function() {
		  new jBox("Tooltip", {
		    theme: "TooltipDark",
		    attach: $(this),
		    getTitle: 'data-jbox-title',
  			getContent: 'data-jbox-content',
  			closeOnMouseleave: true,
		  })//.attach();
		});
	*/



/*
	  $("[data-jbox-content]").each(function() {
		  new jBox("Tooltip", {
		    //id: "jBoxTooltip_" + $(this).attr("id"),
		    attach: $(this),
		    //content: $(this).attr("data-jbox-content"),
		    getTitle: 'data-jbox-title',
  			getContent: 'data-jbox-content',
		    //attach: "#" + $(this).attr("id")
		    closeOnMouseleave: true,
		  })//.attach();
		});
	  */

});
