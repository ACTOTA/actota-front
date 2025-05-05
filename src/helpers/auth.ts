'use server'

import { cookies } from 'next/headers';
import actotaApi from '@/src/lib/apiClient';
export interface Claims {
  sub: string,
  exp: number,
  iat: number
};

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  expires: Date;
  path: string;
}

export async function getCurrentUser() {
  const token = cookies().get('auth_token')?.value

  if (!token) return null

  try {
    const response = await actotaApi.get(
      "/api/auth/session",
      { headers: {
        'Authorization': `Bearer ${token}`,
      }},
    );

    if (!response.data) return null
    return response.data
  } catch (error) {
    console.error('Auth check failed:', error)
    return null
  }
}


export async function getAuthCookie() {
  return cookies().get('auth_token')?.value;
}

export async function isTokenExpired(token: string | null | undefined): Promise<boolean> {
  if (!token) return true;
  
  try {
    // JWT tokens are in three parts separated by a dot
    const payload = token.split('.')[1];
    if (!payload) return true;
    
    // Decode the base64 payload
    const decodedPayload = Buffer.from(payload, 'base64').toString();
    const parsedPayload = JSON.parse(decodedPayload);
    
    // Check if the token expiration time is in the past
    const expiration = parsedPayload.exp * 1000; // Convert to milliseconds
    return Date.now() > expiration;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If there's an error, assume token is expired
  }
}


export async function setAuthCookie(authToken: string, claims?: Claims) {
  cookies().set('auth_token', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(claims ? claims.exp * 1000 : Date.now() + 1000 * 60 * 60 * 24 * 30),
    path: '/'
  });
 
}

export async function setCookie(name: string, value: string, options: CookieOptions) {
  cookies().set(name, value, options);
}

export async function getCookie(name: string) {
  return cookies().get(name)?.value;
}

export async function signOut() {
  return cookies().delete('auth_token');
}
