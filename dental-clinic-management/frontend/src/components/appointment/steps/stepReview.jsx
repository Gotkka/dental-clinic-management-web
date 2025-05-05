import React from 'react';
import { Calendar, User, FileText, Briefcase } from 'lucide-react';

const StepReview = ({ appointmentData, specialization }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Xem Lại Lịch Hẹn</h2>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
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
            <p className="text-sm text-gray-600">
              {
                specialization.find(
                  (s) => s.id === appointmentData.dentist?.specialization_id
                )?.name || ''
              }
            </p>
          </div>
        </div>

        <div className="flex items-start mb-4">
          <Briefcase size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Dịch vụ</h3>
            <p className="text-gray-700">
              {appointmentData.service?.name || ''}
            </p>
            <p className="text-sm text-gray-600">
              {appointmentData.service?.duration || ''} phút
            </p>
            <p className="text-sm font-medium text-blue-600">
              {appointmentData.service?.price
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appointmentData.service.price)
                : ''}
            </p>
          </div>
        </div>

        <div className="flex items-start mb-4">
          <FileText size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Loại Cuộc Hẹn</h3>
            <p className="text-gray-700">
              {appointmentData.appointmentType?.name || ''}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <User size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Thông Tin Bệnh Nhân</h3>
            <p className="text-gray-700">{appointmentData.firstName} {appointmentData.lastName}</p>
            <p className="text-sm text-gray-600">{appointmentData.email}</p>
            <p className="text-sm text-gray-600">{appointmentData.phone}</p>
            {appointmentData.isNewPatient && (
              <p className="text-sm text-blue-600 mt-1">Bệnh Nhân Mới</p>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-6">
        <p>
          Bằng cách xác nhận lịch hẹn này, bạn đồng ý với{' '}
          <a href="#" className="black-text-link hover:underline">Điều khoản Dịch vụ</a> và{' '}
          <a href="#" className="black-text-link hover:underline">Chính sách Bảo mật</a>.
        </p>
      </div>
    </div>
  );
};

export default StepReview;