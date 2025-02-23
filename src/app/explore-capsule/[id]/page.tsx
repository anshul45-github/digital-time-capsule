import { useState } from 'react';
import { ArrowLeft, Calendar, Lock, Users, MessageSquare, Share2, Heart } from 'lucide-react';
import { Capsule } from '@prisma/client';

interface CapsuleDetailsProps {
  capsule: Capsule;
  onBack: () => void;
}

export default function CapsuleDetails({ capsule, onBack }: CapsuleDetailsProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-6 hover:text-purple-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Explore
        </button>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-80">
            <img
              src={capsule.mediaUrl}
              alt={capsule.caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <div className="bg-purple-600 px-3 py-1 rounded-full text-white text-sm font-medium">
                {capsule.tags.charAt(0).toUpperCase() + capsule.tags.slice(1)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">{capsule.caption}</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Unlocks {new Date(capsule.finalUnlockDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {capsule.allowedUsers} participants
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                <span className="font-medium text-purple-600">{capsule.openThreshold} APT</span>
              </span>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-semibold mb-4">About this Time Capsule</h2>
              <p className="text-gray-600">{capsule.caption}</p>
            </div>

            <div className="mb-8">
              <h3 className="font-medium mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {capsule.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Comments</h2>
                <span className="text-sm text-gray-500">12 comments</span>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}