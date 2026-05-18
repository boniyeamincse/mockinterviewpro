import React, { useState } from 'react';
import { Search, Star, Briefcase, DollarSign, Shield, Filter, MapPin } from 'lucide-react';
import trainerImg1 from '../assets/avatar_trainer.png';

// Mock Trainers Data
const initialTrainers = [
  {
    id: 1,
    name: 'Michael Chang',
    role: 'Staff Software Engineer',
    company: 'Google',
    location: 'Silicon Valley, US',
    rating: 4.9,
    reviews: 142,
    price: '1,200 BDT',
    category: 'Software Engineering',
    expertise: ['System Design', 'Algorithms', 'Java/Go'],
    bio: 'Ex-Google & Facebook. 10+ years interviewing candidates. Specializes in scalable architecture and high-performance algorithms.',
    avatar: trainerImg1
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    role: 'HR Director',
    company: 'Netflix',
    location: 'Los Angeles, US',
    rating: 4.8,
    reviews: 98,
    price: '900 BDT',
    category: 'Product Management',
    expertise: ['Behavioral Rounds', 'Negotiation', 'Resume Review'],
    bio: 'Helped 500+ candidates land offers at FAANG. Passionate about behavioral frameworks and mock interview feedback.',
    avatar: trainerImg1 // Reuse avatar
  },
  {
    id: 3,
    name: 'Arif Rahman',
    role: 'Lead UI/UX Designer',
    company: 'Pathao',
    location: 'Dhaka, BD',
    rating: 4.9,
    reviews: 76,
    price: '800 BDT',
    category: 'Product Design (UI/UX)',
    expertise: ['Portfolio Review', 'Whiteboard Challenge', 'Interaction Design'],
    bio: 'Designing consumer apps for 8+ years. Helping local talent break into international design teams through robust product metrics.',
    avatar: trainerImg1
  },
  {
    id: 4,
    name: 'Tanvir Islam',
    role: 'Principal Cloud Architect',
    company: 'Amazon Web Services',
    location: 'Singapore',
    rating: 5.0,
    reviews: 54,
    price: '1,500 BDT',
    category: 'DevOps & Cloud',
    expertise: ['AWS', 'Kubernetes', 'CI/CD Pipelines'],
    bio: 'Specialist in cloud migrations, high-availability deployments, and infrastructure as code. Let’s mock your next DevOps architecture round.',
    avatar: trainerImg1
  }
];

const categories = [
  'All Categories',
  'Software Engineering',
  'Product Management',
  'Product Design (UI/UX)',
  'DevOps & Cloud'
];

const FindTrainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState(2000);

  const filteredTrainers = initialTrainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trainer.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trainer.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || trainer.category === selectedCategory;
    
    const numericPrice = parseInt(trainer.price.replace(/[^\d]/g, ''));
    const matchesPrice = numericPrice <= priceRange;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Find Your Perfect <span className="text-gradient">Interview Trainer</span></h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Browse top industry professionals who will simulate real interview loops and give you direct feedback.
        </p>
      </div>

      {/* Main Grid: Filters on Left, Trainers on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '32px' }}>
        
        {/* Filters Sidebar */}
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <Filter size={18} style={{ color: 'var(--accent-purple)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Filter Trainers</h3>
          </div>

          {/* Search Box */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Search</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Google, systems, name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-light)',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Category</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                color: 'white',
                outline: 'none',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Max Session Price</label>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{priceRange} BDT</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="2000" 
              step="100" 
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Trainers List Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredTrainers.length > 0 ? (
            filteredTrainers.map(trainer => (
              <div key={trainer.id} className="glass-panel animate-fade-in" style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '24px', alignItems: 'center' }}>
                
                {/* Trainer Avatar */}
                <div style={{ position: 'relative' }}>
                  <img src={trainer.avatar} alt={trainer.name} style={{ width: '110px', height: '110px', borderRadius: '16px', border: '1px solid var(--border-light)', objectFit: 'cover' }} />
                  {trainer.rating === 5.0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '100px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                    }}>
                      TOP
                    </span>
                  )}
                </div>

                {/* Trainer Profile Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{trainer.name}</h3>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '3px 10px',
                      borderRadius: '100px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-secondary)'
                    }}>
                      {trainer.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '8px 0 12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Briefcase size={16} style={{ color: 'var(--accent-purple)' }} /> {trainer.role} at <strong>{trainer.company}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={16} style={{ color: 'var(--accent-cyan)' }} /> {trainer.location}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>
                    {trainer.bio}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {trainer.expertise.map((exp, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(139, 92, 246, 0.08)',
                        border: '1px solid rgba(139, 92, 246, 0.15)',
                        color: 'var(--accent-purple)'
                      }}>
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trainer Price and Action */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minWidth: '150px', borderLeft: '1px solid var(--border-light)', paddingLeft: '24px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', color: '#f59e0b', fontWeight: 600, fontSize: '0.95rem' }}>
                      <Star size={16} fill="#f59e0b" /> {trainer.rating} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({trainer.reviews} reviews)</span>
                    </div>
                  </div>

                  <div style={{ margin: '24px 0 16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Session Price</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{trainer.price}</span>
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
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('All Categories'); setPriceRange(2000); }} 
                className="btn btn-secondary" 
                style={{ marginTop: '16px' }}
              >
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
