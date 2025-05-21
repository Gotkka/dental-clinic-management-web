import React from 'react';
import PropTypes from 'prop-types';
import { User } from 'react-feather';

const StepDentist = ({
  dentists = [],
  specializations = [],
  isLoading = false,
  error = null,
  appointmentData = {},
  onChange,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center">
        <div className="animate-pulse text-blue-500 flex flex-col items-center">
          <svg className="w-8 h-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2">Đang tải danh sách bác sĩ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-red-500">
        <p className="flex flex-col items-center">
          <svg className="w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Lỗi tải danh sách bác sĩ: {error?.message || 'Đã xảy ra lỗi, vui lòng thử lại.'}
        </p>
      </div>
    );
  }

  // Filter dentists by selected branch clinic and service's specialization
  const selectedBranchId = appointmentData.branchClinic?.id;
  const selectedServiceSpecializationId = appointmentData.service?.specialization_id;

  const filteredDentists = selectedBranchId && selectedServiceSpecializationId
    ? dentists.filter(
        (dentist) =>
          dentist.branch_clinic_id === selectedBranchId &&
          dentist.specialization_id === selectedServiceSpecializationId
      )
    : [];

  if (!filteredDentists.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
        <p className="flex flex-col items-center">
          <svg className="w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          Hiện chưa có bác sĩ khả dụng tại chi nhánh và chuyên khoa đã chọn.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-center text-blue-600">Chọn Bác Sĩ</h2>
        <p className="text-center text-gray-500 text-sm mt-1">Vui lòng chọn bác sĩ bạn muốn đặt hẹn</p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDentists.map((dentist) => {
          const spe = specializations.find((s) => s.id === dentist.specialization_id);
          const isSelected = appointmentData?.dentist?.id === dentist.id;
          return (
            <div
              key={dentist.id}
              onClick={() => onChange('dentist', dentist)}
              className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col relative
                ${isSelected
                  ? 'border-blue-500 ring-2 ring-blue-200 scale-105 shadow-lg bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'}
              `}
              style={{ transition: 'all 0.2s cubic-bezier(.4,2,.6,1)' }}
            >
              <div className="flex items-center relative">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  {dentist.img_url ? (
                    <img
                      src={`/assets/dentists/${dentist.img_url}`}
                      alt={dentist.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-blue-500" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-800">{dentist.full_name}</h3>
                  <p className="text-sm text-gray-600">{spe ? spe.name : 'Chưa phân chuyên khoa'}</p>
                </div>
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center transition-transform duration-300 scale-125 shadow-lg animate-bounce z-10"
                    style={{ boxShadow: '0 0 0 3px #3b82f6' }}
                  >
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

StepDentist.propTypes = {
  dentists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      full_name: PropTypes.string.isRequired,
      specialization_id: PropTypes.number,
      img_url: PropTypes.string,
      branch_clinic_id: PropTypes.number,
    })
  ),
  specializations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  appointmentData: PropTypes.shape({
    dentist: PropTypes.shape({
      id: PropTypes.number,
    }),
    branchClinic: PropTypes.shape({
      id: PropTypes.number,
    }),
    service: PropTypes.shape({
      id: PropTypes.number,
      specialization_id: PropTypes.number, 
    }),
  }),
  onChange: PropTypes.func.isRequired,
};

StepDentist.defaultProps = {
  dentists: [],
  specializations: [],
  isLoading: false,
  error: null,
  appointmentData: {},
};

export default StepDentist;