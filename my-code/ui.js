import { FadeAnimation } from "./fade.js"
import * as defs from "./define.js"


function showFullScreenContainer() {
    defs.FullScreenUiContainer.style.display = "block";
}

function hideFullScreenContainer() {
    defs.FullScreenUiContainer.style.display = "hide";
}

let usingType = null;
function changeFullScreenUiMode(className) {
    if(usingType) {
        defs.FullScreenUiContainer.classList.replace(usingType, className);
    } else {
        defs.FullScreenUiContainer.classList.add(className);
        usingType = className;
    }
}

class FSUISetting {
    static hideOnClicked = false;
}
defs.FullScreenUiContainer.addEventListener("click", (e)=>{
    if(FSUISetting.hideOnClicked) {
        FSUISetting.hideOnClicked = false;
        defs.FullScreenUiContainer.style.display = "none";
        defs.FullScreenUiContainer.innerHTML = "";
    }
})

document.querySelectorAll(".expand-on-click").forEach(elm => {
    //let target = null;
    elm.addEventListener('click', (e)=>{
        //if(target) {
        //    target.remove();
        //    hideFullScreenContainer();
        //} else {
            FadeAnimation(elm);
            const target = elm.cloneNode(true);
            target.classList.add('expanded');
            defs.FullScreenUiContainer.appendChild(target);
            changeFullScreenUiMode('expand-on-click');
            showFullScreenContainer();
            FadeAnimation(defs.FullScreenUiContainer);

            FSUISetting.hideOnClicked = true;
        //}
    })
})

defs.mainBoard.addEventListener('scroll', () => {
})