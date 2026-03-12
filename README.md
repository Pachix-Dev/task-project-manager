# Task Project Manager

Aplicacion full stack para gestionar proyectos y tareas con metricas de avance.

## Stack

- Backend: Node.js + Express + TypeScript + Prisma + MariaDB + Zod + Pino + Vitest
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS + Zustand
- Infra: Docker Compose + GitHub Actions

## Justificacion de MariaDB

- Es ideal porque es relacional para `projects` y `tasks`.
- Consultas agregadas simples para progreso y promedios.
- Soporte estable y sencillo para entorno local con Docker.
- Es ideal para aplicaciones estructuradas que requieren alta escritura de datos

## Estructura

- [backend](backend)
- [frontend](frontend)
- [openapi.json](openapi.json)
- [docker-compose.yml](docker-compose.yml)

## Variables de entorno

Backend ([backend/.env.example](backend/.env.example))

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://user:password@localhost:3306/projects_db
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000
```

Nota: los scripts del backend cargan variables con `node --env-file=.env` (Node.js 20+).

Frontend ([frontend/.env.example](frontend/.env.example))

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

## Instalacion de dependencias

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Base de datos y Prisma

Desde [backend](backend):

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Correr local sin Docker

Terminal 1 (backend):

```bash
cd backend
npm run dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

## Endpoints principales

Contrato tecnico: [openapi.json](openapi.json)

## Tests

Backend:

```bash
cd backend
npm test
```
