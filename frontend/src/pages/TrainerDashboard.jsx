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
  Briefcase,
  Star,
  MessageCircle,
  Edit2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Users
} from 'lucide-react';
import {
  getTrainerProfile,
  getTrainerAnalyticsOverview,
  getTrainerBookingsToday,
  getTrainerWallet,
  getTrainerWalletTransactions,
  getTrainerEvents,
  deleteTrainerEvent,
  publishTrainerEvent,
  unpublishTrainerEvent,
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
  const [trainerEvents, setTrainerEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
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
        fetchTrainerEvents();
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

  const fetchTrainerEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await getTrainerEvents();
      if (res?.data) {
        setTrainerEvents(Array.isArray(res.data) ? res.data : (res.data.data || []));
      }
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setEventsLoading(false);
    }
  };

  const handlePublishEvent = async (eventId) => {
    try {
      await publishTrainerEvent(eventId);
      fetchTrainerEvents();
    } catch (err) {
      alert(err.message || 'Failed to publish');
    }
  };

  const handleUnpublishEvent = async (eventId) => {
    try {
      await unpublishTrainerEvent(eventId);
      fetchTrainerEvents();
    } catch (err) {
      alert(err.message || 'Failed to unpublish');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await deleteTrainerEvent(eventId);
      fetchTrainerEvents();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
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

        {/* Edit Profile Button */}
        <button
          onClick={() => navigate('/trainer/profile/edit')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            color: 'var(--accent-purple)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <Edit2 size={16} /> Edit Profile
        </button>

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

          {/* Sessions Menu Header */}
          <div style={{ marginTop: '12px', marginBottom: '4px', padding: '4px 18px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(139, 92, 246, 0.7)' }}>
            Sessions
          </div>

          <button 
            onClick={() => navigate('/trainer/create-event')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              width: '100%',
              padding: '14px 18px',
              borderRadius: '12px',
              background: 'none',
              border: '1px solid transparent',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
            }}
          >
            <Plus size={18} style={{ color: '#22c55e' }} />
            Create Session
          </button>

          <button 
            onClick={() => { setActiveTab('sessions'); fetchTrainerEvents(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              width: '100%',
              padding: '14px 18px',
              borderRadius: '12px',
              background: activeTab === 'sessions' ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.05))' : 'none',
              border: activeTab === 'sessions' ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid transparent',
              color: activeTab === 'sessions' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
            }}
          >
            <Layers size={18} style={{ color: activeTab === 'sessions' ? 'var(--accent-cyan)' : 'inherit' }} />
            My Sessions
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

          <button 
            onClick={() => setActiveTab('reviews')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              width: '100%',
              padding: '14px 18px',
              borderRadius: '12px',
              background: activeTab === 'reviews' ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.05))' : 'none',
              border: activeTab === 'reviews' ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid transparent',
              color: activeTab === 'reviews' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
            }}
          >
            <Star size={18} style={{ color: activeTab === 'reviews' ? '#eab308' : 'inherit' }} />
            Reviews
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
              <div className="glass-panel" style={{ 
                padding: '28px 24px', 
                borderRadius: '20px', 
                border: '1px solid rgba(16, 185, 129, 0.15)',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04), rgba(5, 5, 8, 0.6))',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.05)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.15)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.05)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  <TrendingUp size={16} />
                  <span>Total earned</span>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>{analytics ? `${Number(analytics.total_earnings_bdt || 0).toLocaleString()} BDT` : '— BDT'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '0.8rem', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '100px', width: 'fit-content' }}>
                  <TrendingUp size={14} /> <span>+12% this month</span>
                </div>
              </div>

              {/* Sessions Done */}
              <div className="glass-panel" style={{ 
                padding: '28px 24px', 
                borderRadius: '20px', 
                border: '1px solid rgba(6, 182, 212, 0.15)',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.04), rgba(5, 5, 8, 0.6))',
                boxShadow: '0 8px 32px rgba(6, 182, 212, 0.05)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(6, 182, 212, 0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.15)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(6, 182, 212, 0.05)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyan)', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  <Video size={16} />
                  <span>Sessions done</span>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>{analytics ? analytics.completed_sessions ?? '—' : '—'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, background: 'rgba(6, 182, 212, 0.1)', padding: '4px 10px', borderRadius: '100px', width: 'fit-content' }}>
                  <Activity size={14} /> <span>completion rate: {analytics?.completion_rate ?? '—'}%</span>
                </div>
              </div>

              {/* Avg Rating */}
              <div className="glass-panel" style={{ 
                padding: '28px 24px', 
                borderRadius: '20px', 
                border: '1px solid rgba(234, 179, 8, 0.15)',
                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.04), rgba(5, 5, 8, 0.6))',
                boxShadow: '0 8px 32px rgba(234, 179, 8, 0.05)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(234, 179, 8, 0.4)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(234, 179, 8, 0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(234, 179, 8, 0.15)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(234, 179, 8, 0.05)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#eab308', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  <Award size={16} />
                  <span>Avg rating</span>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {analytics?.avg_rating ?? '—'}
                  <Star size={24} style={{ fill: '#eab308', color: '#eab308' }} />
                </div>
                <div style={{ marginTop: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  from {analytics?.total_sessions ?? '—'} total sessions
                </div>
              </div>

              {/* Upcoming */}
              <div className="glass-panel" style={{ 
                padding: '28px 24px', 
                borderRadius: '20px', 
                border: '1px solid rgba(139, 92, 246, 0.15)',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.04), rgba(5, 5, 8, 0.6))',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.05)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.15)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.05)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-purple)', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  <Clock size={16} />
                  <span>Upcoming</span>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>{todayBookings.length}</div>
                <div style={{ marginTop: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  scheduled today
                </div>
              </div>

            </div>

            {/* Split Columns: Today's sessions & Monthly revenue (BDT) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
              
              {/* Today's Sessions */}
              <div className="glass-panel" style={{ 
                padding: '36px', 
                borderRadius: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={20} style={{ color: 'var(--accent-purple)' }} />
                  <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700, letterSpacing: '-0.3px' }}>Today's sessions</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {todayBookings.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: '16px 0', fontSize: '0.95rem' }}>No sessions scheduled for today.</p>
                  ) : todayBookings.map((booking, idx) => {
                    const initials = (booking.student_name || booking.user_name || 'ST').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                    const colors = ['rgba(34, 197, 94, 0.08)', 'rgba(14, 165, 233, 0.08)', 'rgba(234, 179, 8, 0.08)'];
                    const textColors = ['#22c55e', 'var(--accent-cyan)', '#eab308'];
                    const color = colors[idx % colors.length];
                    const textColor = textColors[idx % textColors.length];
                    const time = booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '—';
                    return (
                      <div key={booking.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '18px', borderBottom: idx < todayBookings.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: color, border: `1px solid ${textColor}33`, color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>
                            {initials}
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'white', fontWeight: 600 }}>{booking.student_name || booking.user_name || 'Student'}</h4>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {time} • {booking.duration_minutes || 60} min
                            </p>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '100px', background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {booking.status || 'Confirmed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Revenue (BDT) */}
              <div className="glass-panel" style={{ 
                padding: '36px', 
                borderRadius: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TrendingUp size={20} style={{ color: 'var(--accent-cyan)' }} />
                  <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700, letterSpacing: '-0.3px' }}>Monthly revenue (BDT)</h3>
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.month}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', paddingTop: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>This month</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 850, color: 'white', marginTop: '4px', letterSpacing: '-0.3px' }}>{wallet ? `${Number(wallet.available_balance_bdt || 0).toLocaleString()} BDT` : '— BDT'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending withdrawal</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 850, color: '#22c55e', marginTop: '4px', letterSpacing: '-0.3px' }}>{wallet ? `${Number(wallet.pending_withdrawal_bdt || 0).toLocaleString()} BDT` : '— BDT'}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Assigned Candidate Matching Section with Interactive Grading Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
              
              {/* Upcoming Session Details Card */}
              <div className="glass-panel" style={{ 
                padding: '36px', 
                borderRadius: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700, letterSpacing: '-0.3px' }}>Assigned Candidate Match</h3>
                  <span className="badge animate-pulse" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#10b981', border: '1px solid rgba(34,197,94,0.3)', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Live Pulse</span>
                </div>

                <div style={{ 
                  padding: '24px', 
                  borderRadius: '20px', 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.01), rgba(255,255,255,0.03))', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.4rem',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      BY
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'white', fontWeight: 700 }}>Boni Yeamin</h4>
                        <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '100px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', fontWeight: 700, border: '1px solid rgba(139,92,246,0.3)' }}>100% Strength</span>
                      </div>
                      <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        BUET CSE Graduate • React/Go Engineer
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>TOPIC TYPE</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginTop: '4px' }}>System Design & Scalability</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>SCHEDULE TIME</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginTop: '4px' }}>Today at 4:00 PM</div>
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
                        padding: '14px',
                        background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                        border: 'none',
                        color: 'white',
                        fontWeight: 800,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(139,92,246,0.4)',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Video size={18} /> Join Live Video Room
                    </button>
                  </div>
                </div>
              </div>

              {/* Enterprise Grading Rubric Input Card */}
              <div className="glass-panel" style={{ 
                padding: '36px', 
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '24px', fontWeight: 700, letterSpacing: '-0.3px' }}>Submit Candidate Evaluation</h3>
                {submittedFeedback ? (
                  <div style={{ 
                    padding: '32px 24px', 
                    borderRadius: '20px', 
                    background: 'rgba(34, 197, 94, 0.05)', 
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    textAlign: 'center',
                    color: '#22c55e'
                  }}>
                    <CheckCircle size={36} style={{ marginBottom: '16px' }} />
                    <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Feedback Report Locked</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '8px 0 0 0', lineHeight: '1.5' }}>
                      Evaluation metrics successfully saved to Boni Yeamin's Candidate Ledger Profile.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Coding & Algorithms Score (1-10)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="10" 
                        value={sessionFeedback.codingScore} 
                        onChange={e => setSessionFeedback({...sessionFeedback, codingScore: e.target.value})}
                        style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }}
                        onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>System Design & Scalability Score (1-10)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="10" 
                        value={sessionFeedback.systemDesignScore} 
                        onChange={e => setSessionFeedback({...sessionFeedback, systemDesignScore: e.target.value})}
                        style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }}
                        onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Technical Notes & Recommendations</label>
                      <textarea 
                        rows="3" 
                        placeholder="Type scaling suggestions or algorithmic recommendations here..."
                        value={sessionFeedback.writtenNotes}
                        onChange={e => setSessionFeedback({...sessionFeedback, writtenNotes: e.target.value})}
                        style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontFamily: 'inherit', resize: 'none', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem', lineHeight: '1.5' }}
                        onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '14px', fontWeight: 800, borderRadius: '12px', fontSize: '0.95rem' }}>
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
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== REVIEWS TAB ==================== */}
        {activeTab === 'reviews' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '40px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Star style={{ color: '#eab308', fill: '#eab308' }} size={28} /> Student Reviews & Feedback
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
                  View ratings and feedback from completed sessions. Respond to reviews to build your reputation.
                </p>
              </div>
              <span className="badge" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.3)', padding: '6px 16px', fontSize: '0.85rem' }}>0 New Reviews</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
              {/* Overall Rating */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Overall Rating</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#eab308' }}>—</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>from 0 reviews</div>
              </div>

              {/* Average Response Time */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Avg Response Time</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>—</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>hours</div>
              </div>

              {/* Review Response Rate */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Response Rate</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#22c55e' }}>0%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>of reviews answered</div>
              </div>
            </div>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '32px', textAlign: 'center', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Star size={48} style={{ color: 'rgba(234, 179, 8, 0.3)', margin: '0 auto 16px' }} />
                <h4 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 8px 0' }}>No reviews yet</h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                  Your reviews will appear here after you complete your first sessions. Excellent feedback helps attract more students!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SESSIONS TAB ==================== */}
        {activeTab === 'sessions' && (
          <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Layers style={{ color: 'var(--accent-cyan)' }} size={28} /> My Sessions
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
                  Manage all your interview sessions — publish, edit, or remove.
                </p>
              </div>
              <button 
                onClick={() => navigate('/trainer/create-event')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(139,92,246,0.3)', transition: 'all 0.2s ease'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Plus size={18} /> Create New Session
              </button>
            </div>

            {/* Summary badges */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <span style={{ padding: '8px 18px', borderRadius: '100px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa', fontSize: '0.85rem', fontWeight: 600 }}>
                Total: {trainerEvents.length}
              </span>
              <span style={{ padding: '8px 18px', borderRadius: '100px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e', fontSize: '0.85rem', fontWeight: 600 }}>
                Published: {trainerEvents.filter(e => e.status === 'published').length}
              </span>
              <span style={{ padding: '8px 18px', borderRadius: '100px', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', color: '#eab308', fontSize: '0.85rem', fontWeight: 600 }}>
                Draft: {trainerEvents.filter(e => e.status === 'draft').length}
              </span>
            </div>

            {eventsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                <Clock3 size={40} style={{ marginBottom: '16px', opacity: 0.5, animation: 'spin 2s linear infinite' }} />
                <p>Loading sessions...</p>
              </div>
            ) : trainerEvents.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px 32px', textAlign: 'center', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Layers size={56} style={{ color: 'rgba(139,92,246,0.3)', marginBottom: '20px' }} />
                <h4 style={{ color: 'white', fontSize: '1.3rem', margin: '0 0 12px 0' }}>No sessions yet</h4>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 28px 0', fontSize: '0.95rem', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                  Create your first interview session and start helping students prepare for their dream jobs.
                </p>
                <button 
                  onClick={() => navigate('/trainer/create-event')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 32px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                    boxShadow: '0 0 24px rgba(139,92,246,0.4)'
                  }}
                >
                  <Plus size={20} /> Create Your First Session
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {trainerEvents.map(ev => {
                  const isPublished = ev.status === 'published';
                  const isDraft = ev.status === 'draft';
                  const isArchived = ev.status === 'archived';
                  return (
                    <div 
                      key={ev.id}
                      className="glass-panel"
                      style={{ 
                        padding: '28px 32px', borderRadius: '20px',
                        border: isPublished ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(255,255,255,0.06)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
                        {/* Left: Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                            <h4 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontWeight: 700 }}>{ev.title}</h4>
                            <span style={{ 
                              padding: '3px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
                              background: isPublished ? 'rgba(34,197,94,0.15)' : isDraft ? 'rgba(234,179,8,0.15)' : 'rgba(107,114,128,0.15)',
                              color: isPublished ? '#22c55e' : isDraft ? '#eab308' : '#9ca3af',
                              border: `1px solid ${isPublished ? 'rgba(34,197,94,0.3)' : isDraft ? 'rgba(234,179,8,0.3)' : 'rgba(107,114,128,0.3)'}`
                            }}>
                              {ev.status}
                            </span>
                          </div>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 14px 0', lineHeight: '1.5', maxWidth: '600px' }}>
                            {ev.description ? (ev.description.length > 150 ? ev.description.slice(0, 150) + '...' : ev.description) : 'No description'}
                          </p>
                          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {ev.category && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Briefcase size={14} style={{ color: 'var(--accent-purple)' }} />
                                {ev.category}
                              </span>
                            )}
                            {ev.duration_minutes && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={14} style={{ color: 'var(--accent-cyan)' }} />
                                {ev.duration_minutes} min
                              </span>
                            )}
                            {ev.price_bdt != null && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <DollarSign size={14} style={{ color: '#22c55e' }} />
                                {Number(ev.price_bdt).toLocaleString()} BDT
                              </span>
                            )}
                            {ev.total_sessions && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Users size={14} style={{ color: '#eab308' }} />
                                {ev.total_sessions} session{ev.total_sessions > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          {/* Tags */}
                          {ev.topics_covered && (() => {
                            let topics = ev.topics_covered;
                            if (typeof topics === 'string') { try { topics = JSON.parse(topics); } catch { topics = []; } }
                            if (!Array.isArray(topics) || topics.length === 0) return null;
                            return (
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                                {topics.map((t, i) => (
                                  <span key={i} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
                                    {t}
                                  </span>
                                ))}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Right: Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                          {isDraft && (
                            <button
                              onClick={() => handlePublishEvent(ev.id)}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                padding: '10px 16px', borderRadius: '10px', border: 'none',
                                background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                              }}
                              onMouseOver={e => e.currentTarget.style.background = 'rgba(34,197,94,0.25)'}
                              onMouseOut={e => e.currentTarget.style.background = 'rgba(34,197,94,0.15)'}
                            >
                              <Eye size={15} /> Publish
                            </button>
                          )}
                          {isPublished && (
                            <button
                              onClick={() => handleUnpublishEvent(ev.id)}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                padding: '10px 16px', borderRadius: '10px', border: 'none',
                                background: 'rgba(234,179,8,0.12)', color: '#eab308',
                                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                              }}
                              onMouseOver={e => e.currentTarget.style.background = 'rgba(234,179,8,0.22)'}
                              onMouseOut={e => e.currentTarget.style.background = 'rgba(234,179,8,0.12)'}
                            >
                              <EyeOff size={15} /> Unpublish
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteEvent(ev.id)}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                              padding: '10px 16px', borderRadius: '10px', border: 'none',
                              background: 'rgba(239,68,68,0.1)', color: '#f87171',
                              fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                          >
                            <Trash2 size={15} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TrainerDashboard;
