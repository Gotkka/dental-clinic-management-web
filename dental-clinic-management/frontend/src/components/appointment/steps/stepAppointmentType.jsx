import React from 'react';

const StepAppointmentType = ({ appointmentTypes, appointmentData, handleTypeSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Chọn Loại Cuộc Hẹn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointmentTypes.map((type) => (
          <div
            key={type.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              appointmentData.appointmentType?.id === type.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleTypeSelect(type)}
          >
            <h3 className="font-medium">{type.name}</h3>
            <p className="text-sm text-gray-600">Mô tả: {type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepAppointmentType;