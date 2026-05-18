import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, Users, Star, CheckCircle2, AlertCircle, Loader, BookOpen } from 'lucide-react';
import { request } from '../lib/api';

export default function MultiDayEventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await request('GET', `/multi-day-events/${eventId}`);
      setEvent(response.event);
      setStats(response.stats);
      setSchedule(response.schedule_preview);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load event details' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookEvent = async () => {
    try {
      setLoading(true);
      const response = await request('POST', '/multi-day-bookings', {
        event_id: eventId,
      });

      setMessage({ type: 'success', text: 'Event booked successfully!' });
      setTimeout(() => navigate(`/user/multi-day-bookings/${response.booking.id}`), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Booking failed' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <Loader style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', color: '#8b5cf6' }} />
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', padding: '40px 24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '8px 12px',
            background: 'transparent',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#cbd5e1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            marginBottom: '24px',
          }}
        >
          <ChevronLeft style={{ width: '16px', height: '16px' }} />
          Back
        </button>
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          <AlertCircle style={{ width: '48px', height: '48px', margin: '0 auto 16px' }} />
          <p>Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', paddingBottom: '40px' }}>
      {/* Back Button */}
      <div style={{ padding: '24px 24px 0', maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '8px 12px',
            background: 'transparent',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#cbd5e1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            marginBottom: '24px',
          }}
        >
          <ChevronLeft style={{ width: '16px', height: '16px' }} />
          Back
        </button>
      </div>

      {/* Messages */}
      {message.text && (
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto 24px 24px',
            padding: '12px 16px',
            background: message.type === 'error' ? '#7f1d1d' : '#064e3b',
            border: `1px solid ${message.type === 'error' ? '#dc2626' : '#10b981'}`,
            borderRadius: '8px',
            color: message.type === 'error' ? '#fca5a5' : '#6ee7b7',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {message.type === 'error' ? (
            <AlertCircle style={{ width: '18px', height: '18px' }} />
          ) : (
            <CheckCircle2 style={{ width: '18px', height: '18px' }} />
          )}
          {message.text}
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
        {/* Main Content */}
        <div>
          {/* Event Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>{event.category}</div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>{event.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1' }}>
                  <span>By <strong>{event.tutor.name}</strong></span>
                  {event.tutor_rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                      <Star style={{ width: '16px', height: '16px', fill: '#f59e0b' }} />
                      <span>{event.tutor_rating}</span>
                    </div>
                  )}
                </div>
              </div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: event.difficulty_level === 'Advanced' ? '#7f1d1d' : event.difficulty_level === 'Intermediate' ? '#54260c' : '#064e3b',
                  color: event.difficulty_level === 'Advanced' ? '#fca5a5' : event.difficulty_level === 'Intermediate' ? '#fed7aa' : '#6ee7b7',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                {event.difficulty_level}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.7', marginBottom: '24px' }}>{event.description}</p>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Duration</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar style={{ width: '18px', height: '18px' }} />
                  {event.total_days} days
                </div>
              </div>
              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Per Session</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock style={{ width: '18px', height: '18px' }} />
                  {event.duration_minutes_per_day}m
                </div>
              </div>
              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Bookings</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users style={{ width: '18px', height: '18px' }} />
                  {stats.bookings_count || 0}
                </div>
              </div>
              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Availability</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 style={{ width: '18px', height: '18px' }} />
                  {stats.availability || event.total_days}
                </div>
              </div>
            </div>

            {/* Topics */}
            {event.topics && event.topics.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Topics Covered</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {event.topics.map((topic, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '8px 16px',
                        background: '#334155',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '14px',
                      }}
                    >
                      ✓ {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Program Schedule</h3>
              <div style={{ background: '#1e293b', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' }}>
                {schedule.map((slot, i) => (
                  <div
                    key={slot.day}
                    style={{
                      padding: '16px',
                      borderBottom: i < schedule.length - 1 ? '1px solid #334155' : 'none',
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr auto auto',
                      gap: '16px',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#8b5cf6' }}>Day {slot.day}</div>
                    <div style={{ fontSize: '14px', color: '#cbd5e1' }}>{slot.date}</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>{slot.time}</div>
                    <div style={{ fontSize: '13px', padding: '4px 8px', background: '#334155', borderRadius: '4px', color: '#cbd5e1' }}>
                      {slot.duration_minutes}m
                    </div>
                  </div>
                ))}
                {schedule.length < event.total_days && (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    ... and {event.total_days - schedule.length} more days
                  </div>
                )}
              </div>
            </div>

            {/* Prerequisites */}
            {event.prerequisites && event.prerequisites.length > 0 && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Prerequisites</h3>
                <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                  {event.prerequisites.map((req, i) => (
                    <div key={i} style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: i < event.prerequisites.length - 1 ? '8px' : '0' }}>
                      • {req}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Price Card */}
          <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '24px', marginBottom: '20px', position: 'sticky', top: '20px' }}>
            {/* Price */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Total Price</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>৳{event.price_bdt.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>for {event.total_days} days</div>
            </div>

            {/* Features */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                <span>{event.total_days} sessions (one per day)</span>
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                <span>{event.duration_minutes_per_day}m per session</span>
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                <span>1-on-1 with tutor</span>
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                <span>Progress tracking</span>
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBookEvent}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                marginBottom: '12px',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? 'Booking...' : 'Book This Program'}
            </button>

            <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
              Secure your spot. Cancel anytime before the first session.
            </p>
          </div>

          {/* Tutor Info Card */}
          <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>About Your Tutor</h4>
            <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '12px' }}>
              <strong>{event.tutor.name}</strong>
            </div>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
              Expert tutor with years of experience in {event.category} training.
            </p>
            <button
              onClick={() => navigate(`/tutors/${event.tutor.id}`)}
              style={{
                marginTop: '12px',
                padding: '10px 16px',
                background: 'transparent',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                width: '100%',
              }}
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
