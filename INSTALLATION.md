# Installation & Setup Guide

## System Requirements

- **Node.js**: v20.19+ or v22.12+ (for Vite frontend compatibility)
- **PostgreSQL**: v12 or higher
- **npm**: v10+

## Step-by-Step Installation

### 1. Database Setup

#### Option A: Using psql
```powershell
# Connect to PostgreSQL
psql -U postgres

# Inside psql:
CREATE DATABASE fueleu_maritime;
\q
```

#### Option B: Using createdb
```powershell
createdb -U postgres fueleu_maritime
```

### 2. Backend Installation & Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# The .env file is already configured. Verify it contains:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fueleu_maritime
# PORT=3001
# NODE_ENV=development

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed

# Run tests to verify everything is working
npm run test
```

Expected test output:
```
Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
```

### 3. Start Backend Server

```powershell
# From the backend directory
npm run dev
```

You should see:
```
Server running on port 3001
```

The backend will be available at: `http://localhost:3001`

### 4. Frontend Installation & Setup

In a new terminal:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build frontend (optional, for production)
npm run build
```

### 5. Start Frontend Server

```powershell
# From the frontend directory
npm run dev
```

You should see:
```
VITE v7.2.2  ready in XXX ms

➜  Local:   http://localhost:5173/
```

Open the frontend in your browser: `http://localhost:5173`

## Verification Checklist

- [ ] Backend database migrations completed without errors
- [ ] Backend test suite passes (10/10 tests)
- [ ] Backend server running on http://localhost:3001
- [ ] Frontend loads at http://localhost:5173
- [ ] Routes tab shows 5 routes (R001-R005)
- [ ] Compare tab loads baseline comparison
- [ ] Banking tab shows compliance balance
- [ ] Pooling tab loads and allows pool creation

## Troubleshooting

### PostgreSQL Connection Error

**Error**: `Error [ECONNREFUSED]: Connection refused`

**Solution**:
1. Check PostgreSQL is running:
   ```powershell
   pg_isready
   ```
   Should output: `accepting connections`

2. Verify database exists:
   ```powershell
   psql -U postgres -l | grep fueleu_maritime
   ```

3. Check DATABASE_URL in `backend/.env`:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fueleu_maritime
   ```

### Node.js Version Issue

**Error**: `You are using Node.js XX.XX.X. Vite requires Node.js version 20.19+ or 22.12+`

**Solution**:
1. Check your Node.js version:
   ```powershell
   node --version
   ```

2. Update Node.js (download from nodejs.org or use nvm-windows)

### Port Already in Use

**Backend**: 
```powershell
# Change PORT in backend/.env, e.g., PORT=3002
npm run dev
```

**Frontend**:
Vite will automatically use the next available port if 5173 is in use

### CORS Issues

**Error**: Cross-Origin Request Blocked

**Solution**: Verify backend is running and CORS is configured (already enabled in Express setup)

## Database Schema

After migrations and seeding, you'll have:

- **routes** table: 5 sample routes (R001-R005)
- **ship_compliance** table: Empty, populated on first CB computation
- **bank_entries** table: Empty, populated when banking occurs
- **pools** table: Empty, populated when pools are created
- **pool_members** table: Empty, populated with pool allocations

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fueleu_maritime
PORT=3001
NODE_ENV=development
```

### Frontend (optional)
```
VITE_API_URL=http://localhost:3001
```

If not set, defaults to `http://localhost:3001`

## Running Tests

### Backend Unit Tests
```powershell
cd backend
npm test
```

### Frontend (No tests configured yet)
To add tests:
```powershell
cd frontend
npm install --save-dev vitest @testing-library/react
npm run test
```

## Production Build

### Backend
```powershell
cd backend
npm run build
npm start
```

### Frontend
```powershell
cd frontend
npm run build
# Outputs to frontend/dist
```

## Project Structure Reference

```
FuelEU-Maritime-Platform/
├── backend/
│   ├── src/
│   │   ├── core/          # Domain, use cases, ports
│   │   ├── adapters/      # Controllers, repositories
│   │   └── infrastructure/ # Database, server setup
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── core/          # Domain, hooks, ports
│   │   ├── adapters/      # UI components, API client
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── README.md              # Project overview
├── QUICKSTART.md          # Quick start guide
├── AGENT_WORKFLOW.md      # AI agent usage documentation
└── REFLECTION.md          # Reflection on AI usage
```

## Next Steps

1. Explore the Routes tab to view all compliance routes
2. Set a baseline route
3. Navigate to the Compare tab to see comparisons
4. Test banking operations in the Banking tab
5. Create compliance pools in the Pooling tab

## Support

For detailed API documentation, see README.md
For AI agent usage details, see AGENT_WORKFLOW.md
For architecture details, see README.md under "Architecture" section
