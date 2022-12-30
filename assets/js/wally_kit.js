/*
 @ Developed by Anoxy for Wally.id
 * Custom Misc. Functions for Wally.id
*/

(function () {

  var wally_kit = window.wally_kit = function () { };

  /*
   @ Validate Email address
  */
  wally_kit.validateEmail = function (email){
    
  }


  /*

  */
  wally_kit.networks = {
    bitcoin: {
      getBalance: {
        "urlName1" : function(address) {
          
        },
        "urlName2" : function(address) {
          
        },
        "urlName3" : function(address) {
          
        }

      },listUnspent: {
        "blockcypher": function(redeem){
          $.ajax ({
            type: "GET",
            url: "https://api.blockcypher.com/v1/btc/main/addrs/"+redeem.addr+"?unspentOnly=true&includeScript=true",
            dataType: "json",
            error: function(data) {
              $("#redeemFromStatus").removeClass('hidden').html(msgError);
              $("#redeemFromBtn").html("Load").attr('disabled',false);
            },
            success: function(data) {
              if (coinjs.debug) {console.log(data)};
              if ((data.txrefs)){
                $("#redeemFromAddress").removeClass('hidden').html(
                  '<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="https://api.blockcypher.com/v1/btc/main/addrs/"'+
                  redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
                for(i = 0; i < data.txrefs.length; ++i){
                  var o = data.txrefs[i];
                  var tx = ""+o.tx_hash;
                  if(tx.match(/^[a-f0-9]+$/)){
                    var n = o.tx_output_n;
                    var script = (redeem.type == "multisig__") ? $("#redeemFrom").val() : o.script;
                    var amount = (o.value /100000000).toFixed(8);;
                    addOutput(tx, n, script, amount);
                  }
                }
              } else {
                $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
              }
            },
            complete: function(data, status) {
              $("#redeemFromBtn").html("Load").attr('disabled',false);
              totalInputAmount();
            }
          });
        },
        "cryptoid": function(redeem){
          $.ajax ({
            type: "GET",
            url: "https://chainz.cryptoid.info/btc/api.dws?q=unspent&key="+coinjs.apikey+"&active="+redeem.addr,
            dataType: "json",
            error: function(data) {
              $("#redeemFromStatus").removeClass('hidden').html(msgError);
              $("#redeemFromBtn").html("Load").attr('disabled',false);
            },
            success: function(data) {
              if (coinjs.debug) {console.log(data)};
              if ((data.unspent_outputs)){
                $("#redeemFromAddress").removeClass('hidden').html(
                  '<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="https://chainz.cryptoid.info/ppc/address.dws?'+
                  redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
                for(i = 0; i < data.unspent_outputs.length; ++i){
                  var o = data.unspent_outputs[i];
                  var tx = ""+o.tx_hash;
                  if(tx.match(/^[a-f0-9]+$/)){
                    var n = o.tx_ouput_n;
                    var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : o.script;
                    var amount = (o.value /100000000).toFixed(8);;
                    addOutput(tx, n, script, amount);
                  }
                }
              } else {
                $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
              }
            },
            complete: function(data, status) {
              $("#redeemFromBtn").html("Load").attr('disabled',false);
              totalInputAmount();
            }
          });
        },
        "coinb.in": function(redeem){
          $.ajax ({
            type: "GET",
            url: coinjs.host+'?uid='+coinjs.uid+'&key='+coinjs.key+'&setmodule=addresses&request=unspent&address='+redeem.addr+'&r='+Math.random(),
            dataType: "xml",
            error: function(data) {
              if (coinjs.debug) {console.log(data)};
              $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs!');
            },
            success: function(data) {
              if (coinjs.debug) {console.log(data)};
              if ($(data).children("request").children("result").text()){
                $("#redeemFromAddress").removeClass('hidden').html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address '+redeem.addr+'');
                $.each($(data).children("request").children("unspent").children(), function(i,o){
                  var tx = (($(o).find("tx_hash").text()).match(/.{1,2}/g).reverse()).join("")+'';
                  var n = $(o).find("tx_output_n").text();
                  var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : $(o).find("script").text();
                  var amount = (($(o).find("value").text()*1)/("1e"+coinjs.decimalPlaces)).toFixed(coinjs.decimalPlaces);

                  addOutput(tx, n, script, amount);
                });
              } else {
                $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
              }
            },
            complete: function(data, status) {
              $("#redeemFromBtn").html("Load").attr('disabled',false);
              totalInputAmount();
            }
          });
        },
      },
      broadcast: {
        "blockcypher": function(thisbtn){
          var orig_html = $(thisbtn).html();
          $(thisbtn).html('Please wait, loading... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>').attr('disabled',true);
          $.ajax ({
            type: "POST",
            url: "https://api.blockcypher.com/v1/btc/main/txs/push?token=c351f5d9782543b8b0416b8dff76b8e2",
            data: JSON.stringify({"tx":$("#rawTransaction").val()}),
            dataType: "json",
            error: function(data) {
              var r = '';
              r += (data.data) ? data.data : '';
              r += (data.message) ? ' '+data.message : '';
              r = (r!='') ? r : ' Failed to broadcast. Internal server error';
              $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
            },
            success: function(data) {
              if(data.tx.hash){
                $("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' Txid: '+data.tx.hash);
              } else {
                $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
              }
            },
            complete: function(data, status) {
              $("#rawTransactionStatus").fadeOut().fadeIn();
              $(thisbtn).html(orig_html).attr('disabled',false);
            }
          });
        },
        "coinb.in": function(thisbtn){ 
          var orig_html = $(thisbtn).html();    
          $(thisbtn).html('Please wait, loading... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>').attr('disabled',true);
          $.ajax ({
            type: "G",
            url: coinjs.host+'?uid='+coinjs.uid+'&key='+coinjs.key+'&setmodule=bitcoin&request=sendrawtransaction',
            data: {'rawtx':$("#rawTransaction").val()},
            dataType: "xml",
            error: function(data) {
              $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(" There was an error submitting your request, please try again").prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
            },
            success: function(data) {
              $("#rawTransactionStatus").html(unescape($(data).find("response").text()).replace(/\+/g,' ')).removeClass('hidden');
              if($(data).find("result").text()==1){
                $("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger');
                $("#rawTransactionStatus").html('txid: '+$(data).find("txid").text());
              } else {
                $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span> ');
              }
            },
            complete: function(data, status) {
              $("#rawTransactionStatus").fadeOut().fadeIn();
              $(thisbtn).html(orig_html).attr('disabled',false);        
            }
          });
        }
      },
      getTransaction: {
        "blockcypher": function(txid, index, callback) {
          $.ajax ({
            type: "GET",
            url: "https://api.blockcypher.com/v1/btc/main/txs/"+txid+"?includeHex=true",
            dataType: "json",
            error: function(data) {
              callback(false);
            },
            success: function(data) {
              if (coinjs.debug) {console.log(data)};
              if (data.hex){
                callback([data.hex,index]);
              } else {
                callback(false);
              }
            }
          });
        }
      },
      getInputAmount: {
        "blockcypher": function(txid, index, callback) {
          $.ajax ({
            type: "GET",
            url: "https://api.blockcypher.com/v1/btc/main/txs/"+txid,
            dataType: "json",
            error: function(data) {
              callback(false);
            },
            success: function(data) {
              if (coinjs.debug) {console.log(data)};
              if (data.outputs && data.outputs[index]){
                callback(parseInt(data.outputs[index].value, 10));
              } else {
                callback(false);
              }
            }
          });
        },
      }
    },litecoin: {
      listUnspent: {
        "chain.so": function(redeem){
          $.ajax ({
            type: "GET",
            url: "//chain.so/api/v2/get_tx_unspent/ltc/"+redeem.addr,
            //https://chain.so/api/v2/get_tx_unspent/DOGE/DRapidDiBYggT1zdrELnVhNDqyAHn89cRi
            dataType: "json",
            error: function(data) {
              $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs!');
            },
            success: function(data) {
              if (coinjs.debug) {console.log(data)};
              if((data.status && data.data) && data.status=='success'){
                $("#redeemFromAddress").removeClass('hidden').html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="//btc.blockr.io/address/info/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
                for(var i in data.data.txs){
                  var o = data.data.txs[i];
                  var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : o.script_hex;

                  addOutput(o.txid, o.output_no, script, o.value);
                }
              } else {
                $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
              }
            },
            complete: function(data, status) {
              $("#redeemFromBtn").html("Load").attr('disabled',false);
              totalInputAmount();
            }
          });
        }
      },
      broadcast: {
      }
    },
  };

  //add for these also!
  //ltc
  //doge
  //bay
  //blk
  

var chainsoBasedExplorer = {
    listUnspent: {
        "chain.so": function(redeem){
          $.ajax ({
            type: "GET",
            url: "//chain.so/api/v2/get_tx_unspent/"+coinjs.symbul+"/"+redeem.addr,
            //https://chain.so/api/v2/get_tx_unspent/DOGE/DRapidDiBYggT1zdrELnVhNDqyAHn89cRi
            //https://sochain.com/address/DOGE/A1gNPTbqS8LpvuSCGgyGhoLAZ3o7KuXwiR
            dataType: "json",
            error: function(data) {
              $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs!');
            },
            success: function(data) {
              if (coinjs.debug) {console.log(data)};
              if((data.status && data.data) && data.status=='success'){
                $("#redeemFromAddress").removeClass('hidden').html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="//btc.blockr.io/address/info/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
                for(var i in data.data.txs){
                  var o = data.data.txs[i];
                  var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : o.script_hex;

                  addOutput(o.txid, o.output_no, script, o.value);
                }
              } else {
                $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
              }
            },
            complete: function(data, status) {
              $("#redeemFromBtn").html("Load").attr('disabled',false);
              totalInputAmount();
            }
          });
        }
      },
  };



/*

/* list unspent transactions 
    r.listUnspent = function(address, callback) {
      coinjs.ajax('https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=unspent&active='+address, callback, "GET");
    }

    /* list transaction data 
    r.getTransaction = function(txid, callback) {
      coinjs.ajax('https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=unspent&active='+txid+'&r='+Math.random(), callback, "GET");
    }

    */

var CryptoidBasedExplorer = {
  
  getBalance: {
    "cryptoid": function(address){
      this.apikey = "1205735eba8c";
      this.address_balance = 0;
      this.api_getbalance = "//chainz.cryptoid.info/"+coinjs.symbol+"/api.dws?key="+this.apikey+"&q=getbalance&a="+address;


          //url : "//chainz.cryptoid.info/"+coinjs.symbol+"/api.dws?key="+this.apikey+"&q=getbalance&a="+address,
          //url : "https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=getbalance&a=BM1NK84mhsbFSjtpwyvG5fhZRuoNwpGeWu",
          //https://chainz.cryptoid.info/blk/address.dws?BM1NK84mhsbFSjtpwyvG5fhZRuoNwpGeWu
/*
var hej = coinjs.ajax(testurl, (data) => {

  console.log(data);
          });
*/

          
          var testurl = "https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=getbalance&a=BM1NK84mhsbFSjtpwyvG5fhZRuoNwpGeWu";
          var hej = coinjs.ajax(api_getbalance, (data) => {
              
            if (data) {
              var bal = JSON.parse(data);
              this.address_balance = bal;
              $("#walletBalance").html(bal + " " + coinjs.symbol).attr('rel',bal).fadeOut().fadeIn();
            } else
              $("#walletBalance").html("0.0 "+ coinjs.symbol).attr('rel',bal).fadeOut().fadeIn();

            //reduce the amount of API calls: add this to checkURLTime so we dont overload APIs

          }/*, 'GET'*/);
          


      }
    },
  listUnspent: {
    "cryptoid": function(redeem){
        $.ajax ({
          type: "GET",
          url: "https://chainz.cryptoid.info/"+coinjs.symbol+"/api.dws?q=unspent&key="+this.apikey+"&active="+redeem.addr,  //icee fix api key relation
          dataType: "json",
          error: function(data) {
            $("#redeemFromStatus").removeClass('hidden').html(msgError);
            $("#redeemFromBtn").html("Load").attr('disabled',false);
          },
          success: function(data) {
            if (coinjs.debug) {console.log(data)};
            if ((data.unspent_outputs)){
              $("#redeemFromAddress").removeClass('hidden').html(
                '<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="https://chainz.cryptoid.info/'+coinjs.symbol+'/address.dws?'+
                redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
              for(i = 0; i < data.unspent_outputs.length; ++i){
                var o = data.unspent_outputs[i];
                var tx = ""+o.tx_hash;
                if(tx.match(/^[a-f0-9]+$/)){
                  var n = o.tx_ouput_n;
                  var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : o.script;
                  var amount = (o.value /100000000).toFixed(8);;
                  addOutput(tx, n, script, amount);
                }
              }
            } else {
              $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
            }
          },
          complete: function(data, status) {
            $("#redeemFromBtn").html("Load").attr('disabled',false);
            totalInputAmount();
          }
        });
      }
    },
    broadcast: {
    "cryptoid": function(redeem){
        $.ajax ({
          type: "POST",
          url: "https://chainz.cryptoid.info/"+coinjs.symbol+"/api.dws?q=pushtx&key="+this.apikey,
          //url: "https://chainz.cryptoid.info/ppc-test/api.dws?q=pushtx&key="+this.apikey,
          data: $("#rawTransaction").val(), //{"tx_hex":$("#rawTransaction").val()},
          dataType: "text", //"json",

          error: function(data, status, error) {
            console.log('broadcast cryptoid: error');
            console.log('data: ', data);
            console.log('data: ', status);
            console.log('data: ', error);
            var obj = data.responseText; //$.parseJSON(data.responseText);
            var r = '';
            r += obj.length ? obj : '';//(obj.data.tx_hex) ? obj.data.tx_hex : '';
            r = (r!='') ? r : ' Failed to broadcast'; // build response
            $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
          },
            success: function(data) {
            //var obj = data.responseText; //$.parseJSON(data.responseText);
            console.log('broadcast cryptoid: succes');
            console.log('data: ', data);
            if(data.length){
              $("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' Txid: '+data);
            } else {
              $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
            }
          },
          complete: function(data, status) {
            $("#rawTransactionStatus").fadeOut().fadeIn();
            $(thisbtn).val('Submit').attr('disabled',false);
          }
        });
      }
    },
    /*



    iceee not finished yet
    getInputAmount: {
    "cryptoid": function(endpoint) {
      return function(txid, index, callback) {
        $.ajax ({
          type: "GET",
          url: "https://chainz.cryptoid.info/"+coinjs.symbil+"/api.dws?q=txinfo&key="+this.apikey+"&t="+txid,
          dataType: "json",
          error: function(data) {
            callback(false);
          },
          success: function(data) {
            if (coinjs.debug) {console.log(data)};
            if (data.outputs.length > index) {
              callback(parseInt(data.outputs[index].amount*("1e"+coinjs.decimalPlaces), 10));
            } else {
              callback(false);
            }

          },
        });

      }
    }
  },
  */
}

var iquidusBasedExplorer = {
    listUnspent: function(endpoint) {
      return function(redeem){
        var msgSucess = '<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="' + endpoint + '/ext/listunspent/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>'
        var msgError = '<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs! Is <a href="' + endpoint + '/">' + endpoint + '/</a> down?';
        $.ajax ({
          type: "GET",
          url: "" + endpoint + "/ext/listunspent/"+redeem.addr,
          dataType: "json",
          error: function(data) {
            $("#redeemFromStatus").removeClass('hidden').html(msgError);
            $("#redeemFromBtn").html("Load").attr('disabled',false);
          },
          success: function(data) {
            if (coinjs.debug) {console.log(data)};
            if ((data.unspent_outputs)){
              $("#redeemFromAddress").removeClass('hidden').html(
                '<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="'+endpoint+'/ext/listunspent/'+
                redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
              for(i = 0; i < data.unspent_outputs.length; ++i){
                var o = data.unspent_outputs[i];
                var tx = ""+o.tx_hash;
                if(tx.match(/^[a-f0-9]+$/)){
                  var n = o.tx_ouput_n;
                  var script = (redeem.type=="multisig__") ? $("#redeemFrom").val() : o.script;
                  var amount = (o.value /100000000).toFixed(8);;
                  addOutput(tx, n, script, amount);
                }
              }
            } else {
              $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
            }
          },
          complete: function(data, status) {
            $("#redeemFromBtn").html("Load").attr('disabled',false);
            totalInputAmount();
          }
        });
      }
    },
    getTransaction: function(endpoint) {
      return function(txid, index, callback){
                   var msgSucess = '<span class="glyphicon glyphicon-info-sign"></span> Retrieved transaction info from txid <a href="' + endpoint + '/ext/txinfo/'+txid+'" target="_blank">'+txid+'</a>'
                   var msgError = '<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs! Is <a href="' + endpoint + '/">' + endpoint + '/</a> down?';
          $.ajax ({
            type: "GET",
            url: "" + endpoint + "/api/getrawtransaction?txid="+txid,
            dataType: "text",
            error: function(data) {
              $("#redeemFromStatus").removeClass('hidden').html(msgError);
              $("#redeemFromBtn").html("Load").attr('disabled',false);
            },
            success: function(data) {
              if (coinjs.debug) {console.log(data)};
              if (data){
                callback([data,index]);
              } else {
                $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve transation info');
                callback(false);
              }
            }
//,
//              complete: function(data, status) {
//                $("#redeemFromBtn").html("Load").attr('disabled',false);
//                totalInputAmount();
//              }
          });
        }
      },
    getInputAmount: function(endpoint) {
      return function(txid, index, callback) {
        $.ajax ({
          type: "GET",
          url: "" + endpoint + "/ext/txinfo/"+txid,
          dataType: "json",
          error: function(data) {
            callback(false);
          },
          success: function(data) {
            if (coinjs.debug) {console.log(data)};
            var result = false;
            for(var i=0;i<data.outputs.length;i++){
              if (data.outputs[i].n == index) {result=data.outputs[i].amount/100};
            }
            callback(result);
          },
        });
      }
    },
    broadcast: function(endpoint) {
      return function(thisbtn){
        var orig_html = $(thisbtn).html();
        $(thisbtn).html('Please wait, loading... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>').attr('disabled',true);
        $.ajax ({
          type: "GET",
          url: "" + endpoint + "/api/sendrawtransaction?hex="+$("#rawTransaction").val(),
          dataType: "text", //"json",
          error: function(data, status, error) {
            var obj = data.responseText; //$.parseJSON(data.responseText);
            var r = '';
            r += obj.length ? obj : '';//(obj.data.tx_hex) ? obj.data.tx_hex : '';
            r = (r!='') ? r : ' Failed to broadcast'; // build response 
            $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
          },
            success: function(data) {
            //var obj = data.responseText; //$.parseJSON(data.responseText);
            if(data.length){
              $("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' Txid: '+data);
            } else {
              $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
            }
          },
          complete: function(data, status) {
            $("#rawTransactionStatus").fadeOut().fadeIn();
            $(thisbtn).html(orig_html).attr('disabled',false);        
          }
        });
      }
    }
  };

  var peerBlockbookBasedExplorer = {
    listUnspent: function(endpoint) {
      return function(redeem){
        var msgSucess = '<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="' + endpoint + '/ext/listunspent/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>'
        var msgError = '<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs! Is <a href="' + endpoint + '/">' + endpoint + '/</a> down?';
        $.ajax ({
          type: "GET",
          url: "" + endpoint + "/api/utxo/"+redeem.addr,
          dataType: "json",
          error: function(data) {
            $("#redeemFromStatus").removeClass('hidden').html(msgError);
            $("#redeemFromBtn").html("Load").attr('disabled',false);
          },
          success: function(data) {
            if (coinjs.debug) {console.log(data)};
            if ((data)){
              $("#redeemFromAddress").removeClass('hidden').html(
                '<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="'+endpoint+'/ext/listunspent/'+
                redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
              var utxos = data;
              var calcCount = 0;
              for(k = utxos.length - 1; k >= 0; --k){
                $.ajax ({
                  type: "GET",
                  url: "" + endpoint + "/api/tx/"+utxos[k].txid,
                  dataType: "json",
                  error: function(data) {
                  },
                  success: function(data) {
                    for (i = 0 ; i < utxos.length ; i ++){
                      if (utxos[i].txid == data.txid){
                        break;
                      }
                    }
                    var utxo = utxos[i];
                    var tx = ""+utxo.txid;
                    if(tx.match(/^[a-f0-9]+$/)){
                      var n = utxo.vout;
                      var script = (redeem.redeemscript==true) ? redeem.decodedRs : data.vout[utxo.vout].scriptPubKey.hex;
                      var amount = (utxo.satoshis /100000000).toFixed(8);
                      addOutput(tx, n, script, amount);
                    }

                    calcCount ++;
                  },
                  complete: function(data, status) {
                    if (calcCount == utxos.length) {
                      $("#redeemFromBtn").html("Load").attr('disabled',false);
                      totalInputAmount();
                    }
                  }
                });
              }
            } else {
              $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
            }
          },
          complete: function(data, status) {
            $("#redeemFromBtn").html("Load").attr('disabled',false);
            totalInputAmount();
          }
        });
      }
    },
    getTransaction: function(endpoint) {
      return function(txid, index, callback){
                   var msgSucess = '<span class="glyphicon glyphicon-info-sign"></span> Retrieved transaction info from txid <a href="' + endpoint + '/ext/txinfo/'+txid+'" target="_blank">'+txid+'</a>'
                   var msgError = '<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs! Is <a href="' + endpoint + '/">' + endpoint + '/</a> down?';
          $.ajax ({
            type: "GET",
            url: "" + endpoint + "/api/tx/"+txid,
            dataType: "json",
            error: function(data) {
              $("#redeemFromStatus").removeClass('hidden').html(msgError);
              $("#redeemFromBtn").html("Load").attr('disabled',false);
            },
            success: function(data) {
              if (coinjs.debug) {console.log(data)};
              if (data.hex){
                callback([data.hex,index]);
              } else {
                $("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve transation info');
                callback(false);
              }
            }
            ,
              complete: function(data, status) {
                $("#redeemFromBtn").html("Load").attr('disabled',false);
                totalInputAmount();
              }
          });
        }
      },
    getInputAmount: function(endpoint) {
      return function(txid, index, callback) {
        $.ajax ({
          type: "GET",
          url: "" + endpoint + "/api/tx/"+txid,
          dataType: "json",
          error: function(data) {
            callback(false);
          },
          success: function(data) {
            if (coinjs.debug) {console.log(data)};
            var result = false;
            for(var i=0;i<data.vout.length;i++){
              if (data.vout[i].n == index) {result=data.vout[i].value*1000000};
            }
            callback(result);
          },
        });
      }
    },
    broadcast: function(endpoint) {
      return function(thisbtn){
        var orig_html = $(thisbtn).html();
        $(thisbtn).html('Please wait, loading... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>').attr('disabled',true);
        $.ajax ({
          type: "POST",
          url: "" + endpoint + "/api/sendtx/",
          data: $("#rawTransaction").val(),
          dataType: "text", //"json",
          error: function(data, status, error) {
            var obj = data.responseText; //$.parseJSON(data.responseText);
            var r = '';
            r += obj.length ? obj : '';//(obj.data.tx_hex) ? obj.data.tx_hex : '';
            r = (r!='') ? r : ' Failed to broadcast'; // build response 
            $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
          },
          success: function(data) {
            var obj = $.parseJSON(data);
            if(obj.result){
              $("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' Txid: '+obj.result);
            } else {
              $("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
            }
          },
          complete: function(data, status) {
            $("#rawTransactionStatus").fadeOut().fadeIn();
            $(thisbtn).html(orig_html).attr('disabled',false);        
          }
        });
      }
    }
  };



  /*
  @ Network Settings
  */
  wally_fn.setAsset = function (network) {
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

    if (network == "btc-mainnet") {
      coinjs.asset = 'Bitcoin';
      coinjs.symbol = 'BTC';      //ticker
      coinjs.pub = 0x00;      //wif
      coinjs.priv = 0x80;     //pubKeyHash
      coinjs.multisig = 0x05; //scriptHash
        coinjs.hdkey = {'prv':0x0488ade4, 'pub':0x0488b21e};
        coinjs.bech32 = {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'bc'};
        coinjs.supports_address = ['compressed', 'uncompressed', 'bech32', 'segwit'];
      coinjs.api = {
        "mainnet": {
          "btc": {
            "utxo": {
              "blockchain.info": {
                "url": "https://chainz.cryptoid.info/btc/api.dws?key=1205735eba8c&q=unspent&active={address}",
                "callback": "",
                "method": "get",
                "params": {
                  //"key": "1205735eba8c",
                  //"q": "unspent",
                  "active": "address"
                }
              }
            },
            "transactions": {
              "blockchain.info": {
                "url": "https://chainz.cryptoid.info/btc/api.dws?key=1205735eba8c&q=unspent&active={txid}&r={Math.random()}",
                "callback": "",
                "method": "get",
                "params": {
                  //"key": "1205735eba8c",
                  //"q": "unspent",
                  "active": "txid",
                  "r": "Math.random()"
                }
              }
            },
            "broadcast": {
              "blockchain.info": {
                "url": "https://chainz.cryptoid.info/btc/api.dws?q=pushtx&key=1205735eba8c&data={txhex}",
                "callback": "",
                "method": "post",
                "params": {
                  //"q": "pushtx",
                  //"key": "1205735eba8c",
                  "data": "txhex"
                }
              }
            },
            "blockexplorer": {
              "blockchain.info": {
                "url": "https://chainz.cryptoid.info/btc/tx.dws?${txid}.htm",
                "method": "link",
                "params": {
                  "tx.dws?": "txid"
                }
              }
            }
          },

        },
        "testnet": {

        }

      }

/*

https://www.blockcypher.com/dev/bitcoin/#api-versions

Bitcoin   Main  api.blockcypher.com/v1/btc/main
Bitcoin   Testnet3  api.blockcypher.com/v1/btc/test3
Dash  Main  api.blockcypher.com/v1/dash/main
Dogecoin  Main  api.blockcypher.com/v1/doge/main
Litecoin  Main  api.blockcypher.com/v1/ltc/main
BlockCypher   Test  api.blockcypher.com/v1/bcy/test

https://www.blockcypher.com/dev/bitcoin/#blockchain-api



https://developer.bitaps.com/blockchain


https://mempool.emzy.de/docs/api/rest

https://mempool.emzy.de/testnet/docs/api/rest

***Blockcypher
https://api.blockcypher.com/v1/btc/main/addrs/bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d
https://api.blockcypher.com/v1/btc/main/addrs/bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d


***Blockchain.info
https://www.blockchain.com/explorer/api/blockchain_api

https://blockchain.info/balance?active=bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d
Multi Address
https://blockchain.info/multiaddr?active=bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d|bc1qx49fm4xf70nwqc3mhgd6743q9g0fkdwh9syc2c


https://blockchain.info/unspent?active=bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d
https://blockchain.info/btc-testnet/unspent?active=bc1qldtwp5yz6t4uuhhjcp00hvsmrsfxar2hy09v0d


https://blockchair.com/broadcast


***Chain.so
https://chain.so/api/#code-examples

https://chain.so/api/v2/get_info/DASH
https://chain.so/api/v2/get_info/DASHTEST

https://chain.so/api/v2/get_info/BTC
https://chain.so/api/v2/get_info/BTCTEST
https://chain.so/api/v2/get_info/LTC
https://chain.so/api/v2/get_info/LTCTEST
https://chain.so/api/v2/get_info/DOGETEST
https://chain.so/api/v2/get_info/DOGE
https://chain.so/api/v2/get_address_balance/DOGE/DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1
https://chain.so/api/v2/get_address_received/DOGE/DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1
https://chain.so/api/v2/get_address_spent/DOGE/DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1

https://chain.so/api/v2/get_tx_unspent/DOGE/DRapidDiBYggT1zdrELnVhNDqyAHn89cRi

https://chain.so/api/v2/is_address_valid/DOGE/DM7Yo7YqPtgMsGgphX9RAZFXFhu6Kd6JTT

$ curl https://chain.so/api/v2/get_price/DOGE

$ curl https://chain.so/api/v2/get_price/DOGE/USD

***broadcast
POST /api/v2/send_tx/{NETWORK}
REQUEST

Provide a JSON object which contains the following fields:
tx_hex: string
$ curl -d 'tx_hex=0102100001ac…' https://chain.so/api/v2/send_tx/DOGE


{
  "utxo": {
    "blockchain.info": "https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=unspent&active=+address"
  },
  "transactions": {
    "blockchain.info": "https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=unspent&active=+txid+&r=+Math.random()"
  },
  "broadcast": {
    "blockchain.info": "https://chainz.cryptoid.info/blk/api.dws?q=pushtx&key=1205735eba8c"
  },
  "blockexplorer": {
    "blockchain.info": "https://chainz.cryptoid.info/blk/tx.dws?${txid}.htm"
  }
}
*/

    }
    if (network == "btc-testnet") {
      coinjs.asset = 'Bitcoin-testnet';
      coinjs.symbol = 'BTC-TESTNET';
      coinjs.pub = 0x6f;
      coinjs.priv = 0xef;
      coinjs.multisig = 0xc4;
        coinjs.hdkey = {'prv':0x04358394, 'pub':0x043587cf};
        //coinjs.bech32 = {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'tp'};
        coinjs.supports_address = ['compressed', 'uncompressed', 'bech32', 'segwit'];
    }
    if (network == "ltc-mainnet") {
      coinjs.asset = 'Litecoin';
      coinjs.symbol = 'LTC';
      coinjs.pub = 0x30;
      coinjs.priv = 0xb0;
      coinjs.multisig = 0x32;
        coinjs.hdkey = {'prv':0x019d9cfe, 'pub':0x019da462};
        coinjs.bech32 = {'charset':'qpzry9x8gf2tvdw0s3jn54khce6mua7l', 'version':0, 'hrp':'ltc'};
        coinjs.supports_address = ['compressed', 'uncompressed', 'bech32', 'segwit'];
      coinjs.api = {
        "utxo": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/ltc/api.dws?key=1205735eba8c&q=unspent&active={address}",
            "callback": "",
            "method": "get",
            "params": {
              //"key": "1205735eba8c",
              //"q": "unspent",
              "active": "address"
            }
          }
        },
        "transactions": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/ltc/api.dws?key=1205735eba8c&q=unspent&active={txid}&r={Math.random()}",
            "callback": "",
            "method": "get",
            "params": {
              //"key": "1205735eba8c",
              //"q": "unspent",
              "active": "txid",
              "r": "Math.random()"
            }
          }
        },
        "broadcast": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/ltc/api.dws?q=pushtx&key=1205735eba8c&data={txhex}",
            "callback": "",
            "method": "post",
            "params": {
              //"q": "pushtx",
              //"key": "1205735eba8c",
              "data": "txhex"
            }
          }
        },
        "blockexplorer": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/ltc/tx.dws?${txid}.htm",
            "method": "link",
            "params": {
              "tx.dws?": "txid"
            }
          }
        }
      }
    }
    if (network == "ltc-testnet") {
      coinjs.asset = 'Litecoin-testnet';
      coinjs.symbol = 'LTC-TESTNET';
      coinjs.pub = 0xef;
      coinjs.priv = 0x6f;
      coinjs.multisig = 0xc4;
      coinjs.hdkey = {'prv':0x04358394, 'pub':0x043587cf};
      coinjs.supports_address = ['compressed', 'uncompressed', 'bech32', 'segwit'];
  }
    if (network == "doge-mainnet") {
        coinjs.asset = 'Dogecoin';
        coinjs.symbol = 'DOGE';
        coinjs.pub = 0x1e;
        coinjs.priv = 0x9e;
        coinjs.multisig = 0x16;
        coinjs.hdkey = {'prv':0x089944e4, 'pub':0x0827421e};
        coinjs.supports_address = ['compressed', 'uncompressed'];
    }
    if (network == "doge-testnet") {
        coinjs.asset = 'Dogecoin-testnet';
        coinjs.symbol = 'DOGE-TESTNET';
        coinjs.pub = 0xf1;
        coinjs.priv = 0x71;
        coinjs.multisig = 0xc4;
        coinjs.hdkey = {'prv':0x04358394, 'pub':0x043587cf};
        coinjs.supports_address = ['compressed', 'uncompressed'];
    }
    if (network == "bay-mainnet") {
        coinjs.asset = 'BitBay';
        coinjs.symbol = 'BAY';
        coinjs.pub = 0x19;
        coinjs.priv = 0x99;
        coinjs.multisig = 0x55;
        coinjs.hdkey = {'prv':0x02cfbf60, 'pub':0x02cfbede};
        coinjs.supports_address = ['compressed', 'uncompressed'];
        coinjs.txExtraTimeField = true;
        coinjs.api = {
        "utxo": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/bay/api.dws?key=1205735eba8c&q=unspent&active={address}",
            "callback": "",
            "method": "get",
            "params": {
              //"key": "1205735eba8c",
              //"q": "unspent",
              "active": "address"
            }
          }
        },
        "transactions": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/bay/api.dws?key=1205735eba8c&q=unspent&active={txid}&r={Math.random()}",
            "callback": "",
            "method": "get",
            "params": {
              "key": "1205735eba8c",
              //"q": "unspent",
              "active": "txid",
              "r": "Math.random()"
            }
          }
        },
        "broadcast": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/bay/api.dws?q=pushtx&key=1205735eba8c&data={txhex}",
            "callback": "",
            "method": "post",
            "params": {
              //"q": "pushtx",
              //"key": "1205735eba8c",
              "data": "txhex"
            }
          }
        },
        "blockexplorer": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/bay/tx.dws?${txid}.htm",
            "method": "link",
            "params": {
              "tx.dws?": "txid"
            }
          }
        }
      }
    }
    if (network == "blk-mainnet") {
        coinjs.asset = 'Blackcoin';
        coinjs.symbol = 'BLK';
        coinjs.pub = 0x19;
        coinjs.priv = 0x99;
        coinjs.multisig = 0x55;
        coinjs.hdkey = {'prv':0x488ade4, 'pub':0x488b21e};
        coinjs.supports_address = ['compressed', 'uncompressed'];
        coinjs.txExtraTimeField = true;   //remove after BLK fork!
        coinjs.api = {
        "utxo": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=unspent&active={address}",
            "callback": "",
            "method": "get",
            "params": {
              //"key": "1205735eba8c",
              //"q": "unspent",
              "active": "address"
            }
          }
        },
        "transactions": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=unspent&active={txid}&r={Math.random()}",
            "callback": "",
            "method": "get",
            "params": {
              "key": "1205735eba8c",
              //"q": "unspent",
              "active": "txid",
              "r": "Math.random()"
            }
          }
        },
        "broadcast": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/blk/api.dws?q=pushtx&key=1205735eba8c&data={txhex}",
            "callback": "",
            "method": "post",
            "params": {
              //"q": "pushtx",
              //"key": "1205735eba8c",
              "data": "txhex"
            }
          }
        },
        "blockexplorer": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/blk/tx.dws?${txid}.htm",
            "method": "link",
            "params": {
              "tx.dws?": "txid"
            }
          }
        }
      }
    }

    if (network == "blk-testnet") {
        coinjs.asset = 'Blackcoin-testnet';
        coinjs.symbol = 'BLK-TESTNET';
        coinjs.pub = 0x6f;
        coinjs.priv = 0xef;
        coinjs.multisig = 0xc4;
        coinjs.hdkey = {'prv':0x04358394, 'pub':0x043587cf};
        coinjs.supports_address = ['compressed', 'uncompressed'];
        coinjs.api = {
        "utxo": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=unspent&active={address}",
            "callback": "",
            "method": "get",
            "params": {
              //"key": "1205735eba8c",
              //"q": "unspent",
              "active": "address"
            }
          }
        },
        "transactions": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/blk/api.dws?key=1205735eba8c&q=unspent&active={txid}&r={Math.random()}",
            "callback": "",
            "method": "get",
            "params": {
              "key": "1205735eba8c",
              //"q": "unspent",
              "active": "txid",
              "r": "Math.random()"
            }
          }
        },
        "broadcast": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/blk/api.dws?q=pushtx&key=1205735eba8c&data={txhex}",
            "callback": "",
            "method": "post",
            "params": {
              //"q": "pushtx",
              //"key": "1205735eba8c",
              "data": "txhex"
            }
          }
        },
        "blockexplorer": {
          "blockchain.info": {
            "url": "https://chainz.cryptoid.info/blk/tx.dws?${txid}.htm",
            "method": "link",
            "params": {
              "tx.dws?": "txid"
            }
          }
        }
      }
    }

    
    if (network == "lynx-mainnet") {
        coinjs.asset = 'LYNX';
        coinjs.symbol = 'LYNX';
        coinjs.pub = 0xad;
        coinjs.priv = 0x2d;
        coinjs.multisig = 0x32;
        coinjs.hdkey = {'prv':0x0488ade4, 'pub':0x0488b21e};
        coinjs.supports_address = ['compressed', 'uncompressed'];
    }

        console.log('coinjs.pub: ' +coinjs.pub);
        console.log('coinjs.priv: ' +coinjs.priv);
        console.log('coinjs.multisig: ' +coinjs.multisig);
        console.log('coinjs.hdkey: ', coinjs.hdkey);
        console.log('coinjs.bech32: ', coinjs.bech32);
        console.log('coinjs.supports_address: ', coinjs.supports_address);


    
  }

})();


