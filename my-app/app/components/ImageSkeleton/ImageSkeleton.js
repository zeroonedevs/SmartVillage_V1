"use client";
import React from 'react';
import './ImageSkeleton.css';

const ImageSkeleton = ({ variant = 'default', width = '100%', height = '100%' }) => {
  const skeletonClass = `image-skeleton ${variant}`;
  
  return (
    <div className={skeletonClass} style={{ width, height }}>
      <div className="skeleton-shimmer"></div>
    </div>
  );
};

export default ImageSkeleton;
