from transformers import AutoModelForSeq2SeqLM
from optimum.onnxruntime import ORTModelForSeq2SeqLM

# 元モデル
model_name = "Helsinki-NLP/opus-mt-ja-en"

# 保存先
quantized_model_path = "./opus_mt_ja_en_int8"

# モデルロード
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# 量子化して保存（dynamic = とりあえず適当）
ORTModelForSeq2SeqLM.from_pretrained(model).quantize(
    save_directory=quantized_model_path,
    method="dynamic"
)

print("量子化完了！モデルはここに保存されました:", quantized_model_path)