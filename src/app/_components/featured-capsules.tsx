import { Lock, Clock, Users, Trophy } from 'lucide-react';

interface Capsule {
  id: string;
  title: string;
  caption: string;
  tags: string[];
  image: string;
  unlockDate: string;
  participants: number;
  aptReward: number;
  category: string;
}


interface FeaturedCapsulesProps {
  capsules: Capsule[];
}

export function FeaturedCapsules({ capsules }: FeaturedCapsulesProps) {
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
        {capsules.map((capsule) => (
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
                <div className={`bg-gray-500 px-3 py-1 rounded-full text-white text-sm font-medium`}>
                  {capsule.category.charAt(0).toUpperCase() + capsule.category.slice(1)}
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{capsule.title}</h3>
              <p className="text-gray-600 mb-4">{capsule.caption}</p>

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