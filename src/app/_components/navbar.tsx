"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { User, LogIn, Link as LinkImg, Unlink } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useRegisterModal from "~/hooks/use-register-modal";
import Button from "./button";
import { MobileSidebar } from "./mobile-sidebar";
import { UserButton } from "./user-button";

export const Navbar = () => {
  const { data: session } = useSession();
  const Wallet = useWallet();

  const registerModal = useRegisterModal();
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path ? "bg-white/20" : "hover:bg-white/10";
  };
  return (
    <nav className="flex items-center justify-between px-6 pt-4">
      <div className="hidden flex-col lg:flex">
        <div className={pathname === "/" ? "" : "hidden"}>
          <h1 className="text-2xl font-semibold">Home</h1>
          <p className="text-muted-foreground">
            Welcome to TimeCapsule! Explore and create time capsules with
            friends.
          </p>
        </div>
      </div>
      <MobileSidebar />
      {!session && (
        <button
          onClick={registerModal.onOpen}
          className={`rounded-lg px-4 py-2 transition-colors ${isActive("/profile")}`}
        >
          <span className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </span>
        </button>
      )}
        <div className="flex items-center gap-1">
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
            <UserButton />)
            
            {!Wallet.connected &&
            <Button
              onClick={() => Wallet.connect("Petra")}
              className={`rounded-lg bg-red-400 px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-red-600 ${isActive("/profile")}`}
            >
              <span className="flex items-center gap-2">
                <LinkImg className="h-4 w-4" />
                Connect
              </span>
            </Button>
          )}
          {Wallet.connected && (
            <Button
              onClick={() => Wallet.disconnect()}
              className={`rounded-lg bg-green-400 px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-green-600 ${isActive("/profile")}`}
            >
              <span className="flex items-center gap-2">
                <Unlink className="h-4 w-4" />
                Disconnect
              </span>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};
