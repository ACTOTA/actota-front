 type LoginPayload = {
  email: string;
  password: string;
};

type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthResponse = {
  auth_token: string;
  user: any;
  isAuthenticated: boolean;
};





export type { LoginPayload, SignUpPayload, AuthResponse };

