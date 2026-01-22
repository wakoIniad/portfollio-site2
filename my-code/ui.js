//import { FadeAnimation } from "./fade.js"
//import * as defs from "./define.js"


function showFullScreenContainer() {
    defs.FullScreenUiContainer.style.display = "block";
}

function hideFullScreenContainer() {
    defs.FullScreenUiContainer.style.display = "hide";
}
console.log("DEF",def,defs);
let usingType = null;
let incontainerElm = null;
function changeFullScreenUiMode(className, elm) {
    FadeAnimation(elm);
    defs.FullScreenUiContainer.innerHTML = "";
    if(usingType) {
        defs.FullScreenUiContainer.classList.replace(usingType, className);
    } else {
        defs.FullScreenUiContainer.classList.add(className);
        usingType = className;
    }
    elm.classList.add('active-ui');
    defs.FullScreenUiContainer.appendChild(elm);
    incontainerElm = elm;
}

class FSUISetting {
    static hideOnClicked = false;
}
defs.FullScreenUiContainer.addEventListener("click", (e)=>{
    if(FSUISetting.hideOnClicked) {
        FSUISetting.hideOnClicked = false;
        defs.FullScreenUiContainer.style.display = "none";
        if(incontainerElm) {
            incontainerElm.classList.remove('active-ui');
            incontainerElm = null;
        }
    }
})

document.querySelectorAll(".expand-on-click").forEach(elm => {
    //let target = null;
    elm.addEventListener('click', (e)=>{
        //if(target) {
        //    target.remove();
        //    hideFullScreenContainer();
        //} else {
            const target = elm.cloneNode(true);
            //FadeAnimation(target);
            target.classList.add('expanded');
 //           defs.FullScreenUiContainer.appendChild(target);
            changeFullScreenUiMode('expand-on-click',target);
            showFullScreenContainer();
            FadeAnimation(defs.FullScreenUiContainer);

            FSUISetting.hideOnClicked = true;
        //}
    })
})

defs.mainBoard.addEventListener('scroll', () => {
})