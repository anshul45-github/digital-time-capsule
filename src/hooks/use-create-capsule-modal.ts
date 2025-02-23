// import { useQueryState, parseAsBoolean } from "nuqs";

// export const useCreateCapsuleModal = () => {
//     const [isOpen, setIsOpen] = useQueryState("createCapsule", parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }));

//     const open = () => setIsOpen(true);
//     const close = () => setIsOpen(false);

//     return { isOpen, open, close, setIsOpen };
// }

// Changed to remove nuqs

"use client"; // 👈 Important!

import { useRouter, useSearchParams } from "next/navigation"; // Use next/navigation in App Router

export const useCreateCapsuleModal = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isOpen = searchParams.get("createCapsule") === "true";

    const open = () => router.push(`?createCapsule=true`, { scroll: false });
    const close = () => router.push(`?`, { scroll: false });

    return { isOpen, open, close };
};
