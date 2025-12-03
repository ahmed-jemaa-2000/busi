# Busi - Multi-Tenant E-Commerce SaaS Platform

A multi-tenant e-commerce SaaS platform designed for small clothing sellers in Tunisia. Built with Strapi (headless CMS) and Next.js.

## Features

- 🏪 **Multi-tenant architecture** - Each shop gets its own subdomain (e.g., `amira.brandini.tn`)
- 🎨 **Customizable themes** - 4 template variants with color and font customization
- 📱 **WhatsApp integration** - Direct ordering via WhatsApp
- 🔐 **Secure authentication** - Custom dashboard UI with JWT-based auth
- 🛍️ **Product management** - Full CRUD for products, categories, and orders
- 📊 **Shop owner dashboard** - Manage products, settings, and view analytics

## Tech Stack

- **Backend**: Strapi 4.x (Node.js, PostgreSQL)
- **Frontend**: Next.js 14+ (React, TypeScript, Tailwind CSS)
- **Database**: PostgreSQL
- **Hosting**: Hetzner Cloud VPS (Ubuntu)
- **Reverse Proxy**: Nginx
- **Process Manager**: PM2

## Project Structure

```
busi/
├── apps/
│   ├── backend/          # Strapi headless CMS
│   └── frontend/         # Next.js frontend (storefront + dashboard)
├── packages/
│   ├── types/           # Shared TypeScript types
│   └── utils/           # Shared utilities
├── deployment/          # Deployment scripts and configs
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 20.x or higher
- pnpm 8.x or higher
- PostgreSQL 15 or higher

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

#### Backend (.env)

```bash
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env with your database credentials
```

#### Frontend (.env.local)

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
# Edit apps/frontend/.env.local with your Strapi API URL
```

### 3. Start PostgreSQL

Make sure PostgreSQL is running and create a database:

```sql
CREATE DATABASE busi_dev;
```

### 4. Run development servers

```bash
# Start both backend and frontend
pnpm dev

# Or start individually
pnpm dev:backend
pnpm dev:frontend
```

- Backend (Strapi): http://localhost:1337
- Frontend: http://localhost:3000
- Strapi Admin (platform admin only): http://localhost:1337/admin

## Development

### Backend Development

```bash
cd apps/backend
pnpm dev
```

### Frontend Development

```bash
cd apps/frontend
pnpm dev
```

### Testing Subdomains Locally

Add these entries to your hosts file:

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Linux/Mac**: `/etc/hosts`

```
127.0.0.1 brandini.test
127.0.0.1 dashboard.brandini.test
127.0.0.1 api.brandini.test
127.0.0.1 amira.brandini.test
127.0.0.1 demo.brandini.test
```

Then access:
- Dashboard: http://dashboard.brandini.test:3000
- Storefront: http://amira.brandini.test:3000 (after creating a shop with subdomain "amira")

## Deployment

See [deployment/README.md](deployment/README.md) for production deployment instructions.

## Architecture

### Multi-Tenancy

- Each shop has a unique subdomain (e.g., `amira.brandini.tn`)
- Next.js middleware extracts subdomain from request host
- Strapi API filters data by shop based on subdomain
- Row-level security ensures shop owners only see their own data

### Authentication

- Shop owners log in via custom dashboard UI (not Strapi admin)
- JWT tokens stored in httpOnly cookies
- Platform admins access Strapi admin panel directly

### Theme System

- 4 base templates: Minimal, Boutique, Kids, Street
- Per-shop customization: colors, fonts, hero style, card style
- CSS variables for dynamic theming

## Documentation

- [Full Implementation Plan](C:\Users\Asus\.claude\plans\sorted-foraging-stearns.md)
- [Deployment Guide](deployment/README.md)
- [API Documentation](apps/backend/README.md)

## License

Proprietary - All rights reserved

## Support

For issues and questions, please contact the development team.
