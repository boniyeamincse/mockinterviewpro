import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  DollarSign, 
  User, 
  Compass,
  Video, 
  Award, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Percent, 
  AlertCircle,
  ChevronRight,
  LogOut,
  ChevronLeft,
  Briefcase
} from 'lucide-react';

const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.role !== 'Trainer') {
        navigate('/dashboard');
      } else {
        setCurrentUser(parsed);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#0a0a0c', 
      color: 'white',
      fontFamily: 'var(--font-family)',
      paddingTop: '80px' // Spacer for the global header navbar
    }}>
      
      {/* ==================== LEFT-SIDE MENU BAR (VERTICAL SIDEBAR) ==================== */}
      <div style={{
        width: '260px',
        borderRight: '1px solid var(--border-light)',
        background: 'rgba(10, 10, 12, 0.6)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: '24px',
        position: 'fixed',
        top: '80px',
        bottom: 0,
        left: 0,
        zIndex: 10
      }}>
        {/* Trainer Mini Profile */}
        <div style={{ 
          padding: '16px', 
          borderRadius: '16px', 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.03))',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.5rem',
            color: 'white',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.2)'
          }}>
            MC
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Michael Chang</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>Verified Expert</div>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              background: activeTab === 'overview' ? 'rgba(139, 92, 246, 0.15)' : 'none',
              border: activeTab === 'overview' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
              color: activeTab === 'overview' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <Compass size={18} style={{ color: activeTab === 'overview' ? 'var(--accent-purple)' : 'inherit' }} />
            Dashboard Overview
          </button>

          <button 
            onClick={() => setActiveTab('docs')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              background: activeTab === 'docs' ? 'rgba(139, 92, 246, 0.15)' : 'none',
              border: activeTab === 'docs' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
              color: activeTab === 'docs' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <BookOpen size={18} style={{ color: activeTab === 'docs' ? 'var(--accent-purple)' : 'inherit' }} />
            Guidelines & Docs
          </button>

          <button 
            onClick={() => setActiveTab('availability')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              background: activeTab === 'availability' ? 'rgba(139, 92, 246, 0.15)' : 'none',
              border: activeTab === 'availability' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
              color: activeTab === 'availability' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <Calendar size={18} style={{ color: activeTab === 'availability' ? 'var(--accent-purple)' : 'inherit' }} />
            Availability Slots
          </button>

          <button 
            onClick={() => setActiveTab('ledger')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              background: activeTab === 'ledger' ? 'rgba(139, 92, 246, 0.15)' : 'none',
              border: activeTab === 'ledger' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
              color: activeTab === 'ledger' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <DollarSign size={18} style={{ color: activeTab === 'ledger' ? 'var(--accent-cyan)' : 'inherit' }} />
            Payout & Commission
          </button>
        </div>

        {/* Sidebar Footer Logout */}
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s'
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* ==================== RIGHT-SIDE MAIN CONTENT PORT ==================== */}
      <div style={{ 
        marginLeft: '260px', 
        flex: 1, 
        padding: '40px',
        maxWidth: '1200px'
      }}>
        
        {activeTab === 'overview' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Glassmorphic Greeting */}
            <div className="glass-panel" style={{ 
              padding: '32px', 
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(6, 182, 212, 0.02))',
              border: '1px solid rgba(139, 92, 246, 0.12)'
            }}>
              <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 700 }}>Expert Dashboard Workspace</h2>
              <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '0.95rem' }}>
                Welcome back, Michael! Use the left sidebar to coordinate available hours, check BDT escrow splits, and review FAANG mock guidelines.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Session Hours</span>
                  <Clock size={18} style={{ color: 'var(--accent-cyan)' }} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>72.5 hrs</div>
              </div>

              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Commission Split</span>
                  <Percent size={18} style={{ color: 'var(--accent-purple)' }} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>85 / 15 Net</div>
              </div>

              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active Escrow Balance</span>
                  <DollarSign size={18} style={{ color: '#22c55e' }} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>$450.00</div>
              </div>
            </div>

            {/* Matching Section with Boni Yeamin */}
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'white' }}>Assigned Candidate Matching</h3>
              <div style={{ 
                padding: '24px', 
                borderRadius: '16px', 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#0ea5e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: 'white'
                  }}>
                    BY
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>Boni Yeamin</h4>
                      <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }}>BUET Graduate</span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      System Design & Scalability Mock loop — 100% Complete Profile
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Today at 4:00 PM</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration: 60 mins</div>
                  </div>
                  <button 
                    onClick={() => alert('Launching active video conference...')}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                  >
                    <Video size={16} /> Start Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText style={{ color: 'var(--accent-purple)' }} /> Mock Loop Guidelines & Rubric
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                Review our technical evaluation framework before grading candidates. You are expected to deliver constructive feedback within 12 hours of session completion.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'white' }}>1. Coding & Complexity Audit (45 min)</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Evaluate edge cases, dry-running, standard complexity metrics (Big O), and structural modularity.
                  </p>
                </div>

                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'white' }}>2. System Architecture & Scale (60 min)</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Evaluate schema structures, relational vs non-relational database selection, fallback networks, failovers, and caching architectures.
                  </p>
                </div>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
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
                    <span style={{ fontSize: '0.75rem', padding: '4px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>4pm - 6pm</span>
                    <span style={{ fontSize: '0.75rem', padding: '4px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>7pm - 9pm</span>
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
