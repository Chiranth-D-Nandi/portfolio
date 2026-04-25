import { useState, useRef, useEffect } from 'react'
import { useNavColor } from './hooks/useNavColor';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RiScrollToBottomFill } from "react-icons/ri";
import React from "react";
import DotGrid from './components/ui/DotGrid.jsx';

const WorkIcon = () => <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%' }} />;
const SchoolIcon = () => <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%' }} />;
const StarIcon = () => <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%' }} />;

import LogoLoop from './components/ui/LogoLoop.jsx';
import Carousel from './components/ui/carousel.jsx';

import { internImages, project1Images, project2Images, project3Images, project4Images, research1Images } from './assets/carouselImages';
import { 
  SiPython, 
  SiC, 
  SiJavascript, 
  SiHtml5,
  SiPostgresql,
  SiDjango, 
  SiReact, 
  SiNodedotjs, 
  SiExpress,
  SiMongodb, 
  SiLangchain, 
  SiOpencv, 
  SiTensorflow, 
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiGithub,
  SiOpenssl,
  SiGtk,
  SiLinkedin,
  SiLinux,
  SiMysql,
  SiLeetcode
} from 'react-icons/si';

const techLogos = [
  { node: <SiPython style={{ color: '#070111' }} />, title: "Python" },
  { node: <SiC style={{ color: '#070111' }} />, title: "C Programming" },
  { node: <SiJavascript style={{ color: '#070111' }} />, title: "JavaScript" },
  { node: <SiPostgresql style={{ color: '#070111' }} />, title: "SQL" },
  { node: <SiHtml5 style={{ color: '#070111' }} />, title: "HTML5" },
  { node: <SiDjango style={{ color: '#070111' }} />, title: "Django" },
  { node: <SiReact style={{ color: '#070111' }} />, title: "React" },
  { node: <SiNodedotjs style={{ color: '#070111' }} />, title: "Node.js" },
  { node: <SiExpress style={{ color: '#070111' }} />, title: "Express.js" },
  { node: <SiMongodb style={{ color: '#070111' }} />, title: "MongoDB" },
  { node: <SiLangchain style={{ color: '#070111' }} />, title: "LangChain" },
  { node: <SiOpencv style={{ color: '#070111' }} />, title: "OpenCV" },
  { node: <SiTensorflow style={{ color: '#070111' }} />, title: "TensorFlow" },
  { node: <SiScikitlearn style={{ color: '#070111' }} />, title: "Scikit-learn" },
  { node: <SiPandas style={{ color: '#070111' }} />, title: "Pandas" },
  { node: <SiNumpy style={{ color: '#070111' }} />, title: "NumPy" },
  { node: <SiGtk style={{ color: '#070111' }} />, title: "GTK3" },
  { node: <SiGithub style={{ color: '#070111' }} />, title: "Github" },
  { node: <SiOpenssl style={{ color: '#070111' }} />, title: "OpenSSL" },
  { node: <SiLinux style={{ color: '#070111' }} />, title: "Linux" },
  { node: <SiMysql style={{ color: '#070111' }} />, title: "MySql" },
  { node: <SiLeetcode style={{ color: '#070111' }} />, title: "ltk" }
];

import Orb from './components/ui/Orb.jsx';
import DomeGallery from './components/ui/DomeGallery';
import ResumeRequestModal from './components/ui/ResumeRequestModal.jsx';

function App() {
  const [resumeHover, setResumeHover] = useState(false);
  const [projectsHover, setProjectsHover] = useState(false);
  const [contactHover, setContactHover] = useState(false);
  const [HomeHover, setHomeHover] = useState(false);
  const [SkillsHover, setSkillsHover] = useState(false);
  const [ProjHover, setProjHover] = useState(false);
  const [WorkHover, setWorkHover] = useState(false);
  const [AboutHover, setAboutHover] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // track mobile viewport to apply conditional inline styles where necessary
  const [isMobileView, setIsMobileView] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [timelineLeft, setTimelineLeft] = useState(40);
  useEffect(() => {
    const calculate = () => {
      const w = window.innerWidth;
      const mobile = w <= 768;
      setIsMobileView(mobile);
      if (mobile) {
        const horizontalPadding = 32; // total horizontal padding used for mobile card (16px each side)
        const cardWidth = Math.max(w - horizontalPadding, 280);
        const cardLeft = Math.round((w - cardWidth) / 2);
        const gap = 12; // fixed gap between card and timeline
        const leftPos = Math.max(8, cardLeft - gap);
        setTimelineLeft(leftPos);
      } else {
        setTimelineLeft(40);
      }
    };
    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);
  
  // Section refs for nav color logic
  const orbRef = useRef(null);
  const contRef = useRef(null);
  const dotGridRef = useRef(null);
  const workRef = useRef(null);
  const projectsRef = useRef(null);
  const customCardRef = useRef(null);
  const aboutRef = useRef(null);

  // Scroll handlers for navigation
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false); // close mobile menu if open
    }
  };

  // Define sections with their respective nav text colors
  const sections = [
    { ref: customCardRef, textColor: '#070111' }, // Custom Card (dark) - put first for priority
    { ref: orbRef, textColor: '#070111' }, // Orb section (dark)
    { ref: workRef, textColor: 'white' }, // Work Experience (white)
    { ref: projectsRef, textColor: 'white' }, // Projects (white)
    { ref: aboutRef, textColor: '#070111' },
  ];
  const navColor = useNavColor(sections);

  // (useNavColor handles navColor logic)

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="mobile-nav-item" onClick={() => scrollToSection(orbRef)}>Home</button>
        <button className="mobile-nav-item" onClick={() => scrollToSection(customCardRef)}>Skills</button>
        <button className="mobile-nav-item" onClick={() => scrollToSection(projectsRef)}>Projects</button>
        <button className="mobile-nav-item" onClick={() => scrollToSection(workRef)}>Work Experience</button>
        <button className="mobile-nav-item" onClick={() => scrollToSection(aboutRef)}>About</button>
        <button className="mobile-nav-item" onClick={() => { setResumeModalOpen(true); setMobileMenuOpen(false); }}>Download Resume</button>
        <div className="mobile-social-links">
          <a href="https://www.linkedin.com/in/chiranth-nandi" target="_blank" rel="noopener noreferrer">
            <SiLinkedin />
          </a>
          <a href="https://github.com/Chiranth-D-Nandi" target="_blank" rel="noopener noreferrer">
            <SiGithub />
          </a>
        </div>
      </div>

      {/* Desktop Navigation (refactored) */}
      <div className="desktop-nav">
        <div className="nav-left">
          <a
            href="https://www.linkedin.com/in/chiranth-nandi"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link linkedin"
            aria-label="LinkedIn"
            style={{ color: '#a06ee1', fontSize: '34px' }}
          >
            <SiLinkedin />
          </a>

          <button
            onClick={() => setResumeModalOpen(true)}
            onMouseEnter={() => setResumeHover(true)}
            onMouseLeave={() => setResumeHover(false)}
            className="resume-btn"
            style={{
              backgroundColor: resumeHover ? 'transparent' : '#a06ee1',
              color: resumeHover ? '#a06ee1' : navColor,
              fontFamily: 'Montserrat',
              fontSize: 16,
              fontWeight: 600,
              border: '2px solid #a06ee1',
              padding: '6px 11px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Download Resume
          </button>
        </div>

        <div className="nav-right">
          <button
            onMouseEnter={() => setHomeHover(true)}
            onMouseLeave={() => setHomeHover(false)}
            onClick={() => scrollToSection(orbRef)}
            className="nav-btn"
            style={{
              backgroundColor: HomeHover ? 'transparent' : '#a06ee1',
              color: HomeHover ? '#a06ee1' : navColor,
              fontFamily: 'Montserrat',
              fontSize: 16,
              fontWeight: 600,
              border: '2px solid #a06ee1',
              padding: '6px 8px',
              borderRadius: '8px',
            }}
          >
            Home
          </button>

          <button
            onMouseEnter={() => setWorkHover(true)}
            onMouseLeave={() => setWorkHover(false)}
            onClick={() => scrollToSection(workRef)}
            className="nav-btn"
            style={{
              backgroundColor: WorkHover ? 'transparent' : '#a06ee1',
              color: WorkHover ? '#a06ee1' : navColor,
              fontFamily: 'Montserrat',
              fontSize: 16,
              fontWeight: 600,
              border: '2px solid #a06ee1',
              padding: '6px 8px',
              borderRadius: '8px',
            }}
          >
            Work Experience
          </button>

          <button
            onMouseEnter={() => setProjHover(true)}
            onMouseLeave={() => setProjHover(false)}
            onClick={() => scrollToSection(projectsRef)}
            className="nav-btn"
            style={{
              backgroundColor: ProjHover ? 'transparent' : '#a06ee1',
              color: ProjHover ? '#a06ee1' : navColor,
              fontFamily: 'Montserrat',
              fontSize: 16,
              fontWeight: 600,
              border: '2px solid #a06ee1',
              padding: '6px 8px',
              borderRadius: '8px',
            }}
          >
            Projects
          </button>

          <button
            onMouseEnter={() => setSkillsHover(true)}
            onMouseLeave={() => setSkillsHover(false)}
            onClick={() => scrollToSection(customCardRef)}
            className="nav-btn"
            style={{
              backgroundColor: SkillsHover ? 'transparent' : '#a06ee1',
              color: SkillsHover ? '#a06ee1' : navColor,
              fontFamily: 'Montserrat',
              fontSize: 16,
              fontWeight: 600,
              border: '2px solid #a06ee1',
              padding: '6px 8px',
              borderRadius: '8px',
            }}
          >
            Skills
          </button>

          <button
            onMouseEnter={() => setAboutHover(true)}
            onMouseLeave={() => setAboutHover(false)}
            onClick={() => scrollToSection(aboutRef)}
            className="nav-btn"
            style={{
              backgroundColor: AboutHover ? 'transparent' : '#a06ee1',
              color: AboutHover ? '#a06ee1' : navColor,
              fontFamily: 'Montserrat',
              fontSize: 16,
              fontWeight: 600,
              border: '2px solid #a06ee1',
              padding: '6px 8px',
              borderRadius: '8px',
            }}
          >
            About
          </button>

          <a
            href="https://github.com/Chiranth-D-Nandi"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link github"
            aria-label="GitHub"
            style={{ color: '#a06ee1', fontSize: '34px' }}
          >
            <SiGithub />
          </a>
        </div>
      </div>

      {/* Logo Loop at the top */}
      <div style={{ 
        height: '60px', 
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden', 
        background: '#ffa900',
        width: '100%',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        paddingTop: '6px'
      }}>
        <LogoLoop
          logos={techLogos}
          speed={80}
          direction="left"
          logoHeight={45}
          gap={65}
          hoverSpeed={0}
          scaleOnHover
          ariaLabel="Skills"
        />
      </div>

      {/* Main scrollable content area */}
      <div style={{ 
        paddingTop: '74px',
        width: '100%', 
        minHeight: '100vh',
        marginTop: '-27px' // -14px (nav) + -13px (orb/hero)
      }}>
        {/* Orb Section */}
        <div
          ref={orbRef}
          style={{ 
            width: '100%', 
            height: '100vh', 
            background: '#070111',
            position: 'relative'
          }}
        >
          <div style={{position: 'absolute', top:'51.5%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', textAlign: 'center', fontFamily: 'Montserrat', fontSize:'1.3rem', pointerEvents: 'none', zIndex: 1, padding: '0 20px'}} className="hero-content">
            <p style={{fontWeight: 400, fontSize: '0.6em', margin: '0.9rem 0'}}>hover over the orb for some fun!</p>
            <h1 style={{fontWeight: 700, fontSize: '3.5em', margin: '0 0 0.5rem 0'}}>Chiranth D Nandi</h1>
            <p style={{fontWeight: 400, fontSize: '1.2em', margin: '0.25rem 0'}}>CSE Student at PES University, Bengaluru</p>
            <p style={{fontWeight: 400, fontSize: '1.2em', margin: '0.25rem 0'}}>Seeking AI/ML Engineering and</p>
            <p style={{fontWeight: 400, fontSize: '1.2em', margin: '0.25rem 0'}}>Software Engineering <strong>Internships</strong></p>
            <br></br>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center'}}>
              <button 
                onMouseEnter={() => setProjectsHover(true)}
                onMouseLeave={() => setProjectsHover(false)}
                onClick={() => scrollToSection(projectsRef)}
                style={{
                  backgroundColor: projectsHover ? 'transparent' : '#ffa900',
                  color: projectsHover ? '#ffa900' : '#070111',
                  fontFamily: 'Montserrat', 
                  fontSize:16, 
                  fontWeight: 600, 
                  border: '2px solid #ffa900', 
                  padding: '12px 16px', 
                  borderRadius: '10px', 
                  pointerEvents: 'auto', 
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}>View My Projects</button>
              <button 
                onMouseEnter={() => setContactHover(true)}
                onMouseLeave={() => setContactHover(false)}
                onClick={() => scrollToSection(contRef)}
                style={{
                  backgroundColor: contactHover ? 'transparent' : 'white',
                  color: contactHover ? 'white' : '#070111',
                  fontFamily: 'Montserrat', 
                  fontSize:16, 
                  fontWeight: 600, 
                  border: '2px solid white', 
                  padding: '12px 12px', 
                  borderRadius: '10px', 
                  pointerEvents: 'auto', 
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}>Contact Me</button>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <p style={{fontWeight: 400, fontSize: '1.0em', margin: '0.4rem 0'}}>scroll down</p>
                  <div className="mouse" style={{width: '25px', height: '45px', marginTop: '0.4rem'}}></div>
                </div>
            </div>
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Orb
              hoverIntensity={1.6}
              rotateOnHover={true}
              hue={0}
              forceHoverState={false}
            />
          </div>
        </div>
      </div>

      {/* Work Experience Section with DotGrid background */}
      <div
        ref={workRef}
        style={{
          paddingTop: '60px',
          width: '100%',
          minHeight: '80vh',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
        }}
      >
        <div style={{ width: '100%', textAlign: 'center', marginBottom: 0, marginTop: 0, display: 'flex', justifyContent: 'center' }}>
          <span style={{
            display: 'inline-block',
            background: '#070111',
            color: '#ffd84d',
            borderRadius: '18px',
            padding: '18px 38px 10px 38px',
            fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
            fontWeight: 800,
            fontSize: '2.5rem',
            margin: 0,
            marginBottom: '18px',
            marginTop: '18px',
            letterSpacing: '0.01em',
            textAlign: 'center',
            zIndex: 50
          }}>Work Experience.</span>
        </div>
        {/* DotGrid as background */}
        <div ref={dotGridRef} style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}>
          <DotGrid
            dotSize={3}
            gap={23}
            baseColor="#000000"
            activeColor="#a020f0"
            shockStrength={6}
          />
        </div>
        {/* Foreground content */}
        <div className="work-foreground" style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: isMobileView ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isMobileView ? 'center' : 'flex-start',
          padding: isMobileView ? '18px 8px' : '30px 0 30px 0',
        }}>
          {/* Left: Carousel */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="carousel-wrapper project-carousel" style={{ maxWidth: isMobileView ? 320 : 420, width: '100%', margin: isMobileView ? '0 auto' : '0' }}>
                <Carousel images={internImages} projectId="internship-2025" />
            </div>
          </div>
          {/* Right: Timeline and Description */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: isMobileView ? 'center' : 'flex-start', justifyContent: 'center', position: 'relative', height: '100%', width: '100%' }}>
            <div style={{ position: 'relative', width: isMobileView ? '100%' : '100%', minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: isMobileView ? 'center' : 'flex-start' }}>
            {/* Timeline vertical line */}
            <div style={{
              position: 'absolute',
              left: timelineLeft,
              top: 0,
              bottom: 0,
              width: '3px',
              background: '#070111',
              borderRadius: '2px',
              height: '100%',
              zIndex: 3
            }} />
            {/* Timeline dot with icon */}
              <div style={{
                position: 'absolute',
                left: (timelineLeft - 15),
                top: isMobileView ? 24 : 80,
                width: 32,
                height: 32,
                background: '#fff',
                border: '3px solid #070111',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                fontSize: '20px',
                lineHeight: 1
              }}>
                <span role="img" aria-label="briefcase">💼</span>
              </div>
            {/* Timeline content */}
            <div className="work-card" style={{
              marginLeft: isMobileView ? 'auto' : 80,
              marginRight: isMobileView ? 'auto' : 0,
              background: '#ffd84d',
              borderRadius: 16,
              boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
              padding: isMobileView ? '20px 16px' : '32px 36px',
              minWidth: isMobileView ? 0 : 340,
              maxWidth: isMobileView ? 'calc(100vw - 32px)' : 480,
              width: isMobileView ? 'calc(100% - 32px)' : 'auto',
              border: '1.5px solid #e0e0e0',
              textAlign: 'left',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{ color: '#594880', fontWeight: 700, fontSize: isMobileView ? '1.15rem' : '1.2rem', marginBottom: 6 }}>December 2025 - Present</div>
              <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.45rem' : '1.5rem', marginBottom: 8 }}>SDE Intern, Crescenzia Wellness Private Limited.</div>
              <div style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem', lineHeight: 1.7 }}>
                <p>Developed an end to end order to fulfillment automation pipeline for B2B clients, reducing manual workflows by 70% while implementing secure 2FA and role based access controls.</p>
                <p><strong>Technologies: </strong>MERN stack, MySQL, JWT Auth, RESTFul APIs</p>
                <p style={{ marginTop: 10, color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem' }}>Onsite, Bengaluru</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div
        ref={projectsRef}
          style={{
            background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
            padding: '80px 40px',
            minHeight: '100vh'
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ width: '100%', textAlign: 'center', marginBottom: '60px', display: 'flex', justifyContent: 'center' }}>
              <span style={{
                display: 'inline-block',
                background: '#070111',
                color: '#ffd84d',
                borderRadius: '18px',
                padding: '10px 38px 10px 38px',
                fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                fontWeight: 800,
                fontSize: '2.5rem',
                letterSpacing: '0.01em',
                textAlign: 'center',
                zIndex: 50
              }}>Projects.</span>
            </div>

            {/* Project 1 - Autonomous Driving */}
            <div className="project-row" style={{
              display: 'flex',
              gap: '40px',
              marginBottom: '80px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Content on Left */}
              <div className="project-card" style={{ flex: 1 }}>
                <div style={{
                  background: '#ffd84d',
                  borderRadius: 16,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                  padding: '32px 36px',
                  minWidth: 340,
                  maxWidth: 550,
                  border: '1.5px solid #e0e0e0',
                  zIndex: 2,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: 'black',
                }}>
                  <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.45rem' : '1.5rem', marginBottom: 8 }}>Autonomous Driving Software for Obstacle Avoidance using Reinforcement Learning</div>
                  <div style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem', lineHeight: 1.7, fontWeight: 400 }}>
                    <p><strong>Technologies Used:</strong> Python, PyTorch, Stable-Baselines3, Gymnasium, ONNX Runtime, MobileNetV3, Raspberry Pi 4.</p>
                    <p>Developed a full autonomous driving pipeline with a custom Gymnasium environment simulating physics-based ultrasonic raycasting and relative velocity tracking to distinguish static obstacles from oncoming vehicles across a 3-lane scenario.</p>
                    <p>Trained a Transformer + LSTM + RecurrentPPO policy via behavioral cloning pretraining on 98,000 expert demonstrations followed by 2M PPO steps, then exported to INT8 quantized ONNX Runtime for Raspberry Pi 4 deployment alongside a MobileNetV3-Small traffic sign classifier.</p>
                  </div>
                </div>
              </div>

              {/* Carousel on Right */}
              <div className="project-carousel" style={{ flex: '0 0 500px' }}>
                <Carousel 
                  images={project3Images} 
                  showGithub={true}
                  githubUrl="https://github.com/Chiranth-D-Nandi/autonomous-car-software"
                  projectId="project-3"
                />
              </div>
            </div>

            {/* Project 2 - LLM Security */}
            <div className="project-row" style={{
              display: 'flex',
              gap: '40px',
              marginBottom: '80px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Content on Left */}
              <div className="project-card" style={{ flex: 1 }}>
                <div style={{
                  background: '#ffd84d',
                  borderRadius: 16,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                  padding: '32px 36px',
                  minWidth: 340,
                  maxWidth: 550,
                  border: '1.5px solid #e0e0e0',
                  zIndex: 2,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: 'black',
                }}>
                  <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.45rem' : '1.5rem', marginBottom: 8 }}>Automated AI Model Red-Teaming and Defense Validation System</div>
                  <div style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem', lineHeight: 1.7, fontWeight: 400 }}>
                    <p><strong>Technologies Used:</strong> Python, Streamlit, HuggingFace, Ollama, Groq, OWASP-10 GEN AI.</p>
                    <p>Built an LLM security scanner running supply chain artifact analysis, AST-based code inspection, OSV.dev CVE lookups, and 35+ adversarial red team probes with adaptive escalation and a 6-judge consensus panel, achieving 93% detection rate across seeded vulnerability benchmarks.</p>
                    <p>Validated 5 mitigations against every successful attack and synthesized before/after AI-CVSS risk scores with OWASP LLM Top 10, MITRE ATLAS, and CWE compliance mapping into exportable forensic reports.</p>
                  </div>
                </div>
              </div>

              {/* Carousel on Right */}
              <div className="project-carousel" style={{ flex: '0 0 500px' }}>
                <Carousel 
                  images={project4Images} 
                  showGithub={true}
                  githubUrl="https://github.com/Chiranth-D-Nandi/LLM-red-teaming-supply-chain"
                  projectId="project-4"
                />
              </div>
            </div>

            {/* Project 3 - RBAC */}
            <div className="project-row" style={{
              display: 'flex',
              gap: '40px',
              marginBottom: '80px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Content on Left */}
              <div className="project-card" style={{ flex: 1 }}>
                <div style={{
                  background: '#ffd84d',
                  borderRadius: 16,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                  padding: '32px 36px',
                  minWidth: 340,
                  maxWidth: 550,
                  border: '1.5px solid #e0e0e0',
                  zIndex: 2,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: 'black',
                }}>
                  <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.45rem' : '1.5rem', marginBottom: 8 }}>Data Vault: File Encryption using AES and Role Based Access System RBAC. </div>
                  <div style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem', lineHeight: 1.7, fontWeight: 400 }}>
                    <p><strong>Technologies Used:</strong> C Programming, GTK3, OpenSSL, AES-256 Encryption, File I/O, CSV Logging, Inno Setup. </p>
                    <p>Built a desktop encryption application in C with GTK3 featuring RBAC (admin/staff roles), AES-256 encryption with automated key management (256-bit keys, 128-bit IVs), secure file deletion, audit logging, and Windows deployment via Inno Setup with zero external dependencies.</p>
                  </div>
                </div>
              </div>

              {/* Carousel on Right */}
              <div className="project-carousel" style={{ flex: '0 0 500px' }}>
                <Carousel 
                  images={project2Images} 
                  showGithub={true}
                  githubUrl="https://github.com/Chiranth-D-Nandi/DataVault-RBAC-AES-Encryption"
                  projectId="project-2"
                />
              </div>
            </div>

            {/* Project 4 - Health Monitoring */}
            <div className="project-row" style={{
              display: 'flex',
              gap: '40px',
              marginBottom: '60px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Content on Left */}
              <div className="project-card" style={{ flex: 1 }}>
                <div style={{
                  background: '#ffd84d',
                  borderRadius: 16,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                  padding: '32px 36px',
                  minWidth: 340,
                  maxWidth: 550,
                  border: '1.5px solid #e0e0e0',
                  zIndex: 2,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: 'black',
                }}>
                  <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.45rem' : '1.5rem', marginBottom: 8 }}>Heart Rate, Breathing Monitor using Computer Vision and remote photoplethysmography (rPPG).</div>
                  <div style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem', lineHeight: 1.7, fontWeight: 400 }}>
                    <p><strong>Technologies Used:</strong> Python, OpenCV, Haar Cascade, Deep Face, NumPy, SciPy, SQL.</p>
                    <p>Built a contactless health monitoring system using rPPG and DeepFace with Haar Cascade to detect heart rate and breathing rate for 4+ patients simultaneously via webcam, with automated SMS alerts through Twilio API for abnormal vitals.</p>
                  </div>
                </div>
              </div>

              {/* Carousel on Right */}
              <div className="project-carousel" style={{ flex: '0 0 500px' }}>
                <Carousel 
                  images={project1Images} 
                  showGithub={true}
                  githubUrl="https://github.com/Chiranth-D-Nandi/Health-Vitals-using-Webcam-RPPG"
                  projectId="project-1"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Research & Publications Section */}
        <div
        style={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
          padding: '40px 40px',
          minHeight: '100vh'
        }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ width: '100%', textAlign: 'center', marginBottom: '60px', display: 'flex', justifyContent: 'center' }}>
              <span style={{
                display: 'inline-block',
                background: '#070111',
                color: '#ffd84d',
                borderRadius: '18px',
                padding: '10px 38px 10px 38px',
                fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                fontWeight: 800,
                fontSize: '2.5rem',
                letterSpacing: '0.01em',
                textAlign: 'center',
                zIndex: 50
              }}>Research & Publications.</span>
            </div>

            {/* Research 1 */}
            <div className="research-row" style={{
              display: 'flex',
              gap: '40px',
              marginBottom: '60px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Content on Left */}
              <div className="research-card" style={{ flex: 1 }}>
                <div style={{
                  background: '#ffd84d',
                  borderRadius: 16,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                  padding: '32px 36px',
                  minWidth: 340,
                  maxWidth: 550,
                  border: '1.5px solid #e0e0e0',
                  zIndex: 2,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: 'black',
                }}>
                  <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.45rem' : '1.5rem', marginBottom: 8 }}>Synthesis of Ag-PPy/TiO₂ Nanocomposite Polymers Employing Ocimum tenuiflorum Extract-Derived TiO₂: AC Conductivity, Humidity Sensor Application, & EMI Shielding Efficiency. (April 2026)</div>
                  <div style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem', lineHeight: 1.7, fontWeight: 400 }}>
                    <p>Synthesised Ag-PPy/TiO₂ Nanocomposite Polymer via Green Synthesis, and presented the paper at a National Conference, NCQTAM-26 conducted by the Karnataka Physics Association.</p>
                    <p>Included structural characterization, AC conductivity, humidity sensor application, & EMI shielding properties. Experiments done under Dr. Revanasidappa at PES University, Electronic City Campus.</p>
                  </div>
                </div>
              </div>

              {/* Carousel on Right */}
              <div className="research-carousel" style={{ flex: '0 0 500px' }}>
                <Carousel 
                  images={research1Images}
                  projectId="research-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div ref={customCardRef} className="skills-section" style={{
          width: '100%',
          minHeight: '90vh',
          background: '#070111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobileView ? '28px 10px' : '60px 40px'
        }}>
        <div className="skills-card" style={{
          background: '#ffd84d',
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          padding: isMobileView ? '20px 16px' : '32px 36px',
          minWidth: isMobileView ? 0 : 340,
          maxWidth: isMobileView ? 'calc(100vw - 32px)' : 900,
          width: isMobileView ? 'calc(100% - 32px)' : 'auto',
          margin: isMobileView ? '0 auto' : '0',
          border: '1.5px solid #e0e0e0',
          zIndex: 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
          textAlign: 'left',
          fontWeight: 700,
          fontSize: isMobileView ? '1rem' : '1.5rem',
          color: 'white',
          marginBottom: '0px',
        }}>
            <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '2.2rem' : '2.5rem', marginBottom: 8, textAlign: 'center' }}>
              Skills
            </div>
            <div className="skills-content" style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.35rem', lineHeight: isMobileView ? 1.6 : 1.7, fontWeight: 400 }}>
              <p><strong>Languages:</strong> Python, C Programming, JavaScript, MySQL, HTML5.</p>
              <p><strong>Libraries and Frameworks:</strong> PyTorch, React, Django, Node.js, Express.js, MongoDB, LangChain, OpenCV, TensorFlow, Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn, GTK3.</p>
              <p><strong>AIML Technologies:</strong> Machine Learning, Computer Vision, Retrieval Augmented Generation (RAG), Vector Databases, Model Quantization, Generative AI, Multimodal LLM.</p>
              <p><strong>Tools:</strong> Model Context Protocol (MCP), AES Encryption, OpenSSL, Haar Cascade, Git.</p>
              <p><strong>Interests:</strong> Healthcare AI, Cybersecurity, Opensource.</p>
            </div>
        </div>
        </div>

        {/* About Section */}
        <div ref={aboutRef} style={{
          width: '100%',
          minHeight: '100vh',
          background: '#070111', // solid background to cover DotGrid
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10 // ensure above DotGrid
        }}>
          <div style={{ maxWidth: 1300, width: '100%', background: '#070111', padding: '10px 48px', textAlign: 'center', fontFamily: 'Montserrat, Arial, Helvetica, sans-serif', fontWeight: 400, fontSize: '1.3rem', color: 'white', marginBottom: '32px' }}>
            <p>Second year B.Tech CSE(AIML) student with experience in building AI and full stack applications. Proficient in Python and C, with coursework in data structures and MERN stack. Worked with machine learning, vector databases, computer vision, and cybersecurity. Interested in applying skills to cybersecurity problems and open source contribution. Seeking AIML internships or Software Engineering Internship opportunities.</p>
            <p>I am also a <strong>Published Aviation Photographer</strong> with publications with <strong>Air India Express</strong> (Tata Group), <strong>Star Air</strong> (Sanjay Ghodawat Group), and HAL Chief Test Pilot, and with community interactions across Europe, fostering cross cultural collaboration.</p>
            <p>As a <strong><em>Technical Team Member</em></strong> of Neural Hive, the official AIML tech club of PES University, I have conducted workshops and hackathons for 50+ students and collaborated with 11 member technical team on AI projects and research.</p>
          </div>
          <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DomeGallery fit={0.95} segments={30} grayscale={false} />
          </div>
        </div>
        {/* Contact Me Section */}
        <div style={{
          width: '100%',
          background: '#070111', // solid background to cover DotGrid
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '36px 0 60px 0',
          position: 'relative',
          zIndex: 10 // ensure above DotGrid
        }}>
          <div style={{
            background: '#18122B',
            borderRadius: '12px',
            padding: '18px 32px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
            fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
            color: 'white',
            fontWeight: 500,
            textAlign: 'center',
            minWidth: '320px',
            zIndex: '600px'
          }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', marginBottom: '8px'}}>
              <span style={{fontSize: '1.25rem', letterSpacing: '0.01em'}}><strong>Contact Me</strong></span>
              <a href="mailto:nandi.chiranth@gmail.com" style={{
                background: '#ffd84d',
                color: '#070111',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: '1.1rem',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
                marginLeft: '8px'
              }}>Email Me</a>
            </div>
            <div ref={contRef} style={{fontSize: '1.1rem', letterSpacing: '0.01em', paddingTop: '10px'}}>
              nandi.chiranth@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* Resume Request Modal */}
      <ResumeRequestModal isOpen={resumeModalOpen} onClose={() => setResumeModalOpen(false)} />
    </>
  );
}

export default App;