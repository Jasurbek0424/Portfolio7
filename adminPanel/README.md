# Portfolio Admin Panel

Modern admin dashboard for managing your portfolio content (blogs, projects, resume).

## Tech Stack

- **Next.js** (App Router)
- **React** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **React Hook Form** + **Zod**
- **Axios** (API requests)
- **JWT** authentication

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` (or copy from `.env.example`):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. Ensure your backend is running (see `../backend/README.md`).

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) (or the port shown in the terminal) — you'll be redirected to `/admin/login`.

## Routes

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin login |
| `/admin/dashboard` | Dashboard home |
| `/admin/blogs` | Blog list |
| `/admin/blogs/create` | Create blog |
| `/admin/blogs/edit/:id` | Edit blog |
| `/admin/projects` | Project list |
| `/admin/projects/create` | Create project |
| `/admin/projects/edit/:id` | Edit project |
| `/admin/resume` | CV/Resume editor |

## Default Admin Credentials

After running `db:seed` in the backend:

- **Email:** `admin@portfolio.com`
- **Password:** `ChangeMe123!`

Change these in production!

## Features

- **Authentication:** JWT stored in localStorage, protected routes
- **Blogs:** Full CRUD with multilingual (EN/RU/UZ) support, Markdown content
- **Projects:** CRUD with tech stack, GitHub/demo links
- **Resume:** Edit About, Experience, Education, Skills sections
- **Dark mode** by default
- **Toast notifications** for success/error
- **Responsive** layout
