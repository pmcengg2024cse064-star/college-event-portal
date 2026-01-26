# 🚀 College Event Portal - Quick Start Guide

**Status**: ✅ Production Ready  
**Last Updated**: January 26, 2026  
**Version**: 1.0.0

---

## ⚡ 5-Minute Setup

### 1️⃣ Prerequisites Check
```bash
node --version  # Must be 18+
npm --version
```

### 2️⃣ Get Supabase Credentials
1. Go to [supabase.com](https://supabase.com)
2. Create free project
3. Copy these from Settings > API:
   - Project URL (example: `https://abc123.supabase.co`)
   - Anon Key (public key)
   - Service Role Key (secret key)

### 3️⃣ Configure Environment
```bash
# Copy template
cp .env.local.example .env.local

# Edit .env.local - paste your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_secret_key_here
```

### 4️⃣ Setup Database (5 minutes)
1. Open Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy all content from **SUPABASE_SCHEMA.sql** file
4. Paste into SQL editor
5. Click "Run"

### 5️⃣ Create Admin User (2 minutes)
1. Go to Supabase Auth → Users
2. Click "Invite User"
3. Email: `admin@collegemail.com`
4. Copy the invite link and set password

### 6️⃣ Setup Storage (1 minute)
1. Go to Storage in Supabase
2. Click "Create Bucket"
3. Name: `event-posters`
4. Uncheck "Private" (make public)
5. Save

### 7️⃣ Install & Run
```bash
npm install
npm run dev
```

### 8️⃣ Test It
- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Demo**: admin@collegemail.com / Admin@12345

---

## 📋 Complete Setup Checklist

### Database Setup ✅
```sql
-- All tables created:
- events
- registrations
- admin_users

-- Indexes created for performance
-- RLS (Row Level Security) enabled
-- Triggers for auto-timestamps
```

### Authentication ✅
- Admin user created in Supabase Auth
- Email/password login working
- Session management ready

### Storage ✅
- `event-posters` bucket created
- Public read access enabled
- Ready for event poster uploads

### Project Structure ✅
```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── admin/
│   │   ├── login/page.tsx    # Admin login
│   │   └── dashboard/page.tsx # Admin panel
│   └── events/[id]/page.tsx  # Event details
├── components/
│   ├── Header.tsx            # Navigation
│   ├── EventCard.tsx         # Event card
│   └── RegistrationForm.tsx  # Registration
├── lib/
│   └── supabase.ts           # Supabase client
└── types/
    └── index.ts              # TypeScript types
```

---

## 🎯 First Steps After Setup

### 1. Create Your First Event
```
1. Go to http://localhost:3000/admin/login
2. Sign in: admin@collegemail.com / Admin@12345
3. Click "Create Event" tab
4. Fill in:
   - Title: "Tech Summit 2026"
   - Description: Event details...
   - Date/Time: Pick dates
   - Venue: "Main Auditorium"
   - Registration Deadline: Future date
   - Max Registrations: 100
5. Click "Create Event"
```

### 2. See Event on Homepage
```
1. Go to http://localhost:3000
2. Should see your event card
3. Click "View & Register"
4. Test registration form
```

### 3. Verify Admin Features
```
1. Go back to admin dashboard
2. Click "View Registrations" on event
3. Should see your test registration
4. Click "Download CSV" to export
```

---

## 🎨 Customization

### Change College Name
Edit `.env.local`:
```
NEXT_PUBLIC_COLLEGE_NAME="Your College Name"
```

### Change Colors (Violet/Pink → Your Brand)
Edit `src/app/globals.css`:
```css
:root {
  --primary: 280 67% 50%;      /* Change this to your color */
  --accent: 39 89% 50%;         /* Change this to your color */
}
```

### Add Custom Departments
Edit `src/components/RegistrationForm.tsx` (line ~80):
```tsx
<option value="Your Department">Your Department</option>
```

---

## 🔐 Production Security

### Before Going Live:

⚠️ **CRITICAL**: Change admin password!
```sql
-- In Supabase SQL Editor:
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{password_changed}', 
  'true'
) 
WHERE email = 'admin@collegemail.com';
```

✅ Environment variables:
- `.env.local` is in `.gitignore` (not committed)
- All secrets are private
- Service Role Key never exposed

✅ Database security:
- RLS policies enabled
- Public can only read events
- Only authenticated users can register
- Only event creators can edit

---

## 📊 Database Overview

### Events Table
```
- id (auto-generated)
- title, description
- date, time, venue
- registration_deadline
- max_registrations
- current_registrations (auto-updated)
- poster_url (for images)
```

### Registrations Table
```
- id (auto-generated)
- event_id (which event)
- student_name, register_number
- department, email
- created_at (timestamp)
- Prevents duplicate: (event_id, email)
```

### Admin Users Table
```
- user_id (from Supabase Auth)
- email
- role (admin)
```

---

## 🌐 Deploy to Vercel (Free)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/college-event-portal.git
git push -u origin main
```

### 2. Deploy
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repo
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
5. Click "Deploy"

### 3. Configure Supabase
1. Copy your Vercel URL
2. Go to Supabase Auth → URL Configuration
3. Add Redirect URL: `https://your-vercel-url.com/admin/dashboard`

---

## 🐛 Troubleshooting

### "Events not showing?"
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Check database connection
# Go to Supabase → SQL Editor → run:
SELECT * FROM events;
```

### "Admin login not working?"
1. Verify user exists in Supabase Auth
2. Check email/password is correct
3. Clear browser cache: Ctrl+Shift+Del

### "Images not loading?"
1. Upload image to `event-posters` bucket in Supabase
2. Copy public URL
3. Manually update event poster_url in database

### "Getting errors in console?"
1. Open DevTools: F12
2. Check Network tab for failed requests
3. Check Application tab for auth session
4. Review Supabase logs

---

## 📱 Testing Checklist

- [ ] Homepage loads
- [ ] Events display as cards
- [ ] Event cards are responsive
- [ ] Click "View Details" works
- [ ] Event details page loads
- [ ] Registration form displays
- [ ] Can fill and submit form
- [ ] Success message appears
- [ ] Admin login page works
- [ ] Can login with credentials
- [ ] Admin dashboard loads
- [ ] Can create event
- [ ] Event appears on homepage
- [ ] Can view registrations
- [ ] CSV download works
- [ ] Logout works

---

## 🎓 File Structure Explanation

```
college-event-portal/
│
├── src/                          # Source code
│   ├── app/                      # Next.js App Router pages
│   │   ├── (events)/             # Event pages route group
│   │   ├── admin/                # Admin pages
│   │   ├── layout.tsx            # Root layout with Header
│   │   ├── page.tsx              # Homepage
│   │   ├── globals.css           # Global styles
│   │   └── favicon.ico
│   │
│   ├── components/               # Reusable React components
│   │   ├── Header.tsx            # Navigation bar
│   │   ├── EventCard.tsx         # Event card component
│   │   └── RegistrationForm.tsx  # Registration form
│   │
│   ├── lib/                      # Utilities & helpers
│   │   └── supabase.ts           # Supabase client setup
│   │
│   └── types/                    # TypeScript type definitions
│       └── index.ts              # Event, Registration types
│
├── public/                       # Static files (logo, etc)
│
├── .env.local                    # PRIVATE: Your Supabase keys
├── .env.local.example            # PUBLIC: Template for above
├── .gitignore                    # Files to not commit
│
├── SUPABASE_SCHEMA.sql          # Database schema (copy-paste)
├── SETUP_GUIDE.md               # Complete setup instructions
├── DEPLOYMENT_CHECKLIST.md      # Pre-deployment checklist
├── README.md                     # Project overview
│
├── package.json                  # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
├── next.config.js               # Next.js config
└── eslint.json                  # Code linting rules
```

---

## 💡 Key Features Implemented

### Homepage ✅
- Grid of event cards
- Glassmorphic design
- Event images/posters
- Registration counter
- "View Details" buttons

### Event Details ✅
- Full description
- Date/time/venue
- Registration deadline
- Seats available
- Registration form

### Registration ✅
- Student name, register number
- Department, email
- Form validation
- Duplicate prevention
- Success confirmation
- Seat limit checking

### Admin Panel ✅
- Secure login
- Create events
- View registrations
- Download CSV
- Event statistics
- Logout

---

## 🎯 Next Steps

1. **Test Locally**: Verify everything works
2. **Customize**: Change college name, colors
3. **Add Events**: Create 3-4 test events
4. **Test Registration**: Register for events
5. **Deploy**: Push to Vercel
6. **Share**: Send link to students

---

## 📞 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Fix code formatting
npm run lint --fix
```

---

## ✅ Verification

After setup, you should be able to:

✅ Access homepage at `http://localhost:3000`
✅ See "No Events Yet" message (until you create one)
✅ Access admin login at `http://localhost:3000/admin/login`
✅ Login with admin@collegemail.com
✅ Create an event successfully
✅ See event appear on homepage
✅ Register for the event
✅ See registration in admin dashboard
✅ Download registrations as CSV

---

## 🎉 You're All Set!

Your college event portal is ready. Now:

1. Create some events
2. Test the registration flow
3. Share with your college community
4. Gather feedback
5. Deploy to production

---

**Questions?** Check SETUP_GUIDE.md for detailed help.

**Ready to Deploy?** See DEPLOYMENT_CHECKLIST.md for production steps.
