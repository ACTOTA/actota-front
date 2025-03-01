export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthStoreState {
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
  user: User | null;
}

export interface AuthStoreActions {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
  clear: () => void;
}
