# 🎓 UniGuide AI

### AI-Powered College Discovery, Prediction, Counselling & University Assistant Platform

**UniGuide AI** is a full-stack AI-powered education platform designed to help engineering aspirants discover colleges, evaluate admission opportunities, analyze historical cutoffs, prepare counselling preferences, and interact with university information through a document-grounded AI assistant.

The platform combines **college prediction, cutoff analytics, college comparison, counselling decision support, and Retrieval-Augmented Generation (RAG)** into a unified application.

Built with **React, TypeScript, FastAPI, Python, LangChain, ChromaDB, MongoDB Atlas, and Google Gemini**.

---

## 🌐 Live Links

- 🚀 **Live Application (Vercel):** https://frontend-peach-nine-9dyn34fhbi.vercel.app/
- 🚀 **Live Application (Render):** https://rag-document-ihnt.onrender.com/
- ⚙️ **Backend API:** https://rag-document-ihnt.onrender.com/api/v1
- 🎯 **Predictor API:** https://rag-document-ihnt.onrender.com/api/v1/predict
- 📖 **Swagger API Documentation:** https://rag-document-ihnt.onrender.com/docs
- 🎓 **AP EAMCET / AP EAPCET Predictor:** https://collegepipe.in/apeamcet.html
- 🐙 **GitHub Repository:** https://github.com/triveninelakurthi9/UniGuide-AI

---
## 🌟 Platform Overview

UniGuide AI brings multiple admission and information workflows together:

### 🎯 College Prediction

* JEE Main prediction
* JEE Advanced college matching
* AP EAMCET / AP EAPCET prediction
* Rank and score-based prediction
* Category-aware predictions
* Gender-specific seat considerations
* Region/local-area filtering
* Branch preference filtering
* District/location filtering
* College-type filtering
* Fee-based filtering
* Admission probability classification

### 📊 College Discovery & Analytics

* Historical cutoff analysis
* Multi-year cutoff trends
* College profiles
* College comparison
* Branch comparison
* Fees and placement information
* NIRF information
* Hostel availability
* Admission probability analysis

### 📝 Counselling Decision Support

* Personalized college recommendations
* Dream / Reach / Moderate / Likely / Safe classification
* Strategic counselling preference generation
* Branch-priority based ordering
* Risk-balanced choice generation
* Preference-list export

### 🤖 AI University Assistant

* Retrieval-Augmented Generation
* University PDF document Q&A
* Semantic document retrieval
* HyDE query expansion
* Page-level citations
* Confidence scoring
* Gemini-powered responses

### 📚 Document & Admin Management

* PDF upload
* PDF text extraction
* Document chunking
* Vector indexing
* Document statistics
* ChromaDB management
* MongoDB metadata persistence
* Role-based administrative functionality

---

# 🎯 College Prediction Engine

The prediction engine evaluates student information against historical admission data to identify realistic college and branch opportunities.

## Supported Inputs

### JEE Main

* Subject-wise marks
* Percentile
* All India Rank
* Category
* Gender
* Preferred branches
* Institution preferences

### JEE Advanced

* Advanced rank
* Branch preferences
* Institution preferences

### AP EAMCET / AP EAPCET

* EAMCET rank
* Reservation category
* Gender
* Local area / region
* Preferred branch
* Preferred district
* Annual fee preference
* College type

Supported categories include:

`OC`, `OBC-NCL`, `EWS`, `SC`, `ST`, and `PwD`.

Regional preferences include:

`AU`, `SVU`, `OU`, and `Non-Local`.

---

# 📊 Admission Probability Classification

Every predicted college/branch combination is classified into an understandable admission tier.

| Tier            | Meaning                                                           |
| --------------- | ----------------------------------------------------------------- |
| 🟢 **Safe**     | Student rank is significantly better than historical closing rank |
| 🔵 **Likely**   | Strong historical admission probability                           |
| 🟡 **Moderate** | Rank is close to historical cutoff range                          |
| 🟠 **Reach**    | Slightly outside historical range but worth considering           |
| 🔴 **Unlikely** | Significantly outside historical cutoff range                     |

### Ranking logic

```text
Safe       → Rank ≤ 70% of historical closing rank
Likely     → Rank ≤ 90%
Moderate   → Rank ≤ 105%
Reach      → Rank ≤ 125%
Unlikely   → Rank > 125%
```

This transforms raw cutoff data into an easier decision-support system.

---

# 📈 Historical Cutoff Intelligence

The platform analyzes historical counselling data instead of relying only on a single cutoff value.

It can identify trends such as:

```text
2023 → 18,500
2024 → 16,200
2025 → 14,900

Increasing Competition ↑
```

or:

```text
2023 → 14,500
2024 → 17,800
2025 → 20,100

Decreasing Competition ↓
```

This allows students to understand whether a branch is becoming more competitive over time.

---

# 🏫 College Discovery & Comparison

UniGuide AI provides structured information for evaluating colleges and branches.

College profiles can include:

* College code
* College name
* District
* State
* Affiliation
* Autonomous status
* Intake capacity
* Annual fees
* Average placement package
* Highest placement package
* Hostel availability
* NIRF ranking
* Opening rank
* Closing rank

### Comparison

Students can compare colleges and branches across:

* Admission cutoffs
* Fees
* Placements
* College type
* Location
* Branch
* Infrastructure-related information
* Historical admission trends

This helps students evaluate colleges beyond just their cutoff rank.

---

# 📝 Counselling Preference Generator

Choosing the right counselling order can be difficult because students need to balance:

* College preference
* Branch preference
* Admission probability
* Historical cutoffs
* Risk level

UniGuide AI generates a strategic preference order based on these factors.

### Example strategy

```text
Dream
  ↓
Reach
  ↓
Moderate
  ↓
Likely
  ↓
Safe
```

The generated preference list can be:

* Copied to clipboard
* Exported as Markdown
* Used as a counselling planning sheet

---

# 🤖 Retrieval-Augmented Generation (RAG)

The University Assistant uses **Retrieval-Augmented Generation** to answer questions using uploaded university documents.

Instead of relying only on the language model's internal knowledge, the system retrieves relevant document content and uses it as context for the generated response.

## RAG Pipeline

```text
                 User Question
                       │
                       ▼
                Query Processing
                       │
                       ▼
                HyDE Expansion
                       │
                       ▼
              Semantic Retrieval
                       │
                       ▼
               ChromaDB Search
                       │
                       ▼
             Relevant PDF Chunks
                       │
                       ▼
                Google Gemini
                       │
                       ▼
              Grounded Response
                 ┌─────┴─────┐
                 ▼           ▼
             Citations   Confidence
```

## RAG Features

* PDF document ingestion
* PyMuPDF extraction
* LangChain recursive text splitting
* Dense vector embeddings
* ChromaDB vector storage
* `BAAI/bge-small-en-v1.5`
* HyDE query expansion
* Google Gemini integration
* Page-level PDF citations
* Dynamic confidence scoring

The goal is to provide **document-grounded answers with traceable sources**.

---

# 📄 Document Ingestion Pipeline

The Admin Hub provides a complete document ingestion workflow.

```text
PDF Upload
    │
    ▼
Text Extraction
    │
    ▼
Document Chunking
    │
    ▼
Embedding Generation
    │
    ▼
ChromaDB Vector Index
    │
    ▼
MongoDB Metadata
    │
    ▼
Available for RAG Q&A
```

Administrators can upload, ingest, inspect and remove documents and their associated vector representations.

---

# 🔐 Role-Based Admin System

The platform separates student functionality from administrative functionality.

### 👨‍🎓 Student

* Ask university questions
* Predict colleges
* Analyze admission chances
* Explore branches
* Compare colleges
* Generate counselling preferences

### 🛠️ Admin

* Upload university PDFs
* Ingest documents
* View document statistics
* Manage indexed documents
* Remove documents
* Maintain the RAG knowledge base

---

# 🗄️ Data Architecture

## MongoDB Atlas

Used for persistent application metadata including:

* Uploaded documents
* File information
* Ingestion records
* Chunk statistics
* Document metadata

## ChromaDB

Used as the vector store for semantic retrieval in the RAG pipeline.

## Historical Cutoff Data

Used by the prediction engine for:

* Rank matching
* College recommendations
* Branch recommendations
* Admission probability
* Trend analysis
* Counselling preference generation

---

# 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────┐
│                     React Frontend                         │
│                React + TypeScript + Vite                   │
│                                                            │
│ Dashboard │ Predictors │ Comparison │ Choice Filler │ Admin│
└──────────────────────────┬─────────────────────────────────┘
                           │
                           │ REST API
                           ▼
┌────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                         │
│                                                            │
│ Chat │ Prediction │ Documents │ Upload │ Ingestion │ Auth │
└──────────────┬─────────────────────────────┬───────────────┘
               │                             │
               ▼                             ▼
┌─────────────────────────┐       ┌──────────────────────────┐
│   College Prediction    │       │       RAG Pipeline       │
│        Engine           │       │                          │
│                         │       │ HyDE + Retrieval + LLM   │
│ JEE / EAMCET            │       │                          │
│ Rank Matching           │       │ ChromaDB + Embeddings    │
│ Cutoff Analysis         │       │ Page Citations           │
│ Risk Classification    │       │ Confidence Scoring       │
└────────────┬────────────┘       └────────────┬─────────────┘
             │                                 │
             ▼                                 ▼
┌─────────────────────────┐       ┌──────────────────────────┐
│ Historical Cutoff Data │       │       ChromaDB            │
└─────────────────────────┘       └────────────┬─────────────┘
                                               │
                                               ▼
                                    ┌─────────────────────────┐
                                    │     Google Gemini       │
                                    └─────────────────────────┘

                    ┌─────────────────────────┐
                    │      MongoDB Atlas      │
                    │    Metadata Storage     │
                    └─────────────────────────┘
```

---

# 🧩 Technology Stack

| Layer                | Technologies                                    |
| -------------------- | ----------------------------------------------- |
| **Frontend**         | React 18, TypeScript, Vite, Axios, Tailwind CSS |
| **Backend**          | Python, FastAPI, Pydantic                       |
| **AI / LLM**         | Google Gemini API                               |
| **RAG**              | LangChain, HyDE, ChromaDB                       |
| **Embeddings**       | BAAI/bge-small-en-v1.5                          |
| **PDF Processing**   | PyMuPDF                                         |
| **Database**         | MongoDB Atlas                                   |
| **Vector Store**     | ChromaDB                                        |
| **Containerization** | Docker, Docker Compose                          |
| **Deployment**       | Vercel, Render                                  |

---

# 📁 Project Structure

```text
UniGuide-AI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── chat.py
│   │   │       │   ├── documents.py
│   │   │       │   ├── ingest.py
│   │   │       │   ├── predictor.py
│   │   │       │   └── upload.py
│   │       │       └── router.py
│   │   │
│   │   ├── core/
│   │   ├── models/
│   │   ├── rag/
│   │   │   ├── embeddings.py
│   │   │   ├── hyde.py
│   │   │   ├── pipeline.py
│   │   │   └── vector_store.py
│   │   ├── schemas/
│   │   └── services/
│   │
│   ├── chroma_db/
│   ├── uploads/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
│
├── docs/
├── Dockerfile
├── docker-compose.yml
├── render.yaml
├── start_production.sh
├── vercel.json
├── LICENSE
└── README.md
```

---

# 🔌 REST API

| Method   | Endpoint                  | Description                                              |
| -------- | ------------------------- | -------------------------------------------------------- |
| `POST`   | `/api/v1/predict`         | College prediction and counselling preference generation |
| `POST`   | `/api/v1/chat`            | RAG-based document Q&A                                   |
| `GET`    | `/api/v1/documents`       | Retrieve uploaded document information                   |
| `GET`    | `/api/v1/documents/stats` | Document and ingestion statistics                        |
| `POST`   | `/api/v1/upload`          | Upload PDF documents                                     |
| `POST`   | `/api/v1/ingest`          | Extract, embed and index documents                       |
| `DELETE` | `/api/v1/documents/{id}`  | Delete document and associated vectors                   |

---

# 📡 Example API Request

### College Prediction

```json
{
  "input_mode": "marks",
  "maths_marks": 85,
  "physics_marks": 80,
  "chemistry_marks": 78,
  "category": "OPEN",
  "gender": "Gender-Neutral",
  "home_state": "AU",
  "preferred_branch": "Computer Science",
  "institution_type": "All"
}
```

### Prediction Response

The API can return:

* Total score
* Estimated percentile
* Estimated AIR
* Category rank
* Matching colleges
* Admission probability
* Opening/closing ranks
* College information
* Recommendation reasons
* Counselling preference order

---

# ⚙️ Local Setup

## Prerequisites

* Python 3.9+
* Node.js 20+
* Git
* MongoDB Atlas
* Google Gemini API key
* Docker *(optional)*

## Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python main.py
```

Backend:

```text
http://localhost:8000
```

Swagger API documentation:

```text
http://localhost:8000/docs
```

## Frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

---

# 🐳 Docker

Run the application using Docker Compose:

```bash
docker-compose up -d --build
```

---

# 🔑 Environment Configuration

Create `backend/.env`:

```env
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

Frontend:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ **Never commit API keys, passwords, database credentials, JWT secrets or `.env` files to GitHub.**

---

# 🚀 Deployment

The application supports a production deployment architecture consisting of:

### Frontend

**Vercel**

### Backend

**Render**

### Containerized Deployment

**Docker / Docker Compose**

The frontend communicates with the FastAPI backend through REST APIs.

---

# 📌 Project Highlights

### AI Engineering

* Retrieval-Augmented Generation
* Semantic vector search
* Dense embeddings
* HyDE query expansion
* Gemini LLM integration
* Document-grounded responses
* Citation generation
* Confidence scoring

### Software Engineering

* Full-stack React + FastAPI architecture
* REST API design
* TypeScript frontend
* Python backend
* Modular service architecture
* Role-based workflows
* Document processing pipeline
* Persistent database integration

### Data & Decision Systems

* Historical cutoff analysis
* Rank matching
* Admission probability classification
* College comparison
* Multi-year trend detection
* Personalized recommendations
* Counselling preference optimization

### DevOps

* Docker
* Docker Compose
* Vercel deployment
* Render deployment
* Environment-based configuration

---

# 🛣️ Roadmap

* [x] Full-stack React + FastAPI architecture
* [x] RAG university assistant
* [x] PDF ingestion pipeline
* [x] ChromaDB semantic retrieval
* [x] Gemini integration
* [x] Page-level document citations
* [x] Confidence scoring
* [x] JEE Main prediction
* [x] JEE Advanced matching
* [x] AP EAMCET / AP EAPCET prediction
* [x] Historical cutoff analysis
* [x] College comparison
* [x] Counselling preference generation
* [x] Admin document management
* [x] MongoDB Atlas persistence
* [x] Docker support
* [x] Production deployment configuration

---

# ⚠️ Disclaimer

UniGuide AI is an educational and counselling decision-support platform.

Predictions are estimates generated using historical cutoff information and system-defined decision logic. Actual admission outcomes depend on official counselling rules, seat availability, reservation policies, changing cutoffs, and decisions made by the respective authorities.

Students should always verify admission information with official counselling authorities.

---

# 👨‍💻 Author

**Triveni Nelakurthi**

GitHub:
https://github.com/triveninelakurthi9

---

## 📄 License

This project is licensed under the **MIT License**.
