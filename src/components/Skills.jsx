import { Code, Database, Wrench, Layers } from './Icons';
import './Skills.css';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: <Code className="category-icon" />,
      skills: ['Python', 'C', 'JavaScript', 'HTML5', 'CSS3', 'SQL']
    },
    {
      title: 'Databases & Storage',
      icon: <Database className="category-icon" />,
      skills: ['MySQL', 'MongoDB', 'Relational Databases', 'NoSQL']
    },
    {
      title: 'Tools & Environments',
      icon: <Wrench className="category-icon" />,
      skills: ['Git', 'GitHub', 'VS Code', 'Ubuntu Linux', 'SDL2', 'XAMPP']
    },
    {
      title: 'Core Concepts',
      icon: <Layers className="category-icon" />,
      skills: ['OOP (Object Oriented Programming)', 'Database Design', 'Backend Development', 'Version Control']
    }
  ];

  return (
    <section id="skills" className="skills-section">
      <h2 className="section-title">
        Technical <span>Skills</span>
      </h2>

      <div className="skills-grid">
        {skillCategories.map((category, idx) => (
          <div key={idx} className="skills-card glass-card">
            <div className="skills-card-header">
              <div className="category-icon-wrapper">
                {category.icon}
              </div>
              <h3 className="category-title">{category.title}</h3>
            </div>
            
            <div className="skills-tags">
              {category.skills.map((skill, sIdx) => (
                <div key={sIdx} className="skill-tag">
                  <span className="skill-dot"></span>
                  <span className="skill-name">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
