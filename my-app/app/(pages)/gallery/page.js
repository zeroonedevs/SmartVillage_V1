"use client";
import React, { useEffect, useState } from "react";
import MultiImageDisplay from "./displayAsset";
import Footer from "../../components/SmallFooter/footer";
import { FaArrowUp, FaImages, FaArrowLeft, FaTree, FaLaptop, FaUsers } from "react-icons/fa";
import Link from 'next/link';

const App = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/dashboard/gallery');
        const data = await response.json();

        if (data.success) {
          const formattedImages = data.data.map(img => ({
            id: img._id,
            image: img.imageLink,
            domain: img.domain || "Uncategorized",
            ...img
          }));

          setImages(formattedImages);
          setFilteredImages(formattedImages);

          const urlParams = new URLSearchParams(window.location.search);
          const domainFromUrl = urlParams.get("domain");

          if (domainFromUrl) {
            setSelectedDomain(domainFromUrl);
            const filtered = formattedImages.filter((img) => img.domain === domainFromUrl);
            setFilteredImages(filtered);
          }
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const domains = ["All", ...Array.from(new Set(images.map((img) => img.domain))).filter(Boolean)];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 850);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDomainFilter = (domain) => {
    setSelectedDomain(domain);
    if (domain === "All") {
      setFilteredImages(images);
    } else {
      const filtered = images.filter((img) => img.domain === domain);
      setFilteredImages(filtered);
    }
    setVisibleCount(12);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentImages = filteredImages;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gray-200 selection:text-[#008000]">

      {/* Scroll To Top Button */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${showScrollToTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-[#008000] hover:bg-[#008000] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008000]"
        >
          <FaArrowUp />
        </button>
      </div>

      {/* Modern Hero Header - Clean Green Theme */}
      <div className="bg-[#008000] text-white relative overflow-hidden">
        {/* Clean background - removed patterns/blobs */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

            {/* Left Column: Text */}
            <div className="max-w-2xl text-center lg:text-left z-20">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-white drop-shadow-sm">
                Capturing the Spirit: <br /> <span className="text-orange-400">Moments of SVR</span>
              </h1>
              <p className="text-lg md:text-xl text-white max-w-xl mx-auto lg:mx-0 leading-relaxed font-light mb-8">
                Our gallery is a tribute to the countless memories, community efforts, and village transformations we've achieved together.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Full Width with no limits */}
      <div className="w-full px-8 md:px-12 -mt-10 relative z-20 pb-20">

        {/* Navigation / Breadcrumb Area - Centered for consistency with Hero if needed, or left-aligned */}
        <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto w-full">
          <div className="bg-white p-1 rounded-xl shadow-lg border border-gray-100 inline-flex">
            <Link href="/" className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm no-underline">Home</Link>
            <span className="px-6 py-2.5 rounded-lg bg-gray-100 text-[#008000] font-semibold shadow-sm text-sm">Gallery</span>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[400px] flex flex-col justify-center items-center gap-4">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#008000] rounded-full animate-spin"></div>
            <p className="text-[#008000] font-medium animate-pulse">Loading Memories...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Filter Tabs - Pill Style */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => handleDomainFilter(domain)}
                  className={`
                        px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm border
                        ${selectedDomain === domain
                      ? "bg-[#008000] text-white border-[#008000] scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#008000] hover:text-[#008000] hover:bg-gray-50"
                    }
                      `}
                >
                  {domain}
                </button>
              ))}
            </div>

            {filteredImages.length > 0 ? (
              <div className="">
                <MultiImageDisplay
                  imagePaths={currentImages}
                  groupByDomain={false}
                />
              </div>
            ) : (
              <div className="text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No images found</h3>
                <p className="text-gray-500">Try selecting a different category.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-green-100">
        <Footer />
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
         @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 1s;
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite 0.5s;
        }
        .animate-spin-slow {
           animation: spin 20s linear infinite;
        }
        @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
