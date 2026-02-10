"use client";
import React, { useState } from 'react';
import './gallery-cards.css';

const MultiImageDisplay = ({ imagePaths, groupByDomain = false }) => {
  const [loadedImages, setLoadedImages] = useState({});
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  const openFullscreen = (image) => {
    setFullscreenImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = 'auto';
  };

  // Group images by domain if needed
  const groupedImages = groupByDomain ? 
    imagePaths.reduce((acc, img) => {
      const domain = img.domain || 'Uncategorized';
      if (!acc[domain]) acc[domain] = [];
      acc[domain].push(img);
      return acc;
    }, {}) : 
    { 'All': imagePaths };

  return (
    <>
      <div className="professional-gallery">
        {Object.entries(groupedImages).map(([domain, images]) => (
          <div key={domain} className="domain-section">
            {groupByDomain && (
              <div className="domain-header">
                <h2 className="domain-title">{domain}</h2>
                <div className="domain-divider"></div>
              </div>
            )}
            
            <div className="gallery-grid">
              {images.map((image) => (
                <div 
                  key={image.id} 
                  className="gallery-card"
                  onClick={() => openFullscreen(image)}
                >
                  <div className="card-image-wrapper">
                    {!loadedImages[image.id] && (
                      <div className="image-skeleton">
                        <div className="skeleton-shimmer"></div>
                      </div>
                    )}
                    <img 
                      src={image.image} 
                      alt={image.description || image.domain}
                      onLoad={() => handleImageLoad(image.id)}
                      className={`card-image ${loadedImages[image.id] ? 'loaded' : ''}`}
                    />
                    <div className="card-overlay">
                      <div className="overlay-content">
                        <span className="overlay-domain">{image.domain}</span>
                        <svg className="expand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div className="fullscreen-modal" onClick={closeFullscreen}>
          <button className="fullscreen-close" onClick={closeFullscreen}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={fullscreenImage.image} 
              alt={fullscreenImage.description || fullscreenImage.domain}
              className="fullscreen-image"
            />
            <div className="fullscreen-info">
              <span className="fullscreen-domain">{fullscreenImage.domain}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MultiImageDisplay;