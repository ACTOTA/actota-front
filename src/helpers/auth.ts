'use server'

import { jwtVerify } from 'jose/jwt/verify';
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
  console.log('Token:', token)

  if (!token) return null

  try {
    const response = await actotaApi.get(
      "/api/auth/session",
      { headers: {
        'Authorization': `Bearer ${token}`,
      }},
    );
    console.log('Response:', response)

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
