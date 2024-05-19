import { create } from 'zustand';
import { STEPS } from '../types/steps';

interface SearchModalStore {
  isOpen: boolean;
  onOpen: (step?: STEPS) => void;
  onClose: () => void;
  onNext?: () => void;
  onBack?: () => void;
  step?: STEPS;
  locationLabel: string;
  durationLabel: string;
  guestLabel: string;
  activitiesLabel: string;
  typeLabel: string;
}

const useSearchModal = create<SearchModalStore>((set) => ({
  isOpen: false,
  locationLabel: 'Location',
  durationLabel: 'Duration',
  guestLabel: 'Guests',
  activitiesLabel: 'Activities',
  typeLabel: 'Type',
  onOpen: (step) => set({ isOpen: true, step }),
  onClose: () => set((state) => ({ ...state, isOpen: false, step: undefined })),
  onNext: () => set((state) => ({ ...state, step: state.step + 1 })),
  onBack: () => set((state) => ({ ...state, step: state.step - 1 })),
}));


export default useSearchModal;
