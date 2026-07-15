# Booking App Implementation Notes

## 1. What The System Does

The system is a small booking dashboard with two parts:

- A FastAPI backend that serves JSON for credits, schedules, and tickets.
- A React + Vite frontend that reads those endpoints and renders separate pages for each workflow.

The app is organized as a simple client-server setup, with the frontend using `/api` requests and the backend returning in-memory sample data.

## 2. Backend Implementation

### Step 1: Create the FastAPI application

The backend starts in [backend/main.py](backend/main.py) by creating a `FastAPI` app and configuring CORS so the frontend can call it during development.

### Step 2: Define response models

Pydantic models describe the shape of every API response and request:

- `CreditHistoryItem`, `CreditSummary`, and `CreditLoadRequest` for the credits flow.
- `DepartureItem`, `ArrivalItem`, and `ScheduleResponse` for the timetable flow.
- `TicketItem` and `TicketsResponse` for the ticket inventory flow.

These models keep the backend responses predictable and make the frontend data contract explicit.

### Step 3: Seed sample data

The credits system uses in-memory state:

- `credit_balance` stores the current balance.
- `credit_holder` stores the account name.
- `credit_history` stores the load history.

This keeps the backend lightweight and easy to run without a database.

### Step 4: Add the API routes

The backend exposes four routes:

- `GET /api/health` returns a basic status check.
- `GET /api/credits` returns the current balance and history.
- `POST /api/credits/load` updates the in-memory balance and appends a new history entry.
- `GET /api/schedule` returns departure and arrival boards.
- `GET /api/tickets` returns the ticket catalog.

### Step 5: Return formatted values

Money values are stored numerically in the credits data, but the ticket fares are returned as display strings like `R3.50` and `R4.25` so the frontend can show the local currency immediately.

## 3. Frontend Implementation

### Step 1: Bootstrap the React app

The frontend starts in [frontend/src/main.jsx](frontend/src/main.jsx), where React renders the app into the root element and wraps it in `BrowserRouter`.

### Step 2: Create the route shell

[frontend/src/App.jsx](frontend/src/App.jsx) defines the shared shell around the app:

- A top bar with the app title.
- Navigation links to Credits, Schedule, and Tickets.
- A `Routes` setup that maps URL paths to page components.

The root route redirects to `/credits`, so the app always opens on the account screen.

### Step 3: Build a small API client

[frontend/src/api.js](frontend/src/api.js) centralizes all network calls.

It wraps `fetch` in a reusable `request()` helper that:

- Adds JSON headers for POST requests.
- Throws a readable error if the response is not OK.
- Parses the JSON response and returns it to the page components.

This keeps the pages focused on UI logic instead of repeated fetch code.

### Step 4: Implement the credits page

[frontend/src/pages/CreditsPage.jsx](frontend/src/pages/CreditsPage.jsx) manages the loading and submission flow for account credits.

The page does four things:

- Loads the current credit summary on mount.
- Lets the user edit the holder name and amount.
- Posts the new load request back to the API.
- Renders the updated balance and recent history.

The helper `formatRand()` converts numeric values into strings like `R38.00`, which keeps the UI consistent with the rand currency change.

### Step 5: Implement the schedule page

[frontend/src/pages/DeparturesPage.jsx](frontend/src/pages/DeparturesPage.jsx) fetches the schedule and displays it in two cards:

- Upcoming departures.
- Arrival board.

Each row shows the route name, stop or destination, and time, so the page reads like a compact operations board.

### Step 6: Implement the tickets page

[frontend/src/pages/TicketsPage.jsx](frontend/src/pages/TicketsPage.jsx) requests the ticket catalog and renders each item as a card.

Each ticket card shows:

- The route label.
- The sold-out state.
- The ticket name and description.
- The fare and remaining count.

The sold-out badge is styled differently from available tickets so status is visible at a glance.

## 4. Styling Implementation

[frontend/src/styles.css](frontend/src/styles.css) gives the app its visual identity.

The styling is built around a few ideas:

- CSS variables define the palette and typography choices.
- The page uses layered gradients and soft glass-like panels.
- The layout is responsive with grid-based cards that adapt to different screen sizes.
- Status colors distinguish success, error, available, and sold-out states.

The result is a single visual language that works across all three pages.

## 5. Data Flow

The request flow is intentionally simple:

1. The browser loads the React app.
2. A page component calls the matching function in [frontend/src/api.js](frontend/src/api.js).
3. The request is proxied to the FastAPI backend during development.
4. The backend returns JSON from its route handler.
5. The React component stores the response in state and renders it.

For credits, the cycle also includes a write step when the form submits a new load.

## 6. How To Run It

The project runs in two processes:

1. Start the backend from `backend/` with Uvicorn.
2. Start the frontend from `frontend/` with Vite.

The Vite dev server proxies `/api` calls to the backend, so the frontend can talk to the API without manual cross-origin setup in the browser.

## 7. Current Behavior Summary

- Credits are shown in rand.
- The credits form updates the in-memory balance and history.
- The schedule page shows departures and arrivals.
- The tickets page shows only the active tickets, with the currency displayed as rand.
