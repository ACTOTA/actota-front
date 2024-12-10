'use server'

import { cookies } from 'next/headers';

export async function signOut() {
  return cookies().delete('auth_token');
}
