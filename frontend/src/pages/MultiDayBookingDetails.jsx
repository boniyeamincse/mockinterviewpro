import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, Users, Play, CheckCircle2, AlertCircle, Loader, BarChart3, Trophy } from 'lucide-react';
import { request } from '../lib/api';

export default function MultiDayBookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await request('GET', `/multi-day-bookings/${bookingId}`);
      setBooking(response.booking);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load booking details' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = (dayNumber) => {
    navigate(`/multi-day-bookings/${bookingId}/video/${dayNumber}`);
  };

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await request('POST', `/multi-day-bookings/${bookingId}/cancel`, {
          reason: 'User cancelled',
        });
        setMessage({ type: 'success', text: 'Booking cancelled' });
        setTimeout(() => navigate('/user/multi-day-bookings'), 2000);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to cancel booking' });
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <Loader style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', color: '#8b5cf6' }} />
      </div>
    );
  }

  if (!booking) {
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
          <p>Booking not found</p>
        </div>
      </div>
    );
  }

  const progressPercentage = booking.progress?.percentage || 0;
  const nextSession = booking.next_session;

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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>{booking.event.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#cbd5e1' }}>
                <span>Tutor: <strong>{booking.tutor.name}</strong></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users style={{ width: '16px', height: '16px' }} />
                  1-on-1 Session
                </span>
              </div>
            </div>
            <span
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: booking.status === 'completed' ? '#064e3b' : '#1e293b',
                color: booking.status === 'completed' ? '#10b981' : '#cbd5e1',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                border: `1px solid ${booking.status === 'completed' ? '#10b981' : '#334155'}`,
              }}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Progress & Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Progress Card */}
          <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Progress</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {booking.progress?.completed_days || 0}/{booking.progress?.total_days || 0}
                </div>
              </div>
              <BarChart3 style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Days Completed</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#06b6d4' }}>{progressPercentage.toFixed(0)}%</span>
              </div>
              <div style={{ height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                    width: `${progressPercentage}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {progressPercentage === 100 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#22c55e' }}>
                <Trophy style={{ width: '16px', height: '16px' }} />
                <span>Program Completed!</span>
              </div>
            )}
          </div>

          {/* Next Session Card */}
          {nextSession && (
            <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '24px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>Next Session</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '12px' }}>
                Day {nextSession.day_number} of {booking.progress?.total_days || 0}
              </div>
              <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar style={{ width: '16px', height: '16px' }} />
                {new Date(nextSession.scheduled_at).toLocaleDateString()}
              </div>
              <button
                onClick={() => handleJoinSession(nextSession.day_number)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Play style={{ width: '14px', height: '14px' }} />
                Join Session
              </button>
            </div>
          )}

          {/* Price Card */}
          <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '24px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Total Investment</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '16px' }}>
              ৳{(booking.total_price_bdt || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              {booking.total_days} days of 1-on-1 training
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Your Sessions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {booking.sessions?.map((session, i) => {
              const isCompleted = session.status === 'completed';
              const isUpcoming = new Date(session.scheduled_at) > new Date();
              const isToday = new Date(session.scheduled_at).toDateString() === new Date().toDateString();

              return (
                <div
                  key={session.id}
                  style={{
                    background: '#1e293b',
                    borderRadius: '10px',
                    border: `1px solid ${isCompleted ? '#10b981' : '#334155'}`,
                    padding: '16px',
                    position: 'relative',
                  }}
                >
                  {isCompleted && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', color: '#22c55e' }}>
                      <CheckCircle2 style={{ width: '20px', height: '20px' }} />
                    </div>
                  )}

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '4px' }}>
                      Day {session.day_number}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {new Date(session.scheduled_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '14px', height: '14px' }} />
                    {new Date(session.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div style={{ paddingTop: '12px', borderTop: '1px solid #334155' }}>
                    {isCompleted ? (
                      <div style={{ fontSize: '12px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                        Completed
                      </div>
                    ) : isUpcoming ? (
                      <button
                        onClick={() => handleJoinSession(session.day_number)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: isToday ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'transparent',
                          border: isToday ? 'none' : '1px solid #334155',
                          borderRadius: '6px',
                          color: isToday ? '#fff' : '#cbd5e1',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                        disabled={!isToday}
                      >
                        <Play style={{ width: '12px', height: '12px' }} />
                        {isToday ? 'Join Now' : 'Upcoming'}
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Records */}
        {booking.progress && booking.progress.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Progress Records</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {booking.progress.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: '#1e293b',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>Day {p.day_number}</div>
                    {p.completed_at && (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {new Date(p.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {p.topics_covered && p.topics_covered.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Topics Covered</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {p.topics_covered.map((topic, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '11px',
                              padding: '4px 8px',
                              background: '#334155',
                              borderRadius: '4px',
                              color: '#cbd5e1',
                            }}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {p.feedback_from_tutor && (
                    <div style={{ fontSize: '13px', color: '#cbd5e1', padding: '12px', background: '#0f172a', borderRadius: '6px', borderLeft: '3px solid #8b5cf6' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Tutor Feedback</div>
                      {p.feedback_from_tutor}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancel Button */}
        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleCancelBooking}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
