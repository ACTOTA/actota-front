export type SessionUser = {
  _id?: {
    $oid: string;
  };
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  created_at?: string;
}

export interface Session {
  user: SessionUser | null;
  isLoggedIn: boolean;
  accessToken?: string;
}
