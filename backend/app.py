# backend/app.py
import io, json, numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow import keras

MODEL = "best.keras"
CLSMAP = "class_indices.json"

with open(CLSMAP, "r", encoding="utf-8") as f:
    class_indices = json.load(f)
idx2name = {v:k for k,v in class_indices.items()}

# โหลดโมเดล: ถ้าเซฟด้วย Rescaling จะโหลดได้ตรงๆ
USE_RESCALE = True
try:
    model = keras.models.load_model(MODEL)
except Exception:
    # เผื่อกรณีบันทึกด้วย Lambda(preprocess_input)
    from tensorflow.keras.applications.xception import preprocess_input
    model = keras.models.load_model(MODEL, custom_objects={'preprocess_input': preprocess_input}, safe_mode=False)
    USE_RESCALE = False

def preprocess(img: Image.Image, size=(299,299)):
    x = np.array(img.convert("RGB").resize(size)).astype("float32")
    if USE_RESCALE:
        # ให้ตรงกับตอนเทรนของ Model 3 (Rescaling [-1,1])
        x = x/127.5 - 1.0
    return np.expand_dims(x, 0)

app = FastAPI(title="DurianLeaf API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img = Image.open(io.BytesIO(await file.read()))
    x = preprocess(img)
    probs = model.predict(x, verbose=0)[0]          # e.g. [p1, p2, ...]
    pred = int(np.argmax(probs))
    return {
        "label": idx2name[pred],                    # เช่น: LEAF_BLIGHT
        "probs": {idx2name[i]: float(p) for i, p in enumerate(probs)},
        "model_version": "xception-model3"
    }
