import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Zap, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-light)',
      background: 'rgba(10, 10, 15, 0.8)',
      backdropFilter: 'blur(12px)',
      padding: '60px 0 30px',
      marginTop: '80px',
      fontFamily: 'var(--font-family)',
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '0.9rem'
            }}>
              I
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>InterviewPro</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '300px', lineHeight: '1.6' }}>
            Elevate your interview game with premium 1-on-1 mock sessions led by industry top engineers.
          </p>
          {/* Social Icons with custom SVG to avoid missing Lucide brand icons */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {/* Github */}
            <a href="https://github.com" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='white'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            {/* Twitter */}
            <a href="https://twitter.com" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='white'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            {/* Linkedin */}
            <a href="https://linkedin.com" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='white'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, marginBottom: '20px' }}>For Candidates</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/trainers" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>Find a Trainer</Link></li>
            <li><Link to="/features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>How It Works</Link></li>
            <li><Link to="/pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>Pricing</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, marginBottom: '20px' }}>For Trainers</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/become-trainer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>Become a Trainer</Link></li>
            <li><Link to="/guidelines" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>Trainer Guidelines</Link></li>
            <li><Link to="/escrow" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>Escrow Policy</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, marginBottom: '20px' }}>Company</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>About Us</Link></li>
            <li><Link to="/careers" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>Careers</Link></li>
            <li><Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>Contact Support</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container" style={{
        borderTop: '1px solid var(--border-light)',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} InterviewPro. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }} onMouseOver={e => e.target.style.color='var(--text-secondary)'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>Terms of Service</Link>
          <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }} onMouseOver={e => e.target.style.color='var(--text-secondary)'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
