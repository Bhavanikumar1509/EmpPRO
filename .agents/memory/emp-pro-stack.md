---
name: EMP Pro Stack Decisions
description: Key technical decisions for the EMP Pro employee management system
---

# EMP Pro — Durable Technical Decisions

## Database: SQLite (not MySQL)
MySQL Unix socket connections return errno 111 (connection refused) in the Replit sandbox even though the process starts — the sandbox intercepts domain socket connections. TCP on 127.0.0.1:3306 also refused. SQLite works perfectly with `check_same_thread=False` and WAL mode.

**DB path:** `/home/runner/workspace/.emp_pro.db`

**Why:** MySQL socket and TCP are both blocked by Replit sandbox networking policy.

**How to apply:** Any future DB changes must use SQLite. SQLAlchemy models use plain `String` columns instead of `Enum` (SQLite does not enforce enum types). All comparisons must use plain string values, not `.value` on enum instances.

## Password Hashing: SHA-256 (not bcrypt)
passlib/bcrypt raises `ValueError: password cannot be longer than 72 bytes` during the bcrypt wrap-bug detection routine. The `_hash_password()` function in `app/core/security.py` uses `hashlib.sha256` with a static salt.

**Why:** bcrypt detection loop fails in this Python/passlib version combination.

**How to apply:** Do not add bcrypt or passlib back without testing first.

## Port Configuration
- FastAPI backend: port **8000**, served at path `/api`, artifact `3B4_FFSkEVBkAeYMFRJ2e`
- Frontend (emp-pro): port **3000**, path `/`, artifact `artifacts/emp-pro`
- Supported workflow ports: 3000, 3001, 3002, 3003, 4200, 5000, 5173, 6000, 6800, 8000, 8008, 8080, 8099, 9000
- Port 20851 (originally assigned) is NOT in the supported list — workflow monitor times out.

## Model Enum Pattern
SQLAlchemy models store status/role/type fields as `String` columns (not SA Enum). When reading back from DB, the value is already a plain string. Never call `.value` on these fields — check with `isinstance(x, str)` if unsure.

## Seed Data
Run `python3 seed.py` from `artifacts/fastapi-backend/` to populate: 10 employees, 5 projects, 8 tasks, 2 weeks attendance, timesheets, performance reviews, notifications.

**Login credentials:**
- Admin: `alice@emppro.com` / `password123`
- Admin: `david@emppro.com` / `password123`
- Employee: `bob@emppro.com` / `password123`

## Generated API Client
The Orval-generated hooks in `lib/api-client-react/src/generated/api.ts` already hardcode `/api/` prefixes in all URLs — no `setBaseUrl()` needed. The custom-fetch also checks `localStorage.getItem('emp_pro_token')` for the bearer token automatically.
