'use client';

import React from 'react';
import { BiImageAdd } from 'react-icons/bi';
import { HiX } from 'react-icons/hi';
import Input from '@/src/components/figma/Input';
import Button from '@/src/components/figma/Button';

interface ImagesSectionProps {
  images: string[];
  newImage: string;
  setNewImage: (value: string) => void;
  handleAddImage: () => void;
  handleRemoveImage: (index: number) => void;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({
  images,
  newImage,
  setNewImage,
  handleAddImage,
  handleRemoveImage
}) => {
  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4">Images</h4>
      
      <div className="flex items-end gap-2 mb-4">
        <div className="flex-grow">
          <p className="text-primary-gray text-left mb-1">Add Image URL</p>
          <Input
            type="text"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            icon={<BiImageAdd size={20} />}
            placeholder="Enter image URL"
          />
        </div>
        <Button
          type="button"
          onClick={handleAddImage}
          variant="secondary"
          className="py-4"
        >
          Add
        </Button>
      </div>
      
      {images && images.length > 0 && (
        <div className="space-y-2 mt-4">
          <p className="text-primary-gray">Added Images:</p>
          <div className="max-h-60 overflow-y-auto">
            {images.map((img, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-900 rounded-md mb-2">
                <div className="truncate flex-grow">{img}</div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <HiX size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesSection;