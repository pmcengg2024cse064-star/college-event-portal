"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  max_registrations: number;
  poster_url: string;
  time: string;
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registrationCount, setRegistrationCount] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    department: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (fetchError) throw fetchError;
        setEvent(data);

        // Get registration count
        const { data: regs, error: regError } = await supabase
          .from("registrations")
          .select("id")
          .eq("event_id", eventId);

        if (!regError && regs) {
          setRegistrationCount(regs.length);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError("");
    setRegistrationSuccess(false);
    setSubmitting(true);

    try {
      if (!event) throw new Error("Event not found");

      // Check if event is full
      if (registrationCount >= event.max_registrations) {
        throw new Error("This event has reached its registration limit");
      }

      // Check if already registered
      const { data: existing } = await supabase
        .from("registrations")
        .select("id")
        .eq("event_id", eventId)
        .eq("email", formData.email)
        .single();

      if (existing) {
        throw new Error("You are already registered for this event");
      }

      // Register
      const { error: registerError } = await supabase.from("registrations").insert([
        {
          event_id: eventId,
          student_name: formData.name,
          student_roll_no: formData.rollNo,
          department: formData.department,
          email: formData.email,
        },
      ]);

      if (registerError) throw registerError;

      setRegistrationSuccess(true);
      setFormData({ name: "", rollNo: "", department: "", email: "" });
      setRegistrationCount(registrationCount + 1);

      // Clear success message after 3 seconds
      setTimeout(() => setRegistrationSuccess(false), 3000);
    } catch (err) {
      setRegistrationError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-3xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!event || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Event Not Found</h1>
          <p className="text-white/60 mb-6">{error || "This event does not exist"}</p>
          <Link href="/" className="inline-block px-6 py-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const seatsAvailable = event.max_registrations - registrationCount;
  const isEventFull = seatsAvailable <= 0;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/" className="inline-block mb-8 text-orange-400 hover:text-orange-300 transition-colors">
          ← Back to Events
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Event Poster and Details */}
          <div className="md:col-span-2">
            {event.poster_url && (
              <div className="mb-8 rounded-2xl overflow-hidden h-96 bg-white/5 border border-white/10">
                <Image
                  src={event.poster_url}
                  alt={event.title}
                  width={600}
                  height={400}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm font-semibold mb-4">
                  {event.category}
                </span>
                <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
              </div>

              <div className="space-y-3 text-white/80">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="text-white font-semibold">{eventDate.toLocaleDateString()}</p>
                    <p className="text-sm">{eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <p className="text-white font-semibold">{event.venue}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">About this Event</h2>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div>
            <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 sticky top-8 space-y-6">
              {/* Seats Available */}
              <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-lg p-4">
                <p className="text-white/60 text-sm mb-1">Seats Available</p>
                <p className="text-3xl font-bold text-white">
                  {seatsAvailable}/{event.max_registrations}
                </p>
                <div className="mt-3 w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-pink-600 h-2 rounded-full transition-all"
                    style={{ width: `${(registrationCount / event.max_registrations) * 100}%` }}
                  />
                </div>
              </div>

              {isEventFull ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-center font-semibold">
                  Registration Full
                </div>
              ) : (
                <form onSubmit={handleRegistration} className="space-y-4">
                  {registrationSuccess && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
                      ✓ Registration successful!
                    </div>
                  )}

                  {registrationError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                      {registrationError}
                    </div>
                  )}

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Roll Number *</label>
                    <input
                      type="text"
                      name="rollNo"
                      required
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                      placeholder="e.g., 21BEC123"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Department *</label>
                    <select
                      name="department"
                      required
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white focus:border-orange-500/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '16px 12px',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option value="" className="bg-slate-900 text-white">Select Department</option>
                      <option value="CSE" className="bg-slate-900 text-white">Computer Science</option>
                      <option value="ECE" className="bg-slate-900 text-white">Electronics</option>
                      <option value="ME" className="bg-slate-900 text-white">Mechanical</option>
                      <option value="CE" className="bg-slate-900 text-white">Civil</option>
                      <option value="EE" className="bg-slate-900 text-white">Electrical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {submitting ? "Registering..." : "Register Now"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
