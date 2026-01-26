# Deployment Checklist for College Event Portal

## Pre-Deployment Verification

### Local Testing (Development)
- [ ] `npm run dev` starts without errors
- [ ] Homepage loads and displays correctly
- [ ] Event cards render with glassmorphic styling
- [ ] Navigation menu works on desktop and mobile
- [ ] Admin login page is accessible at `/admin/login`

### Supabase Configuration
- [ ] Supabase project created
- [ ] Project URL copied to `.env.local`
- [ ] Anon key copied to `.env.local`
- [ ] Service role key copied to `.env.local`
- [ ] SQL schema executed successfully
- [ ] All tables created (events, registrations, admin_users)
- [ ] Storage bucket `event-posters` created and set to public
- [ ] Auth user created for admin account
- [ ] Admin user added to `admin_users` table

### Database Verification
- [ ] Can query events table
- [ ] Can insert test event
- [ ] Can insert test registration
- [ ] RLS policies are enabled
- [ ] Indexes created for performance
- [ ] Views (if any) working correctly

### Environment Variables
- [ ] `.env.local` file exists and is NOT in version control
- [ ] All required variables are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_ADMIN_EMAIL`
  - `NEXT_PUBLIC_ADMIN_PASSWORD`
  - `NEXT_PUBLIC_COLLEGE_NAME`

### Feature Testing

#### Homepage
- [ ] Events load from database
- [ ] Event cards display correctly
- [ ] Event image placeholder appears if no image
- [ ] Registration counter shows correctly
- [ ] "View & Register" button works
- [ ] Responsive on mobile (320px), tablet (768px), desktop (1200px)

#### Event Details Page
- [ ] Event details load correctly
- [ ] Full description displays
- [ ] Event date/time/venue shown
- [ ] Poster image displays properly
- [ ] Registration status shows
- [ ] "View Details" button works from homepage

#### Registration
- [ ] Form displays all fields (name, reg #, department, email)
- [ ] Form validation works (required fields)
- [ ] Submitting form saves to Supabase
- [ ] Success message appears after registration
- [ ] Duplicate registrations are prevented
- [ ] Seats available counter decreases
- [ ] Registration deadline blocking works

#### Admin Panel
- [ ] Login page loads at `/admin/login`
- [ ] Can sign in with correct credentials
- [ ] Incorrect credentials show error
- [ ] Dashboard loads after login
- [ ] Event list displays all events
- [ ] Can create new event successfully
- [ ] Event appears immediately on homepage
- [ ] Can view registrations for event
- [ ] CSV download works and contains correct data
- [ ] Logout button works and redirects to home

### Performance & Security
- [ ] No console errors in browser DevTools
- [ ] No sensitive data in `.env.local` committed to git
- [ ] RLS policies prevent unauthorized access
- [ ] Images load quickly (use DevTools Network tab)
- [ ] Database queries are optimized (check logs)
- [ ] No CORS errors in console

## Deployment to Vercel

### GitHub Setup
- [ ] Repository initialized with `git init`
- [ ] All files committed except `.env.local` and `node_modules`
- [ ] `.gitignore` is present and configured
- [ ] Repository pushed to GitHub
- [ ] Repository is public or has Vercel access

### Vercel Configuration
- [ ] Created account on vercel.com
- [ ] Imported project from GitHub
- [ ] Project name is appropriate
- [ ] Framework auto-detected as Next.js
- [ ] Environment variables added in Vercel dashboard:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_ADMIN_EMAIL`
  - [ ] `NEXT_PUBLIC_ADMIN_PASSWORD`
  - [ ] `NEXT_PUBLIC_COLLEGE_NAME`
  - [ ] `NEXT_PUBLIC_APP_URL` (Vercel URL)

### Deployment Execution
- [ ] Initial deployment completed
- [ ] Build logs show no errors
- [ ] Deployment status shows "Ready"
- [ ] Vercel URL is accessible
- [ ] Site loads without 404 errors

## Post-Deployment Testing

### Vercel Site Testing
- [ ] Homepage loads on Vercel URL
- [ ] Events display correctly
- [ ] Images load properly
- [ ] Navigation works
- [ ] Mobile responsiveness maintained

### Database Connection
- [ ] Can fetch events from Vercel site
- [ ] Can register for events
- [ ] Registrations save to Supabase
- [ ] Admin login works on Vercel
- [ ] Can create events from Vercel admin panel

### Authentication
- [ ] Supabase auth session persists
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] No CORS errors in browser console

## Supabase Production Configuration

### Auth Settings
- [ ] Redirect URLs updated in Supabase Auth:
  - Add: `https://your-vercel-url.com`
  - Add: `https://your-vercel-url.com/admin/dashboard`
  - Add: `https://your-vercel-url.com/auth/callback`
- [ ] SMTP configured for email notifications (if using)
- [ ] Password policy set appropriately

### Database
- [ ] Backup scheduled in Supabase dashboard
- [ ] Database logs accessible
- [ ] Query performance reviewed
- [ ] RLS policies double-checked

### Storage
- [ ] Bucket permissions verified
- [ ] Public access enabled for event-posters
- [ ] File size limits configured (if needed)
- [ ] Storage usage monitored

## Custom Domain (Optional)

- [ ] Domain registered
- [ ] Domain added to Vercel project
- [ ] DNS records updated
- [ ] SSL certificate auto-issued by Vercel
- [ ] HTTPS working on custom domain
- [ ] Supabase redirect URLs updated to custom domain

## Monitoring & Maintenance

- [ ] Set up Vercel deployment notifications
- [ ] Configure error tracking (Sentry, LogRocket, etc.)
- [ ] Set up database backups (Supabase automatic backups)
- [ ] Monitor storage usage
- [ ] Review logs weekly for errors
- [ ] Update dependencies monthly

## Security Checklist

- [ ] No API keys exposed in code
- [ ] `.env.local` not committed
- [ ] RLS policies enabled on all tables
- [ ] Service role key only in backend (Vercel env)
- [ ] Anon key used for client-side operations
- [ ] CORS configured in Supabase
- [ ] Rate limiting enabled if needed
- [ ] SSL/HTTPS enforced

## Documentation

- [ ] README.md updated with live URL
- [ ] SETUP_GUIDE.md reviewed for accuracy
- [ ] Deployment steps documented
- [ ] Admin credentials changed from defaults
- [ ] Support contact info added to README
- [ ] License file included

## Final Verification

Before announcing to users:

- [ ] All team members tested deployment
- [ ] No known bugs or issues
- [ ] Performance acceptable (Vercel Analytics)
- [ ] Mobile experience verified on multiple devices
- [ ] Admin workflow tested end-to-end
- [ ] Student registration workflow tested
- [ ] CSV export functionality working
- [ ] Email looks correct (if applicable)
- [ ] Help/support documentation ready
- [ ] Rollback plan in place

## Launch!

- [ ] Email announcement sent to college
- [ ] QR code with URL printed/shared
- [ ] Social media posts published
- [ ] Student support ready for questions
- [ ] Monitor for errors in first 24 hours
- [ ] Gather feedback from users

---

## Rollback Plan

If critical issues found:
1. Stop promoting the link
2. Document the issue
3. Fix in development branch
4. Test thoroughly
5. Re-deploy to Vercel
6. Verify fix
7. Announce resolution

## Support Contacts

- **Technical Issues**: [Your email/support]
- **Bug Reports**: GitHub Issues
- **Feature Requests**: GitHub Discussions

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Version**: 1.0.0
