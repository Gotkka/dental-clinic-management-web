import React from 'react';
import { CheckCircle } from 'lucide-react';

const AppointmentSteps = ({ currentStep }) => {
    const steps = [
        'Chi Nhánh',
        'Dịch Vụ',
        'Bác Sĩ',
        'Loại Cuộc Hẹn',
        'Thông Tin',
        'Ngày & Giờ',
        'Xác Nhận'
    ];

    return (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            {/* Tiêu đề hiện tại */}
            <h2 className="text-xl font-bold text-center text-blue-600 mb-6">
                {steps[currentStep - 1]}
            </h2>
            
            {/* Thanh tiến trình */}
            <div className="relative">
                <div className="overflow-hidden mb-8">
                    <div className="flex">
                        {steps.map((step, index) => (
                            <div key={index} className="flex-1 relative">
                                {/* Đường nối */}
                                <div className="absolute top-1/2 inset-x-0 h-0.5 -translate-y-1/2 bg-gray-200">
                                    <div 
                                        className={`h-full bg-blue-500 transition-all duration-300 ease-in-out ${
                                            index < currentStep ? 'w-full' : 'w-0'
                                        }`}
                                    ></div>
                                </div>
                                
                                {/* Điểm bước */}
                                <div className="flex flex-col items-center relative z-10">
                                    <div 
                                        className={`
                                            flex items-center justify-center w-8 h-8 rounded-full 
                                            transition-all duration-300 ease-in-out
                                            ${
                                                index + 1 === currentStep 
                                                    ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                                                    : index + 1 < currentStep
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white text-gray-400 border border-gray-300'
                                            }
                                        `}
                                    >
                                        {index + 1 < currentStep ? <CheckCircle size={16} /> : index + 1}
                                    </div>
                                    
                                    {/* Nhãn bước (chỉ hiển thị ở một số bước quan trọng hoặc màn hình lớn) */}
                                    <span 
                                        className={`
                                            hidden md:block text-xs mt-2 font-medium 
                                            ${index + 1 === currentStep ? 'text-blue-600' : 'text-gray-500'}
                                        `}
                                    >
                                        {step}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Ghi chú bước hiện tại */}
            <div className="text-center text-sm text-gray-600">
                Bước {currentStep} / {steps.length}
            </div>
        </div>
    );
};

export default AppointmentSteps;