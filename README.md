# 🎓 UniGuide AI

**AI-Powered College Prediction, Exam Preparation, Counselling & University Intelligence Platform**

UniGuide AI is a full-stack education platform that unifies exam preparation, college prediction, cutoff research, college comparison, counselling support, and university document Q&A (RAG) into a single experience — so students can **prepare → analyze → predict → compare → decide** without switching between disconnected tools.

---

## 🧩 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Axios, Tailwind CSS |
| **Backend** | Python, FastAPI, Pydantic, PyMuPDF |
| **AI / RAG** | Google Gemini API, LangChain, HyDE query expansion, Vector embeddings, ChromaDB |
| **Embeddings** | BAAI/bge-small-en-v1.5 |
| **Data** | MongoDB Atlas, ChromaDB, historical counselling datasets, exam question datasets |
| **DevOps** | Docker, Docker Compose, Vercel (frontend), Render (backend) |

---

## 🌐 Live Links

- 🎓 Live Application: https://collegepipe.in/apeamcet.html
- 🚀 Frontend (Vercel): https://frontend-peach-nine-9dyn34fhbi.vercel.app/
- 🚀 Backend (Render): https://rag-document-ihnt.onrender.com/
- ⚙️ Backend API: https://rag-document-ihnt.onrender.com/api/v1
- 🎯 Predictor API: https://rag-document-ihnt.onrender.com/api/v1/predict
- 📖 Swagger Docs: https://rag-document-ihnt.onrender.com/docs
- 🐙 GitHub: https://github.com/triveninelakurthi9/UniGuide-AI

---

## 🚀 Platform at a Glance

### 🎯 College Prediction
Rank-based, category-aware, gender-aware college matching across:
- JEE Main / JEE Advanced / CSAB counselling
- AP EAMCET / AP EAPCET (271 colleges, 21 districts)
- NEET UG (MBBS, BDS, BAMS, BHMS — All India & State quota)
- State-level predictors: JAC Delhi, COMEDK UGET, MHT CET, WBJEE, GUJCET/ACPC, UPTAC, TG EAPCET, Bihar UGEAC
- Branch, fee, location, and college-type filtering with **Dream / Reach / Moderate / Likely / Safe** classification

### 🏫 College Discovery & Comparison
- Engineering, medical, and private college explorers
- Side-by-side comparison (fees, placements, NIRF ranking, admission cutoffs, facilities)
- Dedicated IIT vs NIT comparison

### 📈 Admission Intelligence
- Opening/closing rank analysis, multi-year cutoff trends, rank-gap and admission-probability analysis

### 📝 Counselling Intelligence
- Preference-ordering and risk-balanced choice-list generation based on rank, branch, and historical cutoffs

### 🧪 Exam Preparation
- JEE Main & Advanced PYQs, chapter tests, full-syllabus mocks, real CBT interface
- 20,000+ PYQs, 4,000+ non-PYQ questions, 137 real papers, 86 chapters (JEE Main 2019–2026, JEE Advanced 2007–2026)
- Supports MCQ, multiple-select, numerical-answer, comprehension, and matrix-match formats

### 📊 Test Analytics ("My Tests")
- Attempt history, per-question timing, error tagging, chapter-wise mistakes, Mistake Notebook, re-practice workflow

### 🤖 AI University Assistant (RAG)
- PDF ingestion → PyMuPDF extraction → LangChain chunking → dense embeddings → ChromaDB vector search → HyDE query expansion → Gemini-generated answers with page-level citations and confidence scoring

---

## 🔐 Role-Based Access

- **Student:** prediction, discovery, comparison, counselling, exam prep, RAG assistant
- **Admin:** PDF upload, ingestion, vector/document management, knowledge-base maintenance

---

## 🏗️ Architecture

```
Frontend (React + TS + Vite)
        │ REST APIs
        ▼
Backend (FastAPI + Python)
   ├── Prediction Engine → Historical Cutoff Data
   └── RAG Pipeline → HyDE → ChromaDB → Google Gemini
        │
        ▼
MongoDB Atlas (persistent metadata)
```

---

## 📁 Project Structure

```
UniGuide-AI/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/   # chat, documents, ingest, predictor, upload
│   │   ├── core/ models/ rag/ schemas/ services/
│   ├── chroma_db/  uploads/  main.py  requirements.txt
├── frontend/
│   ├── src/ (components, pages, services, types, App.tsx, main.tsx)
│   ├── package.json  vite.config.ts  vercel.json
├── docs/  Dockerfile  docker-compose.yml  render.yaml  vercel.json
```

---

## 🔌 REST API

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/predict` | College prediction & counselling recommendations |
| POST | `/api/v1/chat` | RAG-based document Q&A |
| GET | `/api/v1/documents` | Retrieve uploaded documents |
| GET | `/api/v1/documents/stats` | Document/ingestion statistics |
| POST | `/api/v1/upload` | Upload PDF documents |
| POST | `/api/v1/ingest` | Extract, embed, and index documents |
| DELETE | `/api/v1/documents/{id}` | Delete document & associated vectors |

---

## ⚙️ Local Development

**Requirements:** Python 3.9+, Node.js 20+, Git, MongoDB Atlas, Google Gemini API key, Docker (optional)

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
python main.py
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Swagger docs: `http://localhost:8000/docs`

**Docker**
```bash
docker-compose up -d --build
```

---

## 🔑 Environment Variables

`backend/.env`
```
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

MONGO_URI=your_mongodb_connection_string
DATABASE_NAME=uniguide_db

GEMINI_API_KEY=your_gemini_api_key

CHROMA_PERSIST_DIRECTORY=./chroma_db
EMBEDDING_MODEL_NAME=BAAI/bge-small-en-v1.5

JWT_SECRET=your_secret
ADMIN_SECRET_KEY=your_admin_key
```

`frontend/.env`
```
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ Never commit API keys, passwords, database credentials, JWT secrets, or `.env` files to GitHub.

---

## 🚀 Deployment

- **Vercel** — frontend
- **Render** — backend
- **Docker / Docker Compose** — containerized deployment

---

## 📌 Engineering Highlights

Full-stack architecture · React + TypeScript · FastAPI REST APIs · Retrieval-Augmented Generation · Semantic vector search · HyDE query expansion · LLM integration · PDF ingestion pipelines · Rank-matching & recommendation algorithms · Counselling decision support · Exam testing systems · Performance analytics · Role-based workflows · Docker containerization · Cloud deployment

---

## ⚠️ Disclaimer

UniGuide AI is an educational and decision-support platform. College predictions are estimates based on historical data and system-defined algorithms. Actual admission outcomes depend on official counselling rules, seat availability, reservation policies, changing cutoffs, and decisions made by the respective authorities. Students should verify important admission information with official counselling authorities.

---

## 👨‍💻 Author

**Triveni Nelakurthi**
GitHub: [triveninelakurthi9](https://github.com/triveninelakurthi9)

## 📄 License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.
