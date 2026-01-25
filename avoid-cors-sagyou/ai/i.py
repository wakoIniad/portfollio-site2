from transformers import AutoTokenizer, AutoModel
import torch
import os
import json
import numpy as np

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
OUT_DIR = "miniLM_browser_model"

os.makedirs(OUT_DIR, exist_ok=True)

print("Downloading model...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)

print("Saving tokenizer...")
tokenizer.save_pretrained(OUT_DIR)

print("Saving model...")
model.save_pretrained(OUT_DIR)

print("Loading PyTorch weights...")
pt_path = os.path.join(OUT_DIR, "pytorch_model.bin")
state_dict = torch.load(pt_path, map_location="cpu")

print("Writing binary weights...")
bin_path = os.path.join(OUT_DIR, "group1-shard1of1.bin")
offsets = {}

with open(bin_path, "wb") as f:
    offset = 0
    for name, tensor in state_dict.items():
        arr = tensor.detach().cpu().numpy().astype(np.float32)
        data = arr.tobytes()
        f.write(data)
        offsets[name] = {
            "shape": list(arr.shape),
            "dtype": "float32",
            "offset": offset,
            "length": len(data)
        }
        offset += len(data)

print("Writing model.json...")
model_json = {
    "format": "onnx-like",
    "weights": ["group1-shard1of1.bin"],
    "tensors": offsets
}

with open(os.path.join(OUT_DIR, "model.json"), "w") as f:
    json.dump(model_json, f)

print("DONE. Output in:", OUT_DIR)
