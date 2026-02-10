"use client";
import React, { useEffect, useState } from "react";
import HeroImage from "./hero";
import MultiImageDisplay from "./displayAsset";
import Footer from "../../components/SmallFooter/footer";
import "./page.css";
import { FaArrowLeft } from "react-icons/fa";
// import { galleryImages } from "./image.js";
import GalleryHeroImage from "../../Assets/GalleryImage.jpeg";

const backToHome = () => {
  window.location.href = "/";
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

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
          // Map API data to component format
          const formattedImages = data.data.map(img => ({
            id: img._id,
            image: img.imageLink, // Correct field name from API/Model
            domain: img.domain || "Uncategorized", // Correct field name
            ...img
          }));
          
          setImages(formattedImages);
          setFilteredImages(formattedImages);
          
          // Only process URL params after data is loaded
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

  // Get unique domains from the fetched images
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
    setVisibleCount(12); // Reset visible count when changing domains
  };

  const currentImages = filteredImages.slice(0, visibleCount);

  return (
    <div className="gallery">
      <div className="gallery-main">
        <div className="hero-image">
          <HeroImage imagePath={GalleryHeroImage.src} />
        </div>
        <div className="g-one">
          <div className="g-one-in">
            <h1>Capturing the Spirit: Moments of SVR Through the Years</h1>
            <p>
              Our gallery is a tribute to the countless memories we've created together.
            </p>
          </div>
        </div>

        {loading ? (
             <div className="min-h-[400px] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
             </div>
        ) : (
            <>
                <div className="gallery-options">
                  <div className="gallery-options-in">
                    {domains.map((domain) => (
                      <button
                        key={domain}
                        className={`gallery-option ${selectedDomain === domain ? "active" : ""}`}
                        onClick={() => handleDomainFilter(domain)}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>
                
                {filteredImages.length > 0 ? (
                    <div className="gallery-three">
                      <MultiImageDisplay 
                        imagePaths={currentImages} 
                        groupByDomain={selectedDomain === "All"}
                      />
                      {/* Load More Button could go here if needed */}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p>No images found for this category.</p>
                    </div>
                )}
            </>
        )}

        <div className="back-to-home">
          <a href="/" className="BackToHome" onClick={backToHome}>
            <FaArrowLeft />
          </a>
          {showScrollToTop && (
            <button onClick={scrollToTop} className="back-to-top-button">
              Scroll to Top
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
