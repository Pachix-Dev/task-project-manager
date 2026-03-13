# AI_SPEC.md

## 1. Propósito del proyecto
Construir una solución **full stack** con:

- **Backend** en **Node.js + Express**
- **Frontend** en **Next.js**
- **Base de datos** relacional (**MariaDB**)
- **Docker** para ejecución local y despliegue
- **Tests básicos**
- **Pipeline CI/CD** de referencia

La aplicación debe permitir gestionar **proyectos** y **tareas**, mostrar progreso, registrar tareas, completarlas y calcular métricas agregadas.

---

## 2. Objetivo
Este documento define cómo debe construir el proyecto incluyendo:

- Arquitectura objetivo
- Estructura de carpetas
- Convenciones de código
- Decisiones técnicas
- Contratos funcionales
- Reglas de implementación
- Criterios de calidad

---

## 3. Stack técnico definido

### Backend
- **Node.js**
- **Express**
- **TypeScript** recomendado
- **Arquitectura por capas**: `Controller -> Service -> Repository`
- **MariaDB** con ORM
- **Prisma**
- Validación: **Zod**
- Logging estructurado: **Pino**
- Testing unitario: **Vitest**

### Frontend
- **Next.js** (App Router)
- **React**
- **TypeScript**
- Manejo de estado: **Zustand** 
- Fetching: `fetch` nativo
- Estilos: **Tailwind CSS**

### DevOps
- **Docker** y `docker-compose`
- **GitHub Actions** para CI/CD de ejemplo

---

## 4. Decisiones técnicas sugeridas

### Base de datos elegida: MariaDB
- Es relacional y encaja naturalmente con la relación `proyecto -> tareas`.
- Permite consultas agregadas sencillas para métricas.
- Es estable, ampliamente soportada y fácil de correr con Docker.
- Es ideal para aplicaciones estructuradas que requieren alta escritura de datos

### Backend con TypeScript
Se recomienda **TypeScript** porque mejora:

- mantenibilidad,
- tipado entre capas,
- claridad de contratos,
- reducción de errores en tiempo de desarrollo.

### Next.js con CSR para interacción principal
Para este proyecto, se usare una estrategia híbrida:

- **SSR/Server Components** para layout y estructura general.
- **CSR** en vistas interactivas de proyectos y tareas.

---

## 5. Alcance funcional

### Backend debe permitir
1. Crear proyectos.
2. Registrar tareas asociadas a un proyecto.
3. Marcar tareas como completadas.
4. Obtener métricas agregadas por proyecto:
   - porcentaje de avance,
   - tiempo promedio de finalización de tareas.

### Frontend debe permitir
1. Listar proyectos.
2. Ver tareas de un proyecto.
3. Crear nuevas tareas.
4. Mostrar una barra visual de progreso.
5. Manejar estados de loading y error.

---

## 6. Reglas de negocio

### Proyecto
Un proyecto debe tener al menos:
- `id`
- `name`
- `description` opcional
- `createdAt`
- `updatedAt`

### Tarea
Una tarea debe tener al menos:
- `id`
- `projectId`
- `title`
- `description` opcional
- `status`: `pending | completed`
- `createdAt`
- `completedAt` nullable
- `updatedAt`

### Reglas
- No se puede crear una tarea para un proyecto inexistente.
- No se debe marcar como completada una tarea ya completada sin manejar el caso explícitamente.
- El porcentaje de avance = `(tareas completadas / total tareas) * 100`.
- Si un proyecto no tiene tareas, el progreso debe ser **0%**.
- El tiempo promedio de finalización debe calcularse sólo con tareas completadas.
- Si no existen tareas completadas, el promedio debe regresar `null` o `0`, pero debe definirse claramente y mantenerse consistente. Recomendación: `null`.

---

## 7. Modelo de datos sugerido

### Tabla `projects`
- `id` bigint / uuid
- `name` varchar(150) not null
- `description` text null
- `created_at` datetime not null
- `updated_at` datetime not null

### Tabla `tasks`
- `id` bigint / uuid
- `project_id` fk -> projects.id
- `title` varchar(150) not null
- `description` text null
- `status` enum('pending', 'completed') not null default 'pending'
- `created_at` datetime not null
- `completed_at` datetime null
- `updated_at` datetime not null

### Índices sugeridos
- índice por `tasks.project_id`
- índice por `tasks.status`
- índice compuesto `tasks.project_id + tasks.status`

---

## 8. API sugerida

Base path sugerido: `/api`

### Proyectos
#### `POST /api/projects`
Crear un proyecto.

**Body**
```json
{
  "name": "Proyecto Alpha",
  "description": "Proyecto de prueba"
}
```

**Response 201**
```json
{
  "data": {
    "id": "1",
    "name": "Proyecto Alpha",
    "description": "Proyecto de prueba",
    "createdAt": "2026-03-12T10:00:00.000Z",
    "updatedAt": "2026-03-12T10:00:00.000Z"
  }
}
```

#### `GET /api/projects`
Listar proyectos.

**Response 200**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Proyecto Alpha",
      "description": "Proyecto de prueba",
      "createdAt": "2026-03-12T10:00:00.000Z",
      "updatedAt": "2026-03-12T10:00:00.000Z"
    }
  ]
}
```

#### `GET /api/projects/:projectId`
Obtener detalle de proyecto.

#### `GET /api/projects/:projectId/metrics`
Obtener métricas agregadas del proyecto.

**Response 200**
```json
{
  "data": {
    "projectId": "1",
    "totalTasks": 10,
    "completedTasks": 4,
    "progressPercentage": 40,
    "averageCompletionTimeInHours": 12.5
  }
}
```

### Tareas
#### `POST /api/projects/:projectId/tasks`
Crear tarea para un proyecto.

**Body**
```json
{
  "title": "Definir arquitectura",
  "description": "Separar controller, service y repository"
}
```

#### `GET /api/projects/:projectId/tasks`
Listar tareas de un proyecto.

#### `PATCH /api/tasks/:taskId/complete`
Marcar tarea como completada.

**Response 200**
```json
{
  "data": {
    "id": "10",
    "status": "completed",
    "completedAt": "2026-03-12T12:00:00.000Z"
  }
}
```

---

## 9. Contrato de errores
Todos los errores deben tener una respuesta consistente.

### Formato sugerido
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": {
      "field": "name"
    }
  }
}
```

### Errores mínimos a manejar
- `400 Bad Request` para validaciones
- `404 Not Found` para proyecto o tarea inexistente
- `409 Conflict` para estados inválidos, por ejemplo completar una tarea ya completada
- `500 Internal Server Error` para errores inesperados

---

## 10. Logging estructurado
Usar logging estructurado en JSON.

Campos mínimos sugeridos:
- `level`
- `timestamp`
- `message`
- `service`
- `route`
- `method`
- `requestId`
- `context`

Registrar:
- inicio de servidor,
- requests entrantes,
- errores controlados,
- errores no controlados,
- eventos importantes del dominio.

No registrar secretos ni datos sensibles.

---

## 11. Validación de entrada
Validar en capa de entrada antes de llegar al service.

### Ejemplos mínimos
- `project.name` requerido, string, max 150
- `task.title` requerido, string, max 150
- IDs válidos según la estrategia elegida
- no permitir body vacío

---

## 12. Arquitectura objetivo

### Principio general
Mantener responsabilidades separadas:

- **Controller**: recibe request, valida, llama service, responde.
- **Service**: contiene reglas de negocio y orquestación.
- **Repository**: acceso a base de datos.

### Flujo esperado
`Route -> Controller -> Service -> Repository -> DB`

### Regla importante
- El controller **no** debe contener lógica de negocio.
- El repository **no** debe decidir reglas funcionales.
- El service debe ser fácilmente testeable.

---

## 13. Estructura de monorepo sugerida
```txt
project-root/
├─ apps/
│  ├─ api/
│  │  ├─ src/
│  │  │  ├─ config/
│  │  │  ├─ controllers/
│  │  │  ├─ services/
│  │  │  ├─ repositories/
│  │  │  ├─ routes/
│  │  │  ├─ middlewares/
│  │  │  ├─ validators/
│  │  │  ├─ utils/
│  │  │  ├─ types/
│  │  │  ├─ errors/
│  │  │  ├─ logger/
│  │  │  └─ server.ts
│  │  ├─ tests/
│  │  ├─ prisma/
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  └─ Dockerfile
│  │
│  └─ web/
│     ├─ src/
│     │  ├─ app/
│     │  ├─ components/
│     │  ├─ features/
│     │  ├─ store/
│     │  ├─ services/
│     │  ├─ hooks/
│     │  ├─ lib/
│     │  ├─ types/
│     │  └─ utils/
│     ├─ public/
│     ├─ package.json
│     ├─ tsconfig.json
│     └─ Dockerfile
│
├─ packages/
│  ├─ shared/
│  │  ├─ types/
│  │  ├─ constants/
│  │  └─ utils/
│
├─ docker-compose.yml
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ README.md
├─ AI_SPEC.md
├─ package.json
└─ pnpm-workspace.yaml
```

### Alternativa simple
Si no deseas monorepo, usar:
```txt
/backend
/frontend
README.md
AI_SPEC.md
docker-compose.yml
```

Para un examen técnico, la alternativa simple puede ser suficiente. Sin embargo, el agente debe mantener consistencia en estructura y convenciones.

---

## 14. Estructura backend sugerida
```txt
apps/api/src/
├─ config/
│  ├─ env.ts
│  └─ database.ts
├─ controllers/
│  ├─ project.controller.ts
│  └─ task.controller.ts
├─ services/
│  ├─ project.service.ts
│  └─ task.service.ts
├─ repositories/
│  ├─ project.repository.ts
│  └─ task.repository.ts
├─ routes/
│  ├─ project.routes.ts
│  ├─ task.routes.ts
│  └─ index.ts
├─ middlewares/
│  ├─ error-handler.middleware.ts
│  ├─ not-found.middleware.ts
│  ├─ request-logger.middleware.ts
│  └─ validate.middleware.ts
├─ validators/
│  ├─ project.schemas.ts
│  └─ task.schemas.ts
├─ errors/
│  ├─ app-error.ts
│  └─ error-codes.ts
├─ logger/
│  └─ logger.ts
├─ types/
├─ utils/
└─ server.ts
```

---

## 15. Estructura frontend sugerida
```txt
apps/web/src/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ projects/
│  │  ├─ page.tsx
│  │  └─ [projectId]/page.tsx
├─ components/
│  ├─ ui/
│  │  ├─ button.tsx
│  │  ├─ input.tsx
│  │  ├─ spinner.tsx
│  │  ├─ progress-bar.tsx
│  │  └─ alert.tsx
├─ features/
│  ├─ projects/
│  │  ├─ components/
│  │  │  ├─ project-list.tsx
│  │  │  ├─ project-card.tsx
│  │  │  └─ project-metrics.tsx
│  │  └─ services/
│  └─ tasks/
│     ├─ components/
│     │  ├─ task-list.tsx
│     │  ├─ task-item.tsx
│     │  └─ create-task-form.tsx
│     └─ services/
├─ store/
│  └─ project.store.ts
├─ hooks/
│  ├─ use-projects.ts
│  └─ use-project-tasks.ts
├─ services/
│  ├─ api-client.ts
│  ├─ project-api.ts
│  └─ task-api.ts
├─ types/
└─ utils/
```

---

## 16. Convenciones de implementación

### Generales
- Usar nombres claros y consistentes.
- Evitar lógica duplicada.
- Preferir funciones pequeñas y enfocadas.
- Mantener separación estricta de responsabilidades.

### TypeScript
- `strict: true`
- evitar `any`
- definir DTOs y tipos de respuesta

### Async/Await
- usar `async/await` en lugar de cadenas complejas de promesas
- envolver errores en services y controllers cuando corresponda
- nunca dejar promesas sin `await` o sin manejo explícito

### Clean code
- no mezclar acceso a DB en controllers
- no hacer cálculos de métricas en componentes visuales si pueden centralizarse
- extraer utilidades reutilizables

---

## 17. Estrategia frontend recomendada

### Renderizado
Usar **Server Components** en páginas base cuando no haya necesidad de interacción inmediata.
Usar **Client Components** para:
- formularios,
- listas interactivas,
- manejo de estado local,
- acciones de completar tarea,
- estados de loading/error.

### Estado global
Usar **Zustand** para:
- proyecto seleccionado,
- caché simple de proyectos/tareas si aplica,
- flags de UI compartidos.

Evitar estado global innecesario.

### UX mínima esperada
- skeleton o spinner en carga
- mensaje claro de error
- empty state cuando no haya proyectos o tareas
- feedback visual al crear/completar tareas
- barra de progreso visible y fácil de interpretar

---

## 18. Performance y buenas prácticas para Next.js
El agente debe seguir estas reglas:

- usar **Server Components** cuando no se requiera interacción del cliente,
- marcar con `'use client'` solo componentes realmente interactivos,
- evitar re-renders innecesarios,
- memoizar callbacks y derivados costosos solo cuando aporte valor real,
- no hacer fetch duplicado,
- centralizar el cliente HTTP,
- mantener componentes presentacionales desacoplados de la lógica,
- no sobreingenierizar el proyecto.

---

## 19. Testing mínimo requerido

### Backend
Agregar tests unitarios para al menos:
- creación de proyecto,
- creación de tarea,
- completar tarea,
- cálculo de métricas,
- edge case: proyecto sin tareas,
- edge case: completar tarea ya completada.

### Qué testear
Preferir tests sobre:
- services,
- utilidades de métricas,
- validaciones clave.

---

## 20. Edge cases obligatorios
El agente debe contemplar como mínimo:

- proyecto inexistente al crear tarea,
- tarea inexistente al completar,
- tarea ya completada,
- proyecto sin tareas,
- body inválido,
- strings vacíos,
- errores de conexión a BD,
- respuesta consistente cuando no hay datos.

---

## 21. Seguridad mínima
- Validar inputs.
- Sanitizar entradas si aplica.
- No exponer stack traces al cliente.
- Variables sensibles solo mediante entorno.
- CORS configurado de forma explícita.
- No subir archivos `.env` al repositorio.

---

## 22. Variables de entorno sugeridas
### Backend
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://user:password@db:3306/projects_db
LOG_LEVEL=info
```

### Frontend
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

---

## 23. Docker esperado

### Requerimientos
- Dockerfile funcional para backend
- Dockerfile funcional para frontend
- `docker-compose.yml` para levantar:
  - frontend
  - backend
  - mariadb

### Reglas
- Usar imágenes base estables
- Exponer puertos claros
- Configurar healthchecks si es posible
- Mantener el build reproducible

---

## 24. README requerido
El `README.md` debe incluir sí o sí:

1. Descripción del proyecto
2. Stack utilizado
3. Justificación de MariaDB
4. Cómo instalar dependencias
5. Cómo correr backend y frontend localmente
6. Cómo correr tests
7. Cómo levantar con Docker
8. Variables de entorno necesarias
9. Decisiones técnicas relevantes
10. Explicación SSR/CSR en Next.js
11. Ejemplo de pipeline CI/CD
12. Estrategia de despliegue y rollback

---

## 25. Pipeline CI/CD de referencia

### Objetivo
El pipeline debe contemplar:
- instalación de dependencias,
- ejecución de tests,
- build,
- despliegue.

### Ejemplo pseudo YAML
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run backend tests
        run: pnpm --filter api test

      - name: Build backend
        run: pnpm --filter api build

      - name: Build frontend
        run: pnpm --filter web build

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test-and-build
    runs-on: ubuntu-latest

    steps:
      - name: Deploy
        run: echo "Deploy step placeholder"
```

---

## 26. Estrategia de despliegue propuesta

### Aplicación web
- Frontend desplegado contenedor en VPS.
- Backend desplegado **Railway** o VPS con Docker.
- Base de datos MariaDB en servicio administrado o contenedor dedicado.

### Tiendas móviles (iOS y Android)
Aunque este proyecto no es móvil, la estrategia propuesta sería:
- reutilizar backend como API central,
- construir app móvil con React Native y EXPO,
- manejar staging y production con endpoints separados,
- usar pipelines independientes para distribución interna, TestFlight y Play Console.

### Ambientes
Definir mínimo:
- `development`
- `staging`
- `production`

Cada ambiente debe tener:
- variables de entorno independientes,
- base de datos independiente,
- logs separados,
- pipeline de despliegue controlado.

### Rollback
Estrategia recomendada:
- despliegues versionados con tags o imágenes Docker versionadas,
- posibilidad de redeploy de imagen previa,
- migraciones reversibles o cuidadosas,
- despliegue a staging antes de producción.

---

## 27. Prioridades de implementación
El agente debe construir en este orden:

1. Configuración base del repositorio
2. Modelo de datos y conexión a MariaDB
3. Repositories
4. Services
5. Controllers y routes
6. Validación y manejo de errores
7. Logging
8. Tests backend
9. Frontend base con listado de proyectos
10. Vista de detalle de proyecto y tareas
11. Crear tarea
12. Completar tarea y refrescar métricas
13. Docker
14. README
15. Pipeline CI/CD de ejemplo

---

## 28. Criterios de aceptación
Se considera completo cuando:

- el backend expone endpoints funcionales,
- la arquitectura por capas está clara,
- la validación funciona,
- los errores son consistentes,
- el logging es estructurado,
- existen tests unitarios básicos,
- el frontend permite listar proyectos y tareas,
- se puede crear una tarea desde la UI,
- se puede completar una tarea,
- se muestra el progreso del proyecto,
- existen estados de loading y error,
- Docker funciona,
- README está completo.

---

## 29. Restricciones para el agente
El agente que implemente este proyecto debe:

- evitar complejidad innecesaria,
- priorizar claridad sobre abstracciones excesivas,
- generar código limpio y mantenible,
- documentar las decisiones clave,
- no mezclar responsabilidades entre capas,
- mantener consistencia entre backend, frontend y README,
- seguir buenas prácticas de Next.js y Node.js.

---

## 30. Recomendación final de arquitectura
Para este examen, la mejor relación entre claridad, velocidad y calidad es:

- **Backend**: Express + TypeScript + Prisma + MariaDB + Zod + Pino + Vitest
- **Frontend**: Next.js + TypeScript + Tailwind + Zustand
- **Infra**: Docker Compose + GitHub Actions

Esta combinación permite entregar un proyecto:
- claro,
- moderno,
- fácil de justificar técnicamente,
- y suficientemente robusto para el alcance solicitado.