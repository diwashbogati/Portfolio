import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import LusionCanvas from './components/LusionCanvas';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import TerminalWidget from './components/TerminalWidget';
import Timeline from './components/Timeline';
import './App.css';

function App() {
  return (
    <div className="portfolio-app">
      {/* Custom glow cursor */}
      <CustomCursor />

      {/* Top scroll progress bar */}
      <ScrollProgress />

      {/* Unified Lusion-Style Interactive 3D Canvas */}
      <LusionCanvas />

      {/* Visual background grid overlay */}
      <div className="grid-overlay"></div>

      {/* Navigation bar */}
      <Navbar />

      {/* Main content sections */}
      <main className="main-content">
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <Projects />
        <Contact />
      </main>

      {/* Floating interactive CLI terminal widget */}
      <TerminalWidget />
    </div>
  );
}

export default App;

