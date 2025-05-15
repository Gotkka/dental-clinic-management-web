import React from 'react';

const StepDateTime = ({ availableDates, timeSlots, appointmentData, handleDateSelect, handleTimeSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Chọn Ngày & Giờ</h2>
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Ngày Khả dụng</h3>
        <div className="flex overflow-x-auto pb-4 space-x-2">
          {availableDates.map((dateObj) => (
            <div
              key={dateObj.date}
              className={`flex-shrink-0 w-20 h-24 border rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                appointmentData.date === dateObj.date
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleDateSelect(dateObj.date)}
            >
              <p className="text-sm text-gray-600">{dateObj.dayName}</p>
              <p className="text-lg font-bold">{dateObj.dayNumber}</p>
              <p className="text-sm text-gray-600">{dateObj.month}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Khung Giờ Khả dụng</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {timeSlots.map((time) => (
            <div
              key={time}
              className={`border rounded-lg py-2 px-3 text-center cursor-pointer transition-all ${
                appointmentData.time === time
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleTimeSelect(time)}
            >
              <p className="text-sm">{time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepDateTime;