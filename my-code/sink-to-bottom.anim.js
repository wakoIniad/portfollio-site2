import * as def from "./define.js";
import {zeta_tochu} from '../my-works/png-blob1.js';
const Bubbles = [];

let nlast = null;
function normalRand() {
  if(nlast) {
    const res = nlast;
    nlast = 0;
    return res;
  } else {
    const a = Math.random();
    const b = Math.random();
    nlast = (-2*Math.log(a))**0.5 * Math.sin(Math.PI * 2 * b)
    return (-2*Math.log(b))**0.5 * Math.cos(Math.PI * 2 * a);
  }
}

const speedRandomnessInfuluence = 1;

const minSize = 20.5;
const maxSize = minSize//2.5;

const particle = {
  bz: 0,
  bx: 0,
  //from bottom
  by: 160,
  vx: 30,
  vy: 27.5,
  vz: 30
}


const chara = {
  sx: 40,
  sy: 190,
  cx: null,
  cy: null,
  cz: 0
}

const BASIC_SPEED = {
  x: 1,
  y: 13
};

const cam = {
  //filter: <fz
  fz: 4,//16,
  cz: -150
}

const environmentparticle = {
  bz: cam.cz + cam.fz * 1,
  bx: 0,
  //from bottom
  by: 80,
  vx: 5,
  vy: 5,
  vz: 20
}


function createBubble(environment) {
  const size = 8;//minSize + Math.random() * (maxSize-minSize);
  
  const spawnAt = !environment ? ({
    x:particle.bx + normalRand()*
        particle.vx,
    
    y:particle.by + 
        normalRand() * particle.vy,
    
    z: particle.bz + normalRand() * particle.vz
  }) : ({
    x:environmentparticle.bx + normalRand()*
        environmentparticle.vx,
    
    y:environmentparticle.by + 
        normalRand() * environmentparticle.vy,
    
    z: environmentparticle.bz + normalRand() * environmentparticle.vz
  });
  Bubbles.push({
    x: spawnAt.x,
    y: spawnAt.y,
    z: spawnAt.z,
    size: size,
    e: environment
  })
}

//これの値をキャラクターと同じにすればキャラクター基準で表示
const PARTICLE_REF = {
  x: null, y:null, z:null
}

async function avoidCorsErrLoadImage(src) {
  const htmlImg = new Image();
  htmlImg.src = src;
  return new Promise((resolve, reject)=> {
    htmlImg.onload = () => {
      const res = createImage(htmlImg.naturalWidth, htmlImg.naturalHeight);
      res.drawingContext.drawImage(htmlImg, 0, 0);
      res.width = htmlImg.naturalWidth;
      res.height = htmlImg.naturalHeight;
      //console.log("POQ",htmlImg.naturalWidth,htmlImg.naturalHeight);
      resolve(res);
    };
  });
}

function ShedLight(alpha,...at) {
  //image(illustACBG, ...at);ShedLight(frameCount/128,
  const extendH = ((at[3]-at[1])/height);
  alpha = Math.min(1,Math.max(0, alpha));
  //print("O", extendH);
  ShedLightProcess(
    frameCount/256,
    [14+at[0], -64+at[1]], 
    
    -PI/12,
    height/16*extendH, 
    0*alpha,
    1.5*1.5*alpha**2,
    
    -PI/3*1.5, 
    height*1.25*extendH,
    4*alpha,
    1.5*4*alpha**2,
    
    [
      [
        0.25,  4,  0.21
      ],
      [   
        1,  16, 0.00 
      ],
      [   
        1,  4,  1 
      ],
      [   
        1,  4,  0.01 
      ]
    ],
    8,
    32,
    10000,
  );
}

function ShedLightProcess(
  t,
  root, 
   
  md_angle,
  md_len,
  md_intense,
  md_weight,
   
  baseAngle, 
  baseLightLength,
  baseIntense,
  baseWeight,
   
  alwi_tij=[
    [1,1,1],
    [1,1,1],
    [1,1,1],
    [1,1,1],
  ],
  //persian noiseのおかげで構造ができるので、こういうパラメーターは不要になった
  //lengthVariancePerStripe=0,
  maxStripe=4,
  maxStripeDensity=10,
  magnifyj=10000,
  def_tij=[1,1,0.1],
) {
  t=t??0;
  const nowrnd = (s)=>noise(s*magnifyj);
  for(let i = 0; i < 1+noise(t*def_tij[0])*(maxStripe-1);i++) {
    const baseNoise = (tij=def_tij)=>(noise(
      (t*tij[0]+i*tij[1])
    )-0.5);
    const ba = baseNoise(alwi_tij[0]);
    const bl = baseNoise(alwi_tij[1]);
    const bw = baseNoise(alwi_tij[2]);
    const bi = baseNoise(alwi_tij[3]);
    for(let j = 0;j < noise(t*def_tij[0]+t*def_tij[1])*maxStripeDensity;j++) {
      
      const weight = 
          baseWeight +
          bw*md_weight + alwi_tij[2][2]*nowrnd(j);
      if(weight <= 0)continue;
      strokeWeight(
        weight
      );
      
      const angle = baseAngle +
        ba*md_angle + alwi_tij[0][2]*nowrnd(j);
      
      const length = baseLightLength + 
        bl*md_len + alwi_tij[1][2]*nowrnd(j);
      
      const col =
          baseIntense +
          bi*md_intense + alwi_tij[3][2]*nowrnd(j);

      stroke(255, 255,255,
        Math.max(2,col)
      );
      
      line(
        ...root,
        root[0] + cos(angle)*length, 
        root[1] - sin(angle)*length
      );
    }
    
  }
}

//let illustACBG;
let charaIMG;// = document.getElementById("p5src");
//let cloudIMG;
let oceanIMG;
async function preload() {
  charaIMG    = loadImage(
    'my-works/tochu_cmp.png'
 //   'https://drive.google.com/file/d/1W44ewlh8SzC_K2wQ-KbJYtfIZKNWj6HI/view?usp=sharing'
    //zeta_tochu
  );
  //await avoidCorsErrLoadImage("my-works/tochu.png");//select("#my_tochu");//document.getElementById("my_tochu");
  //loadImage("my_tochu.png");
  //illustACBG  = await avoidCorsErrLoadImage("illust_ac_karimono.jpg");//select("#illust_ac_karimono");//document.getElementById("illust_ac_karimono");
  //print("aie",charaIMG,illustACBG);
  //loadImage("illust_ac_karimono.jpg");
  //cloudIMG = await avoidCorsErrLoadImage("./im/image.png");
  //oceanIMG = await avoidCorsErrLoadImage("./from_girlydrop_zisakutexturejanai_saiaku_demozikannaikamo.jpg");
}
const INIT_UPDATE_COUNT = 256;
let defP = 30;
let cc;
let width, height;
function setup() {
  cc = createCanvas(200, 400);
  
  ({width, height} = cc);
  //print(document.getElementById("sink-who"))
  cc.style('position', 'absolute');
  cc.style('top', '0');
  cc.style('left', '50%');
  cc.style('transform', `translate(-50%, -${defP}%)`);
  cc.parent("myCanvas");
  cc.style("background", "rba(0,0,0,0)");
  cc.style("aspect-ratio", "1 / 2");
  cc.style("height", "auto");
  cc.style("width", "100%");
  cc.style("z-index", "-1");
  chara.cx = width/2;
  chara.cy = height/2;
  const charaBottom = chara.cy + chara.sy/2;
  PARTICLE_REF.x = chara.cx;
  PARTICLE_REF.y = charaBottom;
  PARTICLE_REF.z = chara.cz; 
  window.p5myanim = false;

  firstBgColor = {
    top: color(0,200,200),//color(0,120,146),
    bottom:  color(0,120,146)//color(100,20,20)//color(0,200,200)
  };
  finalBgColor = {
    top: color(20,20,20),
    bottom: color(20,20,20)
  };
  bgColor = firstBgColor;
  //noLoop();
  //for(let _ = 0;_<INIT_UPDATE_COUNT;_++)
  //  update(withview=false);
  
  //frameRate(32);
  firstStroke();

  aoumiConf.heightUse = height/2;
}

let lastBlurZ = 0;
const defaultSize = 8;

const a = 10;
const b = 64;
function getViewSize(bubble) {
  const s = (bubble.z-cam.cz)/a;
  const view_size = (bubble.size**2)/s;
  return [s,view_size];
}
let maxBG = 5;
let bgCount = 0;

function waterBG() {
  background(0,30,60,16);
}

//https://32bits.f5.si/index.html
function enokikunAdviceBlackOut(time=0.7, choreFunc=null) {
  frameRate(1/time);
  background(30);
  //コンテキスト指定してないから意味ないけど普通に呼び出すより呼んでる感ある
  //それどころかstrictモードにした瞬間動作しなくなります！
  if(choreFunc)choreFunc.call();
}
let noch = true;
const charaLayer = 5;
let charaLean = Math.PI/7.25;
let charaX = 0;
function drawChara(y=0) {
  const size = 180;
  const s = 0.25;
  if(noise(frameCount/10) > 0.65 && syumeCounter >= 1) {
    drawingContext.filter = `blur(${noise(frameCount/100)*10}px)`;
  } else if(charaTokubetsuCounter > 0) {
    //より自然に着水後にエフェクトを出す確率を上げる用
    /*if(noise(1+frameCount/10) > 0.65 && syumeCounter >= 1) {
      drawingContext.filter = `blur(${(noise(1+frameCount/100))*10}px)`;
    }*/
    //確実に効果を付与し、ほぼ確実に常時ボケるため、上のポートフォリオの文字に注意が向くかも
    drawingContext.filter = `blur(${(1-noise(frameCount/100))*10}px)`;
  }
  if(charaTokubetsuCounter)charaTokubetsuCounter--;
  push();
  imageMode(CENTER);

  //if(syumeCounter < 1) {
  //  translate(
  //    width/2+charaX +32*Math.min(1,(1-frameCount/(INIT_UPDATE_COUNT))**2)*noise(frameCount), 
  //    height/2+charaY+32*Math.min(1,(1-frameCount/(INIT_UPDATE_COUNT))**2)*noise(frameCount+200)
  //  );
  //} else {
    translate(width/2+charaX, height/2+charaY);
  //}
  rotate(charaLean);
  //for(let i = 0;i < 10;i++) {
  const tmp = charaIMG;
  console.log("MAIE",charaIMG);
  if(charaIMG)warappedImage(charaIMG, 0, 0, (charaIMG?.width??0)*s, (charaIMG?.height??0)*s);
  //}
  pop();
  noch = false;
    drawingContext.filter = `none`;
}

function warappedImage(...arg) {
  applyCSSCol();
  image(...arg);
}

function noreviseUpdateAndDrawBubble() {
  strokeWeight(0.5);
  stroke(255, 255);
  for(let i = norBubbules.length-1;i >= 0;i--) {
    const bubble = norBubbules[i];
    bubble.y -= bubble.speedY;
    bubble.x += bubble.speedX/Math.max(1,frameCount/200);
    //print(view.size, bubble.z);
    if(inthewater)circle(bubble.x,bubble.y,bubble.size);
  
    if(
      (bubble.y+bubble.size/2) < 0 || bubble.size < 0.1 || 
      (bubble.x-bubble.size/2) > width || (bubble.x+bubble.size/2) < 0
      ) {
        norBubbules.splice(i,1); 
    }
  }
}
function drawBubble(bubble, buttom, i) {
  noFill();
  const [s, view_size] = getViewSize(bubble);
  /*if(bubble.norevise) {
    stroke(240, 230);
    //print(view.size, bubble.z);
    circle(bubble.x,bubble.y,bubble.size);
  
    if(
      (bubble.y+bubble.size/2) < 0 || bubble.size < 0.1 || 
      (bubble.x-bubble.size/2) > width || (bubble.x+bubble.size/2) < 0
      ) {
        Bubbles.splice(i,1); 
    }
  } else {*/
    const view = { 
        x:PARTICLE_REF.x + bubble.x/(s*0.05), 
        y:PARTICLE_REF.y + bubble.y/s,
        z:PARTICLE_REF.z + bubble.z,
        size: view_size
      }
      let colorIntensity;
      let blurSize = 
        Math.min(16, 10/s);
    
      if(blurSize-lastBlurZ > 1) {
        drawingContext.filter = `blur(${blurSize**1.5}px)`;
        lastBlurZ = blurSize;
        waterBG();
        bgCount++;
        if(noch && charaLayer == bgCount) {
          drawChara(charaY);
        }
      }
      colorIntensity = Math.min(
        255, 
        255 - (view.y)
      );
      //print(view.y,
      //  255 - (view.y - width/3*4))
      stroke(colorIntensity, 192);
      //print(view.size, bubble.z);
      if(inthewater)circle(view.x,view.y,view.size);
  
    if(
      (view.y+view.size/2) < 0 || view.size < 0.1 || 
      (view.x-view.size/2) > width || (view.x+view.size/2) < 0
      ) {
        Bubbles.splice(i,1); 
    }
  //}
}

let p_born = 0.05;
const bornChancePerFrame = 2;
const bubbleSizeAroundChara = 2;
function avoid(bubble, charaBottom) {
    const [v_size, ..._] = getViewSize(bubble);
    const az = Math.abs(v_size-bubbleSizeAroundChara);
  
    //PARTICLE_REF === chara.bottom.x,y,z なのが条件
    
    const choreAvoidBottom = 300;
    const choreXRef = 0;
    //print(bubble.y);
    const vx = PARTICLE_REF.x+bubble.x;
    let tmp = !bubble.e && bubble.x < choreXRef ? 5 : 0;
    const factorSp = bubble.x < choreXRef ? 1 : 1;
    const ref2 = -choreAvoidBottom * (tmp+3);
    if(bubble.y > ref2) {
      let relX = vx - (chara.cx);
      //const relAxis = (0.01*relX ** 2 + az ** 2)**0.5;
      //const relXabs = Math.abs(Math.abs(relX));
      
      //const avoid_power = 1/(1+1*relAxis+10*relY);
      
      //bubbleの大きさが8になる位置
      const target = a*b/6+cam.cz;
      //だいたい2,14が1になる感じ(多分)
      //zの偏差(だいたい：-60~60が1になる)
      const infz = (bubble.z-target)**2/3600;
      //
      const infx = (relX)**2/3600;
      
      let factor = (infz+10*infx)**0.5;
      
      if(!bubble.e && bubble.x < choreXRef) {
        factor /= 10;
      } 
      const f = 1/(1+Math.exp(
        factor * (bubble.y + choreAvoidBottom)/300
      ));
      //print()
      const avoid_power = f*(1-f);
      //print("f",f, avoid_power);
      //(infz, infx, v_size, bubble.x);
      bubble.x += (bubble.e ? 0.1 : 1) * Math.sign(relX) * avoid_power;
      //if(Math.abs(avoid_power)>0.001)
      //  print(f, avoid_power, bubble.y);
      bubble.lastN = (bubble.e ? 0.1 : 1) * Math.sign(relX) * avoid_power;
    } else if(bubble.lastN){
      bubble.x += bubble.lastN / Math.abs(
        1+(bubble.y-ref2)/10)*0.5;
      /*
      const relX = chara.cx - now.x;
      const relAxis = (relX ** 2 + (sd) ** 2)**0.5;
      const relXabs = Math.abs(Math.abs(relX));
      
      const constant_avoid_power = 1/(1+1*relAxis+10*relY);
      bubble.x -= 100*Math.sign(relX) * 
        constant_avoid_power;*/
    }      
}


let charaY = 0;

let firstUsual = true;
let firstBgColor;
let finalBgColor;

let bgColor;
const nmp = document.getElementById("name-plate");
const ctb = document.getElementById("contact-button");

function namePlateVisualProcess() {
  const h = window.innerHeight;
  const defs = nmp.style.top;
  const container = document.getElementById("main-content-container");
  let contactButtonProcessIsExcuted = false;
  const handler = () => {
    const my = window.scrollY;
    const late = my * (1 - my/(h*2)) ** 2;
    nmp.style.top = `calc(${defs||'0px'} + ${late}px)`;
    nmp.style.opacity = `${Math.max(0, 0.25 + 1 - my/h)}`;
    //console.log("scrollPos", my, `calc(${defs||'0px'} + ${late}px)`);
    if(!contactButtonProcessIsExcuted && nmp.style.opacity < 0.1) {
      ContactButtonProcess();
      contactButtonProcessIsExcuted = true;
    }
  }
  window.addEventListener('scroll', handler);
  console.log("呼ばれた");
  return handler;
}

function ContactButtonProcess() {
  setTimeout(()=>{
    ctb.style.visibility = 'visible';
    let c = 0;
    const id = setInterval(()=>{
      ctb.style.opacity = c/5;
      c++;
      if(c/5 >= 1)clearInterval(id);
    }, 250);
  },0);
}

function StartDislplayNamePlate() {
  return;
  const elm = document.querySelectorAll('.after-anim');
  elm.forEach(e => e.style.display = 'block');
  nmp.style.display = "block";  
  nmp.style.opacity = 0;
  const processID = namePlateVisualProcess();
  let c = 0;
  const id = setInterval(()=>{
    nmp.style.opacity = c/7;
    c++;
    if(c/7 >= 1)clearInterval(id);
  }, 250);
}

window.p5myanim = false;
const overSink = 80;
let refFin;
let overSinkPeriodStart = -0;
let overSinkPeriodEnd = 128;
let step2p5float = false;
let refnoise = null;
let refFramec = null
let nexon = null;

function firstStroke(j) {
  //for(let j = 0;j < 32;j++) {
    const i = (j * 2)**0.5;
    norBubbules.push({
      x:width/2-8+8*(64/(8-i))**0.5 + noise(i) * i**0.5,
      y:64*height/64/4*2.5 - i*height/64*8/4*2.5*noise(i),
      z:cam.cz+20,
      speedY: 0.3+noise(i)*0.2,
      speedX: 0.1,
      size: 2+2*noise(i)
    });
    for(let i = 0;i < 1;i++) {
      
      norBubbules.push({
        x:width/2-8+8*(64/(8-i))**0.5 + Math.random() * i*4,
        y:64*height/64/4*2.5 - i*height/64*8/4*2.5*Math.random(),
        z:cam.cz+20,
        speedY:  0.3+Math.random()*0.2,
        speedX: 0.1,
        size: 2*Math.random()
      });
    }
  //}
}

function senni(nextBgColor) {
    step2p5float = true;
    const step = seniTimer/seniTime;
    /*const anim_speed = 1;
    charaY = refFin - overSink/2**anim_speed * (
      Math.pow(
        2, 
        anim_speed*(1-step))-1
    );*/
    print("SENISHITERUYO", `${step} ${nextBgColor.top}`)
    noStroke();
    fill(nextBgColor.top);60.4;
    quad(0, step*height, width, step*height+64.0, width, height, 0, height);
    seniTimer--;
    if(seniTimer == 0) {
    print("AIUEO_SENISHITERUYO")
      onNextSou();
    }
}

let madaHatsuNextSou = true;
function onNextSou() {
  bgColor = nextBgColor;
  if(madaHatsuNextSou) {
    madaHatsuNextSou = false;
  } else {
    charaLeanTimer = 10;
  }
}
let charaLeanTimer = 0;
let seniTimer = 0;
let seniTime = 10;
let seniColor = null;
let perSenni = 1024;
let intervalSeni = 256;
let firstUsualRefC;
//let makkurayamimadenoTime = perSenni*5;
let makkurayamimadenoTime = perSenni*5;// + perSenni;
let nextBgColor;

let nownorc = 8;
let nownorcount = 0;

let issyume = true;
let divedFew = 90;
let slowmo = 24;
let interere = 128;
let inthewater = false;
function doChLean() {
  charaLean -= 0.1;
}
function drawCloud(i, len) {
  const step = i / len;
  if(i > len-16) {
    const mokumokuHeight = (i-(len-16))/16;
    for(let _ = 0; _ < step*mokumokuHeight*256;_++) {
      noStroke();
      fill(255, 28);
      circle(random()*width*1.5-width/4, height-random()*mokumokuHeight*(height*1.25), 16+Math.random()*256);
    }
  }
}
let syumeCounter = 0;
const mosukoshisukunaihougayokunaiVariable = 3;
const iyamotonimodoshiteyokunai = 3;
const shiranaiyoUnit = 0;
const cloudPassedSyunkanNagasa = 2;
const atosukosidekaimenKyochoAnimNanStepMaekara = 5;
let tinti;
function gradRec(thick, spx, spy, long, dy, colorFrom, colorTo, f=2) {
  const w = 32;
   strokeWeight(w);
   const all = (thick+dy*long)/w;
   for(let i = 0;i < (thick+dy*long)/w; i++) {
    stroke(lerpColor(colorFrom, colorTo, (i/all)**f));
    line(spx, spy, spx+long, spy+long*dy);
    spy+=w;
   }
   noStroke();
}
//const mabutanoUranoIro = [65,0,50,128];
const mabutanoUranoIro = [100,0,80,128];
function draw() {
  //if(!window.p5myanim)return;
clear()
  //if(frameCount < 31*nownorc && frameCount%nownorc===0) {
  const numOfLoop = 31 - mosukoshisukunaihougayokunaiVariable + iyamotonimodoshiteyokunai + shiranaiyoUnit;
  if(frameCount > 48 && nownorcount < numOfLoop && frameCount%nownorc===0) {
    firstStroke(numOfLoop-nownorcount);
    nownorc+=~~((nownorc)/8);
    nownorcount++;
  }

  if(frameCount - INIT_UPDATE_COUNT - overSinkPeriodStart >= 0 && 
    frameCount - INIT_UPDATE_COUNT - overSinkPeriodStart <= overSinkPeriodEnd
  ) {
    const w = overSinkPeriodEnd-overSinkPeriodStart;

    const step = (frameCount-INIT_UPDATE_COUNT - overSinkPeriodStart)/w;
    const st = (INIT_UPDATE_COUNT-frameCount)/INIT_UPDATE_COUNT;
    const anim_speed = 3;
    nexon = refFin+(overSink)/2**anim_speed * (
      Math.pow(
        2, 
        anim_speed*st)-1
    );
  }
  if(step2p5float) {
    const n = noise(frameCount/1000);
    //charaY = (n-(refnoise||(refnoise=n)))*160 + refFin;
    charaY = sin((frameCount-(refFramec||(refFramec=frameCount)))/100)*16 + (nexon??refFin);
  }

  //この偶然できたピリオドを突入前の強調（赤黒から黒とか紫へのフェード、画面端強調、黒点滅、ブラックアウト、海面近づく、などにアニメーション機関に割り当てられるかも）
  const nazosuuji = 12;//12;
  if(frameCount <= INIT_UPDATE_COUNT) {
    const anim_speed = 3;
    const ta = INIT_UPDATE_COUNT-frameCount;
    const step = (ta)/INIT_UPDATE_COUNT;
    charaY = -(width+overSink)/2**anim_speed * (
      Math.pow(
        2, 
        anim_speed*step)-1
    );
    p_born = 0.05*(1-step) + 0.0125*step;
    //background(bgColor.top, (1-step) * 128);
    gradRec(
      height, 0, -64, width, 64/width, bgColor.top, bgColor.bottom, 2);
        
    //なんか意図せず見た目変わりそうなのでtint元に戻すようinformation
    tinti = [255, (1-step) * 128];
    //tint(...tinti);
    //ShedLight((1-step)/2, 0, 0, width, height);

    const extendH = ((height-0)/height);
    const alpha = Math.min(1,Math.max(0, (1-step)/2));
    ShedLightProcess(
        frameCount/256,
        [width, -16], 
        
        0,
        height/16*extendH, 
        0*alpha,
        1.5*1.5*alpha**2,
        
        PI+PI/3, 
        height*1.25*extendH,
        4*alpha,
        1.5*4*alpha**2,
        
        [
          [
            0.25,  4,  0.21
          ],
          [   
            1,  16, 0.00 
          ],
          [   
            1,  4,  1 
          ],
          [   
            1,  4,  0.01 
          ]
        ],
        8,
        32,
        10000,
      );
    


    refFin = charaY;

    charaX = (width/2)/2**anim_speed * (
      Math.pow(
        2, 
        anim_speed*step)-1
    );

    const maxOpacity = 128/256;
    const kokunaaru = Math.pow(2,8*(1-step));
    const kyugekiniusukunarunee = 1/(1+Math.E**(-((-((1-step)-0.9)*32))))-1;
    //(1/(1+Math.exp(-((1-step)*(-12)+6)))-1)**5;
    //if(ta < cloudPassedSyunkanNagasa) {
    //tint(192, (kokunaaru+kyugekiniusukunarunee)*maxOpacity);
  //ここちゃんとしたのにしてね
    //image(cloudIMG, 0, 0, width, height);
    //}
    drawCloud(frameCount, INIT_UPDATE_COUNT);
    tint(...tinti);
  } else if(frameCount - INIT_UPDATE_COUNT - nazosuuji <= transferPeriod) {
    step2p5float = true;
    const step = 
          (
            frameCount-INIT_UPDATE_COUNT
          )/transferPeriod
    /*const step = 
          (
            transferPeriod-(frameCount - INIT_UPDATE_COUNT - nazosuuji)
          )/transferPeriod//(transferPeriod+nazosuuji)//(transferPeriod) ;//もともとこれ(12)だったミスだけど何か効果あったかも*///意図を忘れました
    const actualCoreTransferPeriod = transferPeriod-transferPeriodSplitterPeriod;
    const coreRatio = actualCoreTransferPeriod/transferPeriod;
    const unactualRatio = 1-coreRatio;
    //const actualStep = ((1-step)-unactualRatio)/unactualRatio;//(step-unactualRatio) / coreRatio;
    const actualStep = (step-unactualRatio)/unactualRatio;//(step-unactualRatio) / coreRatio;
    
    //console.log("energy", step, actualStep);
    //print(actualCoreTransferPeriod, coreRatio, actualStep)
    /*const anim_speed = 1;
    charaY = refFin - overSink/2**anim_speed * (
      Math.pow(
        2, 
        anim_speed*(1-step))-1
    );*/
    frameRate(slowmo);
    //background(bgColor.top, (1-step) * 128);
    gradRec(
      height, 0, -64, width, 64/width, bgColor.top, bgColor.bottom, (3*(1-step)));
    
    //noStroke();
    //image(illustACBG, 0, 0, width, height);
    //fill(bgColor.top);60.4;
    if(actualStep > 0) {
      console.log("EA");
      const useStep = 1-actualStep/coreRatio;
      
      print("EI", (1-useStep));
      mergedEye((1-useStep)*30);
      if(useStep > 0) {
        //print("KEO",useStep)
        //quad(0, useStep*height, width, useStep*height+64.0, width, height, 0, height);
        //gradRec(height-useStep*height, 0, useStep*height, 
        //  width, 64/width,  bgColor.top, bgColor.bottom, 1.5*useStep);
        //Aoumi(
        //  (useStep)
        //);
      } else if(useStep <= 0) {
        //gradRec(height-useStep*height, 0, useStep*height, 
        //  width, 64/width,  bgColor.top, bgColor.bottom, 1.5*useStep);
        //Aoumi(
        //  (useStep))
        //  ;
        //const d = 1/((-useStep)*10);

        const d = (0.4+(2+useStep)/2)/1.42;
        const defd = ((2+useStep)/2);
        const dh = (0+(2+useStep)/2)/1.01;
        //console.log("1e",d);
        //console.log(d, "ECOL", bgColor.top.r*d*2 + (1-d)*160, bgColor.top.g*d, bgColor.top.b*d*1.25+(1-d)*190);
        //ここちゃんとしたのにしてね
        //fill(red(bgColor.top)*d*2+(1-d)*30, green(bgColor.top)*d, blue(bgColor.top)*d+50*(1-d));
        //fill(red(bgColor.top)*d, green(bgColor.top)*d+60*(1-d), blue(bgColor.top)*d+120*(1-d));
        //fill(red(bgColor.top)*d, green(bgColor.top)*d+65*(1-d), blue(bgColor.top)*d+100*(1-d));
        //quad(0, useStep*height, width, useStep*height+64.0, width, height, 0, height);
        /*fill(255*d);
        quad(0,0,width, height);
        push();
        imageMode(CENTER);
        translate(width/2, height/2);
        rotate(-(1-d)*32);
        image(oceanIMG,0,0,width*(1+1*(1-d)),height*(1+2*(1-d)));
        pop();*/
        //fill(bgColor.top);
        //rect(0,0,width, height);
        tint(128*(1-d), (Math.pow(1.1, (1-defd))- 1) * (192/(1.1-1)))
        push();
        //imageMode(TOP, LEFT);
        imageMode(CENTER, CENTER);
        translate(width/2, height/2);
        //rotate(-(1-d)*1);
        //rotate((1-d));
        const lside = Math.max(height,width);
        const bufw = width/2;
        const bufh= height/2;
        const zurew = width/2;
        //image(oceanIMG,-bufw,-bufh,lside*(1.6+1*(1-d))+bufw*2,lside*(1+2*(1-d))+bufh);
        //image(oceanIMG,-bufw,-bufh,lside*(1.6+1*(1-d))+bufw*2,lside*(1+2.8*(1-d))+bufh);
        //image(oceanIMG,-bufw,-bufh-lside*2.8*(1-d)/2,lside*(1.6+1*(1-d))+bufw*2,lside*(1+2.8*(1-d)/2)+bufh);
        //image(oceanIMG,-bufw,-bufh-lside*1.8*(1-d)/1.75,lside*(1.6+1*(1-d))+bufw*2,lside*(1+2*(1-d)/2)+bufh);
        rotate(0.2+-0.05+0.7*(1-d)*0.32);
        //image(oceanIMG,width/2-bufw*1.25-((1-d)**1.2*lside)/5.2,height/2-bufh-lside*1.8*(1-d)/1.75,lside*(1.6+1*(1-d)**1.2)+bufw*2,lside*(1.2+2*(1-d)/2)+bufh);
        //*image(oceanIMG,width/2-bufw*1.25-((1-d)**1.2*lside)/5.2,height/2-bufh-lside*1.8*(1-dh)*0.456/1.75,lside*(1.6+1*(1-d)**1.2)+bufw*2,lside*(1.2+2*(1-dh)*0.456/2)+bufh);
        //rotate((1-d));
        pop();
        console.log("EK", defd,192*((1-defd))**2);
        //fill(0,255+255*(1-defd));
        //fill(0,255*((1-defd))**0.5);
        //rect(0,0,width, height);
        //tint(255, (Math.pow(1.1, (1-defd))- 1) * (256/(1.1-1)))
        tint(...tinti);
      }
    } else {
      console.log("EB");
      const useStep = -actualStep;
      const karimonoStep = actualStep/(1-coreRatio);
      background(255, 255*(useStep)**4)
    }
  } else {
    //const step = frameCount - INIT_UPDATE_COUNT - 12 - transferPeriod;
    
    
    if(firstUsual) {
      StartDislplayNamePlate();
      firstUsual = false;
      firstUsualRefC = frameCount;
    }
    background(bgColor.top);
    //遷移見えなくていいならココ(元の位置)
    if(seniTimer > 0)senni(nextBgColor);
    //const nextIntense = makkurayamimadenoTime/
    
    if(charaLeanTimer > 0) {
      charaLeanTimer--;
      if(charaLeanTimer==0)doChLean();
    }
    let mak2 = frameCount-firstUsualRefC;
    if(mak2 > divedFew && slowmo < 60) {
      frameRate(slowmo++);
    }
    if(!inthewater) {
      charaTokubetsuCounter = chakusuiCHokugoTokubetsuCharaLong;
    }
    inthewater = true;
    //background(bgColor.top);
    //遷移見えなくなってるけどちゃんと見たいならここ
    //if(seniTimer > 0)senni(nextBgColor);
    
    if(syumeCounter < 2) {
      const spp = 1.35;
      const st = mak2/(perSenni/spp);
      //tint(255*(1-st), (1-st) * 64);  push();
      push();
      //imageMode(CENTER);
      //translate(width/2, height/2);
      rotate(-0.15);
      //tint(256/*(1-st*spp)*/, (1-st*spp) * 128);
      ShedLight( 
        (1-st*spp)/3*2,
        0-width/8 ,//-width/2, 
        0-height/8,//-height/2, 
        width*1.5 ,//-width/2, 
        height*1.5,//-height/2
      );
      //noTint();
      pop();
    }

    //let mak = mak2 - interere;
    let mak = mak2;// - interere;
    if(mak < makkurayamimadenoTime) {
      //if((mak+1)%perSenni === 0) {
      if((mak)%perSenni === 0) {
        seniTimer = seniTime;

        const step = (frameCount-firstUsualRefC-interere)/makkurayamimadenoTime;
        nextBgColor = {
          top: lerpColor(firstBgColor.top, finalBgColor.top, step),
          bottom: lerpColor(firstBgColor.bottom, finalBgColor.bottom, step)
        };
        if(issyume)doChLean();
        issyume = false;
        syumeCounter++;
      }
    }
  }
  strokeWeight(1);
  
  print(Bubbles.length);
  stroke(0,200,255);
  strokeWeight(2);
  point(chara.cx,chara.cy);
  point(chara.cx,chara.cy+chara.sy/2);
  point(chara.cx-chara.sx/2,chara.cy);
  point(chara.cx+chara.sx/2,chara.cy);
  p5update();
  
  //Bubbles.sort((a,b)=>a.norevise?-Infinity:a.z-b.z);
  Bubbles.sort((a,b)=>a.z-b.z);
  
  drawingContext.filter = 'none';
  lastBlurZ = 0;
  for(let _ = 0; _ < maxBG - bgCount;_++) {
    waterBG(); 
  }
  if(inthewater) {
    //background(0, 0, 70, 92);
    background(0, 30, 70, 102);
  }/* else {
    background(...mabutanoUranoIro);
  }*/
 if(!testt)background(...mabutanoUranoIro);
    //blendMode(ADD);
  if(noch)drawChara(charaY);
  bgCount = 0;
  noch = true;


  

}

let oceanCol = '255,255,0';
function applyCSSCol() {
  const root = document.querySelector(':root');

  try {
    oceanCol = 
      get(width-4,height-4).join(", ");
  } catch(e) {
    console.error(e);
  }

  root.style.setProperty(
    "--current-ocean-color",
    oceanCol
  );
}

const norBubbules = [];
const environmentBubblePBorn = 0.01;
//const transferPeriod = 16;
const transferPeriodSplitterPeriod = 32;
const transferPeriod = 16 + transferPeriodSplitterPeriod;//24
const chakusuiCHokugoTokubetsuCharaLong = 48;//64//2*48;
let charaTokubetsuCounter = 0;
function p5update(withview=true) {
  noreviseUpdateAndDrawBubble();
  for(let i = Bubbles.length-1;i >= 0;i--) {
    const bub = Bubbles[i];
    if(bub.z - cam.cz <= cam.fz) {
      Bubbles.splice(i,1);
      continue;
    }
    const charaBottom = chara.cy + chara.sy/2;
    if(withview)drawBubble(bub, charaBottom, i);
    //bub.y -= BASIC_SPEED.y/bub.size;
    bub.y -= BASIC_SPEED.y;
    avoid(bub, charaBottom);
  }
  //ここは対数分布の方が良さそう
  /*const newborn = 
        Math.min(maxnewborn,BASIC_SPAWN_BUBBLE_EVERY_FRAME-normalRand()*varrianceSpawn);
  for(let i = 0;i < newborn;i++) {
    createBubble();
  }*/
  for(let i = 0; i < bornChancePerFrame;i++) {
    if(Math.random() < p_born) {
      createBubble();
    }
  }
  if(Math.random() < environmentBubblePBorn) {
      createBubble(/*environment=*/true);
  }
  /*textAlign(LEFT, LEFT);
  text("和田 昊征", 12, 30);*/
}


const aoumiConf = {
   camAngle: Math.PI,
   h: 14,
   baseSize: 32,
   heightUse:null,
   diveAnimDuration: 1.25*(transferPeriod-transferPeriodSplitterPeriod),//64,
   sinCount: 8
}
function Aoumi(useStep) {
  const bef = (aoumiConf.h**2 + (Math.tan(aoumiConf.camAngle)*aoumiConf.h)**2)**0.5;
  
  if(useStep >= 64/aoumiConf.diveAnimDuration)return;
  aoumiConf.h-=0.4*24/aoumiConf.diveAnimDuration;
  const [cxx, loupe, kirakira] = getCameraPappet(
    (aoumiConf.camAngle), Math.PI/4, aoumiConf.h, Math.PI/6);

  
  const aft = (aoumiConf.h**2 + (Math.tan(aoumiConf.camAngle)*aoumiConf.h)**2)**0.5;
  aoumiConf.baseSize *= bef/aft;
  //print(camAngle)
  const result = Umi(baseThick=aoumiConf.baseSize, loupe, kirakira, 0, 
      height/2, 
      width*1.25, height, Math.sin(PI/6), 
      [
        0,
        30,
        96
      ], [
        128*10,
        128*10,
        6*100
      ], minThick=16, 
      cxx, -200, 200,
             width/2, heightUse=height/2*(1-useStep**2));
}
      
function getCameraPappet(axisAngle, fieldOfView, verticalDistanceToFace, lightAngle) {
    const cx_onf = Math.tan(axisAngle)*
          verticalDistanceToFace;
    //print(cx_onf);
    const rx_onf = Math.tan(axisAngle-fieldOfView)*
          verticalDistanceToFace;
    //rx_onf(r)->cx_onf(c)
    //rx, cx, vd
    const a = rx_onf ** 2 + verticalDistanceToFace**2
    const b = cx_onf ** 2 + verticalDistanceToFace**2
    //sinA/sinB, sinB/sinC
    function magnifier(x) {
      const refx = b;
      //const nowsin = //(x**2/verticalDistanceToFace**2);
      return ((verticalDistanceToFace**2+x**2)/
      (rx_onf**2+verticalDistanceToFace**2))**0.5;
    }
    
    function specular(x) {
      const tr = (verticalDistanceToFace**2+x**2);
      const lsindtr = sin(lightAngle)/tr;
      const lcosdtr = cos(lightAngle)/tr;
      return (lcosdtr*x + lsindtr*verticalDistanceToFace);
    }
    return [cx_onf,magnifier, specular];
}
  
function slicedWave(thick, col, light, dy, sx, sy, w) {
  //intense: 0 ~ 1
  //intense = (intense-0.5)*2
  const unit = thick/aoumiConf.sinCount;
  strokeWeight(min(32,unit));
  //print(thick, unit);
  for(let j = 0; j < thick; j+=unit) {
    const ref = sin(j/unit*4);//(Math.sin()+1);//2;
    for(let i = 0;i < w;i+=unit/2){
      const intense = ref +
      noise(i*aoumiConf.sinCount + j)*2;
      stroke(
        light[0]*intense+col[0],
        light[1]*intense+col[1],
        light[2]*intense+col[2],
        intense * 255,
      );
      strokeCap(PROJECT);
      line(sx+i     + noise(i+j+frameCount)*5-5, 
          sy+dy*i+j + noise(i+j+frameCount)*5-5,
          sx+i, 
          sy+dy*i+j
      );
    }
  }
}

function Umi(baseThickness, magnifierFunc, specularFunc, sx, sy, w, h, dy, col, light, minThick, cxx, cxxs, cxxe,
             cpx, cpy) {
   let cc = 0;

    
  let s = cxx;
  while(s < cxxe) {
    const thisSpliceWidth = 
          baseThickness*magnifierFunc(s);
    const thisSpecularIntense = 
      specularFunc(s);
    if(
      thisSpliceWidth >= minThick && 
       thisSpecularIntense >= 0
    ) {
      slicedWave(
        thisSpliceWidth, 
        col, 
        [
          thisSpecularIntense*light[0],
          thisSpecularIntense*light[1],
          thisSpecularIntense*light[2]
        ],
        dy,
        sx,
        s+cpy-cxx,
        w
      );
    } else break;
    s-=thisSpliceWidth;
    cc++;
  }
  s = cxx;
  while(s > cxxs) {
    const thisSpliceWidth = 
          baseThickness*magnifierFunc(s);
    const thisSpecularIntense = 
      specularFunc(s);
    //print(s,thisSpliceWidth, thisSpecularIntense)
    
    if(
      thisSpliceWidth >= minThick && 
       thisSpecularIntense >= 0
    ) {
      slicedWave(
        thisSpliceWidth, 
        col, 
        [
          thisSpecularIntense*light[0],
          thisSpecularIntense*light[1],
          thisSpecularIntense*light[2]
        ],
        dy,
        sx,
        s+cpy-cxx,
        w
      );
    } else break;
    s+=thisSpliceWidth;
    cc++;
  }
  return cc;
}

function kurultu(
useStep,
 cc,
 rr,
 anim_step,
 sprate,
 numOf_gagaga,
 gagaga_step,
 gagaga_displacement,
 ...col
) {
  if(useStep < 0)return;
  if(useStep>anim_step+gagaga_step)return;
  const korezettaiIro = col.splice(0,1);
  const ss = 0;
  const targetSpeed = 2*PI/(anim_step*(sprate-1));
  const s = ss-(useStep*targetSpeed*sprate);
  const e = ss-useStep*targetSpeed;
  if(useStep >= anim_step) {
    const prr = (useStep-anim_step)/gagaga_step;
    for(let i = 0;i<1;i++) {
      const k = (
        
        (~~(prr*numOf_gagaga
      ))/ numOf_gagaga )**0.5;//2;
      
      stroke(korezettaiIro,...col,(col.slice(-1)||255)*(1-k)**2);
      circle(...cc, rr + 
         k * gagaga_displacement);
    }
  } else {
    stroke(korezettaiIro,...col);
    arc(...cc, rr, rr, s, e);
  }
}


function fillEyelid(t, a=4, b=4, w=4) {
  const top = (x)=>height/2 - t*a/
        (10+(((x/4)**2)**0.5)**4);
  const bottom = (x)=>height/2 + t*a/
        (10+(((x/4)**2)**0.5)**4);
  
  strokeWeight(w);
  for(let x = 0; x <= width + w; x+=w) {
    line(x, 0 , x, top((x-width/2)*b));
    line(x, bottom((x-width/2)*b) , x, height);
  }
}

let testt = false;
function mergedEye(thisFrame) {
  
  const sec = 1.8*45;
  const sec2 = 0.2*45;
  const sec3 = 0*45;
  const eyeSpeed = 28;
  const param = [100, 1/15];
  const useFrame = thisFrame/eyeSpeed;
  strokeCap(PROJECT);
  const expo = .5;//2.3;
  const mysff = (useFrame - sec)/(sec2+sec3);
  const defAlphaEye = mabutanoUranoIro[3];//196;
  if(thisFrame < sec) {
    testt = true;
    stroke(...mabutanoUranoIro.slice(0,3), defAlphaEye);
    fillEyelid(useFrame, ...param);
  } else if(thisFrame - sec < sec2) { 
    stroke(...mabutanoUranoIro.slice(0,3), defAlphaEye-defAlphaEye*(mysff**expo) ); 
    fillEyelid(useFrame, ...param);
  } else if(thisFrame-sec-sec2 <sec3){
    stroke(...mabutanoUranoIro.slice(0,3), defAlphaEye-defAlphaEye*(mysff**expo) ); 
    fillEyelid(sec+sec2, ...param);
    //background(255, 255-10*(frameCount/60-sec))
  }
  
  strokeWeight(16);
  noFill();
  const rr = 80;
  const anim_step = 2*16;
  const sprate = (1/30+1/50)/(1/50);
  const numOf_gagaga = 5;
  const gagaga_step = 16;
  const gagaga_displacement = 32;
  const params = [
    rr ,
    anim_step,
    sprate,
    numOf_gagaga,
    gagaga_step,
    gagaga_displacement,
  ]
  kurultu(thisFrame-32,[width/2,height/2],...params,255);
  //strokeWeight(8);
  const params2 = [
    rr*1.5 ,
    anim_step,
    sprate,
    numOf_gagaga,
    gagaga_step,
    gagaga_displacement,
  ]
  kurultu(thisFrame-32,[width/2,height/2],...params2,255);

  strokeCap(ROUND);
}

//loop()
window.p5myanim = true;

def.mainBoard.addEventListener('scroll', () => {
    //updateContainerSize();
    console.log("q", def.mainBoard.scrollTop, def.mainBoard.offsetHeight);
    const P = defP + (def.mainBoard.scrollTop / def.mainBoard.offsetHeight)*10;
    cc.style('transform', `translate(-50%, -${P}%)`);
})

window.setup = setup;
window.draw = draw;
window.preload = preload;