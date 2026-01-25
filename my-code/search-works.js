document.getElementById("flow-container-scroll-marker").scrollIntoView({
    behavior: 'smooth',
    block: 'center'
});

import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/transformers.min.js";


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
        
const candidate = await Promise.all([
    ["program JavaScript TypeScript Database webapp noteapp",         
        new Item(
            {
               "label": "階層構造を簡単に操作できるノートアプリ",
               "image": "my-works/content/oasis.png",
               "stack": ["チーム開発", "TS", "React", "SCSS", "RestAPI", "データベース", "WebSocket"],
               "description": "いろいろなボックスを自由に並べたり入れ子状に組み合わせてデザインできる共同編集可能なノートアプリケーション",
               "detailed": "ダミーコンテンツ",
            }
        ),
    ],
    ["SPAM tool program chatbot Jvascript DiscordJS",
        new Item(
            {
                "label": "SPAM防止BOT",
                "video": "my-works/content/oasis.png",
                "stack": ["NodeJS", "DiscordJS"],
                "description": 
                "スパム防止機能：\n"+
                "単語数と文字数の比に言語ごとに特徴がある気がしたので、その値などを使いスパムかどうかを判定する機能を作りました。",
                "detailed": "ダミーコンテンツ",
            }
        )
    ],
    ["awarded art paint", 
        new Item(
            {
               "label": "絵",
               "image": "my-works/content/kokuhasho-no-machi.png",
               "stack": ["アクリル画", "デジタル絵", "(レタリング)"],
               "description": "飛行機",
               "detailed": "ダミーコンテンツ",
            }
        ),
    ],
    ["video original-character theme:ocean game-developping cold-color playing image-processing (CG, C#, Blender)",
        new Item(
            {
                "label": "ゲーム",
                "video": "my-works/content/oasis.mp4",
                "stack": ["Unity", "ShaderLab", "C#", "p5.js", "Blender"],
                "description": "音楽や3Dモデルなども作成",
                "detailed": "ダミーコンテンツ",
            }
        )
    ],
    ["cornel-box CG global-illmunation liminal-space Python openGL",
        new Item(
            {
                "label": "CG",
                "video": "my-works/content/oasis.mp4",
                "stack": ["CG", "pyOpenGL"],
                "description": "CGの授業の課題です。少し不気味なコーネルボックス。",
                "detailed": "ダミーコンテンツ",
            }
        )
    ],
    ["music, game-music degital-audio-work-space FlStuduio composition sound-effect sad nostalgy reminiscence fear beautiful",
        new Item(
            {
                "label": "音楽",
                "audio": "my-works/content/minazoko-no-koto.mp3",
                "stack": ["作曲", "音楽理論"],
                "description": "音楽や効果音を作っています",
                "detailed": "ダミーコンテンツ",
            }
        )
    ]
].map(async(v)=>[[(await pipe(v[0], {pooling: 'mean', normalize: true})).data,...await Promise.all(v[0].split(' ').map(async k=>(await pipe(k, {pooling: 'mean', normalize: true})).data))], ...v.slice(1)]));

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