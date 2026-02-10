"use client";
import { useEffect, useState } from 'react';
import './Loader.css';

const Loader = () => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Trigger fade out animation
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 2000);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`loader-container ${fadeOut ? 'fade-out' : ''}`}>
            <div className="loader-content">
                {/* Animated Logo/Icon */}
                <div className="loader-icon">
                    <div className="loader-plant">
                        <svg width="120" height="140" viewBox="0 0 237 255" xmlns="http://www.w3.org/2000/svg">
                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                                <g transform="translate(-589.000000, -2185.000000)" stroke="#008000" strokeWidth="3">
                                    <g transform="translate(591.000000, 2187.000000)">
                                        <g className="stems">
                                            <path className="main-stem" d="M133.4414,160.118 L133.4414,31.451" />
                                            <path className="outer-stems" d="M133.4416,146.522 L72.3706,85.451" />
                                            <path className="outer-stems" d="M133.8455,146.522 194.9165,85.451" />
                                        </g>
                                        <g className="leaves">
                                            <path d="M133.4414,98.0008 C133.4414,98.0008 185.4414,78.0008 133.4414,0.0008 C81.4414,78.0008 133.4414,98.0008 133.4414,98.0008" />
                                            <path d="M159.3208,121.0467 C159.3208,121.0467 200.5998,139.3927 215.5058,64.8617 C140.9748,79.7687 159.3208,121.0467 159.3208,121.0467" />
                                            <path d="M107.9663,121.0467 C107.9663,121.0467 66.6873,139.3927 51.7813,64.8617 C126.3123,79.7687 107.9663,121.0467 107.9663,121.0467" />
                                        </g>
                                        <g className="ground">
                                            <path d="M64.0483,188.6473 C70.1213,172.4103 98.5983,160.1183 132.8343,160.1183 C167.8373,160.1183 196.8373,172.9633 202.0113,189.7403" />
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="loader-title">Smart Village Revolution</h1>
                
                {/* Subtitle */}
                <p className="loader-subtitle">Powered by K L Deemed to be University</p>

                {/* Loading Spinner */}
                <div className="loader-spinner">
                    <div className="spinner-ring"></div>
                </div>

                {/* Footer */}
                <p className="loader-footer">Designed & Developed by ZeroOne Code Club</p>
            </div>
        </div>
    );
};

export default Loader;
