'use strict';
(function() {
  var custom = window.custom = function() {};
  /*
  @ Show Modal
  @title, @message
  */
  custom.showModal = function(_title_, _message_, _content_type_ = '', options = {}) {
    if(_content_type_) //primary, secondary, warning, danger, success, info    (as in bootstrap types)
      _message_ = '<div class="alert alert-' + _content_type_ + '">' + _message_ + '</div>';
    var dialogConfig = {
      title: _title_,
      message: _message_,
      cssClass: 'modal-dialog-scrollable text-bold',
      verticalCentered: true,
      closeByBackdrop: false,
      closeByKeyboard: false,
      buttons: [{
        label: 'Close',
        cssClass: 'btn-sm btn-flat-primary',
        action: function(dialogRef) {
          dialogRef.close();
        }
      }]
    };
    //show cancel button if set
    if(options.buttons && options.buttons.cancel) {
      dialogConfig.buttons.unshift({
        label: 'Cancel',
        cssClass: 'btn-sm btn-flat-secondary',
        action: function(dialogRef) {
          dialogRef.close();
        }
      });
    }
    var dialog = new BootstrapDialog.show(dialogConfig);
    /*if (options.buttons?.cancel)
      //dont add cancel in the buttons for the dialog

    var dialog = new BootstrapDialog.show({
          title: _title_,
          message: _message_,
          //size: BootstrapDialog.SIZE_SMALL,     //<--works as modal-sm
          //size: BootstrapDialog.SIZE_WIDE,    //<--works as modal-lg
          //size: BootstrapDialog.SIZE_EXTRAWIDE,       //<--works as modal-xl
         
         //type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

          closable: true,
          //cssClass: 'modal-dialog-scrollable animate__animated animate__zoomIn',  //modal-dialog-centered, modal-dialog-scrollable, modal-sm, modal-lg, modal-xl
          cssClass: 'modal-dialog-scrollable text-bold',  //modal-dialog-centered, modal-dialog-scrollable, modal-sm, modal-lg, modal-xl
          verticalCentered:true,
          
          closeByBackdrop: false,   //You can not close this dialog by clicking outside or pressing ESC key
          closeByKeyboard: false,

          buttons: [
          {
              label: 'Cancel',
              cssClass: 'btn-sm btn-flat-secondary',
              action: function(dialogRef){
                  dialogRef.close();
              }
          },
           {
              label: 'Close',
              cssClass: 'btn-sm btn-flat-primary',
              action: function(dialogRef){
                  dialogRef.close();
              }
          }]

      });
    */
  };

// Fetch and process data from the Komodo API with the current timestamp
custom.fetchAndFilterKomodoData = async function () {
    const currentTimestamp = Date.now(); // Get the current timestamp in milliseconds
    const apiUrl = `https://electrum-status.dragonhound.info/api/v1/electrums_status?_=${currentTimestamp}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Filter the data,
        // for nowwe only need Electrum category  and TCP/SSL protocols
        const filteredData = data.filter(item =>
            item.category === "Electrum" &&
            (item.protocol === "TCP" || item.protocol === "SSL") &&
            item.result === "Passed" && 
            !item.coin.includes("-") // Exclude coins with a '-' in their name
        );

        console.log("Filtered Data:", filteredData);

        // Export the filtered data as a JSON file
        //custom.exportToJsonFile(filteredData, "komodo_filtered_data.json");
        custom.exportToJsonFile(filteredData, "komodo_filtered_data.json");
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}

// Function to export JSON data to a file
custom.exportToJsonFile = function (data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// KOMODO script, filter out dead nodes
//custom.fetchAndFilterKomodoData();




  $(document).ready(function() {



    //Customized JS
    $(".choose-currency-modal").on("click", function() {
      var modalPosition = $(this).attr('data-modal-position');
      if(modalPosition == 'top') {
        //slideDownBigIn
        $('#modalChangeAsset').removeClass('animate__fadeInUp').addClass('animate__fadeInDown').find('.modal-dialog').removeClass('modal-dialog-end').addClass('modal-dialog-top');
      } else {
        //slideUpBigIn
        $('#modalChangeAsset').addClass('animate__fadeInUp').removeClass('animate__fadeInDown').find('.modal-dialog').removeClass('modal-dialog-top').addClass('modal-dialog-end');
      }
      $('#modalChangeAsset').modal('show');
      $('#modalChangeAsset input.search_asset').trigger('focus');
    });
    //Modal dialog handler for seting a new currency on bottom menu
    $('body').on('click', '#modalChangeAsset .custom-table tbody tr', function(e) {
      //$("#modalChangeAsset .custom-table tbody tr").on("click", function(e) {
      //update the asset-value to checked in modal dialog content
      this.querySelector('input[name="set-asset-group"]').checked = true;
      var change_to_asset = $(this).attr("data-asset");
      console.log('**modalChangeAsset - set new asset:', change_to_asset);
      $('#modalChangeAsset').modal('hide');
      //update settings
      wally_kit.quickSetAsset(change_to_asset);
    });
    $("#modalChangeAsset input.search_asset").on("keyup input click", function(e) {
      e.preventDefault();
      console.log('**input.search_asset: keyup input click  : 1');
      //filter table
      var search_asset = $(this).val().toLowerCase();
      $("#modalChangeAsset table tr").filter(function() {
        var _trThis_ = $(this);
        _trThis_.toggle(_trThis_.text().toLowerCase().indexOf(search_asset) > -1)
      });
    });
    /*
     @ Clear input functionality
    */
    //Input with clear icon
    $('.has-clear input[type="text"]').on('input propertychange', function(e) {
      e.preventDefault();
      var $this = $(this);
      var visible = Boolean($this.val());
      $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
      console.log('**input.has-clear');
    }).trigger('propertychange');
    $('.form-control-clear').click(function(e) {
      $(this).siblings('input[type="text"]').val('').trigger('propertychange').click();
      //$(this).prev().click(); //we need another click to clear the filter (search in table etc..)
    });
    //Menu-Panel
    //Left and Right Mobile Navigation Panel
    // loop all zeynepjs menus for initialization
    /*
    $('.zeynep').each(function () {
      // init zeynepjs side menu
      $(this).zeynep({
        opened: function (el) {
          // log
          console.log(el.attr('data-menu-name') + ' side menu opened')
        },
        closed: function (el) {
          // log
          console.log(el.attr('data-menu-name') + ' side menu closed')
        }
      })
    });
    */
    // handle zeynepjs overlay click
    /*
    $('.zeynep-overlay').on('click', function () {
      // close all zeynepjs menus
      $('.zeynep.opened').each(function () {
        $(this).data('zeynep').close()
      })
    });
    */
    var leftPanel = $('.zeynep.left-panel').zeynep({
      load: function(element, options) {
        console.log('zeynepjs left menu is successfully loaded')
      }
    });
    var rightPanel = $('.zeynep.right-panel').zeynep({
      load: function(element, options) {
        console.log('zeynepjs right menu is successfully loaded')
      }
    });
    var bodyZeynep = $('body.zeynep-initialized');
    $('body').on('click', '.modal-backdrop', function(e) {
      console.log('modal-backdrop.show');
      if(bodyZeynep.hasClass('zeynep-opened')) {
        //$(".modal-backdrop").hide();
        coinbinf.backdrop(false);
        console.log('remove modal-backdrop.show');
        leftPanel.close();
        rightPanel.close();
        //$('.zeynep.opened').each(function () { $(this).data('zeynep').close() });
      }
    });
    // open left zeynepjs side menu
    $('.panel_drawer.left-panel').on('click', function() {
      //$('.zeynep.left-panel').data('zeynep').open();
      leftPanel.open();
      //$("body").append("<div class='modal-backdrop fade show'></div>");
      coinbinf.backdrop();
    });
    // open right zeynepjs side menu
    $('.panel_drawer.right-panel').on('click', function() {
      //$('.zeynep.right-panel').data('zeynep').open();
      rightPanel.open();
      //$("body").append("<div class='modal-backdrop fade show'></div>");
      coinbinf.backdrop();
    });
    /*
    //$('body').on('click', '.zeynep.right-panel.opened  a', function(e){
    $('.zeynep.right-panel a').on('click', function (e) {
      if ((this.hash).charAt(0) == '#')
        rightPanel.close();
    });
    */
    $('.zeynep.left-panel a, .zeynep.right-panel a').on('click', function(e) {
      //console.log('hassssssssssh clicked', e);
      //console.log('hassssssssssh clicked', $(e));
      //console.log('hassssssssssh this', this.hash);
      //console.log ('href: ',  $(e).attr('href') );
      //console.log ('href: ',  e.attr('href') );
      console.log('=====.zeynep.left-panel a, .zeynep.right-panel a')
      console.log('this.hash: ', this.hash)
      console.log('this.hash.length: ', this.hash.length)
      if((this.hash).length > 1) {
        console.log('close......................');
        console.log('leftPanel: ', leftPanel);
        console.log('rightPanel: ', rightPanel);
        leftPanel.close();
        rightPanel.close();
        //$(".modal-backdrop").hide();
        coinbinf.backdrop(false);
      }
    });
    /*
    leftPanel.on('closed', function(el, opt, det) {
      //$(".modal-backdrop").hide();
      console.log('el: ', el);
      console.log('opt: ', opt);
      console.log('det: ', det);
      console.log('leftPanel closing');
    });
    rightPanel.on('closed', function(el, opt, det) {
      //$(".modal-backdrop").hide();
      console.log('el: ', el);
      console.log('opt: ', opt);
      console.log('det: ', det);

      console.log('rightPanel closing');
    });

    leftPanel.on('opening', function(el, opt, det) {
      console.log('el: ', el);
      console.log('opt: ', opt);
      console.log('det: ', det);
      if (det.subMenu == false)
        leftPanel.close();
    });
    rightPanel.on('opening', function(el, opt, det) {
      console.log('el: ', el);
      console.log('opt: ', opt);
      console.log('det: ', det);
      if (det.subMenu == false)
        rightPanel.close();
    });
    */
    /*
    .on('show.bs.popover', function () {
          $("body").append("<div class='modal-backdrop fade show'></div>")
      }).on('hide.bs.popover', function () {
          $(".modal-backdrop").remove();
      });
    */
    /*
    $("#modalChangeAsset .custom-table tbody tr").on('click', function(e) {
      
      this.querySelector('input[name="set-asset-group"]').checked = true;

      
      //console.log('this: ', this);
      //console.log('choosen coin:', this.dataset.setAsset);
      //console.log('choosen coin:', this.attributes['data-set-asset'].nodeValue);

      //console.log('$(e): ', $(e));
      //console.log('e: ', e);
      
      var set_asset = $(this).attr( "data-set-asset");
      console.log('set new asset:', set_asset);

      //update the asset-value to checked in modal dialog content
      var radioEl = this.querySelector('input[name="set-asset-group"]');

    });
    */
    /*
    $(document).on('hide.bs.modal', '.modal.show', function (e) {
    // code to run on closing
    $(this).addClass('animate__backOutDown');
      console.log('animate__backOutDown: ', e.target.modalChangeAsset);
      console.log('animate__backOutDown $(this): ', e.target.id);

      $('#'+e.target.id).addClass('jajajaja');
      $(e).addClass('jajajaj2a');
    });
    */


/**
 * Event handler for the 'shown.bs.modal' event on the #addressInfoModal.
 * This function updates the address information within the modal.
 * @param {object} e - The event object.
 */
$("#addressInfoModal").on('shown.bs.modal', function(e) {
    // Extract the modal ID from the event target
    const modalId = e.target.id;
    console.log('addressInfoModal - update address info!');

    // Select the modal element using its ID
    const modalElement = $('#' + modalId);
    const coin = coinjs.asset.slug;
    const coinSymbol = coinjs.asset.symbol;

    


    // Extract the data values from the related target (element that triggered the modal)
    const dataValues = $(e.relatedTarget);
    console.log('addressInfoModal - update address info: ', dataValues);

    // Extract data attributes from the related target
    var address = dataValues.attr('data-address');
    var blockieicon = dataValues.attr('data-blockieicon');
    var derivedpath = dataValues.attr('data-derived-path');
    var pubkey = dataValues.attr('data-pubkey');
    var privkey = dataValues.attr('data-privkey');
    var privkeyhex = dataValues.attr('data-privkeyhex');

     // Set the modal title text content
    modalElement.find('.bootstrap-dialog-title').text(coinSymbol + ' Address Information');

    //Create QR code
    $("#addressInfoQrCode").text("");
    var qrcode = new QRCode("addressInfoQrCode");
    //qrcode.makeCode("bitcoin:"+address);
    qrcode.makeCode(coin+':'+address);


    // Update the modal content with the extracted data
    modalElement
        .find('[data-adress-info="address"]')
        .find('input.addr').val(address).end()
        .find('img.blockieIcon').attr('src', blockieicon).end().end()
        .find('[data-adress-info="path_type"] input.path_type').val(derivedpath).end()
        .find('[data-adress-info="pubkey"] input.pubkey').val(pubkey).end()
        .find('[data-adress-info="privkey"] input.privkey').val(privkey).end()
        .find('[data-adress-info="privkeyhex"] input.privkeyhex').val(privkeyhex).end()
        .find('[data-adress-info] span[data-copy-content]').each(function () {
            // Find the grandparent of the current span and get its input value
            const grandParent = $(this).parent().parent();
            const inputValue = grandParent.find('input').val();
            // Set the data-copy-content attribute of the current span to the input value
            $(this).attr('data-copy-content', inputValue);
        });


    const coinChain = wally_fn.coinChainIs();

    if (coinChain === 'evm')
      modalElement.find('[data-adress-info="privkey"]').addClass('hidden');
    else
      modalElement.find('[data-adress-info="privkey"]').removeClass('hidden');
});



    /*
    $(document.body).on('shown.bs.modal', function(e) {
      //$('#myModal').removeData('bs.modal')
      //$('#' + e.target.id).addClass('jajajaja');      
    });
    */

    $(document.body).on('hide.bs.modal', '.modal.show', function(e) {
      //$('#myModal').removeData('bs.modal')
      const modalId = e.target.id;
      //console.log('modal hide', e.target.id);
      //const dataValues = $(e.relatedTarget);
      //console.log('modal - e.relatedTarget dataValues: ', e.relatedTarget, dataValues);

    });
    var menuItems = [].slice.call(document.querySelectorAll('.menu__item')),
      menuSubs = [].slice.call(document.querySelectorAll('.wdropdown-menu')),
      selectedMenu = undefined,
      subBg = document.querySelector('.dropdown__bg'),
      subBgBtm = document.querySelector('.dropdown__bg-bottom'),
      subArr = document.querySelector('.dropdown__arrow'),
      subCnt = document.querySelector('.dropdown__wrap'),
      header = document.querySelector('.main-header'),
      contentHolder = document.querySelector('.dropdown-holder'),
      closeDropdownTimeout,
      startCloseTimeout = function() {
        closeDropdownTimeout = setTimeout(() => closeDropdown(), 300);
      },
      stopCloseTimeout = function() {
        clearTimeout(closeDropdownTimeout);
      },
      openDropdown = function(el) {
        //- get menu ID
        var menuId = el.getAttribute('data-dropdown-menu');
        //- get related sub menu
        var menuSub = document.querySelector('.wdropdown-menu[data-dropdown-menu="' + menuId + '"]');
        //if no dropdown menu attribute is provided, exit
        if(menuSub === null || menuSub === undefined) {
          subArr.style.opacity = 0;
          subBg.style.opacity = 0;
          subCnt.style.opacity = 0;
          contentHolder.style.display = 'none';
          closeDropdown();
          return;
        }
        contentHolder.style.display = 'block';
        //- get menu sub content
        var menuSubContent = menuSub.querySelector('.dropdown-menu__content');
        //- get bottom section of current sub
        var menuSubBtm = menuSubContent.querySelector('.bottom-section').getBoundingClientRect();
        //- get height of top section
        var menuSubTop = menuSubContent.querySelector('.top-section').getBoundingClientRect();
        //- get menu position
        var menuMeta = el.getBoundingClientRect();
        //- get sub menu position
        var subMeta = menuSubContent.getBoundingClientRect();
        /*subArr.classList.remove('hidden');
        subBg.classList.remove('hidden');
        subCnt.classList.remove('hidden');
        */
        //- set selected menu
        selectedMenu = menuId;
        //- Remove active Menu
        menuItems.forEach(el => el.classList.remove('active'));
        //- Set current menu to active
        el.classList.add('active');
        //- Remove active sub menu
        menuSubs.forEach(el => el.classList.remove('active'));
        //- Set current menu to active
        menuSub.classList.add('active');
        //- Set dropdown menu background style to match current submenu style
        //position the background within screen
        subBg.style.opacity = 1;
        var subBgLeft = menuMeta.left - (subMeta.width / 2 - menuMeta.width / 2);
        if(subBgLeft > 0) subBg.style.left = subBgLeft + 'px';
        else subBg.style.left = 20 + 'px';
        //position background within screen (if it is outside on right corner)
        //console.log ('subBg.style.left before: '+ subBg.style.left);
        if(subBgLeft + menuSubContent.scrollWidth > window.innerWidth && subBgLeft > 0) {
          subBg.style.left = window.innerWidth - menuSubContent.scrollWidth - 20 + 'px';
          //console.log('out of window.innerWidth', menuSubContent.scrollWidth);
          //console.log ('subBg.style.left after: '+ subBg.style.left);
        }
        //subBg.style.left = menuMeta.left - (subMeta.width / 2 - menuMeta.width / 2) + 'px';
        //console.log('subBg.style.left: ' + subBg.style.left);
        subBg.style.width = subMeta.width + 'px';
        subBg.style.width = menuSubContent.scrollWidth + 'px';
        subBg.style.height = subMeta.height + 'px';
        //- Set dropdown menu bottom section background position
        subBgBtm.style.top = menuSubTop.height + 'px';
        //console.log('menuSubBtm: ', menuSubBtm);
        //- Set Arrow position
        subArr.style.opacity = 1;
        subArr.style.left = menuMeta.left + menuMeta.width / 2 - 10 + 'px';
        //- Set sub menu style
        subCnt.style.opacity = 1;
        //position the content within screen
        var subCntLeft = menuMeta.left - (subMeta.width / 2 - menuMeta.width / 2);
        if(subCntLeft > 0) subCnt.style.left = subCntLeft + 'px';
        else subCnt.style.left = 20 + 'px';
        //console.log('subCnt.style.left: ' + subCnt.style.left);
        if(subCntLeft + menuSubContent.scrollWidth > window.innerWidth && subCntLeft > 0) {
          subCnt.style.left = window.innerWidth - menuSubContent.scrollWidth - 20 + 'px';
          //console.log('out of window.innerWidth', menuSubContent.scrollWidth);
          //console.log ('subCntLeft.style.left after: '+ subCnt.style.left);
        }
        subCnt.style.width = subMeta.width + 'px';
        subCnt.style.width = menuSubContent.scrollWidth + 'px';
        subCnt.style.height = subMeta.height + 'px';
        //position the content within screen
        if(menuSubContent.scrollWidth > window.innerWidth) {
          subBg.style.left = 20 + 'px';
          subCnt.style.left = 20 + 'px';
          subBgBtm.style.left = 20 + 'px';
          subArr.style.left = 20 + 'px';
          subBg.style.width = window.innerWidth - 20 + 'px';
          subCnt.style.width = window.innerWidth - 20 + 'px';
          subBgBtm.style.width = window.innerWidth - 20 + 'px';
          subArr.style.width = window.innerWidth - 20 + 'px';
        }
        /*subBg.classList.remove('hidden');
        subArr.classList.remove('hidden');
        subCnt.classList.remove('hidden');
        */
        //- Set current sub menu style
        menuSub.style.opacity = 1;
        header.classList.add('dropdown-active');
      },
      closeDropdown = function() {
        //- Remove active class from all menu items
        menuItems.forEach(el => el.classList.remove('active'));
        //- Remove active class from all sub menus
        menuSubs.forEach(el => {
          el.classList.remove('active');
          el.style.opacity = 0;
        });
        //- set sub menu background opacity
        subBg.style.opacity = 0;
        //subBg.classList.add('hidden');
        /*subBg.style.width = 0;
        subBg.style.left = 0;*/
        //- set arrow opacity
        subArr.style.opacity = 0;
        //subArr.classList.add('hidden');
        /*subArr.style.width = 0;
        subArr.style.left = 0;*/
        // unset selected menu
        selectedMenu = undefined;
        //
        subCnt.style.opacity = 0;
        //subCnt.classList.add('hidden');
        /*subCnt.style.width = 0;
        subCnt.style.left = 0;*/
        header.classList.remove('dropdown-active');
      };
    //- Binding mouse event to each menu items
    menuItems.forEach(el => {
      //- mouse enter event
      el.addEventListener('mouseenter', function() {
        stopCloseTimeout();
        openDropdown(this);
      }, false);
      //- mouse leave event
      el.addEventListener('mouseleave', () => startCloseTimeout(), false);
    });
    //- Binding mouse event to each sub menus
    menuSubs.forEach(el => {
      el.addEventListener('mouseenter', () => stopCloseTimeout(), false);
      el.addEventListener('mouseleave', () => startCloseTimeout(), false);
      el.querySelectorAll("a").forEach(link => link.addEventListener("click", () => startCloseTimeout(0)));
      /*
      el.querySelector('a').addEventListener('click', function() {
        console.log('===============clicked link')
        startCloseTimeout(0);
      });
      */
    });
    /*pieChart*/
    var pieData = [];
    $(".pieLegend li").each(function(e) {
      pieData.push({
        title: $(this).attr('data-pie-title'),
        value: parseFloat($(this).attr('data-pie-value')),
        color: "#" + Math.random().toString(16).slice(2, 8),
        //color: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
      });
      $(this).find('span.badge').css('background-color', pieData[pieData.length - 1].color);
    });
    var pieChartAllocation = $("#pieChart").drawPieChart(pieData);
    $('#pieChartBox .pieLegend li').hover(function() { // mouse-in
      var attrfor = $(this).attr('data-pie-title');
      if(attrfor !== undefined) $('#pieChart path.lightPie[data-pie-title="' + attrfor + '"]').click();
      /*$(this).css("background-color", "blue");
      $(this).html('Hovered!');
      */
    }, function() { // mouse-out
      /*$(this).css("background-color", "green");
      $(this).html('Normal');
      */
      var attrfor = $(this).attr('data-pie-title');
      if(attrfor !== undefined) $('#pieChart path.lightPie[data-pie-title="' + attrfor + '"]').click();
      //$('#pieChart g[data-active="active"]').attr('data-active', '');
    });
    /*
      $('#pieChartBox path.lightPie').on("click", function(e) {

        var attr = $(this).attr('data-pie-title');

      });
      */
    /*
          var dialog = new BootstrapDialog.show({
                  message: 'Hi Apple!',
                  message: 'You can not close this dialog by clicking outside and pressing ESC key.<br> <p>testar</p>',
                  size: BootstrapDialog.SIZE_SMALL,   //<--works as modal-sm
                  //size: BootstrapDialog.SIZE_WIDE,  //<--works as modal-lg
                  //size: BootstrapDialog.SIZE_EXTRAWIDE,   //<--works as modal-xl
                 type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

                  closable: true,
                  cssClass: 'modal-dialog-scrollable',  //modal-dialog-centered, modal-dialog-scrollable, modal-sm, modal-lg, modal-xl
                  verticalCentered:true,
                  closeByBackdrop: false,
                  closeByKeyboard: false,

                  buttons: [{
                      label: 'Cancel',
                      cssClass: 'btn-sm btn-flat-secondary',
                      action: function(dialogRef){
                          dialogRef.close();
                      }
                  },
                   {
                      label: 'Close the dialog',
                      cssClass: 'btn-sm btn-flat-primary',
                      action: function(dialogRef){
                          dialogRef.close();
                      }
                  }]

              });


*/
    /*    
          BootstrapDialog.show({
                  message: 'Hi Apple!',
                  message: 'You can not close this dialog by clicking outside and pressing ESC key.',
                  size: 'size_large'
                  closable: true,
                  cssClass: 'modal-dialog-centered',  //modal-dialog-centered, modal-dialog-scrollable, modal-sm, modal-lg, modal-xl
                  closeByBackdrop: false,
                  closeByKeyboard: false,
                  buttons: [{
                      label: 'Close the dialog',
                      cssClass: 'btn-sm btn-primary',
                      action: function(dialogRef){
                          dialogRef.close();
                      }
                  }]
              });
  
*/
    /*
                document.querySelector('.choose-currency-modal').addEventListener('click', function() {
              $('#modalChangeAsset').modal('show')    
              //document.getElementById('modalChangeAsset').modal('show')
          });
          */
    /*
          Waves.init();
            Waves.attach('.button', ['waves-float']);
            Waves.attach('button', ['waves-float']);
            Waves.attach('btn', ['waves-float']);
            //Waves.attach('[type="button"]', ['waves-float']);
    */
    /*
          Waves.init();
          Waves.attach(".btn[class*='btn-']:not([class*='btn-outline-']):not([class*='btn-label-'])", ["waves-light"]);
          Waves.attach("[class*='btn-outline-']");
          Waves.attach("[class*='btn-label-']");
          Waves.attach(".pagination .page-item .page-link");
    */


  // Tabs slider
  const $subPageNavTabs = $("#walletAsset .nav-tabs");
  const $subPageNavSlider = $("#walletAsset .nav-slider");

  $subPageNavTabs.on('click', 'a', function() {
      const $parent = $(this).parent();
      $subPageNavSlider.css({"left": $parent.position().left, "width": $parent.width()});
  });

  const activeTab = $subPageNavTabs.find("a.nav-link.active").parent();
  $subPageNavSlider.css({"left": activeTab[0].offsetLeft, "width": activeTab[0].offsetWidth});


    

  });

  
  


})();