import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AppointmentPage from './pages/BookAppointmentPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';  
import Services from './pages/Services'; 
import Dentists from './pages/Dentists';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Appointments from './pages/Appointments'; // Assuming you have an Appointment page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bookAppointment" element={<AppointmentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/dentists" element={<Dentists />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointments" element={<Appointments />} />
        
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
