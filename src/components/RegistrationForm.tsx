'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';

interface RegistrationFormProps {
  event: Event;
}

export default function RegistrationForm({ event }: RegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    student_name: '',
    register_number: '',
    department: '',
    email: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if already registered
      const { data: existing } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', formData.email)
        .eq('event_id', event.id)
        .single();

      if (existing) {
        setError('You are already registered for this event!');
        setLoading(false);
        return;
      }

      // Check if event registration is full
      const { data: eventData } = await supabase
        .from('events')
        .select('current_registrations, max_registrations')
        .eq('id', event.id)
        .single();

      if (
        eventData &&
        eventData.current_registrations >= eventData.max_registrations
      ) {
        setError('Registration for this event is full!');
        setLoading(false);
        return;
      }

      // Insert registration
      const { error: insertError } = await supabase
        .from('registrations')
        .insert([
          {
            event_id: event.id,
            student_name: formData.student_name,
            register_number: formData.register_number,
            department: formData.department,
            email: formData.email,
          },
        ]);

      if (insertError) throw insertError;

      // Update event registration count
      if (eventData) {
        await supabase
          .from('events')
          .update({
            current_registrations: eventData.current_registrations + 1,
          })
          .eq('id', event.id);
      }

      setSubmitted(true);
      setFormData({
        student_name: '',
        register_number: '',
        department: '',
        email: '',
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during registration'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Registration Successful!
        </h3>
        <p className="text-white/70 mb-6">
          A confirmation email has been sent to <strong>{formData.email}</strong>
        </p>
        <p className="text-white/60 text-sm">
          We look forward to seeing you at {event.title}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 space-y-6"
    >
      <h3 className="text-2xl font-bold text-white mb-6">Register for Event</h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-white/90 text-sm font-medium mb-2">
          Full Name *
        </label>
        <input
          type="text"
          name="student_name"
          value={formData.student_name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className="block text-white/90 text-sm font-medium mb-2">
          Register Number / Roll Number *
        </label>
        <input
          type="text"
          name="register_number"
          value={formData.register_number}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
          placeholder="e.g., REG001"
        />
      </div>

      <div>
        <label className="block text-white/90 text-sm font-medium mb-2">
          Department *
        </label>
        <select
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
        >
          <option value="">Select your department</option>
          <option value="Computer Science">Computer Science & Engineering</option>
          <option value="Electronics">Electronics & Communication</option>
          <option value="Mechanical">Mechanical Engineering</option>
          <option value="Civil">Civil Engineering</option>
          <option value="Electrical">Electrical Engineering</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Biomedical">Biomedical Engineering</option>
        </select>
      </div>

      <div>
        <label className="block text-white/90 text-sm font-medium mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
          placeholder="Enter your email"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {loading ? 'Registering...' : 'Complete Registration'}
      </button>
    </form>
  );
}
