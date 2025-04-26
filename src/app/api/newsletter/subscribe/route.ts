import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Send to external newsletter service
    const response = await fetch('https://us-central1-actota.cloudfunctions.net/newsletter-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to subscribe to newsletter' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while subscribing to newsletter' },
      { status: 500 }
    );
  }
}