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

import { internImages, halImages, project1Images, project2Images, project3Images, project4Images, fissionImages, research1Images } from './assets/carouselImages';
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
import BlogsPage from './components/BlogsPage.jsx';

function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (path === '/blogs' || hash === '#/blogs' || hash === '#blogs') {
        return 'blogs';
      }
    }
    return 'portfolio';
  });

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (path === '/blogs' || hash === '#/blogs' || hash === '#blogs') {
        setCurrentView('blogs');
      } else {
        setCurrentView('portfolio');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const openBlogsPage = () => {
    setCurrentView('blogs');
    window.history.pushState({ page: 'blogs' }, '', '#/blogs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToPortfolio = () => {
    setCurrentView('portfolio');
    if (window.location.hash === '#/blogs' || window.location.hash === '#blogs') {
      window.history.pushState({ page: 'portfolio' }, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [resumeHover, setResumeHover] = useState(false);
  const [blogsHover, setBlogsHover] = useState(false);
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

  if (currentView === 'blogs') {
    return (
      <>
        <BlogsPage onBackToPortfolio={backToPortfolio} isMobileView={isMobileView} />
        <ResumeRequestModal isOpen={resumeModalOpen} onClose={() => setResumeModalOpen(false)} />
      </>
    );
  }

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
        <button className="mobile-nav-item" onClick={() => { openBlogsPage(); setMobileMenuOpen(false); }}>Technical Writing</button>
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

          <button
            onClick={openBlogsPage}
            onMouseEnter={() => setBlogsHover(true)}
            onMouseLeave={() => setBlogsHover(false)}
            className="resume-btn"
            style={{
              backgroundColor: blogsHover ? 'transparent' : '#a06ee1',
              color: blogsHover ? '#a06ee1' : navColor,
              fontFamily: 'Montserrat',
              fontSize: 16,
              fontWeight: 600,
              border: '2px solid #a06ee1',
              padding: '6px 11px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Technical Writing
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
            <p style={{fontWeight: 400, fontSize: '1.2em', margin: '0.25rem 0'}}>CSE(AIML) 2028 at PES University, Bengaluru</p>
            <p style={{fontWeight: 400, fontSize: '1.2em', margin: '0.25rem 0'}}>6 months of internship experience in ML & Full Stack,</p>
            <p style={{fontWeight: 400, fontSize: '1.2em', margin: '0.25rem 0'}}>along with research experience in Gen AI Security.</p>
            <p style={{fontWeight: 400, fontSize: '1.2em', margin: '0.25rem 0'}}>Seeking Software Engineering or FDE roles.</p>
            <br></br>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center'}}>
              <button 
                onMouseEnter={() => setProjectsHover(true)}
                onMouseLeave={() => setProjectsHover(false)}
                onClick={openBlogsPage}
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
                }}>View My Technical Blogs</button>
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
        {/* Foreground content: Timeline of internships */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobileView ? '40px' : '60px',
          padding: isMobileView ? '18px 8px 30px 8px' : '30px 0 50px 0',
        }}>
          {/* HAL Internship */}
          <div className="work-foreground" style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            display: 'flex',
            flexDirection: isMobileView ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: isMobileView ? 'center' : 'flex-start',
          }}>
            {/* Left: Carousel */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="carousel-wrapper project-carousel" style={{ maxWidth: isMobileView ? 320 : 420, width: '100%', margin: isMobileView ? '0 auto' : '0' }}>
                <Carousel images={halImages} projectId="internship-hal" />
              </div>
            </div>
            {/* Right: Timeline and Description */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: isMobileView ? 'center' : 'flex-start', justifyContent: 'center', position: 'relative', height: '100%', width: '100%' }}>
              <div style={{ position: 'relative', width: isMobileView ? '100%' : '100%', minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: isMobileView ? 'center' : 'flex-start' }}>
                {/* Timeline vertical line connecting to next internship */}
                <div style={{
                  position: 'absolute',
                  left: timelineLeft,
                  top: 0,
                  bottom: isMobileView ? 0 : -60,
                  width: '3px',
                  background: '#070111',
                  borderRadius: '2px',
                  zIndex: 3
                }} />
                {/* Timeline dot with briefcase icon */}
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
                  <div style={{ color: '#594880', fontWeight: 700, fontSize: isMobileView ? '1.15rem' : '1.2rem', marginBottom: 6 }}>July 2026</div>
                  <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.45rem' : '1.5rem', marginBottom: 8 }}>
                    Software Engineer Intern<br />
                    Hindustan Aeronautics Limited (HAL, Engine Division)
                  </div>
                  <div style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem', lineHeight: 1.7 }}>
                    <p style={{ marginBottom: 12 }}>
                      My main task was to study existing network intrusion detection systems and evaluate a Quantum Neural Network and classical ML ensemble based approach for improving the same. In the process, I built an implementation using PennyLane, with a 10-qubit, 60 parameter circuit, Tkinter based GUI, and packaged the software into a distributable installer using Inno Setup.
                    </p>
                    <p>
                      I also got insights on data center design and maintenance standards, ERP, PL/SQL packages, and the software automation solutions the in house IT department at the Engine Division builds to enhance complex repetitive operations.
                    </p>
                    <p style={{ marginTop: 8, color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem' }}>Onsite, Bengaluru</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Crescenzia Internship */}
          <div className="work-foreground" style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            display: 'flex',
            flexDirection: isMobileView ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: isMobileView ? 'center' : 'flex-start',
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
                {/* Timeline dot with briefcase icon */}
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
                  <div style={{ color: '#594880', fontWeight: 700, fontSize: isMobileView ? '1.15rem' : '1.2rem', marginBottom: 6 }}>December 2025 - May 2026</div>
                  <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.45rem' : '1.5rem', marginBottom: 8 }}>
                    Software Developer Intern<br />
                    Crescenzia Wellness Private Limited.
                  </div>
                  <div style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem', lineHeight: 1.7 }}>
                    <p style={{ marginBottom: 12 }}>
                      Designed and developed a <strong>B2B order-to-fulfillment web-based automation pipeline</strong> (<strong>Node.js, MySQL, JWT Auth, RESTful APIs</strong>) with an integrated <strong>partial ERP module</strong>, replacing manual workflows. Implemented <strong>PDF.js automated document creation and parsing</strong> for PO, proforma invoice, and SORF, with secure 2FA and RBAC, and a <strong>per-customer product and pricing database</strong> managed by the sales inventory management ERP for ordering via the customer-facing site.
                    </p>
                    <p style={{ marginBottom: 12 }}>
                      Deployed and maintained the <strong>full-stack system in production on Hostinger</strong>, managing the database via <strong>phpMyAdmin</strong>. <strong>Actively being used</strong> by customers and admin, sales, accounts, fulfillment, manufacturing staff with <strong>RBAC</strong> on a daily basis.
                    </p>
                    <p style={{ marginTop: 12 }}><strong>Technologies: </strong>MERN stack, MySQL, JWT Auth, RESTFul APIs, PDF.js, Nodemailer,  Hostinger Production, pHp myadmin</p>
                    <p style={{ marginTop: 8, color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem' }}>Part-time Onsite, Bengaluru</p>
                  </div>
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

            {/* Project 2 - UGC Short Video / Reels Generation Engine */}
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
                  <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.45rem' : '1.5rem', marginBottom: 8 }}>Automated UGC Short Video / Reels Generation Engine</div>
                  <div style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem', lineHeight: 1.7, fontWeight: 400 }}>
                    <p><strong>Technologies Used:</strong> Python, Flask, n8n, Gemini 2.5 Flash, CogVideoX-2B, Edge TTS, OpenAI Whisper, FFmpeg, Redis, Celery, SQLite, asyncio, YouTube Data API v3.</p>
                    <p>Built an end-to-end reel generation pipeline via n8n webhooks and a Flask API running a concurrent DAG for trend research (YouTube API, Google Trends, News), Gemini scripting, Edge TTS voiceover, and CogVideoX-2B inference gated by an asyncio semaphore to prevent CUDA OOM.</p>
                    <p>Used FFmpeg composition with relative .srt aliasing to resolve Windows filter-graph conflicts. Generation of Timestamp aligned Subtitles using OpenAI Whisper. Redis + Celery as production upgrade path for job queue.</p>
                  </div>
                </div>
              </div>

              {/* Carousel on Right */}
              <div className="project-carousel" style={{ flex: '0 0 500px' }}>
                <Carousel 
                  images={project4Images} 
                  showGithub={true}
                  githubUrl="https://github.com/Chiranth-D-Nandi/n8n-content-engine"
                  projectId="project-ugc"
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

            {/* Research 1 - FISSION */}
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
                  <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.45rem' : '1.5rem', marginBottom: 8 }}>FISSION: A Framework for Evaluating Cross-Modal Prompt Injection in Tool-Calling Vision-Language Multi-Agent Systems</div>
                  <div style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.1rem', lineHeight: 1.7, fontWeight: 400 }}>
                    <p>Built FISSION, a framework for evaluating how an untrusted image can push a vision-language agent into a malicious downstream tool call. Accepted for publication in Springer LNNS at ICICC 2027 (International Conference on Innovative Computing and Communication).</p>
                    <p>Research gap: existing agent security benchmarks inject attacks through text, while multimodal attack studies stop at what the model outputs. The path from an image, through the vision encoder and language decoder, to a dispatched tool call had not been measured end to end, and FISSION was built to trace it.</p>
                    <p>Included a seven-surface threat taxonomy across three attack timings, a containerized multi-agent testbed built around MCP tool calling, and five defense layers, two of which gate tool dispatch. Work done under Dr. Geetha Dayalan at PES University’s Centre for Computer Networks and Cyber Security (CCNCS), with Abhyudaya M Hegde.</p>
                  </div>
                </div>
              </div>

              {/* Carousel on Right */}
              <div className="research-carousel" style={{ flex: '0 0 500px' }}>
                <Carousel 
                  images={fissionImages}
                  projectId="research-fission"
                />
              </div>
            </div>

            {/* Research 2 - Chemistry Paper */}
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
                  <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.45rem' : '1.5rem', marginBottom: 8 }}>Synthesis of Ag-PPy/TiO₂ Nanocomposite Polymers Employing Ocimum tenuiflorum Extract-Derived TiO₂: AC Conductivity, Humidity Sensor Application, & EMI Shielding Efficiency. (July 2025)</div>
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
              Skills & Certifications
            </div>
            <div className="skills-content" style={{ color: 'black', fontSize: isMobileView ? '1.15rem' : '1.35rem', lineHeight: isMobileView ? 1.6 : 1.7, fontWeight: 400 }}>
              <p><strong>Languages:</strong> Python, C Programming, JavaScript, SQL.</p>
              <p><strong>Libraries and Frameworks:</strong> PyTorch, OpenCV, INT8 Quantisation, Pandas, NumPy, Scikit-learn</p>
              <p><strong>Generative AI:</strong> LangChain, LangGraph, Retrieval Augmented Generation (RAG), vector databases, HuggingFace, Ollama, Gemini, LLM Fine Tuning, OWASP LLM Top 10, Model Context Protocol (MCP), Prompt Engineering.</p>
              <p><strong>Web & Systems:</strong> React, Node.js, Django, MongoDB, MySQL, RESTful APIs, Docker, Redis, Celery, Linux, OpenSSL, Git, n8n.</p>
              <div style={{ color: 'black', fontWeight: 700, fontSize: isMobileView ? '1.5rem' : '1.75rem', marginTop: 20, marginBottom: 8 }}>
                Certifications
              </div>
              <ul style={{ listStyleType: 'disc', paddingLeft: '24px', margin: '6px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Oracle Cloud Infrastructure 2025 Certified Generative AI Professional</strong> | Oracle, Oct 2025</li>
                <li><strong>Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate</strong> | Oracle, Oct 2025</li>
                <li><strong>Model Context Protocol: Advanced Topics</strong> | Anthropic, June 2026</li>
                <li><strong>Fine Tuning LLMs for Production</strong> | Activeloop</li>
                <li><strong>Practical Web Security and Ethical Hacking</strong> | PESU I/O, Nov 2025</li>
              </ul>
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
            <p>Third year B.Tech CSE(AIML) student with six months of internship experience in full stack (MERN) development and Machine Learning, along with research experience in Gen AI Security. Proficient in Python and C, with strong foundation in data structures, cybersecurity, RAG, and computer vision. Actively seeking AIML / Software Engineering / Forward Deployed Engineer opportunities. I would also love AI security roles or AI auditor roles should the tech scene be evolved to support such openings :)</p>
            <p>I am also a Magazine Published Aviation Photographer, having featured by Air India Express (Tata Group) and Star Air (Sanjay Ghodawat Group), and also have community interactions across Europe, fostering cross cultural collaboration. <a href="https://www.instagram.com/sierra_cdn/" target="_blank" rel="noopener noreferrer" style={{ color: '#ffd84d', textDecoration: 'underline' }}><em>Click here to view my aviation photography!</em></a></p>
            <p>As a <em>Technical Team Member</em> of Neural Hive, the official AI & ML tech club of PES University, I have conducted workshops and hackathons for 50+ students and collaborated with 11 member technical team on projects and peer learning.</p>
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