"use client";
import { LogIn, User } from "lucide-react";
// import { Sparkles, Search, Info, User, Box, Home, LogIn } from 'lucide-react';
// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import useRegisterModal from '~/hooks/use-register-modal';

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useRegisterModal from "~/hooks/use-register-modal";
import { MobileSidebar } from "./mobile-sidebar";
import { UserButton } from "./user-button";

// export default function Navbar() {
//   const { data: session } = useSession();

//   const pathname = usePathname();

//   const registerModal = useRegisterModal();
  
  // const isActive = (path: string) => {
  //   return pathname === path ? 'bg-white/20' : 'hover:bg-white/10';
  // };

//   return (
//     <nav className="bg-black/90 lg text-white">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2">
//             <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
//             <span className="text-xl font-bold">TimeCapsule</span>
//           </Link>

//           {/* Navigation Links */}
//           <div className="hidden md:flex items-center gap-1">
//             <Link
//               href="/"
//               className={`px-4 py-2 rounded-lg transition-colors ${isActive('/')}`}
//             >
//               <span className="flex items-center gap-2">
//                 <Home className="w-4 h-4" />
//                 Home
//               </span>
//             </Link>
//             <Link
//               href="/explore"
//               className={`px-4 py-2 rounded-lg transition-colors ${isActive('/explore')}`}
//             >
//               <span className="flex items-center gap-2">
//                 <Search className="w-4 h-4" />
//                 Explore
//               </span>
//             </Link>
//             <Link
//               href="/my-capsules"
//               className={`px-4 py-2 rounded-lg transition-colors ${isActive('/my-capsules')}`}
//             >
//               <span className="flex items-center gap-2">
//                 <Box className="w-4 h-4" />
//                 My Capsules
//               </span>
//             </Link>
//             <Link
//               href="/about"
//               className={`px-4 py-2 rounded-lg transition-colors ${isActive('/about')}`}
//             >
//               <span className="flex items-center gap-2">
//                 <Info className="w-4 h-4" />
//                 About
//               </span>
//             </Link>
//           </div>

//           {/* Profile Link */}
          // {!session && <button
          //   onClick={registerModal.onOpen}
          //   className={`px-4 py-2 rounded-lg transition-colors ${isActive('/profile')}`}
          // >
          //   <span className="flex items-center gap-2">
          //     <LogIn className="w-4 h-4" />
          //     Login
          //   </span>
          // </button>}
          // {session && (
          //   <Link
          //     href="/profile"
          //     className={`px-4 py-2 rounded-lg transition-colors ${isActive('/profile')}`}
          //   >
          //     <span className="flex items-center gap-2">
          //       <User className="w-4 h-4" />
          //       Profile
          //     </span>
          //   </Link>
          // )}
        // </div>
//       </div>
//     </nav>
//   );
// }

export const Navbar = () => {
  const { data: session } = useSession();
  const registerModal = useRegisterModal();
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path ? 'bg-white/20' : 'hover:bg-white/10';
  };
  return (
    <nav className="pt-4 px-6 flex justify-between items-center">
      <div className='flex-col hidden lg:flex'>
        <div className={pathname === '/' ? "" : "hidden"}>
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">
          Welcome to TimeCapsule! Explore and create time capsules with friends.
        </p>
        </div>
      </div>
      <MobileSidebar />
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
            // <Link
            //   href="/profile"
            //   className={`px-4 py-2 rounded-lg transition-colors ${isActive('/profile')}`}
            // >
            //   <span className="flex items-center gap-2">
            //     <User className="w-4 h-4" />
            //     Profile
            //   </span>
            // </Link>
            <UserButton />
          )}
    </nav>
  )
}