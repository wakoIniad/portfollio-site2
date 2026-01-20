export function FadeAnimation(targetElm, maskElmIdMap={
    backgroundID:"fade-mask-bg",
    targetID:"fade-mask-target",
    containerID:"fade-anim-mask",
    fadeAnimClassName:"animating-fade"
}) {
    const {backgroundID, targetID, containerID, fadeAnimClassName} = maskElmIdMap;

    let w = 84;
    let h = 120;
    let initFireCount = 16;
    let init = new Uint8Array(w * h).fill(0);
    function gojasReset() {
      target = 
    document.getElementById(targetID);
      bg = document.getElementById(backgroundID);
      for(let i = 0;i < initFireCount; i++) {
        init[~~(Math.random()*w)*w+~~(Math.random()*h)] = 255;
      }
      console.log(bg);
      bg.setAttribute("fill", "white");
    }

    function normalRand() {
      if(this.last !== 0) {
        const res = this.last;
        this.last = 0;
        return res;
      } else {
        const a = Math.random();
        const b = Math.random();
        this.last = (-2*Math.log(a))**0.5 * Math.sin(Math.PI * 2 * b)
        return (-2*Math.log(b))**0.5 * Math.cos(Math.PI * 2 * a);
      }
    }

    function normalRandPair(variance) {
        const a = Math.random();
        const b = Math.random();
        return [ 
          variance*(-2*Math.log(a))**0.5 * Math.sin(Math.PI * 2 * b),
        
         variance*(-2*Math.log(b))**0.5 * Math.cos(Math.PI * 2 * a)
      ]
    }

    function randPair(r) {
      return [
        Math.random()*4,
        Math.random()*4
      ]
    }

    function update(current, w, h, params) {
      const {radius, speed, weight} = params;
      let ref = [...current];
      const at = (x,y) => x < 0 || y < 0 || x >= w || y>= h ? 0 : ref[x*h+y];
      for(let i = 0; i < w; i++) {
        for(let j = 0; j < h; j++) {
          for(let k = 0; k < speed; k++) {
            const [a, b] = normalRandPair(radius);

            current[ i * w + j ] = 
            Math.max(
              current[ i * w + j ], 
              ref[ i *  + j ] * weight + 
              (1-weight) * at(~~(i+a) , ~~(j+b))
            );
          }
        }
      }
      return current;
    }

    function postProcess2d(target) {
      const res = new Array(w-2).fill(0).map(
        _=>new Array(h-2).fill(0)
      );
      for(let i = 1;i < w-1; i++) {
        for(let j = 1; j < h-1;j++) {
          res[i-1][j-1]=
          [-1-w, -w, 1-w, -1, 0, 1, -1+w, w, 1+w]
          .reduce((res, at)=>
            res + target[at+(i)*w+(j)],
          0)/9;
        }
      }
      return res;
    }

    let target;
    let bg ;
    let flagTemp = false;
    let animated = false;
    function reflection() {
      const anim = postProcess2d(init);

      init = update(init, w, h, {
        radius: 2,
        speed: 5,
        weight: 0.5
      });
      const sw = 8;
      const sh = 7;
      const convertedToPolygon = MarchingSquaresJS.isoLines(anim, 32);
      const value = convertedToPolygon.map(polygon=>
          `M${polygon[0][0]*sw+","+polygon[0][1]*sh} L${polygon.slice(1).map(p=>p[0]*sw+","+p[1]*sh).join(" L")} Z`
      ).join(" ");
      //if(value.length)flagTemp = true;
      //if(flagTemp));
      //if(convertedToPolygon.length >)
      target.setAttribute("d",value);
      bg.setAttribute("fill", "white");
      console.log(convertedToPolygon);
      if(convertedToPolygon.length) {
        animated = true
      } else if(animated)StopAnimation();
    }

    let usingIntervalId;
    function StartAnimation() {
        if(usingIntervalId)clearInterval(usingIntervalId);
        usingIntervalId = setInterval(reflection,100);
        
        bg.setAttribute("fill", "black");
        target.setAttribute("d","");
        targetElm.classList.add(fadeAnimClassName);
    }

    function StopAnimation() {
        if(usingIntervalId)clearInterval(usingIntervalId);
        gojasReset();
        targetElm.classList.remove(fadeAnimClassName);
    }

    //window.StartAnimation = StartAnimation;

    document.onload = gojasReset();
    if(document.readyState === 'complete')gojasReset();
    StartAnimation();
}