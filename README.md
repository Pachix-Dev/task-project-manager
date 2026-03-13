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
API_BASE_URL_SERVER=http://localhost:3001/api -> para docker
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api  -> para tu localhost sin docker
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

## SSR y CSR en Next.js

- SSR/Server Components: layout global y pagina raiz, pagina de detalle, ProjectList,TaskList, porque hacen fetch de datos y esto es mejor hacerlo del lado del servidor ya que tiene una mejor carga incial rapida asi reducimos la carga de llamadas innecesarias del lado del cliente

- CSR/Client Components: formularios para crear tareas y proyectos, boton para completar tareas, porque deben tener interección fluida con el cliente.

## Projects list screen

![Projects list](docs/screenshots/projects-list.png)

## Docker

Levantar todos los servicios:

```bash
docker compose up --build
```

Servicios:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Health: `http://localhost:3001/health`
- MariaDb: `http://localhost:3306/`
- phpMyadmin: `http://localhost:8080/`

## CI/CD de referencia

Pipeline en [ci.yml](.github/workflows/ci.yml):

- Instala dependencias
- Ejecuta tests backend
- Compila backend y frontend
- Incluye job `deploy` placeholder para rama `master`

## Estrategia de despliegue y rollback

- Ambientes: development, staging y production.
- Despliegue recomendado con imagenes versionadas por tag.
- Rollback mediante redeploy de la imagen previa estable.
- Ejecutar migraciones de Prisma en staging antes de production.

## Decisiones tecnicas relevantes

- Arquitectura backend por capas: Controller -> Service -> Repository.
- Validacion de entrada con Zod en capa HTTP.
- Manejo de errores uniforme con codigo, mensaje y detalles.
- Logging estructurado con requestId para trazabilidad.
