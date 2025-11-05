"use client";

import React from 'react'
import './ResNav.css'
import { Link as Scroll } from "react-scroll";
import Link from 'next/link'

import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const ResNavbar = () => {

    const [click, setClick] = React.useState(false)

    const handleClick = () => {
        setClick(!click)
    }


  return (
        <div className="ResNavbar-Component">
            <div className="ResNav-in">
                <div className="ResNav-one">
                    <h1>Smart Village <span>Revolution</span> </h1>
                </div>
                <div className="ResNav-two">
                    {click ? <IoClose onClick={handleClick} /> : <FaBars onClick={handleClick} />}
                </div>
            </div>
            <div className={click ? 'Res-navigation' : 'nav-hide'}>
                <div className="Res-navigation-in">
                    <div className="Res-navigation-one">
                        <Scroll
                            to="home-two"
                            spy={true}
                            smooth={true}
                            offset={-70} 
                            duration={500}
                            onClick={handleClick}
                        >
                        About
                        </Scroll>
                    </div>
                    <div className="Res-navigation-two">
                        <Scroll
                            to="home-seven"
                            spy={true}
                            smooth={true}
                            offset={-70} 
                            duration={500}
                            onClick={handleClick}
                        >
                        Our Work
                        </Scroll>
                    </div>
                    <div className="Res-navigation-three">
                        <Scroll
                            to="home-eight"
                            spy={true}
                            smooth={true}
                            offset={-70} 
                            duration={500}
                            onClick={handleClick}
                        >
                        Annual Report
                        </Scroll>
                    </div>
                    <div className="Res-navigation-four">
                        <Scroll
                            to="home-nine"
                            spy={true}
                            smooth={true}
                            offset={-70} 
                            duration={500}
                            onClick={handleClick}
                        >
                        Team
                        </Scroll>
                    </div>
                    <div className="Res-navigation-five">
                        <Link href='https://sac.kluniversity.in' passHref={true} target='_blank'>KL SAC</Link>
                    </div>
                    <div className="Res-navigation-six">
                        <Link href='https://socialinternship.kluniversity.in' passHref={true} target='_blank'>Social Internship</Link>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default ResNavbar
