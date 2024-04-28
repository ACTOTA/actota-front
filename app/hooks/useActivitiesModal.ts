import { create } from 'zustand';

interface ActivitiesModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useActivitiesModal = create<ActivitiesModalStore >((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useActivitiesModal;
