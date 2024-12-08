'use server'

import { cookies } from 'next/headers';

export async function getAuthCookie() {
  return cookies().get('auth_token')?.value;
}
