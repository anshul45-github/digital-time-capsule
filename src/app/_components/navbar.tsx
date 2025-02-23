"use client";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Sparkles, Search, Info, User, Box, Home, LogIn, Link as LinkImg, Unlink } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useRegisterModal from '~/hooks/use-register-modal';
import Button from './button';


export default function Navbar() {
  const { data: session } = useSession();

  const Wallet = useWallet();

  const pathname = usePathname();

  const registerModal = useRegisterModal();
  
  const isActive = (path: string) => {
    return pathname === path ? 'bg-white/20' : 'hover:bg-white/10';
  };

  return (
    <nav className="bg-black/90 lg text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            <span className="text-xl font-bold">TimeCapsule</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg transition-colors ${isActive('/')}`}
            >
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </span>
            </Link>
            <Link
              href="/explore"
              className={`px-4 py-2 rounded-lg transition-colors ${isActive('/explore')}`}
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Explore
              </span>
            </Link>
            <Link
              href="/my-capsules"
              className={`px-4 py-2 rounded-lg transition-colors ${isActive('/my-capsules')}`}
            >
              <span className="flex items-center gap-2">
                <Box className="w-4 h-4" />
                My Capsules
              </span>
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-lg transition-colors ${isActive('/about')}`}
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                About
              </span>
            </Link>
          </div>

          {/* Profile Link */}
          {!session && <button
            onClick={registerModal.onOpen}
            className={`px-4 py-2 rounded-lg transition-colors ${isActive('/profile')}`}
          >
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </span>
          </button>}
          {session && (
            <div className='flex items-center gap-1'>
            <Link
              href="/profile"
              className={`px-4 py-2 rounded-lg transition-colors ${isActive('/profile')}`}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </span>
            </Link>
            
            {!Wallet.connected &&
            <Button
              onClick={() => Wallet.connect('Petra')}
              className={`px-4 py-2 rounded-lg bg-red-400 hover:bg-red-600 ease-in-out duration-300 transition-colors ${isActive('/profile')}`}
            >
              <span className="flex items-center gap-2">
                <LinkImg className="w-4 h-4" />
                Connect
              </span>
            </Button>}
            {Wallet.connected &&
            <Button
              onClick={() => Wallet.disconnect()}
              className={`px-4 py-2 rounded-lg bg-green-400 hover:bg-green-600 ease-in-out duration-300 transition-colors ${isActive('/profile')}`}
            >
              <span className="flex items-center gap-2">
                <Unlink className="w-4 h-4" />
                Disconnect
              </span>
            </Button>}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}