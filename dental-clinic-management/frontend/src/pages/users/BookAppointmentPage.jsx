import React, { useState } from 'react';
import Layout from '../../layouts/Layout';
import useAppointment from '../../hooks/useAppointmentServices';
import AppointmentSteps from '../../components/appointment/appointmentSteps';
import StepDentist from '../../components/appointment/steps/stepDentist';
import StepService from '../../components/appointment/steps/stepService';
import StepDateTime from '../../components/appointment/steps/stepDateTime';
import StepAppointmentType from '../../components/appointment/steps/stepAppointmentType';
import StepPatientInfo from '../../components/appointment/steps/stepPatientInfo';
import StepReview from '../../components/appointment/steps/stepReview';
import NavigationButtons from '../../components/appointment/navigationButtons';
import AppointmentConfirmation from '../../components/appointment/steps/appointmentConfirmation';

const BookAppointmentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState({
    dentist: null,
    service: null,
    specialization: '',
    date: '',
    time: '',
    appointmentType: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    insurance: '',
    reason: '',
    patientInformation: '',
    patient: null,
    isNewPatient: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    dentists,
    services,
    specializations,
    appointmentTypes,
    isLoading,
    error,
    getAvailableDates,
    getTimeSlots,
    submitAppointment
  } = useAppointment();

  const availableDates = getAvailableDates();
  const timeSlots = getTimeSlots();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppointmentData({
      ...appointmentData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDentistSelect = (dentist) => {
    setAppointmentData({ ...appointmentData, dentist: dentist });
  };

  // Xử lý chọn dịch vụ
  const handleServiceSelect = (service) => {
    setAppointmentData({ ...appointmentData, service: service });
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
      // Sử dụng hàm submitAppointment từ hook
      const result = await submitAppointment(appointmentData);
      console.log('Appointment created successfully:', result);
      
      setIsSubmitting(false);
      setIsCompleted(true);
    } catch (error) {
      console.error("Lỗi khi gửi lịch hẹn:", error);
      setIsSubmitting(false);
      alert(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };
  
  // Đặt lại form
  const handleReset = () => {
    setAppointmentData({
      dentist: null,
      service: null,
      date: '',
      time: '',
      appointmentType: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      insurance: '',
      reason: '',
      isNewPatient: false
    });
    setCurrentStep(1);
    setIsCompleted(false);
  };

  // Kiểm tra xem có thể tiếp tục bước hiện tại không
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return appointmentData.dentist !== null;
      case 2:
        return appointmentData.service !== null;
      case 3:
        return appointmentData.date !== '' && appointmentData.time !== '';
      case 4:
        return appointmentData.appointmentType !== null;
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

  // Hiển thị nội dung bước hiện tại
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepDentist
            isLoading={isLoading}
            error={error}
            dentists={dentists}
            specialization={specializations}
            appointmentData={appointmentData}
            handleDentistSelect={handleDentistSelect}
          />
        );
      case 2:
        return (
          <StepService
            isLoading={isLoading}
            error={error}
            services={services}
            appointmentData={appointmentData}
            handleServiceSelect={handleServiceSelect}
          />
        );
      case 3:
        return (
          <StepDateTime
            availableDates={availableDates}
            timeSlots={timeSlots}
            appointmentData={appointmentData}
            handleDateSelect={handleDateSelect}
            handleTimeSelect={handleTimeSelect}
          />
        );
      case 4:
        return (
          <StepAppointmentType
            appointmentTypes={appointmentTypes}
            appointmentData={appointmentData}
            handleTypeSelect={handleTypeSelect}
          />
        );
      case 5:
        return (
          <StepPatientInfo
            appointmentData={appointmentData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
          />
        );
      case 6:
        return (
          <StepReview
            appointmentData={appointmentData}
            specialization={specializations}
          />
        );
      default:
        return null;
    }
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
            <AppointmentConfirmation
              appointmentData={appointmentData}
              handleReset={handleReset}
            />
          ) : (
            <>
              <AppointmentSteps currentStep={currentStep} />

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-8">
                  {renderStepContent()}
                </div>

                <NavigationButtons
                  currentStep={currentStep}
                  prevStep={prevStep}
                  nextStep={nextStep}
                  canProceed={canProceed()}
                  isSubmitting={isSubmitting}
                  handleSubmit={handleSubmit}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointmentPage;