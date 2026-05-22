import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, AlertCircle, CheckCircle, Loader, Calendar, Clock, ArrowLeft, Trash2 } from 'lucide-react';
import { createTrainerEvent, addTrainerEventSlots, publishTrainerEvent } from '../lib/api';

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
    target_audience: [],
    meeting_type: 'google_meet',
    difficulty_level: 'beginner',
    max_participants: 10,
    total_sessions: 1,
    duration_minutes: 60,
    price_bdt: 1200,
    cancellation_policy: 'Free cancellation up to 24 hours before session',
    reschedule_policy: 'Reschedule up to 48 hours in advance',
    timezone: 'Asia/Dhaka',
  });

  const [topicInput, setTopicInput] = useState('');
  const [audienceInput, setAudienceInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [scheduleSlots, setScheduleSlots] = useState([]);
  const [slotDate, setSlotDate] = useState('');
  const [slotStartTime, setSlotStartTime] = useState('10:00');
  const [slotEndTime, setSlotEndTime] = useState('10:30');

  const categories = [
    'Software Engineering', 'Data Science', 'Product Management', 'UX/UI Design',
    'DevOps', 'Cloud Architecture', 'Mobile Development', 'Full Stack',
    'Cybersecurity', 'Networking', 'Cloud Security', 'AI/ML', 'Blockchain',
  ];
  const interviewTypes = ['Technical', 'Behavioral', 'System Design', 'Mixed'];
  const meetingTypes = [
    { value: 'google_meet', label: '📹 Google Meet' },
    { value: 'zoom', label: '🎥 Zoom' },
    { value: 'platform_video', label: '🖥️ Platform Video (Built-in)' },
    { value: 'own_system', label: '🔗 Own System (Custom Link)' },
  ];
  const difficultyLevels = [
    { value: 'beginner', label: '🟢 Beginner' },
    { value: 'intermediate', label: '🟡 Intermediate' },
    { value: 'advanced', label: '🔴 Advanced' },
    { value: 'mixed', label: '⚪ Mixed' },
  ];
  const languages = ['Bangla + English', 'English', 'Bangla', 'Hindi + English'];

  const addTag = (field, input, setInput, max = 10) => {
    if (input.trim() && formData[field].length < max) {
      setFormData({ ...formData, [field]: [...formData[field], input.trim()] });
      setInput('');
    }
  };
  const removeTag = (field, index) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const handleAddSlot = () => {
    if (!slotDate) { setMessage({ type: 'error', text: 'Please select a date for the slot' }); return; }
    setScheduleSlots([...scheduleSlots, { date: slotDate, start: slotStartTime, end: slotEndTime }]);
    setSlotDate('');
  };
  const handleRemoveSlot = (i) => setScheduleSlots(scheduleSlots.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || formData.topics_covered.length === 0) {
      setMessage({ type: 'error', text: 'Please fill in Title, Description, and at least one Topic/Tag.' });
      return;
    }
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const payload = { ...formData, total_sessions: scheduleSlots.length || formData.total_sessions };
      const res = await createTrainerEvent(payload);
      if (!res.success) throw new Error(res.message || 'Failed');
      const eventId = res.data?.id;

      // Add schedule slots if any
      if (scheduleSlots.length > 0 && eventId) {
        const slots = scheduleSlots.map(s => ({
          starts_at: `${s.date} ${s.start}:00`,
          ends_at: `${s.date} ${s.end}:00`,
        }));
        await addTrainerEventSlots(eventId, { slots });
      }

      // Auto-publish
      if (eventId) {
        try { await publishTrainerEvent(eventId); } catch (_) {}
      }

      setMessage({ type: 'success', text: '✅ Session created & published! Students can now book it. Redirecting...' });
      setTimeout(() => navigate('/trainer/dashboard'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create event' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9',
    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit',
  };
  const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: '#94a3b8' };
  const sectionTitle = (emoji, text) => (
    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span>{emoji}</span> {text}
    </h2>
  );
  const tagBadge = (text, onRemove, color = '#8b5cf6') => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: `${color}22`, border: `1px solid ${color}44`, borderRadius: '8px', color, fontSize: '0.82rem', fontWeight: 600 }}>
      {text}
      <button type="button" onClick={onRemove} style={{ background: 'none', border: 'none', color, cursor: 'pointer', padding: 0, display: 'flex' }}>
        <X size={13} />
      </button>
    </span>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #0a0e1a)', color: '#f1f5f9', padding: '32px' }}>
      {/* Back button */}
      <button onClick={() => navigate('/trainer/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '24px', padding: 0 }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ✨ Create Interview Session
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>Set up a new mock interview session for students to book</p>
      </div>

      {/* Alert */}
      {message.text && (
        <div style={{ padding: '14px 18px', marginBottom: '24px', borderRadius: '12px', background: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${message.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, color: message.type === 'error' ? '#f87171' : '#22c55e', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
          {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '960px' }}>
        {/* ── Section 1: Basic Info ── */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
          {sectionTitle('📋', 'Basic Information')}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Session Title *</label>
            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Cybersecurity Interview Preparation" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8b5cf6'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                {categories.map(c => <option key={c} value={c} style={{ background: '#1e293b' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Interview Type</label>
              <select value={formData.interview_type} onChange={e => setFormData({ ...formData, interview_type: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                {interviewTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Description *</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the interview session..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#8b5cf6'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>

          <div>
            <label style={labelStyle}>Process Overview</label>
            <textarea value={formData.process_overview} onChange={e => setFormData({ ...formData, process_overview: e.target.value })} placeholder="How will the interview be conducted?" rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#8b5cf6'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>
        </div>

        {/* ── Section 2: Tags, Audience, Questions ── */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
          {sectionTitle('🎯', 'Tags, Audience & Questions')}

          {/* Topics / Skills Tags */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Skills / Tags *</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input type="text" value={topicInput} onChange={e => setTopicInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('topics_covered', topicInput, setTopicInput))} placeholder="e.g., Cybersecurity, SOC, Linux" style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={() => addTag('topics_covered', topicInput, setTopicInput)} style={{ padding: '12px 18px', background: '#8b5cf6', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {formData.topics_covered.map((t, i) => tagBadge(t, () => removeTag('topics_covered', i), '#8b5cf6'))}
            </div>
          </div>

          {/* Target Audience */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Target Audience</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input type="text" value={audienceInput} onChange={e => setAudienceInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('target_audience', audienceInput, setAudienceInput))} placeholder="e.g., Beginners, Junior SOC Analysts" style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={() => addTag('target_audience', audienceInput, setAudienceInput)} style={{ padding: '12px 18px', background: '#06b6d4', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {formData.target_audience.map((t, i) => tagBadge(t, () => removeTag('target_audience', i), '#06b6d4'))}
            </div>
          </div>

          {/* Sample Questions */}
          <div>
            <label style={labelStyle}>Sample Questions (Optional)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input type="text" value={questionInput} onChange={e => setQuestionInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('sample_questions', questionInput, setQuestionInput, 5))} placeholder="e.g., What is a SOC?" style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={() => addTag('sample_questions', questionInput, setQuestionInput, 5)} style={{ padding: '12px 18px', background: '#334155', border: 'none', borderRadius: '10px', color: '#cbd5e1', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {formData.sample_questions.map((q, i) => tagBadge(q, () => removeTag('sample_questions', i), '#94a3b8'))}
            </div>
          </div>
        </div>

        {/* ── Section 3: Session Config ── */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
          {sectionTitle('⚙️', 'Session Configuration')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Duration</label>
              <select value={formData.duration_minutes} onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })} style={{ ...inputStyle, cursor: 'pointer' }}>
                {[30, 45, 60, 90].map(m => <option key={m} value={m}>{m} minutes</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Price (BDT)</label>
              <input type="number" min="200" max="100000" value={formData.price_bdt} onChange={e => setFormData({ ...formData, price_bdt: parseInt(e.target.value) || 200 })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Max Participants</label>
              <input type="number" min="1" max="500" value={formData.max_participants} onChange={e => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 1 })} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Meeting Type</label>
              <select value={formData.meeting_type} onChange={e => setFormData({ ...formData, meeting_type: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                {meetingTypes.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Difficulty Level</label>
              <select value={formData.difficulty_level} onChange={e => setFormData({ ...formData, difficulty_level: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                {difficultyLevels.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Language</label>
              <select value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Section 4: Schedule Slots ── */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
          {sectionTitle('📅', 'Schedule / Time Slots')}
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Add date & time slots when students can book this session.</p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} style={{ ...inputStyle, width: '180px' }} />
            </div>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input type="time" value={slotStartTime} onChange={e => setSlotStartTime(e.target.value)} style={{ ...inputStyle, width: '140px' }} />
            </div>
            <div>
              <label style={labelStyle}>End Time</label>
              <input type="time" value={slotEndTime} onChange={e => setSlotEndTime(e.target.value)} style={{ ...inputStyle, width: '140px' }} />
            </div>
            <button type="button" onClick={handleAddSlot} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', height: '46px' }}>
              <Calendar size={16} /> Add Slot
            </button>
          </div>

          {scheduleSlots.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scheduleSlots.map((slot, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '12px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'white', fontSize: '0.95rem' }}>
                    <span style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)', padding: '2px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#a78bfa', minWidth: '52px', textAlign: 'center' }}>Day {i + 1}</span>
                    <Calendar size={16} style={{ color: '#8b5cf6' }} />
                    <span style={{ fontWeight: 600 }}>{new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span style={{ color: '#94a3b8' }}>|</span>
                    <Clock size={16} style={{ color: '#06b6d4' }} />
                    <span>{slot.start} – {slot.end}</span>
                  </div>
                  <button type="button" onClick={() => handleRemoveSlot(i)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', color: '#f87171', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600 }}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))}
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '4px' }}>{scheduleSlots.length} slot{scheduleSlots.length > 1 ? 's' : ''} scheduled</p>
            </div>
          )}
          {scheduleSlots.length === 0 && (
            <div style={{ padding: '28px', textAlign: 'center', borderRadius: '14px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.08)', color: '#64748b', fontSize: '0.9rem' }}>
              No schedule slots added yet. Add dates and times above.
            </div>
          )}
        </div>

        {/* ── Section 5: Policies ── */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '32px' }}>
          {sectionTitle('📜', 'Policies')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Cancellation Policy</label>
              <textarea value={formData.cancellation_policy} onChange={e => setFormData({ ...formData, cancellation_policy: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Reschedule Policy</label>
              <textarea value={formData.reschedule_policy} onChange={e => setFormData({ ...formData, reschedule_policy: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '16px', background: loading ? '#334155' : 'linear-gradient(135deg, #8b5cf6, #06b6d4)', border: 'none', borderRadius: '14px', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: loading ? 'none' : '0 0 30px rgba(139,92,246,0.3)', transition: 'all 0.2s' }}>
            {loading ? (<><Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> Creating &amp; Publishing...</>) : (<><Plus size={20} /> Create &amp; Publish Session</>)}
          </button>
          <button type="button" onClick={() => navigate('/trainer/dashboard')} style={{ padding: '16px 28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
