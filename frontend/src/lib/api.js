const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

function getJsonHeaders() {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(path, options = {}) {
  const { auth = true, body, headers = {}, ...rest } = options;
  const finalHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (auth) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  if (body !== undefined && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { success: false, message: text };
    }
  }

  if (!response.ok) {
    const error = new Error(payload?.message || 'Request failed');
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.user_type ? user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1) : user.role,
    user_type: user.user_type,
    bio: user.bio || '',
    phone: user.phone || '',
    gender: user.gender || '',
    birthday: user.birthday || '',
    academicInst: user.academic_inst || user.academicInst || '',
    academicDegree: user.academic_degree || user.academicDegree || '',
    academicGradYear: user.academic_grad_year || user.academicGradYear || '',
    interests: user.interests || '',
    goals: user.goals || '',
    careerGoal: user.career_goal || user.careerGoal || '',
    profile_image: user.profile_image || user.photo || '',
    email_verified_at: user.email_verified_at || null,
    joinedDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : user.joinedDate || '',
  };
}

function saveSession({ token, user }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(user)));
  }
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getStoredUser() {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function sessionHeaders() {
  return getJsonHeaders();
}

export const api = {
  request,
  normalizeUser,
  saveSession,
  clearSession,
  getStoredUser,
  sessionHeaders,
  tokenKey: TOKEN_KEY,
  userKey: USER_KEY,
};

export async function registerUser(payload) {
  const response = await request('/auth/register', {
    method: 'POST',
    auth: false,
    body: payload,
  });

  const token = response?.data?.access_token || '';
  const user = response?.data?.user || null;
  if (token && user) saveSession({ token, user });
  return response;
}

export async function loginUser(payload) {
  const response = await request('/auth/login', {
    method: 'POST',
    auth: false,
    body: payload,
  });

  const token = response?.data?.access_token || '';
  const user = response?.data?.user || null;
  if (token && user) saveSession({ token, user });
  return response;
}

export async function logoutUser() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch {
    // ignore logout errors and clear local session anyway
  }
  clearSession();
}

export async function getStudentProfile() {
  return request('/student/profile');
}

export async function updateStudentProfile(payload) {
  return request('/student/profile', {
    method: 'PUT',
    body: payload,
  });
}

export async function changeStudentPassword(payload) {
  return request('/student/profile/password', {
    method: 'PATCH',
    body: payload,
  });
}

export async function searchEvents(query = '') {
  const suffix = query ? `?q=${encodeURIComponent(query)}` : '';
  return request(`/events/search${suffix}`, { auth: false });
}

export async function getEventSlots(eventId) {
  return request(`/events/${eventId}/slots`, { auth: false });
}

export async function addWishlist(eventId) {
  return request(`/student/wishlist/${eventId}`, { method: 'POST' });
}

export async function removeWishlist(eventId) {
  return request(`/student/wishlist/${eventId}`, { method: 'DELETE' });
}

export async function getWishlist() {
  return request('/student/wishlist');
}

export async function getBookings() {
  return request('/student/bookings');
}

export async function getUpcomingBookings() {
  return request('/student/bookings/upcoming');
}

export async function getBooking(id) {
  return request(`/student/bookings/${id}`);
}

export async function createBooking(payload) {
  return request('/student/bookings', {
    method: 'POST',
    body: payload,
  });
}

export async function cancelBooking(id, payload) {
  return request(`/student/bookings/${id}/cancel`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function rescheduleBooking(id, payload) {
  return request(`/student/bookings/${id}/reschedule`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function getPayments() {
  return request('/student/payments');
}

export async function getPayment(id) {
  return request(`/student/payments/${id}`);
}

export async function getPaymentReceipt(id) {
  return request(`/student/payments/${id}/receipt`);
}

export async function initiatePayment(payload) {
  return request('/student/payments/initiate', {
    method: 'POST',
    body: payload,
  });
}

export async function verifyPayment(payload) {
  return request('/student/payments/verify', {
    method: 'POST',
    body: payload,
  });
}

export async function getReviews() {
  return request('/student/reviews');
}

export async function createReview(payload) {
  return request('/student/reviews', {
    method: 'POST',
    body: payload,
  });
}

export async function updateReview(id, payload) {
  return request(`/student/reviews/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export async function deleteReview(id) {
  return request(`/student/reviews/${id}`, {
    method: 'DELETE',
  });
}

export async function reportReview(id, payload) {
  return request(`/student/reviews/${id}/report`, {
    method: 'POST',
    body: payload,
  });
}

export async function getNotifications() {
  return request('/student/notifications');
}

export async function markNotificationRead(id) {
  return request(`/student/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsRead() {
  return request('/student/notifications/read-all', {
    method: 'PATCH',
  });
}

export async function updateNotificationPreferences(payload) {
  return request('/student/notifications/preferences', {
    method: 'PUT',
    body: payload,
  });
}

// ─── Trainer API ─────────────────────────────────────────────────────────────

export async function getTrainers({ q = '', category = '', maxPrice } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category && category !== 'all') params.set('category', category);
  if (maxPrice != null) params.set('max_price', maxPrice);
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return request(`/trainers${suffix}`, { auth: false });
}

export async function getTrainerPublicProfile(id) {
  return request(`/trainers/${id}/profile`, { auth: false });
}

export async function getTrainerPublicReviews(id) {
  return request(`/trainers/${id}/reviews`, { auth: false });
}

export async function getTrainerProfile() {
  return request('/trainer/profile');
}

export async function updateTrainerProfile(payload) {
  return request('/trainer/profile', { method: 'PUT', body: payload });
}

export async function changeTrainerPassword(payload) {
  return request('/trainer/profile/password', { method: 'PATCH', body: payload });
}

export async function getTrainerBookings(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/trainer/bookings${qs ? `?${qs}` : ''}`);
}

export async function getTrainerBookingsToday() {
  return request('/trainer/bookings/today');
}

export async function getTrainerBooking(id) {
  return request(`/trainer/bookings/${id}`);
}

export async function cancelTrainerBooking(id, payload) {
  return request(`/trainer/bookings/${id}/cancel`, { method: 'PATCH', body: payload });
}

export async function completeTrainerBooking(id) {
  return request(`/trainer/bookings/${id}/complete`, { method: 'PATCH' });
}

export async function getTrainerEvents() {
  return request('/trainer/events');
}

export async function createTrainerEvent(payload) {
  return request('/trainer/events', { method: 'POST', body: payload });
}

export async function getTrainerEvent(id) {
  return request(`/trainer/events/${id}`);
}

export async function updateTrainerEvent(id, payload) {
  return request(`/trainer/events/${id}`, { method: 'PUT', body: payload });
}

export async function publishTrainerEvent(id) {
  return request(`/trainer/events/${id}/publish`, { method: 'PATCH' });
}

export async function unpublishTrainerEvent(id) {
  return request(`/trainer/events/${id}/unpublish`, { method: 'PATCH' });
}

export async function deleteTrainerEvent(id) {
  return request(`/trainer/events/${id}`, { method: 'DELETE' });
}

export async function addTrainerEventSlots(id, payload) {
  return request(`/trainer/events/${id}/slots`, { method: 'POST', body: payload });
}

export async function getTrainerEventSlots(id) {
  return request(`/trainer/events/${id}/slots`);
}

export async function deleteTrainerSlot(slotId) {
  return request(`/trainer/slots/${slotId}`, { method: 'DELETE' });
}

export async function blockTrainerAvailability(payload) {
  return request('/trainer/availability/block', { method: 'POST', body: payload });
}

export async function unblockTrainerAvailability(id) {
  return request(`/trainer/availability/block/${id}`, { method: 'DELETE' });
}

export async function getTrainerAnalyticsOverview() {
  return request('/trainer/analytics/overview');
}

export async function getTrainerAnalyticsRevenue() {
  return request('/trainer/analytics/revenue');
}

export async function getTrainerAnalyticsSessions() {
  return request('/trainer/analytics/sessions');
}

export async function getTrainerAnalyticsRatings() {
  return request('/trainer/analytics/ratings');
}

export async function getTrainerWallet() {
  return request('/trainer/wallet');
}

export async function getTrainerWalletTransactions() {
  return request('/trainer/wallet/transactions');
}

export async function requestTrainerWithdrawal(payload) {
  return request('/trainer/wallet/withdraw', { method: 'POST', body: payload });
}

export async function getTrainerWithdrawals() {
  return request('/trainer/wallet/withdrawals');
}

export async function saveTrainerBankAccount(payload) {
  return request('/trainer/bank-account', { method: 'POST', body: payload });
}

export async function getTrainerBankAccount() {
  return request('/trainer/bank-account');
}

export async function getTrainerReviews() {
  return request('/trainer/reviews');
}

export async function replyToTrainerReview(reviewId, payload) {
  return request(`/trainer/reviews/${reviewId}/reply`, { method: 'POST', body: payload });
}

export async function updateTrainerReviewReply(reviewId, payload) {
  return request(`/trainer/reviews/${reviewId}/reply`, { method: 'PUT', body: payload });
}

export async function getTrainerNotifications() {
  return request('/trainer/notifications');
}

export async function markTrainerNotificationRead(id) {
  return request(`/trainer/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllTrainerNotificationsRead() {
  return request('/trainer/notifications/read-all', { method: 'PATCH' });
}

export async function updateTrainerNotificationPreferences(payload) {
  return request('/trainer/notifications/preferences', { method: 'PUT', body: payload });
}