import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  DollarSign, 
  User, 
  GraduationCap, 
  Video, 
  Award, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Percent, 
  AlertCircle 
} from 'lucide-react';

const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState('docs');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.role !== 'Trainer') {
        // Safe redirect if a candidate tries to view trainer space
        navigate('/dashboard');
      } else {
        setCurrentUser(parsed);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!currentUser) return null;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', fontFamily: 'var(--font-family)' }}>
      {/* 1. PREMIUM GLASSMORPHIC HERO WELCOME BANNER */}
      <div className="glass-panel animate-fade-in" style={{ 
        padding: '32px', 
        borderRadius: '24px', 
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.03))',
        border: '1px solid rgba(139, 92, 246, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '2rem',
              color: 'white',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}>
              MC
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              background: '#22c55e',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: '3px solid #0a0a0c'
            }}></div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 700 }}>Welcome back, Michael Chang!</h1>
              <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>Verified Expert</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0 0', fontSize: '0.95rem' }}>
              Trainer Workspace — Guide top engineering candidates and track your escrow ledger payouts.
            </p>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID ROW */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Completed Mock Sessions</span>
            <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>48</div>
          <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>+6 this week</span>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Earned (85% Net)</span>
            <DollarSign size={20} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>$6,120.00</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Based on $150.00/hr base rate</span>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Held in Platform Escrow</span>
            <Percent size={20} style={{ color: 'var(--accent-purple)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>$450.00</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Released immediately on complete</span>
        </div>
      </div>

      {/* 3. WORKSPACE TABS SELECTOR */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        borderBottom: '1px solid var(--border-light)', 
        marginBottom: '32px',
        paddingBottom: '8px'
      }}>
        <button 
          onClick={() => setActiveTab('docs')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 20px',
            color: activeTab === 'docs' ? 'white' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'docs' ? '2px solid var(--accent-purple)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <BookOpen size={16} /> Documentation & Guidelines
        </button>

        <button 
          onClick={() => setActiveTab('availability')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 20px',
            color: activeTab === 'availability' ? 'white' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'availability' ? '2px solid var(--accent-purple)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Calendar size={16} /> Availability Scheduler
        </button>

        <button 
          onClick={() => setActiveTab('ledger')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 20px',
            color: activeTab === 'ledger' ? 'white' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'ledger' ? '2px solid var(--accent-purple)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <DollarSign size={16} /> Commission & Escrow Payouts
        </button>
      </div>

      {/* 4. TAB CONTENTS VIEWPORT */}
      <div>
        {activeTab === 'docs' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            {/* Left side: Detailed documentation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText style={{ color: 'var(--accent-purple)' }} /> Mock Loop Guidelines & Rubric
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                  As an InterviewPro expert, you are expected to maintain the absolute highest standards of professional mentorship. Please review our standard grading rubrics before conducting mock loops.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'white' }}>1. Coding & Algorithms (45 Minutes)</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      Assess algorithmic correctness, code optimization, readability, and communication of trade-offs. Ensure candidates speak through their solutions.
                    </p>
                  </div>

                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'white' }}>2. System Design & Scalability (60 Minutes)</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      Evaluate trade-off analysis, horizontal scaling, caching strategies, load balancing, database schemas, and microservice segregation.
                    </p>
                  </div>

                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'white' }}>3. Behavioral & Soft Skills (30 Minutes)</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      Audit STAR method responses, conflict resolution, leadership traits, and team alignment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Platform Payout Rules */}
              <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award style={{ color: 'var(--accent-cyan)' }} /> Platform Escrow & Payout Agreement
                </h3>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <AlertCircle size={24} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    InterviewPro enforces a secure escrow release system to protect both experts and candidates. When a candidate books a session, payment is securely captured. Upon completing the mock session and submitting feedback, the **85% commission split** is instantly deposited to your bank routing.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Platform Commission</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>15%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Covers payment processing & hosting</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expert Net Payout</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-purple)' }}>85%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct release to your ledger</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Upcoming match with Boni */}
            <div>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', position: 'sticky', top: '100px' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'white' }}>Next Upcoming Session</h4>
                <div style={{ 
                  padding: '16px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-light)',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', fontWeight: 600 }}>SYSTEM DESIGN</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Today, 4:00 PM</span>
                  </div>
                  
                  <h5 style={{ margin: '0 0 12px 0', fontSize: '1.05rem', color: 'white' }}>System Design & Scalability Loop</h5>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#0ea5e9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}>
                      BY
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Boni Yeamin</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>BUET CSE Candidate</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>BUET B.Sc</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>100% Strength</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert('Launching video session workspace...')}
                  className="btn btn-primary" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Video size={16} /> Enter Video Room
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '32px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'white' }}>Availability Scheduler</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Set your available calendar blocks. Candidates will select slots directly matching these hours.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} style={{ 
                  padding: '16px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border-light)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px', color: 'white' }}>{day}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', padding: '4px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>4:00 PM - 6:00 PM</span>
                    <span style={{ fontSize: '0.75rem', padding: '4px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>7:00 PM - 9:00 PM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '32px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'white' }}>Commission Ledger Splits</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
              View escrow transactions, platform payouts, and historic commission splits.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Candidate</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Session Type</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Gross Booking</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Commission (15%)</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Your Net (85%)</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Escrow Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '16px 12px' }}>Boni Yeamin</td>
                    <td style={{ padding: '16px 12px' }}>System Design Mock</td>
                    <td style={{ padding: '16px 12px' }}>$150.00</td>
                    <td style={{ padding: '16px 12px', color: 'var(--accent-cyan)' }}>$22.50</td>
                    <td style={{ padding: '16px 12px', color: '#22c55e', fontWeight: 600 }}>$127.50</td>
                    <td style={{ padding: '16px 12px' }}><span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '100px', background: 'rgba(14, 165, 233, 0.15)', color: 'var(--accent-cyan)' }}>Active Escrow</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '16px 12px' }}>Alex Rivera</td>
                    <td style={{ padding: '16px 12px' }}>Coding & Algorithms</td>
                    <td style={{ padding: '16px 12px' }}>$150.00</td>
                    <td style={{ padding: '16px 12px', color: 'var(--accent-cyan)' }}>$22.50</td>
                    <td style={{ padding: '16px 12px', color: '#22c55e', fontWeight: 600 }}>$127.50</td>
                    <td style={{ padding: '16px 12px' }}><span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '100px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>Released Payout</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;
