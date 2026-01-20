"use client"
import { useEffect, useState } from 'react';

const SvgAnimation = () => {

    const drawMainStem = () => {
        const paths = document.querySelectorAll('.main-stem');
        paths.forEach(path => {
            const length = path.getTotalLength();
            path.style.transition = path.style.WebkitTransition = 'none';
            path.style.strokeDasharray = `${length} ${length}`;
            path.style.strokeDashoffset = length;
            path.getBoundingClientRect(); // Trigger a reflow
            path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 1.5s 0s ease-in-out';
            path.style.strokeDashoffset = '0';
        });
    };

    const drawStems = () => {
        const paths = document.querySelectorAll('.outer-stems');
        paths.forEach(path => {
            const length = path.getTotalLength();
            path.style.transition = path.style.WebkitTransition = 'none';
            path.style.strokeDasharray = `${length} ${length}`;
            path.style.strokeDashoffset = length;
            path.getBoundingClientRect(); // Trigger a reflow
            path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 1s 0.4s ease-in-out';
            path.style.strokeDashoffset = '0';
        });
    };

    const drawLeaves = () => {
        const paths = document.querySelectorAll('.leaves path');
        paths.forEach(path => {
            const length = path.getTotalLength();
            path.style.transition = path.style.WebkitTransition = 'none';
            path.style.strokeDasharray = `${length} ${length}`;
            path.style.strokeDashoffset = length;
            path.getBoundingClientRect(); // Trigger a reflow
            path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 1.5s 1s ease-in-out';
            path.style.strokeDashoffset = '0';
        });
    };

    // Handle click event
    const handleClick = () => {
        drawMainStem();
        drawStems();
        drawLeaves();
    };

    // Animate SVG on component mount
    useEffect(() => {
        drawMainStem();
        drawStems();
        drawLeaves();
    }, []);

    // JSX for the component
    return (
        <div onClick={handleClick} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'white',
        }}>
             <svg width="237px" height="255px" viewBox="15 0 237 255" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                    <g transform="translate(-589.000000, -2185.000000)" stroke="green" strokeWidth={4}>
                        <g transform="translate(591.000000, 2187.000000)">
                            <g className="stems">
                                <path className="main-stem" d="M133.4414,160.118 L133.4414,31.451" id="Stroke-7"></path>
                                <path className="outer-stems" style={{ WebkitTransitionDelay: '1s', transitionDelay: '1s' }} d="M133.4416,146.522 L72.3706,85.451" id="Stroke-15"></path>
                                <path className="outer-stems" d="M133.8455,146.522 194.9165,85.451" id="Stroke-13"></path>
                            </g>
                            <g className="leaves">
                                <path d="M133.4414,98.0008 C133.4414,98.0008 185.4414,78.0008 133.4414,0.0008 C81.4414,78.0008 133.4414,98.0008 133.4414,98.0008" id="Stroke-1"></path>
                                <path d="M159.3208,121.0467 C159.3208,121.0467 200.5998,139.3927 215.5058,64.8617 C140.9748,79.7687 159.3208,121.0467 159.3208,121.0467" id="Stroke-3"></path>
                                <path d="M107.9663,121.0467 C107.9663,121.0467 66.6873,139.3927 51.7813,64.8617 C126.3123,79.7687 107.9663,121.0467 107.9663,121.0467" id="Stroke-5"></path>
                            </g>
                            <g className="ground">
                              <path d="M64.0483,188.6473 C70.1213,172.4103 98.5983,160.1183 132.8343,160.1183 C167.8373,160.1183 196.8373,172.9633 202.0113,189.7403" id="Stroke-35"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
            <div style={{ textAlign: 'center'}}>
              <h1 style={{ fontSize: '2rem', color: 'green' }}>Smart Village Revolution</h1>
              <p>Powered by</p>
              <h2>K L Deemed to be University</h2>
            </div>
            <div style={{ textAlign: 'center', backgroundColor: 'white', width: '100%', position: 'absolute', bottom: 0, color: 'black', padding: '10px', fontSize: '.8rem'}}>
              <p>Designed & Developed by ZeroOne Code Club</p>
            </div>

        </div>
    );
};

export default SvgAnimation;
