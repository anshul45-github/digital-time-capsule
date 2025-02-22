"use client";
import React, { useState } from 'react';
import { Sparkles, Clock, Share2, Lock, Unlock, Camera, FileText, Video, Plus, Tag, Image, X, Calendar, Gift, Trophy, Users, Coins } from 'lucide-react';

function App() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [aptAmount, setAptAmount] = useState(50); // Default APT reward

  const suggestedTags = ['memories', 'graduation', 'wedding', 'birthday', 'travel', 'milestone'];
  const userApt = 1250; // Mock user APT balance
  const userBadge = 'Diamond'; // Mock user badge

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-black/90">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
          <h1 className="text-3xl font-bold text-white">TimeCapsule</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Coins className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-semibold">{userApt} APT</span>
            <div className="flex items-center gap-1 ml-2 bg-purple-700/30 px-2 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm">{userBadge}</span>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold text-purple-600 hover:bg-purple-50 transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create Capsule
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Capsules */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Featured Time Capsules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:transform hover:scale-105 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-600 font-semibold">Opens in 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-green-200">
                      <Gift className="w-4 h-4" />
                      <span>50 APT</span>
                    </button>
                    <Share2 className="w-5 h-5 text-gray-500 hover:text-purple-600" />
                  </div>
                </div>
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                    alt="Time Capsule Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm">A glimpse into our graduation celebration</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Graduation Memories</h3>
                <p className="text-gray-600 mb-4">A collection of our favorite moments from the Class of 2024.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Camera className="w-4 h-4" /> 12 Photos
                  </span>
                  <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Video className="w-4 h-4" /> 3 Videos
                  </span>
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Users className="w-4 h-4" /> 24 Contributors
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['graduation', 'memories', '2024'].map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Create by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Camera, title: 'Photo Memories', color: 'bg-green-400' },
              { icon: Video, title: 'Video Stories', color: 'bg-blue-400' },
              { icon: FileText, title: 'Written Tales', color: 'bg-yellow-400' },
              { icon: Clock, title: 'Future Messages', color: 'bg-red-400' },
            ].map(({ icon: Icon, title, color }) => (
              <div key={title} className={`${color} p-6 rounded-xl text-white hover:transform hover:scale-105 transition-all cursor-pointer`}>
                <Icon className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-bold">{title}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create New Time Capsule</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Your APT Balance: {userApt}
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Capsule Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              <div className="flex gap-4">
                <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Image className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-600">Drop your files here or click to upload</p>
                    <p className="text-sm text-gray-400 mt-1">Supports images, videos, and text files</p>
                  </div>
                </div>
              </div>

              <textarea
                placeholder="Add a caption to your time capsule..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unlock Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={unlockDate}
                      onChange={(e) => setUnlockDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Early Unlock APT Price</label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 w-5 h-5" />
                    <input
                      type="number"
                      value={aptAmount}
                      onChange={(e) => setAptAmount(parseInt(e.target.value))}
                      min="0"
                      step="10"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">APT required to unlock early</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map(tag => (
                    <span key={tag} className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-purple-800">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newTag.trim()) {
                        e.preventDefault();
                        handleAddTag(newTag.trim());
                      }
                    }}
                  />
                  <button
                    onClick={() => newTag.trim() && handleAddTag(newTag.trim())}
                    className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Suggested tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Create Capsule
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;