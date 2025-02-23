"use client";
import { useEffect, useState } from 'react';
import { ArrowLeft, Users, Lock, Settings, Bell, BellOff, Share2, Plus } from 'lucide-react';
import axios from 'axios';
import { Community } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';

interface Props {
    params: {
        id: string;
    }
}

const CommunityDetails = () => {
    const params = useParams<{ id: string }>()
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [community, setCommunity] = useState<Community | null>(null);

    const Id = params.id;

    useEffect(() => {
      const fetchCommunityData = async () => {
        try {
          const response = await axios.get('/api/community/' + Id);
          setCommunity(response.data);
        } catch (error) {
          console.error('Error fetching community data:', error);
        }
      };

      fetchCommunityData();
    }, [Id]);

    const [activeTab, setActiveTab] = useState<'capsules' | 'members' | 'about'>('capsules');

  const sampleMembers = [
    { id: '1', name: 'Alice Cooper', role: 'Admin', joinDate: '2024-01-15' },
    { id: '2', name: 'Bob Wilson', role: 'Moderator', joinDate: '2024-02-01' },
    { id: '3', name: 'Carol Smith', role: 'Member', joinDate: '2024-02-15' },
    // Add more sample members as needed
  ];

  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <button
        onClick={() => router.push('/explore')}
        className="flex items-center gap-2 text-black mb-6 hover:text-purple-200 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Hero Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden mb-8">
        <div className="relative h-64">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-black mb-2">{community?.name}</h1>
            <div className="flex items-center gap-4 text-black/80">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {"X"} members
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                {"Y"} capsules
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              isSubscribed
                ? 'bg-purple-100 text-purple-600'
                : 'bg-purple-600 text-black hover:bg-purple-700'
            }`}
          >
            {isSubscribed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-black rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Capsule
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { id: 'capsules', label: 'Capsules' },
          { id: 'members', label: 'Members' },
          { id: 'about', label: 'About' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600'
                : 'bg-white/10 text-black hover:bg-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6">
        {activeTab === 'capsules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Community Capsules</h2>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                  <option>All Categories</option>
                  <option>Photos</option>
                  <option>Videos</option>
                  <option>Messages</option>
                </select>
                <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                  <option>Recent</option>
                  <option>Popular</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample capsule cards would go here */}
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                No capsules yet
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Community Members</h2>
              <input
                type="text"
                placeholder="Search members..."
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="divide-y">
              {sampleMembers.map(member => (
                <div key={member.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-gray-500">Joined {new Date(member.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    member.role === 'Admin' 
                      ? 'bg-purple-100 text-purple-600'
                      : member.role === 'Moderator'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">About {community.name}</h2>
            <p className="text-gray-600 mb-6">{community.description}</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Community Guidelines</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Be respectful and kind to other members</li>
                  <li>No spam or self-promotion</li>
                  <li>Keep discussions relevant to the community theme</li>
                  <li>Follow the platform's terms of service</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Contact Admins</h3>
                <p className="text-gray-600">
                  If you have any questions or concerns, please reach out to the community administrators.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityDetails;