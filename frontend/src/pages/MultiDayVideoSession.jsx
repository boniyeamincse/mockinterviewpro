import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Share2, MessageSquare, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import { request } from '../lib/api';

export default function MultiDayVideoSession() {
  const { bookingId, dayNumber } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    initializeSession();
  }, [bookingId, dayNumber]);

  useEffect(() => {
    let interval;
    if (sessionActive) {
      interval = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  const initializeSession = async () => {
    try {
      setLoading(true);
      const response = await request('GET', `/multi-day-bookings/${bookingId}/video/${dayNumber}`);
      setSessionData(response);

      if (!response.can_join) {
        setMessage({
          type: 'error',
          text: `Session starts at ${new Date(response.session.scheduled_at).toLocaleTimeString()}`,
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load session' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async () => {
    try {
      await request('POST', `/multi-day-sessions/${sessionData.session.id}/join`);
      setSessionActive(true);
      setMessage({ type: 'success', text: 'Session started' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to join session' });
    }
  };

  const handleLeaveSession = async () => {
    try {
      await request('POST', `/multi-day-sessions/${sessionData.session.id}/leave`);
      setSessionActive(false);
      setMessage({ type: 'success', text: 'Session ended' });
      setTimeout(() => navigate(`/user/multi-day-bookings/${bookingId}`), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to leave session' });
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <Loader style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', color: '#8b5cf6' }} />
      </div>
    );
  }

  if (!sessionData) {
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
          <p>Session not found</p>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9' }}>
      {/* Top Bar */}
      <div
        style={{
          background: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
            Day {dayNumber}: {sessionData.booking.event.title}
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            1-on-1 with {sessionData.is_tutor ? sessionData.booking.user.name : sessionData.booking.tutor.name}
          </p>
        </div>
        {sessionActive && (
          <div
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
            Recording
          </div>
        )}
      </div>

      {/* Messages */}
      {message.text && (
        <div
          style={{
            margin: '16px 24px 0',
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

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '0', height: 'calc(100vh - 90px)' }}>
        {/* Video Area */}
        <div
          style={{
            background: '#0f172a',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!sessionActive ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>📹</div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Ready to Join?</h3>
              <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                This is a 1-on-1 video session. Your tutor will see and hear you during the call.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  style={{
                    padding: '12px',
                    background: videoEnabled ? '#334155' : '#7f1d1d',
                    border: '1px solid ' + (videoEnabled ? '#334155' : '#ef4444'),
                    borderRadius: '8px',
                    color: videoEnabled ? '#f1f5f9' : '#fca5a5',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {videoEnabled ? <Video style={{ width: '16px', height: '16px' }} /> : <VideoOff style={{ width: '16px', height: '16px' }} />}
                  Video {videoEnabled ? 'On' : 'Off'}
                </button>

                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  style={{
                    padding: '12px',
                    background: audioEnabled ? '#334155' : '#7f1d1d',
                    border: '1px solid ' + (audioEnabled ? '#334155' : '#ef4444'),
                    borderRadius: '8px',
                    color: audioEnabled ? '#f1f5f9' : '#fca5a5',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {audioEnabled ? <Mic style={{ width: '16px', height: '16px' }} /> : <MicOff style={{ width: '16px', height: '16px' }} />}
                  Mic {audioEnabled ? 'On' : 'Off'}
                </button>
              </div>

              <button
                onClick={handleJoinSession}
                style={{
                  padding: '14px 48px',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  margin: '0 auto',
                }}
              >
                <Phone style={{ width: '20px', height: '20px' }} />
                Join Session
              </button>
            </div>
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎥</div>
                <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '16px' }}>Session in Progress</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', fontFamily: 'monospace' }}>
                  {formatTime(elapsedTime)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div
          style={{
            background: '#1e293b',
            borderLeft: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Session Info */}
          <div style={{ padding: '16px', borderBottom: '1px solid #334155' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>Session Details</div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Duration</div>
              <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '600' }}>
                {sessionData.booking.event.duration_minutes_per_day} minutes
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Scheduled</div>
              <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                {new Date(sessionData.session.scheduled_at).toLocaleString()}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Category</div>
              <div style={{ fontSize: '13px', color: '#cbd5e1' }}>{sessionData.booking.event.category}</div>
            </div>
          </div>

          {/* Controls */}
          {sessionActive && (
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  style={{
                    padding: '10px',
                    background: audioEnabled ? '#334155' : '#7f1d1d',
                    border: 'none',
                    borderRadius: '6px',
                    color: audioEnabled ? '#f1f5f9' : '#fca5a5',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {audioEnabled ? <Mic style={{ width: '14px', height: '14px' }} /> : <MicOff style={{ width: '14px', height: '14px' }} />}
                  {audioEnabled ? 'Mute' : 'Unmute'}
                </button>

                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  style={{
                    padding: '10px',
                    background: videoEnabled ? '#334155' : '#7f1d1d',
                    border: 'none',
                    borderRadius: '6px',
                    color: videoEnabled ? '#f1f5f9' : '#fca5a5',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {videoEnabled ? <Video style={{ width: '14px', height: '14px' }} /> : <VideoOff style={{ width: '14px', height: '14px' }} />}
                  {videoEnabled ? 'Stop Video' : 'Start Video'}
                </button>

                <button
                  style={{
                    padding: '10px',
                    background: '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#f1f5f9',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Share2 style={{ width: '14px', height: '14px' }} />
                  Share Screen
                </button>

                <button
                  style={{
                    padding: '10px',
                    background: '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#f1f5f9',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <MessageSquare style={{ width: '14px', height: '14px' }} />
                  Chat
                </button>
              </div>

              <div style={{ flex: 1 }} />

              <button
                onClick={handleLeaveSession}
                style={{
                  padding: '12px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: 'auto',
                }}
              >
                <PhoneOff style={{ width: '16px', height: '16px' }} />
                Leave Session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
