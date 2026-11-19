# Profile Website

This repository contains the profile website frontend and API.

## Project layout

- `frontend/` — Vite and React application.
- `backend/` — Express API with MongoDB.
- `docker-compose.yml` — local MongoDB service.
- `render.yaml` — free-tier Render web service configuration.

## Run locally on Windows

1. Start MongoDB with `docker compose up -d mongodb`.
2. Copy `backend/.env.example` to `backend/.env` and set a private `JWT_SECRET` (at least 32 characters). Set `MONGO_URI` if MongoDB is not using the default local setup.
3. Install dependencies with `npm.cmd install --prefix backend` and `npm.cmd install --prefix frontend`.
4. Start the API with `npm.cmd --prefix backend run dev`.
5. In another terminal, start the website with `npm.cmd --prefix frontend run dev`.

The frontend is available at `http://localhost:5173` and proxies `/api` requests to the API at `http://localhost:4000`.

## Free public deployment

GitHub Pages can host only static files; it cannot store profiles in a shared database. The legacy root page saves profiles in the current browser only. To let public profiles open from any browser with a short `?user=username` URL, deploy the full-stack React app and API together on Render and use MongoDB Atlas for the database.

Start the Render setup here: [Deploy this repository to Render](https://render.com/deploy?repo=https://github.com/rinku987384-blip/profile-creation).

1. Create a free MongoDB Atlas account and an M0 free cluster. Create a database user, allow network access from `0.0.0.0/0` for Render's changing outbound addresses, and copy the cluster connection string. Replace its password placeholder and set the database name to `profile-platform`.
2. In Render, choose **New → Blueprint**, connect `rinku987384-blip/profile-creation`, and select the `main` branch. Render reads `render.yaml`.
3. Before creating the service, enter the Atlas connection string for `MONGO_URI`, your email for `ADMIN_EMAIL`, and a unique password of at least 12 characters for `ADMIN_PASSWORD`. Render generates `JWT_SECRET`. Do not put these secrets in GitHub or source files.
4. Create the free web service and wait for its deploy to finish. Open its `onrender.com` address, register a normal user account, and build/submit a profile. Log in with the configured admin email and password at `/login`, then approve that profile in `/admin/profiles/pending`.
5. Share the public profile link: `https://<your-render-service>.onrender.com/?user=<username>`. The profile is loaded from MongoDB, so it works in other browsers too.

Render's free web service may sleep while idle; its first request after inactivity can take about a minute. MongoDB Atlas M0 is also free with usage limits. GitHub Pages does not automatically become the full-stack site; use the Render address for shared profiles.

## Update this repository from VS Code

Open this folder in VS Code. Use the **Source Control** view to review changes, commit them, and **Push** to the `main` branch on GitHub. Never commit `.env` files, database files, or uploaded files.
