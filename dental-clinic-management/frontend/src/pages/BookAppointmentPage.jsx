import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, ChevronRight, ChevronLeft, Briefcase } from 'lucide-react';
import Layout from '../components/layout/Layout';
import axios from 'axios';

const BookAppointmentPage = () => {
  // State cho các bước đặt lịch hẹn
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState({
    dentist: '',
    service: '', // Thêm service vào state
    specialization: '',
    date: '',
    time: '',
    appointmentType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    insurance: '',
    reason: '',
    patientInformation: '',
    patient: ''
    // isNewPatient: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dentists, setDentists] = useState([]);
  const [services, setServices] = useState([]);
  const [specialization, setSpecialization] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  // Lấy danh sách bác sĩ từ API khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch danh sách bác sĩ
        const dentistsResponse = await axios.get('http://localhost:8080/dental-clinic/dentists');
        setDentists(dentistsResponse.data);
        console.log('Dữ liệu bác sĩ:', dentistsResponse.data);

        const specializationResponse = await axios.get('http://localhost:8080/dental-clinic/specializations');
        console.log('Dữ liệu bộ phận:', specializationResponse.data);
        setSpecialization(specializationResponse.data);

        // Fetch danh sách dịch vụ
        const servicesResponse = await axios.get('http://localhost:8080/dental-clinic/services');
        console.log('Dữ liệu dịch vụ:', servicesResponse.data);
        setServices(servicesResponse.data);

        const appointmentTypesResponse = await axios.get('http://localhost:8080/dental-clinic/appointment-types');
        console.log('Dữ liệu loại cuộc hẹn:', appointmentTypesResponse.data);
        setAppointmentTypes(appointmentTypesResponse.data);

        const patientResponse = await axios.get('http://localhost:8080/dental-clinic/patients');
        console.log('Dữ liệu bệnh nhân:', patientResponse.data);
        setAppointmentTypes(patientResponse.data);

        setError(null);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tạo danh sách ngày khả dụng
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);

      if (nextDate.getDay() !== 0) {
        dates.push({
          date: nextDate.toISOString().split('T')[0],
          dayName: nextDate.toLocaleDateString('vi-VN', { weekday: 'short' }),
          dayNumber: nextDate.getDate(),
          month: nextDate.toLocaleDateString('vi-VN', { month: 'short' })
        });
      }
    }

    return dates;
  };

  // Tạo danh sách khung giờ
  const getTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      const isPM = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour;

      slots.push(`${displayHour}:00 ${isPM ? 'Chiều' : 'Sáng'}`);
      slots.push(`${displayHour}:30 ${isPM ? 'Chiều' : 'Sáng'}`);
    }

    return slots;
  };

  const availableDates = getAvailableDates();
  const timeSlots = getTimeSlots();

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppointmentData({
      ...appointmentData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Xử lý chọn bác sĩ
  const handleDentistSelect = (dentistId) => {
    setAppointmentData({ ...appointmentData, dentist: dentistId });
  };

  // Xử lý chọn dịch vụ
  const handleServiceSelect = (serviceId) => {
    setAppointmentData({ ...appointmentData, service: serviceId });
  };

  // Xử lý chọn ngày
  const handleDateSelect = (date) => {
    setAppointmentData({ ...appointmentData, date: date });
  };

  // Xử lý chọn giờ
  const handleTimeSelect = (time) => {
    setAppointmentData({ ...appointmentData, time: time });
  };

  // Xử lý chọn loại cuộc hẹn
  const handleTypeSelect = (type) => {
    setAppointmentData({ ...appointmentData, appointmentType: type });
  };

  // Chuyển sang bước tiếp theo
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Quay lại bước trước
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Gửi lịch hẹn
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Validate dữ liệu trước nếu cần
      if (!User?.id || !appointmentData.dentist || !appointmentData.service) {
        alert("Vui lòng chọn đầy đủ thông tin.");
        setIsSubmitting(false);
        return;
      }
  
      // Tạo patient_information
      const patientInfo = {
        first_name: appointmentData.firstName,
        last_name: appointmentData.lastName,
        email: appointmentData.email,
        phone: appointmentData.phone,
      };
  
      const { data: patientInfoRes } = await axios.post(
        'http://localhost:8080/dental-clinic/create-patient-information',
        patientInfo
      );
      const user = localStorage.getItem("user"); // Assuming username is saved in localStorage

      const newAppointment = {
        patient_id: appointmentData.patient.find(p => p.user_id === user)?.id || null,
        dentist_id: appointmentData.dentist.id,
        service_id: appointmentData.service.id,
        appointment_type_id: appointmentData.appointmentType.id,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time,
        reason: appointmentData.reason,
        status: "Đang chờ",
        patient_information_id: patientInfoRes.id,
      };
  
      await axios.post(
        'http://localhost:8080/dental-clinic/create-appointment',
        newAppointment
      );
  
      setIsSubmitting(false);
      setIsCompleted(true);
    } catch (error) {
      console.error("Lỗi khi gửi lịch hẹn:", error);
      setIsSubmitting(false);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };
  
  
  
  // Đặt lại form
  const handleReset = () => {
    setAppointmentData({
      dentist: '',
      service: '', // Thêm service vào state
      specialization: '',
      date: '',
      time: '',
      appointmentType: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      insurance: '',
      reason: '',
      patientInformation: '',
      patient: ''
    });
    setCurrentStep(1);
    setIsCompleted(false);
  };


  // Kiểm tra xem có thể tiếp tục bước hiện tại không
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return appointmentData.dentist !== '';
      case 2:
        return appointmentData.service !== '';
      case 3:
        return appointmentData.date !== '' && appointmentData.time !== '';
      case 4:
        return appointmentData.appointmentType !== '';
      case 5:
        return (
          appointmentData.firstName !== '' &&
          appointmentData.lastName !== '' &&
          appointmentData.email !== '' &&
          appointmentData.phone !== ''
        );
      default:
        return false;
    }
  };

  // Hiển thị nội dung bước
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Chọn Bác sĩ</h2>
        
            {isLoading ? (
              <p>Đang tải danh sách bác sĩ...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : dentists.length === 0 ? (
              <p>Không có bác sĩ nào khả dụng.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dentists.map((dentist) => {
                  const spe = specialization.find(
                    (s) => s.id === dentist.specialization_id
                  );
        
                  return (
                    <div
                      key={dentist.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        appointmentData.dentist === dentist.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleDentistSelect(dentist.id)}
                    >
                      <div className="flex items-center">
                        <img
                          src={'/assets/dentists/' + dentist.img_url}
                          alt={dentist.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <h3 className="font-medium">{dentist.full_name}</h3>
                          <p className="text-sm text-gray-600">{spe.name}</p>
                        </div>
                      </div>
                    </div>


                  );
                })}
              </div>
            )}
          </div>


        );
        

      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Chọn Dịch vụ</h2>
            {isLoading ? (
              <p>Đang tải danh sách dịch vụ...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : services.length === 0 ? (
              <p>Không có dịch vụ nào khả dụng.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${appointmentData.service === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                      }`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <div className="flex items-center">
                      <Briefcase size={20} className="text-blue-600 flex-shrink-0" />
                      <p>{console.log(service.data)}</p>
                      <div className="ml-4">
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.duration} phút</p>
                        <p className="text-sm font-medium text-blue-600 mt-1">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Chọn Ngày & Giờ</h2>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Ngày Khả dụng</h3>
              <div className="flex overflow-x-auto pb-4 space-x-2">
                {availableDates.map((dateObj) => (
                  <div
                    key={dateObj.date}
                    className={`flex-shrink-0 w-20 h-24 border rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${appointmentData.date === dateObj.date
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                      }`}
                    onClick={() => handleDateSelect(dateObj.date)}
                  >
                    <p className="text-sm text-gray-600">{dateObj.dayName}</p>
                    <p className="text-lg font-bold">{dateObj.dayNumber}</p>
                    <p className="text-sm text-gray-600">{dateObj.month}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Khung Giờ Khả dụng</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className={`border rounded-lg py-2 px-3 text-center cursor-pointer transition-all ${appointmentData.time === time
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                      }`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    <p className="text-sm">{time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Chọn Loại Cuộc Hẹn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointmentTypes.map((type) => (
                <div
                  key={type.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${appointmentData.appointmentType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                    }`}
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <h3 className="font-medium">{type.name}</h3>
                  <p className="text-sm text-gray-600">Mô tả: {type.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Thông Tin Bệnh Nhân</h2>
            <form onSubmit={handleSubmit}>
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

                {/* <div>
                  <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
                    Nhà Cung Cấp Bảo Hiểm
                  </label>
                  <input
                    type="text"
                    id="insurance"
                    name="insurance"
                    value={appointmentData.insurance}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div> */}

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
        );

      case 6:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Xem Lại Lịch Hẹn</h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-start mb-4">
                <Calendar size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Ngày & Giờ</h3>
                  <p className="text-gray-700">
                    {appointmentData.date ? new Date(appointmentData.date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : ''}
                    {appointmentData.time ? ` lúc ${appointmentData.time}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-start mb-4">
                <User size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Bác sĩ</h3>
                  <p className="text-gray-700">
                    {dentists.find(d => d.id === appointmentData.dentist)?.full_name || ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    {
                      specialization.find(
                        (s) =>
                          s.id ===
                          dentists.find((d) => d.id === appointmentData.dentist)?.specialization_id
                      )?.name || ''
                    }
                  </p>

                </div>
              </div>

              <div className="flex items-start mb-4">
                <Briefcase size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Dịch vụ</h3>
                  <p className="text-gray-700">
                    {services.find(s => s.id === appointmentData.service)?.name || ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    {services.find(s => s.id === appointmentData.service)?.duration || ''} phút
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    {services.find(s => s.id === appointmentData.service)?.price
                      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(services.find(s => s.id === appointmentData.service).price)
                      : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-start mb-4">
                <FileText size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Loại Cuộc Hẹn</h3>
                  <p className="text-gray-700">
                    {appointmentTypes.find(t => t.id === appointmentData.appointmentType)?.name || ''}
                  </p>
                  {/* <p className="text-sm text-gray-600">
                    Thời gian: {appointmentTypes.find(t => t.id === appointmentData.appointmentType)?.duration || ''}
                  </p> */}
                </div>
              </div>

              <div className="flex items-start">
                <User size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Thông Tin Bệnh Nhân</h3>
                  <p className="text-gray-700">{appointmentData.firstName} {appointmentData.lastName}</p>
                  <p className="text-sm text-gray-600">{appointmentData.email}</p>
                  <p className="text-sm text-gray-600">{appointmentData.phone}</p>
                  {appointmentData.isNewPatient && (
                    <p className="text-sm text-blue-600 mt-1">Bệnh Nhân Mới</p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-6">
              <p>
                Bằng cách xác nhận lịch hẹn này, bạn đồng ý với{' '}
                <a href="#" className="black-text-link hover:underline">Điều khoản Dịch vụ</a> và{' '}
                <a href="#" className="black-text-link hover:underline">Chính sách Bảo mật</a>.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Hiển thị màn hình xác nhận
  const renderConfirmation = () => (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Lịch Hẹn Đã Được Xác Nhận!</h2>
      <p className="text-lg text-gray-600 mb-6">
        Lịch hẹn của bạn đã được đặt thành công.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8 text-left">
        <div className="flex items-start mb-4">
          <Calendar size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Ngày & Giờ</h3>
            <p className="text-gray-700">
              {appointmentData.date ? new Date(appointmentData.date).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ''}
              {appointmentData.time ? ` lúc ${appointmentData.time}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-start mb-4">
          <User size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Bác sĩ</h3>
            <p className="text-gray-700">
              {dentists.find(d => d.id === appointmentData.dentist)?.full_name || ''}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <Briefcase size={20} className="mr-3 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Dịch vụ</h3>
            <p className="text-gray-700">
              {services.find(s => s.id === appointmentData.service)?.name || ''}
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-8">
        Một email xác nhận đã được gửi đến {appointmentData.email}.
        <br />Vui lòng đến trước 15 phút so với giờ hẹn.
      </p>

      <button
        onClick={handleReset}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Đặt Lịch Hẹn Khác
      </button>
    </div>
  );

  // Hiển thị các bước tiến trình
  const renderProgressSteps = () => {
    const steps = [
      'Bác sĩ',
      'Dịch vụ', // Thêm bước Dịch vụ
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

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Đặt Lịch Hẹn</h1>
            <p className="mt-2 text-gray-600">
              Lên lịch thăm khám với các chuyên gia y tế giàu kinh nghiệm của chúng tôi
            </p>
          </div>

          {isCompleted ? (
            renderConfirmation()
          ) : (
            <>
              {renderProgressSteps()}

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-8">
                  {renderStepContent()}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="my-global-btn inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-white bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Quay lại
                    </button>
                  )}

                  {currentStep < 6 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className={`my-global-btn inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                        ${canProceed()
                          ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                          : 'bg-blue-300 cursor-not-allowed'
                        }`}
                    >
                      Tiếp tục
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`my-global-btn inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                        ${isSubmitting
                          ? 'bg-blue-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        'Xác nhận đặt lịch'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointmentPage;