'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/20/solid';
import Button from '../figma/Button';
import { getClientSession } from '@/src/lib/session';
import toast from 'react-hot-toast';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onSuccess: (imageUrl: string) => void;
  className?: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImageUrl,
  onSuccess,
  className = '',
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = getClientSession();

  // Format file size in KB or MB
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    }
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 500KB)
      if (file.size > 500 * 1024) {
        toast.error('File size exceeds 500KB limit');
        return;
      }

      // Check file type (only accept image files)
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !session.user?.user_id) {
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Import the required modules
      const { getLocalStorageItem } = await import('@/src/utils/browserStorage');
      const { default: actotaApi } = await import('@/src/lib/apiClient');

      // Get the API base URL from the environment or client environment
      let apiBaseUrl;

      // Try to get from clientEnv first
      try {
        const { clientEnv } = await import('@/src/lib/config/client-env');
        apiBaseUrl = clientEnv.NEXT_PUBLIC_API_URL;
      } catch (error) {
        console.log('Could not import clientEnv, falling back to defaults');
      }

      // Fallback to default if not available
      if (!apiBaseUrl) {
        apiBaseUrl = "http://localhost:8080/api";
      }

      // Ensure it ends with /api
      if (!apiBaseUrl.endsWith('/api')) {
        apiBaseUrl = `${apiBaseUrl}/api`;
      }

      console.log('Using API base URL:', apiBaseUrl);

      // Get the auth token directly from the session in client-side context
      let token;

      // First check if available in the current session
      if (session?.accessToken) {
        token = session.accessToken;
        console.log('Using token from session');
      } else {
        // Fallback to localStorage
        token = getLocalStorageItem('token');
        console.log('Using token from localStorage:', !!token);

        // If we still don't have a token, try to get it from a cookie directly
        if (!token) {
          try {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
              const [name, value] = cookie.trim().split('=');
              if (name === 'auth_token') {
                token = decodeURIComponent(value);
                console.log('Using token from cookie');
                break;
              }
            }
          } catch (error) {
            console.error('Error accessing cookies:', error);
          }
        }
      }

      // Log token status for debugging (don't log the actual token)
      console.log('Auth token available:', !!token);

      // Use the Next.js API route which will handle authentication properly
      console.log('Uploading file via Next.js API route');

      // Log file info
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`
      });

      // Add user ID to formData
      formData.append('userId', session.user.user_id);

      // Make request to Next.js API route
      const response = await fetch('/api/profile-picture-upload', {
        method: 'POST',
        body: formData,
      });

      // Log the response for debugging
      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Upload response data:', data);

      if (data.success && data.profile_picture_url) {
        toast.success('Profile picture updated successfully');
        onSuccess(data.profile_picture_url);
      } else {
        throw new Error('Upload response did not contain the expected data');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const displayImage = previewUrl || currentImageUrl || '/images/Avatar.png';

  return (
    <div className={`flex flex-col ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif"
        className="hidden"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image 
              src={displayImage} 
              alt="Profile" 
              fill 
              style={{ objectFit: 'cover' }} 
              className="rounded-full"
            />
          </div>
          <div className="text-white flex flex-col gap-1">
            <div className="font-bold text-base leading-6">Profile Picture</div>
            <div className="flex flex-wrap gap-2 items-center text-sm text-primary-gray">
              <div>JPEG or PNG</div>
              <div>•</div>
              <div>Recommended 500 x 500px, max 500KB.</div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {previewUrl && (
            <Button
              variant="primary"
              size="sm"
              className="flex gap-2 items-center py-2.5 !px-4"
              onClick={uploadImage}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Save'}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="flex gap-2 items-center py-2.5 !px-4"
            onClick={triggerFileInput}
            disabled={uploading}
          >
            {previewUrl ? 'Change Picture' : 'Upload New Picture'} <PlusIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;