import React, { useState, useEffect } from 'react';
import { Video, Calendar, Shield, DollarSign, Clock, CheckCircle, User, Mail, Award, BookOpen, LogOut, Camera, GraduationCap, Target, Heart, Edit3, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import studentImg from '../assets/avatar_student.png';

const Dashboard = () => {
  // Tabs: 'workspace' or 'profile'
  const [activeTab, setActiveTab] = useState('workspace');
  const [isEditing, setIsEditing] = useState(false);

  // Dynamic Profile State
  const [profile, setProfile] = useState({
    name: 'Boni Yeamin',
    email: 'boniyeamin.cse1@gmail.com',
    role: 'Candidate',
    joinedDate: 'May 2026',
    photo: studentImg,
    gender: '',
    birthday: '',
    academicInst: '',
    academicDegree: '',
    academicGradYear: '',
    interests: '',
    goals: '',
    careerGoal: 'Full Stack Engineer'
  });

  // Calculate Profile Completeness
  const calculateCompleteness = () => {
    let score = 0;
    if (profile.name) score += 10;
    if (profile.email) score += 10;
    if (profile.photo && profile.photo !== studentImg) score += 10; // Extra if uploaded custom photo
    else if (profile.photo) score += 10; // Base photo score
    if (profile.gender) score += 10;
    if (profile.birthday) score += 10;
    if (profile.academicInst || profile.academicDegree) score += 20;
    if (profile.interests) score += 15;
    if (profile.goals || profile.careerGoal) score += 15;
    return score;
  };

  const completeness = calculateCompleteness();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setProfile(prev => ({
        ...prev,
        ...parsed
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => {
      const updated = { ...prev, [name]: value };
      // Save basic info to localStorage to persist across navigation
      localStorage.setItem('user', JSON.stringify({
        name: updated.name,
        email: updated.email,
        role: updated.role,
        joinedDate: updated.joinedDate,
        gender: updated.gender,
        birthday: updated.birthday,
        academicInst: updated.academicInst,
        academicDegree: updated.academicDegree,
        academicGradYear: updated.academicGradYear,
        interests: updated.interests,
        goals: updated.goals,
        careerGoal: updated.careerGoal
      }));
      return updated;
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, photo: url }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', fontFamily: 'var(--font-family)' }}>
      
      {/* Workspace Banner */}
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
          <img src={profile.photo} alt="User Avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', objectFit: 'cover' }} />
          <div>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '4px', fontWeight: 700 }}>Welcome back, {profile.name}!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{profile.role} Workspace — Prepare with secure escrow mock sessions.</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', zIndex: 1 }}>
          <button 
            onClick={() => setActiveTab(activeTab === 'workspace' ? 'profile' : 'workspace')} 
            className="btn btn-secondary" 
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.85rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              border: activeTab === 'profile' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-light)',
              color: activeTab === 'profile' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <User size={16} style={{ color: activeTab === 'profile' ? 'var(--accent-cyan)' : 'inherit' }} /> 
            {activeTab === 'profile' ? 'Back to Workspace' : 'Manage Profile'}
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

      {/* TABS VIEW PANEL */}
      {activeTab === 'workspace' ? (
        /* ==================== WORKSPACE DASHBOARD TAB ==================== */
        <div className="animate-fade-in">
          {/* Stats Loops Grid */}
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

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            {/* Session list */}
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
              </div>
            </div>

            {/* Completion indicator widget */}
            <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Profile Strength</h3>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Completeness</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{completeness}%</span>
                </div>
                {/* Progress bar wrapper */}
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${completeness}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
                    borderRadius: '10px',
                    transition: 'width 0.4s ease-out'
                  }} />
                </div>
              </div>

              {completeness < 100 ? (
                <div style={{ background: 'rgba(139,92,246,0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.1)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Complete your profile!</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Fill out your gender, birthday, academic records, and technical interests to unlock dynamic matcher matches.
                  </p>
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 0, marginTop: '10px' }}
                  >
                    Edit Profile Details &rarr;
                  </button>
                </div>
              ) : (
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 500 }}>Excellent! Your profile is fully complete.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ==================== COMPREHENSIVE PROFILE TAB ==================== */
        <div className="glass-panel animate-fade-in" style={{ padding: '40px' }}>
          
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>My Professional Profile</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>Keep your academic status and coding target sync\'d.</p>
            </div>
            
            {/* Completion indicator */}
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ minWidth: '150px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Completeness</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{completeness}%</span>
                </div>
                <div style={{ width: '150px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${completeness}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))', transition: 'width 0.3s' }} />
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className="btn btn-primary" 
                style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isEditing ? <Save size={16} onClick={handleSave} /> : <Edit3 size={16} />}
                {isEditing ? 'Save Changes' : 'Edit Details'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
            
            {/* Left Box: Avatar upload & quick badges */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              
              {/* Photo preview upload container */}
              <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                <img src={profile.photo} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover', border: '2px solid var(--border-light)' }} />
                {isEditing && (
                  <label style={{
                    position: 'absolute',
                    bottom: '-8px',
                    right: '-8px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    color: 'black'
                  }}>
                    <Camera size={16} />
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </label>
                )}
              </div>

              {/* Status info */}
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white' }}>{profile.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>{profile.role}</span>
                <span style={{ 
                  display: 'inline-block',
                  marginTop: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: completeness >= 75 ? '#10b981' : '#f59e0b',
                  background: completeness >= 75 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  padding: '4px 14px',
                  borderRadius: '100px',
                  border: completeness >= 75 ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
                }}>
                  {completeness >= 75 ? 'Verified Profile Strong' : 'Profile Needs Completion'}
                </span>
              </div>
            </div>

            {/* Right Box: Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Personal Details */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} style={{ color: 'var(--accent-cyan)' }} /> Personal Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={profile.name} 
                      onChange={handleChange} 
                      disabled={!isEditing} 
                      required
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isEditing ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={profile.email} 
                      onChange={handleChange} 
                      disabled={!isEditing} 
                      required
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isEditing ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gender</label>
                    <select 
                      name="gender" 
                      value={profile.gender} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isEditing ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none',
                        cursor: isEditing ? 'pointer' : 'default'
                      }}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Birthday</label>
                    <input 
                      type="date" 
                      name="birthday" 
                      value={profile.birthday} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isEditing ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Academic Details */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={18} style={{ color: 'var(--accent-purple)' }} /> Academic Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>University / College / Institution</label>
                    <input 
                      type="text" 
                      name="academicInst" 
                      placeholder="e.g. Bangladesh University of Engineering and Technology" 
                      value={profile.academicInst} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isEditing ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Graduation Year</label>
                    <input 
                      type="number" 
                      name="academicGradYear" 
                      placeholder="2026" 
                      value={profile.academicGradYear} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isEditing ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Degree / Program</label>
                  <input 
                    type="text" 
                    name="academicDegree" 
                    placeholder="e.g. B.Sc. in Computer Science & Engineering" 
                    value={profile.academicDegree} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isEditing ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-light)',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Targets, Interests & Goals */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} style={{ color: 'var(--accent-cyan)' }} /> Interests & Career Goals
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tech Interests (e.g. Frontend, System Design, ML)</label>
                    <input 
                      type="text" 
                      name="interests" 
                      placeholder="e.g. React, Node.js, Systems Architecture, AWS" 
                      value={profile.interests} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isEditing ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Career Goal / Focus</label>
                    <input 
                      type="text" 
                      name="careerGoal" 
                      placeholder="e.g. Software Engineer at Google" 
                      value={profile.careerGoal} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isEditing ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Preparation Goals</label>
                    <textarea 
                      name="goals" 
                      rows="3" 
                      placeholder="State what you want to achieve with mock sessions..." 
                      value={profile.goals} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isEditing ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none',
                        resize: 'none',
                        lineHeight: '1.5'
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>

          </form>

        </div>
      )}

    </div>
  );
};

export default Dashboard;
