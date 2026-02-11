# Portfolio Backend API

Production-ready REST API backend for a personal portfolio website. Supports multi-language content (Uzbek, Russian, English), blog posts, projects showcase, and resume/CV management.

## Tech Stack

- **Node.js** + **Express.js** + **TypeScript**
- **PostgreSQL** with **Prisma ORM**
- **JWT** authentication for admin
- **Zod** validation
- **Swagger/OpenAPI** documentation

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment (copy .env.example to .env and configure)
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Push schema to database (or run migrations)
npm run db:push

# Seed admin user and sample data
npm run db:seed

# Start development server
npm run dev
```

- **API Base**: http://localhost:4000/api
- **Swagger Docs**: http://localhost:4000/api-docs
- **Health Check**: http://localhost:4000/health

## API Endpoints

### Public API (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs?lang=en` | List published blog posts |
| GET | `/api/blogs/:slug?lang=en` | Get blog post by slug |
| GET | `/api/projects?lang=en` | List published projects |
| GET | `/api/projects/:slug?lang=en` | Get project by slug |
| GET | `/api/resume?lang=en` | Get all resume sections |
| GET | `/api/resume/:sectionKey?lang=en` | Get resume section by key |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login (returns JWT) |

### Admin API (Bearer token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/blogs` | List all blogs (incl. draft) |
| POST | `/api/admin/blogs` | Create blog |
| PUT | `/api/admin/blogs/:id` | Update blog |
| DELETE | `/api/admin/blogs/:id` | Delete blog |
| GET | `/api/admin/projects` | List all projects |
| POST | `/api/admin/projects` | Create project |
| PUT | `/api/admin/projects/:id` | Update project |
| DELETE | `/api/admin/projects/:id` | Delete project |
| GET | `/api/admin/resume` | List resume sections |
| POST | `/api/admin/resume` | Create resume section |
| PUT | `/api/admin/resume/:id` | Update resume section |
| DELETE | `/api/admin/resume/:id` | Delete resume section |

## Language Support

Use `?lang=en`, `?lang=ru`, or `?lang=uz` on public endpoints. Default: `en`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (e.g. 7d) |
| `ADMIN_EMAIL` | Initial admin email (seed) |
| `ADMIN_PASSWORD` | Initial admin password (seed) |

## Project Structure

```
src/
├── config/          # Environment config
├── middlewares/     # Auth, error handling, lang
├── modules/
│   ├── auth/        # Login, JWT
│   ├── blog/        # Blog CRUD
│   ├── project/     # Project CRUD
│   └── resume/      # Resume sections CRUD
├── routes/          # API route aggregation
├── utils/           # Helpers, errors, prisma
├── app.ts           # Express app
└── server.ts        # Entry point
```

## Deployment

- **Render**: Add `npm run build && npm run start` as start command
- **Vercel**: Use serverless functions or deploy as Node.js server
- Ensure `DATABASE_URL` and `JWT_SECRET` are set in production
