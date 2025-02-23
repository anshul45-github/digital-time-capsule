"use client";
import { useState } from 'react';
import { CreateCapsuleModal } from './_components/create-capsule-modal';
import { FeaturedCapsules } from './_components/featured-capsules';
import { Categories } from './_components/categories';
import { useCreateCapsuleModal } from '~/hooks/use-create-capsule-modal';
import { Button } from '~/components/ui/button';

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { open } = useCreateCapsuleModal();

  return (

    <div className="container mx-auto px-4 py-8">
      TODO : Change capsule schema - Title = String,  CoverImgUrl = String
      <Button onClick={open}>
        New Capsule
        </Button>
      <CreateCapsuleModal />
      {/* Hero Section */}

      {/* Featured Capsules */}
      <FeaturedCapsules />

      {/* Categories */}
      <Categories />

      {/* Create Modal */}
    </div>
  );
}