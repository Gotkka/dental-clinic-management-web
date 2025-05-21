import React, { useState } from 'react';
import {
  Calendar, CheckCircle, XCircle, AlertTriangle, FileText,
  MapPin, Phone, Mail, User, ArrowLeft, Clock, CreditCard,
  Stethoscope, CalendarCheck, Shield, Tag, MessageSquare
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { useAppointmentDetail } from '../../hooks/users/useAppointmentDetail';
import { useNavigate } from 'react-router-dom';

export default function AppointmentDetailPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const { appointment, loading, error } = useAppointmentDetail();
  const navigate = useNavigate();

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return { date: 'N/A', time: 'N/A', dayOfWeek: 'N/A' };

    const date = new Date(dateTimeStr);
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

    return {
      date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      dayOfWeek: dayNames[date.getDay()]
    };
  };

  const formatPrice = (price) => {
    if (!price || isNaN(parseFloat(price))) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0, // No decimals for whole VND amounts
    }).format(parseFloat(price));
  };

  const getStatusBadge = (status) => {
    const statusConfigs = {
      'Chờ xác nhận': {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock size={16} className="text-yellow-600 mr-2" />,
        text: 'Chờ xác nhận'
      },
      'Đã xác nhận': {
        color: 'bg-blue-100 text-blue-800',
        icon: <CheckCircle size={16} className="text-blue-600 mr-2" />,
        text: 'Đã xác nhận'
      },
      'Hoàn thành': {
        color: 'bg-emerald-100 text-emerald-800',
        icon: <CheckCircle size={16} className="text-emerald-600 mr-2" />,
        text: 'Hoàn thành'
      },
      'Hủy': {
        color: 'bg-rose-100 text-rose-800',
        icon: <XCircle size={16} className="text-rose-600 mr-2" />,
        text: 'Đã hủy'
      }
    };

    const config = statusConfigs[status] || statusConfigs['Chờ xác nhận'];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const CancelModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full sm:w-11/12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Xác nhận hủy lịch hẹn</h3>
        <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowCancelModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            aria-label="Hủy bỏ hành động hủy lịch hẹn"
          >
            Quay lại
          </button>
          <button
            onClick={() => {
              // Implement cancellation logic here
              setShowCancelModal(false);
              navigate('/appointments'); // Redirect after cancellation
            }}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
            aria-label="Xác nhận hủy lịch hẹn"
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );

  const RescheduleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full sm:w-11/12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Đổi lịch hẹn</h3>
        <p className="text-gray-600 mb-6">Vui lòng liên hệ phòng khám để đổi lịch hẹn hoặc chọn thời gian mới nếu có sẵn.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowRescheduleModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            aria-label="Hủy bỏ hành động đổi lịch hẹn"
          >
            Quay lại
          </button>
          <button
            onClick={() => {
              // Implement reschedule logic here
              setShowRescheduleModal(false);
              navigate('/appointments/new'); // Redirect to new appointment page
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            aria-label="Xác nhận đổi lịch hẹn"
          >
            Đặt lịch mới
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Đang tải thông tin lịch hẹn...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
          <div className="bg-rose-50 p-6 rounded-lg border border-rose-200 text-center">
            <p className="text-rose-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              aria-label="Thử lại tải thông tin"
            >
              Thử lại
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!appointment) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600 text-lg mb-4">Không tìm thấy thông tin lịch hẹn.</p>
            <button
              onClick={() => navigate('/appointments')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              aria-label="Quay lại danh sách lịch hẹn"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { date, time, dayOfWeek } = formatDateTime(appointment.appointment_time);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/appointments`)}
              className="my-global-btn text-white inline-flex items-center text-indigo-600 "
              aria-label="Quay lại danh sách lịch hẹn"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại danh sách lịch hẹn
            </button>
          </div>

          {/* Appointment Status and Title */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Chi tiết lịch hẹn</h1>
            {getStatusBadge(appointment.status || 'Chờ xác nhận')}
          </div>

          {/* Appointment Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{appointment.service?.name || 'N/A'}</h2>
                  <p className="text-gray-600 mt-2">{appointment.service?.description || 'Không có mô tả'}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-gray-900">
                    {formatPrice(appointment.service?.price) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Thời gian: {appointment.service?.duration || 'N/A'} phút
                  </div>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="p-6 sm:p-8 bg-indigo-50 border-b border-gray-200">
              <div className="flex items-center mb-3">
                <Calendar size={20} className="text-indigo-600 mr-3" />
                <span className="font-medium text-indigo-900">{dayOfWeek}, {date}</span>
              </div>
              <div className="flex items-center">
                <Clock size={20} className="text-indigo-600 mr-3" />
                <span className="font-medium text-indigo-900">{time}</span>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Stethoscope size={20} className="mr-3 text-gray-600" />
                Thông tin bác sĩ
              </h3>
              <div className="flex items-start">
                <img
                  src={`/assets/dentists/${appointment.dentist?.img_url || 'default.jpg'}`}
                  alt={appointment.dentist?.full_name || 'Bác sĩ'}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                  onError={(e) => { e.target.src = '/assets/dentists/default.jpg'; }}
                />
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">
                    {appointment.dentist?.full_name || 'N/A'}
                  </h4>
                  <p className="text-gray-600">
                    {appointment.dentist?.specialization?.name || 'Bác sĩ Nha khoa'}
                  </p>
                </div>
              </div>
            </div>

            {/* Clinic Info */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <MapPin size={20} className="mr-3 text-gray-600" />
                Địa điểm khám
              </h3>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {appointment.dentist?.branch_clinic?.name || 'N/A'}
                </h4>
                <p className="text-gray-600 mt-2 flex items-start">
                  <MapPin size={16} className="mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  {appointment.dentist?.branch_clinic?.address || 'N/A'}
                </p>
                <p className="text-gray-600 mt-2 flex items-center">
                  <Phone size={16} className="mr-3 text-gray-500" />
                  {appointment.dentist?.branch_clinic?.phone_number || 'N/A'}
                </p>
                <p className="text-gray-600 mt-2 flex items-center">
                  <Mail size={16} className="mr-3 text-gray-500" />
                  {appointment.dentist?.branch_clinic?.email || 'N/A'}
                </p>
              </div>
            </div>

            {/* Patient Notes */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <MessageSquare size={20} className="mr-3 text-gray-600" />
                Ghi chú của bạn
              </h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
                {appointment.reason || 'Không có ghi chú'}
              </p>
            </div>

            {/* Additional Info */}
            <div className="p-6 sm:p-8">
              <h3 className="font-medium text-gray-900 mb-4">Thông tin thêm</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Mã lịch hẹn</div>
                    <div className="font-medium text-gray-900">{appointment.id || 'APT12345'}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <CreditCard size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phương thức thanh toán</div>
                    <div className="font-medium text-gray-900">
                      {appointment.payment_method || 'Thanh toán tại phòng khám'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Tag size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Loại khám</div>
                    <div className="font-medium text-gray-900">
                      {appointment.appointment_type?.name || 'Khám lần đầu'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Shield size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Bảo hiểm</div>
                    <div className="font-medium text-gray-900">{appointment.insurance || 'Không áp dụng'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reminders and Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8">
            <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
              <AlertTriangle size={20} className="mr-3 text-blue-600" />
              Lưu ý quan trọng
            </h3>
            <ul className="space-y-3 text-blue-700 text-sm">
              <li className="flex items-start">
                <CheckCircle size={16} className="mr-3 mt-1 flex-shrink-0 text-blue-600" />
                Vui lòng đến trước giờ hẹn 15 phút để hoàn tất các thủ tục cần thiết.
              </li>
              <li className="flex items-start">
                <CheckCircle size={16} className="mr-3 mt-1 flex-shrink-0 text-blue-600" />
                Mang theo CMND/CCCD và thẻ bảo hiểm y tế (nếu có).
              </li>
              <li className="flex items-start">
                <CheckCircle size={16} className="mr-3 mt-1 flex-shrink-0 text-blue-600" />
                Nếu có kết quả xét nghiệm hoặc chẩn đoán trước đây, vui lòng mang theo để bác sĩ tham khảo.
              </li>
              <li className="flex items-start">
                <CheckCircle size={16} className="mr-3 mt-1 flex-shrink-0 text-blue-600" />
                Hủy lịch hẹn ít nhất 24 giờ trước để nhận lại phí đặt cọc (nếu có).
              </li>
            </ul>
          </div>
        </div>
        {showCancelModal && <CancelModal />}
        {showRescheduleModal && <RescheduleModal />}
      </div>
    </Layout>
  );
}