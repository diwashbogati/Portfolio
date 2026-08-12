import { useState, useRef, useEffect } from 'react';
import { Terminal, Maximize2, Minimize2, X } from './Icons';
import './TerminalWidget.css';

const TerminalWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Diwash OS v2.4 (x86_64-pc-linux-gnu)' },
    { type: 'system', text: 'Type "help" or "fetch" to explore interactive commands.' },
  ]);

  const outputEndRef = useRef(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isOpen]);

  const handleCommand = (cmdStr) => {
    const rawCmd = cmdStr.trim();
    const cmd = rawCmd.toLowerCase();

    const newHistory = [...history, { type: 'user', text: `diwash@portfolio:~$ ${rawCmd}` }];

    if (cmd === 'help') {
      newHistory.push({
        type: 'output',
        text: `Available Commands:
  whoami      - Display developer profile
  skills      - List backend & cyber security stack
  projects    - Show featured projects
  contact     - Display contact information
  fetch       - Print system & developer status
  sudo hire   - Execute recruitment protocol
  clear       - Clear terminal screen`,
      });
    } else if (cmd === 'whoami') {
      newHistory.push({
        type: 'output',
        text: `User: Diwash Bogati
Role: Software Engineer / BCA Student @ Pokhara University
Location: Kathmandu, Nepal
Focus: Backend Engineering, Cyber Security (Ethical Hacking), Linux Systems & AI Integration`,
      });
    } else if (cmd === 'skills') {
      newHistory.push({
        type: 'output',
        text: `[Backend]        Node.js, Express, Python, REST APIs, GraphQL
[Databases]      PostgreSQL, MongoDB, Redis, MySQL
[Security & OS]  Linux Admin, Wireshark, Metasploit, Nmap, Cryptography
[Frontend]       React, Vite, JavaScript, Three.js, GSAP`,
      });
    } else if (cmd === 'projects') {
      newHistory.push({
        type: 'output',
        text: `1. Secure Vault API       - Encrypted password manager API (Node.js/Redis)
2. Cyber Sentinel Tool   - Network vulnerability scanner (Python/Scapy)
3. Smart Task DB Engine   - Distributed task queue & cache system`,
      });
    } else if (cmd === 'contact') {
      newHistory.push({
        type: 'output',
        text: `Email:    DiwashBogati7@gmail.com
Phone:    +977 9865374718
Location: Kathmandu, Nepal
GitHub:   https://github.com/diwashbogati`,
      });
    } else if (cmd === 'fetch') {
      newHistory.push({
        type: 'output',
        text: `
  /\\_\\_\\     OS: Diwash Linux 6.8.0-custom
 / / / /     Host: JARVIS-v9.1 Neural Core [ARM-X64]
 \\/\\_\\/      Uptime: 2.4 years of continuous uptime
             Shell: zsh 5.9 [encrypted]
             Theme: Electric Purple Obsidian
             GPU: WebGL2 Renderer @ 60fps
             Status: Open for Internships & Projects
`,
      });
    } else if (cmd === 'sudo hire' || cmd === 'hire') {
      newHistory.push({
        type: 'output',
        text: `[ROOT ACCESS GRANTED] Initiating hire sequence...
[✓] Authenticating credentials...
[✓] Routing to secure contact channel...
[✓] Redirecting to contact form NOW...`,
      });
      // Actually scroll to the contact section after a short delay
      setTimeout(() => {
        const contactEl = document.getElementById('contact');
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Flash the contact section border to draw attention
          contactEl.style.outline = '2px solid rgba(180, 151, 207, 0.9)';
          contactEl.style.boxShadow = '0 0 40px rgba(180, 151, 207, 0.4)';
          contactEl.style.transition = 'outline 0.5s, box-shadow 0.5s';
          setTimeout(() => {
            contactEl.style.outline = '';
            contactEl.style.boxShadow = '';
          }, 2000);
        }
      }, 800);
    } else if (cmd === 'clear') {
      setHistory([]);
      return;
    } else if (cmd === '') {
      // Do nothing
    } else {
      newHistory.push({
        type: 'error',
        text: `zsh: command not found: ${rawCmd}. Type "help" for valid commands.`,
      });
    }

    setHistory(newHistory);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal) return;
    handleCommand(inputVal);
    setInputVal('');
  };

  return (
    <>
      {/* Floating launcher button in bottom left */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="terminal-launcher-btn"
          aria-label="Open Interactive Terminal"
        >
          <Terminal size={18} />
          <span>&gt;_ CLI</span>
        </button>
      )}

      {/* Terminal window */}
      {isOpen && (
        <div className={`terminal-window glass-card ${isMinimized ? 'minimized' : ''}`}>
          {/* Titlebar */}
          <div className="terminal-titlebar">
            <div className="terminal-title">
              <Terminal size={14} className="terminal-icon" />
              <span>diwash@portfolio: ~ (zsh)</span>
            </div>

            <div className="terminal-controls">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="control-btn minimize"
                aria-label="Minimize"
              >
                {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="control-btn close"
                aria-label="Close"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Terminal body */}
          {!isMinimized && (
            <div className="terminal-body">
              <div className="terminal-history">
                {history.map((item, idx) => (
                  <div key={idx} className={`terminal-line ${item.type}`}>
                    <pre>{item.text}</pre>
                  </div>
                ))}
                <div ref={outputEndRef} />
              </div>

              {/* Input prompt */}
              <form onSubmit={handleSubmit} className="terminal-prompt">
                <span className="prompt-label">diwash@portfolio:~$ </span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="prompt-input"
                  placeholder="type help..."
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TerminalWidget;
