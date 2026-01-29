class Item {
    constructor(content) {
        this.attr = content;
    }
    getAllAttributes() {
        //後で？
        return Object.entries(this.attr);
    }
}
class Items {
    static defaultExpandHandler = defaultExpandHandler;
    static uniqueClassElmMap = {
        'pack':                     ['flex-unit'                                    ],
        'packitem':                 ['flow-pack-item'                               ],
        'label':                    ['flow-label'                                   ],
        'resource_container':       ['flow-resource-container', /*'img-container'*/     ],
        'audio':                    ['flow-audio'                                   ],
        'image':                    ['flow-image'                                   ],
        'video':                    ['flow-video'                                   ],
        'description':              ['flow-description'                             ],
        'context':                  ['flow-context'                                 ],
        'stack':                    ['flow-stack'                                   ],
        'stackitem':                ['flow-stack-item'                              ],
        'crosslinker':              ['flow-linker-base'                             ],
        'linkerheader':             ['linker-header'                                ],
        'maincontent':              ['flow-content-padding'                         ],
        'expanable':                ['expand-on-click'                              ],
        'singleplay':               ['singleplay'                                   ],
        'expand_resource_container':['expand-on-click'                              ],
/*        'expand_description':       ['description'                                  ],*/
        'detailed':                 ['description'                                  ],
    }
    static ITEM_CONTAINER_CLASS_MAP = {
        'audio': 'resource_container',
        'image': 'resource_container',
        'video': 'resource_container',
        'stack': 'stack',
        'description': 'description',
        'context': 'context',
        'label': 'label',
        'detailed': 'detailed',
    }
    static LINK_TYPE_MAP = [
        [ -1,   [ "cross-linker-reversed-l" ] ], 
        [ -0.2, [ "cross-linker-line-rl"       ] ], 
        [ 0,    [ "cross-linker-line-lr"       ] ], 
        [ 0.2,  [ "cross-linker-l"          ] ]
    ]
    static THINNEST_WIDTH = 4;
    constructor(noise, ...items) {
        this.items = items;
        this.noise = noise;
    }
    createStackItem(text) {
        const elm = document.createElement('span');
        elm.textContent = text;
        return elm;
    }
    getExpandableMainContentWrapper(item) {
        
        const wrapper_root = document.createElement('div');
        const wrapper_dep1 = document.createElement('div');
        const wrapper_dep2 = document.createElement('div');
        wrapper_root.classList.add('insection');
        wrapper_dep1.classList.add('d-section');
        wrapper_dep2.classList.add('img-container');
        wrapper_dep2.append(item);
        wrapper_dep1.append(wrapper_dep2);
        wrapper_root.append(wrapper_dep1);
        return wrapper_root;
    }
    createResourceContainer() {
        const elm = document.createElement('div');
        return elm;
    }
    createPackItem(type, value) {
        let elm;
        switch(type) {
            case 'stack':
                elm = document.createElement('div');
                for(const stackItem of value) {
                    const ch = this.createStackItem(stackItem);
                    ch.classList.add(Items.uniqueClassElmMap['stackitem']);
                    elm.appendChild(ch);
                }
                break;
            case 'image':
            case 'audio':
            case 'video':
                const ch = document.createElement({
                    'image': 'img',
                    'audio': 'audio',
                    'video': 'video'
                }[type]);
                ch.src = value;
                ch.classList.add(Items.uniqueClassElmMap[type]);
                if(type==='audio'/* || type==='video'*/) {
                    ch.controls = true;
                    ch.classList.add(Items.uniqueClassElmMap['singleplay']);
                }
                if(type==='video') {
                    ch.autoplay = true;
                    ch.muted = true;
                    ch.loop = true;
                }
                if(type==='video' || type==='image') {
                    //ch = wrapper_dep1;
                    //ch.classList.add(Items.uniqueClassElmMap['expanable']);
                    
                }
                elm = this.getExpandableMainContentWrapper(ch);/*this.createResourceContainer();*/
                elm.appendChild(ch);
                break;
            case 'label':
                elm = document.createElement('div');
                elm.textContent = value;
            case 'description':
            case 'context':
                const brElm = document.createElement('br');
                let notFirstLine = false;
                elm = document.createElement('div');
                for(const line of value.split('\n')) {
                    if(notFirstLine)elm.append(brElm);
                    const ch = document.createElement('span');
                    ch.textContent = line;
                    elm.append(line);
                    notFirstLine = true;
                }
                break;
            case 'detailed':
                console.log("detaiil");
                elm = document.createElement('div');
                elm.textContent = value;
                break;
                
        }
        return elm;
    }
    crosslinking(fromX, toX, root) {
        const crosslinker = document.createElement('span');
        const diff = toX-fromX;
        let selector = 0;
        while((Items.LINK_TYPE_MAP?.[selector+1]?.[0]??Infinity) < diff)selector++;
        crosslinker.classList.add(Items.LINK_TYPE_MAP[selector][1]);
        crosslinker.classList.add(Items.uniqueClassElmMap['crosslinker']);
        crosslinker.style.left = `${
            (Math.min(fromX, toX)+0.5) * 100
        }%`;
        console.log("diff", diff, Math.abs(diff*100));
        crosslinker.style.width = `max(${Items.THINNEST_WIDTH}px, ${Math.abs(diff*100)}%)`;
        root.prepend(crosslinker);
        root.classList.add(Items.uniqueClassElmMap['linkerheader']);

        /*const crossLinkingPosition*/
    }
    getExpandContainer() {
        const elm = document.createElement('div');
        elm.classList.add(Items.uniqueClassElmMap['expand_resource_container']);
        return elm;
    }
    display(container, reset=true) {
        if(reset)container.innerHTML = "";
        const nowHeight = 0;
        let tailX = null
        for(const [counter, item] of Object.entries(this.items)) {
            const itemPack = document.createElement("div");
            itemPack.classList.add(Items.uniqueClassElmMap['pack']);
            const children = {};
            
            for(const [key, value] of item.getAllAttributes()) {
                if(key in Items.uniqueClassElmMap) {
                    const elm = this.createPackItem(key, value);
                    children[key] = elm;
                    elm.classList.add(Items.uniqueClassElmMap['packitem']);
                    const usingContainer = Items.ITEM_CONTAINER_CLASS_MAP[key];
                    elm.classList.add(...Items.uniqueClassElmMap[usingContainer]);
                }
            }

            let flowFrom;
            if('label' in children) {
                if(tailX) {
                    this.forcePos(tailX, children['label']);
                    this.crosslinking(tailX, tailX, children['label']);
                    flowFrom = tailX;
                } else { 
                    this.pos(counter, children['label']);
                }
                itemPack.appendChild(children['label']);
            }

            //メインコンテンツとして説明、ビデオ、音声、画像にする
            
            /*const {description, image, audio, video} 
                = children;*/
            //優先度順の配列
            const mainContent = ["video", "audio", "image", "context"];
            const subContents = ["description"];
            const other = ["context"];
            const on_expand = ["detailed"];

            const packed_key = 'container';
            let firstContent = true;
            let lastMaincontent = null;

            const link = (tailX, content) => {
                firstContent = false;
                if(flowFrom)this.crosslinking(flowFrom, tailX, content);
            }

            const expandableContainer = this.getExpandContainer();
            for(const contentType of mainContent) {
                if(contentType in children) {
                    expandableContainer.appendChild(children[contentType]);
                }
            }
            for(const contentType of on_expand) {
                if(contentType in children) {
                    expandableContainer.appendChild(children[contentType]);
                }
            }
            expandableContainer.onclick  = ()=>Items.defaultExpandHandler(expandableContainer);
            children[packed_key] = expandableContainer;

            for(const contentType of [packed_key, ...subContents, ...other]) {
                if(contentType in children) {
                    if(mainContent.includes(contentType))lastMaincontent = children[contentType];
                    //tailX = this.pos(counter, children[contentType]);
                    tailX = this.onlyPos(counter);
                    this.forcePosBinary(this.onlyPos(counter), children[contentType]);
                    children[contentType].classList.add(Items.uniqueClassElmMap["maincontent"]);
                    //if(subContents.includes(contentType) && lastMaincontent) {
                    //    lastMaincontent.appendChild(children[contentType]);
                    //} else 
                    itemPack.appendChild(children[contentType]);
                    if(firstContent) link(tailX, children[contentType]);
                }
            }
            
            if('stack' in children) {
                //tailX = this.pos(counter, children['stack']);
                tailX = this.onlyPos(counter);
                this.forcePosBinary(this.onlyPos(counter), children['stack']);
                itemPack.appendChild( children['stack']);
                if(firstContent) link(tailX, children['stack']);
            }
            container.appendChild(itemPack)
        }
    }
    
    forcePosBinary(transformed, target) {
        if(!this.noise)return;
        if(0 < transformed) {
          target.style.left = `${100-0}%`;
          target.style.transform = `translate(-100%, 0%)`;
          return -0.8;
        } else {
          target.style.left = '0';
          return 0.8;
        }
    }
    forcePos(transformed, target) {
        if(!this.noise)return;
        if(0 < transformed) {
          //target.style.right = `${-(~~(50-transformed*100))-50}%`;
          target.style.left = `${100-(~~(50-transformed*100))}%`;
          target.style.transform = `translate(-100%, 0%)`;
          console.log('right', `${(~~(50-transformed*100))}%`);
        } else {
          target.style.left = `${(~~(transformed*100+50))}%`;
          console.log('left', `${(~~(transformed*100+50))}%`);
        }
        target.style.maxWidth = `${
            100 - (50-Math.abs(transformed*100))
        }%`;
    }
    onlyPos(count) {
        if(!this.noise)return 0;
        const useVal = this.noise(count*100/16);
        const transformed = 1/(1+Math.exp( (useVal-0.5)*10 ))- 0.5;
        return transformed;
    }
    pos(count, target) {
        const transformed = this.onlyPos(count);
        console.log("trte", transformed);
        //const now = width/2 - 100*(transformed);
        //let css = [
        //
        //];
        //css += `min-width: 50%\n`;
        this.forcePos(transformed, target);
        return transformed;
    }
    #box() {
        return HTMLElement;
    }
    #path() {

    }
    #noise() {

    }
}
/*class Works extends Items {
    constructor() {
        super(
            noise,
            new Item(
                {
                    "label": "ジェネレーティブアート",
                    "context": "トップページのアニメーションはプログラムでリアルタイムに描いています。\n"+
                                "このセクション自体もプログラムで自動生成されています。※デザイン修正途中",
                    "stack": ["p5.js", "webGL", "svg"]
                }
            ),
            new Item(
                {
                   "label": "私はインディーゲームを作っています",
                   "image": "my-works/content/image2.png",
                   "video": "my-works/content/image2.png",
                   "stack": ["Unity", "C#", "ShaderLab", "Blender", "p5.js"],
                   "description": "東京ゲームダンジョン11に出展予定です。"
                }
            ),
            new Item(
                {
                   "label": "絵も好きです",
                   "image": "my-works/content/kokuhasho-no-machi.png",
                   "stack": ["アクリル画", "デジタル絵", "(レタリング)", "最近描いてない"],
                   "description": "県知事賞と県展入選が1回ずつあります。\n市広報の挿絵やホテルでの展示に使用されたことがあります。"
                }
            ),
            new Item(
                {
                    "label": "作曲が趣味です",
                    "audio": "my-works/content/minazoko-no-koto.mp3",
                    "stack": ["Utau", "基礎的な音楽理論", "基礎的な音の加工", "効果音作成", "FL studio mobile", "あまり得意ではないかも"],
                    "description": "公募に出したこともありますが落ちました。\n作曲サークルで副サークル長をやっています。"
                }
            ),
            new Item(
                {
                    "label": "CG(?)の知識が少しだけあります",
                    "audio": "my-works/content/minazoko-no-koto.mp3",
                    "stack": ["Blender", "pyOpenGL", "Shader", "p5.js", "ShaderLab", "post-process", "Unity", "ゲーム開発"],
                    "description": "これは学校の課題で作った大域照明モデルです。"
                }
            ),
            new Item(
                {
                    "label": "ウェブアプリケーションを作っていました",
                    "video": "my-works/content/memolive-app.mp4",
                    "stack": ["JS", "TS", "SCSS", "CSS", "HTML", "React"],
                    "description": "JavaScriptからプログラミングを始めました。"
                }
            ),
            new Item(
                {
                    "label": "チャットボットが初めて作ったアプリケーションです(中学生の時)",
                    "video": "my-works/content/chatbot.mp4",
                    "stack": ["NodeJS", "DiscordJS"],
                    "context": 
                    "スパム防止機能：\n"+
                    "単語数と文字数の比に言語ごとに特徴がある気がしたので、その値などをもとにスパムかスパムじゃないかを判定する機能を作りました。"
                }
            ),
            new Item(
                {
                    "label": ""

                }
            )
        );
    }
}*/

//const works = new Works();
//works.display(document.getElementById("flow-container"));