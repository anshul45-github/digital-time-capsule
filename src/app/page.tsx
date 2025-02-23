"use client";
import { useState } from 'react';
import { CreateCapsuleModal } from './_components/create-capsule-modal';
import { FeaturedCapsules } from './_components/featured-capsules';
import { Categories } from './_components/categories';
import { useCreateCapsuleModal } from '~/hooks/use-create-capsule-modal';
import { Button } from '~/components/ui/button';
import { CreateCapsuleForm } from './_components/create-capsule-form';
import { Plus, Search } from 'lucide-react';

const sampleCapsules = [
  {
    id: '1',
    title: 'Class of 2024 Memories',
    caption: 'Our journey through college, locked until graduation day',
    tags: ['college', 'graduation', 'memories'],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    unlockDate: '2024-06-15',
    participants: 248,
    aptReward: 500,
    category: 'milestone' as 'milestone'
  },
  {
    id: '2',
    title: 'Summer Festival 2024',
    caption: 'Capturing the magic of our community festival',
    tags: ['festival', 'summer', 'community'],
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
    unlockDate: '2024-09-01',
    participants: 156,
    aptReward: 300,
    category: 'community' as 'community'
  },
  {
    id: '3',
    title: 'Tech Predictions 2025',
    caption: 'Our community predictions for next year\'s tech trends',
    tags: ['tech', 'predictions', '2025'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    unlockDate: '2025-01-01',
    participants: 423,
    aptReward: 1000,
    category: 'challenge' as 'challenge'
  }
];

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { open } = useCreateCapsuleModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCapsules, setFilteredCapsules] = useState(sampleCapsules);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const filtered = sampleCapsules.filter(capsule =>
      capsule.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
      (capsule.title && capsule.title.toLowerCase().includes(lowerCaseQuery)) ||
      capsule.caption.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredCapsules(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
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

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search capsules by tags, titles, or captions..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 pl-12 bg-white/90 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {/* Featured Capsules */}
      <FeaturedCapsules capsules = {filteredCapsules}  />

      {/* Categories */}
      <Categories />
    </div>
  );
}