"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ImageSkeleton from "../ImageSkeleton/ImageSkeleton";
import { fetchImages } from "./handleAsset";
import SVRLogo from '../../Assets/svr.png';
import KLLogo from '../../Assets/kllogo.png';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./page.css";

const HeroSection = () => {
  const [images, setImages] = useState([]);
  const [imageInfo, setImageInfo] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageList = await fetchImages();
        setImages(imageList);
        const infoList = [
            "Social Awareness",
            "Society Awareness",
            "Women Empowerment",
            "Culture and Community",
        ];
        
        setImageInfo(infoList); 
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  return (
    <div className="hero">
      {/* Hero Header with Logos */}
      <div className="hero-header">
        <Link href="https://kluniversity.in" target="_blank" rel="noopener noreferrer" className="hero-kl-box">
          <Image
            className="hero-kl-logo"
            src={KLLogo}
            alt="KL University Logo"
            width={100}
            height={100}
          />
        </Link>
        <div className="hero-svr-box">
          <Image
            src={SVRLogo}
            className="hero-svr-logo"
            width={70}
            height={70}
            alt="SVR Logo"
          />
          <h1 className="hero-title">
            Smart Village <span>Revolution</span>
          </h1>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="hero-in">
        {loading ? (
          <ImageSkeleton variant="hero" />
        ) : (
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{
              clickable: true,
            }}
            navigation={false}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="hero-in-slider">
                  <img
                    className="home-hero-images"
                    src={image.url}
                    alt={`Image ${index}`}
                  />
                  <div className="image-info">
                    <p>{imageInfo[index]}</p> 
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
