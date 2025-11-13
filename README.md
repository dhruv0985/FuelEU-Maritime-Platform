# Fuel EU Maritime Compliance Platform

A full-stack application for managing Fuel EU Maritime compliance, including route management, compliance balance calculations, banking, and pooling features.

## Architecture

This project follows **Hexagonal Architecture (Ports & Adapters)** principles:

- **Core**: Domain entities, use cases, and port interfaces (framework-agnostic)
- **Adapters**: Framework-specific implementations (Express, React, PostgreSQL)
- **Infrastructure**: Database connections, server setup, and configuration

### Backend Structure

```
backend/src/
  core/
    domain/          # Domain entities and business logic
    application/     # Use cases
    ports/           # Repository and service interfaces
  adapters/
    inbound/http/    # Express controllers
    outbound/postgres/ # PostgreSQL repository implementations
  infrastructure/
    db/              # Database connection and migrations
    server/          # Express server setup
```

### Frontend Structure

```
frontend/src/
  core/
    domain/          # TypeScript interfaces
    application/     # React hooks (use cases)
    ports/           # API client interface
  adapters/
    ui/              # React components
    infrastructure/  # HTTP API client implementation
```

## Prerequisites

- Node.js (v20+)
- PostgreSQL (v12+)
- npm or yarn

## Setup

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fueleu_maritime
NODE_ENV=development
```

4. Create the database:
```bash
createdb fueleu_maritime
```

5. Run migrations:
```bash
npm run db:migrate
```

6. Seed the database:
```bash
npm run db:seed
```

7. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to `http://localhost:3001`):
```bash
VITE_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns)

## Features

### Routes Tab
- View all routes with filtering by vessel type, fuel type, and year
- Set baseline route for comparison
- Display route details: GHG intensity, fuel consumption, distance, emissions

### Compare Tab
- Compare routes against baseline
- Visual chart showing baseline vs comparison vs target intensity
- Calculate percentage difference and compliance status
- Target intensity: 89.3368 gCO₂e/MJ (2% below 91.16)

### Banking Tab
- View compliance balance (CB) for ships
- Bank positive CB surplus for future use
- Apply banked surplus to cover deficits
- Real-time CB updates after banking operations

### Pooling Tab
- Create compliance pools with multiple ships
- View adjusted CB per ship
- Validate pool rules:
  - Sum of adjusted CBs must be ≥ 0
  - Deficit ships cannot exit worse
  - Surplus ships cannot exit negative
- Greedy allocation algorithm for surplus distribution

## API Endpoints

### Routes
- `GET /routes` - Get all routes (with optional filters)
- `POST /routes/:routeId/baseline` - Set baseline route
- `GET /routes/comparison` - Get route comparisons

### Compliance
- `GET /compliance/cb?shipId=XXX&year=YYYY` - Get/compute compliance balance
- `GET /compliance/adjusted-cb?shipId=XXX&year=YYYY` - Get adjusted CB (after banking/pooling)

### Banking
- `GET /banking/records?shipId=XXX&year=YYYY` - Get bank records
- `POST /banking/bank` - Bank surplus CB
- `POST /banking/apply` - Apply banked surplus

### Pooling
- `POST /pools` - Create a compliance pool

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Database Schema

- **routes**: Route data with GHG intensity, fuel consumption, etc.
- **ship_compliance**: Compliance balance records per ship/year
- **bank_entries**: Banked surplus entries
- **pools**: Pool registry
- **pool_members**: Pool member allocations with before/after CBs

## Compliance Balance Formula

```
CB = (Target Intensity - Actual Intensity) × Energy in Scope
Energy in Scope = Fuel Consumption (t) × 41,000 MJ/t
Target Intensity (2025) = 89.3368 gCO₂e/MJ
```

## Technologies

- **Backend**: Node.js, TypeScript, Express, PostgreSQL
- **Frontend**: React, TypeScript, TailwindCSS, Recharts
- **Architecture**: Hexagonal (Ports & Adapters)
- **Build Tools**: Vite, tsx

## License

ISC

