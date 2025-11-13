# Deployment Guide

## Pre-Submission Verification

Before submitting, verify all components are working:

### 1. Backend Tests
```powershell
cd backend
npm test
```
**Expected Output**: 
```
Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
```

### 2. Backend Build
```powershell
cd backend
npm run build
```
**Expected**: Compiles without errors. Output in `backend/dist/`

### 3. Frontend Build
```powershell
cd frontend
npm run build
```
**Expected**: Builds successfully. Output in `frontend/dist/`

### 4. Dependency Check
```powershell
cd backend
npm install --production

cd ../frontend
npm install --production
```
**Expected**: All dependencies install without errors

## Local Development Verification

When PostgreSQL is available:

### 1. Database Setup
```powershell
psql -U postgres
CREATE DATABASE fueleu_maritime;
\q
```

### 2. Backend Database Setup
```powershell
cd backend
npm run db:migrate
npm run db:seed
```

### 3. Start Backend
```powershell
cd backend
npm run dev
```
**Expected**: Server running on http://localhost:3001

### 4. Start Frontend (New Terminal)
```powershell
cd frontend
npm run dev
```
**Expected**: Frontend available at http://localhost:5173

### 5. Verify Functionality

#### Routes Tab
- [ ] All 5 routes display (R001-R005)
- [ ] Can set baseline route
- [ ] Filters work (vessel type, fuel type, year)

#### Compare Tab
- [ ] Comparison data displays
- [ ] Chart renders
- [ ] Compliance status shows (✅/❌)

#### Banking Tab
- [ ] Can fetch compliance balance
- [ ] Can bank surplus
- [ ] Can apply banked amount

#### Pooling Tab
- [ ] Can view adjusted CB
- [ ] Can create pool
- [ ] Validation works

## Production Deployment

### Backend (Docker Optional)

```powershell
# Build
cd backend
npm run build

# Start with production database
$env:NODE_ENV = "production"
$env:DATABASE_URL = "postgresql://user:pass@host:5432/fueleu_maritime"
npm start
```

### Frontend (Static Site)

```powershell
# Build
cd frontend
npm run build

# Upload frontend/dist to:
# - AWS S3
# - Netlify
# - Vercel
# - nginx/Apache static server
```

### Environment Variables

**Backend**:
```
DATABASE_URL=postgresql://user:pass@host:5432/fueleu_maritime
PORT=3001
NODE_ENV=production
```

**Frontend**:
```
VITE_API_URL=https://api.fueleu.example.com
```

## Cloud Deployment Options

### AWS Deployment

**Backend (Lambda + RDS)**:
```
1. Create RDS PostgreSQL instance
2. Deploy Node.js app to Lambda
3. API Gateway for HTTP endpoints
4. Set DATABASE_URL to RDS connection string
```

**Frontend (S3 + CloudFront)**:
```
1. Build: npm run build
2. Upload dist/ to S3
3. Create CloudFront distribution
4. Set API_URL to API Gateway URL
```

### Heroku Deployment

**Backend**:
```powershell
# Create Heroku app
heroku create fuel-eu-backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Set environment variables
heroku config:set NODE_ENV=production
```

**Frontend**:
```
Deploy dist/ to Netlify or Vercel
Set VITE_API_URL to Heroku backend URL
```

### Docker Deployment

**Backend Dockerfile**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/infrastructure/server/index.js"]
```

**Frontend Dockerfile**:
```dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Database Backup & Restore

### Backup PostgreSQL
```powershell
pg_dump fueleu_maritime -U postgres > backup.sql
```

### Restore PostgreSQL
```powershell
psql fueleu_maritime -U postgres < backup.sql
```

## Monitoring & Logging

### Backend Health Check
```
GET /health  (Optional - can be added)
```

### Error Logging
- Use Winston or Pino for structured logging
- Send logs to Datadog, Splunk, or ELK stack

### Database Monitoring
- Monitor connection pool usage
- Set up alerts for query performance
- Regular backup verification

## Performance Optimization

### Frontend
- ✅ Already using TailwindCSS (tree-shaken)
- ✅ Code-split using Vite dynamic imports
- ✅ Minified production build
- Add: Image optimization
- Add: Gzip/Brotli compression

### Backend
- Add: Query optimization with indexes
- Add: Response caching with Redis
- Add: Database connection pooling tuning
- Add: Rate limiting

## Security Checklist

- [ ] No hardcoded secrets in code
- [ ] All environment variables documented
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] HTTPS enforced in production
- [ ] Database credentials rotated regularly
- [ ] No sensitive data in logs

## Rollback Plan

### If Backend Deployment Fails
```powershell
# Keep previous production version running
# Redirect traffic to previous instance
# Debug issues in staging environment
git log --oneline  # Find previous good commit
git revert <commit-hash>
```

### If Frontend Deployment Fails
```powershell
# Revert to previous CloudFront distribution
# Revert S3 files to previous version
# Test in staging before redeployment
```

## Post-Deployment Verification

After deployment:
- [ ] All API endpoints responding
- [ ] Database migrations applied
- [ ] Frontend loads without errors
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive testing
- [ ] Performance monitoring active
- [ ] Error tracking configured
- [ ] Backup and recovery tested

## Support & Troubleshooting

### Common Issues

**502 Bad Gateway**
- Backend service not running
- Database connection timeout
- Check backend logs: `npm run dev`

**CORS Errors**
- Backend CORS not configured
- Frontend VITE_API_URL incorrect
- Verify backend URL in frontend

**Database Connection Refused**
- PostgreSQL not running
- Wrong connection string
- Firewall blocking port 5432

**Out of Memory**
- Node.js heap too small
- Increase: `NODE_OPTIONS=--max-old-space-size=4096`

## References

- Node.js Best Practices: https://nodejs.org/en/docs/guides/
- PostgreSQL Administration: https://www.postgresql.org/docs/
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html
- TypeScript Best Practices: https://www.typescriptlang.org/docs/

---

**Last Updated**: November 13, 2025
**Status**: Ready for Production Deployment
