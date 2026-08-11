import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import LusionCanvas from './components/LusionCanvas';
import './App.css';

function App() {
  return (
    <div className="portfolio-app">
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
        <Projects />
        <Contact />
      </main>
    </div>
  );
}

export default App;
