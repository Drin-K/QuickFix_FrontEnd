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

## Modules 
User: 🔹 Core Modules
Module	Përshkrimi
Auth	Login/Register, JWT
Users	Menaxhimi i përdoruesve
Roles	Role-based access
Tenant	Multi-tenancy
🔹 Business Modules
Module	Përshkrimi
Providers	Profilet e profesionistëve
Clients	Profilet e klientëve
Companies	Organizatat / tenant-at
Categories	Kategoritë e shërbimeve
Services	Shërbimet që ofrohen
🔹 Booking System
Module	Përshkrimi
Bookings	Rezervimet
BookingStatus	Statuset (pending, accepted, etc.)
Availability	Orari i provider-it
🔹 Interaction Modules
Module	Përshkrimi
Reviews	Vlerësimet
Messages	Mesazhet
Conversations	Chat threads
Notifications	Njoftimet
🔹 Utility Modules
Module	Përshkrimi
Address	Lokacionet
City	Qytetet
Favorites	Favoritet
Reports	Raportime

Module	Përshkrimi
AI	OpenAI integration
Search	Filtering + search
Cache	Redis caching
Jobs	Background tasks

