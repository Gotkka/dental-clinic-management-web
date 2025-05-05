import React from 'react';
import { Calendar, User, Briefcase, CheckCircle } from 'lucide-react';

const AppointmentConfirmation = ({ appointmentData, handleReset }) => {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Lịch Hẹn Đã Được Xác Nhận!</h2>
      <p className="text-lg text-gray-600 mb-6">
        Lịch hẹn của bạn đã được đặt thành công.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8 text-left">
        <div className="flex items-start mb-4">
          <Calendar size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Ngày & Giờ</h3>
            <p className="text-gray-700">
              {appointmentData.date ? new Date(appointmentData.date).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ''}
              {appointmentData.time ? ` lúc ${appointmentData.time}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-start mb-4">
          <User size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Bác sĩ</h3>
            <p className="text-gray-700">
              {appointmentData.dentist?.full_name || ''}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <Briefcase size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Dịch vụ</h3>
            <p className="text-gray-700">
              {appointmentData.service?.name || ''}
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-8">
        Một email xác nhận đã được gửi đến 
        <span className="font-bold">
        {' ' + appointmentData.email}.
        </span>
        <br />Vui lòng đến trước 15 phút so với giờ hẹn.
      </p>

      <button
        onClick={handleReset}
        className="my-global-btn inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Đặt Lịch Hẹn Khác
      </button>
    </div>
  );
};

export default AppointmentConfirmation;