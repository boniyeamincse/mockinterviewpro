import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Compass } from 'lucide-react';
import { api, logoutUser } from '../lib/api';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamically load user status on render and route transitions
  useEffect(() => {
    setCurrentUser(api.getStoredUser());
  }, [location]);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{ 
      position: 'fixed', 
      top: '1rem', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      width: '90%', 
      maxWidth: '1200px', 
      zIndex: 100,
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '100px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: 'white'
        }}>
          I
        </div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '1.2rem' }}>
          InterviewPro
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>Features</Link>
        {(!currentUser || currentUser.user_type !== 'trainer') && (
          <Link to="/trainers" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>Find Trainers</Link>
        )}
        
        {currentUser && (
          <>
            {currentUser.user_type !== 'trainer' && (
              <Link to="/become-trainer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>Become a Trainer</Link>
            )}
            <Link to={currentUser.user_type === 'trainer' ? "/trainer/dashboard" : "/dashboard"} style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Compass size={16} /> Workspace
            </Link>
          </>
        )}

        <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Hi, <span style={{ color: 'white', fontWeight: 600 }}>{currentUser.name?.split(' ')[0] || 'there'}</span>
            </span>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ 
                padding: '6px 12px', 
                fontSize: '0.8rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.05)',
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Sign In</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
