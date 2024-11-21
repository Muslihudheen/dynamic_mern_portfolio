import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Clock } from 'lucide-react';
import { locationAPI } from '../services/api';
import { getCurrentTime } from '../utils/time';

const LocationBadge = () => {
  const { data: location } = useQuery({
    queryKey: ['location'],
    queryFn: locationAPI.get,
    refetchInterval: 60000, // Refetch every minute to update time
  });

  if (!location) return null;

  return (
    <div className="sticky top-8 float-right mr-8 z-40 animate-fade-in">
      <div className="hidden lg:flex items-center gap-3 bg-dark-lighter/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl hover:border-accent/20 transition-all duration-300">
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Current Location:</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-medium text-white whitespace-nowrap">{location.city}</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="font-medium text-accent">{getCurrentTime()}</span>
          </div>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <span className="text-sm text-gray-400 whitespace-nowrap">
            {location.officeHours}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LocationBadge;