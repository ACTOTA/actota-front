// app/actions/auth.ts
'use server'

import { cookies } from 'next/headers'

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
