# Deployment Guide

## Prerequisites
- Vercel account (free tier works)
- PostgreSQL database (Supabase/Neon recommended)
- Git repository

## Step-by-Step Deployment

### 1. Setup Database

**Option A: Supabase (Recommended)**
1. Go to [https://supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

**Option B: Neon**
1. Go to [https://neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

### 2. Push to Git

```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 3. Deploy to Vercel

#### Via CLI:
```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Via Dashboard:
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 4. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-project.vercel.app
GOOGLE_SEARCH_API_KEY=<optional>
GOOGLE_CSE_ID=<optional>
```

### 5. Setup Database Schema

```powershell
# Install Prisma CLI
npm install -g prisma

# Push schema to database
npx prisma db push

# Seed database
npx prisma db seed
```

Or run in Vercel terminal (after deployment):
```bash
npm run prisma:push
npm run seed
```

### 6. Access Your Application

Your app will be available at: `https://your-project.vercel.app`

## Post-Deployment

### Update Environment Variables
```powershell
vercel env add NEXTAUTH_URL production
# Enter: https://your-project.vercel.app
```

### Redeploy
```powershell
vercel --prod
```

### View Logs
```powershell
vercel logs
```

### Check Build Status
Visit: `https://vercel.com/dashboard`

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database allows connections from Vercel IPs
- Ensure database is running

### Build Failures
```powershell
# Test locally first
npm run build

# Check logs
vercel logs
```

### API Route Timeouts
- Increase function timeout in vercel.json
- Optimize slow queries
- Add caching

## Performance Optimization

### 1. Enable Caching
Add to `next.config.js`:
```javascript
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  swcMinify: true,
}
```

### 2. Database Connection Pooling
Use Prisma's connection pooling for better performance.

### 3. Image Optimization
Images are automatically optimized by Next.js.

## Monitoring

### Setup Vercel Analytics
1. Go to project settings
2. Enable Analytics
3. View real-time metrics

### Error Tracking
Consider integrating:
- Sentry
- LogRocket
- Datadog

## Security

### Environment Variables
- Never commit `.env` to Git
- Use Vercel's encrypted environment variables
- Rotate secrets regularly

### Database
- Use read-only connection strings where possible
- Enable SSL for database connections
- Regular backups

### API Routes
- Implement rate limiting
- Add authentication to protected routes
- Validate all inputs

## Scaling

### Database
- Upgrade database plan as needed
- Add read replicas for read-heavy workloads
- Implement connection pooling

### Vercel
- Free tier: 100GB bandwidth/month
- Pro tier: 1TB bandwidth/month
- Enterprise: Custom limits

## CI/CD Pipeline

Vercel automatically:
- Builds on every push
- Creates preview deployments for PRs
- Deploys to production from main branch

### Custom Build Script
Add to `package.json`:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma db push && next build"
  }
}
```

## Cost Optimization

### Free Tier Limits
- 100 GB bandwidth
- Unlimited deployments
- No credit card required

### Tips
- Optimize images
- Implement caching
- Use ISR for static pages
- Minimize API calls

## Support

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

## Rollback

If deployment fails:
```powershell
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```
