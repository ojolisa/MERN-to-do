# To-Do Manager

A simple full‑stack to‑do app with:

- Email/password sign up and sign in (no JWT; userId stored in localStorage)
- Task CRUD: title, description, priority, due date, completed toggle
- AI task summary powered by Google Generative AI

Technologies: Node.js + Express 5, MongoDB + Mongoose 8, React 19 + Vite, Axios, bcrypt.

## Project structure

```text
backend/           # Express API + MongoDB models
frontend/          # React app (Vite)
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB (Atlas or local)
- Google AI API key (Google AI Studio) for the AI summary feature

## Quick start

1. Backend setup

- Copy `backend/.env.example` to `backend/.env` and fill values
  - MONGO_URI=mongodb connection string
  - GOOGLE_API_KEY=your Google AI key
  - PORT=3000 (optional)
- Install and run

  ```powershell
  cd .\backend
  npm install
  npm run dev
  ```

1. Frontend setup

- Install and run

  ```powershell
  cd .\frontend
  npm install
  npm run dev
  ```

1. App usage

- Open the frontend URL printed by Vite (typically <http://localhost:5173>)
- Sign up or sign in
- Create, view, update, delete tasks
- Generate AI summary on the tasks page (requires GOOGLE_API_KEY)

## Environment variables (backend/.env)

- MONGO_URI: Mongo connection string (e.g., mongodb://localhost:27017/todo)
- GOOGLE_API_KEY: Google AI Studio API key used by `@google/genai`
- PORT: API port (default 3000)

## API overview

Base URL: <http://localhost:3000>

### Users

- POST /users — create user { name, email, password }
- PUT /users/:id — update user { name, email, password }
- DELETE /users/:id — delete user
- POST /authenticate — login { email, password } → { userId }

### Tasks

- GET /:userId/tasks — list tasks for a user
- GET /tasks/:id — get a task by id
- POST /tasks — create task { title, description?, priority?, dueDate?, userId }
- PUT /tasks/:id — update task { title, description?, completed?, priority?, dueDate? }
- DELETE /tasks/:id — delete task

### AI

- GET /:userId/ai/summary — AI-written summary of user’s tasks

All JSON responses omit Mongo’s `_id` and return `id` instead.

## Data models

### Task

- id: string
- title: string (required, <=200)
- description: string (<=2000)
- completed: boolean (default false)
- dueDate: ISO date
- priority: "low" | "medium" | "high" (default medium)
- userId: string (required)

### User

- id: string
- name: string (required)
- email: string (required, unique)
- password: string (hashed with bcrypt; omitted from JSON output)

## Frontend routes

- / — Sign in / Sign up
- /tasks/:userId — Task list, search, toggle completed, delete, AI summary
- /create-task — Create a task (reads userId from query/localStorage)
- /update-task/:id — Edit a task

## Postman collection

A Postman collection is available at `backend/postman-collection.json`. Import it to try endpoints quickly.

## Notes and caveats

- This demo doesn’t issue JWTs; it stores `userId` in localStorage after auth. Don’t use as‑is for production.
- Ensure CORS is allowed for the frontend origin (the API uses `cors()` with defaults).
- AI summary requires a valid `GOOGLE_API_KEY`. Requests may incur costs depending on your Google account.

## Troubleshooting

- Mongo connection fails: verify `MONGO_URI` and that MongoDB is reachable.
- Login returns 401: check credentials or create a user via the Sign Up page or POST /users.
- AI summary errors: confirm `GOOGLE_API_KEY` is set and network egress is allowed.
- CORS errors: ensure you’re using the default localhost ports or configure CORS as needed.

---

This README covers the monorepo. See `frontend/README.md` for additional frontend details if needed.
