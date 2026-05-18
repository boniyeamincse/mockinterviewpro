import React, { useState } from 'react';
import { DollarSign, Shield, Award, Calendar, ChevronRight, CheckCircle2, User, Briefcase, FileText, Sparkles } from 'lucide-react';
import { registerUser, updateTrainerProfile } from '../lib/api';

const BecomeTrainer = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    company: '',
    role: '',
    linkedin: '',
    bio: '',
    category: 'Software Engineering',
    price: '1000',
    expertise: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        user_type: 'trainer',
      });

      const expertiseArray = formData.expertise
        ? formData.expertise.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      try {
        await updateTrainerProfile({
          bio: formData.bio,
          expertise: expertiseArray,
          linkedin_url: formData.linkedin || undefined,
        });
      } catch {
        // profile update failure is non-fatal; account already created
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', fontFamily: 'var(--font-family)' }}>
      {submitted ? (
        /* Success Screen */
        <div className="glass-panel animate-fade-in" style={{ maxWidth: '600px', margin: '40px auto', padding: '60px 40px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '2px solid rgb(16, 185, 129)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <CheckCircle2 size={40} style={{ color: 'rgb(16, 185, 129)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Application Submitted!</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '32px' }}>
            Thank you for applying to become a trainer at InterviewPro, <strong>{formData.name}</strong>. Our developer screening board will review your engineering background and LinkedIn credentials.
          </p>
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', textAlign: 'left', marginBottom: '32px' }}>
            <h4 style={{ color: 'white', marginBottom: '8px', fontSize: '0.95rem' }}>What happens next?</h4>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px' }}>
              <li>We will review your profile details within <strong>24-48 hours</strong>.</li>
              <li>You will receive an onboarding invite link via <strong>{formData.email}</strong>.</li>
              <li>Once verified, your profile will be listed publicly on our <strong>Find a Trainer</strong> catalog!</li>
            </ul>
          </div>
          <button onClick={() => window.location.href = '/'} className="btn btn-primary" style={{ padding: '12px 28px' }}>
            Return to Home
          </button>
        </div>
      ) : (
        /* Info & Multi-step Application Portal */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '48px', alignItems: 'start' }}>
          
          {/* Left Column: Benefits & Trust Markers */}
          <div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'var(--accent-purple)',
              display: 'block',
              marginBottom: '12px'
            }}>
              Join Our Expert Network
            </span>
            <h1 style={{ fontSize: '2.8rem', lineHeight: '1.2', marginBottom: '20px' }}>
              Monetize Your <span className="text-gradient">Tech Expertise</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '40px' }}>
              Help other engineers ace their dream roles at FAANG & top tech hubs. Conduct realistic mock interviews, review profiles, and set your own rates.
            </p>

            {/* Benefits Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)' }}>
                  <DollarSign size={22} />
                </div>
                <div>
                  <h4 style={{ color: 'white', marginBottom: '4px', fontWeight: 600 }}>Keep 85% of Earnings</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    Platform fee is limited to a 15% flat commission. Payments are held in secure escrow and released instantly upon session sign-off.
                  </p>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}>
                  <Shield size={22} />
                </div>
                <div>
                  <h4 style={{ color: 'white', marginBottom: '4px', fontWeight: 600 }}>Secure Escrow Infrastructure</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    Every booked session is pre-authorized. No invoice collections or payment delays. Complete transparency.
                  </p>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Calendar size={22} />
                </div>
                <div>
                  <h4 style={{ color: 'white', marginBottom: '4px', fontWeight: 600 }}>100% Flex Availability</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    Configure your weekly slots. Connect your Google Calendar to auto-sync interview availability easily.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form Widget */}
          <div className="glass-panel" style={{ padding: '40px' }}>
            
            {/* Step Indicators */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step === 1 ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: step === 1 ? 'none' : '1px solid var(--border-light)'
                }}>
                  {step > 1 ? '✓' : '1'}
                </span>
                <div>
                  <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>Step 1</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Personal Details</span>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step === 2 ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: step === 2 ? 'none' : '1px solid var(--border-light)'
                }}>
                  2
                </span>
                <div>
                  <h4 style={{ color: step === 2 ? 'white' : 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Step 2</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expertise & Rates</span>
                </div>
              </div>
            </div>

            {/* FORM BODY */}
            {step === 1 ? (
              <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                      <User size={16} />
                    </span>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Alex Rivera" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 38px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Work Email</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="alex@google.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-light)',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Current Company</label>
                    <input 
                      type="text" 
                      name="company"
                      placeholder="Google" 
                      value={formData.company}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Job Title / Role</label>
                    <input 
                      type="text" 
                      name="role"
                      placeholder="Staff Software Engineer" 
                      value={formData.role}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>LinkedIn Profile URL</label>
                  <input 
                    type="url" 
                    name="linkedin"
                    placeholder="https://linkedin.com/in/username" 
                    value={formData.linkedin}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-light)',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', color: 'white', fontFamily: 'inherit', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Confirm Password</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      placeholder="Repeat password"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required
                      minLength={8}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', color: 'white', fontFamily: 'inherit', outline: 'none' }}
                    />
                  </div>
                </div>

                {error && (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>
                )}

                <button type="submit" className="btn btn-primary" style={{ marginTop: '12px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  Continue to Next Step <ChevronRight size={18} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Domain / Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      color: 'white',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Product Design (UI/UX)">Product Design (UI/UX)</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Expertise / Topics (Comma separated)</label>
                  <input 
                    type="text" 
                    name="expertise"
                    placeholder="System Design, Algorithms, Java, Mock Loops" 
                    value={formData.expertise}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-light)',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Proposed Session Hourly Rate (BDT)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      BDT
                    </span>
                    <input 
                      type="number" 
                      name="price"
                      min="500"
                      max="5000"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 50px 12px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 'bold'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Earnings: you keep {formData.price ? Math.round(formData.price * 0.85) : 0} BDT per slot. Flat 15% platform commission covers video hosting and payment escrows.
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Introduce Yourself (Trainer Bio)</label>
                  <textarea 
                    name="bio"
                    rows="4"
                    placeholder="Briefly state your tech background and how you guide mock interviewers..." 
                    value={formData.bio}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-light)',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none',
                      resize: 'none',
                      lineHeight: '1.5'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }} disabled={loading}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '12px', gap: '8px' }} disabled={loading}>
                    {loading ? 'Submitting...' : <><span>Submit Portal Application</span> <Sparkles size={18} /></>}
                  </button>
                </div>

                {error && (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>
                )}
              </form>
            )}

          </div>

        </div>
      )}
    </div>
  );
};

export default BecomeTrainer;
