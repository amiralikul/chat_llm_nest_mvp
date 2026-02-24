# Chat LLM Nest MVP

A full-stack chat application powered by LLM (Anthropic Claude), built with NestJS and Next.js.

## Tech Stack

**Backend** (`llm-chat-backend/`)
- NestJS 11 + TypeScript
- Drizzle ORM + PostgreSQL
- Anthropic AI SDK for LLM integration
- JWT authentication with bcrypt password hashing

**Frontend** (`llm-chat-frontend/`)
- Next.js 16 + React 19
- Tailwind CSS 4
- Radix UI + shadcn/ui components
- Geist font

## Screenshots

### Authentication
![Sign In](auth.png)

### Chat Interface
![Chat](chat.png)

## Features

- User authentication (signup/login)
- Chat threads with message history
- LLM-powered responses via Anthropic Claude

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+

### PostgreSQL Setup

Choose one of the following methods:

**Option 1: Docker (recommended)**

```bash
docker run -d \
  --name chat-llm-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chat_llm \
  -p 5432:5432 \
  -v chat_llm_pgdata:/var/lib/postgresql/data \
  postgres:17
```

Connection URL: `postgresql://postgres:postgres@localhost:5432/chat_llm`

To stop/start later:

```bash
docker stop chat-llm-postgres
docker start chat-llm-postgres
```

**Option 2: Homebrew (macOS)**

```bash
brew install postgresql@17
brew services start postgresql@17
createdb chat_llm
```

Connection URL: `postgresql://localhost:5432/chat_llm`

**Option 3: Native install (Linux)**

```bash
sudo apt install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb chat_llm
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

Connection URL: `postgresql://postgres:postgres@localhost:5432/chat_llm`

### Backend

```bash
cd llm-chat-backend
npm install
cp .env.example .env  # configure your DB and API keys
npm run db:generate
npm run db:migrate
npm run start:dev
```

### Frontend

```bash
cd llm-chat-frontend
npm install
cp .env.example .env.local  # configure API URL
npm run dev
```

## Project Structure

```
├── llm-chat-backend/
│   └── src/
│       ├── auth/        # JWT auth (signup, login, guards)
│       ├── threads/     # Chat thread CRUD
│       ├── messages/    # Message handling + LLM integration
│       ├── db/          # Drizzle schema + module
│       └── common/      # Shared decorators
└── llm-chat-frontend/
    └── app/
        ├── (chat)/      # Main chat interface
        ├── login/       # Login page
        └── signup/      # Signup page
```
