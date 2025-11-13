# Quick Start Guide

## Prerequisites

1. **PostgreSQL** installed and running
2. **Node.js** v20+ installed
3. **npm** or **yarn**

## Setup Steps

### 1. Database Setup

```bash
# Create database
createdb fueleu_maritime

# Or using psql:
psql -U postgres
CREATE DATABASE fueleu_maritime;
\q
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# (Optional) Create .env file
# VITE_API_URL=http://localhost:3001

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Manual Testing

1. Open frontend in browser
2. Navigate to **Routes** tab - should see 5 routes
3. Click **Set Baseline** on any route
4. Navigate to **Compare** tab - should see comparisons
5. Navigate to **Banking** tab - enter Ship ID (e.g., SHIP001) and Year (2024)
6. Navigate to **Pooling** tab - add ships and create pool

## Troubleshooting

### Database Connection Issues

- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env` file
- Ensure database exists: `psql -l | grep fueleu_maritime`

### Port Already in Use

- Backend: Change PORT in `.env` file
- Frontend: Vite will automatically use next available port

### CORS Issues

- Ensure backend CORS is enabled (already configured)
- Check VITE_API_URL matches backend URL

## Project Structure

```
FuelEU-Maritime-Platform/
├── backend/
│   ├── src/
│   │   ├── core/           # Domain logic (framework-agnostic)
│   │   ├── adapters/       # Framework adapters
│   │   └── infrastructure/ # DB, server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── core/           # Domain logic
│   │   └── adapters/       # UI and API clients
│   └── package.json
├── README.md
├── AGENT_WORKFLOW.md
└── REFLECTION.md
```

## Next Steps

1. Review code structure
2. Run tests: `npm test` (backend)
3. Explore the four tabs in the frontend
4. Check API endpoints using browser dev tools or Postman
5. Review documentation files

