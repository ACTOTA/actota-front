import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { getAuthCookie } from '@/src/helpers/auth';

export const dynamic = "force-dynamic";

// Initialize Google Cloud Storage using default credentials
let storage: Storage | null = null;
try {
  if (process.env.GCP_PROJECT_ID) {
    console.log(`Initializing GCS with project ID: ${process.env.GCP_PROJECT_ID}`);
    
    // Check for explicit credentials path
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credentialsPath) {
      console.log(`Using credentials from: ${credentialsPath}`);
    } else {
      console.log('No explicit credentials path. Using default credentials mechanism.');
    }
    
    // Initialize storage client
    storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      // Uses default service account credentials from the environment
    });
    
    console.log('GCS client initialized successfully');
  } else {
    console.warn('No GCP_PROJECT_ID environment variable found');
  }
} catch (error) {
  console.error('Error initializing Google Cloud Storage client:', error);
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authToken = await getAuthCookie();
    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, JPG, and PNG are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Always use Google Cloud Storage
    const bucketName = process.env.ITINERARY_BUCKET;
    const hasValidGcsConfig = bucketName && storage;
    
    // Log environment details
    console.log('GCS Upload Configuration:', {
      environment: process.env.NODE_ENV,
      bucketName: bucketName || 'Not configured',
      hasStorage: !!storage,
      hasValidGcsConfig,
      projectId: process.env.GCP_PROJECT_ID || 'Not configured'
    });
    
    // Require valid GCS configuration
    if (!hasValidGcsConfig) {
      console.error('GCS configuration invalid - cannot proceed with upload');
      return NextResponse.json(
        { error: 'Google Cloud Storage not properly configured' },
        { status: 500 }
      );
    }

    // Create bucket instance
    if (!storage) {
      console.error('Storage object is null - unable to access Google Cloud Storage');
      return NextResponse.json(
        { error: 'Cloud storage is not properly configured' },
        { status: 500 }
      );
    }
    
    // Create bucket instance without optional chaining
    const bucket = storage.bucket(bucketName);
    console.log(`Accessing GCS bucket: ${bucketName}`);

    // Get itinerary ID from the form data or generate a temporary one
    let itineraryId = formData.get('itineraryId') as string;
    console.log('Received itineraryId from form data:', itineraryId);
    
    // Log all form data entries for debugging
    console.log('All form data entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File "${value.name}" (${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    // Get additional metadata that might contain the itinerary ID
    const originalFileName = formData.get('fileName') as string;
    const formTimestamp = formData.get('timestamp') as string;
    const metadata = formData.get('metadata') as string;
    
    if (!itineraryId) {
      // Try to extract ID from metadata if provided
      if (metadata) {
        try {
          const parsedMetadata = JSON.parse(metadata);
          if (parsedMetadata.itineraryId) {
            itineraryId = parsedMetadata.itineraryId;
            console.log('Using itineraryId from metadata:', itineraryId);
          }
        } catch (e) {
          console.warn('Failed to parse metadata JSON:', e);
        }
      }
      
      // If still no ID, generate a temporary ID with timestamp and random portion
      if (!itineraryId) {
        const now = formTimestamp ? parseInt(formTimestamp) : Date.now();
        const random = Math.random().toString(36).substring(2, 10);
        itineraryId = `temp-${now}-${random}`;
        console.log('No itinerary ID provided, using temporary ID:', itineraryId);
      }
    }
    
    // Clean up the itinerary ID to ensure it's valid for folder names
    // Remove any invalid characters (only keep alphanumeric, hyphens and underscores)
    const cleanId = itineraryId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (cleanId !== itineraryId) {
      console.log(`Cleaned itineraryId from "${itineraryId}" to "${cleanId}"`);
      itineraryId = cleanId;
    }
    
    // Generate unique filename with itinerary ID as folder name
    const currentTimestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const folderPath = `itineraries/${itineraryId}`;
    const uniqueFilename = `${currentTimestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const fullFileName = `${folderPath}/${uniqueFilename}`;
    
    console.log(`Generated file path: ${fullFileName}`);
    
    // In Google Cloud Storage, folders are actually just part of the file path
    // We need to explicitly create folder markers to ensure the folder structure 
    // exists and is visible in the GCS console
    try {
      // Create up to 5 retries for creating folders
      let rootFolderSuccess = false;
      let itineraryFolderSuccess = false;
      let attempts = 0;
      const maxAttempts = 3;

      // Create both the itineraries folder and the specific itinerary folder
      const rootFolderMarker = bucket.file('itineraries/.keep');
      const itineraryFolderMarker = bucket.file(`${folderPath}/.keep`);
      
      while ((!rootFolderSuccess || !itineraryFolderSuccess) && attempts < maxAttempts) {
        attempts++;
        console.log(`Folder creation attempt ${attempts}/${maxAttempts}`);
        
        // Create root folder if needed
        if (!rootFolderSuccess) {
          try {
            const [rootFolderExists] = await rootFolderMarker.exists();
            
            if (!rootFolderExists) {
              console.log(`Creating root directory marker for folder: itineraries/`);
              await rootFolderMarker.save('', { 
                contentType: 'application/x-directory',
                metadata: {
                  'x-goog-meta-directory': 'true'
                }
              });
              
              // Verify root folder creation
              const [verifyRoot] = await rootFolderMarker.exists();
              if (verifyRoot) {
                rootFolderSuccess = true;
                console.log('Root folder marker created successfully');
              } else {
                console.warn('Root folder marker creation failed verification');
              }
            } else {
              rootFolderSuccess = true;
              console.log('Root folder marker already exists');
            }
          } catch (rootError) {
            console.error(`Root folder creation error (attempt ${attempts}):`, rootError);
            // Wait before retry
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 200));
            }
          }
        }
        
        // Create itinerary folder if needed
        if (!itineraryFolderSuccess) {
          try {
            const [folderExists] = await itineraryFolderMarker.exists();
            
            if (!folderExists) {
              console.log(`Creating directory marker for folder: ${folderPath}`);
              await itineraryFolderMarker.save('', { 
                contentType: 'application/x-directory',
                metadata: {
                  'x-goog-meta-directory': 'true',
                  'x-goog-meta-itineraryId': itineraryId,
                  'x-goog-meta-timestamp': Date.now().toString()
                }
              });
              
              // Verify itinerary folder creation
              const [verifyFolder] = await itineraryFolderMarker.exists();
              if (verifyFolder) {
                itineraryFolderSuccess = true;
                console.log(`Itinerary folder marker created successfully`);
              } else {
                console.warn('Itinerary folder marker creation failed verification');
              }
            } else {
              itineraryFolderSuccess = true;
              console.log(`Folder already exists: ${folderPath}`);
            }
          } catch (folderError) {
            console.error(`Itinerary folder creation error (attempt ${attempts}):`, folderError);
            // Wait before retry
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 200));
            }
          }
        }
      }
      
      // Final status report
      console.log(`Folder creation status: Root folder: ${rootFolderSuccess ? 'SUCCESS' : 'FAILED'}, Itinerary folder: ${itineraryFolderSuccess ? 'SUCCESS' : 'FAILED'}`);
      
      // Even if folder creation failed, we'll still try to upload the file
      if (!rootFolderSuccess || !itineraryFolderSuccess) {
        console.warn('Proceeding with file upload despite folder creation issues');
      }
      
    } catch (folderError) {
      // If we can't create the folder markers, log but continue
      console.warn(`Could not create folder markers (non-critical): ${folderError.message}`);
      console.error('Folder creation error details:', folderError);
    }

    // Create a blob in the bucket
    const blob = bucket.file(fullFileName);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the file with better error handling and retry logic
    console.log(`Uploading file to GCS: ${fullFileName}`);
    let uploadSuccess = false;
    let uploadError = null;
    let maxAttempts = 3;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Upload attempt ${attempt}/${maxAttempts} for file: ${fullFileName}`);
        
        await blob.save(buffer, {
          metadata: {
            contentType: file.type,
            'x-goog-meta-itineraryId': itineraryId,
            'x-goog-meta-uploadTime': new Date().toISOString(),
            'x-goog-meta-originalName': file.name,
            'x-goog-meta-attempt': attempt.toString(),
            'x-goog-meta-timestamp': Date.now().toString()
          },
        });
        
        // Verify upload was successful
        const [fileExists] = await blob.exists();
        if (fileExists) {
          console.log(`Successfully verified upload to GCS: ${fullFileName} (attempt ${attempt})`);
          uploadSuccess = true;
          
          // Get file metadata to verify upload details
          try {
            const [metadata] = await blob.getMetadata();
            console.log(`File metadata for ${fullFileName}:`, {
              size: metadata.size,
              contentType: metadata.contentType,
              timeCreated: metadata.timeCreated,
              updated: metadata.updated
            });
          } catch (metadataError) {
            console.warn(`Could not retrieve metadata for ${fullFileName}:`, metadataError.message);
          }
          
          // Break out of retry loop on success
          break;
        } else {
          console.warn(`File upload verification failed: ${fullFileName} not found in bucket (attempt ${attempt})`);
          // Wait before retry if not the last attempt
          if (attempt < maxAttempts) {
            const delayMs = Math.pow(2, attempt - 1) * 500; // Exponential backoff
            console.log(`Waiting ${delayMs}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
        }
      } catch (error) {
        uploadError = error;
        console.error(`Error in GCS upload (attempt ${attempt}):`, error);
        
        // Enhanced error logging with GCS-specific details
        const errorDetails = {
          message: error.message,
          code: error.code,
          errors: error.errors,
          response: error.response,
          serviceError: error.serviceError
        };
        
        console.error(`Detailed GCS upload error (attempt ${attempt}):`, JSON.stringify(errorDetails, null, 2));
        
        // Wait before retry if not the last attempt
        if (attempt < maxAttempts) {
          const delayMs = Math.pow(2, attempt - 1) * 500; // Exponential backoff
          console.log(`Waiting ${delayMs}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    if (!uploadSuccess) {
      console.error(`All ${maxAttempts} upload attempts failed for file: ${fullFileName}`);
      throw new Error(`Failed to upload to Google Cloud Storage after ${maxAttempts} attempts: ${uploadError ? uploadError.message : 'Unknown error'}`);
    }
    
    console.log(`Successfully uploaded file to GCS after ${maxAttempts <= 1 ? '1 attempt' : 'multiple attempts'}: ${fullFileName}`);

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fullFileName}`;
    console.log(`Generated public URL: ${publicUrl}`);
    
    // Verify the URL is accessible
    try {
      const urlCheckResponse = await fetch(publicUrl, { method: 'HEAD' });
      if (urlCheckResponse.ok) {
        console.log(`URL verification successful: ${publicUrl} is accessible (${urlCheckResponse.status})`);
      } else {
        console.warn(`URL verification warning: ${publicUrl} returned status ${urlCheckResponse.status}`);
      }
    } catch (urlError) {
      console.warn(`URL verification error: ${urlError.message}`);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fullFileName,
      itineraryId: itineraryId,
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    // Extract and log detailed error information
    const errorDetails = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
      // If there's a Google Cloud Storage specific error
      gcsError: error.errors ? JSON.stringify(error.errors) : undefined
    };
    
    console.error('Error details:', errorDetails);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to upload image',
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
