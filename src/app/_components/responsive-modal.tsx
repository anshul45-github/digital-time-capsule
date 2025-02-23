import React from "react";
import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import "./responsiveModalStyle.css";
import { Drawer, DrawerContent, DrawerTitle } from "~/components/ui/drawer";

interface ResponsiveModalProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({ children, open, onOpenChange }: ResponsiveModalProps) => {
    const isDesktop = useMedia("(min-width: 1024px)", true);

    if(isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
                    <DialogTitle></DialogTitle>
                    {children}
                </DialogContent>
            </Dialog>
        )
    }
    
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerTitle></DrawerTitle>
                    <div className="overflow-y-auto hide-scrollbar max-h-[85vwh]">
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
    )
}