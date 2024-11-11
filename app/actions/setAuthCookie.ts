'use server';

import { cookies } from 'next/headers'
import { Claims } from '@/app/signin/page';

export async function setAuthCookie(authToken: string, claim: Claims) {
  try {
    const cookiesList = await cookies();

    cookiesList.set('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: claim.exp, 
      path: '/' 
    });

  } catch (error) {
    console.error('Error setting cookie:', error);
  }
}
