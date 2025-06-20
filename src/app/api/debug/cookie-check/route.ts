import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie } from '@/src/helpers/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authToken = await getAuthCookie();
    const allCookies = request.cookies.getAll();
    
    console.log('Cookie debug - All cookies:', allCookies);
    console.log('Cookie debug - Auth token:', authToken ? `${authToken.substring(0, 20)}...` : 'None');
    
    return NextResponse.json({
      hasAuthToken: !!authToken,
      authTokenLength: authToken?.length || 0,
      authTokenPreview: authToken ? `${authToken.substring(0, 20)}...` : null,
      allCookies: allCookies.map(cookie => ({
        name: cookie.name,
        hasValue: !!cookie.value,
        valueLength: cookie.value?.length || 0
      })),
      environment: process.env.NODE_ENV,
      apiUrl: process.env.NEXT_PUBLIC_API_URL
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

