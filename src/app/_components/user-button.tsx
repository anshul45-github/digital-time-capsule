"use client";
import { Loader, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import axios from 'axios';
import { useRouter } from "next/navigation";

export const UserButton = () => {
    const { data: session, status } = useSession();
    if(status === "loading")
        return <Loader className="animate-spin size-4 text-muted-foreground" />
    if(!session)
        return null;
    const [user, setUser] = useState(session.user);
    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get("/api/profile");
            setUser(response.data.user);
        }
        fetch();
    }, []);
    const router = useRouter();
    const { image, name, email } = user;
    const avatarFallback = name!.charAt(0).toUpperCase();
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition">
                    <AvatarImage alt={name ? name : ""} src={image ? image : ""} />
                    <AvatarFallback className="bg-sky-500 text-white">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuItem onClick={() => signOut()} className="h-10">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")} className="h-10">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}