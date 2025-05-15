import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const StepPatientInfo = ({ appointmentData = {}, patients = [], onChange, setPatientId }) => {
  const [localError, setLocalError] = useState(null);

  // Kiểm tra appointmentData
  useEffect(() => {
    if (!appointmentData) {
      setLocalError('Lỗi: Dữ liệu bệnh nhân không khả dụng.');
    } else {
      setLocalError(null);
    }
  }, [appointmentData]);

  // Tự động lấy patientId từ patients dựa trên user_id
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    if (user.id && patients.length > 0 && !appointmentData?.patientId) {
      const userPatient = patients.find((p) => p.user_id === user.id);
      if (userPatient) {
        setPatientId(userPatient.id);
      }
    }
  }, [patients, setPatientId, appointmentData?.patientId]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    onChange({
      target: {
        name,
        value,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-center text-blue-600">Thông Tin Bệnh Nhân</h2>
        <p className="text-center text-gray-500 text-sm mt-1">
          Vui lòng điền thông tin cá nhân để tiếp tục
        </p>
      </div>

      <div className="p-6">
        {localError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{localError}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Họ *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={appointmentData?.firstName || ''}
              onChange={onInputChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={appointmentData?.lastName || ''}
              onChange={onInputChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Địa Chỉ Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={appointmentData?.email || ''}
              onChange={onInputChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Số Điện Thoại *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={appointmentData?.phone || ''}
              onChange={onInputChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Lý Do Thăm Khám
          </label>
          <textarea
            id="reason"
            name="reason"
            rows="4"
            value={appointmentData?.reason || ''}
            onChange={onInputChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Vui lòng mô tả ngắn gọn triệu chứng hoặc lý do đặt lịch hẹn"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

StepPatientInfo.propTypes = {
  appointmentData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    reason: PropTypes.string,
    patientId: PropTypes.number,
  }),
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user_id: PropTypes.number,
    })
  ),
  onChange: PropTypes.func.isRequired,
  setPatientId: PropTypes.func.isRequired,
};

StepPatientInfo.defaultProps = {
  appointmentData: {},
  patients: [],
};

export default StepPatientInfo;