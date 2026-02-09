# 🎙 CTDD-CDSC SpeechID  
### CTDD Features Based Machine Learning Techniques for Discriminating Human and AI-Synthesized Voices

**Final Year Project – Universiti Malaysia Perlis (UniMAP)**  
**Supervised by:**  
**ASSOC. PROF. DR. VIKNESWARAN VIJEAN**

---

## 📌 Project Overview

The rapid growth of AI voice generation technologies has made it difficult to distinguish between **human speech** and **AI-synthesized voices**.  
This project proposes a novel approach using:

- **CTDD – Cognitive Temporal Decision Dynamics features**
- **CDSC – Cognitive Deviation Scoring Classifier**

to accurately classify speech as:

- ✅ HUMAN  
- 🤖 AI-SYNTHESIZED  
- 🔇 SILENCE / UNCERTAIN (for robust real-world use)

The system works in:

- 🎤 Live microphone recording  
- 📁 Audio file upload  
- 🌐 Web interface with real-time prediction

---

## 🧠 Proposed Methodology

### Feature Extraction – CTDD

We extract four core features:

| Feature | Full Form |
|-------|------------|
| MDDV | Micro-Decision Delay Variability |
| CLTI | Cognitive Load Transition Index |
| SRV  | Speech Rate Variability |
| TDR  | Terminal Decision Relaxation |

### Classifier – CDSC

- Mahalanobis distance based cognitive deviation model  
- Separate modeling for HUMAN and AI distributions  
- Confidence-based decision logic  
- Silence rejection module

---

## 📂 Dataset

- **Internal Dataset** – Provided by supervisor  
- **External Dataset** – Collected from Kaggle  

### Data Split

- 80% Training  
- 20% Testing

---

## 📊 Experimental Results

| Model | Training Acc | Testing Acc |
|-----|-------------|-------------|
| CTDD + CDSC (Proposed) | 91.25% | 92.50% |
| CTDD + SVM | 87.50% | 95.00% |
| CTDD + RF | 100% | 95.00% |
| CTDD + MLP | 93.12% | 90.00% |

✔ Proposed CDSC shows stable real-time performance with low complexity.

---

## 🚀 Features of the System

- ✅ Live microphone detection  
- ✅ File upload classification  
- ✅ Confidence visualization  
- ✅ CTDD feature display  
- ✅ History export as CSV  
- ✅ Silence rejection  
- ✅ Web UI (React + Flask)

---

## 🧩 Tech Stack

**Backend**
- Python  
- Flask  
- Librosa  
- Joblib  
- NumPy  

**Frontend**
- React + TypeScript  
- Vite  
- Tailwind CSS  
- ShadCN UI

---

## ▶ How to Run

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python server.py
