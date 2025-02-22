export interface Capsule {
    id: string;
    title: string;
    description: string;
    image: string;
    unlockDate: string;
    participants: number;
    aptReward: number;
    category: 'memory' | 'milestone' | 'community' | 'challenge';
    creator: string;
    tags: string[];
  }