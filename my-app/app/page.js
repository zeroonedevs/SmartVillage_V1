"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Model from "./components/modal/modal";
import { TbExternalLink } from "react-icons/tb";
import Link from "next/link";



import HeroSection from "./components/homeHero/page";
import PlantAnimation from "./components/animation/Plant";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/footer/Footer";
import ImageSkeleton from "./components/ImageSkeleton/ImageSkeleton";

import "./globals.css";

import SVR_Image_1 from "./Assets/IMG_8078.jpg";
import SVR_UpdateImage_1 from "./Assets/Updated Images/Agriculture.png";
import SVR_UpdateImage_2 from "./Assets/Updated Images/Education.png";
import SVR_UpdateImage_3 from "./Assets/Updated Images/Health .png";
import SVR_UpdateImage_5 from "./Assets/Updated Images/Infrastruture.png";
import SVR_UpdateImage_11 from "./Assets/Updated Images/RenewableEnergy.png";
import SVR_UpdateImage_12 from "./Assets/Updated Images/WomenEmpowerMent.png";
import SVR_UpdateImage_13 from "./Assets/Women2.png";
import SVR_UpdateImage_16 from "./Assets/Updated Images/Health_new.png";
import SVR_UpdateImage_17 from "./Assets/Updated Images/Culture.png";
import SVR_UpdateImage_19 from "./Assets/Updated Images/LatestCultureAndCommunity.png";
import SVR_UpdateImage_20 from "./Assets/NewDigi.png";

import VijaySirUpdated from "./Assets/Updated Images/SAC_Director_Updated.png";
import President from "./Assets/President.jpeg";
import Modi from "./Assets/Modi.jpeg";
import AnnualReportImage from "../public/hero/1president.jpg";
import communityInfrastructure from "./Assets/communityInfrastructure.png";
import culturalExchange from "./Assets/culturalExchange.png";

import AreasOfWork_Image_1 from "./Assets/AreasOfWork_Image_1.png";
import AreasOfWork_Image_4 from "./Assets/AreasOfWork_Image_4.png";
import AreasOfWork_Image_6 from "./Assets/greenInnovation.png";
import AreasOfWork_Image_8 from "./Assets/AreasOfWork_Image_8.png";
import AreasOfWork_Image_9 from "./Assets/AreasOfWork_Image_9.png";

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
  const [num, setNum] = useState(1);
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

  const handleClick = (Num) => {
    setNum(Num);
  };

  // ---------- Boot Animation ------------
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);
  // ---------- Boot Animation END ------------

  const handleDomainClick = (domain) => {
    window.location.href = `/gallery?domain=${encodeURIComponent(domain)}`;
  };

  return showAnimation ? (
    <PlantAnimation />
  ) : (
    <div className="home-component">
      <div className="home-container">
        <Navigation />

        <HeroSection />

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
                            <CountUp end={13309} />+
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
        <div className="home-seven">
          <div className="home-seven-in">
            <div className="home-seven-in-header">
              <div className="home-seven-in-header-in">
                <h1>Areas of Work</h1>
              </div>
            </div>
            <div className="home-seven-in-one">
              <div className="home-seven-in-one-in">
                <div className="home-seven-in-one-in-boxes">
                  <div className="home-seven-in-one-in-boxes-in">
                    <div className="home-seven-in-one-in-box" onClick={() => handleDomainClick("Health & Hygiene")}>
                      <div className="home-seven-in-one-in-box-in">
                        <Image src={SVR_UpdateImage_16} alt="Health & Hygiene" />
                        <p>Health & Hygiene</p>
                      </div>
                    </div>

                    <div className="home-seven-in-one-in-box" onClick={() => handleDomainClick("Quality Education")}>
                      <div className="home-seven-in-one-in-box-in">
                        <Image src={AreasOfWork_Image_1} alt="Quality Education" />
                        <p>Quality Education</p>
                      </div>
                    </div>

                    <div className="home-seven-in-one-in-box" onClick={() => handleDomainClick("Agriculture")}>
                      <div className="home-seven-in-one-in-box-in">
                        <Image src={AreasOfWork_Image_9} alt="Agriculture" />
                        <p>Agriculture</p>
                      </div>
                    </div>

                    <div className="home-seven-in-one-in-box" onClick={() => handleDomainClick("Village Infrastructure")}>
                      <div className="home-seven-in-one-in-box-in">
                        <Image src={communityInfrastructure} alt="Village Infrastructure" />
                        <p>Village Infrastructure</p>
                      </div>
                    </div>

                    <div className="home-seven-in-one-in-box" onClick={() => handleDomainClick("Social Community Actions")}>
                      <div className="home-seven-in-one-in-box-in">
                        <Image src={AreasOfWork_Image_4} alt="Social Community Actions" />
                        <p>Social Community Actions</p>
                      </div>
                    </div>

                    <div className="home-seven-in-one-in-box" onClick={() => handleDomainClick("Women Empowerment")}>
                      <div className="home-seven-in-one-in-box-in">
                        <Image src={SVR_UpdateImage_13} alt="Women Empowerment" />
                        <p>Women Empowerment</p>
                      </div>
                    </div>

                    <div className="home-seven-in-one-in-box" onClick={() => handleDomainClick("Livelihood Enhancement")}>
                      <div className="home-seven-in-one-in-box-in">
                        <Image src={AreasOfWork_Image_8} alt="Livelihood Enhancement" />
                        <p>Livelihood Enhancement</p>
                      </div>
                    </div>

                    <div className="home-seven-in-one-in-box" onClick={() => handleDomainClick("Digital Literacy")}>
                      <div className="home-seven-in-one-in-box-in">
                        <Image src={SVR_UpdateImage_20} alt="Digital Literacy" />
                        <p>Digital Literacy</p>
                      </div>
                    </div>

                    <div className="home-seven-in-one-in-box" onClick={() => handleDomainClick("Green Innovation")}>
                      <div className="home-seven-in-one-in-box-in">
                        <Image src={AreasOfWork_Image_6} alt="Green Innovation" />
                        <p>Green Innovation</p>
                      </div>
                    </div>

                    <div className="home-seven-in-one-in-box" onClick={() => handleDomainClick("Cultural Exchange")}>
                      <div className="home-seven-in-one-in-box-in">
                        <Image src={culturalExchange} alt="Cultural Exchange" />
                        <p>Cultural Exchange</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <div className="home-five-two">
              <div className="home-five-two-in">
                <div className="home-five-box-one">
                  <div className="home-ft-box-in">
                    <div
                      className="home-se-five se-cm"
                      onClick={() => handleClick(5)}
                      id={num === 5 ? "se-active" : ""}
                    >
                      <div className="home-se-five-in se-cm-in">
                        <p>Health and Hygiene</p>
                      </div>
                    </div>
                    <div
                      className="home-se-one se-cm"
                      onClick={() => handleClick(1)}
                      id={num === 1 ? "se-active" : ""}
                    >
                      <div className="home-se-one-in se-cm-in">
                        <p>Agriculture</p>
                      </div>
                    </div>
                    <div
                      className="home-se-two se-cm"
                      onClick={() => handleClick(2)}
                      id={num === 2 ? "se-active" : ""}
                    >
                      <div className="home-se-two-in se-cm-in">
                        <p>Quality Education</p>
                      </div>
                    </div>
                    <div
                      className="home-se-three se-cm"
                      onClick={() => handleClick(3)}
                      id={num === 3 ? "se-active" : ""}
                    >
                      <div className="home-se-three-in se-cm-in">
                        <p>Village Infrastructure</p>
                      </div>
                    </div>
                    <div
                      className="home-se-four se-cm"
                      onClick={() => handleClick(4)}
                      id={num === 4 ? "se-active" : ""}
                    >
                      <div className="home-se-four-in se-cm-in">
                        <p>Culture and Community</p>
                      </div>
                    </div>
                    <div
                      className="home-se-six se-cm"
                      onClick={() => handleClick(6)}
                      id={num === 6 ? "se-active" : ""}
                    >
                      <div className="home-se-six-in se-cm-in">
                        <p>Energy Availablity and Efficieny</p>
                      </div>
                    </div>
                    {/* <div
                      className="home-se-seven se-cm"
                      onClick={() => handleClick(7)}
                      id={num === 7 ? "se-active" : ""}
                    >
                      <div className="home-se-seven-in se-cm-in">
                        <p>Transportation</p>
                      </div>
                    </div> */}
                    <div
                      className="home-se-eight se-cm"
                      onClick={() => handleClick(8)}
                      id={num === 8 ? "se-active" : ""}
                    >
                      <div className="home-se-eight-in se-cm-in">
                        <p>Green Innovation</p>
                      </div>
                    </div>
                    <div
                      className="home-se-nine se-cm"
                      onClick={() => handleClick(9)}
                      id={num === 9 ? "se-active" : ""}
                    >
                      <div className="home-se-nine-in se-cm-in">
                        <p>Women Empowerment</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-five-box-two">
                  <div className="home-ft-box-two-in">
                    <div
                      className="home-bt-one cm-bx-hide"
                      id={num === 1 ? "se-visible" : ""}
                    >
                      <div className="home-bt-one-in">
                        <div className="home-bt-one-in-header">
                          <div className="home-bt-one-in-header-in">
                            <h1>Agriculture</h1>
                          </div>
                        </div>
                        <div className="home-bt-one-in-one">
                          <div className="home-bt-one-in-one-in">
                            <div className="home-bt-one-in-one-in-one">
                              <div className="home-bt-one-in-one-in-one-in">
                                <p>
                                  Agriculture in Smart Villages thrives through
                                  the adoption of precision farming techniques.
                                  Leveraging technology, farmers make
                                  data-driven decisions for irrigation,
                                  fertilization, and pest control. Sustainable
                                  practices like organic farming and renewable
                                  energy integration ensure long-term
                                  environmental health.Providing access to
                                  modern agricultural practices and tools for
                                  continuous improvement.{" "}
                                </p>
                              </div>
                            </div>
                            <div className="home-bt-one-in-one-in-two">
                              <div className="home-bt-one-in-one-in-two-in">
                                <Image
                                  className="home-bt-one-in-one-in-two-in-image"
                                  src={SVR_UpdateImage_1}
                                  alt="Picture of the author"
                                  width={500}
                                  height={400}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="home-bt-two cm-bx-hide"
                      id={num === 2 ? "se-visible" : ""}
                    >
                      <div className="home-bt-one-in">
                        <div className="home-bt-one-in-header">
                          <div className="home-bt-one-in-header-in">
                            <h1>Quality Education</h1>
                          </div>
                        </div>
                        <div className="home-bt-one-in-one">
                          <div className="home-bt-one-in-one-in">
                            <div className="home-bt-one-in-one-in-one">
                              <div className="home-bt-one-in-one-in-one-in">
                                <p>
                                  Access to quality education is pivotal. Smart
                                  Villages utilize digital learning tools, offer
                                  training for teachers, and establish schools
                                  with modern resources. This empowers the
                                  youth, fostering innovation and preparing them
                                  for diverse career opportunities. Continuous
                                  training programs for educators to align
                                  teaching methods with modern pedagogies.
                                  Offering vocational training and specialized
                                  courses to prepare students for diverse
                                  careers.{" "}
                                </p>
                              </div>
                            </div>
                            <div className="home-bt-one-in-one-in-two">
                              <div className="home-bt-one-in-one-in-two-in">
                                <Image
                                  className="home-bt-one-in-one-in-two-in-image"
                                  src={SVR_UpdateImage_2}
                                  alt="Picture of the author"
                                  width={500}
                                  height={400}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="home-bt-three cm-bx-hide"
                      id={num === 3 ? "se-visible" : ""}
                    >
                      <div className="home-bt-one-in">
                        <div className="home-bt-one-in-header">
                          <div className="home-bt-one-in-header-in">
                            <h1>Village Infrastructure</h1>
                          </div>
                        </div>
                        <div className="home-bt-one-in-one">
                          <div className="home-bt-one-in-one-in">
                            <div className="home-bt-one-in-one-in-one">
                              <div className="home-bt-one-in-one-in-one-in">
                                <p>
                                  Developing robust infrastructure is vital for
                                  enhancing accessibility and fostering economic
                                  growth in rural areas. This includes reliable
                                  transportation networks linking villages to
                                  markets and services, sustainable energy
                                  sources for consistent power, and internet
                                  connectivity to bridge the digital divide.
                                  Community centers and waste management systems
                                  promote social interaction and environmental
                                  sustainability. Resilient infrastructure
                                  withstands natural disasters, while housing
                                  and urban planning ensure safe and comfortable
                                  living conditions. These efforts collectively
                                  empower rural communities and drive
                                  sustainable development.{" "}
                                </p>
                              </div>
                            </div>
                            <div className="home-bt-one-in-one-in-two">
                              <div className="home-bt-one-in-one-in-two-in">
                                <Image
                                  className="home-bt-one-in-one-in-two-in-image"
                                  src={SVR_UpdateImage_5}
                                  alt="Picture of the author"
                                  width={500}
                                  height={400}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="home-bt-four cm-bx-hide"
                      id={num === 4 ? "se-visible" : ""}
                    >
                      <div className="home-bt-one-in">
                        <div className="home-bt-one-in-header">
                          <div className="home-bt-one-in-header-in">
                            <h1>Culture and Community</h1>
                          </div>
                        </div>
                        <div className="home-bt-one-in-one">
                          <div className="home-bt-one-in-one-in">
                            <div className="home-bt-one-in-one-in-one">
                              <div className="home-bt-one-in-one-in-one-in">
                                <p>
                                  Preserving local traditions while embracing
                                  progressiveness is pivotal. Community
                                  engagement in cultural events strengthens
                                  social cohesion. Supporting local artisans
                                  promotes heritage. Celebrating diverse
                                  identities fosters belonging. Cultural
                                  exchange platforms foster understanding.
                                  Engaging youth ensures tradition continuity.
                                  Community centers serve as hubs for education
                                  and dialogue. This holistic approach nurtures
                                  heritage, innovation, and inclusivity,
                                  fostering a vibrant and cohesive community
                                  deeply rooted in its cultural identity while
                                  embracing the dynamics of modernity.{" "}
                                </p>
                              </div>
                            </div>
                            <div className="home-bt-one-in-one-in-two">
                              <div className="home-bt-one-in-one-in-two-in">
                                <Image
                                  className="home-bt-one-in-one-in-two-in-image"
                                  src={SVR_UpdateImage_19}
                                  alt="Picture of the author"
                                  width={500}
                                  height={400}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="home-bt-five cm-bx-hide"
                      id={num === 5 ? "se-visible" : ""}
                    >
                      <div className="home-bt-one-in">
                        <div className="home-bt-one-in-header">
                          <div className="home-bt-one-in-header-in">
                            <h1>Health and Hygiene</h1>
                          </div>
                        </div>
                        <div className="home-bt-one-in-one">
                          <div className="home-bt-one-in-one-in">
                            <div className="home-bt-one-in-one-in-one">
                              <div className="home-bt-one-in-one-in-one-in">
                                <p>
                                  Establishing healthcare facilities with
                                  essential services and trained professionals,
                                  along with health education on hygiene and
                                  disease prevention, ensures community
                                  wellness. Access to clean water via
                                  purification systems and sanitation facilities
                                  improves hygiene. Essential medications and
                                  vaccines are available, promoting early
                                  detection through regular screenings. Fitness
                                  programs and collaborations with local health
                                  workers foster healthy lifestyles. These
                                  initiatives, including outreach programs, form
                                  a comprehensive approach to community health
                                </p>
                              </div>
                            </div>
                            <div className="home-bt-one-in-one-in-two">
                              <div className="home-bt-one-in-one-in-two-in">
                                <Image
                                  className="home-bt-one-in-one-in-two-in-image"
                                  src={SVR_UpdateImage_3}
                                  alt="Picture of the author"
                                  width={500}
                                  height={400}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="home-bt-six cm-bx-hide"
                      id={num === 6 ? "se-visible" : ""}
                    >
                      <div className="home-bt-one-in">
                        <div className="home-bt-one-in-header">
                          <div className="home-bt-one-in-header-in">
                            <h1>Energy Availablity and Efficieny</h1>
                          </div>
                        </div>
                        <div className="home-bt-one-in-one">
                          <div className="home-bt-one-in-one-in">
                            <div className="home-bt-one-in-one-in-one">
                              <div className="home-bt-one-in-one-in-one-in">
                                <p>
                                  Promoting sustainable agriculture ensures food
                                  security while minimizing environmental
                                  impact. Renewable energy adoption, like solar
                                  power and biogas, fosters clean energy
                                  solutions. Eco-friendly waste management
                                  reduces pollution and promotes recycling.
                                  Sustainable water management conserves
                                  resources and prevents scarcity. Reforestation
                                  and conservation efforts preserve
                                  biodiversity. Education and awareness
                                  campaigns encourage sustainable living.
                                  Collaborative efforts with local communities
                                  drive sustainable development projects,
                                  fostering a resilient and environmentally
                                  conscious society.{" "}
                                </p>
                              </div>
                            </div>
                            <div className="home-bt-one-in-one-in-two">
                              <div className="home-bt-one-in-one-in-two-in">
                                <Image
                                  className="home-bt-one-in-one-in-two-in-image"
                                  src={SVR_UpdateImage_11}
                                  alt="Picture of the author"
                                  width={500}
                                  height={400}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="home-bt-seven cm-bx-hide"
                      id={num === 7 ? "se-visible" : ""}
                    >
                      {/* <div className="home-bt-one-in">
                        <div className="home-bt-one-in-header">
                          <div className="home-bt-one-in-header-in">
                            <h1>Transportation</h1>
                          </div>
                        </div>
                        <div className="home-bt-one-in-one">
                          <div className="home-bt-one-in-one-in">
                            <div className="home-bt-one-in-one-in-one">
                              <div className="home-bt-one-in-one-in-one-in">
                                <p>
                                  Enhancing transportation networks with quality
                                  roads and bridges facilitates market access.
                                  Affordable public transit options improve
                                  villagers' mobility. Reliable systems ensure
                                  safe commuting and trade. Embracing technology
                                  enables smart solutions like ride-sharing.
                                  Eco-friendly transport reduces environmental
                                  impact. Regular maintenance ensures safety and
                                  reliability. Connecting remote areas to hubs
                                  facilitates movement and trade. Tailored
                                  transport systems meet community needs,
                                  fostering inclusivity and economic growth
                                  while prioritizing safety, efficiency, and
                                  environmental sustainability.
                                </p>
                              </div>
                            </div>
                            <div className="home-bt-one-in-one-in-two">
                              <div className="home-bt-one-in-one-in-two-in">
                                <Image
                                  className="home-bt-one-in-one-in-two-in-image"
                                  src={SVR_UpdateImage_18}
                                  alt="Picture of the author"
                                ></Image>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <div
                      className="home-bt-eight cm-bx-hide"
                      id={num === 8 ? "se-visible" : ""}
                    >
                      <div className="home-bt-one-in">
                        <div className="home-bt-one-in-header">
                          <div className="home-bt-one-in-header-in">
                            <h1>Green Innovation</h1>
                          </div>
                        </div>
                        <div className="home-bt-one-in-one">
                          <div className="home-bt-one-in-one-in">
                            <div className="home-bt-one-in-one-in-one">
                              <div className="home-bt-one-in-one-in-one-in">
                                <p>
                                  Tailored skill programs address community and
                                  market needs, fostering entrepreneurship
                                  through training, mentorship, and resource
                                  access. Micro-enterprises and cooperatives
                                  strengthen local industries. Financial
                                  literacy and microfinance support aspiring
                                  entrepreneurs. Sustainable farming and
                                  alternative livelihoods diversify incomes.
                                  Market linkages boost local goods. Vocational
                                  training and apprenticeships refine
                                  specialized skills. Innovation initiatives aid
                                  small businesses and startups. These efforts
                                  drive economic growth, empower individuals,
                                  and cultivate resilient communities poised for
                                  sustainable development.
                                </p>
                              </div>
                            </div>
                            <div className="home-bt-one-in-one-in-two">
                              <div className="home-bt-one-in-one-in-two-in">
                                <Image
                                  className="home-bt-one-in-one-in-two-in-image"
                                  src={SVR_UpdateImage_17}
                                  alt="Picture of the author"
                                  width={500}
                                  height={400}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="home-bt-nine cm-bx-hide"
                      id={num === 9 ? "se-visible" : ""}
                    >
                      <div className="home-bt-one-in">
                        <div className="home-bt-one-in-header">
                          <div className="home-bt-one-in-header-in">
                            <h1>Women Empowerment</h1>
                          </div>
                        </div>
                        <div className="home-bt-one-in-one">
                          <div className="home-bt-one-in-one-in">
                            <div className="home-bt-one-in-one-in-one">
                              <div className="home-bt-one-in-one-in-one-in">
                                <p>
                                  Tailored education, leadership training, and
                                  mentorship empower women, fostering community
                                  engagement and decision-making. Access to
                                  healthcare, support networks, and legal
                                  services address their needs comprehensively.
                                  Entrepreneurship and vocational training
                                  ensure financial independence. Cultural bias
                                  is challenged through awareness campaigns.
                                  These initiatives collectively advance gender
                                  equality, enabling women to thrive and
                                  contribute meaningfully. By providing holistic
                                  support, we empower women to break barriers,
                                  shape their futures, and become agents of
                                  positive change in their communities and
                                  beyond.{" "}
                                </p>
                              </div>
                            </div>
                            <div className="home-bt-one-in-one-in-two">
                              <div className="home-bt-one-in-one-in-two-in">
                                <Image
                                  className="home-bt-one-in-one-in-two-in-image"
                                  src={SVR_UpdateImage_12}
                                  alt="Picture of the author"
                                  width={500}
                                  height={400}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="Footer">
          <Footer />
        </div>
      </div>
    </div>
  );
}

