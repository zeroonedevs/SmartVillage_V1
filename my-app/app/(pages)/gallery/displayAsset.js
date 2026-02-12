import React, { useState } from "react";
import { FaExpand, FaTimes, FaDownload, FaShareAlt } from "react-icons/fa";

const MultiImageDisplay = ({ imagePaths, groupByDomain = false }) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  // Dynamic Grid Class Helper
  const getGridClass = (count) => {
    if (count === 0) return "";
    if (count === 1) return "grid grid-cols-1 max-w-2xl mx-auto";
    if (count === 2) return "grid grid-cols-1 sm:grid-cols-2";
    if (count === 3) return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    if (count === 4) return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  };

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const openFullscreen = (image) => {
    setFullscreenImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = "auto";
  };

  // Group images by domain if requested
  const groupedImages = imagePaths.reduce((acc, image) => {
    const domain = image.domain || "Other";
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(image);
    return acc;
  }, {});

  return (
    <div className="w-full">
      {groupByDomain ? (
        Object.keys(groupedImages).map((domain) => (
          <div key={domain} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-800 relative pl-4 border-l-4 border-[#008000]">
                {domain}
              </h3>
              <div className="h-px bg-gray-200 flex-grow"></div>
              <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                {groupedImages[domain].length} Photos
              </span>
            </div>

            {/* Standard Grid Layout */}
            <div className={`${getGridClass(groupedImages[domain].length)} gap-4 w-full`}>
              {groupedImages[domain].map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-100"
                  onClick={() => openFullscreen(image)}
                >
                  {/* Skeleton Loader */}
                  {!loadedImages[image.id] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}

                  <img
                    src={image.image}
                    alt={image.description || image.domain}
                    onLoad={() => handleImageLoad(image.id)}
                    className={`w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 ${loadedImages[image.id] ? 'opacity-100' : 'opacity-0'}`}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold rounded-md mb-2">
                        {image.domain}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        /* Standard Grid Layout - Flat List */
        <div className={`${getGridClass(imagePaths.length)} gap-4 w-full`}>
          {imagePaths.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-100"
              onClick={() => openFullscreen(image)}
            >
              {/* Skeleton Loader */}
              {!loadedImages[image.id] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              )}

              <img
                src={image.image}
                alt={image.description || image.domain}
                onLoad={() => handleImageLoad(image.id)}
                className={`w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 ${loadedImages[image.id] ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold rounded-md mb-2">
                    {image.domain}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Modal ... */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeFullscreen}
        >
          <button
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            onClick={closeFullscreen}
          >
            <FaTimes size={24} />
          </button>

          <div
            className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={fullscreenImage.image}
              alt={fullscreenImage.domain}
              className="max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl"
            />

            <div className="mt-6 flex items-center gap-6">
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full flex gap-6 border border-white/10">
                <button className="text-white hover:text-green-400 transition-colors flex items-center gap-2">
                  <FaDownload /> <span className="text-sm font-medium">Download</span>
                </button>
                <div className="w-px bg-white/20 h-4"></div>
                <button className="text-white hover:text-orange-400 transition-colors flex items-center gap-2">
                  <FaShareAlt /> <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageDisplay;