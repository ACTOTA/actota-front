import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return new Response(JSON.stringify({ error: "User not authenticated" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        const body = await request.json();
        const {
            activity,
            location,
            guestCount,
            roomCount,
            bathroomCount,
            imageSrc,
            price,
            title,
            description,
        } = body;

        const listing = await prisma.listing.create({
            data: {
                activity: activity, 
                location: location,
                guestCount: guestCount,
                roomCount: roomCount,
                bathroomCount: bathroomCount,
                imageSrc: imageSrc,
                price: parseInt(price, 10),
                title: title,
                description: description,
                userId: currentUser.id,
            }
        });

        return NextResponse.json(listing);

    } catch (error) {
        console.error("Failed to create listing:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}
