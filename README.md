# Calimesa Portal

Calimesa Fire Department station portal — training, policy, weather, and the house log.

## Tech Stack

- **Framework**: TanStack Start (React 19) + Vite 8
- **Styling**: Tailwind CSS v4
- **Database**: PGLite (embedded WASM Postgres — no external DB needed)
- **Auth**: Better Auth (disabled by default — `VITE_AUTH_ENABLED=false`)

## Development

```bash
npm install
npm run dev
```

The app runs on `http://localhost:8080` (mapped to port 3000 in the Base44 sandbox).

### Build

```bash
npm run build
```

### Scripts

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build + DB migration
- `npm run lint` — run ESLint
- `npm run typecheck` — TypeScript type checking
- `npm test` — run test suite
