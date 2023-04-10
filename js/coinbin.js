$(document).ready(function() {

	//***Initialize/Set default Network
  	wally_kit.initNetwork($('input[type=radio][name=radio_selectNetworkType]'));

	/* open wallet code */

	var explorer_tx = "https://coinb.in/tx/"
	var explorer_addr = "https://coinb.in/addr/"
	var explorer_block = "https://coinb.in/block/"

/*


	var navigationPages = {	//unused for now
		"home" : {},
		"newAddress" : {},
		"newSegWit" : {},
		"newMultiSig" : {},
		"newTimeLocked" : {},
		"newHDaddress" : {},
		"newTransaction" : [
			"txinputs",
			"txoutputs"
		],
		"verify" : {},
		"sign" : {},
		"broadcast" : {},
		"wallet" : {},
		"settings" : {},
		"about" : {},
		"fees" : {},
		"converter" : {}
	};




*/

/*
profile_data = { 
			"address" : "",
			"email" : loginEmail,
			"login_type" : "", //"password" (email & password login), "private_key" login, "import_wallet", mnemonic" login, "hdmaster" login
			"wallet_type" : walletType,	//regular (login normal address), multisig
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
	

	var landingPageShowOnPages = [""];

	var wallet_timer = false;

	$("#openBtn").click(function(){
		var email = $("#openEmail").val().toLowerCase();
		if(email.match(/[\s\w\d]+@[\s\w\d]+/g)){
			if($("#openPass").val().length>=10){

				console.log('openPass: ' + $("#openPass").val());
				console.log('openPass-confirm: ' + $("#openPass-confirm").val());
				if($("#openPass").val()==$("#openPass-confirm").val()){
					var email = $("#openEmail").val().toLowerCase();
					var pass = $("#openPass").val();
					var s = email;
					s += '|'+pass+'|';
					s += s.length+'|!@'+((pass.length*7)+email.length)*7;
					var regchars = (pass.match(/[a-z]+/g)) ? pass.match(/[a-z]+/g).length : 1;
					var regupchars = (pass.match(/[A-Z]+/g)) ? pass.match(/[A-Z]+/g).length : 1;
					var regnums = (pass.match(/[0-9]+/g)) ? pass.match(/[0-9]+/g).length : 1;
					s += ((regnums+regchars)+regupchars)*pass.length+'3571';
					s += (s+''+s);

					for(i=0;i<=50;i++){
						s = Crypto.SHA256(s);
					}

					coinjs.compressed = true;
					var keys = coinjs.newKeys(s);
					var address = keys.address;
					var wif = keys.wif;
					var pubkey = keys.pubkey;
					var privkeyaes = CryptoJS.AES.encrypt(keys.wif, pass);

					$("#walletKeys .walletSegWitRS").addClass("hidden");
					if($("#walletSegwit").is(":checked")){
						if($("#walletSegwitBech32").is(":checked")){
							var sw = coinjs.bech32Address(pubkey);
							address = sw.address;
						} else {

							var sw = coinjs.segwitAddress(pubkey);
							address = sw.address;
						}

						$("#walletKeys .walletSegWitRS").removeClass("hidden");
						$("#walletKeys .walletSegWitRS input:text").val(sw.redeemscript);
					}

					$("#walletAddress").html(address);
					$("#walletHistory").attr('href',explorer_addr+address);

					$("#walletQrCode").html("");
					var qrcode = new QRCode("walletQrCode");
					qrcode.makeCode("bitcoin:"+address);

					$("#walletKeys .privkey").val(wif);
					$("#walletKeys .pubkey").val(pubkey);
					$("#walletKeys .privkeyaes").val(privkeyaes);

					$("#openLogin").hide();
					$("#openWallet").removeClass("hidden").show();

					walletBalance();
				} else {
					$("#openLoginStatus").html("Your passwords do not match!").removeClass("hidden").fadeOut().fadeIn();
				}
			} else {
				$("#openLoginStatus").html("Your password must be at least 10 chars long").removeClass("hidden").fadeOut().fadeIn();
			}
		} else {
			$("#openLoginStatus").html("Your email address doesn't appear to be valid").removeClass("hidden").fadeOut().fadeIn();
		}

		$("#openLoginStatus").prepend('<i class="bi bi-exclamation-triangle-fill"></i> ');
	});

	$("#walletLogout").click(function(){
		$("#openEmail").val("");
		$("#openPass").val("");
		$("#openPass-confirm").val("");

		$("#openLogin").show();
		$("#openWallet").addClass("hidden").show();

		$("#walletAddress").html("");
		$("#walletHistory").attr('href',explorer_addr);

		$("#walletQrCode").html("");
		var qrcode = new QRCode("walletQrCode");
		qrcode.makeCode("bitcoin:");

		$("#walletKeys .privkey").val("");
		$("#walletKeys .pubkey").val("");

		$("#openLoginStatus").html("").hide();
	});

	$("#walletSegwit").click(function(){
		if($(this).is(":checked")){
			$(".walletSegwitType").attr('disabled',false);
		} else {
			$(".walletSegwitType").attr('disabled',true);
		}	
	});

	$("#walletToSegWit").click(function(){
		$("#walletToBtn").html('SegWit <span class="caret"></span>');
		$("#walletSegwit")[0].checked = true;
		$("#walletSegwitp2sh")[0].checked = true;
		$("#openBtn").click();
	});

	$("#walletToSegWitBech32").click(function(){
		$("#walletToBtn").html('Bech32 <span class="caret"></span>');
		$("#walletSegwit")[0].checked = true;
		$("#walletSegwitBech32")[0].checked = true;		
		$("#openBtn").click();
	});

	$("#walletToLegacy").click(function(){
		$("#walletToBtn").html('Legacy <span class="caret"></span>');
		$("#walletSegwit")[0].checked = false;
		$("#openBtn").click();
	});

	$("#walletShowKeys").click(function(){
		$(".walletOptions").removeClass("hidden").addClass("hidden");
		$("#walletKeys").removeClass("hidden");
	});

	$("#walletShowBuy").click(function(){
		$(".walletOptions").removeClass("hidden").addClass("hidden");
		$("#walletBuy").removeClass("hidden");
	});

	$("#walletBalance, #walletAddress, #walletQrCode").click(function(){
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

			var dvalue = (data.value/100000000).toFixed(8) * 1;
			total = (total*1).toFixed(8) * 1;

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

		total = total.toFixed(8);

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

	$("#walletShowSpend").click(function(){
		$(".walletOptions").removeClass("hidden").addClass("hidden");
		$("#walletSpend").removeClass("hidden");
	});

	$("#walletSpendTo .addressAdd").click(function(){
		var clone = '<div class="form-horizontal output">'+$(this).parent().html()+'</div>';
		$("#walletSpendTo").append(clone);
		$("#walletSpendTo .bi-plus:last").removeClass('bi-plus').addClass('bi-dash');
		$("#walletSpendTo .bi-dash:last").parent().removeClass('addressAdd').addClass('addressRemove');
		$("#walletSpendTo .addressRemove").unbind("");
		$("#walletSpendTo .addressRemove").click(function(){
			$(this).parent().fadeOut().remove();
		});
	});

	function walletBalance(){
		if($("#walletLoader").hasClass("hidden")){
			var tx = coinjs.transaction();
			$("#walletLoader").removeClass("hidden");
			coinjs.addressBalance($("#walletAddress").html(),function(data){
				if($(data).find("result").text()==1){
					var v = $(data).find("balance").text()/100000000;
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
		$("#verifyScript").val($("input[type='text']",$(this).parent().parent()).val());
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

	});

	$("#newHDBrainwallet").click(function(){
		if($(this).is(":checked")){
			$("#HDBrainwallet").parent().removeClass("hidden");
		} else {
			$("#HDBrainwallet").parent().addClass("hidden");
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
			$("#verifyScript").val( $('#signedData textarea').val() ).fadeOut().fadeIn();
		}
		else
			$("#verifyScript").val( $('#transactionCreate textarea').val() ).fadeOut().fadeIn();
		
		//window.location.hash = "#verify";
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

		if($("#clearInputsOnLoad").is(":checked")){
			$("#inputs .txidRemove, #inputs .txidClear").click();
			$('#inputs input').val('');
		}

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

						var amount = ((fee*$("#totalInput").html())/100).toFixed(8);
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
				s.writeBytes(coinjs.numToBytes((amount*100000000).toFixed(0), 8));
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
					var amount = (($(o).find("value").text()*1)).toFixed(8);

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
					var amount = (($(o).find("value").text()*1)/100000000).toFixed(8);

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
							var amount = ((o.value.toString()*1)/100000000).toFixed(8);
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

		
		var apiUrl;
		if(coinjs.asset.network == 'mainnet')
			apiUrl = 'https://blockstream.info/api/';
		if(coinjs.asset.network == 'mainnet')
			apiUrl = 'https://blockstream.info/testnet/api/';

		console.log('redeem: ', redeem);
		console.log('network: ', network);

	};
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
				$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs! <div class="alert alert-light">'+data.responseJSON.context.error+' </div>');
				console.log('erro: ', data.responseJSON.context.error);
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
							var amount = ((o.value.toString()*1)/100000000).toFixed(8);
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

	/* retrieve unspent data from blockstream */
	function listUnspentBlockstreams(redeem, network){
		/*

		https://blockstream.info/api/address/1DX8EFJPMBimWyApUndVSnwucu29Eob4fC/utxo
		https://blockstream.info/api/scripthash/1DX8EFJPMBimWyApUndVSnwucu29Eob4fC/utxo
		https://blockstream.info/api/scripthash/:hash/utxo
		
txid: tx
vout: n
value:
confirmed: true

https://blockstream.info/api/address/1DX8EFJPMBimWyApUndVSnwucu29Eob4fC/utxo
[
  {
    "txid": "06a6845efa2de56ac9753edc9970e4abb59a16db19379a0e728e087ece83f2c5",
    "vout": 1,
    "status": {
      "confirmed": true,
      "block_height": 770416,
      "block_hash": "00000000000000000003db3eb21ac3c4aba6d82d046d3092ccb4f0819f36e6a7",
      "block_time": 1672888014
    },
    "value": 410234
  },
  {
    "txid": "609257f98394f5ec8f05bbacc922452aeb2a56f969852fa052b6b5fc4d05fcd2",
    "vout": 1,
    "status": {
      "confirmed": true,
      "block_height": 770556,
      "block_hash": "00000000000000000006e73b3979559249b5f8e682a2b90099d75bfb58229ee9",
      "block_time": 1672965601
    },
    "value": 47139396
  }
]


https://api.blockcypher.com/v1/btc/main/addrs/1DX8EFJPMBimWyApUndVSnwucu29Eob4fC?includeScript=true&unspentOnly=true
{
  "address": "1DX8EFJPMBimWyApUndVSnwucu29Eob4fC",
  "total_received": 931143573,
  "total_sent": 883593943,
  "balance": 47549630,
  "unconfirmed_balance": 0,
  "final_balance": 47549630,
  "n_tx": 141,
  "unconfirmed_n_tx": 0,
  "final_n_tx": 141,
  "txrefs": [
    {
      "tx_hash": "609257f98394f5ec8f05bbacc922452aeb2a56f969852fa052b6b5fc4d05fcd2",
      "block_height": 770556,
      "tx_input_n": -1,
      "tx_output_n": 1,
      "value": 47139396,
      "ref_balance": 100703630,
      "spent": false,
      "confirmations": 6,
      "confirmed": "2023-01-06T00:40:01Z",
      "double_spend": false,
      "script": "76a914895405afd2380af9789c5be1e3c959637150f4aa88ac"
    },
    {
      "tx_hash": "06a6845efa2de56ac9753edc9970e4abb59a16db19379a0e728e087ece83f2c5",
      "block_height": 770416,
      "tx_input_n": -1,
      "tx_output_n": 1,
      "value": 410234,
      "ref_balance": 6835881,
      "spent": false,
      "confirmations": 146,
      "confirmed": "2023-01-05T03:06:54Z",
      "double_spend": false,
      "script": "76a914895405afd2380af9789c5be1e3c959637150f4aa88ac"
    }
  ],
  "tx_url": "https://api.blockcypher.com/v1/btc/main/txs/"
}

https://coinb.in/api/?uid=1&key=12345678901234567890123456789012&setmodule=addresses&request=unspent&address=1DX8EFJPMBimWyApUndVSnwucu29Eob4fC&r=0.4235599810492048
		*/

		console.log('redeem: ', redeem);

		$.ajax ({
			type: "GET",
			url: "https://chain.so/api/v2/get_tx_unspent/"+network+"/"+redeem.addr,
			dataType: "json",
			error: function(data) {
				$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs!');
			},
			success: function(data) {
				if (data.length) {	//unspent is in an array, so if empty then wallet is empty
					$("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved unspent inputs from address <a href="'+explorer_addr+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');

					for(var i in data){
						var o = data[i];
						var tx = ((""+o.txid).match(/.{1,2}/g).reverse()).join("")+'';
						if(tx.match(/^[a-f0-9]+$/)){
							var n = o.vout;
							var script = (redeem.redeemscript==true) ? redeem.decodedRs : o.script_hex;
							//script_hex is not presented, generate it!
							//block_hash exists
							var amount = o.value;
							addOutput(tx, n, script, amount);
						}
					}

				} else {
					$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs.');
				}

				if((data.status && data.data) && data.status=='success'){
					$("#redeemFromAddress").removeClass('hidden').html('<i class="bi bi-info-circle-fill"></i> Retrieved unspent inputs from address <a href="'+explorer_addr+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
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
							var amount = (o.value /100000000).toFixed(8);;
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
		console.log("listUnspentCryptoid");
		$.ajax ({
		  type: "GET",
		  url: "https://chainz.cryptoid.info/"+network+"/api.dws?key=1205735eba8c&q=unspent&active="+ redeem.addr,
		  dataType: "json",
		  error: function() {
			$("#redeemFromStatus").removeClass('hidden').html('<i class="bi bi-exclamation-triangle-fill"></i> Unexpected error, unable to retrieve unspent outputs! blk test function error');
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
							var amount = (o.value /100000000).toFixed(8);;
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
				$("#totalInput").text((($("#totalInput").text()*1) + (f)).toFixed(8));
			}
		});
		totalFee();
	}

	function validateOutputAmount(){
		console.log('===validateOutputAmount===');
		
		$("#recipients .amount").keyup(function(){
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
				$("#totalOutput").text((f).toFixed(8));
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
		var fee = (($("#totalInput").text()*1) - ($("#totalOutput").text()*1)).toFixed(8);
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
		} else if (wally_fn.provider.broadcast == 'Blockchain.info') {
			rawSubmitBlockhaininfo(this, coinjs.asset.api.broadcast['Blockchain.info']);
		}else {
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
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
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

		var apiUrl;
		if(coinjs.asset.network == 'mainnet')
			apiUrl = '//blockstream.info/api/';
		if(coinjs.asset.network == 'mainnet')
			apiUrl = '//blockstream.info/testnet/api/';

		

		console.log('===rawSubmitBlockstream===');
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: apiUrl,
			data: $("#rawTransaction").val(),
			error: function(data) {
				console.log('Blockstream error data: ', data);
				var r = 'Failed to broadcast: error code=' + data.status.toString() + ' ' + data.statusText;
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
			},
            success: function(data) {
            	console.log('Blockstream success data: ', data);
            	var txid = (data.match(/[a-f0-9]{64}/gi)[0]);
            	if(txid){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden")
                    .html(' TXID: ' + txid + '<br> <a href="https://live.blockcypher.com/tx/' + txid + '" target="_blank">View on Blockchain Explorer</a>');
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


	// broadcast transaction via blockcypher.com (mainnet)
	function rawSubmitBlockcypher(thisbtn, network){ 
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: "https://api.blockcypher.com/v1/"+network+"/main/txs/push",
			data: JSON.stringify({"tx":$("#rawTransaction").val()}),
			error: function(data) {
				var r = 'Failed to broadcast: error code=' + data.status.toString() + ' ' + data.statusText;
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<i class="bi bi-exclamation-triangle-fill"></i>');
			},
                        success: function(data) {
				if((data.tx) && data.tx.hash){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden")
                    .html(' TXID: ' + data.tx.hash + '<br> <a href="https://live.blockcypher.com/'+network+'/tx/' + data.tx.hash + '" target="_blank">View on Blockchain Explorer</a>');
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
				$("#verify input.verifyLink").val(wally_fn.host+'?asset='+coinjs.asset.slug+'&verify='+$("#verifyScript").val()+'#verify').trigger('change');
				window.location.hash = "#verify";
				history.pushState({}, null, $("#verify input.verifyLink").val());
				console.log('add share link');
			}else
				console.log('dont add share link');

		} catch (e) {
			console.log('verifyBtn: ', e);
		}

	});

	function decodeRedeemScript(){
		var script = coinjs.script();
		var decode = script.decodeRedeemScript($("#verifyScript").val());
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
		var tx = coinjs.transaction();
		console.log('tx: ', tx);
		/*
		var regex = /^[0-9a-fA-F]{64}$/ig;
var tx = '1200900900002000001100000000990000000900000000000000000000000001';
    console.log('testar: ',  regex.test(tx));
		*/
		try {
			var decode = tx.deserialize($("#verifyScript").val());
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
					h += '<td class="col-1">'+(o.value/100000000).toFixed(8)+'</td>';
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
					h += '<td class="col-1">'+(o.value/100000000).toFixed(8)+'</td>';
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
			var privkey = $("#verifyScript").val();
			

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

			$("#verifyPrivHexKey .uncompressed .address").val(hexDecoded.wif.uncompressed.address);
			$("#verifyPrivHexKey .uncompressed .pubkey").val(hexDecoded.wif.uncompressed.public_key);
			$("#verifyPrivHexKey .uncompressed .pubkeyHash").val(hexDecoded.wif.uncompressed.public_key_hash);
			$("#verifyPrivHexKey .uncompressed .privkey").val(hexDecoded.wif.uncompressed.key);

			$("#verifyPrivHexKey .compressed .address").val(hexDecoded.wif.compressed.address);
			$("#verifyPrivHexKey .compressed .addressCSegwit").val(hexDecoded.wif.compressed.segwit.address);
			$("#verifyPrivHexKey .compressed .CSegwitRedeemscript").val(hexDecoded.wif.compressed.segwit.redeemscript);
			$("#verifyPrivHexKey .compressed .addressCBech32").val(hexDecoded.wif.compressed.bech32.address);
			$("#verifyPrivHexKey .compressed .CBech32Redeemscript").val(hexDecoded.wif.compressed.bech32.redeemscript);
			$("#verifyPrivHexKey .compressed .pubkey").val(hexDecoded.wif.compressed.public_key);
			$("#verifyPrivHexKey .compressed .pubkeyHash").val(hexDecoded.wif.compressed.public_key_hash);
			$("#verifyPrivHexKey .compressed .privkey").val(hexDecoded.wif.compressed.key);

			
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
		console.log('===decodePubKey===')
		var pubkey = $("#verifyScript").val().trim();
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
		coinjs.compressed = true;
		console.log('===coinjs.decodeHDaddress===');
		var s = $("#verifyScript").val();
		try {
			var hex = Crypto.util.bytesToHex((coinjs.base58decode(s)).slice(0,4));
			var hex_cmp_prv = Crypto.util.bytesToHex((coinjs.numToBytes(coinjs.hdkey.prv,4)).reverse());
			var hex_cmp_pub = Crypto.util.bytesToHex((coinjs.numToBytes(coinjs.hdkey.pub,4)).reverse());
			if(hex == hex_cmp_prv || hex == hex_cmp_pub){
				var hd = coinjs.hd(s);
				$("#verifyHDaddress .hdKey").html(s);
				$("#verifyHDaddress .chain_code").val(Crypto.util.bytesToHex(hd.chain_code));
				$("#verifyHDaddress .depth").val(hd.depth);
				$("#verifyHDaddress .version").val('0x'+(hd.version).toString(16));
				$("#verifyHDaddress .child_index").val(hd.child_index);
				$("#verifyHDaddress .hdwifkey").val((hd.keys.wif)?hd.keys.wif:'');
				$("#verifyHDaddress .key_type").html((((hd.depth==0 && hd.child_index==0)?'Master':'Derived')+' '+hd.type).toLowerCase());
				$("#verifyHDaddress .parent_fingerprint").val(Crypto.util.bytesToHex(hd.parent_fingerprint));
				$("#verifyHDaddress .derived_data table tbody").html("");
				deriveHDaddress();

				$("#verifyHDaddress").removeClass("hidden");
				return true;
			}
		} catch (e) {
			return false;
		}
	}

	function deriveHDaddress() {
		var hd = coinjs.hd($("#verifyHDaddress .hdKey").html());
		var index_start = $("#verifyHDaddress .derivation_index_start").val()*1;
		var index_end = $("#verifyHDaddress .derivation_index_end").val()*1;
		var html = '';
		$("#verifyHDaddress .derived_data table tbody").html("");
		for(var i=index_start;i<=index_end;i++){
			if($("#hdpathtype option:selected").val()=='simple'){
				var derived = hd.derive(i);
			} else {
				var derived = hd.derive_path(($("#hdpath input").val().replace(/\/+$/, ""))+'/'+i);
			}
			html += '<tr>';
			html += '<td>'+i+'</td>';
			html += '<td><input type="text" class="form-control" value="'+derived.keys.address+'" readonly></td>';
			html += '<td><input type="text" class="form-control" value="'+((derived.keys.wif)?derived.keys.wif:'')+'" readonly></td>';
			html += '<td><input type="text" class="form-control" value="'+derived.keys_extended.pubkey+'" readonly></td>';
			html += '<td><input type="text" class="form-control" value="'+((derived.keys_extended.privkey)?derived.keys_extended.privkey:'')+'" readonly></td>';
			html += '</tr>';
		}
		$(html).appendTo("#verifyHDaddress .derived_data table tbody");
	}


	$("#hdpathtype").change(function(){
		if($(this).val()=='simple'){
			$("#hdpath").removeClass().addClass("hidden");
		} else {
			$("#hdpath").removeClass();
		}
	});


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
  	
  	$('a[data-toggle="popover"][data-target], button[data-toggle="popover"][data-target], div[data-toggle="popover"][data-target], span[data-toggle="popover"][data-target]').each(function (i, e) {
    	

	  	//console.log('index: ', i);
	  	//console.log('el: ', e);
	    var data = $(e).data();
	    if (data.target) {
    		//console.log('target found!'+ data.target);
    		var targetEl = $(data.target);

	        var contentHtml = targetEl.html();

	        var contentTitle, contentFooter;
	        var contentBody = $(data.target + ' .popover-body').html();

	        //this is for generating passwords on popover so we can bind the generated value to the password-input field of the page!
	        var inputFor = $(e).attr( "data-input-for");
    			console.log('inputFor: '+ inputFor);

    		$(data.target ).find('#pwdGenerate').attr('data-input-for', inputFor);

	        //console.log('contentBody: ', $(data.target ).find('#pwdGenerate').attr('data-input-for', inputFor));
	        //console.log('contentBody data-input-for: ', $(data.target + ' #pwdGenerate').attr('data-input-for'));

	        var contentBody = $(data.target + ' .popover-body').html();


	        /*
	        //this is for generating passwords on popover so we can bind the generated value to the password-input field of the page!
	        var inputFor = $(e).attr( "data-input-for");

	        contentBody = $(data.target + ' .popover-body').find('#pwdGenerate').attr('data-input-for', inputFor);
	        contentBody = $(data.target + ' .popover-body').html();
	        
	        console.log('contentBody: ', contentBody);
	        console.log('contentBody data-input-for: ', $(data.target + ' .popover-body #pwdGenerate').attr('data-input-for'));

	        */
	        

	        if ( $(data.target + ' .popover-title').length > 0 )
	        	contentTitle = $(data.target + ' .popover-title').html();

	        if ( $(data.target + ' .popover-footer').length > 0 )
	        	contentFooter = $(data.target + ' .popover-footer').html();

	        
	        //console.log('data.footer: ', contentFooter);

	  	    var pooppis = $(e).popover( {
		    	title: contentTitle,
		    	content: contentBody,
		    	footer: contentFooter,
		    	html: true,
	  			delay: { "show": 100, "hide": 50000 },
	  			//customClass: 'animate__animated animate__slideInDown',
		    });
	  	    console.log('popover poppis: ', pooppis);

	  	    //var open = $(e).attr('data-easein');
	  	    //pooppis.velocity('transition.' + open);

	  	  
		    //var open = $(e).attr('data-easein');
		    //console.log('open: ' + open);
		    //targetEl.velocity('transition.' + open);
		    
	    }
	  });
	  
  	/*
	  $('button[data-toggle="popover"], a[data-toggle="popover"], div[data-toggle="popover"], span[data-toggle="popover"]').popover({
  		html: true,
  		delay: { "show": 100, "hide": 500 },
  		customClass: '',
  	});
  	*/

	  
  	$('button[data-toggle="popover"], a[data-toggle="popover"], div[data-toggle="popover"], span[data-toggle="popover"]').popover({
  		html: true,
  		delay: { "show": 100, "hide": 500 },
  		customClass: '',
  	}).on('click', function(e) {
  		//e.preventDefault();
  		$(this).next().velocity('transition.slideUpBigIn');
  	});
  	

	  //dismiss popover, close button
	  $('body').on('click', '.popover > .popover-header [data-dismiss="popover"], .popover > .popover-header .close', function(e){
  		console.log('popover toggle');
  		$(this).parent().parent().popover('hide');
  	});




	$('input[title!=""], abbr[title!=""]').tooltip({'placement':'bottom', delay: { "show": 100, "hide": 300 }});

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
	for(i=1;i<3;i++){
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
		$("#verify a.verifyLink").attr('href','?asset='+coinjs.asset.slug+'&verify='+$("#verifyScript").val());
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
			var recommendedFee = ((totalBytes * $(".feeSatByte").html())/100000000).toFixed(8);
			$(".recommendedFee").html(recommendedFee);
			$(".feeTxSize").html(totalBytes);
		} else {
			$(".recommendedFee").html((0).toFixed(8));
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

/* Generate Password Functions*/
//https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript
function generatePassword(length = 64) {
  var generatePass = (
  //length = 20,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!"#$%&\'()*+,-.¨/¤:;<€½¶§=>?@[\]^_`{|}~'
) =>
  Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');


  return wally_fn.shuffleWord(generatePass());  
}

	//Crypto Random Password generator! 
$('.generatePassword').on("click", function () {
    var $el = $(this);

    

    if($el[0].dataset.inputFor == 'MnemonicBrainwallet') {
      $("#newMnemonicxpub").val("");
      $("#newMnemonicxprv").val("");
    }

    if($el[0].dataset.inputFor == 'HDBrainwallet') {
      $("#newHDxpub").val("");
      $("#newHDxprv").val("");
    }

    if($el[0].dataset.inputFor == 'brainwallet') {
      $("#newBitcoinAddress").val("");
      $("#newPubKey").val("");
      $("#newPrivKey").val("");
      $("#newPrivKeyHex").val("");
    }

    if($el[0].dataset.inputFor == 'brainwalletSegWit') {
      $("#newSegWitAddress").val("");
      $("#newSegWitRedeemScript").val("");
      $("#newSegWitPubKey").val("");
      $("#newSegWitPrivKey").val("");
      $("#newSegWitPrivKeyHex").val("");
    }

    


    var inputElPass = $el.attr( "data-input-for");
    $("#"+inputElPass).val( generatePassword() ).fadeOut().fadeIn();
  });




const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol
}

$("body").on("click", "#pwdGenerate", function(e){
	
	console.log('this data-input-for: ', $(this).attr( "data-input-for"));
	var generatePwdField = $('#'+ $(this).attr( "data-input-for"));

	//get open popover
	var poppis = $('.popover.show');
	var lengthIs = 	poppis.find('#pwdLength').val();
	var hasLower = 	((poppis.find('#pwdLowercase').is(":checked")) ? 1 : 0);;
	var hasUpper = 	((poppis.find('#pwdUppercase').is(":checked")) ? 1 : 0);
	var hasNumber = 	((poppis.find('#pwdNumbers').is(":checked")) ? 1 : 0);
	var hasSymbol = 	((poppis.find('#pwdSymbols').is(":checked")) ? 1 : 0);

	
	console.log('hasLower: ', poppis.find('#hasLower'));
	console.log('hasUpper: ', poppis.find('#hasUpper'));
/*
	const hasLength = +$('#pwdLength').val();
	console.log('length: '+ hasLength);
	
	const hasLower = (($('#pwdLowercase').is(":checked")) ? 1 : 0);
	const hasUpper = (($('#pwdUppercase').is(":checked")) ? 1 : 0);
	const hasNumber = (($('#pwdNumbers').is(":checked")) ? 1 : 0);
	const hasSymbol = (($('#pwdSymbols').is(":checked")) ? 1 : 0);
	*/

	console.log('lengthIs: '+ lengthIs);
	console.log('hasLower: '+ hasLower);
	console.log('hasUpper: '+ hasUpper);
	console.log('hasNumber: '+ hasNumber);
	console.log('hasSymbol: '+ hasSymbol);

	console.log('.popover.show', $('.popover.show'));
	
	generatePwdField.val( GeneratePasswordInPop(hasLower, hasUpper, hasNumber, hasSymbol, lengthIs) );
});

function GeneratePasswordInPop(lower, upper, number, symbol, length) {
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
	if (length < 23)
		length = 24;
	if (length > 255)
		length = 255;

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



});
