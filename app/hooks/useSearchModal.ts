import { create } from 'zustand';
import { STEPS } from '../types/steps';

interface SearchModalStore {
  isOpen: boolean;
  onOpen: (step?: STEPS) => void;
  onClose: () => void;
  onNext?: () => void;
  onBack?: () => void;
  step?: STEPS;
}

const useSearchModal = create<SearchModalStore>((set) => ({
  isOpen: false,
  onOpen: (step) => set({ isOpen: true, step }),
  onClose: () => set({ isOpen: false, step: undefined }),
  onNext: () => set((state) => ({ ...state, step: state.step + 1 })),
  onBack: () => set((state) => ({ ...state, step: state.step - 1 })),
}));


export default useSearchModal;
