import { useState } from 'react';
import { Mail, Phone, MapPin, Github, Send, CheckCircle } from './Icons';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/xeeyadzv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSent(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSent(false), 5000);
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <h2 className="section-title">
        Get In <span>Touch</span>
      </h2>

      <div className="contact-grid">
        {/* Left Side: Contact info */}
        <div className="contact-info-container">
          <div className="contact-info-card glass-card">
            <h3 className="contact-heading">Contact Information</h3>
            <p className="contact-intro">
              Have an internship opportunity, a project proposal, or just want to say hi? Feel free to reach out using the form or direct details below.
            </p>

            <div className="contact-details-list">
              <div className="contact-detail-item">
                <div className="detail-icon-wrapper">
                  <Mail size={18} />
                </div>
                <div className="detail-text">
                  <span className="detail-label">Email</span>
                  <a href="mailto:DiwashBogati7@gmail.com" className="detail-value">
                    DiwashBogati7@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon-wrapper">
                  <Phone size={18} />
                </div>
                <div className="detail-text">
                  <span className="detail-label">Phone</span>
                  <a href="tel:+9779865374718" className="detail-value">
                    +977 9865374718
                  </a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon-wrapper">
                  <MapPin size={18} />
                </div>
                <div className="detail-text">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">Kathmandu, Nepal</span>
                </div>
              </div>
            </div>

            <div className="contact-socials">
              <h4 className="socials-title">On the Web</h4>
              <div className="socials-grid">
                <a
                  href="https://github.com/diwashbogati"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  aria-label="GitHub Profile"
                  id="contact-social-github"
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form glass-card">
            <div className="form-glow"></div>
            
            <div className="form-group">
              <label htmlFor="form-name" className="form-label">Full Name *</label>
              <input
                type="text"
                id="form-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="form-email" className="form-label">Email Address *</label>
              <input
                type="email"
                id="form-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="form-subject" className="form-label">Subject</label>
              <input
                type="text"
                id="form-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input"
                placeholder="Project Collaboration"
              />
            </div>

            <div className="form-group">
              <label htmlFor="form-message" className="form-label">Your Message *</label>
              <textarea
                id="form-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                rows="5"
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>

            {error && <div className="form-error">{error}</div>}
            
            {isSent && (
              <div className="form-success">
                <CheckCircle size={18} />
                <span>Message sent successfully! Thank you.</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary form-submit-btn"
              disabled={isSubmitting}
              id="contact-btn-submit"
            >
              {isSubmitting ? (
                'Establishing connection...'
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      
      <footer className="portfolio-footer">
        <p>&copy; {new Date().getFullYear()} Diwash Bogati. All Rights Reserved.</p>
        <p className="footer-meta">BCA Student | Developer Portfolio</p>
      </footer>
    </section>
  );
};

export default Contact;
