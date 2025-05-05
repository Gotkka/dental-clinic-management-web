import React from 'react';
import { Briefcase } from 'lucide-react';
import { formatCurrency } from '../../../utils/dateTimeUtils';

const StepService = ({ services, isLoading, error, appointmentData, handleServiceSelect }) => {
  if (isLoading) {
    return <p>Đang tải danh sách dịch vụ...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (services.length === 0) {
    return <p>Không có dịch vụ nào khả dụng.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Chọn Dịch vụ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              appointmentData.service?.id === service.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleServiceSelect(service)}
          >
            <div className="flex items-center">
              <Briefcase size={20} className="text-blue-600 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.duration} phút</p>
                <p className="text-sm font-medium text-blue-600 mt-1">
                  {formatCurrency(service.price)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepService;