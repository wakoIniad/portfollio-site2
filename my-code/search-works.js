document.getElementById("flow-container-scroll-marker").scrollIntoView({
    behavior: 'smooth',
    block: 'center'
});

//import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/transformers.min.js";
(async()=>{
const pipeline = MrsXenova.pipeline;
const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

//const segmenter = new TinySegmenter();
const searchBoxForm = document.getElementById("searchbox-form");
const searchBox = document.getElementById("searchbox");


/*もしかしたら今後AIの登場でスペース区切りの検索に慣れてない人も出てくるかもなので分かち書きに変換したうえで分割する*/
        
const candidate = await Promise.all([
    ["海と人の暗い雰囲気の絵",         
        new Item(
            {
               "label": "絵",
               "image": "my-works/content/ko.png",
               "stack": ["アクリル画", "デジタル絵", "(レタリング)"],
               "description": "飛行機",
               "detailed": "ダミーコンテンツ",
            }
        ),
    ],
    ["キャラクター CG 3Dモデル 写真", 
        new Item(
            {
               "label": "絵",
               "image": "my-works/content/ko.png",
               "stack": ["アクリル画", "デジタル絵", "(レタリング)"],
               "description": "飛行機",
               "detailed": "ダミーコンテンツ",
            }
        ),
    ],
    ["SPAM 防止 チャットボット BOT ツール プログラム",
        new Item(
            {
                "label": "SPAM防止BOT",
                "video": "my-works/content/chatbot.mp4",
                "stack": ["NodeJS", "DiscordJS"],
                "description": 
                "スパム防止機能：\n"+
                "単語数と文字数の比に言語ごとに特徴がある気がしたので、その値などを使ってにスパムかどうかを判定する機能を作りました。",
                "detailed": "ダミーコンテンツ",
            }
        )
    ],
    ["ウェブアプリケーション",
        new Item(
            {
                "label": "ウェブアプリケーション",
                "video": "my-works/content/memolive-app.mp4",
                "stack": ["JS", "TS", "SCSS", "HTML", "React"],
                "description": "いろいろなボックスを自由に並べたり入れ子状に組み合わせてデザインできる共同編集可能なノートアプリケーション",
                "detailed": "ダミーコンテンツ",
            }
        )
    ],
    ["コーネルボックス CG 大域照明モデル リムナルスペース",
        new Item(
            {
                "label": "pyOpenGL",
                "movie": "",
                "stack": ["CG", "pyOpenGL"],
                "description": "-- -- --",
                "detailed": "ダミーコンテンツ",
            }
        )
    ]
].map(async(v)=>[(await pipe(v[0], {pooling: 'mean', normalize: true})).data, ...v.slice(1)]));

searchBoxForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    (async()=>{
        const output = await pipe(searchBox.value, { pooling: 'mean', normalize: true });
        console.log(output.data);
        //const splitted = searchBox.value.split(/\s/).reduce((res,v)=>[...segmenter.segment(v), ...res],[]);
        let target = candidate.map(c=>[getCosineWithouNormalize(c[0],output.data), ...c.slice(1)])
        target.sort((a,b)=>b[0] - a[0]);
        //console.log(target, target.map(t=>t[1]));
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