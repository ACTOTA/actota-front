import { actotaApi } from '@/src/lib/apiClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    // TODO: Replace with Actota API
    // TODO: replace env public api url to use local host

    // const response = await actotaApi.get('/api/activities', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // TODO: put hardcoded token as for now
    //     // "Authorization": `Bearer ${session.token}`
    //   },
    // });

    const response = await fetch('https://my-json-server.typicode.com/horizon-code-academy/fake-movies-api/movies', {
      headers: {
        'Content-Type': 'application/json',
        // TODO: put hardcoded token as for now
        // "Authorization": `Bearer ${session.token}`
      },
      // WARNING: Only use this during development
      //@ts-ignore
      rejectUnauthorized: false,
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}