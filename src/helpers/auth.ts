'use server'

import { jwtVerify } from 'jose/jwt/verify';
import { cookies } from 'next/headers';

export interface Claims {
  sub: string,
  exp: number,
  iat: number
};



export const verifyJwt = async (token: string): Promise<Claims | null> => {
  const secret = process.env.NEXT_PUBLIC_AUTH_SECRET || "";

  try {
    // Convert the secret to a Uint8Array (required by `jose`)
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret); 

    // Verify the JWT and extract the payload
    const { payload } = await jwtVerify(token, secretKey);

    // Type-cast the payload to your Claims interface
    return payload as Claims;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
};

export async function getCurrentUser() {
  console.log('getCurrentUser')
  const token = cookies().get('auth_token')?.value
  console.log('Token:', token)

  if (!token) return null

  try {
    const response = await fetch('http://localhost:8080/api/auth/session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    console.log('Response:', response)

    if (!response.ok) return null
    return response.json()
  } catch (error) {
    console.error('Auth check failed:', error)
    return null
  }
}


export async function getAuthCookie() {
  return cookies().get('auth_token')?.value;
}


export async function setAuthCookie(authToken: string, claims: Claims) {
  cookies().set('auth_token', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(claims.exp * 1000),
    path: '/'
  });
}


export async function signOut() {
  return cookies().delete('auth_token');
}
