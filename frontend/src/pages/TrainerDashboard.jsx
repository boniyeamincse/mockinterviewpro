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
  LogOut,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  CheckCircle,
  Clock3,
  Sliders,
  Play,
  Briefcase
} from 'lucide-react';
import {
  getTrainerProfile,
  getTrainerAnalyticsOverview,
  getTrainerBookingsToday,
  getTrainerWallet,
  getTrainerWalletTransactions,
  logoutUser,
} from '../lib/api';

const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionFeedback, setSessionFeedback] = useState({
    codingScore: 8,
    systemDesignScore: 9,
    behavioralScore: 8,
    writtenNotes: ''
  });
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [todayBookings, setTodayBookings] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) + ' • ' + currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const getGreeting = () => {
    if (!currentUser) return 'Good morning';
    const hr = currentTime.getHours();
    const name = currentUser.name?.split(' ')[0] || 'Trainer';
    if (hr < 12) return `Good morning, ${name}`;
    if (hr < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.role !== 'Trainer') {
        navigate('/dashboard');
      } else {
        setCurrentUser(parsed);
        // Fetch live trainer data
        getTrainerProfile().then(res => res?.data && setCurrentUser(prev => ({ ...prev, ...res.data }))).catch(() => {});
        getTrainerAnalyticsOverview().then(res => res?.data && setAnalytics(res.data)).catch(() => {});
        getTrainerBookingsToday().then(res => res?.data && setTodayBookings(Array.isArray(res.data) ? res.data : [])).catch(() => {});
        getTrainerWallet().then(res => res?.data && setWallet(res.data)).catch(() => {});
        getTrainerWalletTransactions().then(res => res?.data?.data && setTransactions(res.data.data)).catch(() => {});
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try { await logoutUser(); } catch (_) {}
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setSubmittedFeedback(true);
    setTimeout(() => {
      alert('Feedback report generated and locked to Candidate profile ledger successfully!');
    }, 200);
  };

  if (!currentUser) return null;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top left, #0d091a, #050508)', 
      color: 'white',
      fontFamily: 'var(--font-family)',
      paddingTop: '0px'
    }}>
      
      {/* ==================== ENTERPRISE-GRADE LEFT SIDEBAR ==================== */}
      <div style={{
        width: '280px',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(5, 5, 8, 0.75)',
        backdropFilter: 'blur(30px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 20px',
        gap: '28px',
        position: 'fixed',
        top: '0px',
        bottom: 0,
        left: 0,
        zIndex: 10,
        boxShadow: '10px 0 30px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Trainer Identity Section */}
        <div style={{ 
          padding: '20px', 
          borderRadius: '20px', 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(6, 182, 212, 0.03))',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '14px',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)'
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.7rem',
              color: 'white',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
            }}>
              {currentUser?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'TR'}
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              background: '#10b981',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '4px solid #050508',
              boxShadow: '0 0 10px #10b981'
            }}></div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.5px' }}>{currentUser?.name || 'Trainer'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Verified Expert</div>
          </div>
        </div>

        {/* Sidebar Navigation Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              width: '100%',
              padding: '14px 18px',
              borderRadius: '12px',
              background: activeTab === 'overview' ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.05))' : 'none',
              border: activeTab === 'overview' ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid transparent',
              color: activeTab === 'overview' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
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
              gap: '14px',
              width: '100%',
              padding: '14px 18px',
              borderRadius: '12px',
              background: activeTab === 'docs' ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.05))' : 'none',
              border: activeTab === 'docs' ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid transparent',
              color: activeTab === 'docs' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
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
              gap: '14px',
              width: '100%',
              padding: '14px 18px',
              borderRadius: '12px',
              background: activeTab === 'availability' ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.05))' : 'none',
              border: activeTab === 'availability' ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid transparent',
              color: activeTab === 'availability' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
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
              gap: '14px',
              width: '100%',
              padding: '14px 18px',
              borderRadius: '12px',
              background: activeTab === 'ledger' ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.05))' : 'none',
              border: activeTab === 'ledger' ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid transparent',
              color: activeTab === 'ledger' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
            }}
          >
            <DollarSign size={18} style={{ color: activeTab === 'ledger' ? 'var(--accent-cyan)' : 'inherit' }} />
            Payout & Escrow
          </button>
        </div>

        {/* Global Exit Portal */}
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            width: '100%',
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease'
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* ==================== RIGHT-SIDE HIGH-FIDELITY ACTIVE PORT ==================== */}
      <div style={{ 
        marginLeft: '280px', 
        flex: 1, 
        padding: '48px',
        maxWidth: '1300px',
        width: 'calc(100% - 280px)'
      }}>
        
        {/* ==================== OVERVIEW TAB (HIGH-GRADE DASHBOARD) ==================== */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Elegant Header Banner */}
            <div className="glass-panel" style={{ 
              padding: '40px', 
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.02))',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)', filter: 'blur(50px)' }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                <Sparkles size={14} /> Enterprise Operations Center
              </div>
              
              <h2 style={{ fontSize: '2.6rem', margin: 0, fontWeight: 800, background: 'linear-gradient(to right, white, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {getGreeting()}
              </h2>
              
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem', fontWeight: 550, display: 'flex', alignItems: 'center', gap: '8px' }}>
                You have <span style={{ color: 'white', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', padding: '2px 10px', borderRadius: '8px', fontWeight: 800 }}>3</span> sessions today.
              </p>

              {/* Dynamic Live Date & Time Indicator */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                marginTop: '8px', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                padding: '10px 20px', 
                borderRadius: '100px', 
                width: 'fit-content',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <Calendar size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span>{formattedDateTime}</span>
              </div>
            </div>

            {/* High-Fidelity Stats Grid (Matching screenshot exactly) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              
              {/* Total Earned */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>
                  <TrendingUp size={16} style={{ color: 'var(--accent-purple)' }} />
                  <span>Total earned</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{analytics ? `${Number(analytics.total_earnings_bdt || 0).toLocaleString()} BDT` : '— BDT'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                  <TrendingUp size={14} /> <span>+12% this month</span>
                </div>
              </div>

              {/* Sessions Done */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>
                  <Video size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Sessions done</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{analytics ? analytics.completed_sessions ?? '—' : '—'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                  <TrendingUp size={14} /> <span>completion rate: {analytics?.completion_rate ?? '—'}%</span>
                </div>
              </div>

              {/* Avg Rating */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>
                  <Award size={16} style={{ color: '#eab308' }} />
                  <span>Avg rating</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{analytics?.avg_rating ?? '—'}</div>
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  from {analytics?.total_sessions ?? '—'} total sessions
                </div>
              </div>

              {/* Upcoming */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>
                  <Clock size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Upcoming</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{todayBookings.length}</div>
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  next 7 days
                </div>
              </div>

            </div>

            {/* Split Columns: Today's sessions & Monthly revenue (BDT) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
              
              {/* Today's Sessions */}
              <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={20} style={{ color: 'var(--accent-purple)' }} />
                  <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Today's sessions</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {todayBookings.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: '16px 0' }}>No sessions scheduled for today.</p>
                  ) : todayBookings.map((booking, idx) => {
                    const initials = (booking.student_name || booking.user_name || 'ST').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                    const colors = ['rgba(34, 197, 94, 0.1)', 'rgba(14, 165, 233, 0.1)', 'rgba(234, 179, 8, 0.1)'];
                    const textColors = ['#22c55e', 'var(--accent-cyan)', '#eab308'];
                    const color = colors[idx % colors.length];
                    const textColor = textColors[idx % textColors.length];
                    const time = booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '—';
                    return (
                      <div key={booking.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: idx < todayBookings.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: color, color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                            {initials}
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1rem', color: 'white', fontWeight: 600 }}>{booking.student_name || booking.user_name || 'Student'}</h4>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {time} • {booking.duration_minutes || 60} min
                            </p>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)', fontWeight: 600 }}>
                          {booking.status || 'Confirmed'}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {/* Monthly Revenue (BDT) */}
              <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TrendingUp size={20} style={{ color: 'var(--accent-cyan)' }} />
                  <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Monthly revenue (BDT)</h3>
                </div>

                {/* Custom Gradient Bar Graph */}
                <div style={{ 
                  height: '140px', 
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  justifyContent: 'space-between', 
                  gap: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}>
                  {[
                    { month: 'Jan', height: '35%', active: false },
                    { month: 'Feb', height: '50%', active: false },
                    { month: 'Mar', height: '42%', active: false },
                    { month: 'Apr', height: '70%', active: false },
                    { month: 'May', height: '58%', active: false },
                    { month: 'Jun', height: '80%', active: false },
                    { month: 'Jul', height: '95%', active: true } // Highlighted active month from screenshot
                  ].map((item, idx) => (
                    <div key={idx} style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '8px',
                      height: '100%',
                      justifyContent: 'flex-end'
                    }}>
                      <div style={{ 
                        width: '100%', 
                        height: item.height, 
                        background: item.active 
                          ? 'linear-gradient(to top, #3b82f6, #60a5fa)' 
                          : 'linear-gradient(to top, rgba(59, 130, 246, 0.15), rgba(96, 165, 250, 0.45))',
                        borderRadius: '4px',
                        boxShadow: item.active ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none'
                      }}></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.month}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', paddingTop: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>This month</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 850, color: 'white', marginTop: '4px' }}>{wallet ? `${Number(wallet.available_balance_bdt || 0).toLocaleString()} BDT` : '— BDT'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Pending withdrawal</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 850, color: '#22c55e', marginTop: '4px' }}>{wallet ? `${Number(wallet.pending_withdrawal_bdt || 0).toLocaleString()} BDT` : '— BDT'}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Assigned Candidate Matching Section with Interactive Grading Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
              
              {/* Upcoming Session Details Card */}
              <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Assigned Candidate Match</h3>
                  <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#10b981', border: '1px solid rgba(34,197,94,0.2)' }}>Live Pulse</span>
                </div>

                <div style={{ 
                  padding: '24px', 
                  borderRadius: '20px', 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.3rem',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
                    }}>
                      BY
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'white' }}>Boni Yeamin</h4>
                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '100px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', fontWeight: 600 }}>100% Strength</span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        BUET CSE Graduate • React/Go Engineer
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOPIC TYPE</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', marginTop: '2px' }}>System Design & Scalability</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SCHEDULE TIME</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', marginTop: '2px' }}>Today at 4:00 PM</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => alert('Launching active video stream...')}
                      className="btn btn-primary animate-pulse" 
                      style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '8px', 
                        padding: '12px',
                        background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                        border: 'none',
                        color: 'white',
                        fontWeight: 700,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(139,92,246,0.4)'
                      }}
                    >
                      <Video size={18} /> Join Live Video Room
                    </button>
                  </div>
                </div>
              </div>

              {/* Enterprise Grading Rubric Input Card */}
              <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: 700 }}>Submit Candidate Evaluation</h3>
                {submittedFeedback ? (
                  <div style={{ 
                    padding: '24px', 
                    borderRadius: '16px', 
                    background: 'rgba(34, 197, 94, 0.05)', 
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    textAlign: 'center',
                    color: '#22c55e'
                  }}>
                    <CheckCircle size={32} style={{ marginBottom: '12px' }} />
                    <div style={{ fontWeight: 700 }}>Feedback Report Locked</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                      Evaluation metrics successfully saved to Boni Yeamin's Candidate Ledger Profile.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Coding & Algorithms Score (1-10)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="10" 
                        value={sessionFeedback.codingScore} 
                        onChange={e => setSessionFeedback({...sessionFeedback, codingScore: e.target.value})}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.02)', color: 'white' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>System Design & Scalability Score (1-10)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="10" 
                        value={sessionFeedback.systemDesignScore} 
                        onChange={e => setSessionFeedback({...sessionFeedback, systemDesignScore: e.target.value})}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.02)', color: 'white' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Technical Notes & Recommendations</label>
                      <textarea 
                        rows="3" 
                        placeholder="Type scaling suggestions or algorithmic recommendations here..."
                        value={sessionFeedback.writtenNotes}
                        onChange={e => setSessionFeedback({...sessionFeedback, writtenNotes: e.target.value})}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.02)', color: 'white', fontFamily: 'inherit', resize: 'none' }}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                      Lock & Publish Evaluation
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==================== GUIDELINES & DOCS TAB ==================== */}
        {activeTab === 'docs' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '40px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '24px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen style={{ color: 'var(--accent-purple)' }} /> Professional Mock Interview Guidelines
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <h4 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '1.15rem' }}>Core Evaluation Process</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                  As an InterviewPro expert, your role is to deliver realistic, high-pressure FAANG-style interview loops. Every candidate session lasts for **60 minutes**, followed by **15 minutes of interactive grading debrief**. Please ensure you evaluate candidates on their ability to handle architectural failures, high-traffic concurrency, database normalization trade-offs, and communication strategies.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.03)', borderLeft: '4px solid var(--accent-purple)', border: '1px solid rgba(139,92,246,0.1)' }}>
                  <h5 style={{ margin: '0 0 8px 0', color: 'white', fontSize: '1rem' }}>Relational vs Non-Relational Normalization</h5>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Assess if the candidate can articulate exact criteria for selecting Postgres/MariaDB over Mongo/DynamoDB under heavy high-concurrency constraints.
                  </p>
                </div>
                <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.03)', borderLeft: '4px solid var(--accent-cyan)', border: '1px solid rgba(6,182,212,0.1)' }}>
                  <h5 style={{ margin: '0 0 8px 0', color: 'white', fontSize: '1rem' }}>Algorithmic Execution Standards</h5>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Candidates must successfully code algorithm loops within 20 minutes, including complete dry-running and step-by-step memory trace tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== AVAILABILITY TAB ==================== */}
        {activeTab === 'availability' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '40px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '16px', color: 'white' }}>Availability Scheduler</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '32px' }}>
              Set your available calendar blocks. Candidates will select slots directly matching these hours.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} style={{ 
                  padding: '20px', 
                  borderRadius: '16px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border-light)',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '16px', color: 'white' }}>{day}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', padding: '6px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', fontWeight: 600 }}>4pm - 6pm</span>
                    <span style={{ fontSize: '0.75rem', padding: '6px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', fontWeight: 600 }}>7pm - 9pm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== PAYOUT & LEDGER TAB ==================== */}
        {activeTab === 'ledger' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '40px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', margin: 0, color: 'white' }}>BKash / SSLCommerz Commission Ledger Splits</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
                  View active escrow holds, platform payouts, and automatic splits.
                </p>
              </div>
              <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(6,182,212,0.3)', padding: '6px 16px', fontSize: '0.85rem' }}>Active Escrow Enabled</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                    <th style={{ textAlign: 'left', padding: '16px' }}>Candidate</th>
                    <th style={{ textAlign: 'left', padding: '16px' }}>Session Type</th>
                    <th style={{ textAlign: 'left', padding: '16px' }}>Gross Booking</th>
                    <th style={{ textAlign: 'left', padding: '16px' }}>Platform Commission (15%)</th>
                    <th style={{ textAlign: 'left', padding: '16px' }}>Your Net Payout (85%)</th>
                    <th style={{ textAlign: 'left', padding: '16px' }}>Escrow Ledger Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions found.</td></tr>
                  ) : transactions.map(tx => {
                    const gross = Number(tx.amount_bdt || 0);
                    const commission = Math.round(gross * 0.15);
                    const net = gross - commission;
                    const isReleased = tx.type === 'credit';
                    return (
                      <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '20px 16px', fontWeight: 600 }}>{tx.description || '—'}</td>
                        <td style={{ padding: '20px 16px' }}>{tx.reference_type || '—'}</td>
                        <td style={{ padding: '20px 16px' }}>{gross.toLocaleString()} BDT</td>
                        <td style={{ padding: '20px 16px', color: 'var(--accent-cyan)' }}>{commission.toLocaleString()} BDT</td>
                        <td style={{ padding: '20px 16px', color: '#22c55e', fontWeight: 700 }}>{net.toLocaleString()} BDT</td>
                        <td style={{ padding: '20px 16px' }}>
                          <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '100px', background: isReleased ? 'rgba(34,197,94,0.15)' : 'rgba(14,165,233,0.15)', color: isReleased ? '#22c55e' : 'var(--accent-cyan)', border: isReleased ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(14,165,233,0.3)', fontWeight: 600 }}>
                            {isReleased ? 'Released to Ledger' : 'Active Escrow Hold'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrainerDashboard;
