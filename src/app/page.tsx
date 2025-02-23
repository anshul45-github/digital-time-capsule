"use client";
import { useState } from 'react';
import { CreateCapsuleModal } from './_components/create-capsule-modal';
import { FeaturedCapsules } from './_components/featured-capsules';
import { Categories } from './_components/categories';
import { useCreateCapsuleModal } from '~/hooks/use-create-capsule-modal';
import { Button } from '~/components/ui/button';
import { CreateCapsuleForm } from './_components/create-capsule-form';
import { Plus } from 'lucide-react';

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { open } = useCreateCapsuleModal();

  return (

    <div className="container mx-auto px-4 py-8">
      TODO : Change capsule schema - Title = String,  CoverImgUrl = String
      <CreateCapsuleModal />
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-700 mb-4">
          Preserve Your Memories in Time
        </h1>
        <p className="text-xl text-neutral-700/80 mb-8">
          Create digital time capsules, share moments, and unlock them together.
        </p>
        <button
          onClick={open}
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
    </div>
  );
}