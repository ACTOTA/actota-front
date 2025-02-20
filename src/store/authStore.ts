import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthStoreState, AuthStoreActions, User } from '@/src/types/store/authStore';

const initialState: AuthStoreState = {
  isLoggedIn: false,
  isLoading: false,
  token: null,
  user: null,
};

export const useAuthStore = create(
  persist<AuthStoreState & AuthStoreActions>(
    (set) => ({
      ...initialState,
      setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
      setUser: (user: User | null) => set({ user }),
      setToken: (token: string) => set({ token }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      logout: () => set(initialState),
      clear: () => set(initialState),
    }),
    
    {
      name: 'auth-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // use localStorage for web
    }
  )
); 