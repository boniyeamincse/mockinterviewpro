import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Video, Calendar, CreditCard, Star, ArrowRight, Award, Zap } from 'lucide-react';
import heroImg from '../assets/hero_interview.png';
import studentImg from '../assets/avatar_student.png';
import trainerImg from '../assets/avatar_trainer.png';

const Landing = () => {
  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section className="container" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '48px', 
        alignItems: 'center', 
        minHeight: '80vh',
        paddingTop: '40px',
        paddingBottom: '80px'
      }}>
        <div className="animate-fade-in">
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 16px', 
            borderRadius: '100px', 
            background: 'rgba(139, 92, 246, 0.1)', 
            border: '1px solid rgba(139, 92, 246, 0.2)',
            color: 'var(--accent-purple)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            <Zap size={14} /> Redefining Mock Interviews
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '24px', lineHeight: 1.1 }}>
            Ace Your Next Tech Interview with <span className="text-gradient">InterviewPro</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '500px' }}>
            Connect with industry-expert trainers, schedule live 1-on-1 video sessions, and get actionable feedback to launch your career.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/register" className="btn btn-primary" style={{ gap: '8px' }}>
              Book a Session <ArrowRight size={18} />
            </Link>
            <Link to="/trainers" className="btn btn-secondary">
              Explore Trainers
            </Link>
          </div>
        </div>
        
        <div className="animate-fade-in delay-100" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            {/* Glowing background */}
            <div style={{ 
              position: 'absolute', 
              top: '10%', 
              left: '10%', 
              right: '10%', 
              bottom: '10%', 
              background: 'radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)', 
              opacity: 0.3,
              filter: 'blur(40px)',
              zIndex: -1
            }}></div>
            <img 
              src={heroImg} 
              alt="Mock Interview Illustration" 
              style={{ 
                width: '100%', 
                borderRadius: '24px', 
                border: '1px solid var(--border-light)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }} 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Supercharged Platform Features</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Everything you need for realistic, high-impact interview preparation in one modern dashboard.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '20px' }}><Video size={32} /></div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>1-on-1 Video Sessions</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              High-definition, low-latency, browser-based video workspace. Dynamic workspace built for coding and verbal rounds.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ color: 'var(--accent-purple)', marginBottom: '20px' }}><Calendar size={32} /></div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Smart Scheduling</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Pick a slot that matches your time zone. Syncs seamlessly with Google Calendar and provides instant reminders.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ color: 'var(--accent-blue)', marginBottom: '20px' }}><CreditCard size={32} /></div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Secure Escrow Payments</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Your money is held safely in escrow and only distributed when the session is successfully completed.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="container" style={{ padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Tailored Experiences</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Whether you want to learn or earn, InterviewPro provides a specialized environment.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '32px' 
        }}>
          {/* Student Card */}
          <div className="glass-panel" style={{ padding: '40px', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <img src={studentImg} alt="Student" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid var(--accent-cyan)' }} />
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>For Candidates</span>
              <h3 style={{ fontSize: '1.5rem', margin: '8px 0 12px' }}>Accelerate Learning</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
                Browse verified trainers, request custom coding/system design mocks, and review expert reports to level up.
              </p>
              <Link to="/register" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Join as Candidate <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Trainer Card */}
          <div className="glass-panel" style={{ padding: '40px', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <img src={trainerImg} alt="Trainer" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid var(--accent-purple)' }} />
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>For Experts</span>
              <h3 style={{ fontSize: '1.5rem', margin: '8px 0 12px' }}>Monetize Expertise</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
                Build your schedule, set your hourly rate, keep 85% of payouts, and grow your reputation globally.
              </p>
              <Link to="/register?role=trainer" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Become a Trainer <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
