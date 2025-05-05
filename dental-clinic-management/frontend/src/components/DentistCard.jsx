import React from 'react';

const DentistCard = ({ doctor, specialization }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center">
          <img
            className="h-16 w-16 rounded-full object-cover"
            src={'/assets/dentists/' + doctor.img_url}
            alt={doctor.full_name}
          />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{doctor.full_name}</h3>
            <p className="text-sm text-blue-600">
              {specialization?.name || 'Chưa cập nhật'}
            </p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Số điện thoại:</strong> {doctor.phone_number}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Kinh nghiệm:</strong> chưa cập nhật</p>
        </div>
        <div className="mt-6">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Đặt lịch khám
          </button>
        </div>
      </div>
    </div>
  );
};

export default DentistCard;
