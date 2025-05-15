import React from 'react';

const StepDentist = ({ dentists, specialization, isLoading, error, appointmentData, handleDentistSelect }) => {
  if (isLoading) {
    return <p>Đang tải danh sách bác sĩ...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (dentists.length === 0) {
    return <p>Không có bác sĩ nào khả dụng.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Chọn Bác sĩ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dentists.map((dentist) => {
          const spe = specialization.find(
            (s) => s.id === dentist.specialization_id
          );

          return (
            <div
              key={dentist.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                appointmentData.dentist?.id === dentist.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleDentistSelect(dentist)}
            >
              <div className="flex items-center">
                <img
                  src={'/assets/dentists/' + dentist.img_url}
                  alt={dentist.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-medium">{dentist.full_name}</h3>
                  <p className="text-sm text-gray-600">{spe?.name || 'Chuyên khoa'}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepDentist;