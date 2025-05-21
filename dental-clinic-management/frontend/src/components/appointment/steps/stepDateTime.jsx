import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const StepDateTime = ({ availableDates, timeSlots, appointmentData, handleDateSelect }) => {
  const handleDateChange = (date) => {
    handleDateSelect('date', date);
  };

  const handleTimeChange = (time) => {
    handleDateSelect('time', time);
  };

  const dates = availableDates() || [];
  const slots = timeSlots() || [];

  // Group dates by month for better organization
  // const groupedDates = dates.reduce((acc, date) => {
  //   const monthYear = new Date(date).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  //   if (!acc[monthYear]) {
  //     acc[monthYear] = [];
  //   }
  //   acc[monthYear].push(date);
  //   return acc;
  // }, {});

  return (
    <div className="space-y-10 p-3 max-w-md mx-auto bg-white rounded-lg shadow-md">
      {/* Date Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Calendar className="text-blue-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Chọn ngày</h3>
        </div>
        
        {dates.length > 0 ? (
          <div className="grid grid-cols-4 gap-1">
            {dates.map((date) => {
              const dateObj = new Date(date);
              const isSelected = appointmentData.date === date;
              const dayName = dateObj.toLocaleDateString('vi-VN', { weekday: 'short' });
              const dayNum = dateObj.getDate();
              const month = dateObj.toLocaleDateString('vi-VN', { month: 'short' });
              
              return (
                <button
                  key={date}
                  onClick={() => handleDateChange(date)}
                  className={`my-global-btn text-white flex flex-col items-center justify-center p-2 rounded-lg transition-colors
                    ${isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'border border-gray-300 hover:border-blue-400 text-gray-700 hover:bg-blue-50'}`}
                >
                  <span className="text-xs font-medium">{dayName}</span>
                  <span className="text-lg font-bold">{dayNum}</span>
                  <span className="text-xs">{month}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center">Không có ngày nào khả dụng</p>
        )}
      </div>

      {/* Time Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Clock className="text-blue-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Chọn giờ</h3>
        </div>
        
        {appointmentData.date && appointmentData.service?.id ? (
          slots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const isSelected = appointmentData.time === slot.start;
                
                return (
                  <button
                    key={slot.start}
                    onClick={() => handleTimeChange(slot.start)}
                    className={`my-global-btn text-white py-2 px-3 rounded-lg transition-colors text-center
                      ${isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'border border-gray-300 hover:border-blue-400 text-gray-700 hover:bg-blue-50'}`}
                  >
                    {slot.display}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center">Không có khung giờ nào khả dụng</p>
          )
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-500">Vui lòng chọn dịch vụ và ngày trước</p>
          </div>
        )}
      </div>

      {/* Selected Summary */}
      {appointmentData.date && appointmentData.time && (
        <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-blue-800 font-medium text-center">
            Đã chọn: {new Date(appointmentData.date).toLocaleDateString('vi-VN')} lúc {
              slots.find(s => s.start === appointmentData.time)?.display || appointmentData.time
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default StepDateTime;