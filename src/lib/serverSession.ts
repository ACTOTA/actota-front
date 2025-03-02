'use server';

import { cookies } from "next/headers";
import { serverEnv } from "@/src/lib/config/env/server-env";
import actotaApi from "@/src/lib/apiClient";
import { Session, SessionUser } from "@/src/types/session";

// This function gets session data from the auth token cookie - server-side only
export const getServerSession = async (): Promise<Session> => {
  try {
    const token = cookies().get('auth_token')?.value;
    
    if (!token) {
      return { user: null, isLoggedIn: false };
    }
    
    try {
      const response = await actotaApi.get(
        "/api/auth/session",
        { 
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      if (!response.data || !response.data.user_id) {
        return { user: null, isLoggedIn: false };
      }
      
      return { 
        user: response.data, 
        isLoggedIn: true,
        accessToken: token
      };
    } catch (error) {
      console.error('Session check failed:', error);
      return { user: null, isLoggedIn: false };
    }
  } catch (error) {
    console.error('Error retrieving session:', error);
    return { user: null, isLoggedIn: false };
  }
};