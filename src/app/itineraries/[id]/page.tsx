"use server"
import { Metadata, ResolvingMetadata } from 'next'
import actotaApi from '@/src/lib/apiClient'
import ClientSideItinerary from './ClientSideItinerary'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Button from '@/src/components/figma/Button'

type Props = {
  params: { id: string }
}

// Create a separate server-side fetch function
async function getItineraryById(id: string) {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/itineraries/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken.value}`
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required')
      }
      throw new Error('Failed to fetch itinerary')
    }

    return response.json();
  } catch (error) {
    console.error('Server Fetch Error:', error);
    throw error;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const itinerary = await getItineraryById(params.id)
    return {
      title: `${itinerary.trip_name} | Adventure Colorado Tours`,
      description: itinerary.description,
      openGraph: {
        title: itinerary.trip_name,
        description: itinerary.description,
        images: itinerary.images?.[0] ? [itinerary.images[0]] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Itinerary | Adventure Colorado Tours',
      description: 'View our amazing itineraries',
    }
  }
}

export default async function ItineraryPage({ params }: Props) {
  try {
    // Pre-fetch the data on the server
    const initialData = await getItineraryById(params.id)
    return <ClientSideItinerary initialData={initialData} />
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#05080D]">
          <h1 className="text-2xl font-bold mb-4">Please Login to View Itinerary Details</h1>
          <p className="text-gray-400 mb-6">You need to be logged in to access this content</p>
          <Button  variant="primary" className="  transition-colors">
          
          <a href="/auth/signin">
            Login Now
          </a>
          </Button>
        </div>
      )
    }

    // For other errors
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#05080D]">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-400">{error.message}</p>
      </div>
    )
  }
}