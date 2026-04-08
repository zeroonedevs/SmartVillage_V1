"use client";
import { useEffect, useState } from 'react';
import './Loader.css';

const Loader = () => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`loader-container ${fadeOut ? 'fade-out' : ''}`}>
            <div className="loader-content">
                <svg className="loader-svg" viewBox="0 0 1320 560">
                    <text className="loader-text" x="50%" y="38%" dy=".35em" textAnchor="middle">
                        Smart Village
                    </text>
                    <text className="loader-text" x="50%" y="68%" dy=".35em" textAnchor="middle">
                        Revolution
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default Loader;
