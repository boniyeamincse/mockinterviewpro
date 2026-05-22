import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { createTrainerEvent } from '../lib/api';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    category: 'Software Engineering',
    interview_type: 'Technical',
    description: '',
    topics_covered: [],
    process_overview: '',
    language: 'Bangla + English',
    sample_questions: [],
    total_sessions: 1,
    duration_minutes: 60,
    price_bdt: 1200,
    cancellation_policy: 'Free cancellation up to 24 hours before session',
    reschedule_policy: 'Reschedule up to 48 hours in advance',
    timezone: 'Asia/Dhaka',
  });

  const [topicInput, setTopicInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');

  const categories = [
    'Software Engineering',
    'Data Science',
    'Product Management',
    'UX/UI Design',
    'DevOps',
    'Cloud Architecture',
    'Mobile Development',
    'Full Stack',
  ];

  const interviewTypes = ['Technical', 'Behavioral', 'System Design', 'Mixed'];

  const handleAddTopic = () => {
    if (topicInput.trim() && formData.topics_covered.length < 10) {
      setFormData({
        ...formData,
        topics_covered: [...formData.topics_covered, topicInput.trim()],
      });
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (index) => {
    setFormData({
      ...formData,
      topics_covered: formData.topics_covered.filter((_, i) => i !== index),
    });
  };

  const handleAddQuestion = () => {
    if (questionInput.trim() && formData.sample_questions.length < 5) {
      setFormData({
        ...formData,
        sample_questions: [...formData.sample_questions, questionInput.trim()],
      });
      setQuestionInput('');
    }
  };

  const handleRemoveQuestion = (index) => {
    setFormData({
      ...formData,
      sample_questions: formData.sample_questions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || formData.topics_covered.length === 0) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    try {
      setLoading(true);
      const res = await createTrainerEvent(formData);

      if (res.success) {
        setMessage({ type: 'success', text: 'Event created successfully! Redirecting...' });
        setTimeout(() => {
          navigate(`/trainer/events/${res.data.id}/add-slots`);
        }, 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create event' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>✨ Create Interview Event</h1>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Set up a new mock interview session for students</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          style={{
            padding: '16px',
            marginBottom: '24px',
            borderRadius: '8px',
            background: message.type === 'error' ? '#7f1d1d' : '#166534',
            border: `1px solid ${message.type === 'error' ? '#991b1b' : '#22c55e'}`,
            color: message.type === 'error' ? '#fecaca' : '#86efac',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {message.type === 'error' ? <AlertCircle style={{ width: '20px', height: '20px' }} /> : <CheckCircle style={{ width: '20px', height: '20px' }} />}
          {message.text}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} style={{ background: '#1e293b', borderRadius: '12px', padding: '28px', border: '1px solid #334155', maxWidth: '900px' }}>
        {/* Basic Info Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#cbd5e1' }}>📋 Basic Information</h2>

          {/* Event Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Software Engineer Mock Interview - System Design"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Category and Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} style={{ background: '#0f172a', color: '#f1f5f9' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
                Interview Type
              </label>
              <select
                value={formData.interview_type}
                onChange={(e) => setFormData({ ...formData, interview_type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {interviewTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the interview session, what to expect, preparation tips, etc."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Process Overview */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
              Process Overview
            </label>
            <textarea
              value={formData.process_overview}
              onChange={(e) => setFormData({ ...formData, process_overview: e.target.value })}
              placeholder="Explain how the interview will be conducted, timeline, etc."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Topics & Questions Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#cbd5e1' }}>🎯 Topics & Questions</h2>

          {/* Topics Covered */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>Topics Covered *</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                placeholder="e.g., Arrays, Linked Lists, Trees"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                }}
              />
              <button
                type="button"
                onClick={handleAddTopic}
                style={{
                  padding: '12px 16px',
                  background: '#8b5cf6',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {formData.topics_covered.map((topic, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    background: '#8b5cf6',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                >
                  {topic}
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      padding: '0',
                      display: 'flex',
                    }}
                  >
                    <X style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Questions */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
              Sample Questions (Optional)
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuestion())}
                placeholder="e.g., Design a URL shortener service"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                }}
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                style={{
                  padding: '12px 16px',
                  background: '#06b6d4',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {formData.sample_questions.map((q, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    background: '#334155',
                    borderRadius: '6px',
                    color: '#cbd5e1',
                    fontSize: '13px',
                  }}
                >
                  {q}
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      padding: '0',
                      display: 'flex',
                    }}
                  >
                    <X style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session Details Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#cbd5e1' }}>⏱️ Session Details</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
                Total Sessions
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={formData.total_sessions}
                onChange={(e) => setFormData({ ...formData, total_sessions: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
                Duration (minutes)
              </label>
              <select
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {[30, 45, 60, 90].map((min) => (
                  <option key={min} value={min}>
                    {min} minutes
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
                Price (BDT)
              </label>
              <input
                type="number"
                min="200"
                max="100000"
                value={formData.price_bdt}
                onChange={(e) => setFormData({ ...formData, price_bdt: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {/* Policies */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
              Cancellation Policy
            </label>
            <textarea
              value={formData.cancellation_policy}
              onChange={(e) => setFormData({ ...formData, cancellation_policy: e.target.value })}
              rows={2}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
              Reschedule Policy
            </label>
            <textarea
              value={formData.reschedule_policy}
              onChange={(e) => setFormData({ ...formData, reschedule_policy: e.target.value })}
              rows={2}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              background: loading ? '#334155' : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <>
                <Loader style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                Creating...
              </>
            ) : (
              <>
                <Plus style={{ width: '18px', height: '18px' }} />
                Create Event
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/trainer/events')}
            style={{
              padding: '14px 24px',
              background: 'transparent',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
