import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import TrainerProfileEdit from './pages/TrainerProfileEdit';
import FindTrainer from './pages/FindTrainer';
import BecomeTrainer from './pages/BecomeTrainer';
import BrowseEvents from './pages/BrowseEvents';
import BookSession from './pages/BookSession';
import PaymentPage from './pages/PaymentPage';
import StudentBookings from './pages/StudentBookings';
import CreateEvent from './pages/CreateEvent';
import LearningPage from './pages/LearningPage';
import CourseDetails from './pages/CourseDetails';
import MultiDayEventsList from './pages/MultiDayEventsList';
import MultiDayEventDetails from './pages/MultiDayEventDetails';
import MultiDayBookingDetails from './pages/MultiDayBookingDetails';
import MultiDayVideoSession from './pages/MultiDayVideoSession';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="trainers" element={<FindTrainer />} />
          <Route path="become-trainer" element={<BecomeTrainer />} />
          <Route path="browse-events" element={<BrowseEvents />} />
          <Route path="learning" element={<LearningPage />} />
          <Route path="student/bookings" element={<StudentBookings />} />
          <Route path="multi-day-events" element={<MultiDayEventsList />} />
          <Route path="multi-day-events/:eventId" element={<MultiDayEventDetails />} />
          <Route path="user/multi-day-bookings/:bookingId" element={<MultiDayBookingDetails />} />
          <Route path="multi-day-bookings/:bookingId/video/:dayNumber" element={<MultiDayVideoSession />} />
        </Route>
        <Route path="trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="trainer/profile/edit" element={<TrainerProfileEdit />} />
        <Route path="trainer/create-event" element={<CreateEvent />} />
        <Route path="student/book-session/:eventId" element={<BookSession />} />
        <Route path="student/payment/:bookingId" element={<PaymentPage />} />
        <Route path="learning/course/:courseId" element={<CourseDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
