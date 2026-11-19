# Profile Website

This repository contains the profile website frontend and API.

## Project layout

- `frontend/` — Vite and React application.
- `backend/` — Express API with MongoDB.
- `docker-compose.yml` — local MongoDB service.

## Run locally on Windows

1. Start MongoDB with `docker compose up -d mongodb`.
2. Copy `backend/.env.example` to `backend/.env` and set a private `JWT_SECRET` (at least 32 characters). Set `MONGO_URI` if MongoDB is not using the default local setup.
3. Install dependencies with `npm.cmd install --prefix backend` and `npm.cmd install --prefix frontend`.
4. Start the API with `npm.cmd --prefix backend run dev`.
5. In another terminal, start the website with `npm.cmd --prefix frontend run dev`.

The frontend is available at `http://localhost:5173` and proxies `/api` requests to the API at `http://localhost:4000`.

## Update this repository from VS Code

Open this folder in VS Code. Use the **Source Control** view to review changes, commit them, and **Push** to the `main` branch on GitHub. Never commit `.env` files, database files, or uploaded files.
