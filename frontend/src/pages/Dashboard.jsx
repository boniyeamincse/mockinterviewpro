import React, { useState, useEffect } from 'react';
import { Video, Calendar, Shield, DollarSign, Clock, CheckCircle, User, Mail, Award, BookOpen, LogOut } from 'lucide-react';
import studentImg from '../assets/avatar_student.png';

const Dashboard = () => {
  const [user, setUser] = useState({
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'Candidate',
    joinedDate: 'May 2026'
  });
  
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', fontFamily: 'var(--font-family)' }}>
      
      {/* Header Banner */}
      <div className="glass-panel animate-fade-in" style={{ 
        padding: '32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1 }}>
          <img src={studentImg} alt="User Avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', objectFit: 'cover' }} />
          <div>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '4px', fontWeight: 700 }}>Welcome back, {user.name}!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.role} Workspace — Track your mock loops and score progress.</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', zIndex: 1 }}>
          <button 
            onClick={() => setShowProfile(!showProfile)} 
            className="btn btn-secondary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <User size={16} /> {showProfile ? 'Hide Profile' : 'View Profile'}
          </button>
          <button 
            onClick={handleLogout} 
            className="btn" 
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.85rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: '#ef4444',
              cursor: 'pointer',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Grid: Left is main stats/schedules, Right is dynamic profile or tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: showProfile ? '2fr 1fr' : '1fr', gap: '32px', transition: 'all 0.3s ease' }}>
        
        {/* Main Content Area */}
        <div>
          {/* Grid Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '24px', 
            marginBottom: '32px' 
          }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Sessions booked</span>
              <h3 style={{ fontSize: '2.2rem', marginTop: '8px', fontWeight: 700 }}>12</h3>
            </div>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Hours Spent Mocking</span>
              <h3 style={{ fontSize: '2.2rem', marginTop: '8px', fontWeight: 700 }}>6.5 hrs</h3>
            </div>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Completed Reviews</span>
              <h3 style={{ fontSize: '2.2rem', marginTop: '8px', fontWeight: 700 }}>8</h3>
            </div>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Average Score</span>
              <h3 style={{ fontSize: '2.2rem', marginTop: '8px', color: 'var(--accent-cyan)', fontWeight: 700 }}>8.4 / 10</h3>
            </div>
          </div>

          {/* Bottom Split Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: showProfile ? '1fr' : '2fr 1fr', gap: '32px' }}>
            {/* Upcoming Interview Sessions */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', fontWeight: 600 }}>Upcoming Interview Sessions</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '20px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: '12px',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '10px', 
                      background: 'rgba(139,92,246,0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--accent-purple)'
                    }}>
                      <Video size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>System Design & Scalability</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>Trainer: Michael Chang (Staff Engineer, Google)</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block' }}>Today, 4:00 PM</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Duration: 60 mins</span>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Join Room</button>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '20px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: '12px',
                  opacity: 0.7,
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '10px', 
                      background: 'rgba(6,182,212,0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)'
                    }}>
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Behavioral & Leadership</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>Trainer: Sarah Jenkins (HR Director, Netflix)</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block' }}>May 20, 10:00 AM</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Duration: 45 mins</span>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Details</button>
                </div>
              </div>
            </div>

            {/* Tasks (when Profile is hidden) */}
            {!showProfile && (
              <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', fontWeight: 600 }}>Preparation Tasks</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--accent-cyan)' }}><CheckCircle size={18} /></span>
                    <div>
                      <span style={{ fontWeight: 500 }}>Upload latest Resume</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Reviewed by Michael Chang</p>
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--accent-cyan)' }}><CheckCircle size={18} /></span>
                    <div>
                      <span style={{ fontWeight: 500 }}>Connect GitHub / Portfolio</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Synchronized successfully</p>
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}><CheckCircle size={18} /></span>
                    <div>
                      <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Review System Design Video</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Pending before next session</p>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* PROFILE SIDEBAR SECTION */}
        {showProfile && (
          <div className="glass-panel animate-fade-in" style={{ padding: '32px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', fontWeight: 600 }}>
              My Profile
            </h3>
            
            {/* Card details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)' }}>
                  <User size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Full Name</span>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Email Address</span>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', wordBreak: 'break-all' }}>{user.email}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Award size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Account Role</span>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>{user.role}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Member Since</span>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>{user.joinedDate}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)' }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Preparation Path</span>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>Full Stack Engineer</span>
                </div>
              </div>
            </div>

            <div style={{ 
              marginTop: '32px', 
              paddingTop: '20px', 
              borderTop: '1px solid var(--border-light)',
              background: 'rgba(255, 255, 255, 0.01)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Security & Auth Status</span>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: '#10b981', 
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '4px 12px',
                borderRadius: '100px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                Verified Account
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
