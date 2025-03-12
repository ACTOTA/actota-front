import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Delete the auth cookie
    cookies().delete('auth_token');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
  }
}