import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/users/HomePage';
import AppointmentPage from '../pages/users/BookAppointmentPage';
import LoginPage from '../pages/users/LoginPage';
import RegisterPage from '../pages/users/RegisterPage';
import UserProfile from '../pages/users/UserProfile';
import Services from '../pages/users/Services';
import Dentists from '../pages/users/Dentists';
import Blog from '../pages/users/Blog';
import Contact from '../pages/users/Contact';
import Appointment from '../pages/users/Appointments'
import AppointmentDetail from '../pages/users/AppointmentDetail';

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/bookAppointment" element={<AppointmentPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/userProfile" element={<UserProfile />} />
      <Route path="/services" element={<Services />} />
      <Route path="/dentists" element={<Dentists />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/appointments" element={<Appointment />} />
      <Route path="/appointments/:id" element={<AppointmentDetail />} />
    </Routes>
  );
}

export default UserRoutes;
