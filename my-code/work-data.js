const workData = [
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
];


const flow = new Items(null, ...workData.map(t=>t[1]));
console.log(workData.map(t=>t[1]))
flow.display(document.getElementById("flow-container"), false);

if(confirm(
    '検索機能はサーバーがないと動かすのが難しかったため、別の場所にデプロイしました。'+
    '\nOKで転送します。'
)) {
    window.location.href = "https://akizora.vercel.app/works.html";
};
