(function () {

    var login_wizard = window.login_wizard = function () { };

/*
login_wizard.animateElement2 = function (el, show) {

var animateHeight, elOpacity, translateHeight;
if(show) {
  animateHeight = '100%';
  elOpacity= 1;
  translateHeight: '0';
}
else {
  animateHeight = '0px';
  elOpacity = 0;
  translateHeight: '-50px';
}
var nimateLeft = anime({
  targets: el,
  
  //scale: 0,
  //duration: 500,
  
  opacity: elOpacity,
  //translateY: translateHeight,
  height: animateHeight,
  transition: 'easeInOutQuad',
  duration: 250

});
//https://animejs.com/documentation/#CSStransforms
}*/

login_wizard.sleep = function (milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
login_wizard.sleepPromise = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//sleep(2000).then(() => { console.log("World!"); });
/*
https://www.sitepoint.com/delay-sleep-pause-wait/
async function delayedGreeting() {
  console.log("Hello");
  await sleep(2000);
  console.log("World!");
  await sleep(2000);
  console.log("Goodbye!");
}
*/

login_wizard.animateElement = function (el, show) {

  //var el = '.form-email-confirm,.form-password-confirm,.form-password2-confirm';
  var elementsArr = el.split(',');
  var inputHeight = 40;

  const tl = anime.timeline({ duration: 500, loop: false });


  if(show) {
    elementsArr.forEach(elem => {
      console.log('elem: ' + elem);
        tl.add({
        targets: elem,
        opacity: 1,
        scale: 1,
        height: inputHeight+'px',
        transition: 'linear',
        duration: 200, // duration of the animation step in ms
        changeBegin: function(e) {
          document.querySelector(elem).style.visibility = 'inherit';
        },
        changeComplete: function() {
          
        }
      });
    });
  }else {
    elementsArr.forEach(elem => {
      console.log('elem: ' + elem);

      tl.add({
        targets: elem,
        opacity: 0,
        scale: 0,
        height: 0,
        transition: 'linear',
        duration: 200, // duration of the animation step in ms
        changeComplete: function() {
          document.querySelector(elem).style.visibility = 'hidden';
        }
      });
    });
  }

    /*
  var inputHeight = 40;
  console.log('el.offsetHeight: ' + el.offsetHeight);
  if(show) {
    var nimateLeft = anime({
      targets: document.querySelector(el),
      opacity: 1,
      height: inputHeight+'px',
      transition: 'easeInOutCirc',
      duration: 250,
      round: 1000,  // Will round the animated value to 0 decimal
      changeBegin: function(e) {
        console.log('e1.1: ', e);
        document.querySelector(el).style.visibility = 'inherit';
      },
      changeComplete: function() {
        console.log('e1.2: ', e);
        login_wizard.sleepPromise(100);
      }
      
    });
  }else {
    var nimateLeft = anime({
      targets: document.querySelector(el),
      opacity: 0,
      height: 0,
      transition: 'easeInOutCirc',
      duration: 250,
      round: 1000,
      
      changeComplete: function(e) {
        console.log('e2: ', e);
        document.querySelector(el).style.visibility = 'hidden';
        login_wizard.sleepPromise(100);
      }
      
    });
  }
  */

  
  //nimateLeft.finished.then( login_wizard.sleepPromise(100) );
  }




/*
 Download Backup file of wallet
 https://stackoverflow.com/questions/65050679/javascript-a-simple-way-to-save-a-text-file
*/
login_wizard.downloadFile = function (filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}


login_wizard.downloadFileBlob = function (filename, text) {
  let element = document.createElement('a');
    element.download = filename;

    //let blob = new Blob(['Hello, world!'], {type: 'text/plain'});
    let blob = new Blob([text], {type: 'text/plain'});

    element.href = URL.createObjectURL(blob);
    element.click();
    URL.revokeObjectURL(element.href);

    element.remove();
}

})();


DomReady.ready(function() {     




  //FORM WIZARD START >>
// Code By Webdevtrick ( https://webdevtrick.com )

//set form wizard to step 0
document.getElementById('wallet_formwizard_current_step').value = 0;

const wizardEl = {
  stepsForm: document.getElementById('multisteps-form__panels'),
  stepsFormTextareas: document.querySelectorAll('.multisteps-form__textarea'),
  stepFormPanelClass: 'multisteps-form__panel',
  stepFormPanels: document.querySelectorAll('.multisteps-form__panel'),
  stepPrevBtnClass: 'js-btn-prev',
  stepNextBtnClass: 'js-btn-next' };

//password" (email & password login), "private_key" login, "import_wallet", mnemonic" login, "hdmaster" login

  panelStepOptions = [
    'regular_wallet',
    'multisig_wallet',
    'import_wallet',
    'mnemonic',
    'hdmaster'
  ]
  var stepNextAnimation = 'animate__fadeInRight';
  var stepPrevAnimation = 'animate__fadeInLeft';


  console.log('stepsForm: ', wizardEl.stepsForm);

const removeClasses = (elemSet, className) => {

  elemSet.forEach(elem => {

    elem.classList.remove(className);
    elem.classList.add('hidden');

  });

};

const findParent = (elem, parentClass) => {

  let currentNode = elem;

  while (!currentNode.classList.contains(parentClass)) {
    currentNode = currentNode.parentNode;
  }

  return currentNode;

};



const getActivePanel = () => {

  let activePanel;

  wizardEl.stepFormPanels.forEach(elem => {

    if (elem.classList.contains('js-active')) {

      activePanel = elem;
      elem.classList.remove('hidden');

    }

  });

  return activePanel;

};
const setActivePanel = (activePanelNum, setClassName='') => {
//const setActivePanel = activePanelNum => {

  removeClasses(wizardEl.stepFormPanels, 'js-active');
  removeClasses(wizardEl.stepFormPanels, stepNextAnimation);
  removeClasses(wizardEl.stepFormPanels, stepPrevAnimation);


    

  wizardEl.stepFormPanels.forEach((elem, index) => {
    
    if (index < activePanelNum){
        elem.classList.add(stepPrevAnimation);
    }else if (index > activePanelNum){
        elem.classList.add(stepNextAnimation);
    }
    if (index === activePanelNum) {

        console.log('index: '+ index + ', activePanelNum: '+ activePanelNum);

      elem.classList.remove('hidden');
      elem.classList.add('js-active');
      if(setClassName)
        elem.classList.add(setClassName);
      
      
      

      //setFormHeight(elem);

    }
  });

};


wizardEl.stepsForm.addEventListener('click', e => {

  const eventTarget = e.target;

  if (!(eventTarget.classList.contains(`${wizardEl.stepPrevBtnClass}`) || eventTarget.classList.contains(`${wizardEl.stepNextBtnClass}`)))
  {
    return;
  }

  if(eventTarget.id == 'wallet_formwizard_next' )
    return;
if(eventTarget.id == 'wallet_formwizard_previous')
    return;

  console.log ('eventTarget: ', eventTarget);
  console.log ('classList: ', eventTarget.classList);
  const activePanel = findParent(eventTarget, `${wizardEl.stepFormPanelClass}`);

  let activePanelNum = Array.from(wizardEl.stepFormPanels).indexOf(activePanel);
  console.log('arr from: ', Array.from(wizardEl.stepFormPanels));

  var transitionType;
  if (eventTarget.classList.contains(`${wizardEl.stepPrevBtnClass}`)) {
    activePanelNum--;
    transitionType = 'animate__shakeX';
  } else {

    activePanelNum++;
    transitionType = 'animate__tada';

  }

  setActivePanel(activePanelNum, transitionType);

});


const setAnimationType = newType => {
  wizardEl.stepFormPanels.forEach(elem => {
    elem.dataset.animation = newType;
  });
};

//changing animation
//setAnimationType('animate.css.add');

document.getElementById('wallet_formwizard_next').addEventListener('click', e => {

    var getCurrentStep = parseInt(document.getElementById('wallet_formwizard_current_step').value);
    var nextStep = getCurrentStep+1;
    

    if(nextStep > 0 && nextStep <= 4) {
        document.getElementById('wallet_formwizard_current_step').value = nextStep;

        //setActivePanel(nextStep);
        setActivePanel(nextStep, stepNextAnimation);
        console.log('Step to Next: ' + nextStep);
        console.log(stepNextAnimation);
    }else
        console.log('Error - No such step: ' + nextStep);

    return;
});

document.getElementById('wallet_formwizard_previous').addEventListener('click', e => {

    var getCurrentStep = parseInt(document.getElementById('wallet_formwizard_current_step').value);
    var nextStep = getCurrentStep-1;
    

    if(nextStep >= 0 && nextStep <= 4) {
        document.getElementById('wallet_formwizard_current_step').value = nextStep;

        //setActivePanel(nextStep);
        setActivePanel(nextStep, stepPrevAnimation);
        console.log('Step to Previous: ' + nextStep);
        console.log(stepPrevAnimation);
    }else
        console.log('Error - No such step:' + nextStep);

    return;
});

/*
 Manual click login Option
*/
var manualStepLoginLinks = document.querySelectorAll('a[data-formwizard-step]');

  manualStepLoginLinks.forEach(manualStepLinks => {
      manualStepLinks.addEventListener("click", function (e) {

        //e.preventDefault();

        console.log('manualStepLinks clicked: ', manualStepLinks);
        console.log('manualStepLinks hash: ', this.hash);
        console.log('manualStepLinks step: ', this.attributes['data-formwizard-step'].value);

        
        var panelStep = document.getElementById('wallet_formwizard_current_step').value;

        console.log('panelStep: ' + panelStep);
      });
    });






//<< FORM WIZARD END




  /*
   @ Enable/Disable Login button 
   * enabled if 
      * wallet backup is downloaded
      * terms is accepted
   * else disabled
  */
  function loginBtnProceed() {

    var termsIsChecked = document.getElementById('openCheckAcceptTerms').checked;
    var backupIsChecked = document.getElementById('openCheckBackupDownloaded').checked;

    
    var loginBtn = document.getElementById('openBtn');

    if (termsIsChecked && backupIsChecked) {
      loginBtn.disabled = false;
      loginBtn.insertAdjacentHTML('afterbegin', '<i class="bi bi-person-check-fill"></i> ');
    }else {
      loginBtn.disabled = true;
      //remove the icon on the button if terms and backup isnt checked
      if(loginBtn.querySelector('i'))
        loginBtn.querySelector('i').remove();
    }

    
  }


  /*
  //listener for: 
  // * if wallet backup is downloaded download
  // * if terms is accepted
  // @ only required for email + password login!
  */
  document.getElementById('openCheckBackupDownloaded').addEventListener('change', e => {
    loginBtnProceed();
  });

  document.getElementById('openCheckAcceptTerms').addEventListener('change', e => {
    loginBtnProceed();
  });


  /*
   Download Wallet Backup file
  */
  document.getElementById('openBtnDownload').addEventListener('click', e => {

      // Start file download.
      login_wizard.downloadFile("wally.wallet_backup.txt","Download() - This is the content of my file :)");
      document.getElementById('openCheckBackupDownloaded').checked = true;
      loginBtnProceed();

      BootstrapDialog.show({
                    title: 'Open Wallet',
                    message: 'Great, you have a backup file of your wallet now. <br>You may now proceed with the login!',
                    closable: true,
                    verticalCentered:true,
                    buttons: [{
                        label: 'Great, let me in!',
                        cssClass: 'btn-sm btn-flat-primary',
                        action: function(dialogRef){
                            dialogRef.close();
                        }
                    }]
                });


  });


  //Enable/Disable confirm email/pass
  /*
  $('#confirmPass').on("change",function() {
    console.log("confirmPass changed");

    var elements = ".form-email-confirm,.form-password-confirm";
    if($(".form-password2").is(":visible") )
      elements += ",.form-password2-confirm";

    if($(this).is(":checked")) {
      $(elements).removeClass("hidden");
    }else{
      $(elements).addClass("hidden");
      $('#openEmail-confirm').val('').removeClass("unconfirmed");
      $('#openPass-confirm').val('').removeClass("unconfirmed");
      $('#openPass2-confirm').val('').removeClass("unconfirmed");
      
    }
  });
  */
  /*
  document.querySelector('#confirmPass').addEventListener("change",function() {
    console.log("confirmPass changed");
    
    var elements = ".form-email-confirm,.form-password-confirm";
    if(document.querySelector(".form-password2").is(":visible") )
      elements += ",.form-password2-confirm";

    if(document.querySelector(this).is(":checked")) {
      document.querySelector(elements).classList.remove("hidden");
    }else{
      document.querySelector(elements).classList.add("hidden");
      document.querySelector('#openEmail-confirm').val('').classList.remove("unconfirmed");
      document.querySelector('#openPass-confirm').val('').classList.remove("unconfirmed");
      document.querySelector('#openPass2-confirm').val('').classList.remove("unconfirmed");
      
    }
  });
*/

const animateCSS = (element, animation, prefix = 'animate__', keep_animation=0) =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    //const node = document.querySelector(element);
    const node = element;

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      if(keep_animation == 0)
        node.classList.remove(`${prefix}animated`, animationName);    //dont remove the animate_animated class!
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });

/*
animateCSS('.my-element', 'bounce');

// or
animateCSS('.my-element', 'bounce').then((message) => {
  // Do something after the animation
});

*/
document.getElementById("confirmPass").addEventListener('change', e => {


    var elements = ".form-email-confirm,.form-password-confirm";
    //if(document.querySelector(".form-password2").is(":visible") )

    if(!document.querySelector(".form-password2").classList.contains("hidden") )
      elements += ",.form-password2-confirm";


    console.log('elements: ', elements);
    console.log('e.target.checked: ' + e.target.checked);

    //if confirm Credentials is checked, show confirm fields or else hide them!
    if(e.target.checked) {
      //document.querySelector(elements).classList.remove("hidden");

       
        //elem.classList.remove('hidden');
        login_wizard.animateElement(elements, true);
        console.log('hidden removed')
        

        //elem.classList.remove('hide_animate');

    }else{
      //document.querySelector(elements).classList.add("hidden");

        
        
        login_wizard.animateElement(elements, false)

        
        //elem.classList.add('hidden');
        console.log('hidden added')
        

        //elem.classList.remove('show_animate');
        //elem.classList.add('hide_animate');


      document.getElementById("openEmail-confirm").value = '';
      document.getElementById("openPass-confirm").value = '';
      document.getElementById("openPass2-confirm").value = '';
      
    }
  });

});

