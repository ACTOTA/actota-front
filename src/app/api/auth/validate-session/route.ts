import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose/jwt/verify';

export async function GET(req: NextRequest) {
  try {
    // Get the auth token from the cookie
    const authToken = cookies().get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    
    try {
      // Verify token validity - this will throw if expired or invalid
      // Using a placeholder secret here - use your actual JWT verification method
      // This is a simplified version of what your server might do
      const key = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your_jwt_secret'
      );
      
      const { payload } = await jwtVerify(authToken, key);
      
      // Check expiration (exp is in seconds)
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTimestamp) {
        return NextResponse.json({ error: 'Unauthorized: Token expired' }, { status: 401 });
      }
      
      // If we get here, token is valid
      return NextResponse.json({ valid: true });
      
    } catch (error) {
      console.error('Token validation error:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}