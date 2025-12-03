'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Media } from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface ProductImageGalleryProps {
  images: Media[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={getStrapiMediaUrl(selectedImage.url)}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority={selectedIndex === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition ${
                index === selectedIndex
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={getStrapiMediaUrl(image.url)}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
