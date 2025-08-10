# Frontend (React + Vite)

This app uses Vite environment variables to configure the API base URL.

## Env var

- Create `frontend/.env` with:

	```bash
	VITE_API_BASE_URL=http://localhost:3000
	```

- The React app references it via `import.meta.env.VITE_API_BASE_URL` in `src/api.js`.
- All Axios calls use the centralized client in `src/api.js`.

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview the production build

