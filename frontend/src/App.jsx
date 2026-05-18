import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindTrainer from './pages/FindTrainer';
import BecomeTrainer from './pages/BecomeTrainer';

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
