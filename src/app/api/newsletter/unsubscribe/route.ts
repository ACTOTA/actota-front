import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Send to external newsletter service for unsubscription
    // Note: This endpoint might need to be created on the Firebase Functions side
    const response = await fetch('https://us-central1-actota.cloudfunctions.net/newsletter-unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to unsubscribe from newsletter' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Successfully unsubscribed from newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while unsubscribing from newsletter' },
      { status: 500 }
    );
  }
}