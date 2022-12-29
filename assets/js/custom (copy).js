(function () {

    var wally = window.wally = function () { };

    wally.walletVersion = "1.0";   //is used for human versioning
    wally.walletVersionCode = "1";  //is used for the update versioning of the wallet app
})();





DomReady.ready(function() {     
console.log('DOM is ready');


console.log('=========================CUSTOM FILE  LOADED======================');
console.log('--------Wally version: '+wally.walletVersion+'--------');


  //FORM WIZARD START >>
// Code By Webdevtrick ( https://webdevtrick.com )

//set form wizard to 0
document.getElementById('wallet_formwizard_current_step').value = 0;

const wizardEl = {
  stepsForm: document.getElementById('multisteps-form__panels'),
  stepsFormTextareas: document.querySelectorAll('.multisteps-form__textarea'),
  stepFormPanelClass: 'multisteps-form__panel',
  stepFormPanels: document.querySelectorAll('.multisteps-form__panel'),
  stepPrevBtnClass: 'js-btn-prev',
  stepNextBtnClass: 'js-btn-next' };

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
    

    if(nextStep > 0 && nextStep <= 3) {
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
    

    if(nextStep >= 0 && nextStep <= 3) {
        document.getElementById('wallet_formwizard_current_step').value = nextStep;

        //setActivePanel(nextStep);
        setActivePanel(nextStep, stepPrevAnimation);
        console.log('Step to Previous: ' + nextStep);
        console.log(stepPrevAnimation);
    }else
        console.log('Error - No such step:' + nextStep);

    return;
});




//<< FORM WIZARD END

function animateElement(el, nimateType) {
var nimateLeft = anime({
  targets: nimateType,
  translateX: -500
});
//https://animejs.com/documentation/#CSStransforms
}


/*
 Download Backup file of wallet
 https://stackoverflow.com/questions/65050679/javascript-a-simple-way-to-save-a-text-file
*/
function downloadFile(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

function downloadFileBlob(filename, text) {
  let element = document.createElement('a');
    element.download = filename;

    //let blob = new Blob(['Hello, world!'], {type: 'text/plain'});
    let blob = new Blob([text], {type: 'text/plain'});

    element.href = URL.createObjectURL(blob);
    element.click();
    URL.revokeObjectURL(element.href);

    element.remove();
}







document.getElementById('openBtnDownload').addEventListener('click', e => {

    // Start file download.
    downloadFile("wally.wallet_backup.txt","Download() - This is the content of my file :)");

    BootstrapDialog.show({
                  message: 'Open Wallet',
                  message: 'Great, you have a backup file of your wallet now. You may now proceed with the login!',
                  closable: true,
                  cssClass: 'modal-dialog-centered',
                  buttons: [{
                      label: 'Ok',
                      cssClass: 'btn-sm btn-primary',
                      action: function(dialogRef){
                          dialogRef.close();
                      }
                  }]
              });


});


});
