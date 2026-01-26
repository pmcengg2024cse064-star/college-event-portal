export type Event = {
  id: string;
  title: string;
  description: string;
  short_description: string;
  poster_url: string;
  date: string;
  time: string;
  venue: string;
  registration_deadline: string;
  max_registrations: number;
  current_registrations: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Registration = {
  id: string;
  event_id: string;
  student_name: string;
  register_number: string;
  department: string;
  email: string;
  created_at: string;
};

export type AdminUser = {
  id: string;
  email: string;
  created_at: string;
};
