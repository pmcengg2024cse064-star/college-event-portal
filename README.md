# College Event Portal 

A modern, production-ready event discovery and registration platform for college clubs and departments.

**Built for**: Er. Perumal Manimekalai College of Engineering

##  Features

- **Event Discovery**: Browse all upcoming college events
- **Easy Registration**: Register for events with one click
- **Admin Dashboard**: Create events, manage registrations, download data
- **Modern UI**: Glassmorphic design with smooth animations
- **Mobile Responsive**: Works perfectly on all devices
- **Secure**: Authentication & authorization with Supabase
- **Real-time**: Live registration counters and availability

##  Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel
- **Database**: PostgreSQL with Row-Level Security

##  Quick Start

### 1. Prerequisites
```bash
node --version  # Should be 18+
npm --version
```

### 2. Setup Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Install & Run
```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### 4. Setup Supabase
- Create a [Supabase](https://supabase.com) project
- Run SQL from `SUPABASE_SCHEMA.sql`
- Create storage bucket `event-posters`
- Create admin user in Auth

**Full Setup Guide**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

##  Project Structure

```
src/
 app/
    admin/           # Admin pages (login, dashboard)
    events/          # Event details page
    layout.tsx       # Root layout
    page.tsx         # Homepage
 components/          # Reusable components
 lib/                 # Utilities (Supabase client)
 types/               # TypeScript types
```

##  Key Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Browse all events |
| Event Details | `/events/[id]` | View event & register |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Dashboard | `/admin/dashboard` | Manage events & registrations |

##  Admin Credentials (Testing)

Email: `admin@collegemail.com`
Password: `Admin@12345`

*Change these in production!*

##  Database Schema

### Events
- Title, description, poster image
- Date, time, venue
- Registration deadline & limits
- Automatic registration counter

### Registrations
- Student name, register number, department, email
- Prevents duplicate registrations
- Tracks registration timestamp

### Admin Users
- User authentication via Supabase Auth
- Role-based access control

##  Design Highlights

- **Glassmorphism**: Blur effects + transparency
- **Colors**: Violet/Pink primary, Orange accents
- **Animations**: Smooth hover & transition effects
- **Responsive**: Mobile, tablet, desktop support

##  Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import on Vercel
# - Go to vercel.com
# - Import from GitHub
# - Add environment variables
# - Deploy

# 3. Update Supabase URLs
# - Add Vercel URL to Auth redirect URLs
# - Update CORS settings
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed steps.

##  Configuration

### Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=              # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=         # Public anon key
SUPABASE_SERVICE_ROLE_KEY=             # Service role key
NEXT_PUBLIC_ADMIN_EMAIL=               # Default admin email
NEXT_PUBLIC_ADMIN_PASSWORD=            # Admin password
NEXT_PUBLIC_COLLEGE_NAME=              # College name for display
NEXT_PUBLIC_APP_URL=                   # App URL (for Vercel: your domain)
```

##  Usage

### Creating Events (Admin)
1. Login at `/admin/login`
2. Go to "Create Event" tab
3. Fill in event details
4. Click "Create Event"

### Registering for Events (Students)
1. Browse events on homepage
2. Click "View & Register" on any event
3. Fill registration form
4. Submit
5. Receive confirmation

### Downloading Registrations (Admin)
1. Go to admin dashboard
2. Click "View Registrations" on event
3. Click "Download CSV"

##  Troubleshooting

**Events not showing?**
- Check Supabase connection
- Verify SQL schema executed
- Check environment variables

**Admin login fails?**
- Verify auth user exists in Supabase
- Check email/password is correct
- Clear browser cache

**Images not loading?**
- Check storage bucket is public
- Verify poster URLs are valid
- Check CORS settings

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting.

##  Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Complete setup instructions
- [Database Schema](./SUPABASE_SCHEMA.sql) - SQL schema
- [Supabase Docs](https://supabase.com/docs) - Database documentation
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation

##  Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit a pull request

##  License

MIT License - see LICENSE file for details

##  Support

-  Email: support@collegemail.com
-  Issues: GitHub Issues
-  Discussions: GitHub Discussions

##  Production Checklist

- [ ] Environment variables configured
- [ ] Supabase database setup
- [ ] Admin user created
- [ ] Test events created
- [ ] Registration workflow tested
- [ ] Mobile responsiveness verified
- [ ] Deployed to Vercel
- [ ] Custom domain configured
- [ ] Monitoring/analytics setup

##  Roadmap

- [ ] Email notifications for registrations
- [ ] QR code attendance tracking
- [ ] Event categories/filtering
- [ ] Student dashboard (view registered events)
- [ ] Event reminders
- [ ] Analytics dashboard
- [ ] Multi-language support

##  Team

Built with  for college event management

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready 
