'use client';

import React, { useState, useRef } from 'react';
import { BiCloudUpload } from 'react-icons/bi';
import { HiX } from 'react-icons/hi';
import { FiImage } from 'react-icons/fi';

// A temporary image object stored before final upload
interface TempImage {
  id: string;
  file: File;
  previewUrl: string;
}

interface ImageUploaderProps {
  tempImages: TempImage[];
  onAddTempImages: (newImages: File[]) => void;
  onRemoveTempImage: (id: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  tempImages,
  onAddTempImages,
  onRemoveTempImage
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleNewFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleNewFiles(files);
    
    // Reset the file input so the same file can be selected again
    e.target.value = '';
  };
  
  const handleNewFiles = (files: File[]) => {
    // Filter for valid image types
    const imageFiles = files.filter(file => {
      const fileType = file.type.toLowerCase();
      return fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png';
    });
    
    if (imageFiles.length === 0) {
      alert('Please use only JPEG, JPG, or PNG images.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Pass the filtered files to the parent component
      onAddTempImages(imageFiles);
    } catch (error) {
      console.error('Error processing images:', error);
      alert(`Failed to process images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4">Images</h4>
      
      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="pointer-events-none">
          <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-400 mb-2">
            Drag and drop images here, or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-500 hover:text-blue-600 pointer-events-auto"
              disabled={isProcessing}
            >
              browse
            </button>
          </p>
          <p className="text-sm text-gray-500">
            Supports: JPG, JPEG, PNG (max 5MB)
          </p>
        </div>
        
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <div className="text-white flex items-center gap-2">
              <BiCloudUpload className="animate-pulse" size={24} />
              <span>Processing...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Image Previews */}
      {tempImages.length > 0 && (
        <div className="space-y-2 mt-4">
          <p className="text-primary-gray">Selected Images ({tempImages.length}):</p>
          <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto">
            {tempImages.map((img) => (
              <div key={img.id} className="relative group">
                <img 
                  src={img.previewUrl} 
                  alt={`Preview for ${img.file.name}`}
                  className="w-full h-32 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                  }}
                />
                <button
                  type="button"
                  onClick={() => onRemoveTempImage(img.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <HiX size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                  {img.file.name}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Images will be uploaded after the itinerary is created
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;