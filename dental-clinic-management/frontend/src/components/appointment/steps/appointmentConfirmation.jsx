import { Calendar, User, Briefcase, CheckCircle } from 'lucide-react';

const AppointmentConfirmation = ({ appointmentData, handleReset }) => {
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

  const { date, time, dentist, service, email } = appointmentData;

  return (
    <div className="text-center py-8 bg-white rounded-lg shadow-sm">
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
              {date
                ? new Date(date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Chưa chọn ngày'}
              {time ? ` lúc ${time}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-start mb-4">
          <User size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Bác sĩ</h3>
            <p className="text-gray-700">{dentist?.full_name || 'Chưa chọn bác sĩ'}</p>
          </div>
        </div>

        <div className="flex items-start">
          <Briefcase size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Dịch vụ</h3>
            <p className="text-gray-700">{service?.name || 'Chưa chọn dịch vụ'}</p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-8">
        Một email xác nhận đã được gửi đến
        <span className="font-bold"> {email || 'email không xác định'}</span>.
        <br />
        Vui lòng đến trước 15 phút so với giờ hẹn.
      </p>

      <button
        onClick={handleReset}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Đặt Lịch Hẹn Khác
      </button>
    </div>
  );
};

export default AppointmentConfirmation;