import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Shield,
  DollarSign,
  Clock,
  CheckCircle,
  User,
  Mail,
  Award,
  Video,
  Camera,
  GraduationCap,
  Target,
  Heart,
  Edit3,
  Save,
  Sparkles,
  CheckCircle2,
  Bell,
  Wallet,
  Search,
  Star,
  RefreshCcw,
  Bookmark,
  TrendingUp,
  MessageSquare,
  X,
} from 'lucide-react';
import studentImg from '../assets/avatar_student.png';
import {
  addWishlist,
  cancelBooking,
  changeStudentPassword,
  createBooking,
  createReview,
  deleteReview,
  getBookings,
  getNotifications,
  getPaymentReceipt,
  getPayments,
  getReviews,
  getStudentProfile,
  getUpcomingBookings,
  getWishlist,
  markAllNotificationsRead,
  markNotificationRead,
  removeWishlist,
  reportReview,
  searchEvents,
  updateNotificationPreferences,
  updateStudentProfile,
  verifyPayment,
  initiatePayment,
  getEventSlots,
  api,
} from '../lib/api';

const defaultProfile = {
  name: 'Student',
  email: '',
  role: 'Candidate',
  joinedDate: '',
  photo: studentImg,
  gender: '',
  birthday: '',
  academicInst: '',
  academicDegree: '',
  academicGradYear: '',
  interests: '',
  goals: '',
  careerGoal: '',
  bio: '',
  phone: '',
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('workspace');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [profileForm, setProfileForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [notificationPrefs, setNotificationPrefs] = useState({ email_enabled: true, sms_enabled: false, push_enabled: true });

  const loadAll = async () => {
    setError('');
    setLoading(true);
    try {
      const [profileResp, bookingsResp, upcomingResp, paymentsResp, reviewsResp, wishlistResp, notificationsResp, eventsResp] = await Promise.allSettled([
        getStudentProfile(),
        getBookings(),
        getUpcomingBookings(),
        getPayments(),
        getReviews(),
        getWishlist(),
        getNotifications(),
        searchEvents(searchQuery),
      ]);

      if (profileResp.status === 'fulfilled') {
        setProfile(api.normalizeUser(profileResp.value?.data) || defaultProfile);
      } else if (api.getStoredUser()) {
        setProfile((prev) => ({ ...prev, ...api.getStoredUser() }));
      }

      if (bookingsResp.status === 'fulfilled') setBookings(bookingsResp.value?.data?.data || bookingsResp.value?.data || []);
      if (upcomingResp.status === 'fulfilled') setUpcomingBookings(upcomingResp.value?.data || []);
      if (paymentsResp.status === 'fulfilled') setPayments(paymentsResp.value?.data?.data || paymentsResp.value?.data || []);
      if (reviewsResp.status === 'fulfilled') setReviews(reviewsResp.value?.data?.data || reviewsResp.value?.data || []);
      if (wishlistResp.status === 'fulfilled') setWishlist(wishlistResp.value?.data?.data || wishlistResp.value?.data || []);
      if (notificationsResp.status === 'fulfilled') setNotifications(notificationsResp.value?.data?.data || notificationsResp.value?.data || []);
      if (eventsResp.status === 'fulfilled') setEvents(eventsResp.value?.data?.data || eventsResp.value?.data || []);
    } catch (err) {
      setError(err?.payload?.message || err.message || 'Failed to load student workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = api.getStoredUser();
    if (!storedUser) {
      window.location.href = '/login';
      return;
    }
    if (storedUser.user_type === 'trainer') {
      window.location.href = '/trainer/dashboard';
      return;
    }
    setProfile((prev) => ({ ...prev, ...storedUser }));
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && !bookings.length && !upcomingBookings.length) {
      setActiveTab('profile');
    }
  }, [loading, bookings.length, upcomingBookings.length]);

  const completeness = useMemo(() => {
    let score = 0;
    if (profile.name) score += 10;
    if (profile.email) score += 10;
    if (profile.photo) score += 10;
    if (profile.gender) score += 10;
    if (profile.birthday) score += 10;
    if (profile.academicInst || profile.academicDegree) score += 20;
    if (profile.interests) score += 15;
    if (profile.goals || profile.careerGoal) score += 15;
    return score;
  }, [profile]);

  const stats = useMemo(() => ({
    totalBookings: bookings.length,
    upcoming: upcomingBookings.length,
    paid: payments.filter((payment) => payment.status === 'paid').length,
    avgScore: reviews.length ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length).toFixed(1) : '0.0',
  }), [bookings, upcomingBookings, payments, reviews]);

  const hasBookings = bookings.length > 0 || upcomingBookings.length > 0;

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, photo: url }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await updateStudentProfile({
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        goals: profile.goals,
        career_goal: profile.careerGoal,
        interests: profile.interests,
        academic_inst: profile.academicInst,
        academic_degree: profile.academicDegree,
        academic_grad_year: profile.academicGradYear || null,
      });
      const nextUser = api.normalizeUser(response?.data);
      if (nextUser) {
        localStorage.setItem('user', JSON.stringify(nextUser));
        setProfile((prev) => ({ ...prev, ...nextUser }));
      }
      setIsEditing(false);
    } catch (err) {
      setError(err?.payload?.message || err.message || 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await changeStudentPassword(profileForm);
      setProfileForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      setError(err?.payload?.message || err.message || 'Unable to change password');
    }
  };

  const handleSearch = async () => {
    setError('');
    try {
      const response = await searchEvents(searchQuery);
      setEvents(response?.data?.data || response?.data || []);
    } catch (err) {
      setError(err?.payload?.message || err.message || 'Unable to search events');
    }
  };

  const handleLoadSlots = async (eventId) => {
    setSelectedEvent(eventId);
    try {
      const response = await getEventSlots(eventId);
      setSlots(response?.data || []);
      setSelectedSlotId(response?.data?.[0]?.id || '');
    } catch (err) {
      setError(err?.payload?.message || err.message || 'Unable to load slots');
    }
  };

  const handleBook = async () => {
    if (!selectedEvent || !selectedSlotId) return;
    try {
      const response = await createBooking({ event_id: selectedEvent, slot_id: Number(selectedSlotId) });
      setBookings((prev) => [response?.data, ...prev]);
      setActiveTab('workspace');
      await loadAll();
    } catch (err) {
      setError(err?.payload?.message || err.message || 'Unable to create booking');
    }
  };

  const handlePay = async (bookingId) => {
    try {
      const initiated = await initiatePayment({ booking_id: bookingId, amount_bdt: 800 });
      const paymentId = initiated?.data?.payment_id;
      if (paymentId) {
        await verifyPayment({ payment_id: paymentId, success: true });
        const receipt = await getPaymentReceipt(paymentId);
        setPaymentReceipt(receipt?.data);
        await loadAll();
      }
    } catch (err) {
      setError(err?.payload?.message || err.message || 'Unable to process payment');
    }
  };

  const handleAddReview = async () => {
    if (!bookings[0]) return;
    try {
      await createReview({ event_id: bookings[0].event_id, booking_id: bookings[0].id, rating: 5, comment: 'Great session' });
      await loadAll();
    } catch (err) {
      setError(err?.payload?.message || err.message || 'Unable to add review');
    }
  };

  const handleReadNotification = async (id) => {
    await markNotificationRead(id);
    await loadAll();
  };

  const handleReadAllNotifications = async () => {
    await markAllNotificationsRead();
    await loadAll();
  };

  const handleUpdatePreferences = async () => {
    await updateNotificationPreferences(notificationPrefs);
    await loadAll();
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
          Loading student workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', fontFamily: 'var(--font-family)' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', position: 'relative', overflow: 'hidden', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1 }}>
          <img src={profile.photo || studentImg} alt="User Avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', objectFit: 'cover' }} />
          <div>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '4px', fontWeight: 700 }}>Welcome back, {profile.name}!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{profile.role} Workspace - backed by live student APIs.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', zIndex: 1, flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab(activeTab === 'workspace' ? 'profile' : 'workspace')} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', border: activeTab === 'profile' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-light)', color: activeTab === 'profile' ? 'white' : 'var(--text-secondary)' }}>
            <User size={16} style={{ color: activeTab === 'profile' ? 'var(--accent-cyan)' : 'inherit' }} />
            {activeTab === 'profile' ? 'Back to Workspace' : 'Manage Profile'}
          </button>
          <button onClick={loadAll} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '24px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
          {error}
        </div>
      )}

      {activeTab === 'workspace' ? (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {!hasBookings ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Sparkles size={32} style={{ margin: '0 auto 16px', color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Complete your profile first</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto 18px' }}>
                You do not have any booked sessions yet, so the workspace stays on profile mode. Update your details, then book a session to unlock bookings, payments, reviews, and notifications.
              </p>
              <button className="btn btn-primary" onClick={() => setActiveTab('profile')}>Go to Profile</button>
            </div>
          ) : (
          <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Bookings</span><h3 style={{ fontSize: '2.2rem', marginTop: '8px', fontWeight: 700 }}>{stats.totalBookings}</h3></div>
            <div className="glass-panel" style={{ padding: '24px' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Upcoming Sessions</span><h3 style={{ fontSize: '2.2rem', marginTop: '8px', fontWeight: 700 }}>{stats.upcoming}</h3></div>
            <div className="glass-panel" style={{ padding: '24px' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Paid Sessions</span><h3 style={{ fontSize: '2.2rem', marginTop: '8px', fontWeight: 700 }}>{stats.paid}</h3></div>
            <div className="glass-panel" style={{ padding: '24px' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Average Review</span><h3 style={{ fontSize: '2.2rem', marginTop: '8px', color: 'var(--accent-cyan)', fontWeight: 700 }}>{stats.avgScore} / 5</h3></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Upcoming Interview Sessions</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search events" style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', color: 'white', minWidth: '220px' }} />
                  <button className="btn btn-primary" onClick={handleSearch} style={{ padding: '10px 14px' }}><Search size={16} /> Search</button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(events.length ? events : upcomingBookings).slice(0, 6).map((item) => {
                  const eventId = item.event_id || item.id;
                  return (
                    <div key={eventId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', minWidth: '0' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}><Video size={24} /></div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.title || item.event_title || 'Interview Session'}</h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>{item.description || item.category || 'Live student session'}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {item.starts_at && <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{new Date(item.starts_at).toLocaleString()}</span>}
                        <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleLoadSlots(eventId)}>Select Slot</button>
                      </div>
                    </div>
                  );
                })}

                {!events.length && !upcomingBookings.length && (
                  <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>No sessions loaded yet. Search the public event catalog to book one.</div>
                )}
              </div>

              <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <h4 style={{ marginBottom: '12px' }}>Available Slots</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {slots.map((slot) => (
                      <button key={slot.id} onClick={() => setSelectedSlotId(slot.id)} className="btn btn-secondary" style={{ justifyContent: 'space-between', borderColor: Number(selectedSlotId) === Number(slot.id) ? 'var(--accent-cyan)' : 'var(--border-light)' }}>
                        <span>{new Date(slot.starts_at).toLocaleString()}</span>
                        <span>{slot.status}</span>
                      </button>
                    ))}
                  </div>
                  <button className="btn btn-primary" onClick={handleBook} style={{ marginTop: '12px' }}>Book Selected Slot</button>
                </div>
                <div>
                  <h4 style={{ marginBottom: '12px' }}>Payments & Actions</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={handleAddReview}>Add Sample Review</button>
                    {bookings[0] && <button className="btn btn-secondary" onClick={() => handlePay(bookings[0].id)}>Pay First Booking</button>}
                    {paymentReceipt && <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>Receipt ready: #{paymentReceipt.payment_id}</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Profile Strength</h3>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}><span style={{ color: 'var(--text-secondary)' }}>Completeness</span><span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{completeness}%</span></div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}><div style={{ width: `${completeness}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))', borderRadius: '10px' }} /></div>
              </div>
              <div style={{ background: 'rgba(139,92,246,0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.1)' }}>
                <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Next actions</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Complete your profile, reserve a slot, and keep notifications read.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={handleReadAllNotifications}>Mark all notifications read</button>
                <button className="btn btn-secondary" onClick={handleUpdatePreferences}>Save notification preferences</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ marginBottom: '18px' }}>Bookings</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <strong>Booking #{booking.id}</strong>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{booking.status} · {booking.scheduled_at || 'scheduled soon'}</div>
                    </div>
                    <button className="btn btn-secondary" onClick={() => cancelBooking(booking.id, { reason: 'student requested' }).then(loadAll)}>Cancel</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ marginBottom: '18px' }}>Notifications</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {notifications.slice(0, 6).map((notification) => (
                  <button key={notification.id} onClick={() => handleReadNotification(notification.id)} className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                    <span>{notification.title}</span>
                    <Bell size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ marginBottom: '18px' }}>Payments</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)' }}>
                    <strong>Payment #{payment.id}</strong>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{payment.status} · {payment.amount_bdt} BDT</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ marginBottom: '18px' }}>Reviews</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)' }}>
                    <strong>Rating {review.rating}/5</strong>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{review.comment || 'No comment'}</div>
                    <button className="btn btn-secondary" onClick={() => reportReview(review.id, { reason: 'review inspection' })} style={{ marginTop: '8px' }}>Report</button>
                    <button className="btn btn-secondary" onClick={() => deleteReview(review.id).then(loadAll)} style={{ marginTop: '8px', marginLeft: '8px' }}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      ) : (
        <div className="glass-panel animate-fade-in" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>My Student Profile</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>Keep your academic and preparation data synced with the backend.</p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ minWidth: '150px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}><span style={{ color: 'var(--text-secondary)' }}>Completeness</span><span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{completeness}%</span></div>
                <div style={{ width: '150px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}><div style={{ width: `${completeness}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))' }} /></div>
              </div>
              <button onClick={handleSaveProfile} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                <img src={profile.photo || studentImg} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover', border: '2px solid var(--border-light)' }} />
                {isEditing && (
                  <label style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', color: 'black' }}>
                    <Camera size={16} />
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white' }}>{profile.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>{profile.role}</span>
                <span style={{ display: 'inline-block', marginTop: '12px', fontSize: '0.75rem', fontWeight: 600, color: completeness >= 75 ? '#10b981' : '#f59e0b', background: completeness >= 75 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', padding: '4px 14px', borderRadius: '100px', border: completeness >= 75 ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)' }}>{completeness >= 75 ? 'Verified Profile Strong' : 'Profile Needs Completion'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} style={{ color: 'var(--accent-cyan)' }} /> Personal Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <input name="name" value={profile.name} onChange={handleProfileChange} disabled={!isEditing} style={fieldStyle(isEditing)} />
                  <input name="email" value={profile.email} onChange={handleProfileChange} disabled={!isEditing} style={fieldStyle(isEditing)} />
                  <input name="phone" value={profile.phone || ''} onChange={handleProfileChange} disabled={!isEditing} placeholder="Phone" style={fieldStyle(isEditing)} />
                  <select name="gender" value={profile.gender || ''} onChange={handleProfileChange} disabled={!isEditing} style={fieldStyle(isEditing)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><GraduationCap size={18} style={{ color: 'var(--accent-purple)' }} /> Academic Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <input name="academicInst" value={profile.academicInst || ''} onChange={handleProfileChange} disabled={!isEditing} placeholder="University / College" style={fieldStyle(isEditing)} />
                  <input name="academicGradYear" value={profile.academicGradYear || ''} onChange={handleProfileChange} disabled={!isEditing} placeholder="Graduation Year" style={fieldStyle(isEditing)} />
                </div>
                <input name="academicDegree" value={profile.academicDegree || ''} onChange={handleProfileChange} disabled={!isEditing} placeholder="Degree / Program" style={fieldStyle(isEditing)} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={18} style={{ color: 'var(--accent-cyan)' }} /> Interests & Career Goals</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <input name="interests" value={profile.interests || ''} onChange={handleProfileChange} disabled={!isEditing} placeholder="Tech interests" style={fieldStyle(isEditing)} />
                  <input name="careerGoal" value={profile.careerGoal || ''} onChange={handleProfileChange} disabled={!isEditing} placeholder="Career goal" style={fieldStyle(isEditing)} />
                  <textarea name="goals" rows="3" value={profile.goals || ''} onChange={handleProfileChange} disabled={!isEditing} placeholder="Preparation goals" style={{ ...fieldStyle(isEditing), resize: 'none' }} />
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '16px' }}>Change Password</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <input type="password" value={profileForm.current_password} onChange={(e) => setProfileForm((prev) => ({ ...prev, current_password: e.target.value }))} placeholder="Current password" style={fieldStyle(true)} />
                  <input type="password" value={profileForm.password} onChange={(e) => setProfileForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="New password" style={fieldStyle(true)} />
                  <input type="password" value={profileForm.password_confirmation} onChange={(e) => setProfileForm((prev) => ({ ...prev, password_confirmation: e.target.value }))} placeholder="Confirm new password" style={fieldStyle(true)} />
                  <button type="button" onClick={handlePasswordChange} className="btn btn-secondary">Update Password</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

function fieldStyle(editable) {
  return {
    padding: '10px 12px',
    borderRadius: '8px',
    background: editable ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
    border: '1px solid var(--border-light)',
    color: 'white',
    fontFamily: 'inherit',
    outline: 'none',
  };
}

export default Dashboard;
