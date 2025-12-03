import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  className = '',
  ...props
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200';

  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const widthStyle = width ? (typeof width === 'number' ? `w-[${width}px]` : width) : 'w-full';
  const heightStyle = height ? (typeof height === 'number' ? `h-[${height}px]` : height) : '';

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${widthStyle} ${heightStyle} ${className}`.trim();

  return <div className={combinedClassName} {...props} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="aspect-[3/4] w-full" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />

        {/* Price */}
        <Skeleton variant="text" className="h-6 w-1/3" />

        {/* Sizes */}
        <div className="flex gap-2">
          <Skeleton variant="rectangular" className="h-6 w-12" />
          <Skeleton variant="rectangular" className="h-6 w-12" />
          <Skeleton variant="rectangular" className="h-6 w-12" />
        </div>
      </div>
    </div>
  );
}
