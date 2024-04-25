import { create } from 'zustand';

interface RegisterModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const useRegisterModal = create<RegisterModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useRegisterModal;