import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { getAuthCookie } from '@/src/helpers/auth';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authToken = await getAuthCookie();
    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get parameters
    const url = new URL(request.url);
    const itineraryId = url.searchParams.get('id');
    const bucketName = process.env.ITINERARY_BUCKET;
    
    if (!itineraryId) {
      return NextResponse.json(
        { error: 'Itinerary ID is required as a query parameter: ?id=your-itinerary-id' },
        { status: 400 }
      );
    }

    // Clean up the itinerary ID
    const cleanId = itineraryId.replace(/[^a-zA-Z0-9_-]/g, '');
    
    // Initialize GCS
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
        });
        
        console.log('GCS client initialized successfully');
      } else {
        return NextResponse.json(
          { error: 'No GCP_PROJECT_ID environment variable found' },
          { status: 500 }
        );
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: `Failed to initialize GCS client: ${error.message}` },
        { status: 500 }
      );
    }

    // Check bucket configuration
    if (!bucketName || !storage) {
      return NextResponse.json(
        { 
          error: 'GCS is not properly configured',
          details: {
            bucketName: bucketName || 'Not configured',
            hasStorage: !!storage,
            projectId: process.env.GCP_PROJECT_ID || 'Not configured'
          }
        },
        { status: 500 }
      );
    }

    // Create bucket instance
    const bucket = storage.bucket(bucketName);
    
    // Check if bucket exists
    try {
      const [exists] = await bucket.exists();
      if (!exists) {
        return NextResponse.json(
          { error: `Bucket '${bucketName}' does not exist` },
          { status: 404 }
        );
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: `Error checking bucket existence: ${error.message}` },
        { status: 500 }
      );
    }

    // Check folder path
    const folderPath = `itineraries/${cleanId}`;
    
    // Check if the folder marker exists
    const folderMarker = bucket.file(`${folderPath}/.keep`);
    let folderMarkerExists = false;
    let folderMarkerMetadata = null;
    
    try {
      const [exists] = await folderMarker.exists();
      folderMarkerExists = exists;
      
      if (exists) {
        const [metadata] = await folderMarker.getMetadata();
        folderMarkerMetadata = metadata;
      }
    } catch (error: any) {
      console.warn(`Error checking folder marker: ${error.message}`);
    }

    // List files in the folder
    let files: any[] = [];
    try {
      const [filesList] = await bucket.getFiles({
        prefix: folderPath,
      });
      
      files = await Promise.all(filesList.map(async file => {
        try {
          const [metadata] = await file.getMetadata();
          return {
            name: file.name,
            path: file.name,
            size: metadata.size,
            timeCreated: metadata.timeCreated,
            updated: metadata.updated,
            contentType: metadata.contentType,
            publicUrl: `https://storage.googleapis.com/${bucketName}/${file.name}`
          };
        } catch (e) {
          return {
            name: file.name,
            error: 'Failed to get metadata'
          };
        }
      }));
    } catch (error: any) {
      console.error('Error listing files:', error);
      // Continue with partial data
    }

    // Test creating a folder marker if it doesn't exist
    if (!folderMarkerExists) {
      try {
        console.log(`Creating directory marker for folder: ${folderPath}`);
        await folderMarker.save('', { 
          contentType: 'application/x-directory',
          metadata: {
            'x-goog-meta-directory': 'true',
            'x-goog-meta-itineraryId': cleanId
          }
        });
        
        console.log(`Directory marker created successfully`);
        
        // Verify creation
        const [verifyExists] = await folderMarker.exists();
        if (verifyExists) {
          console.log(`Verified: folder marker exists after creation`);
        } else {
          console.warn(`Folder marker creation verification failed`);
        }
      } catch (folderError: any) {
        console.error(`Failed to create folder marker: ${folderError.message}`);
      }
    }

    // Test creating a test file
    const testFileName = `${folderPath}/test-${Date.now()}.txt`;
    const testFile = bucket.file(testFileName);
    let testFileCreated = false;
    let testFileUrl = '';
    
    try {
      await testFile.save('This is a test file to verify write permissions.', {
        contentType: 'text/plain',
        metadata: {
          'x-goog-meta-test': 'true',
          'x-goog-meta-itineraryId': cleanId
        },
        public: true,
      });
      
      testFileCreated = true;
      testFileUrl = `https://storage.googleapis.com/${bucketName}/${testFileName}`;
      
      console.log(`Test file created successfully: ${testFileName}`);
    } catch (testError: any) {
      console.error(`Failed to create test file: ${testError.message}`);
    }

    // Return comprehensive diagnostics
    return NextResponse.json({
      success: true,
      diagnostics: {
        environment: process.env.NODE_ENV,
        gcsConfig: {
          bucketName,
          projectId: process.env.GCP_PROJECT_ID,
          hasCredentialsPath: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
        },
        itineraryId: {
          original: itineraryId,
          cleaned: cleanId,
          isTemporary: cleanId.startsWith('temp-')
        },
        folderPath,
        folderMarker: {
          exists: folderMarkerExists,
          path: `${folderPath}/.keep`,
          metadata: folderMarkerMetadata
        },
        testFile: {
          created: testFileCreated,
          path: testFileName,
          url: testFileUrl
        },
        files: {
          count: files.length,
          items: files
        }
      }
    });
  } catch (error: any) {
    console.error('Error in upload flow diagnostic endpoint:', error);
    return NextResponse.json(
      { 
        error: `Unexpected error: ${error.message}`,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}