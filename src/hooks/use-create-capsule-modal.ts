import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateCapsuleModal = () => {
    const [isOpen, setIsOpen] = useQueryState("createCapsule", parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }));

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return { isOpen, open, close, setIsOpen };
}