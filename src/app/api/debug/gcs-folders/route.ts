import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { getAuthCookie } from '@/src/helpers/auth';

export const dynamic = "force-dynamic";

// Helper function to format metadata for display
const formatMetadata = (metadata: any) => {
  if (!metadata) return 'No metadata available';
  
  return {
    name: metadata.name,
    bucket: metadata.bucket,
    contentType: metadata.contentType,
    size: metadata.size,
    timeCreated: metadata.timeCreated,
    updated: metadata.updated,
    id: metadata.id,
    selfLink: metadata.selfLink,
    mediaLink: metadata.mediaLink,
    metadata: metadata.metadata
  };
};

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

    // Get bucket and folder path from query parameters
    const url = new URL(request.url);
    const bucketName = url.searchParams.get('bucket') || process.env.ITINERARY_BUCKET;
    const folderPath = url.searchParams.get('folder') || 'itineraries';
    
    if (!bucketName) {
      return NextResponse.json(
        { error: 'No bucket specified and no default bucket configured' },
        { status: 400 }
      );
    }

    console.log(`Debug request for GCS folder: ${folderPath} in bucket: ${bucketName}`);

    // Initialize GCS
    let storage: Storage;
    try {
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
    } catch (error: any) {
      console.error('Error initializing Google Cloud Storage client:', error);
      return NextResponse.json(
        { error: `Failed to initialize GCS client: ${error.message}` },
        { status: 500 }
      );
    }

    // Get bucket
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

    // Check for folder marker
    const folderMarker = bucket.file(`${folderPath}/.keep`);
    let folderMarkerExists = false;
    let folderMarkerMetadata = null;
    
    try {
      const [exists] = await folderMarker.exists();
      folderMarkerExists = exists;
      
      if (exists) {
        const [metadata] = await folderMarker.getMetadata();
        folderMarkerMetadata = formatMetadata(metadata);
      }
    } catch (error: any) {
      console.warn(`Error checking folder marker: ${error.message}`);
    }

    // List files in the folder
    let files: any[] = [];
    try {
      const [filesList] = await bucket.getFiles({
        prefix: folderPath,
        delimiter: '/' // This will get files directly in this folder, not nested
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
      return NextResponse.json(
        { 
          error: `Error listing files: ${error.message}`,
          bucketExists: true,
          folderMarkerExists,
          folderMarkerMetadata
        },
        { status: 500 }
      );
    }

    // List all subfolders
    const [subfolders] = await bucket.getFiles({
      prefix: `${folderPath}/`,
      delimiter: '/'
    });

    // Extract unique subfolder paths from prefixes
    const uniqueFolders = new Set<string>();
    subfolders.forEach(file => {
      const filePath = file.name;
      if (filePath.endsWith('/.keep')) {
        const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
        uniqueFolders.add(folderPath);
      } else {
        // Extract parent folder paths
        const pathParts = filePath.split('/');
        if (pathParts.length > 2) {
          // Create path up to second-to-last segment
          const folderPath = pathParts.slice(0, pathParts.length - 1).join('/');
          uniqueFolders.add(folderPath);
        }
      }
    });

    // Convert to array and sort
    const folders = Array.from(uniqueFolders).sort();

    return NextResponse.json({
      success: true,
      bucket: bucketName,
      folderPath,
      folderMarker: {
        exists: folderMarkerExists,
        path: `${folderPath}/.keep`,
        metadata: folderMarkerMetadata
      },
      fileCount: files.length,
      folderCount: folders.length,
      folders,
      files
    });
  } catch (error: any) {
    console.error('Error in GCS folder debug endpoint:', error);
    return NextResponse.json(
      { 
        error: `Unexpected error: ${error.message}`,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}