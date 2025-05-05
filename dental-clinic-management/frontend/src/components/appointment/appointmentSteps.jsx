import React from 'react';
import { CheckCircle } from 'lucide-react';

const AppointmentSteps = ({ currentStep }) => {
    const steps = [
        'Bác sĩ',
        'Dịch vụ',
        'Ngày & Giờ',
        'Loại Cuộc Hẹn',
        'Thông Tin Bệnh Nhân',
        'Xem Lại'
    ];

    return (
        <div className="hidden md:flex justify-center mb-8">
            <nav className="flex items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <div className={`w-10 h-0.5 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        )}
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${index + 1 === currentStep
                                        ? 'bg-blue-600 text-white'
                                        : index + 1 < currentStep
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {index + 1 < currentStep ? <CheckCircle size={16} /> : index + 1}
                            </div>
                            <span className="text-xs mt-1">{step}</span>
                        </div>
                    </React.Fragment>
                ))}
            </nav>
        </div>
    );
};

export default AppointmentSteps;