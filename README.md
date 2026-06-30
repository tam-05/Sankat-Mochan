# Sankat Mochan — AI Study Planner

An AI productivity companion that turns a single goal (e.g. *"Crack DSA in 30 days"*)
into a structured, dated task roadmap, tracks your progress, and regenerates the
plan around what you've actually finished. Powered by Google Gemini.

The whole app ships as **one container**: a FastAPI backend that also serves the
built React frontend, deployed to **Google Cloud Run** (free tier) with a free
**Neon Postgres** database.

---

## Features

- **AI roadmap generation** — describe a goal; Gemini returns 5–20 actionable tasks with priority and due dates.
- **Adaptive regeneration** — rebuilds the roadmap for remaining work, skipping what you've completed.
- **Task management** — create, update, complete, and delete tasks.
- **Progress reminders** — flags when you've stalled and nudges you back on track.
- **Auth** — register / login with JWT sessions and bcrypt-hashed passwords.

## Tech stack

| Layer    | Stack |
|----------|-------|
| Frontend | React 19, TypeScript, Vite, React Router, Axios |
| Backend  | FastAPI, SQLAlchemy, python-jose (JWT), passlib/bcrypt |
| AI       | Google Gemini (`gemini-2.5-flash`) via `google-genai` |
| Database | SQLite (local dev) · Postgres (production) |
| Deploy   | Docker → Google Cloud Run |

## Project structure

```
.
├── backend/
│   ├── main.py            # FastAPI app; mounts routers + serves built frontend
│   ├── routes/            # auth, ai, tasks, reminder
│   ├── database/          # engine, models, schemas
│   ├── utils/             # jwt + password hashing
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/         # Landing, Login, Register, Dashboard, History, Settings, Events
│   │   ├── components/    # Navbar, Sidebar, TaskCard, TaskModal, ...
│   │   ├── services/      # axios API client (api.ts) + per-feature calls
│   │   └── context/       # AuthContext
│   └── package.json
├── Dockerfile             # builds frontend, then serves it from the backend
└── DEPLOY.md              # step-by-step Cloud Run deploy
```

## Local development

**Prerequisites:** Python 3.12+, Node 20+, a [Google Gemini API key](https://aistudio.google.com/apikey).

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows  (source venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
```

Create `backend/.env`:

```
GEMINI_API_KEY=your_gemini_key
JWT_SECRET_KEY=any_long_random_string
# DATABASE_URL is optional locally; omit it to use SQLite.
```

Run it:

```bash
uvicorn main:app --reload --port 8000
```

API docs: http://127.0.0.1:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173 (it reads `VITE_API_URL` from `frontend/.env.development`
to reach the API on port 8000).

## Environment variables

| Variable         | Used by  | Purpose |
|------------------|----------|---------|
| `GEMINI_API_KEY` | backend  | Google Gemini API key |
| `JWT_SECRET_KEY` | backend  | Secret for signing JWT access tokens |
| `DATABASE_URL`   | backend  | Postgres URL in prod; falls back to local SQLite if unset |
| `VITE_API_URL`   | frontend | API base URL — empty in prod (same origin), `http://127.0.0.1:8000` in dev |

## Deployment

The frontend is served by the backend, so production runs as a single Cloud Run
service on one origin (no CORS, one URL). Full walkthrough — Neon Postgres, gcloud
setup, and the deploy command — is in **[DEPLOY.md](./DEPLOY.md)**.

```bash
gcloud run deploy sankat-mochan --source . --region us-central1 --allow-unauthenticated \
  --set-env-vars "^##^GEMINI_API_KEY=...##JWT_SECRET_KEY=...##DATABASE_URL=..."
```

## API overview

| Method | Endpoint                  | Description |
|--------|---------------------------|-------------|
| POST   | `/auth/register`          | Create an account |
| POST   | `/auth/login`             | Get a JWT access token |
| POST   | `/ai/plan`                | Generate a task roadmap from a goal |
| POST   | `/ai/regenerate-roadmap`  | Rebuild the roadmap for remaining work |
| GET    | `/tasks/`                 | List tasks |
| POST   | `/tasks/`                 | Create a task |
| PUT    | `/tasks/{id}`             | Update a task |
| DELETE | `/tasks/{id}`             | Delete a task |
| GET    | `/reminder/status`        | Check if progress has stalled |
