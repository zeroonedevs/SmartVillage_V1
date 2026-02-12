"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Link as Scroll } from "react-scroll";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import './Navigation.css';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation - Only shows after scroll */}
      {isScrolled && (
        <div className="navigation scrolled">
          <div className="nav-container">
            <div className="nav-links-container">
              <h1 className="nav-title-scrolled">
                Smart Village <span>Revolution</span>
              </h1>

              <div className="nav-links">
                <div className="dropdown">
                  <Scroll
                    className="nav-link"
                    to="home-two"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                  >
                    About
                  </Scroll>
                  <div className="dropdown-content">
                    <Link href="/mission">Vision & Mission</Link>
                    <Link href="/objectives">Objectives</Link>
                    <Link href="/organogram">Organogram</Link>
                    <Link href="/staff">Staff</Link>
                    <Link href="/villages">Villages</Link>
                  </div>
                </div>

                <Scroll
                  className="nav-link"
                  to="home-seven"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                >
                  Our Work
                </Scroll>

                <Scroll
                  className="nav-link"
                  to="home-eight"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                >
                  Annual Report
                </Scroll>

                <Scroll
                  className="nav-link"
                  to="home-five"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                >
                  Parameters
                </Scroll>

                <Link className="nav-link" href="/gallery">
                  Gallery
                </Link>

                <Link className="nav-link" href="/news">
                  News
                </Link>

                <Link className="nav-link" href="/GOP">
                  GOP
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation - Always visible */}
      <div className="mobile-nav">
        <div className="mobile-nav-header">
          <h1 className="mobile-nav-title">
            Smart Village <span>Revolution</span>
          </h1>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <IoClose /> : <FaBars />}
          </button>
        </div>

        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <div className="mobile-menu-section">
              <h3>About</h3>
              <Link href="/mission" onClick={closeMobileMenu}>Vision & Mission</Link>
              <Link href="/objectives" onClick={closeMobileMenu}>Objectives</Link>
              <Link href="/organogram" onClick={closeMobileMenu}>Organogram</Link>
              <Link href="/staff" onClick={closeMobileMenu}>Staff</Link>
              <Link href="/villages" onClick={closeMobileMenu}>Villages</Link>
            </div>

            <Scroll
              to="home-seven"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={closeMobileMenu}
            >
              Our Work
            </Scroll>

            <Scroll
              to="home-eight"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={closeMobileMenu}
            >
              Annual Report
            </Scroll>

            <Scroll
              to="home-five"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={closeMobileMenu}
            >
              Parameters
            </Scroll>

            <Link href="/gallery" onClick={closeMobileMenu}>
              Gallery
            </Link>

            <Link href="/news" onClick={closeMobileMenu}>
              News
            </Link>

            <Link href="/GOP" onClick={closeMobileMenu}>
              GOP
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
