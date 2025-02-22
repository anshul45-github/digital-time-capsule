"use client";
import { useState } from 'react';
import { Clock, Lock, Unlock } from 'lucide-react';

export default function MyCapsules() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">My Time Capsules</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-8">
        {[
          { id: 'all', label: 'All Capsules' },
          { id: 'locked', label: 'Locked', icon: Lock },
          { id: 'unlocked', label: 'Unlocked', icon: Unlock },
          { id: 'scheduled', label: 'Scheduled', icon: Clock }
        ].map(option => (
          <button
            key={option.id}
            onClick={() => setFilter(option.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              filter === option.id
                ? 'bg-white text-purple-600'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {option.icon && <option.icon className="w-4 h-4" />}
            {option.label}
          </button>
        ))}
      </div>

      {/* Capsules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6">
          <p className="text-gray-500">Your time capsules will appear here...</p>
        </div>
      </div>
    </div>
  );
}