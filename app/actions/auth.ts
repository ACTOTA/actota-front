// app/actions/auth.ts
'use server'

import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const token = cookies().get('auth_token')?.value

  if (!token) return null

  try {
    const response = await fetch('/api/auth/session', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) return null

    return response.json()
  } catch (error) {
    console.error('Auth check failed:', error)
    return null
  }
}
