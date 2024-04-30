import { create } from 'zustand';

interface TypesModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useTypesModal = create<TypesModalStore >((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useTypesModal;
