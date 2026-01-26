# College Event Portal - Setup & Deployment Guide

## 📋 Project Overview

A modern, production-ready event discovery and registration platform for Er. Perumal Manimekalai College of Engineering built with Next.js 14, React, Tailwind CSS, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)
- Git

### 1. Environment Setup

Copy the environment template and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_ADMIN_EMAIL=admin@collegemail.com
NEXT_PUBLIC_ADMIN_PASSWORD=change_this_password
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase Database

#### Step A: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the Project URL and Anon Key from project settings
4. Copy the Service Role Key from settings > API keys

#### Step B: Run SQL Schema
1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy all content from `SUPABASE_SCHEMA.sql` into the editor
4. Click "Run"

#### Step C: Setup Storage Bucket
1. Go to Storage in Supabase dashboard
2. Create a new bucket named `event-posters`
3. Make it public by unchecking "Private"
4. Click "Save"

#### Step D: Setup Authentication
1. Go to Auth > Users
2. Click "Invite user"
3. Enter admin email: `admin@collegemail.com`
4. Copy the Confirm User link and use it to set password

#### Step E: Add Admin User to Database
1. Go to SQL Editor
2. Run this query (replace with your actual user ID from Auth):
```sql
INSERT INTO admin_users (user_id, email, role)
VALUES ('[your_auth_user_id]', 'admin@collegemail.com', 'admin');
```

### 4. Test Locally

```bash
npm run dev
```

Visit:
- Home: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login
- Demo credentials: admin@collegemail.com / Admin@12345

### 5. Verify Setup

✅ Home page displays (should show "No Events Yet" if first time)
✅ Click "Admin" → Login page appears
✅ Sign in with admin credentials
✅ Create an event from dashboard
✅ Event appears on home page
✅ Register for event and check CSV download

---

## 📁 Project Structure

```
college-event-portal/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Admin login page
│   │   │   └── dashboard/
│   │   │       └── page.tsx          # Admin dashboard
│   │   ├── events/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Event details page
│   │   ├── api/                      # API routes (if needed)
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   ├── globals.css               # Global styles
│   │   └── favicon.ico
│   ├── components/
│   │   ├── Header.tsx                # Navigation header
│   │   ├── EventCard.tsx             # Event card component
│   │   └── RegistrationForm.tsx      # Registration form
│   ├── lib/
│   │   └── supabase.ts               # Supabase client config
│   └── types/
│       └── index.ts                  # TypeScript types
├── public/                            # Static assets
├── .env.local                         # Environment variables (create from .example)
├── .env.local.example                 # Environment template
├── SUPABASE_SCHEMA.sql               # Database schema
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── package.json
└── README.md
```

---

## 🎨 Design Features

### Glassmorphism UI
- Backdrop blur effects
- Transparent cards with soft borders
- Gradient accents
- Smooth transitions and hover effects

### Color Scheme
- **Primary**: Violet/Pink gradient (#7C3ACC to #EC48A0)
- **Accent**: Orange (#F27210)
- **Background**: Dark slate to violet gradient

### Responsive Design
- Mobile-first approach
- Tailwind CSS breakpoints (sm, md, lg, xl)
- Flexible grid layouts

---

## 🔐 Authentication & Authorization

### Admin Authentication
- Uses Supabase Auth (email/password)
- Session stored in browser
- Protected routes check auth status
- Automatic redirect to login if not authenticated

### Database Security
- Row-Level Security (RLS) enabled
- Public read on events
- Authenticated users can register
- Only event creators can edit their events

---

## 📊 Database Schema

### Events Table
```
- id (UUID, Primary Key)
- title, short_description, description
- poster_url
- date, time, venue
- registration_deadline
- max_registrations, current_registrations
- created_by (User ID)
- created_at, updated_at
```

### Registrations Table
```
- id (UUID, Primary Key)
- event_id (Foreign Key)
- student_name, register_number, department, email
- created_at
- Unique constraint on (event_id, email)
```

### Admin Users Table
```
- id (UUID, Primary Key)
- user_id (Foreign Key to Auth)
- email, role
- created_at, updated_at
```

---

## 🚢 Deployment to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/college-event-portal.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_key
   NEXT_PUBLIC_ADMIN_EMAIL=admin@collegemail.com
   ```
5. Click "Deploy"

### Step 3: Update Supabase Settings
1. In Supabase dashboard, go to Auth > URL Configuration
2. Add your Vercel URL to Redirect URLs:
   ```
   https://your-project.vercel.app/auth/callback
   https://your-project.vercel.app/admin/dashboard
   ```

### Step 4: Update CORS Settings
1. Go to Settings > API Configuration
2. Add your Vercel URL to allowed URLs

### Step 5: Verify Deployment
- Visit your Vercel URL
- Test event creation and registration
- Verify CSV downloads work
- Check admin login/logout

---

## 📱 Features Checklist

### Homepage
- ✅ Display all upcoming events
- ✅ Responsive card grid (1-3 columns)
- ✅ Event poster images
- ✅ Registration counter
- ✅ "View Details" buttons
- ✅ Glassmorphic card design

### Event Details Page
- ✅ Full event description
- ✅ Large poster image
- ✅ Event meta (date, time, venue)
- ✅ Registration deadline
- ✅ Registration form
- ✅ Seats available counter

### Registration
- ✅ Form with fields (name, reg #, department, email)
- ✅ Validation
- ✅ Prevent duplicates (email + event)
- ✅ Success confirmation
- ✅ Seats limit check

### Admin Panel
- ✅ Secure login
- ✅ Create new events
- ✅ View registered students
- ✅ Download registrations as CSV
- ✅ Event statistics
- ✅ Logout functionality

---

## 🔧 Customization

### Change College Name
Edit `src/app/layout.tsx` and `src/components/Header.tsx`:
```tsx
NEXT_PUBLIC_COLLEGE_NAME="Your College Name"
```

### Change Colors
Edit `src/app/globals.css` for gradient backgrounds and `tailwind.config.ts` for theme colors.

### Add Custom Fields to Registration
1. Add column to `registrations` table in Supabase
2. Update `RegistrationForm.tsx` component
3. Update admin dashboard table display

### Upload Event Posters
1. After creating event, go to Storage > event-posters in Supabase
2. Upload image and copy public URL
3. Edit event in admin dashboard (feature can be added)

---

## 🐛 Troubleshooting

### "No events appearing"
- Check Supabase connection in `.env.local`
- Verify SQL schema was executed
- Check browser console for errors

### "Admin login not working"
- Verify auth user was created in Supabase Auth
- Check email/password is correct
- Clear browser cache and try again

### "Registrations not saving"
- Check RLS policies are enabled in Supabase
- Verify registrations table exists
- Check duplicate email prevention

### "Images not loading"
- Verify storage bucket exists and is public
- Check poster_url is a valid Supabase URL
- Try reuploading images

---

## 📚 Tech Stack Details

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Supabase**: PostgreSQL + Auth + Storage
- **React**: Component library
- **Vercel**: Deployment platform

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check Next.js documentation
4. Open an issue on GitHub

---

## ✅ Production Checklist

Before going live:

- [ ] All environment variables set in `.env.local`
- [ ] Supabase database schema executed
- [ ] Storage bucket created and configured
- [ ] Admin user created and assigned role
- [ ] Test event created and visible
- [ ] Registration flow tested end-to-end
- [ ] CSV export tested
- [ ] Mobile responsiveness verified
- [ ] Admin login/logout working
- [ ] Deployed to Vercel
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Analytics configured (if desired)
- [ ] Backup strategy in place

---

## 🎯 Next Steps

1. **Customize Content**: Update college name, colors, and branding
2. **Add Events**: Create events through admin dashboard
3. **Invite Users**: Share the portal URL with students
4. **Monitor Registrations**: Track attendance through CSV exports
5. **Gather Feedback**: Improve based on user feedback

---

**Last Updated**: January 2026
**Version**: 1.0.0
