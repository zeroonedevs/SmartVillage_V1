import React from 'react';
import Image from 'next/image';
import Tree from '../../Assets/Tree.png';
import { Link as ScrollLink } from 'react-scroll';
import './Footer.css';
import Link from 'next/link';
import { FaInstagram, FaLock } from 'react-icons/fa';

const Footer = () => {  const currentYear = new Date().getFullYear();

  return (
    <div className="Footer">
      <div className="Footer-in">
        <div className="Footer-one">
          <div className="Footer-one-in">
            <h1>The goal of Smart Village Revolution (SVR) is to translate this comprehensive and organic vision of Mahatma Gandhi into reality, keeping in view the present context.</h1>
          </div>
        </div>
        <div className="Footer-two">
          <div className="Footer-two-in">
            <div className="Footer-two-in-one">
              <div className="Footer-two-in-one-in">
                <div className="Footer-two-in-one-in-one">
                  <Image src={Tree} alt="Tree" width={200} height={200} />
                </div>
                <div className="Footer-two-in-one-in-two">
                  <p>Grassroots Research and Advocacy Movement (GRAAM) is an Indian public policy initiative specializing in research, evaluation, community consultation, policy engagement, strategic consultation, and academic programs.</p>
                </div>
              </div>
            </div>
            <div className="Footer-two-in-two">
              <div className="Footer-two-in-two-in">
                <div className="Footer-two-in-two-in-boxes">
                  <div className="Footer-two-in-two-in-boxes-in">
                    <h3>Our Collaborations</h3>
                    <ul>
                      <li>
                        <Link href="https://ap.gov.in/#/" target='_blank' rel="noopener noreferrer">Government of Andhra Pradesh</Link>
                      </li>
                      <li>
                        <Link href="https://saanjhi.dord.gov.in/" target="_blank" rel="noopener noreferrer">Sansad Adarsh Gram Yojana</Link>
                      </li>
                      <li>
                        <Link href="http://graam.org.in" target="_blank" rel="noopener noreferrer">GRAAM</Link>
                      </li>
                      <li>
                        <Link href="https://sac.kluniversity.in/" target="_blank" rel="noopener noreferrer">KL SAC</Link>
                      </li>
                      <li>
                        <Link href='https://socialinternship.kluniversity.in' target="_blank" rel="noopener noreferrer">Social Internship</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Footer-two-in-two-in-boxes">
                  <div className="Footer-two-in-two-in-boxes-in">
                    <h3>Quick Links</h3>
                    <ul>
                      <li>
                        <ScrollLink to="home-two" offset={-70} smooth={true} duration={600}>About</ScrollLink>
                      </li>
                      <li>
                        <ScrollLink to="home-seven" offset={-70} smooth={true} duration={600}>Our Work</ScrollLink>
                      </li>
                      <li>
                        <ScrollLink to="home-five" offset={-70} smooth={true} duration={600}>Parameters</ScrollLink>
                      </li>
                      <li>
                        <Link href='/gallery'>Gallery</Link>
                      </li>
                      <li>
                        <Link href='/news'>News</Link>
                      </li>
                      <li>
                        <Link href='/GOP'>GOP</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Footer-two-in-two-in-boxes">
                  <div className="Footer-two-in-two-in-boxes-in">
                    <h3>Resources</h3>
                    <ul>
                      <li>
                        <ScrollLink to="home-eight" offset={-70} smooth={true} duration={600}>Annual Reports</ScrollLink>
                      </li>
                      <li>
                        <Link href='/awards' target="_blank" rel="noopener noreferrer">Awards List</Link>
                      </li>
                      <li>
                        <Link href='/villages' target="_blank" rel="noopener noreferrer">Villages Adopted</Link>
                      </li>
                      <li>
                        <Link href='/staff' target="_blank" rel="noopener noreferrer">List of Staff</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Footer-two-in-two-in-boxes">
                  <div className="Footer-two-in-two-in-boxes-in">
                    <h3>Contact</h3>
                    <p className="footer-address">
                      <strong>KL SAC</strong><br />
                      K L Deemed to be University<br />
                      Vaddeswaram, Guntur Dist.<br />
                      Andhra Pradesh - 522302<br />
                      <Link href="mailto:sac@kluniversity.in">sac@kluniversity.in</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Footer-last">
          <div className="Footer-last-in">
            <div className="footer-copyright">
              <div className="footer-copyright-left">
                <p className="copyright-text">© {currentYear} KLEF - <a href="https://sac.kluniversity.in/" target="_blank" rel="noopener noreferrer">Student Activity Center</a> | Designed & Developed by <a href="https://www.linkedin.com/company/zeroonecodeclub/" target="_blank" rel="noopener noreferrer">ZeroOne CodeClub</a></p>
              </div>
              <div className="footer-copyright-right">
                <div className="footer-social">
                  <a href="/login">
                    <FaLock /> <span>Login</span>
                  </a>
                  <a href="https://www.instagram.com/svr_kl.sac/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <FaInstagram /> <span>svr_kl.sac</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
