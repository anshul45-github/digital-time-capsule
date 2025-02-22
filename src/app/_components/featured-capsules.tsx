import { Lock, Clock, Users, Trophy } from 'lucide-react';

interface Capsule {
  id: string;
  title: string;
  description: string;
  image: string;
  unlockDate: string;
  participants: number;
  aptReward: number;
  category: 'memory' | 'milestone' | 'community' | 'challenge';
}

const featuredCapsules: Capsule[] = [
  {
    id: '1',
    title: 'Class of 2024 Memories',
    description: 'Our journey through college, locked until graduation day',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    unlockDate: '2024-06-15',
    participants: 248,
    aptReward: 500,
    category: 'milestone'
  },
  {
    id: '2',
    title: 'Summer Festival 2024',
    description: 'Capturing the magic of our community festival',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
    unlockDate: '2024-09-01',
    participants: 156,
    aptReward: 300,
    category: 'community'
  },
  {
    id: '3',
    title: 'Tech Predictions 2025',
    description: 'Our community predictions for next year\'s tech trends',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    unlockDate: '2025-01-01',
    participants: 423,
    aptReward: 1000,
    category: 'challenge'
  }
];

const categoryColors = {
  memory: 'bg-blue-500',
  milestone: 'bg-purple-500',
  community: 'bg-green-500',
  challenge: 'bg-orange-500'
};

export function FeaturedCapsules() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Featured Time Capsules</h2>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-300" />
          <span className="text-white/80">Most Popular</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCapsules.map((capsule) => (
          <div
            key={capsule.id}
            className="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden transition-transform hover:transform hover:scale-[1.02]"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={capsule.image}
                alt={capsule.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <div className={`${categoryColors[capsule.category]} px-3 py-1 rounded-full text-white text-sm font-medium`}>
                  {capsule.category.charAt(0).toUpperCase() + capsule.category.slice(1)}
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{capsule.title}</h3>
              <p className="text-gray-600 mb-4">{capsule.description}</p>

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
                  <Clock className="w-4 h-4" />
                  {new Date(capsule.unlockDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}