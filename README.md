# Booking App

React + Vite frontend with a FastAPI backend for:

- Loading travel credits onto a bus card holder account
- Tracking bus departure and arrival times
- Showing whether tickets are sold out or still available

## Structure

- `frontend/` - Vite + React app with routed landing pages
- `backend/` - FastAPI service with in-memory sample data

## Run locally

1. Start the API:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

2. Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend proxies `/api` requests to the FastAPI server on port `8000`.