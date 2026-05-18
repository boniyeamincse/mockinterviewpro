import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Save,
  AlertCircle,
  CheckCircle2,
  Lock,
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  Briefcase,
  LinkIcon,
  Globe,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft
} from 'lucide-react';
import { getTrainerProfile, updateTrainerProfile, changeTrainerPassword } from '../lib/api';

const TrainerProfileEdit = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('basic');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    profile_image: '',
    academic_background: '',
    certifications: [],
    expertise: [],
    experience_years: '',
    linkedin_url: '',
    website_url: '',
  });

  const [certificationInput, setCertificationInput] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getTrainerProfile();
        if (response?.data) {
          setFormData({
            name: response.data.name || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            bio: response.data.bio || '',
            profile_image: response.data.profile_image || '',
            academic_background: response.data.academic_background || '',
            certifications: response.data.certifications || [],
            expertise: response.data.expertise || [],
            experience_years: response.data.experience_years || '',
            linkedin_url: response.data.linkedin_url || '',
            website_url: response.data.website_url || '',
          });
          if (response.data.profile_image) {
            setImagePreview(`/storage/${response.data.profile_image}`);
          }
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load profile' });
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCertification = () => {
    if (certificationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }));
      setCertificationInput('');
    }
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addExpertise = () => {
    if (expertiseInput.trim()) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, expertiseInput.trim()]
      }));
      setExpertiseInput('');
    }
  };

  const removeExpertise = (index) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('academic_background', formData.academic_background);
      formDataToSend.append('experience_years', formData.experience_years);
      formDataToSend.append('linkedin_url', formData.linkedin_url);
      formDataToSend.append('website_url', formData.website_url);

      // Add expertise as JSON array
      formDataToSend.append('expertise', JSON.stringify(formData.expertise));
      // Add certifications as JSON array
      formDataToSend.append('certifications', JSON.stringify(formData.certifications));

      // Add image if changed
      if (profileImage) {
        formDataToSend.append('profile_image', profileImage);
      }

      const response = await updateTrainerProfile(formDataToSend);
      if (response?.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setProfileImage(null);
      } else {
        setMessage({ type: 'error', text: response?.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.password !== passwordData.password_confirmation) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await changeTrainerPassword({
        current_password: passwordData.current_password,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation,
      });

      if (response?.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({
          current_password: '',
          password: '',
          password_confirmation: '',
        });
      } else {
        setMessage({ type: 'error', text: response?.message || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top left, #0d091a, #050508)',
      color: 'white',
      padding: '40px 20px',
      fontFamily: 'var(--font-family)'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/trainer/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>Edit Profile</h1>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '12px',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: message.type === 'success' ? '#22c55e' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          overflowX: 'auto'
        }}>
          {['basic', 'academic', 'professional', 'security'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                background: activeTab === tab ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                border: activeTab === tab ? '1px solid rgba(139, 92, 246, 0.4)' : 'none',
                borderBottom: activeTab === tab ? '2px solid var(--accent-purple)' : 'none',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          padding: '40px',
          backdropFilter: 'blur(10px)'
        }}>

          {/* BASIC TAB */}
          {activeTab === 'basic' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Profile Picture */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                  Profile Picture
                </label>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '16px',
                    background: imagePreview
                      ? `url(${imagePreview}) center/cover`
                      : 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: imagePreview ? 'transparent' : 'white',
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}>
                    {!imagePreview && formData.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 20px',
                      borderRadius: '10px',
                      background: 'rgba(139, 92, 246, 0.15)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      color: 'var(--accent-purple)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      width: 'fit-content'
                    }}>
                      <Camera size={18} /> Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                      JPG, PNG, GIF or WebP. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  <User size={16} style={{ display: 'inline', marginRight: '6px' }} /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  <Mail size={16} style={{ display: 'inline', marginRight: '6px' }} /> Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    cursor: 'not-allowed'
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
                  Cannot change email address. Contact support if needed.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  <Phone size={16} style={{ display: 'inline', marginRight: '6px' }} /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Bio */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Bio / About You
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Brief description about yourself and your expertise..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                  border: 'none',
                  color: 'white',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <Save size={18} /> {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* ACADEMIC TAB */}
          {activeTab === 'academic' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Academic Background */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  <BookOpen size={16} style={{ display: 'inline', marginRight: '6px' }} /> Academic Background
                </label>
                <textarea
                  name="academic_background"
                  value={formData.academic_background}
                  onChange={handleInputChange}
                  placeholder="e.g., B.S. in Computer Science from MIT, 2020..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Certifications */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  <Award size={16} style={{ display: 'inline', marginRight: '6px' }} /> Certifications
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={certificationInput}
                    onChange={(e) => setCertificationInput(e.target.value)}
                    placeholder="Add a certification..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCertification();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      color: 'var(--accent-purple)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {formData.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'rgba(6, 182, 212, 0.1)',
                        border: '1px solid rgba(6, 182, 212, 0.2)',
                        color: 'var(--accent-cyan)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {cert}
                      <button
                        type="button"
                        onClick={() => removeCertification(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'inherit',
                          cursor: 'pointer',
                          padding: '0'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                  border: 'none',
                  color: 'white',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <Save size={18} /> {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* PROFESSIONAL TAB */}
          {activeTab === 'professional' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Expertise */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  <Briefcase size={16} style={{ display: 'inline', marginRight: '6px' }} /> Areas of Expertise
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    placeholder="e.g., System Design, Algorithms..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addExpertise();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={addExpertise}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      color: 'var(--accent-purple)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {formData.expertise.map((exp, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        color: 'var(--accent-purple)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {exp}
                      <button
                        type="button"
                        onClick={() => removeExpertise(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'inherit',
                          cursor: 'pointer',
                          padding: '0'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Years */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  min="0"
                  max="60"
                  placeholder="e.g., 5"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* LinkedIn URL */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  <LinkIcon size={16} style={{ display: 'inline', marginRight: '6px' }} /> LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Website URL */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  <Globe size={16} style={{ display: 'inline', marginRight: '6px' }} /> Personal Website
                </label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                  border: 'none',
                  color: 'white',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <Save size={18} /> {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={20} /> Change Password
              </h3>

              {/* Current Password */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Current Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  New Password (min. 8 characters)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.password_confirmation}
                    onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Change Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <Lock size={18} /> {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default TrainerProfileEdit;
