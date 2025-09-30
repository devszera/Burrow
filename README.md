# Burrow

A React application for managing delivery requests backed by an Express API and MongoDB Atlas.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure the API server environment:

```bash
cp server/.env.example server/.env
```

Update `server/.env` with your MongoDB Atlas credentials. By default it points to the provided Burrow cluster and uses the `environment=test` database.

3. Run the API server:

```bash
npm run server
```

4. In a separate terminal start the Vite dev server:

```bash
npm run dev
```

The Vite dev server proxies `/api` requests to the Express backend on port `5000`.

## Available Scripts

- `npm run dev` – start the Vite development server.
- `npm run build` – build the React app for production.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint.
- `npm run server` – start the Express API with MongoDB connectivity.

## API Overview

The Express API exposes endpoints under `/api` for authentication, warehouse discovery, and managing delivery requests. On startup the server seeds default warehouses and demo user accounts to mirror the existing front-end demo credentials.
