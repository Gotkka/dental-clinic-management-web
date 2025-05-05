import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaFileAlt, FaBell, FaAngleRight } from 'react-icons/fa';
import axios from 'axios';


const UserProfile = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  // const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Lấy lịch hẹn sắp tới
    axios.get('http://localhost:8080/dental-clinic/appoinments/upcoming')
      .then(res => setUpcomingAppointments(res.data))
      .catch(err => console.error(err));

    // Lấy lịch sử
    axios.get('http://localhost:8080/dental-clinic/appointments/past')
      .then(res => setPastAppointments(res.data))
      .catch(err => console.error(err));


  }, []);

  return (
    <LayoutUserProfile>
      <h1 className="text-2xl font-bold mb-6">Tổng quan</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* card 1 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Lịch hẹn sắp tới</h3>
            <div className="bg-blue-100 rounded-full p-2">
              <FaCalendarAlt className="text-dental-blue" />
            </div>
          </div>
          <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
        </div>
        {/* card 2 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Lịch sử khám</h3>
            <div className="bg-green-100 rounded-full p-2">
              <FaFileAlt className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{pastAppointments.length}</p>
        </div>
      </div>

      {/* Upcoming appointments */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Lịch hẹn sắp tới</h2>
          <Link to="/appointments" className="text-dental-blue hover:underline text-sm flex items-center">
            Xem tất cả <FaAngleRight className="ml-1" />
          </Link>
        </div>
        {/* appointments */}
        {/* ... */}
      </div>
    </LayoutUserProfile>
  );
};

export default UserProfile;
