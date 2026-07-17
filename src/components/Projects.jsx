import { FolderGit2, Database, Monitor, GitFork } from './Icons';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      title: 'Library Management System',
      description: 'A full-stack database-driven application developed as a university group project. I was responsible for backend architecture and database structure, optimizing book records management, query execution, and transactions.',
      role: 'Lead Backend Developer & Database Designer',
      icon: <Database className="project-icon" />,
      tags: ['Python', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'SQL'],
      features: [
        'Designed normalized relational schema and constraints in MySQL.',
        'Created reliable backend Python modules for library logic.',
        'Coordinated Git branching strategies and workflows for the dev team.'
      ]
    },
    {
      title: 'Computer Graphics Algorithms',
      description: 'An academic exploration of low-level graphics algorithms. Implemented core rendering operations, pixel plotting formulas, and vector drawings using SDL2 and Python graphics.',
      role: 'Independent Researcher / Developer',
      icon: <Monitor className="project-icon" />,
      tags: ['Python', 'SDL2', 'C', 'Graphics Programming'],
      features: [
        'Implemented Digital Differential Analyzer (DDA) line drawing algorithm.',
        'Implemented Midpoint Circle drawing algorithm for custom plotting.',
        'Developed interactive graphic interfaces using Python bindings.'
      ]
    },
    {
      title: 'Collaborative Git & GitHub Development',
      description: 'Managed multiple repository systems for academic projects. Designed workflows, set up pull request reviews, resolved code merge conflicts, and kept clean git histories.',
      role: 'Repository Coordinator',
      icon: <GitFork className="project-icon" />,
      tags: ['Git', 'GitHub', 'CI/CD Concepts', 'Version Control'],
      features: [
        'Set up repository access permissions and branch protection rules.',
        'Documented guidelines and READMEs for technical project setups.',
        'Managed release tags and documentation changes for coursework projects.'
      ]
    }
  ];

  return (
    <section id="projects" className="projects-section">
      <h2 className="section-title">
        Featured <span>Projects</span>
      </h2>

      <div className="projects-grid">
        {projects.map((project, idx) => (
          <div key={idx} className="project-card glass-card">
            <div className="project-header">
              <div className="project-icon-wrapper">
                {project.icon}
              </div>
              <div className="project-meta-info">
                <span className="project-role">{project.role}</span>
                <h3 className="project-title">{project.title}</h3>
              </div>
            </div>

            <p className="project-description">{project.description}</p>

            <div className="project-features-container">
              <h4 className="features-title">Contributions & Key Features:</h4>
              <ul className="project-features">
                {project.features.map((feat, fIdx) => (
                  <li key={fIdx}>{feat}</li>
                ))}
              </ul>
            </div>

            <div className="project-tags">
              {project.tags.map((tag, tIdx) => (
                <span key={tIdx} className="tag-badge">
                  {tag}
                </span>
              ))}
            </div>

            <div className="project-actions">
              <a
                href="https://github.com/diwashbogati"
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                id={`project-link-${idx}`}
              >
                <span>View Source</span>
                <FolderGit2 size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
