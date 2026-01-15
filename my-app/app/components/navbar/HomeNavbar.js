import React from 'react';
import './HomeNavbar.css';
import Link from 'next/link';
import { Link as Scroll } from "react-scroll";
import SVRLogo from '../../Assets/svr.png';
import KLLogo from '../../Assets/kllogo.png';
import Image from 'next/image';

const HomeNavbar = () => {
  return (
    <div className="HomeNavBar">
      <div className="HomeNavBar-in">
        <div className="HomeNavBar-in-one">
          <div className="HomeNavBar-in-one-in">
            <div className="HomeNavBar-in-one-in-one">
              <Image
                src={SVRLogo}
                className='SVRLogo'
                width={200}
                height={200}
                alt=""
              />
              <h1>Smart Village <span>Revolution</span> </h1>
            </div>
            <div className="HomeNavBar-in-one-in-two">
              <Link href={"https://kluniversity.in"} legacyBehavior className='HomeNavBar-in-one-in-logo'>
                <a target="_blank" rel="noopener noreferrer">
                  <Image
                    className='HomeNavBar-in-one-in-logo-image'
                    src={KLLogo}
                    alt="KL Logo"
                    width={200}
                    height={200}
                  />
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="HomeNavBar-in-two">
          <div className="HomeNavBar-in-two-in">
            <Scroll
              className="HomeNavBar-in-two-in-scroll"
              to="home-seven"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              Our Work
            </Scroll>
            <Scroll
              className="HomeNavBar-in-two-in-scroll"
              to="home-eight"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              Annual Report
            </Scroll>
            <Scroll
              className="HomeNavBar-in-two-in-scroll"
              to="home-eight"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              Parameters
            </Scroll>

            <Link className="HomeNavBar-in-two-in-scroll" href="/gallery">
              Gallery
            </Link>
            <Link className="HomeNavBar-in-two-in-scroll" href="/news">
              News
            </Link>
            <Link
              className="HomeNavBar-in-two-in-scroll"
              href='https://sac-kluniversity.vercel.app' passHref={true} target='_blank'>
              KL SAC
            </Link>
            <Link
              className="HomeNavBar-in-two-in-scroll"
              href='/GOP'>
              GOP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbar;
