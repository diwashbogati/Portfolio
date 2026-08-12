import { useState } from 'react';
import { FolderGit2, Database, Monitor, GitFork } from './Icons';
import ProjectModal from './ProjectModal';
import './Projects.css';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      title: 'Library Management System',
      category: 'Full-Stack Database Application',
      description: 'A full-stack database-driven application developed as a university group project. I was responsible for backend architecture and database structure, optimizing book records management, query execution, and transactions.',
      fullDescription: 'A comprehensive library management platform built with Python and MySQL. As Lead Backend Developer, I designed the entire relational database schema, wrote the backend logic modules, managed team coordination and Git workflows. The system supports multi-role access (admin, librarian, student), fine tracking, and real-time inventory queries.',
      role: 'Lead Backend Developer & Database Designer',
      icon: <Database className="project-icon" />,
      tags: ['Python', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'SQL'],
      highlights: [
        'Designed fully normalized relational schema with foreign keys, indexes, and transactions in MySQL.',
        'Created modular Python backend with separation of concerns across data access and business logic layers.',
        'Coordinated Git branching strategies and pull-request review workflows for the full dev team.',
        'Implemented role-based access control for admin, librarian, and student roles.',
      ],
      securityFeatures: [
        'Parameterized SQL queries to prevent SQL injection attacks.',
        'Role-based access control (RBAC) with privilege separation.',
        'Transaction-safe write operations with ROLLBACK on failure.',
      ],
      githubUrl: 'https://github.com/diwashbogati',
    },
    {
      title: 'Computer Graphics Algorithms',
      category: 'Low-Level Graphics & Rendering',
      description: 'An academic exploration of low-level graphics algorithms. Implemented core rendering operations, pixel plotting formulas, and vector drawings using SDL2 and Python graphics.',
      fullDescription: 'A deep-dive into computer graphics fundamentals, implementing classic rendering algorithms from scratch using C and Python with SDL2. This project demonstrates understanding of the mathematical foundations behind modern GPUs, rasterization pipelines, and 2D geometric transformations.',
      role: 'Independent Researcher / Developer',
      icon: <Monitor className="project-icon" />,
      tags: ['Python', 'SDL2', 'C', 'Graphics Programming'],
      highlights: [
        'Implemented Digital Differential Analyzer (DDA) line drawing algorithm with floating point precision.',
        'Implemented Midpoint Circle (Bresenham) algorithm for custom pixel-perfect plotting.',
        'Developed interactive graphics interfaces using Python SDL2 bindings.',
        'Built 2D affine transformation pipeline: translate, rotate, scale, shear.',
      ],
      securityFeatures: [
        'Buffer boundary validation to prevent pixel overflow in framebuffer writes.',
        'Safe memory allocation and deallocation patterns in C routines.',
      ],
      githubUrl: 'https://github.com/diwashbogati',
    },
    {
      title: 'Collaborative Git & GitHub Development',
      category: 'DevOps & Version Control',
      description: 'Managed multiple repository systems for academic projects. Designed workflows, set up pull request reviews, resolved code merge conflicts, and kept clean git histories.',
      fullDescription: 'Established and maintained professional Git workflows across multiple academic and personal projects. Implemented branch protection rules, semantic commit conventions, automated pull request templates, and CI/CD concepts including automated README and documentation generation.',
      role: 'Repository Coordinator',
      icon: <GitFork className="project-icon" />,
      tags: ['Git', 'GitHub', 'CI/CD Concepts', 'Version Control'],
      highlights: [
        'Set up branch protection rules and repository access permissions for multi-contributor projects.',
        'Documented contribution guidelines, READMEs, and technical setup guides.',
        'Managed release tags, changelogs, and documentation across coursework project repositories.',
        'Implemented semantic versioning and structured commit message conventions.',
      ],
      securityFeatures: [
        'Branch protection rules preventing direct pushes to main/production branches.',
        'Required pull request review approvals before merging critical code.',
        'Secrets and credentials excluded via comprehensive .gitignore rules.',
      ],
      githubUrl: 'https://github.com/diwashbogati',
    },
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
              <h4 className="features-title">Contributions &amp; Key Features:</h4>
              <ul className="project-features">
                {project.highlights.slice(0, 3).map((feat, fIdx) => (
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
              <button
                onClick={() => setSelectedProject(project)}
                className="project-link"
                id={`project-details-${idx}`}
              >
                <span>Case Study</span>
                <FolderGit2 size={16} />
              </button>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link secondary"
                id={`project-link-${idx}`}
              >
                <span>GitHub</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Projects;
