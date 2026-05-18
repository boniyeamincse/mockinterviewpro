import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader, ChevronLeft } from 'lucide-react';
import { request } from '../lib/api';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Payment Form, 2: Gateway, 3: Success
  const [message, setMessage] = useState({ type: '', text: '' });
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await request('GET', `/api/student/bookings/${bookingId}`);
      if (res.success) {
        setBooking(res.data);
      } else {
        setMessage({ type: 'error', text: 'Booking not found' });
        setTimeout(() => navigate('/student/bookings'), 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load booking details' });
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePayment = async () => {
    if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvv) {
      setMessage({ type: 'error', text: 'Please fill in all payment details' });
      return;
    }

    if (cardData.cardNumber.length < 13) {
      setMessage({ type: 'error', text: 'Invalid card number' });
      return;
    }

    if (cardData.cvv.length < 3) {
      setMessage({ type: 'error', text: 'Invalid CVV' });
      return;
    }

    try {
      setProcessing(true);
      const res = await request('POST', '/api/student/payments/initiate', {
        booking_id: parseInt(bookingId),
        amount_bdt: booking.event?.price_bdt || 0,
      });

      if (res.success) {
        setPayment(res.data);
        setStep(2); // Move to gateway step
        // Simulate gateway redirect
        setTimeout(() => {
          handlePaymentSuccess();
        }, 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Payment initiation failed' });
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!payment) return;

    try {
      const res = await request('POST', '/api/student/payments/verify', {
        payment_id: payment.payment_id,
        success: true,
      });

      if (res.success) {
        setStep(3); // Success step
        setMessage({ type: 'success', text: 'Payment successful! Redirecting to your bookings...' });
        setTimeout(() => {
          navigate('/student/bookings');
        }, 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Payment verification failed' });
      setStep(1);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <Loader style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <p style={{ fontSize: '18px', color: '#94a3b8' }}>Booking not found</p>
        </div>
      </div>
    );
  }

  const eventPrice = booking.event?.price_bdt || 0;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '24px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(`/student/book-session/${booking.event_id}`)}
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
          {message.type === 'error' ? <AlertCircle style={{ width: '20px', height: '20px' }} /> : <CheckCircle style={{ width: '20px', height: '20px' }} />}
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', maxWidth: '1200px' }}>
        {/* Main Payment Form */}
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '28px', border: '1px solid #334155' }}>
          {step === 1 && (
            <>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Complete Your Payment</h1>

              {/* Card Form */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value.replace(/\D/g, '') })}
                  maxLength="19"
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

              {/* Cardholder Name */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardData.cardName}
                  onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
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

              {/* Expiry and CVV */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
                    Expiry Month
                  </label>
                  <input
                    type="text"
                    placeholder="MM"
                    value={cardData.expiryMonth}
                    onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value.slice(0, 2) })}
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
                    Expiry Year
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY"
                    value={cardData.expiryYear}
                    onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value.slice(0, 4) })}
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
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>CVV</label>
                  <input
                    type="password"
                    placeholder="***"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                    maxLength="4"
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

              {/* Security Info */}
              <div
                style={{
                  padding: '12px',
                  background: '#0f172a',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#94a3b8',
                  fontSize: '13px',
                  marginBottom: '24px',
                }}
              >
                <Lock style={{ width: '16px', height: '16px' }} />
                Your payment is encrypted and secure
              </div>

              {/* Pay Button */}
              <button
                onClick={handleInitiatePayment}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: processing ? '#334155' : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {processing ? (
                  <>
                    <Loader style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard style={{ width: '18px', height: '18px' }} />
                    Pay {eventPrice} BDT
                  </>
                )}
              </button>
            </>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Loader style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', margin: '0 auto 16px', color: '#8b5cf6' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Processing Payment</h2>
              <p style={{ color: '#94a3b8' }}>Please wait while we process your payment...</p>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <CheckCircle style={{ width: '64px', height: '64px', color: '#22c55e', margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#22c55e' }}>Payment Successful!</h2>
              <p style={{ color: '#94a3b8', marginBottom: '16px' }}>Your session has been booked and confirmed.</p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Redirecting to your bookings...</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155', height: 'fit-content', position: 'sticky', top: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Order Summary</h3>

          {/* Event Details */}
          <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #334155' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Event</div>
            <div style={{ fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>{booking.event?.title}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>By {booking.event?.trainer?.name}</div>
          </div>

          {/* Booking Date */}
          {booking.scheduled_at && (
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Scheduled At</div>
              <div style={{ fontWeight: '600', color: '#06b6d4' }}>
                {new Date(booking.scheduled_at).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
                {' at '}
                {new Date(booking.scheduled_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: '#cbd5e1' }}>Session Price</span>
              <span style={{ fontWeight: '600' }}>{eventPrice} BDT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #334155', fontSize: '16px', fontWeight: 'bold', color: '#06b6d4' }}>
              <span>Total</span>
              <span>{eventPrice} BDT</span>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ padding: '12px', background: '#0f172a', borderRadius: '8px', fontSize: '12px', color: '#94a3b8' }}>
            💳 You will pay via secure card payment
          </div>
        </div>
      </div>
    </div>
  );
}
