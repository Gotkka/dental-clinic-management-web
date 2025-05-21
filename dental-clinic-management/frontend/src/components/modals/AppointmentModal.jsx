import React from "react";

const AppointmentModal = ({ appointment, onClose, onUpdate }) => {
  if (!appointment) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
        <h2 className="text-lg font-bold mb-2">Chi tiết lịch hẹn</h2>
        <div>
          <div><b>Bệnh nhân:</b> {appointment.patientName}</div>
          <div><b>Bác sĩ:</b> {appointment.doctorName}</div>
          <div><b>Dịch vụ:</b> {appointment.serviceName}</div>
          <div><b>Ngày:</b> {appointment.date}</div>
          <div><b>Giờ:</b> {appointment.time}</div>
          <div><b>Trạng thái:</b> {appointment.status}</div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">Đóng</button>
          {onUpdate && (
            <button onClick={onUpdate} className="px-3 py-1 bg-blue-500 text-white rounded">Cập nhật</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;