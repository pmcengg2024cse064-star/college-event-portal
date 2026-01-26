-- Supabase PostgreSQL Schema for College Event Portal
-- Copy and paste this into the SQL editor in your Supabase project

-- Create Events Table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  poster_url TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  venue VARCHAR(255) NOT NULL,
  registration_deadline DATE NOT NULL,
  max_registrations INTEGER NOT NULL DEFAULT 100,
  current_registrations INTEGER NOT NULL DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Registrations Table
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  register_number VARCHAR(50) NOT NULL,
  department VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, email)
);

-- Create Admin Users Table (optional, for future role-based access)
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);

-- Create Updated At Trigger for Events
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at_trigger
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_events_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Events (Public Read, Admin Write)
CREATE POLICY events_public_read ON events
  FOR SELECT
  USING (true);

CREATE POLICY events_admin_write ON events
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY events_admin_update ON events
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Create RLS Policies for Registrations
CREATE POLICY registrations_insert ON registrations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY registrations_select ON registrations
  FOR SELECT
  USING (
    -- Allow reading own registrations or if user is event creator
    auth.uid() = (SELECT created_by FROM events WHERE id = event_id) OR
    auth.uid() IS NOT NULL
  );

-- Create RLS Policies for Admin Users
CREATE POLICY admin_users_select ON admin_users
  FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY admin_users_insert ON admin_users
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Insert Demo Admin User (replace with your email)
-- Note: You need to first create the user in Auth
-- INSERT INTO admin_users (user_id, email, role)
-- VALUES ('[USER_ID]', 'admin@collegemail.com', 'admin');

-- Create Storage Bucket for Event Posters
-- Note: Run this in the Supabase SQL editor with appropriate storage setup
-- You can also set this up manually through the Supabase UI:
-- 1. Go to Storage in Supabase
-- 2. Create a new bucket named 'event-posters'
-- 3. Make it public for reading
-- 4. Set up policies for authenticated users to upload

-- Create View for Event Statistics (Optional)
CREATE OR REPLACE VIEW event_statistics AS
SELECT 
  e.id,
  e.title,
  e.date,
  COUNT(r.id) as total_registrations,
  e.max_registrations,
  (e.max_registrations - COUNT(r.id)) as available_seats,
  ROUND((COUNT(r.id)::float / e.max_registrations * 100)::numeric, 2) as fill_percentage
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id, e.title, e.date, e.max_registrations;

-- Grant Permissions (if needed)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.events TO anon, authenticated;
GRANT SELECT ON public.registrations TO authenticated;
GRANT INSERT ON public.registrations TO anon;
GRANT SELECT ON public.event_statistics TO anon, authenticated;
