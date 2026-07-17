import { useEffect, useState } from 'react';
import { Github, ArrowRight, MapPin, Terminal } from './Icons';
import PixelBlast from './PixelBlast';
import './Hero.css';

const Hero = () => {
  const words = [
    'Full Stack Developer',
    'BCA Student @ Pokhara University',
    'Backend Engineer',
    'Cyber Security & AI Enthusiast'
  ];
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 2000;

  useEffect(() => {
    let timer;
    const activeWord = words[currentWordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(activeWord.substring(0, currentText.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(activeWord.substring(0, currentText.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && currentText === activeWord) {
      timer = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Background PixelBlast Effect */}
      <div className="hero-bg">
        <PixelBlast
          variant="circle"
          pixelSize={5}
          color="#B497CF"
          patternScale={2.5}
          patternDensity={1.2}
          pixelSizeJitter={0.4}
          enableRipples={true}
          rippleSpeed={0.35}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={true}
          liquidStrength={0.15}
          liquidRadius={1.1}
          liquidWobbleSpeed={4.8}
          speed={0.4}
          edgeFade={0.3}
          transparent={true}
        />
      </div>

      <div className="hero-container">
        <div className="hero-badge">
          <Terminal size={14} className="badge-icon" />
          <span className="badge-text">SYSTEM READY // portfolio.db</span>
        </div>

        <h1 className="hero-title">
          Hi, I'm <span className="accent-name">Diwash Bogati</span>
        </h1>

        <div className="hero-subtitle">
          <span className="prefix">&gt; </span>
          <span className="typewriter">{currentText}</span>
          <span className="typing-cursor"></span>
        </div>

        <p className="hero-description">
          Motivated software engineer in training, currently studying Bachelor of Computer Applications (BCA) at Pokhara University. Specialized in building robust backend services, designing databases, and creating secure, high-performance applications.
        </p>

        <div className="hero-meta">
          <div className="meta-item">
            <MapPin size={16} />
            <span>Kathmandu, Nepal</span>
          </div>
        </div>

        <div className="hero-actions">
          <button 
            onClick={() => scrollToSection('projects')} 
            className="btn-primary"
            id="hero-btn-projects"
          >
            Explore Projects <ArrowRight size={16} />
          </button>
          
          <button 
            onClick={() => scrollToSection('contact')} 
            className="btn-secondary"
            id="hero-btn-contact"
          >
            Get In Touch
          </button>

          <a 
            href="https://github.com/diwashbogati" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-icon"
            aria-label="GitHub Profile"
            id="hero-link-github"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
      
      <div className="scroll-indicator" onClick={() => scrollToSection('about')}>
        <div className="indicator-mouse">
          <div className="indicator-wheel"></div>
        </div>
        <span>Scroll to Explore</span>
      </div>
    </section>
  );
};

export default Hero;
