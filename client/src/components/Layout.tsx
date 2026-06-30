import type { ReactNode } from 'react';
import { FiGithub, FiZap } from 'react-icons/fi';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <div className="navbar-logo">
              <FiZap />
            </div>
            <span className="gradient-text">Snip</span>
          </div>
          <div className="navbar-links">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-link"
            >
              <FiGithub size={16} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="app-main">{children}</main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Built with <span className="footer-heart">❤️</span> using React, TypeScript & Node.js
        </p>
        <p style={{ marginTop: 4 }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
