import { create } from "zustand";

interface RegisterModalState {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

const useRegisterModal = create<RegisterModalState>((set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
}));

export default useRegisterModal;