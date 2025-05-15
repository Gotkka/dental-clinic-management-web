import React from 'react';
import { Briefcase } from 'react-feather';

const StepService = ({ services, isLoading, error, value, onChange }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center">
        <div className="animate-pulse text-blue-500 flex flex-col items-center">
          <svg className="w-8 h-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="mt-2">Đang tải danh sách dịch vụ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-red-500">
        <p className="flex flex-col items-center">
          <svg className="w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error?.message || 'Đã xảy ra lỗi, vui lòng thử lại.'}
        </p>
      </div>
    );
  }

  if (!services?.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
        <p className="flex flex-col items-center">
          <svg className="w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H7.414a1 1 0 01-.707-.293L4.293 13A1 1 0 004 12H2" />
          </svg>
          Hiện chưa có dịch vụ nào.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-center text-blue-600">Chọn Dịch Vụ</h2>
        <p className="text-center text-gray-500 text-sm mt-1">Vui lòng chọn dịch vụ bạn muốn</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onChange(service)}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md flex flex-col
              ${value?.id === service.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'}
            `}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase size={24} className="text-blue-500" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-gray-800">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.duration} phút</p>
                <p className="text-sm font-medium text-blue-600 mt-1">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                </p>
              </div>

              {value?.id === service.id && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {service.description && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepService;
