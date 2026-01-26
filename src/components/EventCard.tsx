'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const currentRegs = event.current_registrations || 0;
  const maxRegs = event.max_registrations || 0;
  const registrationFull = maxRegs > 0 && currentRegs >= maxRegs;

  return (
    <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20">
      {/* Poster Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-violet-500/20 to-pink-500/20">
        {event.poster_url ? (
          <Image
            src={event.poster_url}
            alt={event.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-600 to-pink-600">
            <span className="text-white/50 text-sm">Event Poster</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Date Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600">
            <span className="text-white text-sm font-bold">
              {eventDate.getDate()}
            </span>
          </div>
          <div>
            <p className="text-white/90 text-xs font-semibold">
              {eventDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
            <p className="text-white/60 text-xs">{event.time}</p>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {event.short_description}
        </p>

        {/* Registration Status */}
        {maxRegs > 0 && (
          <div className="mb-4 pb-4 border-b border-white/10">
            <div className="flex justify-between items-center text-xs text-white/60 mb-2">
              <span>Seats Available</span>
              <span className={registrationFull ? 'text-red-400' : 'text-green-400'}>
                {maxRegs - currentRegs} / {maxRegs}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: maxRegs > 0 ? `${(currentRegs / maxRegs) * 100}%` : '0%',
                }}
              />
            </div>
          </div>
        )}

        {/* Button */}
        <Link
          href={`/events/${event.id}`}
          className={`block w-full py-2 px-4 rounded-lg font-semibold text-center transition-all duration-300 ${
            registrationFull
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105'
          }`}
        >
          {registrationFull ? 'Registration Full' : 'View & Register'}
        </Link>
      </div>
    </div>
  );
}
