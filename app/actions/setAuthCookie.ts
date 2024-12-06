'use server'

import { cookies } from 'next/headers';
import { Claims } from '../libs/auth';

export async function setAuthCookie(authToken: string, claims: Claims) {
  cookies().set('auth_token', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(claims.exp * 1000),
    path: '/'
  });
}
