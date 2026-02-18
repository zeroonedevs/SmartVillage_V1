"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Model from "./components/modal/modal";
import { TbExternalLink } from "react-icons/tb";
import Link from "next/link";

// components

import HeroSlider from "./components/home/HeroSlider";
import AreasOfWork from "./components/home/AreasOfWork";
import FocusAreas from "./components/home/FocusAreas";
import Loader from "./components/Loader/Loader";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/footer/Footer";

import "./globals.css";

import SVR_Image_1 from "./Assets/IMG_8078.JPG";

import VijaySirUpdated from "./Assets/Updated Images/SAC_Director_Updated.png";
import President from "./Assets/President.jpeg";
import Modi from "./Assets/Modi.jpeg";
import AnnualReportImage from "../public/hero/1president.jpg";

// Add Image loading optimization
const ImageWithLoading = ({ src, alt, priority = false, ...props }) => {
  return (
    <Image
      src={src}
      alt={alt}
      {...priority ? { priority: true } : { loading: 'lazy' }}
      {...props}
    />
  );
};

export default function Home() {
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        if (data.success) {
          setTotalStudents(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  //-----------------------For Modal------------------------//
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const OpenLink = () => {
    window.open("https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/PDFS%2FSVR.pdf?alt=media&token=39c8fe16-79c6-495d-b424-611285e88264", "_blank");
  };
  //-----------------------For Modal END------------------------//

  //-----------------------For Modal END------------------------//

  // ---------- Boot Animation (Only on first visit) ------------
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenLoader = sessionStorage.getItem('svr_loader_seen');

      if (!hasSeenLoader) {
        // First visit - show loader for full duration
        sessionStorage.setItem('svr_loader_seen', 'true');
        const timer = setTimeout(() => {
          setShowAnimation(false);
        }, 2500);
        return () => clearTimeout(timer);
      } else {
        // Returning visit - hide immediately
        setShowAnimation(false);
      }
    }
  }, []);
  // ---------- Boot Animation END ------------

  const handleDomainClick = (domain) => {
    window.location.href = `/gallery?domain=${encodeURIComponent(domain)}`;
  };

  return showAnimation ? (
    <Loader />
  ) : (
    <div className="home-component">
      <div className="home-container">
        <Navigation />

        <HeroSlider />

        <div className="home-three">
          <div className="home-three-in">
            <div className="home-three-one">
              <div className="home-three-one-in">
                <h1>
                  K L University's Smart Village Revolution - Empowering
                  Communities with Innovation and Sustainability.
                </h1>
                <p>
                  In the smart village revolution, traditional wisdom and
                  cutting-edge concepts coexist harmoniously. Solar-powered
                  schools, quick access to medical assistance, and
                  cellphone-enabled soil monitoring empower communities.
                  Progress flows effortlessly and sustainably, nourishing
                  villages like water touched by the sun. Tradition endures as
                  innovation fortifies it, fostering common aspirations and
                  promising tomorrows.
                </p>

                <div className="home-three-on-in-link">
                  <button
                    className="home-three-one-in-link"
                    onClick={OpenLink}
                  >
                    <span>Learn More About What We Do</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="home-three-two">
              <div className="home-three-two-in">
                <div className="home-three-two-in-two">
                  <div className="home-three-two-in-two-boxes">
                    <div className="home-three-two-in-two-box">
                      <div className="home-three-two-in-two-box-in">
                        <div className="home-three-two-in-two-box-in-one">
                          <h1>
                            <CountUp end={110} />+
                          </h1>
                        </div>
                        <div className="home-three-two-in-two-box-in-two-main">
                          <p>
                            <Link href="https://drive.google.com/file/d/1hqXfW0VcCbDN8Dz_QDi3UuzMU1h7z96I/view?usp=share_link">
                              <span>Villages Adopted <TbExternalLink /> </span>
                            </Link> by K L University
                            Under Smart Village Revolution Project
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="home-three-two-in-two-box">
                      <div className="home-three-two-in-two-box-in">
                        <div className="home-three-two-in-two-box-in-one">
                          <h1>
                            <CountUp end={totalStudents} />+
                          </h1>
                        </div>
                        <div className="home-three-two-in-two-box-in-two">
                          <p>
                            <span>The Students Actively </span>involved in
                            community endeavors
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="home-three-two-in-two-box">
                      <div className="home-three-two-in-two-box-in">
                        <div className="home-three-two-in-two-box-in-one">
                          <h1>
                            <CountUp end={150500} />+
                          </h1>
                        </div>
                        <div className="home-three-two-in-two-box-in-two">
                          <p>
                            <span>The villagers demonstrated proactive </span>{" "}
                            and engaged involvement.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="home-two">
          <div className="home-two-in">
            <div className="home-two-in-header">
              {/* <h1>Smart Village Revolution at K L Deemed to be University: Steps towards Adarsh Gram </h1> */}
              <h1>
                Smart Village Revolution at K L Deemed to be University: Steps
                towards Sansad Adarsh Gram
              </h1>
            </div>
            <div className="home-two-in-one">
              <div className="home-two-in-one-in">
                <div className="home-two-in-one-in-one">
                  <div className="home-two-in-one-in-one-in">
                    {/* <p>Smart Village Revolution at K L Deemed to be University is a rural development programme broadly focusing upon the development in the villages which includes social development, cultural development and spread motivation among the people on social mobilization of the village community. The programme was launched by the President of KLEF, Hon'ble Shri Koneru Lakshmaiah on the birth anniversary of Jayaprakash Narayan, on 11 October 2014.</p> */}
                    <p>
                      At K L Deemed to be University, the Smart Village
                      Revolution unfolds through deliberate steps towards Sansad
                      Adarsh Gram . Education, community engagement, and
                      sustainable practices form the foundation. Together, we're
                      crafting a future where technology meets tradition, and
                      our village becomes a model of progress, prosperity, and
                      excellence. The programme was launched by the President of
                      KLEF, Hon'ble Shri Koneru Satyanarayana Garu on the birth
                      anniversary of Jayaprakash Narayan, on 11 October 2014.
                    </p>
                    <div className="home-two-in-one-in-boxes">
                      <div className="home-two-in-one-in-boxes-in">
                        <div className="home-two-in-one-in-boxes-in-box">
                          <div className="home-two-in-one-in-boxes-in">
                            {[
                              "Health & Hygiene",
                              "Agriculture",
                              "Quality Education",
                              "Village Infrastructure",
                              "Water conservation",
                              "Energy Availablity and Efficieny",
                              "Material and Resources",
                              "Social Community Actions",
                              "Green Innovation",
                              "Women Empowerment",
                            ].map((item, index) => (
                              <div className="home-two-in-one-in-boxes-in-box" key={index}>
                                <div className="home-two-in-one-in-boxes-in-box-in">
                                  <p>{item}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-two-in-one-in-two">
                  <div className="home-two-in-one-in-two-in">
                    <ImageWithLoading
                      className="home-two-in-one-in-two-in-image"
                      src={SVR_Image_1}
                      alt="Picture of the author"
                      priority={true}
                      width={500}
                      height={400}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AreasOfWork />
        <div className="home-eight">
          <div className="home-eight-in">
            <div className="home-eight-one">
              <div className="home-eight-one-in">
                <div className="home-eight-one-in-book">
                  <Image
                    src={AnnualReportImage}
                    alt="Annual Report"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="home-eight-two">
              <div className="home-eight-two-in">
                <h1>
                  Overall Annual Reports : Smart Village Revolution
                </h1>
                <p>
                  Empowering Futures: A Journey of Impact and Growth – Annual
                  Reports of Smart Village Revolution from past years
                </p>
                <div className="home-eight-two-in-buttons">
                  <a className="home-eight-two-in-activitie-link" href="https://drive.google.com/file/d/1Gt-D_i7NwEHnQ0xRzdhlhJJOpCpJmfde/view" target="_blank" rel="noopener noreferrer">
                    2018-2020
                  </a>
                  <a className="home-eight-two-in-activitie-link" href="https://drive.google.com/file/d/1sf2RI5RhnJwnAspcmv7qIFEˀ1MgVwaD4v/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                    2020-2021
                  </a>
                  <a className="home-eight-two-in-activitie-link" href="https://drive.google.com/file/d/1bVyvCPpnf8zdhiZ25AP2sS--UpyurMgB/view" target="_blank" rel="noopener noreferrer">
                    2021-2022
                  </a>
                  <a className="home-eight-two-in-activitie-link" href="https://drive.google.com/file/d/1weldRzdMTCZsbsKKCwvZ559MB8fROn9_/view" target="_blank" rel="noopener noreferrer">
                    2022-2023
                  </a>
                  <a className="home-eight-two-in-activitie-link" href="https://drive.google.com/file/d/1fX-LHDcBiq5y2dWYkh8keYELPJ2-l57v/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                    2023-2024
                  </a>
                  <a className="home-eight-two-in-activitie-link" href="/activities" target="_blank" rel="noopener noreferrer">
                    View Activities
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Model
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            pdfUrl="/ReportPDFS/SVR_Book.pdf"
          />
        </div>

        <div className="home-ten">
          <div className="home-ten-in">
            <div className="home-ten-header">
              <div className="home-ten-header-in">
                <h1>
                  K L's Smart Village Revolution: In the Line of Sansad Adarsh
                  Gram Yojana
                </h1>
              </div>
            </div>
            <div className="home-ten-one">
              <div className="home-ten-one-in">
                <div className="home-ten-one-in-one">
                  <div className="home-ten-one-in-one-in">
                    <h2>
                      K L's Smart Village Revolution: In the Line of Sansad
                      Adarsh Gram Yojana
                    </h2>
                    <p>
                      On Independence Day, I had made commitment to you on
                      behalf of my colleagues in the Parliament. I laid out my
                      dream of Adarsh Grams as the nucleus of health,
                      cleanliness, greenery and cordiality within the community.
                      The Guidelines that follow are based on these principles
                      and present the complete blueprint of the Saansad Adarsh
                      Gram Yojana for each Member of Parliament to make one
                      village of his or her constituency a Model Village by 2016
                      and two more model villages by 2019.
                    </p>

                    <Link
                      className="home-ten-one-in-one-in-link"
                      href="https://saanjhi.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sansad Adarsh Gram Yojana
                    </Link>
                  </div>
                </div>
                <div className="home-ten-one-in-two">
                  <div className="home-ten-one-in-two-in">
                    <Image
                      className="home-ten-one-in-two-in-image"
                      src={Modi}
                      width={0}
                      height={0}
                      alt="Picture of the author"
                    // style={{ width: "100%" }}
                    />
                    <p>
                      Shri Narendra Modi <br />
                      <span>Prime minister of India</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="home-four message">
          <div className="home-four-in">
            <div className="home-four-header">
              <h1>Message from the Hon'ble President: KLEF</h1>
            </div>
            <div className="home-four-in-in">
              <div className="home-four-one">
                <div className="home-four-one-in">
                  <div className="home-four-one-in-one">
                    <Image
                      className="home-four-one-in-one-in-image"
                      src={President}
                      width={0}
                      height={0}
                      sizes="100vw"
                      alt="Picture of the author"
                      style={{ width: "100%", height: "auto" }} // optional
                    />

                    <p>
                      Er.Koneru Satyanarayana <br />
                      <span>Chancellor & President - KLEF</span>
                    </p>
                  </div>
                  <div className="home-four-one-in-two"></div>
                </div>
              </div>
              <div className="home-four-two">
                <div className="home-four-two-in">
                  <p>
                    The Smart Village Revolution (SVR) is a KLEF initiative
                    dedicated to leveraging technology acquired in classrooms
                    for the benefit of rural communities. This community-driven
                    effort mobilizes the collective strengths of faculty,
                    students, and various professionals, integrating them with
                    technology to serve rural areas. Inspired by Gandhian
                    principles, SVR focuses on providing technical solutions to
                    local needs. Encouraging the construction of green
                    buildings, the initiative enhances economic and
                    environmental performance. KLEF envisions a mass movement,
                    empowering communities with knowledge and skills to face
                    technological challenges. This project aligns with the
                    university's commitment to sustainable rural development,
                    extending its impact beyond academia, fostering social
                    development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sai vijay's Message */}

        <div className="home-six message">
          <div className="home-six-in">
            <div className="home-six-header">
              <h1>Message from the Hon'ble SAC Director: KLEF</h1>
            </div>
            <div className="home-six-in-in">
              <div className="home-six-one">
                <div className="home-six-one-in">
                  <div className="home-six-one-in-one">
                    <Image
                      className="home-six-one-in-one-in-image"
                      src={VijaySirUpdated}
                      width={0}
                      height={0}
                      sizes="100vw"
                      alt="Picture of the author"
                      style={{ width: "100%", height: "auto" }} // optional
                    />

                    <p>
                      Er. P Sai Vijay <br />
                      <span>Director SAC</span>
                    </p>
                  </div>
                  <div className="home-six-one-in-two"></div>
                </div>
              </div>
              <div className="home-six-two">
                <div className="home-six-two-in">
                  <p>
                    Welcome to the Smart Village Revolution (SVR) project, where
                    students spearhead research, innovate solutions, and drive
                    rural development. With a focus on sustainable change, our
                    student-led initiatives tackle pressing issues through
                    innovative projects. From water conservation to healthcare
                    accessibility, we empower rural communities with tailored
                    solutions. Through hands-on research and project
                    implementation, students contribute to transformative
                    change, making a lasting impact on society. Join us as we
                    revolutionize rural development, one project at a time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="home-five" id="home-five">
          <div className="home-five-in">
            <div className="home-five-one">
              <h1>Focus - 9 Way Principle</h1>
            </div>
            <FocusAreas />
          </div>
        </div>

        <div className="Footer">
          <Footer />
        </div>
      </div >
    </div >
  );
}

