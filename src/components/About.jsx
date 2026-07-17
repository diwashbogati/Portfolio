import { BookOpen, Calendar, ShieldCheck, GraduationCap } from './Icons';
import './About.css';

const About = () => {
  const stats = [
    {
      icon: <GraduationCap className="stat-icon" />,
      label: 'Institution',
      value: 'Pokhara University',
      sub: 'BCA (B. of Computer Applications)'
    },
    {
      icon: <BookOpen className="stat-icon" />,
      label: 'Current Status',
      value: '4th Semester',
      sub: 'Active Academic Term'
    },
    {
      icon: <Calendar className="stat-icon" />,
      label: 'Expected Graduation',
      value: '2028',
      sub: 'Four-year degree duration'
    },
    {
      icon: <ShieldCheck className="stat-icon" />,
      label: 'Focus Area',
      value: 'Backend & Cyber Security',
      sub: 'Ethical systems engineering'
    }
  ];

  const interests = [
    'Full-Stack Development',
    'Backend Engineering',
    'Artificial Intelligence',
    'Ethical Hacking',
    'Cybersecurity',
    'Linux Systems',
    'Open Source Software'
  ];

  return (
    <section id="about" className="about-section">
      <h2 className="section-title">
        About <span>Me</span>
      </h2>

      <div className="about-grid">
        {/* Left Side: Story */}
        <div className="about-story glass-card">
          <div className="card-header-glow"></div>
          <h3 className="story-title">Backend Developer & Ethical Tech Enthusiast</h3>
          
          <p className="story-text">
            I am a motivated and enthusiastic student currently pursuing my Bachelor of Computer Applications (BCA) at Pokhara University. My journey in tech is driven by an intense curiosity about how software functions under the hood, leading me to specialize in backend engineering, database management, and Linux systems.
          </p>

          <p className="story-text">
            Beyond building applications, I am deeply interested in ethical hacking and cybersecurity. I believe that understanding security is critical to developing robust, production-grade applications that protect user data and maintain system integrity.
          </p>

          <div className="interests-container">
            <h4 className="interests-title">Core Interests</h4>
            <div className="interests-grid">
              {interests.map((interest, idx) => (
                <span key={idx} className="tag-badge">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Stats Grid */}
        <div className="about-stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card glass-card">
              <div className="stat-icon-wrapper">
                {stat.icon}
              </div>
              <div className="stat-details">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-sub">{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
