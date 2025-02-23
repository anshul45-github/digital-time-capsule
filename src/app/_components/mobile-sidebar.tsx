"use client";

import { MenuIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);
    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button size={"icon"} variant={"secondary"} className="lg:hidden">
                    <MenuIcon className="size-4 text-neutral-500" />
                </Button>
            </SheetTrigger>
            <SheetContent side={"left"} className="p-0">
                <SheetTitle></SheetTitle>
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}