import { AutoTokenizer, AutoModel } from "@xenova/transformers";
import fs from "fs";

const modelName = "Xenova/all-MiniLM-L6-v2";
const cacheDir = "./models";

// ディレクトリ作成
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// モデルのダウンロード
console.log("Downloading MiniLM model...");
await AutoTokenizer.from_pretrained(modelName, { cache_dir: cacheDir });
await AutoModel.from_pretrained(modelName, { cache_dir: cacheDir });

console.log("Model downloaded to:", cacheDir);