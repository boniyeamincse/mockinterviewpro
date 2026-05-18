import React, { useState, useEffect } from 'react';
import { Search, Star, Briefcase, Filter, Loader } from 'lucide-react';
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

const categories = ['All Categories', ...Object.values(CATEGORY_LABELS)];
const categoryKeys = Object.keys(CATEGORY_LABELS);

const FindTrainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState(2000);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTrainers = async () => {
      setLoading(true);
      setError(null);
      try {
        const catKey = categoryKeys.find(k => CATEGORY_LABELS[k] === selectedCategory) || '';
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

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Find Your Perfect <span className="text-gradient">Interview Trainer</span></h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Browse top industry professionals who will simulate real interview loops and give you direct feedback.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '32px' }}>
        {/* Filters Sidebar */}
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <Filter size={18} style={{ color: 'var(--accent-purple)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Filter Trainers</h3>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Search</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Name, skills, expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', color: 'white', outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'white', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Max Session Price</label>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{priceRange} BDT</span>
            </div>
            <input type="range" min="500" max="2000" step="100" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
          </div>
        </div>

        {/* Trainers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {loading ? (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
              <Loader size={32} style={{ color: 'var(--accent-purple)', margin: '0 auto 16px', display: 'block' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Loading trainers...</p>
            </div>
          ) : error ? (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
              <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
              <button onClick={() => setSearchTerm('')} className="btn btn-secondary">Retry</button>
            </div>
          ) : trainers.length > 0 ? (
            trainers.map(trainer => (
              <div key={trainer.id} className="glass-panel animate-fade-in" style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '24px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={trainer.profile_image || trainerImg1}
                    alt={trainer.name}
                    style={{ width: '110px', height: '110px', borderRadius: '16px', border: '1px solid var(--border-light)', objectFit: 'cover' }}
                    onError={e => { e.target.src = trainerImg1; }}
                  />
                  {trainer.avg_rating >= 4.9 && (
                    <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '100px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>TOP</span>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{trainer.name}</h3>
                    {trainer.categories?.slice(0, 1).map((cat, idx) => (
                      <span key={idx} style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                        {CATEGORY_LABELS[cat] || cat}
                      </span>
                    ))}
                  </div>

                  {trainer.experience_years > 0 && (
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '8px 0 12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Briefcase size={16} style={{ color: 'var(--accent-purple)' }} /> {trainer.experience_years}+ years experience
                      </span>
                    </div>
                  )}

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>
                    {trainer.bio || 'Expert interviewer ready to help you land your dream role.'}
                  </p>

                  {Array.isArray(trainer.expertise) && trainer.expertise.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {trainer.expertise.slice(0, 5).map((exp, idx) => (
                        <span key={idx} style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>{exp}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minWidth: '150px', borderLeft: '1px solid var(--border-light)', paddingLeft: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', color: '#f59e0b', fontWeight: 600, fontSize: '0.95rem' }}>
                    <Star size={16} fill="#f59e0b" /> {trainer.avg_rating || '—'} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({trainer.review_count} reviews)</span>
                  </div>

                  <div style={{ margin: '24px 0 16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Session Price</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {trainer.min_price_bdt > 0 ? `${trainer.min_price_bdt.toLocaleString()} BDT` : 'Contact'}
                    </span>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                    Book Session
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>No trainers found matching your filter criteria.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('All Categories'); setPriceRange(2000); }} className="btn btn-secondary" style={{ marginTop: '16px' }}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindTrainer;
