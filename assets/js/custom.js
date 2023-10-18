(function () {

    var custom = window.custom = function () { };

    
    /*
    @ Show Modal
    @title, @message
    */
    custom.showModal = function(_title_, _message_, _content_type_='', options = {}) {

        if(_content_type_)  //primary, secondary, warning, danger, success, info    (as in bootstrap types)
            _message_ = '<div class="alert alert-'+_content_type_+'">'+_message_+'</div>';

        var dialogConfig = {
        title: _title_,
        message: _message_,
        cssClass: 'modal-dialog-scrollable text-bold',
        verticalCentered: true,
        closeByBackdrop: false,
        closeByKeyboard: false,
        buttons: [
          {
            label: 'Close',
            cssClass: 'btn-sm btn-flat-primary',
            action: function (dialogRef) {
              dialogRef.close();
            }
          }
        ]
      };

      //show cancel button if set
      if (options.buttons && options.buttons.cancel) {
        dialogConfig.buttons.unshift({
          label: 'Cancel',
          cssClass: 'btn-sm btn-flat-secondary',
          action: function (dialogRef) {
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

    }

})();

