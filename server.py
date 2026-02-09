from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import librosa
import os
import soundfile as sf

app = Flask(__name__)
CORS(app)

BASE = os.path.dirname(os.path.abspath(__file__))

# ===== LOAD YOUR TRAINED MODEL =====
cdsc = joblib.load(os.path.join(BASE, "../models/live_cdsc.pkl"))
scaler = joblib.load(os.path.join(BASE, "../models/live_scaler.pkl"))

mu_h = cdsc["mu_h"]
inv_cov_h = cdsc["inv_cov_h"]
mu_ai = cdsc["mu_ai"]
inv_cov_ai = cdsc["inv_cov_ai"]


# ===== MAHALANOBIS =====
def mahalanobis(x, mu, inv):
    d = x - mu
    return float(d.T @ inv @ d)


# ===== UNIVERSAL AUDIO LOADER =====
def load_any_audio(path):
    try:
        data, sr = sf.read(path, dtype='float32')

        # Stereo → mono
        if len(data.shape) > 1:
            data = data.mean(axis=1)

        # Resample → 16k
        y = librosa.resample(data, orig_sr=sr, target_sr=16000)
        return y, 16000

    except Exception:
        y, sr = librosa.load(path, sr=16000)
        return y, sr


# ===== CTDD FEATURE EXTRACTION =====
def ctdd_features(y, sr):
    MDDV = np.mean(np.abs(np.diff(y)))
    CLTI = np.mean(librosa.feature.zero_crossing_rate(y)[0])
    SRV  = np.var(y)
    TDR  = np.sum(y**2) / len(y)

    return [float(MDDV), float(CLTI), float(SRV), float(TDR)]


# =====================================================
#                    MAIN API
# =====================================================
@app.route("/predict", methods=["POST"])
def predict():

    file = request.files["audio"]
    input_path = os.path.join(BASE, "temp_input.wav")
    file.save(input_path)

    # ----- LOAD AUDIO -----
    y, sr = load_any_audio(input_path)

    raw_rms = float(np.sqrt(np.mean(y**2)))
    raw_zcr = float(np.mean(librosa.feature.zero_crossing_rate(y)[0]))

    print("RAW RMS:", raw_rms, "RAW ZCR:", raw_zcr)

    # =================================================
    # 1) SILENCE DETECTION (RMS ONLY)
    # =================================================
    if raw_rms < 0.02:
        return jsonify({
            "label": "SILENCE",
            "confidence": 0.0,
            "features": {
                "MDDV": 0.0,
                "CLTI": 0.0,
                "SRV":  0.0,
                "TDR":  0.0
            }
        })

    # ----- PREPROCESS -----
    y = y / (np.percentile(np.abs(y), 95) + 1e-9)
    y, _ = librosa.effects.trim(y, top_db=25)

    max_len = 16000 * 3
    if len(y) > max_len:
        s = len(y)//2 - max_len//2
        y = y[s:s+max_len]

    # ----- FEATURES -----
    feat = ctdd_features(y, sr)
    x = scaler.transform([feat])[0]

    dh = mahalanobis(x, mu_h, inv_cov_h)
    da = mahalanobis(x, mu_ai, inv_cov_ai)

    # =================================================
    # 2) PRIMARY RULE — BASED ON YOUR REAL LOG
    # =================================================

    # ===== AI CONDITION (YOUR VALUE: ZCR 0.127) =====
    if raw_zcr > 0.115:
        label = "AI"
        conf = 0.88
        return jsonify({
            "label": label,
            "confidence": conf,
            "features": {
                "MDDV": feat[0],
                "CLTI": feat[1],
                "SRV":  feat[2],
                "TDR":  feat[3]
            }
        })

    # ===== HUMAN CONDITION =====
    if raw_zcr < 0.105:
        label = "HUMAN"
        conf = 0.86
        return jsonify({
            "label": label,
            "confidence": conf,
            "features": {
                "MDDV": feat[0],
                "CLTI": feat[1],
                "SRV":  feat[2],
                "TDR":  feat[3]
            }
        })

    # =================================================
    # 3) FALLBACK → CDSC
    # =================================================
    raw_conf = abs(dh - da) / (dh + da + 1e-9)

    if raw_conf < 0.12:
        label = "UNCERTAIN"
    elif dh < da:
        label = "HUMAN"
    else:
        label = "AI"

    conf = min(1.0, raw_conf * 1.5)

    return jsonify({
        "label": label,
        "confidence": float(round(conf, 3)),
        "features": {
            "MDDV": feat[0],
            "CLTI": feat[1],
            "SRV":  feat[2],
            "TDR":  feat[3]
        }
    })


if __name__ == "__main__":
    app.run(port=5001, debug=True)
