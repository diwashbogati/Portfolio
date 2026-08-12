import { GraduationCap, ShieldCheck, Server, Cpu } from './Icons';
import './Timeline.css';

const Timeline = () => {
  const milestones = [
    {
      year: '2022 - Present',
      title: 'Bachelor of Computer Applications (BCA)',
      institution: 'Pokhara University, Nepal',
      description: 'Studying core computer science, database management systems, data structures, algorithms, and software development methodologies.',
      icon: GraduationCap,
      tags: ['BCA', 'DBMS', 'Algorithms', 'Software Engineering'],
    },
    {
      year: '2023',
      title: 'Backend Systems & Database Architecture',
      institution: 'Specialized Track',
      description: 'Built high-throughput REST APIs, asynchronous task processing queues, Redis caching layers, and PostgreSQL relational database schemas.',
      icon: Server,
      tags: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'REST APIs'],
    },
    {
      year: '2023 - 2024',
      title: 'Cyber Security & Ethical Hacking Labs',
      institution: 'TryHackMe & Hands-on Security Labs',
      description: 'Practiced network reconnaissance, penetration testing, vulnerability assessment, Linux privilege escalation, and web application security testing.',
      icon: ShieldCheck,
      tags: ['Linux Security', 'Wireshark', 'Metasploit', 'Nmap', 'Penetration Testing'],
    },
    {
      year: '2024 - Present',
      title: 'AI Integration & Real-time WebGL Applications',
      institution: 'Advanced Projects',
      description: 'Integrating machine learning models and real-time 3D graphics (Three.js/WebGL) with robust backend services for interactive web applications.',
      icon: Cpu,
      tags: ['Three.js', 'WebGL', 'AI Integration', 'React', 'GSAP'],
    },
  ];

  return (
    <section id="experience" className="timeline-section">
      <h2 className="section-title">
        Education & <span>Journey</span>
      </h2>

      <div className="timeline-container">
        <div className="timeline-line"></div>

        {milestones.map((item, idx) => {
          const IconComponent = item.icon;
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              className={`timeline-item ${isEven ? 'left' : 'right'}`}
            >
              <div className="timeline-dot">
                <IconComponent size={18} />
              </div>

              <div className="timeline-content glass-card">
                <span className="timeline-year">{item.year}</span>
                <h3 className="timeline-title">{item.title}</h3>
                <h4 className="timeline-institution">{item.institution}</h4>
                <p className="timeline-description">{item.description}</p>

                <div className="timeline-tags">
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="tag-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Timeline;
