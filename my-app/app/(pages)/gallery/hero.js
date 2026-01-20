"use client"
import React from "react";
import Image from 'next/image';
import './page.css';

const HeroImage = ({ imagePath }) => {
  return (
    <div className="hero-image-prime">
      <img 
        src={imagePath} 
        alt="Gallery Hero" 
        style={{ 
          width: "100%", 
          objectFit: "cover", 
          objectPosition: "center", 
          margin: "0px", 
          border: "2px solid green", 
          borderRadius: "10px" 
        }} 
      />
    </div>
  );
};

export default HeroImage;
