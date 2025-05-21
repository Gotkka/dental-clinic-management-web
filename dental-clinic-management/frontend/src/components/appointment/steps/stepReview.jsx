import React from 'react';
import PropTypes from 'prop-types';
import { MapPin, User, Briefcase, FileText, Calendar } from 'lucide-react';

const StepReview = ({ appointmentData = {}, specializations = [], branchClinics = [] }) => {
  console.log('StepReview - branchClinics:', branchClinics);
  console.log('StepReview - branchClinic:', appointmentData.branchClinic);

  const {
    branchClinic,
    dentist,
    service,
    appointmentType,
    firstName,
    lastName,
    email,
    phone,
    reason,
    time, // Sử dụng time trực tiếp vì nó là chuỗi ISO
  } = appointmentData;

  // Xử lý dữ liệu hiển thị
  const branchClinicName = branchClinic?.name || 'Không xác định';
  const specializationName = specializations.find((s) => s.id === dentist?.specialization_id)?.name || 'Không xác định';
  const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Không xác định';
  let appointmentTime = 'Không xác định';
  try {
    const parsedTime = new Date(time);
    if (!isNaN(parsedTime.getTime())) {
      appointmentTime = parsedTime.toLocaleString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  } catch (error) {
    console.warn('StepReview - Invalid time format:', time, error);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm max-w-2xl mx-auto">
      <div className="p-6 border-b border-gray-100 text-center">
        <h2 className="text-xl font-bold text-blue-600">Xem Lại Thông Tin Lịch Hẹn</h2>
        <p className="text-gray-600 text-sm mt-1">
          Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Thông tin chung */}
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-lg font-medium text-gray-700 flex items-center">
            <FileText size={20} className="mr-2 text-blue-600" />
            Thông Tin Chung
          </h3>
          <div className="mt-3 space-y-3 text-gray-600">
            <div className="flex items-start">
              <MapPin size={18} className="mr-3 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Chi Nhánh:</span> {branchClinicName}
              </div>
            </div>
            <div className="flex items-start">
              <Briefcase size={18} className="mr-3 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Dịch Vụ:</span> {service?.name || 'Không xác định'}
              </div>
            </div>
            <div className="flex items-start">
              <FileText size={18} className="mr-3 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Loại Lịch Hẹn:</span> {appointmentType?.name || 'Không xác định'}
              </div>
            </div>
          </div>
        </div>

        {/* Nha sĩ */}
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-lg font-medium text-gray-700 flex items-center">
            <User size={20} className="mr-2 text-blue-600" />
            Nha Sĩ
          </h3>
          <div className="mt-3 space-y-3 text-gray-600">
            <div className="flex items-start">
              <User size={18} className="mr-3 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Họ Tên:</span> {dentist?.full_name || 'Không xác định'}
              </div>
            </div>
            <div className="flex items-start">
              <Briefcase size={18} className="mr-3 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Chuyên Môn:</span> {specializationName}
              </div>
            </div>
          </div>
        </div>

        {/* Bệnh nhân */}
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-lg font-medium text-gray-700 flex items-center">
            <User size={20} className="mr-2 text-blue-600" />
            Bệnh Nhân
          </h3>
          <div className="mt-3 space-y-3 text-gray-600">
            <div className="flex items-start">
              <User size={18} className="mr-3 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Họ Tên:</span> {fullName}
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-blue-600 mt-1 flex-shrink-0">✉️</span>
              <div>
                <span className="font-semibold">Email:</span> {email || 'Không xác định'}
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-blue-600 mt-1 flex-shrink-0">📞</span>
              <div>
                <span className="font-semibold">Số Điện Thoại:</span> {phone || 'Không xác định'}
              </div>
            </div>
            <div className="flex items-start">
              <FileText size={18} className="mr-3 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Lý Do:</span> {reason || 'Không có'}
              </div>
            </div>
          </div>
        </div>

        {/* Thời gian */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 flex items-center">
            <Calendar size={20} className="mr-2 text-blue-600" />
            Thời Gian
          </h3>
          <div className="mt-3 text-gray-600">
            <div className="flex items-start">
              <Calendar size={18} className="mr-3 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Thời Gian:</span> {appointmentTime}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StepReview.propTypes = {
  appointmentData: PropTypes.shape({
    branchClinic: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    dentist: PropTypes.shape({
      id: PropTypes.number,
      full_name: PropTypes.string,
      specialization_id: PropTypes.number,
    }),
    service: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    appointmentType: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    reason: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
  }),
  specializations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  branchClinics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
};

StepReview.defaultProps = {
  appointmentData: {},
  specializations: [],
  branchClinics: [],
};

export default StepReview;