"use client";
import React, { useEffect, useState } from "react";
import HeroImage from "./hero";
import MultiImageDisplay from "./displayAsset";
import Footer from "../../components/SmallFooter/footer";
import "./page.css";
import { FaArrowLeft } from "react-icons/fa";
import { galleryImages } from "./image.js";
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

  // Get unique domains from the gallery images
  const domains = ["All", ...Array.from(new Set(galleryImages.map((img) => img.domain)))];

  useEffect(() => {
    // Get the domain from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const domainFromUrl = urlParams.get("domain");

    // Initialize with all images from the image.js file
    setImages(galleryImages);

    // If domain is specified in URL, filter images accordingly
    if (domainFromUrl) {
      setSelectedDomain(domainFromUrl);
      const filtered = galleryImages.filter((img) => img.domain === domainFromUrl);
      setFilteredImages(filtered);
    } else {
      setFilteredImages(galleryImages);
    }
  }, []);

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
      setFilteredImages(galleryImages);
    } else {
      const filtered = galleryImages.filter((img) => img.domain === domain);
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
        <div className="gallery-three">
          <MultiImageDisplay imagePaths={currentImages} />
        </div>
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
