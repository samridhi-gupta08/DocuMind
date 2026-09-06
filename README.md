# Demo Frontend and Backend

This workspace contains one shared FastAPI backend and two equivalent React
frontends:

- `backend`: FastAPI API on `http://localhost:8000`
- `React_Frontend`: Vite React app on `http://localhost:5173`
- `my-app`: Next.js app on `http://localhost:3000`

Both frontends call the same backend endpoints and provide backend status and
JSON echo functionality.

## Project structure

```text
Demo/
├── backend/
│   └── main.py
├── React_Frontend/
│   ├── src/
│   └── package.json
├── my-app/
│   ├── app/
│   └── package.json
└── README.md
```

## Prerequisites

Install the following software:

- Python 3.10 or newer
- Node.js 18.18 or newer
- npm

Check installed versions:

```bash
python --version
node --version
npm --version
```

## 1. Set up the backend

Open a terminal at the workspace root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

Linux/macOS:

```bash
source .venv/bin/activate
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install the backend packages:

```bash
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn
```

Start the backend:

```bash
python main.py
```

The API is now available at `http://localhost:8000`.

Keep this terminal running.

## 2. Set up the Vite React frontend

Open a second terminal at the workspace root:

```bash
cd React_Frontend
npm install
npm run dev
```

Open `http://localhost:5173` in a browser.

Useful commands:

```bash
npm run lint
npm run build
npm run preview
```

## 3. Set up the Next.js frontend

Open another terminal at the workspace root:

```bash
cd my-app
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

Useful commands:

```bash
npm run lint
npm run build
npm run start
```

Only one frontend is needed for normal use. Both can run at the same time and
share the same backend if ports `3000` and `5173` are available.

## Backend API

| Method | URL | Description |
| --- | --- | --- |
| `GET` | `http://localhost:8000/` | Returns the backend running message |
| `GET` | `http://localhost:8000/health` | Returns the health status |
| `POST` | `http://localhost:8000/echo` | Returns the submitted JSON under `data` |

Example API checks:

```bash
curl http://localhost:8000/
curl http://localhost:8000/health
curl -X POST http://localhost:8000/echo \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
```

Expected echo response:

```json
{
  "data": {
    "message": "hello"
  }
}
```

## How connectivity works

1. The browser opens either the Vite app or the Next.js app.
2. The frontend sends `GET /` and `GET /health` to port `8000`.
3. The backend returns JSON and the frontend displays the message and health.
4. The user submits a JSON payload from the echo form.
5. The frontend sends `POST /echo` to port `8000`.
6. FastAPI returns the payload inside a `data` property.
7. The frontend displays the formatted response or an error.

The backend CORS configuration allows these frontend origins:

- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

## Detailed flow documentation

Read both files to understand the implementation in more detail:

- [React frontend flow](React_Frontend/FLOW.md): Vite startup, React mounting,
  state, requests, and styling.
- [Next.js flow](my-app/FLOW.md): App Router layout, page composition,
  hydration, client requests, and styling.

## Troubleshooting

### Backend unavailable

Confirm that the backend terminal is running and listening on port `8000`:

```bash
curl http://localhost:8000/health
```

### CORS error

Use the correct frontend URL and confirm its origin is listed in
`backend/main.py`. Restart the backend after changing CORS settings.

### Port already in use

Stop the process using the port, or start the frontend on another port. The
frontend fetch URLs currently target port `8000` for the backend.

### Invalid echo payload

The echo endpoint expects a JSON object. For example:

```json
{
  "message": "Hello from the frontend"
}
```
