document.getElementById("flow-container-scroll-marker").scrollIntoView({
    behavior: 'smooth',
    block: 'center'
});

import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/transformers.min.js";
//できるだけサイズの小さいもの
import { TinySegmenter } from "../other-author-lib/tiny-segmenter@0.2.0/tiny-segmenter-0.2.0.js";

(async()=>{


//const pipeline = MrsXenova.pipeline;

const pipe = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2'
);
/*const translator = await pipeline(
  "translation",
  "Xenova/opus-mt-ja-en"
);*/

//const segmenter = new TinySegmenter();
const searchBoxForm = document.getElementById("searchbox-form");
const searchBox = document.getElementById("searchbox");


/*もしかしたら今後AIの登場でスペース区切りの検索に慣れてない人も出てくるかもなので分かち書きに変換したうえで分割する*/
//const segmenter = new TinySegmenter(); //=> 分かち書きしない方が良いかもなのでしないことにする。

const candidate = await Promise.all(workData.map(async(v)=>[[(await pipe(v[0], {pooling: 'mean', normalize: true})).data,...await Promise.all(v[0].split(' ').map(async k=>(await pipe(k, {pooling: 'mean', normalize: true})).data))], ...v.slice(1)]));

console.log("CAN", candidate);
searchBoxForm.addEventListener('submit', function(e){
    e.preventDefault();
    (async()=>{
        const translatedToEn = searchBox.value;//(await translator([searchBox.value]))[0].translation_text;
        //console.log(translatedToEn,"ENE")
        const output = await pipe(translatedToEn, { pooling: 'mean', normalize: true });
        console.log(translatedToEn, output.data);
        //const splitted = searchBox.value.split(/\s/).reduce((res,v)=>[...segmenter.segment(v), ...res],[]);
        let target = candidate.map(c=>[c[0].map(k=>getCosineWithouNormalize(k,output.data)), ...c.slice(1)]);

        const f = q => q.reduce((res,v)=>res+v,0)/q.length;
        const conv = q => Math.sign(q) * ( Math.abs(q) ** (1/16));
        target.sort((a,b)=>f(b[0]) * conv(b[0][0]) - f(a[0]) * conv(a[0][0]));
        const flow = new Items(null, ...target.map(t=>t[1]));
        flow.display(document.getElementById("flow-container"));
        document.getElementById("flow-container-scroll-marker").scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    })();
});

function getCosineWithouNormalize(a, b) {
    //console.log(a.reduce((res,v,i)=>res + v*b[i],0))
    return a.reduce((res,v,i)=>res + v*b[i],0);
}

function getCosine(a, b) {
    return a.reduce((res,v,i)=>res + v*b[i],0)/(
        a.reduce((res,v)=>res+v**2,0)**0.5 * b.reduce((res,v)=>res+v**2,0)**0.5
    );
}
})();