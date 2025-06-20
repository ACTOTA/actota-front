import { clientEnv } from '@/src/lib/config/client-env';

/**
 * Uploads an image file to Google Cloud Storage
 * @param file The file to upload
 * @param itineraryId The ID of the itinerary to associate with the image
 * @returns A promise that resolves to the URL of the uploaded image
 */
export const uploadImageToGCS = async (file: File, itineraryId: string): Promise<string> => {
  console.log(`Uploading image ${file.name} for itinerary ${itineraryId}`);
  
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('itineraryId', itineraryId);
    
    // Use the backend API directly to upload the file
    const response = await fetch(`${clientEnv.NEXT_PUBLIC_API_URL}/upload/itinerary-image`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload image: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.url) {
      throw new Error('Upload succeeded but no URL was returned');
    }
    
    return data.url;
  } catch (error) {
    console.error(`Error uploading image ${file.name}:`, error);
    throw error;
  }
};

