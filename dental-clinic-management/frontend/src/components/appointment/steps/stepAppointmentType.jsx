import React from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'react-feather';

const StepAppointmentType = ({ appointmentTypes = [], appointmentData = {}, onChange }) => {
  if (!appointmentTypes || !Array.isArray(appointmentTypes) || appointmentTypes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          Hiện chưa có loại cuộc hẹn khả dụng.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-center text-blue-600">Chọn Loại Cuộc Hẹn</h2>
        <p className="text-center text-gray-500 text-sm mt-1">Vui lòng chọn loại cuộc hẹn bạn muốn</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointmentTypes.map((type) => {
          const isSelected = appointmentData?.appointmentType?.id === type.id;

          return (
            <div
              key={type.id}
              role="button"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => onChange(type)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onChange(type);
              }}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md flex flex-col ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar size={24} className="text-blue-500" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-800">{type.name}</h3>
                  <p className="text-sm text-gray-600">Mô tả: {type.description || 'Không có mô tả'}</p>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

StepAppointmentType.propTypes = {
  appointmentTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ),
  appointmentData: PropTypes.shape({
    appointmentType: PropTypes.shape({
      id: PropTypes.number,
    }),
  }),
  onChange: PropTypes.func.isRequired,
};

StepAppointmentType.defaultProps = {
  appointmentTypes: [],
  appointmentData: {},
};

export default StepAppointmentType;