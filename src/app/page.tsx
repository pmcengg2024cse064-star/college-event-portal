import { supabase } from "@/lib/supabase";
import EventCard from "@/components/EventCard";
import { Event } from "@/types";

export const dynamic = "force-dynamic";

async function getEvents(): Promise<Event[]> {
  try {
    // Skip fetching if Supabase URL not set (for build time)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return [];
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4 sm:mb-6 inline-block">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-orange-400/20 to-pink-600/20 border border-orange-500/30 text-orange-300 text-xs sm:text-sm font-semibold">
              Event Discovery Portal
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-3 sm:mb-4">
            Discover College Events
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            Register for departmental activities, workshops, and college-wide events.
            Stay connected with Er. Perumal Manimekalai College of Engineering
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white/80 text-sm sm:text-base">
              <span className="font-semibold">{events.length}</span> Upcoming Events
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="text-4xl sm:text-5xl mb-4"></div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                No Events Yet
              </h3>
              <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base">
                Check back soon for upcoming college events!
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
                <p className="text-xs sm:text-sm text-white/70">
                  If you'"'"'re an admin, <a href="/admin/login" className="text-orange-400 hover:text-orange-300">sign in here</a> to create events.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
