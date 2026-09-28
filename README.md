# Backend and Frontend Connectivity Demo

This project demonstrates how a Vite React frontend and a Next.js frontend communicate with a shared Python backend (with support for both **FastAPI** and **Flask**) connected to **Supabase** (PostgreSQL) or local **SQLite**.

---

## 1. Backend Setup

The backend is located in the `backend/` folder. It provides two interchangeable server implementations:
- **FastAPI backend**: `main.py`
- **Flask backend**: `app.py`

Both implement the exact same REST API endpoints, CORS policies, and Supabase / SQLite database schema.

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Database Configuration (Supabase or SQLite)

1. Open `backend/.env`.
2. To connect to **Supabase**:
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard).
   - In your project, click **Connect**.
   - Select **Session pooler** (or Direct connection string).
   - Copy the URI and replace `[YOUR-PASSWORD]` with your Supabase database password.
   - Set it in `backend/.env`:
     ```env
     DATABASE_URL=postgresql://postgres.yourref:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:5432/postgres
     ```
3. If `DATABASE_URL` is omitted or commented out, the backend automatically defaults to a local SQLite database (`demo.db`).

### Running the Backend

You can run either backend on `http://localhost:8000`:

- **Option A: FastAPI**
  ```bash
  python main.py
  # or: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
  # Interactive API Docs: http://localhost:8000/docs
  ```

- **Option B: Flask**
  ```bash
  python app.py
  # or: flask --app app run --port 8000 --debug
  ```

### API Endpoints

| Method | Path | Purpose | Sample Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Service status check | `{"message": "Demo backend is running"}` |
| `GET` | `/health` | Health check endpoint | `{"status": "ok"}` |
| `POST` | `/echo` | Stores payload in DB and returns it | `{"data": { ... }}` |
| `GET` | `/messages` | Returns up to 50 latest saved records | `[{"id": 1, "data": { ... }}]` |
| `DELETE` | `/messages/{id}` | Deletes record by ID | `{"deleted": 1}` |
| `POST` | `/auth/verify` | Token/Google Auth verify helper | `{"authenticated": true, ...}` |

---

## 2. Frontend Setup

### Vite React Frontend
```bash
cd React_Frontend
npm install
npm run dev
# Running on http://localhost:5173
```
See [React_Frontend/FLOW.md](React_Frontend/FLOW.md) for detailed React flow.

### Next.js Frontend
```bash
cd my-app
npm install
npm run dev
# Running on http://localhost:3000
```
See [my-app/FLOW.md](my-app/FLOW.md) for detailed Next.js flow.

---

## 3. CORS Configuration

Both backend implementations automatically permit browser requests from:
- `http://localhost:5173` & `http://127.0.0.1:5173` (Vite)
- `http://localhost:3000` & `http://127.0.0.1:3000` (Next.js)
- Any comma-separated origins specified in the `FRONTEND_ORIGINS` environment variable (for production deployment).
