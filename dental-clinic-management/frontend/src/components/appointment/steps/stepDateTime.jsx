import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'react-feather';

const generateTimeSlots = (duration, startHour = 8, endHour = 17) => {
  const slots = [];
  const startMinutes = startHour * 60;
  const endMinutes = endHour * 60;
  for (let minutes = startMinutes; minutes < endMinutes; minutes += duration) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    slots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
  }
  return slots;
};

const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short' });
    const dayNumber = date.getDate();
    const month = date.toLocaleDateString('vi-VN', { month: 'short' });
    dates.push({ date: dateString, dayName, dayNumber, month });
  }
  return dates;
};

const StepDateTime = ({ appointmentData = {}, existingAppointments = [], onChange }) => {
  console.log('StepDateTime Props:', {
    appointmentData,
    existingAppointments,
    selectedDentist: appointmentData?.dentist,
  });

  const duration = appointmentData?.service?.duration || 30;
  const timeSlots = useMemo(() => generateTimeSlots(duration), [duration]);
  const availableDates = generateAvailableDates();

  if (!appointmentData || !appointmentData?.service || !appointmentData?.dentist) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-red-500">
        <p className="flex flex-col items-center">
          <svg
            className="w-8 h-8 mb-2"
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
          Lỗi: Vui lòng chọn dịch vụ và nha sĩ trước.
        </p>
      </div>
    );
  }

  const { date: selectedDate } = appointmentData;

  const isTimeSlotAvailable = (selectedDateTime) => {
    return !existingAppointments.some((appointment) => {
      const apptDateTime = new Date(appointment.appointment_time).toISOString();
      const selectedDateTimeISO = new Date(selectedDateTime).toISOString();
      return (
        apptDateTime === selectedDateTimeISO &&
        appointment.dentist_id === appointmentData?.dentist?.id &&
        appointment.status === 'Đang chờ'
      );
    });
  };

  const handleDateSelect = (date) => {
    onChange('date', date);
    onChange('time', '');
  };

  const handleTimeSelect = (time) => {
    const selectedDateTime = `${selectedDate}T${time}:00`;
    if (isTimeSlotAvailable(selectedDateTime)) {
      onChange('time', time);
    } else {
      alert('Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-center text-blue-600">Chọn Ngày & Giờ</h2>
        <p className="text-center text-gray-500 text-sm mt-1">
          Vui lòng chọn ngày và khung giờ phù hợp
        </p>
      </div>
      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Calendar size={20} className="mr-2 text-blue-500" />
            Ngày Khả Dụng
          </h3>
          {availableDates.length === 0 ? (
            <p className="text-center text-gray-500">Không có ngày khả dụng.</p>
          ) : (
            <div className="flex overflow-x-auto pb-4 space-x-2">
              {availableDates.map((dateObj) => (
                <div
                  key={dateObj.date}
                  className={`flex-shrink-0 w-20 h-24 border rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                    selectedDate === dateObj.date
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => handleDateSelect(dateObj.date)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleDateSelect(dateObj.date);
                  }}
                >
                  <p className="text-sm text-gray-600">{dateObj.dayName}</p>
                  <p className="text-lg font-bold">{dateObj.dayNumber}</p>
                  <p className="text-sm text-gray-600">{dateObj.month}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Calendar size={20} className="mr-2 text-blue-500" />
            Khung Giờ Khả Dụng
          </h3>
          {!selectedDate ? (
            <p className="text-center text-gray-500">Vui lòng chọn ngày trước.</p>
          ) : timeSlots.length === 0 ? (
            <p className="text-center text-gray-500">Không có khung giờ khả dụng.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((time) => {
                const selectedDateTime = `${selectedDate}T${time}:00`;
                const isAvailable = isTimeSlotAvailable(selectedDateTime);
                return (
                  <button
                    key={time}
                    disabled={!isAvailable}
                    onClick={() => handleTimeSelect(time)}
                    className={`px-4 py-2 rounded-lg ${
                      isAvailable
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

StepDateTime.propTypes = {
  appointmentData: PropTypes.shape({
    dentist: PropTypes.shape({
      id: PropTypes.number,
    }),
    service: PropTypes.shape({
      duration: PropTypes.number,
    }),
    date: PropTypes.string,
    time: PropTypes.string,
  }),
  existingAppointments: PropTypes.arrayOf(
    PropTypes.shape({
      appointment_time: PropTypes.string.isRequired,
      dentist_id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func.isRequired,
};

StepDateTime.defaultProps = {
  appointmentData: {},
  existingAppointments: [],
};

export default StepDateTime;