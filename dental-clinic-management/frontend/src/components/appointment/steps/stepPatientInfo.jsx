import React from 'react';

const StepPatientInfo = ({ appointmentData, handleInputChange, nextStep }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Thông Tin Bệnh Nhân</h2>
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            Họ *
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={appointmentData.firstName}
                            onChange={handleInputChange}
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
                            value={appointmentData.lastName}
                            onChange={handleInputChange}
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
                            value={appointmentData.email}
                            onChange={handleInputChange}
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
                            value={appointmentData.phone}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="flex items-center h-full pt-6">
                        <input
                            type="checkbox"
                            id="isNewPatient"
                            name="isNewPatient"
                            checked={appointmentData.isNewPatient}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isNewPatient" className="ml-2 block text-sm text-gray-700">
                            Tôi là bệnh nhân mới
                        </label>
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
                        value={appointmentData.reason}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Vui lòng mô tả ngắn gọn triệu chứng hoặc lý do đặt lịch hẹn"
                    ></textarea>
                </div>
            </form>
        </div>
    )
}

export default StepPatientInfo;