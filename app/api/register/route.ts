import bcryptjs from 'bcryptjs';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request)   {
    const body = await request.json();

    const { email, password } = body;

    const hashedPassword = await bcryptjs.hash(password, 12);


    fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password: hashedPassword
        })
    }).then(response => {
        if (response.ok) {
            // return response.json();
            return NextResponse.json(response.json());
        }
        return response.json().then(err => {
            throw new Error(err.message);
        });
    })

    // return NextResponse.json(user);
 
}
