/*defs.mainBoard.addEventListener('scroll', () => {
    if(defs.mainBoard.scrollTop == 0) {
        defs.mainBoard.scrollBy({
            left: 0, 
            top: 16,
            //behavior: "smooth"
        });
    }
})*/

defs.mainBoard.addEventListener('scroll', () => {
    const at = defs.mainBoard.scrollTop / defs.mainBoard.clientHeight;
    //console.log("ki",at);
    document.querySelector('body').style.setProperty('--overlay-dark', Math.min(1, at));
    document.querySelector('body').style.setProperty('--overlay-dark2', at);

})