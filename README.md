# Burrow

A React single-page application that demonstrates delivery rescheduling flows using in-memory mock data and static UI components.

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` – start the Vite development server
- `npm run build` – generate a production build
- `npm run preview` – preview the production build locally
- `npm run lint` – run ESLint against the JavaScript sources

## Keeping Type Safety without TypeScript

The repository intentionally stays on plain JavaScript/JSX to satisfy the assignment
requirements. To retain editor tooling and reduce merge noise without reintroducing
TypeScript files, shared shape definitions live in [`src/types.js`](src/types.js). These
JSDoc typedefs power IntelliSense, PropTypes, and optional `@ts-check` annotations inside
`.jsx` modules, giving you the same guidance TypeScript provided while keeping the runtime
pure JavaScript.
