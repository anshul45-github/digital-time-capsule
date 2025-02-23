import { Sparkles } from "lucide-react"
import Link from "next/link"
import { DottedSeparator } from "./dotted-separator"
import { Navigation } from "./navigation"

export const Sidebar = () => {
    return (
        <aside className="h-full bg-neutral-100 p-4 w-full">
            <Link href={"/"} className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-black animate-pulse" />
                <span className="text-xl font-bold">TimeCapsule</span>
            </Link>
            <DottedSeparator />
            <Navigation />
        </aside>
    )
}