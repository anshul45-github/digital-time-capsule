"use client";

import { useEffect, useState } from 'react';
import { User, Medal, Clock, Settings, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
interface ProfileFormData {
  displayName: string | null;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);

  const [user, setUser] = useState<typeof User>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        console.log('Profile:', response.data.user);
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [])

  const userStats = {
    capsules: 24,
    apt: 1250,
    badge: 'Time Traveller',
    joinDate: 'March 2024'
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user ? user.name : '',
    }
  });

  const router = useRouter();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsUpdating(true);
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(data);
      
      await axios.patch('/api/profile', data);
      console.log('Profile updated:', data);
      
      toast.success('Profile updated successfully! Refresh to see changes!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
      router.refresh();
    }
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if(!isMounted) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        {/* Profile Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <Medal className="w-4 h-4 text-yellow-500" />
                  {userStats.badge}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Joined {userStats.joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600'
                    : 'bg-white/10 text-black hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Edit details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                      </label>
                      <input
                        id="displayName"
                        type="text"
                        {...register('displayName', {
                          required: 'Display name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                          }
                        })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.displayName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.displayName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.displayName.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!isDirty || isUpdating}
                    className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                      !isDirty
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-black hover:bg-purple-700'
                    }`}
                  >
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isUpdating ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>

              <div>
                <h2 className="text-xl font-semibold mb-4">Stats</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {userStats.capsules}
                    </div>
                    <div className="text-sm text-gray-600">Time Capsules</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {userStats.apt} APT
                    </div>
                    <div className="text-sm text-gray-600">Balance</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {userStats.badge}
                    </div>
                    <div className="text-sm text-gray-600">Current Badge</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-purple-600" />
                    <span>Email notifications for capsule unlocks</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-purple-600" />
                    <span>Show my profile to other users</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-purple-600" />
                    <span>Allow others to tag me in capsules</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}