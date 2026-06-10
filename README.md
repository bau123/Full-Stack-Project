# Full stack project

A small Django + React task manager designed as a sandbox for developer practice.

The base app works end-to-end (categories sidebar, task CRUD, priority + due dates, filtering by category). It also has intentional rough edges and missing features — see `TASKS.md` for a structured list of practice exercises that will exercise real skills: REST API design, data modeling, performance, refactoring, testing, and frontend state management.

## Stack

- **Backend:** Django 6 + Django REST Framework, SQLite
- **Frontend:** React 18 + Vite
- No auth (single-user)

## Layout

```
full-stack-project/
├── backend/         # Django project
│   ├── config/      # settings, urls
│   ├── tasks/       # the only app: models, serializers, views
│   └── manage.py
├── frontend/        # Vite + React app
│   └── src/
└── TASKS.md         # <-- the practice exercises
```

## Running

You need two terminals.

### 1. Backend

```bash
cd backend
python3 manage.py migrate
python3 manage.py seed          # optional: load sample data
python3 manage.py runserver 8000
```

The API is at <http://127.0.0.1:8000/api/>. Browse `/api/tasks/` to see DRF's web UI.

### 2. Frontend

```bash
export PATH="$HOME/.local/node-v20.18.1-linux-x64/bin:$PATH"   # only if Node isn't on PATH yet
cd frontend
npm install                     # only the first time
npm run dev
```

Open <http://127.0.0.1:5173>. Vite proxies `/api` calls to the Django server, so you don't need to worry about CORS while developing.

## API summary

| Method | Endpoint                       | Notes                        |
|--------|--------------------------------|------------------------------|
| GET    | `/api/tasks/`                  | `?category=<id>` filter      |
| POST   | `/api/tasks/`                  | create                       |
| GET    | `/api/tasks/{id}/`             |                              |
| PATCH  | `/api/tasks/{id}/`             | partial update               |
| DELETE | `/api/tasks/{id}/`             |                              |
| POST   | `/api/tasks/{id}/toggle/`      | flip `completed`             |
| GET    | `/api/categories/`             |                              |
| POST   | `/api/categories/`             |                              |

## Where to start

Open `TASKS.md`. Pick a task that interests you — they are independent and roughly grouped from easiest to hardest. Each one has acceptance criteria so you can tell when you're done.
# Full-Stack-Project
