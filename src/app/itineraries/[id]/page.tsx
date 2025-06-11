"use server"
import { Metadata, ResolvingMetadata } from 'next'
import actotaApi from '@/src/lib/apiClient'
import ClientSideItinerary from './ClientSideItinerary'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Button from '@/src/components/figma/Button'

type Props = {
  params: { id: string }
}

// Create a separate server-side fetch function
async function getItineraryById(id: string) {
  try {
    // Call the backend directly - it should work for both authenticated and unauthenticated users
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    console.log(`Direct backend fetch: ${backendUrl}/itineraries/${id}`);
    
    // Don't send auth headers - let the backend handle public access
    const response = await fetch(`${backendUrl}/itineraries/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }
    });

    console.log(`Backend response status: ${response.status}`);

    if (!response.ok) {
      console.error(`Backend returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Server Fetch Error:', error);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    // Try to get itinerary data for metadata
    const itinerary = await getItineraryById(params.id)
    if (itinerary) {
      return {
        title: `${itinerary.trip_name} | Adventure Colorado Tours`,
        description: itinerary.description,
        openGraph: {
          title: itinerary.trip_name,
          description: itinerary.description,
          images: itinerary.images?.[0] ? [itinerary.images[0]] : [],
        },
      }
    }
  } catch (error) {
    // Fall through to default metadata
  }
  
  return {
    title: 'Itinerary | Adventure Colorado Tours',
    description: 'View our amazing itineraries',
  }
}

export default async function ItineraryPage({ params }: Props) {
  try {
    // Check if user is authenticated
    const cookieStore = cookies()
    const authToken = cookieStore.get('auth_token')
    const isAuthenticated = !!authToken;

    console.log(`ItineraryPage: Loading itinerary ${params.id}, authenticated: ${isAuthenticated}`);

    // Fetch itinerary data - should work for both authenticated and unauthenticated
    const initialData = await getItineraryById(params.id);
    
    // If we have data, render the page
    if (initialData) {
      console.log('Successfully loaded itinerary data');
      return <ClientSideItinerary initialData={initialData} isAuthenticated={isAuthenticated} />
    }
    
    // If no data at all, show not found
    console.log('No itinerary data found');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#05080D]">
        <h1 className="text-2xl font-bold mb-4">Itinerary Not Found</h1>
        <p className="text-gray-400">The itinerary you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  } catch (error: any) {
    console.error('ItineraryPage error:', error);
    // For other errors
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#05080D]">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-400">{error.message}</p>
      </div>
    )
  }
}