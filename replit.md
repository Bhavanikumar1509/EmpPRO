# EMP Pro

A comprehensive Employee Management System for managing employees, departments, projects, tasks, attendance, timesheets, performance reviews, notifications, and analytics.

## Run & Operate

- `Start application` workflow — React/Vite frontend on port 5000 (proxies `/api/*` to FastAPI)
- `FastAPI Backend` workflow — Python FastAPI backend on port 8000
- `cd artifacts/fastapi-backend && python3 seed.py` — seed the database with demo data
- Required env: none (uses SQLite stored at `/home/runner/workspace/.emp_pro.db`)

## Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Radix UI, TanStack Query, Wouter routing
- **Backend**: Python 3.12, FastAPI, SQLAlchemy, SQLite (via pydantic-settings)
- **Auth**: Custom JWT (token stored in localStorage, verified by FastAPI)
- **Monorepo**: pnpm workspaces — `artifacts/emp-pro` (frontend), `artifacts/fastapi-backend` (backend)
- **API codegen**: Orval (from `lib/api-spec/openapi.yaml`)

## Where things live

- `artifacts/emp-pro/src/` — React frontend source
- `artifacts/fastapi-backend/app/` — FastAPI backend (routers, models, schemas, core)
- `artifacts/fastapi-backend/app/core/config.py` — App config (DB path, secret key)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/src/` — Generated React hooks (do not edit manually)
- `.emp_pro.db` — SQLite database (created automatically on first run)

## Architecture decisions

- Frontend proxies `/api/*` to FastAPI backend via Vite dev server proxy (port 5000 → 8000)
- JWT tokens stored in localStorage; `customFetch` in `lib/api-client-react` auto-attaches them
- SQLite with WAL mode for concurrent reads; `check_same_thread=False` for FastAPI threading
- API client generated from OpenAPI spec via Orval — regenerate with `pnpm --filter @workspace/api-spec run codegen`

## Product

- **Dashboard** — overview stats and charts
- **Employees** — full CRUD, profiles, department assignment
- **Departments** — manage org structure
- **Projects & Tasks** — project tracking with task assignment
- **Timesheets** — time entry and reporting
- **Attendance** — clock in/out tracking
- **Performance** — review cycles
- **Notifications** — in-app alerts
- **Analytics** — charts and reporting

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `cd artifacts/fastapi-backend && python3 seed.py` to populate demo data on a fresh DB
- `email-validator` must be installed (`pip install email-validator`) — pydantic schemas use `EmailStr`
- API client hooks live in `lib/api-client-react` — do not edit generated files; run codegen instead
- Vite config requires `PORT` and `BASE_PATH` env vars (set in the workflow command)
