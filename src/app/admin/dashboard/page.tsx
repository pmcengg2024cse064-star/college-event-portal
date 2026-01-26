"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    max_registrations: 100,
  });

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      fetchEvents();
    };
    checkAuth();
  }, [router]);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (fetchError) throw fetchError;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // Fetch registrations for selected event
  useEffect(() => {
    if (selectedEventId) {
      fetchRegistrations(selectedEventId);
    }
  }, [selectedEventId]);

  const fetchRegistrations = async (eventId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("registrations")
        .select("*")
        .eq("event_id", eventId);

      if (fetchError) throw fetchError;
      setRegistrations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch registrations");
    }
  };

  // Upload poster
  const uploadPoster = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("event-posters")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("event-posters")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to upload poster");
    }
  };

  // Create event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      let posterUrl = "";
      if (posterFile) {
        posterUrl = await uploadPoster(posterFile);
      }

      const [dateStr, timeStr] = formData.date.split("T");

      const { error: createError } = await supabase.from("events").insert([
        {
          title: formData.title,
          short_description: formData.short_description,
          description: formData.description,
          date: dateStr,
          time: timeStr,
          venue: formData.venue,
          max_registrations: formData.max_registrations,
          poster_url: posterUrl,
          created_by: "00000000-0000-0000-0000-000000000000",
          registration_deadline: dateStr,
        },
      ]);

      if (createError) throw createError;

      setFormData({
        title: "",
        short_description: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        max_registrations: 100,
      });
      setPosterFile(null);
      setShowCreateForm(false);
      fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setUploading(false);
    }
  };

  // Start editing event
  const handleEditClick = (event: any) => {
    setEditingEventId(event.id);
    const dateTime = `${event.date}T${event.time}`;
    setFormData({
      title: event.title,
      short_description: event.short_description || "",
      description: event.description,
      date: dateTime,
      time: event.time || "",
      venue: event.venue || "",
      max_registrations: event.max_registrations || 100,
    });
    setShowEditForm(true);
    setPosterFile(null);
  };

  // Update event
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      if (!editingEventId) throw new Error("No event selected for editing");

      const [dateStr, timeStr] = formData.date.split("T");

      let updateData: any = {
        title: formData.title,
        short_description: formData.short_description,
        description: formData.description,
        date: dateStr,
        time: timeStr,
        venue: formData.venue,
        max_registrations: formData.max_registrations,
        registration_deadline: dateStr,
      };

      if (posterFile) {
        const posterUrl = await uploadPoster(posterFile);
        updateData.poster_url = posterUrl;
      }

      const { error: updateError } = await supabase
        .from("events")
        .update(updateData)
        .eq("id", editingEventId);

      if (updateError) throw updateError;

      setFormData({
        title: "",
        short_description: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        max_registrations: 100,
      });
      setPosterFile(null);
      setShowEditForm(false);
      setEditingEventId(null);
      fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    } finally {
      setUploading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setError("");
    setUploading(true);

    try {
      const { error: deleteError } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (deleteError) throw deleteError;

      if (selectedEventId === eventId) {
        setSelectedEventId("");
      }
      fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    } finally {
      setUploading(false);
    }
  };

  // Export registrations as CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("No registrations to export");
      return;
    }

    const headers = ["Name", "Roll Number", "Department", "Email", "Registered At"];
    const rows = registrations.map((reg) => [
      reg.student_name,
      reg.register_number,
      reg.department,
      reg.email,
      new Date(reg.created_at).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${selectedEventId}.csv`;
    a.click();
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center text-3xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/60">Manage college events and registrations</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Create Event Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setShowEditForm(false);
              setEditingEventId(null);
              setFormData({
                title: "",
                short_description: "",
                description: "",
                date: "",
                time: "",
                venue: "",
                max_registrations: 100,
              });
            }}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
          >
            {showCreateForm ? "Cancel" : "Create New Event"}
          </button>
        </div>

        {/* Create Event Form */}
        {showCreateForm && !showEditForm && (
          <form
            onSubmit={handleCreateEvent}
            className="mb-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                  placeholder="e.g., Tech Fest 2026"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                  placeholder="Brief description..."
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white focus:border-orange-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                  placeholder="e.g., Main Auditorium"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Max Registrations *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.max_registrations}
                  onChange={(e) =>
                    setFormData({ ...formData, max_registrations: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Poster Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700"
                />
                {posterFile && (
                  <p className="text-white/60 text-sm mt-2">Selected: {posterFile.name}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Full Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                  placeholder="Full event description..."
                  rows={4}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {uploading ? "Creating Event..." : "Create Event"}
            </button>
          </form>
        )}

        {/* Edit Event Form */}
        {showEditForm && editingEventId && (
          <form
            onSubmit={handleUpdateEvent}
            className="mb-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 space-y-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Edit Event</h3>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingEventId(null);
                }}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white focus:border-orange-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Max Registrations *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.max_registrations}
                  onChange={(e) =>
                    setFormData({ ...formData, max_registrations: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white focus:border-orange-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Poster Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700"
                />
                {posterFile && (
                  <p className="text-white/60 text-sm mt-2">Selected: {posterFile.name}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Full Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {uploading ? "Updating..." : "Update Event"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingEventId(null);
                }}
                className="flex-1 py-3 px-4 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Events Column */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Events ({events.length})</h2>
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-white/60 text-center py-8">No events created yet</div>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedEventId === event.id
                        ? "bg-orange-500/20 border-orange-500"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedEventId(event.id)}
                      className="w-full text-left"
                    >
                      <h3 className="text-white font-semibold mb-2">{event.title}</h3>
                      <p className="text-white/60 text-sm mb-2">{event.venue}</p>
                      <p className="text-white/50 text-xs">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </p>
                    </button>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                      <button
                        onClick={() => handleEditClick(event)}
                        disabled={uploading}
                        className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        disabled={uploading}
                        className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-colors disabled:opacity-50 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Registrations Column */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Registrations ({registrations.length})
              </h2>
              {selectedEventId && registrations.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-semibold"
                >
                  Export CSV
                </button>
              )}
            </div>

            {!selectedEventId ? (
              <div className="text-white/60 text-center py-8">Select an event to view registrations</div>
            ) : registrations.length === 0 ? (
              <div className="text-white/60 text-center py-8">No registrations yet</div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-white/10 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-white font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-white font-semibold">Roll No</th>
                      <th className="px-4 py-3 text-left text-white font-semibold">Department</th>
                      <th className="px-4 py-3 text-left text-white font-semibold">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white">{reg.student_name}</td>
                        <td className="px-4 py-3 text-white/80">{reg.register_number}</td>
                        <td className="px-4 py-3 text-white/80">{reg.department}</td>
                        <td className="px-4 py-3 text-white/80 text-xs">{reg.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
