"use client";
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateCapsuleModal } from './_components/create-capsule-modal';
import { FeaturedCapsules } from './_components/featured-capsules';
import { Categories } from './_components/categories';
import { useEffect } from 'react';
import axios from 'axios';
import { CreateCapsuleForm } from './_components/create-capsule-form';

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      TODO : Change capsule schema - Title = String,  CoverImgUrl = String
      {/* Hero Section */}
      <div className="mb-12">

        <CreateCapsuleForm />
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