"use client";

import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Calendar, Lock, Users, Trophy, X, Plus, Globe, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Form } from '~/components/ui/form';
import { CreateCommunityModal } from '../_components/create-community-modal';

interface Capsule {
  id: string;
  title: string;
  description: string;
  image: string;
  unlockDate: string;
  participants: number;
  aptReward: number;
  category: string;
  creator: string;
  tags: string[];
}

const sampleCapsules: Capsule[] = [
  {
    id: '1',
    title: 'Wedding Time Capsule',
    description: 'Messages and photos from our special day',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    unlockDate: '2025-06-15',
    participants: 156,
    aptReward: 300,
    category: 'milestone',
    creator: 'Sarah & James',
    tags: ['wedding', 'love', 'celebration']
  },
  {
    id: '2',
    title: 'Startup Journey 2024',
    description: 'Documenting our first year building the next big thing',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    unlockDate: '2025-01-01',
    participants: 42,
    aptReward: 500,
    category: 'challenge',
    creator: 'TechFounders',
    tags: ['startup', 'business', 'journey']
  },
  {
    id: '3',
    title: 'World Cup Predictions',
    description: 'Our community predictions for the tournament',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800',
    unlockDate: '2024-12-18',
    participants: 1243,
    aptReward: 1000,
    category: 'community',
    creator: 'SportsHub',
    tags: ['sports', 'football', 'predictions']
  }
];

const myCommunities = [
  {
    id: '1',
    name: 'Tech Enthusiasts',
    description: 'A community for tech lovers and innovators',
    members: 1234,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    capsules: 45
  },
  {
    id: '2',
    name: 'Travel Memories',
    description: 'Share your adventures and travel stories',
    members: 856,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
    capsules: 89
  }
];

const filters = {
  categories: ['All', 'Photos', 'Videos', 'Messages', 'Milestones', 'Community', 'Challenges'],
  timeframes: ['Any time', 'This month', 'This year', '2025', '2026+'],
  rewards: ['Any reward', '100+ APT', '500+ APT', '1000+ APT'],
  sorting: ['Recent', 'Popular', 'Highest reward', 'Soonest unlock']
};

export default function Explore() {
  const [isMounted, setIsMounted] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'public' | 'communities'>('public');
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'All',
    timeframe: 'Any time',
    reward: 'Any reward',
    sort: 'Recent'
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    privacy: 'public',
    tags: ''
  });

  const addFilter = (type: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [type]: value }));
    if (value !== 'All' && value !== 'Any time' && value !== 'Any reward') {
      setActiveFilters(prev => [...new Set([...prev, value])]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    console.log()
    setShowCreateCommunity(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if(!isMounted)
    return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">Explore Time Capsules</h1>
        <button
          onClick={() => setShowCreateCommunity(true)}
          className="bg-white px-4 py-2 rounded-lg flex items-center gap-2 text-purple-600 hover:bg-purple-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Community
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('public')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'public'
              ? 'bg-white text-purple-600'
              : 'bg-white/10 text-black hover:bg-white/20'
          }`}
        >
          <Globe className="w-4 h-4" />
          Public Capsules
        </button>
        <button
          onClick={() => setActiveTab('communities')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'communities'
              ? 'bg-white text-purple-600'
              : 'bg-white/10 text-black hover:bg-white/20'
          }`}
        >
          <Users className="w-4 h-4" />
          My Communities
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={activeTab === 'public' ? "Search time capsules..." : "Search communities..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/90 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          {activeTab === 'public' && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                showFilters ? 'bg-white text-purple-600' : 'bg-white/10 text-black hover:bg-white/20'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          )}
        </div>

        {activeTab === 'public' && activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {filter}
                <button
                  onClick={() => removeFilter(filter)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {activeTab === 'public' && showFilters && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {filters.categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => addFilter('category', category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedFilters.category === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Unlock Timeframe</h3>
              <div className="flex flex-wrap gap-2">
                {filters.timeframes.map((timeframe, index) => (
                  <button
                    key={index}
                    onClick={() => addFilter('timeframe', timeframe)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedFilters.timeframe === timeframe
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">APT Rewards</h3>
              <div className="flex flex-wrap gap-2">
                {filters.rewards.map((reward, index) => (
                  <button
                    key={index}
                    onClick={() => addFilter('reward', reward)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedFilters.reward === reward
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {reward}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                {filters.sorting.map((sort, index) => (
                  <button
                    key={index}
                    onClick={() => addFilter('sort', sort)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedFilters.sort === sort
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'public' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleCapsules.map((capsule, index) => (
            <Link href={`/explore-capsule/${capsule.id}`} key={capsule.id}>
              <div
                className="group hover:shadow-sm border h-full bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden transition-transform hover:transform hover:scale-[1.02]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={capsule.image}
                    alt={capsule.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-purple-600 px-3 py-1 rounded-full text-white text-sm font-medium">
                      {capsule.category.charAt(0).toUpperCase() + capsule.category.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl group-hover:text-sky-700 transition font-semibold">{capsule.title}</h3>
                    <span className="text-sm text-gray-500">{capsule.creator}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{capsule.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {capsule.tags.map((tag: any, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Lock className="w-4 h-4" />
                        <span className="font-medium text-purple-600">{capsule.aptReward} APT</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {capsule.participants}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(capsule.unlockDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCommunities.map((community, index) => (
            <div
              key={community.id}
              className="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden transition-transform hover:transform hover:scale-[1.02]"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{community.name}</h3>
                <p className="text-gray-600 mb-4">{community.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {community.members} members
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    {community.capsules} capsules
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Community Modal */}
      {showCreateCommunity && (
        <CreateCommunityModal setIsOpen={setShowCreateCommunity} close={() => setShowCreateCommunity(false)} />
      )}
    </div>
  );
}