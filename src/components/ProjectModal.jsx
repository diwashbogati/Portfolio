import { X, ExternalLink, Github, Shield, Server, Cpu, CheckCircle } from './Icons';
import './ProjectModal.css';

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-category">{project.category}</span>
            <h2 className="modal-title">{project.title}</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="modal-body">
          <p className="modal-description">{project.fullDescription || project.description}</p>

          {/* Architecture / Key Highlights */}
          {project.highlights && (
            <div className="modal-section">
              <h3 className="modal-section-title">
                <Server size={16} /> Key Technical Features & Architecture
              </h3>
              <ul className="modal-highlights">
                {project.highlights.map((item, idx) => (
                  <li key={idx}>
                    <CheckCircle size={15} className="highlight-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Security Features */}
          {project.securityFeatures && (
            <div className="modal-section">
              <h3 className="modal-section-title">
                <Shield size={16} /> Security & Integrity Measures
              </h3>
              <ul className="modal-highlights">
                {project.securityFeatures.map((sec, idx) => (
                  <li key={idx}>
                    <Shield size={15} className="highlight-icon security" />
                    <span>{sec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Cpu size={16} /> Technologies & Tools
            </h3>
            <div className="modal-tags">
              {project.tags.map((tag, idx) => (
                <span key={idx} className="tag-badge">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github size={18} /> View Repository
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Live Demo <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
