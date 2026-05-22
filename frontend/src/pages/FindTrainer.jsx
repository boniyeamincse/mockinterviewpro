import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Star, Briefcase, Filter, Loader, X, ChevronRight,
  Award, Users, Zap, BookOpen
} from 'lucide-react';
import trainerImg1 from '../assets/avatar_trainer.png';
import { getTrainers } from '../lib/api';

const CATEGORY_LABELS = {
  software_engineering: 'Software Engineering',
  data_science: 'Data Science',
  product_design: 'Product Design (UI/UX)',
  product_management: 'Product Management',
  finance: 'Finance',
  consulting: 'Consulting',
  marketing: 'Marketing',
  devops: 'DevOps & Cloud',
  healthcare: 'Healthcare',
  law: 'Law',
  academia: 'Academia',
  general: 'General',
};

const CATEGORY_ICONS = {
  software_engineering: '💻',
  data_science: '📊',
  product_design: '🎨',
  product_management: '📋',
  finance: '💰',
  consulting: '🤝',
  marketing: '📣',
  devops: '☁️',
  healthcare: '🏥',
  law: '⚖️',
  academia: '🎓',
  general: '✨',
};

const CATEGORY_COLORS = {
  software_engineering: 'rgba(59,130,246,0.12)',
  data_science: 'rgba(16,185,129,0.12)',
  product_design: 'rgba(236,72,153,0.12)',
  product_management: 'rgba(245,158,11,0.12)',
  finance: 'rgba(6,182,212,0.12)',
  consulting: 'rgba(139,92,246,0.12)',
  marketing: 'rgba(239,68,68,0.12)',
  devops: 'rgba(99,102,241,0.12)',
  healthcare: 'rgba(20,184,166,0.12)',
  law: 'rgba(161,161,170,0.12)',
  academia: 'rgba(251,191,36,0.12)',
  general: 'rgba(139,92,246,0.12)',
};

const categories = ['all', ...Object.keys(CATEGORY_LABELS)];

const FindTrainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(2000);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTrainers = async () => {
      setLoading(true);
      setError(null);
      try {
        const catKey = selectedCategory === 'all' ? '' : selectedCategory;
        const res = await getTrainers({ q: searchTerm, category: catKey, maxPrice: priceRange });
        if (!cancelled) setTrainers(res?.data || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load trainers');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const timer = setTimeout(fetchTrainers, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [searchTerm, selectedCategory, priceRange]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange(2000);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || priceRange < 2000;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.08) 50%, rgba(59,130,246,0.12) 100%)',
        borderBottom: '1px solid var(--border-light)',
        padding: '64px 24px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '-60px', left: '10%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', right: '5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '20px',
              fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 600,
            }}>
              <Zap size={14} /> Top Interview Professionals
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '16px', lineHeight: 1.15 }}>
              Find Your Perfect{' '}
              <span className="text-gradient">Interview Trainer</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '36px' }}>
              Browse top industry professionals who simulate real interview loops and give you direct, actionable feedback.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
              {[
                { icon: <Users size={18} />, label: '500+ Trainers' },
                { icon: <BookOpen size={18} />, label: '12 Categories' },
                { icon: <Award size={18} />, label: '4.8★ Avg Rating' },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--accent-purple)' }}>{icon}</span>
                  <span style={{ fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '28px', alignItems: 'start' }}>

          {/* ── Sidebar Filters ── */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '24px', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '24px', paddingBottom: '16px',
                borderBottom: '1px solid var(--border-light)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Filter size={15} style={{ color: 'var(--accent-purple)' }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>Filters</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444', borderRadius: '6px', padding: '4px 10px',
                      fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <X size={12} /> Clear
                  </button>
                )}
              </div>

              {/* Search */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Search
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={15} style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }} />
                  <input
                    type="text"
                    placeholder="Name, skills, expertise…"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px 10px 36px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-light)',
                      color: 'white', fontSize: '0.875rem',
                      fontFamily: 'inherit', outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                  />
                </div>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Max Price
                  </label>
                  <span style={{
                    background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)',
                    color: 'var(--accent-cyan)', padding: '2px 10px', borderRadius: '100px',
                    fontSize: '0.78rem', fontWeight: 700,
                  }}>
                    ৳{priceRange.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range" min="500" max="2000" step="100" value={priceRange}
                  onChange={e => setPriceRange(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>৳500</span><span>৳2,000</span>
                </div>
              </div>

              {/* Category pills */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Category
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {categories.map(key => {
                    const isActive = selectedCategory === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '9px 12px', borderRadius: '10px',
                          background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent',
                          border: isActive ? '1px solid rgba(139,92,246,0.35)' : '1px solid transparent',
                          color: isActive ? 'var(--accent-purple)' : 'var(--text-secondary)',
                          cursor: 'pointer', fontSize: '0.85rem', fontWeight: isActive ? 600 : 400,
                          textAlign: 'left', width: '100%', transition: 'all 0.15s',
                          fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span style={{ fontSize: '1rem' }}>
                          {key === 'all' ? '🌐' : CATEGORY_ICONS[key]}
                        </span>
                        {key === 'all' ? 'All Categories' : CATEGORY_LABELS[key]}
                        {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Trainers Grid ── */}
          <div>
            {/* Results bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {loading ? 'Loading…' : (
                  <><span style={{ color: 'white', fontWeight: 700 }}>{trainers.length}</span> trainer{trainers.length !== 1 ? 's' : ''} found</>
                )}
              </p>
              {selectedCategory !== 'all' && (
                <span style={{
                  background: CATEGORY_COLORS[selectedCategory] || 'rgba(139,92,246,0.12)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-secondary)', padding: '4px 14px',
                  borderRadius: '100px', fontSize: '0.8rem',
                }}>
                  {CATEGORY_ICONS[selectedCategory]} {CATEGORY_LABELS[selectedCategory]}
                </span>
              )}
            </div>

            {loading ? (
              <div className="glass-panel" style={{ padding: '80px', textAlign: 'center' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: 'rgba(139,92,246,0.12)', margin: '0 auto 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Loader size={28} style={{ color: 'var(--accent-purple)', animation: 'spin 1s linear infinite' }} />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Finding the best trainers for you…</p>
              </div>
            ) : error ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '1rem' }}>{error}</p>
                <button onClick={resetFilters} className="btn btn-secondary">Try Again</button>
              </div>
            ) : trainers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {trainers.map((trainer, i) => (
                  <TrainerCard
                    key={trainer.id}
                    trainer={trainer}
                    hovered={hoveredId === trainer.id}
                    onHover={setHoveredId}
                    delay={i * 60}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '80px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No trainers found</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                  Try adjusting your filters or search term.
                </p>
                <button onClick={resetFilters} className="btn btn-secondary">Reset Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ── Trainer Card Component ───────────────────────────────── */
const TrainerCard = ({ trainer, hovered, onHover, delay }) => {
  const catKey = trainer.categories?.[0];
  const catColor = CATEGORY_COLORS[catKey] || 'rgba(139,92,246,0.08)';

  return (
    <div
      className="glass-panel"
      onMouseEnter={() => onHover(trainer.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        padding: '28px',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: '24px',
        alignItems: 'center',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered
          ? '0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.2)'
          : '0 8px 32px rgba(0,0,0,0.3)',
        borderColor: hovered ? 'rgba(139,92,246,0.25)' : 'var(--glass-border)',
        animation: `cardIn 0.4s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
        cursor: 'default',
      }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: '100px', height: '100px', borderRadius: '18px',
          background: catColor,
          border: '2px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
          boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
          transition: 'box-shadow 0.25s',
        }}>
          <img
            src={trainer.profile_image || trainerImg1}
            alt={trainer.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = trainerImg1; }}
          />
        </div>
        {trainer.avg_rating >= 4.9 && (
          <div style={{
            position: 'absolute', top: '-8px', right: '-8px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white', fontSize: '0.65rem', fontWeight: 800,
            padding: '3px 7px', borderRadius: '100px',
            boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
            letterSpacing: '0.05em',
          }}>TOP</div>
        )}
      </div>

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {trainer.name}
          </h3>
          {catKey && (
            <span style={{
              fontSize: '0.72rem', padding: '3px 10px', borderRadius: '100px',
              background: catColor, border: '1px solid rgba(255,255,255,0.07)',
              color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap',
            }}>
              {CATEGORY_ICONS[catKey]} {CATEGORY_LABELS[catKey]}
            </span>
          )}
        </div>

        {trainer.experience_years > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px' }}>
            <Briefcase size={14} style={{ color: 'var(--accent-purple)' }} />
            {trainer.experience_years}+ years experience
          </div>
        )}

        <p style={{
          color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6,
          marginBottom: '14px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {trainer.bio || 'Expert interviewer ready to help you land your dream role.'}
        </p>

        {Array.isArray(trainer.expertise) && trainer.expertise.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {trainer.expertise.slice(0, 5).map((exp, idx) => (
              <span key={idx} style={{
                fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px',
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.15)',
                color: 'var(--accent-purple)',
              }}>{exp}</span>
            ))}
            {trainer.expertise.length > 5 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '3px 6px' }}>
                +{trainer.expertise.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* CTA Column */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px',
        minWidth: '160px', paddingLeft: '24px',
        borderLeft: '1px solid var(--border-light)',
      }}>
        {/* Rating */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end', marginBottom: '2px' }}>
            <Star size={15} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{trainer.avg_rating ?? '—'}</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            {trainer.review_count ?? 0} reviews
          </span>
        </div>

        {/* Price */}
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Session Price</span>
          <span style={{
            fontSize: '1.4rem', fontWeight: 800,
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {trainer.min_price_bdt > 0 ? `৳${trainer.min_price_bdt.toLocaleString()}` : 'Free'}
          </span>
        </div>

        {/* Book Button */}
        <Link
          to={`/trainers/${trainer.id}`}
          className="btn btn-primary"
          style={{ width: '100%', padding: '10px 16px', fontSize: '0.875rem', textDecoration: 'none', textAlign: 'center' }}
        >
          Book Session
        </Link>

        <Link
          to={`/trainers/${trainer.id}`}
          style={{
            fontSize: '0.78rem', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '4px',
            textDecoration: 'none', transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-purple)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          View Profile <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default FindTrainer;
