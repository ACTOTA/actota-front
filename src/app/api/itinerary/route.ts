import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(request: NextRequest) {
    const itineraries = await prisma.itinerary.findMany();
    return NextResponse.json({ status: 200, data: itineraries });
}