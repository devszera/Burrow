# Burrow

This repository contains the Burrow delivery reschedule web experience. It now includes an Express based backend that connects to MongoDB Atlas for persisting authentication, warehouse, and delivery request data.

## Technology Stack Overview

The project combines a TypeScript-friendly React frontend with a lightweight Express API. Each tool keeps to a single job so the overall system stays easy to reason about even if you only have Python experience.

- **Vite + React + TypeScript** – Vite provides fast development builds, while React renders the user interface and TypeScript keeps component props and helper functions well typed. Scripts such as `npm run dev` and `npm run build` are powered by Vite’s tooling. 【F:package.json†L7-L27】【F:tsconfig.json†L1-L29】
- **React Router & Context APIs** – Routing between pages (dashboards, forms, trackers) is handled client side, and shared state such as authentication lives in React Context providers. This mirrors how Flask blueprints and global objects work, but in the browser. 【F:src/App.jsx†L1-L48】【F:src/context/AuthContext.jsx†L1-L152】
- **Tailwind CSS + PostCSS** – Tailwind supplies utility classes for styling the interface, with PostCSS and Autoprefixer bundling the CSS so it works across browsers. This keeps the styling declarative and component-scoped. 【F:package.json†L28-L38】【F:tailwind.config.js†L1-L25】
- **Leaflet map utilities** – Leaflet and React Leaflet render the warehouse map and marker interactions on the home page, giving a visual warehouse picker without custom map math. 【F:package.json†L17-L23】【F:src/components/WarehouseMap.jsx†L1-L173】
- **Express.js server** – The backend exposes `/auth`, `/requests`, and `/warehouses` routes, applies CORS, and parses JSON payloads. It is comparable to a minimal Flask app in structure. 【F:server/index.js†L1-L55】
- **MongoDB Atlas + MongoDB driver** – Persistent data lives in a MongoDB Atlas cluster accessed via the official driver. During local development an in-memory MongoDB server spins up automatically if a real connection string is missing, so you can experiment without installing MongoDB yourself. 【F:server/lib/mongoClient.js†L1-L126】
- **Authentication helpers** – `bcryptjs` hashes passwords before storage, and the auth routes seed demo operator accounts for quick logins. This plays a role similar to Werkzeug security in Flask. 【F:package.json†L13-L21】【F:server/routes/auth.js†L1-L196】
- **Environment management** – `dotenv` loads `.env` files so secrets like Atlas credentials stay out of source control, and the API script `npm run server` bootstraps everything using those values. 【F:package.json†L13-L21】【F:server/index.js†L1-L55】
- **Testing & linting tooling** – ESLint, React-specific lint rules, and TypeScript configuration files help keep code quality consistent without a separate test harness. 【F:package.json†L28-L38】【F:eslint.config.js†L1-L49】

## Project Structure

```
.
├── server/              # Express + MongoDB backend
│   ├── index.js         # API entry point
│   ├── lib/             # Database helpers
│   ├── routes/          # Express routers
│   └── utils/           # Shared utilities
├── src/                 # React frontend
└── .env.sample          # Example environment variables for the API
```

## Backend API

### Prerequisites

- Node.js 18+
- Access to a MongoDB Atlas cluster

### Environment configuration

1. Copy `.env.sample` to `.env` in the project root.
2. The sample file already includes the shared Atlas cluster connection string: `mongodb+srv://dev:dev123@cluster0.rhivlko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` with the `dev` database. Update these values only if you are using a different cluster or database name.
3. Optionally update `CORS_ORIGIN` with the allowed frontend origins (comma separated) and `PORT` if you want the server to listen on a custom port.
If the environment variables are not set, the backend automatically falls back to the shared connection string and database name above so local development works out of the box.
2. Update the MongoDB credentials. For the shared development cluster use:
   - **Connection string**: `mongodb+srv://dev:dev123@cluster0.rhivlko.mongodb.net/`
   - **Database name**: `dev`
3. Optionally update `CORS_ORIGIN` with the allowed frontend origins (comma separated) and `PORT` if you want the server to listen on a custom port.


### Installing dependencies

```bash
npm install
```

### Running the backend locally

```bash
npm run server
```

The server will start on `http://localhost:4000` by default and exposes a `/health` endpoint you can use for readiness checks.

### Database Collections

The backend uses the following collections inside the configured MongoDB database:

- **users** – Stores users with `name`, `email`, `passwordHash`, `role`, and audit fields.
- **deliveryRequests** – Stores delivery reschedule requests, destination addresses, payment details, and status history.
- **warehouses** – Stores warehouse metadata such as address, capacity, and operating hours.
- **timeSlots** – Optional collection for configurable delivery time slots. When empty the API falls back to sensible defaults.

### Available endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| `POST` | `/auth/register` | Create a user with DB-backed authentication (bcrypt hashed). |
| `POST` | `/auth/login` | Validates credentials via database lookup and returns the sanitised user. |
| `POST` | `/auth/logout` | Stateless logout helper for the frontend. |
| `GET` | `/auth/:id` | Fetch a specific user (no password fields). |
| `GET` | `/warehouses` | List active warehouses. |
| `POST` | `/warehouses` | Create a warehouse record. |
| `PATCH` | `/warehouses/:id` | Update warehouse metadata. |
| `GET` | `/warehouses/time-slots` | Retrieve available time slots (database driven with default fallback). |
| `GET` | `/warehouses/time-slots/defaults` | Retrieve the built-in default time slots. |
| `GET` | `/requests` | List delivery requests. Supports `userId` and `status` query parameters. |
| `GET` | `/requests/:id` | Fetch a specific delivery request. |
| `POST` | `/requests` | Create a new delivery reschedule request with initial status history. |
| `PUT` | `/requests/:id/reschedule` | Update the scheduled date/time and mark the request as reschedule requested. |
| `PATCH` | `/requests/:id/status` | Transition a request status and append to the history. |
| `PATCH` | `/requests/:id/payment` | Update payment status and charge breakdown. |

All endpoints respond with JSON and use database-backed authentication (no JWTs). Authentication is handled by validating credentials directly against MongoDB on each login request.

### Seeding data

You can seed initial data using the Atlas UI or MongoDB Shell. Below is an example command to insert an operator user and one warehouse:

```javascript
use dev;

db.users.insertOne({
  name: 'Operator One',
  email: 'operator@example.com',
  passwordHash: '$2a$10$Q9Vn8h1oIYcM2h4mSMNoROiSfmC8S4IUsabfpxiC3i0xQO4kibUti', // password: Passw0rd!
  role: 'operator',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

db.warehouses.insertMany([
  {
    name: 'Burrow Delhi Hub',
    address: 'Sector 18, Noida, Uttar Pradesh 201301',
    capacity: 1000,
    operatingHours: '9:00 AM - 7:00 PM',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
```

## Frontend

The frontend continues to use Vite + React + Tailwind. Refer to the existing scripts for development (`npm run dev`) and building (`npm run build`).

## License

MIT
