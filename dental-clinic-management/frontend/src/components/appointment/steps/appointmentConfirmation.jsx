import PropTypes from 'prop-types';
import { Calendar, User, Briefcase, CheckCircle, MapPin, FileText } from 'lucide-react';

const AppointmentConfirmation = ({ appointmentData, handleReset, specializations = [] }) => {
  console.log('AppointmentConfirmation - appointmentData:', appointmentData);

  if (!appointmentData) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-sm">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lỗi Xác Nhận Lịch Hẹn</h2>
        <p className="text-lg text-gray-600 mb-6">
          Dữ liệu lịch hẹn không khả dụng. Vui lòng thử lại.
        </p>
        <button
          onClick={handleReset}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Đặt Lịch Hẹn Khác
        </button>
      </div>
    );
  }

  const {
    patientId,
    dentist,
    service,
    appointmentType,
    branchClinic,
    time, // Sử dụng time trực tiếp vì nó là chuỗi ISO
    email,
    firstName,
    lastName,
  } = appointmentData;

  const isValid = () => {
    console.log('isValid - Checking appointmentData:', {
      patientId,
      dentistId: dentist?.id,
      serviceId: service?.id,
      appointmentTypeId: appointmentType?.id,
      branchClinicId: branchClinic?.id,
      time,
    });

    if (!patientId || isNaN(patientId)) {
      console.warn('isValid - Invalid patientId:', patientId);
      return false;
    }
    if (!dentist?.id || isNaN(dentist.id)) {
      console.warn('isValid - Invalid dentist.id:', dentist?.id);
      return false;
    }
    if (!service?.id || isNaN(service.id)) {
      console.warn('isValid - Invalid service.id:', service?.id);
      return false;
    }
    if (!appointmentType?.id || isNaN(appointmentType.id)) {
      console.warn('isValid - Invalid appointmentType.id:', appointmentType?.id);
      return false;
    }
    if (!branchClinic?.id || isNaN(branchClinic.id)) {
      console.warn('isValid - Invalid branchClinic.id:', branchClinic?.id);
      return false;
    }
    if (!time) {
      console.warn('isValid - Missing time:', time);
      return false;
    }
    const appointmentTime = new Date(time);
    if (isNaN(appointmentTime.getTime())) {
      console.warn('isValid - Invalid appointmentTime:', time);
      return false;
    }
    return true;
  };

  if (!isValid()) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-sm">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lỗi Xác Nhận Lịch Hẹn</h2>
        <p className="text-lg text-gray-600 mb-6">
          Vui lòng điền đầy đủ thông tin: bệnh nhân, bác sĩ, dịch vụ, loại lịch hẹn, chi nhánh và thời gian.
        </p>
        <button
          onClick={handleReset}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Đặt Lịch Hẹn Khác
        </button>
      </div>
    );
  }

  const appointmentTime = new Date(time);
  const serviceSpecializationName = service?.specialization_id
    ? specializations.find((s) => s.id === service.specialization_id)?.name || 'Không xác định'
    : 'Không xác định';

  return (
    <div className="text-center py-8 bg-white rounded-lg shadow-sm">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Lịch Hẹn Đã Được Tạo!</h2>
      <p className="text-lg text-gray-600 mb-6">
        Lịch hẹn của bạn đã được tạo thành công.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8 text-left">
        <div className="flex items-start mb-4">
          <MapPin size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Chi Nhánh</h3>
            <p className="text-gray-700">{branchClinic?.name || 'Chưa chọn chi nhánh'}</p>
          </div>
        </div>
        <div className="flex items-start mb-4">
          <Calendar size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Ngày & Giờ</h3>
            <p className="text-gray-700">
              {appointmentTime.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })} lúc{' '}
              {appointmentTime.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-start mb-4">
          <User size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Bệnh Nhân</h3>
            <p className="text-gray-700">{firstName} {lastName}</p>
            <p className="text-sm text-gray-600">{email || 'Chưa cung cấp email'}</p>
          </div>
        </div>
        <div className="flex items-start mb-4">
          <User size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Bác sĩ</h3>
            <p className="text-gray-700">{dentist?.full_name || 'Chưa chọn bác sĩ'}</p>
          </div>
        </div>
        <div className="flex items-start mb-4">
          <Briefcase size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Dịch vụ</h3>
            <p className="text-gray-700">{service?.name || 'Chưa chọn dịch vụ'}</p>
            <p className="text-sm text-gray-600">{serviceSpecializationName}</p>
            <p className="text-sm text-gray-600">{service?.duration ? `${service.duration} phút` : ''}</p>
            <p className="text-sm font-medium text-blue-600">
              {service?.price
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    service.price
                  )
                : ''}
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <FileText size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Loại lịch hẹn</h3>
            <p className="text-gray-700">{appointmentType?.name || 'Chưa chọn loại lịch hẹn'}</p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-8">
        Một email xác nhận đã được gửi đến
        <span className="font-bold"> {email || 'email không xác định'}</span>.
        <br />
        Vui lòng đến trước 15 phút so với giờ hẹn.
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleReset}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Đặt Lịch Hẹn Khác
        </button>
      </div>
    </div>
  );
};

AppointmentConfirmation.propTypes = {
  appointmentData: PropTypes.shape({
    patientId: PropTypes.number.isRequired,
    dentist: PropTypes.shape({
      id: PropTypes.number.isRequired,
      full_name: PropTypes.string,
    }),
    service: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      duration: PropTypes.number,
      price: PropTypes.number,
      specialization_id: PropTypes.number,
    }),
    appointmentType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
    }),
    branchClinic: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
    }),
    date: PropTypes.string,
    time: PropTypes.string.isRequired,
    email: PropTypes.string,
    patientInformationId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  handleReset: PropTypes.func.isRequired,
  specializations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

AppointmentConfirmation.defaultProps = {
  specializations: [],
};

export default AppointmentConfirmation;