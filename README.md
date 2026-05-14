# Leave Management System

Internal leave tracking platform for Haat.delivery employees.

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Authentication:** Auth.js v5 (NextAuth)
- **Database:** Google Sheets (via service account)
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Google Cloud project with OAuth credentials
- Google Sheets with service account access

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API route handlers
│   ├── dashboard/          # Dashboard page
│   ├── history/            # Leave history page
│   ├── login/              # Login page
│   └── users/              # Admin user management
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── shared/             # App-wide reusable components
│   └── admin/              # Admin-specific components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── auth/               # Auth.js configuration
│   ├── sheets/             # Google Sheets client
│   ├── permissions/        # RBAC helpers
│   └── validations/        # Input validation
├── services/               # Data access layer
├── types/                  # Shared TypeScript types
└── middleware.ts           # Route protection
```

## Environment Variables

See `.env.example` for the full list of required variables.
