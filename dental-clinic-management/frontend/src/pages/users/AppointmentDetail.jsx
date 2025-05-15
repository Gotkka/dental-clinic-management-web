import React, { useState } from 'react';
import {
  Calendar, CheckCircle, XCircle, AlertTriangle, FileText,
  MapPin, Phone, Mail, User, ArrowLeft, Clock, CreditCard,
  Stethoscope, CalendarCheck, Shield, Tag, MessageSquare
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { useAppointmentDetail } from '../../hooks/useAppointmentDetail';

export default function AppointmentDetailPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [setShowRescheduleModal] = useState(false);

  const { appointment, loading, error } = useAppointmentDetail();

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

  const CancelModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Xác nhận hủy lịch hẹn</h3>
        <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn hủy lịch hẹn này? Thao tác này không thể hoàn tác.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowCancelModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Quay lại
          </button>
          <button
            onClick={() => {
              // Xử lý logic hủy lịch hẹn
              setShowCancelModal(false);
              // Hiển thị thông báo thành công hoặc chuyển hướng
            }}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const statusConfigs = {
      confirmed: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle size={16} className="text-green-600 mr-1" />,
        text: "Đã xác nhận"
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock size={16} className="text-yellow-600 mr-1" />,
        text: "Đang chờ xác nhận"
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle size={16} className="text-red-600 mr-1" />,
        text: "Đã hủy"
      },
      completed: {
        color: "bg-blue-100 text-blue-800",
        icon: <CheckCircle size={16} className="text-blue-600 mr-1" />,
        text: "Đã hoàn thành"
      }
    };

    const config = statusConfigs[status] || statusConfigs.pending;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 py-8 flex items-center justify-center">
          <p className="text-gray-600">Đang tải thông tin lịch hẹn...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 py-8 flex items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!appointment) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 py-8 flex items-center justify-center">
          <p className="text-gray-600">Không tìm thấy thông tin lịch hẹn.</p>
        </div>
      </Layout>
    );
  }

  const { date, time, dayOfWeek } = formatDateTime(appointment.appointment_time);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header with back button */}
          <div className="mb-6">
            <button
              onClick={() => console.log('Navigate back')}
              className="inline-flex my-global-btn text-white items-center font-medium"
            >
              <ArrowLeft size={18} className="mr-1" /> Quay lại danh sách lịch hẹn
            </button>
          </div>

          {/* Appointment Status */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết lịch hẹn</h1>
            <div>
              {getStatusBadge(appointment.status || "pending")}
            </div>
          </div>

          {/* Appointment Summary Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{appointment.service?.name}</h2>
                  <p className="text-gray-600 mt-1">{appointment.service?.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-gray-900">{appointment.service?.price}</div>
                  <div className="text-sm text-gray-500">Thời gian: {appointment.service?.duration}</div>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="p-6 bg-indigo-50 border-b border-gray-200">
              <div className="flex items-center mb-2">
                <Calendar size={20} className="text-indigo-600 mr-2" />
                <span className="font-medium text-indigo-900">{dayOfWeek}, {date}</span>
              </div>
              <div className="flex items-center">
                <Clock size={20} className="text-indigo-600 mr-2" />
                <span className="font-medium text-indigo-900">{time}</span>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Stethoscope size={18} className="mr-2 text-gray-600" />
                Thông tin bác sĩ
              </h3>
              <div className="flex items-start">
                <img
                  src={`/assets/dentists/${appointment.dentist?.img_url}`}
                  alt={appointment.dentist?.full_name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-lg">{appointment.dentist?.full_name}</h4>
                  <p className="text-gray-600">{appointment.dentist?.specialization?.name}</p>
                </div>
              </div>
            </div>

            {/* Clinic Info */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <MapPin size={18} className="mr-2 text-gray-600" />
                Địa điểm khám
              </h3>
              <div>
                <h4 className="font-semibold">{appointment.dentist?.branch_clinic?.name || "N/A"}</h4>
                <p className="text-gray-600 mt-1 flex items-start">
                  <MapPin size={16} className="mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                  {appointment.dentist?.branch_clinic?.address || "N/A"}
                </p>
                <p className="text-gray-600 mt-2 flex items-center">
                  <Phone size={16} className="mr-2 text-gray-500" />
                  {appointment.dentist?.branch_clinic?.phone_number || "N/A"}
                </p>
                <p className="text-gray-600 mt-2 flex items-center">
                  <Mail size={16} className="mr-2 text-gray-500" />
                  {appointment.dentist?.branch_clinic?.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Patient Notes */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <MessageSquare size={18} className="mr-2 text-gray-600" />
                Ghi chú của bạn
              </h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                {appointment.reason || "Không có ghi chú"}
              </p>
            </div>

            {/* Additional Info */}
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-3">Thông tin thêm</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Mã lịch hẹn</div>
                    <div className="font-medium">{appointment.id || "APT12345"}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <CreditCard size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phương thức thanh toán</div>
                    <div className="font-medium">{appointment.payment_method || "Thanh toán tại phòng khám"}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Tag size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Loại khám</div>
                    <div className="font-medium">{appointment.appointment_type?.name || "Khám lần đầu"}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Shield size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Bảo hiểm</div>
                    <div className="font-medium">{appointment.insurance || "Không áp dụng"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setShowRescheduleModal(true)}
              className="px-4 py-2 bg-indigo-600 my-global-btn text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
            >
              <CalendarCheck size={18} className="mr-2" /> Đổi lịch hẹn
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 bg-rose-600 my-global-btn text-white rounded-lg hover:bg-rose-700 transition flex items-center"
            >
              <XCircle size={18} className="mr-2" /> Hủy lịch hẹn
            </button>
            <button
              onClick={() => {/* Handle print logic */ }}
              className="px-4 py-2 border border-gray-300 text-white my-global-btn rounded-lg hover:bg-gray-50 transition flex items-center"
            >
              <FileText size={18} className="mr-2" /> In thông tin
            </button>
          </div>

          {/* Reminders and Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-red-500 mb-3 flex items-center">
              <AlertTriangle size={20} className="mr-2" /> Lưu ý quan trọng
            </h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <CheckCircle size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span>Vui lòng đến trước giờ hẹn 15 phút để hoàn tất các thủ tục cần thiết.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span>Mang theo CMND/CCCD và thẻ bảo hiểm y tế (nếu có).</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span>Nếu có kết quả xét nghiệm hoặc chẩn đoán trước đây, vui lòng mang theo để bác sĩ tham khảo.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span>Hủy lịch hẹn ít nhất 24 giờ trước để nhận lại phí đặt cọc (nếu có).</span>
              </li>
            </ul>
          </div>
        </div>
        {showCancelModal && <CancelModal />}
      </div>
    </Layout>
  );
}