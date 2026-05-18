import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar, Users, ChevronLeft, Loader, Check, AlertCircle } from 'lucide-react';
import { request } from '../lib/api';

export default function BookSession() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [agreesTerms, setAgreesTerms] = useState(false);
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEventAndSlots();
  }, [eventId]);

  const fetchEventAndSlots = async () => {
    try {
      setLoading(true);
      const [eventRes, slotsRes] = await Promise.all([
        request('GET', `/api/events/${eventId}`),
        request('GET', `/api/events/${eventId}/slots`),
      ]);

      if (eventRes.success) {
        setEvent(eventRes.data);
      }

      if (slotsRes.success) {
        const openSlots = slotsRes.data?.filter((s) => s.status === 'open') || [];
        setSlots(openSlots);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load event details' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !agreesTerms) {
      setMessage({ type: 'error', text: 'Please select a slot and agree to terms' });
      return;
    }

    try {
      const res = await request('POST', '/api/student/bookings', {
        event_id: parseInt(eventId),
        slot_id: selectedSlot.id,
      });

      if (res.success) {
        setBooking(res.data);
        setMessage({ type: 'success', text: 'Session booked! Redirecting to payment...' });
        setTimeout(() => {
          navigate(`/student/payment/${res.data.id}`);
        }, 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
    }
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <Loader style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p>Loading session details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <p style={{ fontSize: '18px', color: '#94a3b8' }}>Event not found</p>
          <button
            onClick={() => navigate('/browse-events')}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              background: '#8b5cf6',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '24px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/browse-events')}
        style={{
          padding: '8px 12px',
          background: '#1e293b',
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
        <ChevronLeft style={{ width: '18px', height: '18px' }} />
        Back
      </button>

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
          {message.type === 'error' ? <AlertCircle style={{ width: '20px', height: '20px' }} /> : <Check style={{ width: '20px', height: '20px' }} />}
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Content */}
        <div>
          {/* Event Summary */}
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #334155' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>{event.title}</h1>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Duration</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock style={{ width: '18px', height: '18px' }} />
                  {event.duration_minutes} minutes
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Sessions</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#06b6d4' }}>{event.total_sessions} sessions</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Price</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#06b6d4' }}>{event.price_bdt} BDT</div>
              </div>
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{event.description}</div>
          </div>

          {/* Available Slots */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Select Your Session Time</h2>

            {slots.length === 0 ? (
              <div
                style={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                }}
              >
                <Calendar style={{ width: '40px', height: '40px', margin: '0 auto 16px', opacity: '0.5' }} />
                <p>No available slots at the moment</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {slots.map((slot) => {
                  const { date, time } = formatDateTime(slot.starts_at);
                  const isSelected = selectedSlot?.id === slot.id;

                  return (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '16px',
                        background: isSelected ? '#8b5cf6' : '#1e293b',
                        border: `2px solid ${isSelected ? '#8b5cf6' : '#334155'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#8b5cf6';
                          e.currentTarget.style.background = '#1e293b';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#334155';
                        }
                      }}
                    >
                      <div style={{ fontSize: '12px', color: isSelected ? '#f1f5f9' : '#94a3b8' }}>📅 {date}</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: isSelected ? '#f1f5f9' : '#06b6d4' }}>{time}</div>
                      {isSelected && <Check style={{ width: '20px', height: '20px', color: '#f1f5f9' }} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Booking Summary */}
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155', position: 'sticky', top: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Booking Summary</h3>

            {/* Trainer Info */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Trainer</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {event.trainer?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#f1f5f9' }}>{event.trainer?.name || 'Trainer'}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{event.category}</div>
                </div>
              </div>
            </div>

            {/* Selected Slot */}
            {selectedSlot ? (
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Selected Date & Time</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#06b6d4' }}>
                  {formatDateTime(selectedSlot.starts_at).date} at {formatDateTime(selectedSlot.starts_at).time}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Please select a slot above</div>
              </div>
            )}

            {/* Price Breakdown */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#cbd5e1' }}>Session Price</span>
                <span style={{ fontWeight: '600' }}>{event.price_bdt} BDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #334155' }}>
                <span style={{ color: '#cbd5e1' }}>Platform Fee (0%)</span>
                <span style={{ fontWeight: '600' }}>0 BDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', color: '#06b6d4' }}>
                <span>Total</span>
                <span>{event.price_bdt} BDT</span>
              </div>
            </div>

            {/* Terms Checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px', cursor: 'pointer', fontSize: '12px' }}>
              <input
                type="checkbox"
                checked={agreesTerms}
                onChange={(e) => setAgreesTerms(e.target.checked)}
                style={{ marginTop: '2px', cursor: 'pointer' }}
              />
              <span style={{ color: '#94a3b8' }}>
                I agree to the cancellation and reschedule policies. I understand I cannot get a refund after 24 hours of session start.
              </span>
            </label>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmBooking}
              disabled={!selectedSlot || !agreesTerms}
              style={{
                width: '100%',
                padding: '12px',
                background: selectedSlot && agreesTerms ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : '#334155',
                border: 'none',
                borderRadius: '8px',
                color: selectedSlot && agreesTerms ? '#fff' : '#94a3b8',
                cursor: selectedSlot && agreesTerms ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
