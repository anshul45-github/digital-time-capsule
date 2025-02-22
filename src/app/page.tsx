"use client";
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateCapsuleModal } from './_components/create-capsule-modal';
import { FeaturedCapsules } from './_components/featured-capsules';
import { Categories } from './_components/categories';
import { useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Preserve Your Memories in Time
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Create digital time capsules, share moments, and unlock them together.
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold text-purple-600 hover:bg-purple-50 transition-all transform hover:scale-105 mx-auto"
        >
          <Plus className="w-5 h-5" />
          Create Your Time Capsule
        </button>
      </div>

      {/* Featured Capsules */}
      <FeaturedCapsules />

      {/* Categories */}
      <Categories />

      {/* Create Modal */}
      {showCreateModal && <CreateCapsuleModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}