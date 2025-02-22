import { Camera, Video, FileText, Gift, Trophy, Users } from 'lucide-react';

const categories = [
  {
    id: 'photos',
    name: 'Photo Memories',
    icon: Camera,
    color: 'bg-blue-500',
    count: 1243
  },
  {
    id: 'videos',
    name: 'Video Stories',
    icon: Video,
    color: 'bg-purple-500',
    count: 856
  },
  {
    id: 'messages',
    name: 'Time Letters',
    icon: FileText,
    color: 'bg-green-500',
    count: 2154
  },
  {
    id: 'surprises',
    name: 'Surprises',
    icon: Gift,
    color: 'bg-pink-500',
    count: 432
  },
  {
    id: 'challenges',
    name: 'Challenges',
    icon: Trophy,
    color: 'bg-orange-500',
    count: 765
  },
  {
    id: 'community',
    name: 'Community',
    icon: Users,
    color: 'bg-indigo-500',
    count: 987
  }
];

export function Categories() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center hover:transform hover:scale-105 transition-all"
            >
              <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count.toLocaleString()} capsules</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}