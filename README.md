# QuickFix

Frontend setup for the QuickFix marketplace using React + TypeScript + Vite.

## Local setup

Requirements:

- Node.js 20+ (see `.nvmrc`)

Install + run:

```bash
npm install
cp .env.example .env
npm run dev
```

## Backend connection

Create a local `.env` file and point the frontend to your backend API:

```bash
VITE_API_URL=http://localhost:5000/api
```

The shared API helper lives in `src/api/api.ts`.
Authentication helpers live in `src/services/authService.ts`.

Example usage:

```ts
import { authService } from "@/services/authService";

const response = await authService.login({
  email: "user@example.com",
  password: "123456",
});
```

## Project structure

```text
src/
  api/
  components/
  pages/
  layouts/
  contexts/
  hooks/
  services/
  utils/
  types/
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run lint
npm run format
```
