"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ImageSkeleton from "../ImageSkeleton/ImageSkeleton";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Reuse existing styles or update
import "../homeHero/page.css";
// Adjust path to images if needed, or import them directly if static
import SVRLogo from '../../Assets/svr.png';
import KLLogo from '../../Assets/kllogo.png';

const HeroSlider = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await fetch('/api/hero');
                const data = await response.json();
                if (data.success) {
                    setSlides(data.data.filter(s => s.isActive));
                }
            } catch (error) {
                console.error("Error fetching hero slides:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
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
                        spaceBetween={0}
                        centeredSlides={true}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        navigation={false}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                    >
                        {slides.length > 0 ? (
                            slides.map((slide, index) => (
                                <SwiperSlide key={slide._id || index}>
                                    <div className="hero-in-slider relative w-full h-full">
                                        <img
                                            className="home-hero-images w-full h-full object-cover"
                                            src={slide.image}
                                            alt={slide.title}
                                        />
                                        <div className="image-info">
                                            <p>{slide.title}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))
                        ) : (
                            // Fallback if no slides
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <p>No slides available</p>
                            </div>
                        )}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default HeroSlider;
