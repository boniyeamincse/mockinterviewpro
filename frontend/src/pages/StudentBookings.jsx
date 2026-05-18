import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, CheckCircle, AlertCircle, Loader, Play, Download } from 'lucide-react';
import { request } from '../lib/api';

export default function StudentBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await request('GET', '/api/student/bookings');
      if (res.success) {
        setBookings(res.data?.data || []);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load bookings' });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (bookingId) => {
    try {
      const res = await request('POST', `/api/sessions/${bookingId}/join`, {});
      if (res.success) {
        setMessage({ type: 'success', text: 'Joining session...' });
        // In a real app, redirect to video room
        setTimeout(() => {
          window.open(`/session/${bookingId}`, '_blank');
        }, 1000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to join session' });
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

    try {
      const res = await request('PATCH', `/api/trainer/bookings/${bookingId}/cancel`, {
        cancel_reason: 'Student cancelled',
      });

      if (res.success) {
        setMessage({ type: 'success', text: 'Booking cancelled' });
        fetchBookings();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to cancel booking' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return '#06b6d4';
      case 'completed':
        return '#22c55e';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  const getStatusBadgeBackground = (status) => {
    switch (status) {
      case 'upcoming':
        return '#0c4a6e';
      case 'completed':
        return '#064e3b';
      case 'cancelled':
        return '#7f1d1d';
      default:
        return '#1e293b';
    }
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      fullDate: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
  };

  const isUpcoming = (datetime) => {
    return new Date(datetime) > new Date();
  };

  const filteredBookings =
    filter === 'upcoming'
      ? bookings.filter((b) => b.status === 'upcoming' && isUpcoming(b.scheduled_at))
      : bookings.filter((b) => b.status === filter || !isUpcoming(b.scheduled_at));

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <Loader style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>📅 My Scheduled Sessions</h1>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>View and manage your booked interview sessions</p>
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

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
        {['upcoming', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '8px 16px',
              background: filter === tab ? '#8b5cf6' : 'transparent',
              border: 'none',
              borderBottom: filter === tab ? '2px solid #06b6d4' : 'none',
              color: filter === tab ? '#fff' : '#cbd5e1',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: filter === tab ? '600' : '500',
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#1e293b',
            borderRadius: '12px',
            color: '#94a3b8',
            border: '1px solid #334155',
          }}
        >
          <Calendar style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: '0.5' }} />
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>
            {filter === 'upcoming' ? 'No upcoming sessions' : 'No sessions in this category'}
          </p>
          {filter === 'upcoming' && (
            <button
              onClick={() => navigate('/browse-events')}
              style={{
                marginTop: '16px',
                padding: '10px 20px',
                background: '#8b5cf6',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Book a Session
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredBookings.map((booking) => {
            const { date, time, fullDate } = formatDateTime(booking.scheduled_at);
            const isSessionUpcoming = isUpcoming(booking.scheduled_at);
            const canJoin = booking.status === 'upcoming' && isSessionUpcoming && new Date(booking.scheduled_at).getTime() - new Date().getTime() < 15 * 60 * 1000; // Can join 15 mins before

            return (
              <div
                key={booking.id}
                style={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  border: `1px solid ${booking.status === 'upcoming' ? '#334155' : '#0f172a'}`,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Main Content */}
                <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '20px', alignItems: 'center' }}>
                  {/* Event Info */}
                  <div>
                    <div style={{ marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{booking.event?.title}</h3>
                      <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                        with {booking.trainer?.name || 'Trainer'} • {booking.event?.category}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {booking.event?.topics_covered?.[0] && (
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '4px 8px',
                            background: '#334155',
                            borderRadius: '4px',
                            color: '#cbd5e1',
                          }}
                        >
                          {booking.event.topics_covered[0]}
                        </span>
                      )}
                      {booking.event?.topics_covered?.length > 1 && (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>+{booking.event.topics_covered.length - 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Date & Time</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '8px' }}>
                      {date} at {time}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Duration: {booking.event?.duration_minutes} min</div>
                  </div>

                  {/* Status & Price */}
                  <div>
                    <div style={{ marginBottom: '12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          background: getStatusBadgeBackground(booking.status),
                          color: getStatusColor(booking.status),
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Total Paid</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f5f9' }}>{booking.event?.price_bdt} BDT</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {booking.status === 'upcoming' && isSessionUpcoming && (
                      <>
                        <button
                          onClick={() => handleJoinSession(booking.id)}
                          disabled={!canJoin}
                          title={canJoin ? 'Join session' : 'Can join 15 minutes before start'}
                          style={{
                            padding: '10px 14px',
                            background: canJoin ? '#22c55e' : '#334155',
                            border: 'none',
                            borderRadius: '6px',
                            color: canJoin ? '#fff' : '#94a3b8',
                            cursor: canJoin ? 'pointer' : 'not-allowed',
                            fontSize: '13px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <Play style={{ width: '14px', height: '14px' }} />
                          {canJoin ? 'Join Now' : 'Starts in...'}
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          style={{
                            padding: '10px 14px',
                            background: 'transparent',
                            border: '1px solid #ef4444',
                            borderRadius: '6px',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {booking.status === 'completed' && (
                      <>
                        <button
                          style={{
                            padding: '10px 14px',
                            background: '#334155',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#cbd5e1',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <Download style={{ width: '14px', height: '14px' }} />
                          Recording
                        </button>
                        <button
                          onClick={() => navigate(`/student/review/${booking.id}`)}
                          style={{
                            padding: '10px 14px',
                            background: '#8b5cf6',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          Leave Review
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Timer for Upcoming Sessions */}
                {booking.status === 'upcoming' && isSessionUpcoming && (
                  <div
                    style={{
                      padding: '12px 20px',
                      background: '#0f172a',
                      borderTop: '1px solid #334155',
                      fontSize: '12px',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Clock style={{ width: '14px', height: '14px' }} />
                    Session scheduled for {fullDate} at {time}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
