# Byepo Feature Flag System
## Overview
A multi-tenant feature flag management system with 3 separate frontends.
## Tech Stack
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Frontend: React
- Auth: Custom JWT (no third-party)
## Live URLs
- Backend API: https://byepo-feature-flags.onrender.com
- Super Admin App: https://byepo-feature-flags-3tqcs4j7d-mohameds-projects-6183ad2d.vercel.app
- Admin App: https://byepo-feature-flags-qvdy-nkb69ezt6-mohameds-projects-6183ad2d.vercel.app/
- User App: https://byepo-feature-flags-5n55-nztc24cju-mohameds-projects-6183ad2d.vercel.app/
## Super Admin Credentials (for testing)
- Email: admin@byepo.com
- Password: Admin@123
## How to Run Locally
1. Clone the repo
2. cd backend && npm install
3. Create backend/.env with MONGO_URI, JWT_SECRET, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD
4. npm run dev (backend starts on port 5000)
5. cd super-admin-app && npm install && npm start (port 3000)
6. cd admin-app && npm install && PORT=3001 npm start (port 3001)
7. cd user-app && npm install && PORT=3002 npm start (port 3002)
## Engineering Trade-offs
- MongoDB chosen for flexible schema (easy to extend flags with metadata later)
- Compound index on (feature_key + organization) for fast flag lookups
- JWT expiry: 8 hours (suitable for a standard work session)
- Super admin uses env-based static credentials (simple, no DB overhead)
- Error messages are descriptive but don't expose internal stack traces
