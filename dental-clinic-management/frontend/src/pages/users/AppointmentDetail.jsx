import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, AlertTriangle, FileText, 
  MapPin, Phone, Mail, User, ArrowLeft, Clock, CreditCard, 
  Stethoscope, CalendarCheck, Shield, Tag, MessageSquare } from 'lucide-react';

// Trang Chi Tiết Lịch Hẹn
export default function AppointmentDetailPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [setShowRescheduleModal] = useState(false);

  // Mock data
  const appointment = {
    id: "APT12345",
    status: "confirmed",
    appointment_time: "2025-05-10T14:30:00",
    patient_notes: "Tôi bị đau đầu và sốt nhẹ trong 2 ngày qua",
    payment_method: "Thanh toán tại phòng khám",
    visit_type: "Khám lần đầu",
    insurance: "Bảo hiểm Bảo Việt"
  };

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

  // Modal component for cancellation confirmation
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
              // Handle cancellation logic here
              setShowCancelModal(false);
              // Show success notification or redirect
            }} 
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );

  const { date, time, dayOfWeek } = formatDateTime(appointment.appointment_time);

  // Mock data for demonstration - in a real app, this would come from the API
  const mockDoctor = {
    id: 1,
    name: "BS. Nguyễn Văn A",
    specialty: "Nội Khoa Tổng Quát",
    avatar: "/api/placeholder/150/150",
    experience: "15 năm kinh nghiệm",
    qualifications: "Tiến sĩ Y khoa - Đại học Y Hà Nội",
    rating: 4.9
  };

  const mockService = {
    id: 1,
    name: "Khám tổng quát",
    description: "Khám sức khỏe tổng quát định kỳ",
    duration: "30 phút",
    price: "500.000 VNĐ"
  };

  const mockClinic = {
    name: "Phòng khám Đa khoa Quốc tế",
    address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
    phoneNumber: "028 1234 5678",
    email: "info@phongkhamdakhoa.vn"
  };

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

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with back button */}
        <div className="mb-6">
          <button 
            onClick={() => console.log('Navigate back')} 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
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
                <h2 className="text-xl font-semibold text-gray-900">{mockService.name}</h2>
                <p className="text-gray-600 mt-1">{mockService.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold text-gray-900">{mockService.price}</div>
                <div className="text-sm text-gray-500">Thời gian: {mockService.duration}</div>
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
                src={mockDoctor.avatar} 
                alt={mockDoctor.name} 
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold text-lg">{mockDoctor.name}</h4>
                <p className="text-gray-600">{mockDoctor.specialty}</p>
                <p className="text-gray-600 text-sm mt-1">{mockDoctor.qualifications}</p>
                <p className="text-gray-600 text-sm">{mockDoctor.experience}</p>
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
              <h4 className="font-semibold">{mockClinic.name}</h4>
              <p className="text-gray-600 mt-1 flex items-start">
                <MapPin size={16} className="mr-2 text-gray-500 mt-0.5 flex-shrink-0" /> 
                {mockClinic.address}
              </p>
              <p className="text-gray-600 mt-2 flex items-center">
                <Phone size={16} className="mr-2 text-gray-500" /> 
                {mockClinic.phoneNumber}
              </p>
              <p className="text-gray-600 mt-2 flex items-center">
                <Mail size={16} className="mr-2 text-gray-500" /> 
                {mockClinic.email}
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
              {appointment.patient_notes || "Không có ghi chú"}
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
                  <div className="font-medium">{appointment.visit_type || "Khám lần đầu"}</div>
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
          >
            <CalendarCheck size={18} className="mr-2" /> Đổi lịch hẹn
          </button>
          <button 
            onClick={() => setShowCancelModal(true)} 
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition flex items-center"
          >
            <XCircle size={18} className="mr-2" /> Hủy lịch hẹn
          </button>
          <button 
            onClick={() => {/* Handle print logic */}}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
          >
            <FileText size={18} className="mr-2" /> In thông tin
          </button>
        </div>

        {/* Reminders and Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-blue-800 mb-3 flex items-center">
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

        {/* Dịch vụ bổ sung */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Dịch vụ bổ sung</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50 transition cursor-pointer">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Gói xét nghiệm cơ bản</h4>
                  <p className="text-gray-600 text-sm mt-1">Xét nghiệm máu, nước tiểu, điện giải đồ...</p>
                  <p className="text-indigo-600 font-medium mt-2">300.000 VNĐ</p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50 transition cursor-pointer">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <path d="M2 8h20M2 8v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Siêu âm tổng quát</h4>
                  <p className="text-gray-600 text-sm mt-1">Siêu âm ổ bụng, tiêu hóa, tim mạch...</p>
                  <p className="text-indigo-600 font-medium mt-2">400.000 VNĐ</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <button className="text-indigo-600 font-medium hover:text-indigo-800 transition flex items-center">
              Xem thêm dịch vụ
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

      </div>
      
      {showCancelModal && <CancelModal />}
    </div>
  );
}