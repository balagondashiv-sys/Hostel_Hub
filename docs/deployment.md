# HostelHub — Deployment Guide

## Deployment Stack
- **Frontend**: Vercel
- **Backend**: Render / Railway
- **Database**: PostgreSQL (Neon / Supabase)

## Environment Variables

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://hostelhub-api.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://hostelhub-api.onrender.com
```

### Backend (Render)
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/hostelhub
JWT_SECRET=production_super_secret_jwt_key
CLIENT_URL=https://hostelhub.vercel.app
AI_API_KEY=your_openai_or_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Steps

1. **Deploy Database**: Provision a Managed PostgreSQL instance on Neon or Supabase and obtain `DATABASE_URL`.
2. **Deploy Backend on Render**:
   - Build Command: `cd backend && npm install && npm run build && npm run prisma:generate`
   - Start Command: `cd backend && npm start`
3. **Deploy Frontend on Vercel**:
   - Set Root Directory to `frontend`
   - Build Command: `next build`
