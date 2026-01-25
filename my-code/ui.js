//import { FadeAnimation } from "./fade.js"
//import * as defs from "./define.js"


function showFullScreenContainer() {
    defs.FullScreenUiContainer.style.display = "block";
}

function hideFullScreenContainer() {
    defs.FullScreenUiContainer.style.display = "hide";
}

function fadeAnimSelfWrapper(elm) {
    FadeAnimation(elm, ()=>{
        console.log("USINGAA DESU??", containerIsUsing);
        containerIsUsing = false;
    });
}
console.log("DEF",def,defs);
let usingType = null;
let incontainerElm = null;
function changeFullScreenUiMode(className, elm) {
    fadeAnimSelfWrapper(elm);
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
    static hideOnClicked = true;//false;
}

defs.FullScreenUiContainer.addEventListener("click", (e)=>{
    console.log("FULL SCREEN CONTAINER WAS CLICKED")
    if(FSUISetting.hideOnClicked) {
        //FSUISetting.hideOnClicked = false;
        defs.FullScreenUiContainer.style.display = "none";
        //if(incontainerElm) {
        //    //incontainerElm.classList.remove('active-ui');
        //    //defs.FullScreenUiContainer.remove(incontainerElm);
        //    incontainerElm = null;
        //}
        /** フルスクリーンを閉じた後も音が流れ続けちゃうことに対する*応急処置* */
        defs.FullScreenUiContainer.innerHTML = "";
    }
})

let containerIsUsing = false;
function foregroundTypeUIHandler(realHandler, elm) {
    console.log("USINGAA<",containerIsUsing);
    if(containerIsUsing)return;
    containerIsUsing = true;
    realHandler(elm);
}

function defaultExpandHandler(elm) {
    foregroundTypeUIHandler((elm)=>{
        //if(target) {
        //    target.remove();
        //    hideFullScreenContainer();
        //} else {
            //console.log("NANDE<",animatingNow);
            const target = elm.cloneNode(true);
            //FadeAnimation(target);
            target.classList.add('expanded');
 //              defs.FullScreenUiContainer.appendChild(target);
            changeFullScreenUiMode('expand-on-click',target);
            showFullScreenContainer();
            //fadeAnimSelfWrapper(defs.FullScreenUiContainer);
            //FSUISetting.hideOnClicked = true;
        //}
    }, elm);
}

function AssignExpandListener(elm) {
    elm.addEventListener('click', ()=>defaultExpandHandler(elm));
}
document.querySelectorAll(".expand-on-click").forEach(elm => {
    //let target = null;
    AssignExpandListener(elm);
})

function shinamonoHandler() {
    console.log("shinamonoHandler");
    const btn = document.getElementById("smartphone-overlay-button");
    const menuElm = document.getElementById("smartphone-overlay-menu");
    btn?.addEventListener('click', ()=>
        foregroundTypeUIHandler(function(e) {
            console.log("CLICKED")
            showFullScreenContainer();
            changeFullScreenUiMode('smartphone-overlay-menu', menuElm);
        })
    )
}
document.onload = shinamonoHandler();
if(document.readyState === 'complete')shinamonoHandler();