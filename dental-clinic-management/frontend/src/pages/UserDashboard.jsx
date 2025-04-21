// src/pages/Dashboard/UserDashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUser, FaTooth, FaFileAlt, FaBell, FaAngleRight } from 'react-icons/fa';
import Layout from '../components/layout/Layout';

const UserDashboard = () => {
  // Mock data - trong thực tế sẽ fetch từ API
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      service: 'Kiểm tra và vệ sinh răng',
      doctor: 'Bs. Nguyễn Văn An',
      date: '23/04/2025',
      time: '09:30',
      status: 'confirmed'
    },
    {
      id: 2,
      service: 'Điều trị sâu răng',
      doctor: 'Bs. Phạm Thị Bình',
      date: '05/05/2025',
      time: '14:00',
      status: 'pending'
    }
  ]);
  
//   const [pastAppointments, setPastAppointments] = useState([
    const [pastAppointments] = useState([
    {
      id: 3,
      service: 'Khám tổng quát',
      doctor: 'Bs. Nguyễn Văn An',
      date: '10/03/2025',
      time: '10:00',
      status: 'completed'
    },
    {
      id: 4,
      service: 'Tẩy trắng răng',
      doctor: 'Bs. Trần Minh Cường',
      date: '15/02/2025',
      time: '15:30',
      status: 'completed'
    }
  ]);
  
  const notifications = [
    {
      id: 1,
      message: 'Nhắc nhở: Bạn có lịch hẹn vào ngày 23/04/2025 lúc 09:30',
      date: '18/04/2025',
      read: false
    },
    {
      id: 2,
      message: 'Khuyến mãi: Giảm 20% cho dịch vụ tẩy trắng răng trong tháng 4',
      date: '15/04/2025',
      read: true
    }
  ];
  
  const cancelAppointment = (id) => {
    // Trong thực tế, gọi API để hủy lịch hẹn
    setUpcomingAppointments(
      upcomingAppointments.filter(appointment => appointment.id !== id)
    );
  };
  
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-6 mb-6 md:mb-0 md:mr-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-dental-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                NN
              </div>
              <h3 className="text-lg font-bold">Nguyễn Nam</h3>
              <p className="text-gray-500 text-sm">nguyennam@gmail.com</p>
            </div>
            
            <nav className="space-y-2 mt-8">
              <Link to="/dashboard" className="block w-full text-left px-4 py-2 bg-dental-light text-dental-blue font-medium rounded-md">
                Tổng quan
              </Link>
              <Link to="/appointments" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Lịch hẹn của tôi
              </Link>
              <Link to="/medical-records" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Hồ sơ y tế
              </Link>
              <Link to="/profile" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Thông tin cá nhân
              </Link>
              <Link to="/notifications" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Thông báo
              </Link>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-6">Tổng quan</h1>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Lịch hẹn sắp tới</h3>
                  <div className="bg-blue-100 rounded-full p-2">
                    <FaCalendarAlt className="text-dental-blue" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Lịch sử khám</h3>
                  <div className="bg-green-100 rounded-full p-2">
                    <FaFileAlt className="text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{pastAppointments.length}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Thông báo mới</h3>
                  <div className="bg-red-100 rounded-full p-2">
                    <FaBell className="text-red-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{notifications.filter(n => !n.read).length}</p>
              </div>
            </div>
            
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Lịch hẹn sắp tới</h2>
                <Link to="/appointments" className="text-dental-blue hover:hover:underline text-sm flex items-center">
                  Xem tất cả <FaAngleRight className="ml-1" />
                </Link>
              </div>

              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-500">Bạn chưa có lịch hẹn nào sắp tới.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {upcomingAppointments.map((appointment) => (
                    <li key={appointment.id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{appointment.service}</p>
                        <p className="text-sm text-gray-500">Bác sĩ: {appointment.doctor}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-1" /> {appointment.date} - <FaClock className="ml-2 mr-1" /> {appointment.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${getStatusBadgeClass(appointment.status)}`}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                        <button
                          onClick={() => cancelAppointment(appointment.id)}
                          className="block text-red-500 text-xs mt-2 hover:underline"
                        >
                          Hủy lịch
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Thông báo</h2>
                <Link to="/notifications" className="text-dental-blue hover:underline text-sm flex items-center">
                  Xem tất cả <FaAngleRight className="ml-1" />
                </Link>
              </div>

              {notifications.length === 0 ? (
                <p className="text-gray-500">Chưa có thông báo nào.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {notifications.map((notif) => (
                    <li key={notif.id} className="py-3">
                      <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-black font-medium'}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400">{notif.date}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default UserDashboard;