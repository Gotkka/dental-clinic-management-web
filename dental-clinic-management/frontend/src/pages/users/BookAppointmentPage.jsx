import React, { useState } from 'react';
import Layout from '../../layouts/Layout';
import useBookAppointment from '../../hooks/useBookAppointment';
import { useCreateAppointment } from '../../hooks/useAppointments';
import usePatientInformation from '../../hooks/usePatientInformation';

import StepBranchClinic from '../../components/appointment/steps/StepBranchClinic';
import StepDentist from '../../components/appointment/steps/StepDentist';
import StepService from '../../components/appointment/steps/StepService';
import StepDateTime from '../../components/appointment/steps/StepDateTime';
import StepAppointmentType from '../../components/appointment/steps/StepAppointmentType';
import StepPatientInfo from '../../components/appointment/steps/StepPatientInfo';
import AppointmentConfirmation from '../../components/appointment/steps/AppointmentConfirmation';
import StepReview from '../../components/appointment/steps/StepReview';

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-center p-4">
          <p>Đã xảy ra lỗi: {this.state.error?.message || 'Không xác định'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const steps = [
  { id: 1, name: 'Chọn Chi Nhánh' },
  { id: 2, name: 'Chọn Dịch Vụ' },
  { id: 3, name: 'Chọn Nha Sĩ' },
  { id: 4, name: 'Loại Lịch Hẹn' },
  { id: 5, name: 'Thông Tin Bệnh Nhân' },
  { id: 6, name: 'Chọn Thời Gian' },
  { id: 7, name: 'Xem Lịch Hẹn' },
  { id: 8, name: 'Xác Nhận' },
];

const BookAppointmentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { createNewAppointment } = useCreateAppointment();
  const { createPatient } = usePatientInformation();

  const [appointmentData, setAppointmentData] = useState({
    branchClinic: null,
    dentist: null,
    service: null,
    appointmentType: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    date: '',
    time: '',
    patientId: null,
    patientInformationId: null,
  });

  const {
    dentists,
    services,
    specializations,
    branchClinics,
    appointmentTypes,
    patients,
    existingAppointments,
    isLoading,
    error,
  } = useBookAppointment();

  const handleChange = (field, value) => {
    setAppointmentData((prev) => {
      const newData = { ...prev, [field]: value };
      console.log(`Updated appointmentData[${field}]:`, value, 'New appointmentData:', newData);
      if (field === 'branchClinic') {
        console.log('Branch selected:', value);
      }
      return newData;
    });
  };

  const handleNextStep = async () => {
    if (!canProceed()) {
      console.log('Không thể tiếp tục, kiểm tra điều kiện canProceed:', { currentStep, appointmentData });
      setErrorMessage('Vui lòng hoàn thành tất cả các thông tin bắt buộc.');
      return;
    }

    try {
      setErrorMessage(null);

      if (currentStep === 5) {
        console.log('Creating patient information with data:', {
          first_name: appointmentData.firstName,
          last_name: appointmentData.lastName,
          email: appointmentData.email,
          phone: appointmentData.phone,
        });

        const patientInfo = {
          first_name: appointmentData.firstName,
          last_name: appointmentData.lastName,
          email: appointmentData.email,
          phone: appointmentData.phone,
        };

        const patientInfoRes = await createPatient(patientInfo);
        console.log('Patient creation response:', patientInfoRes);

        if (!patientInfoRes?.id) {
          throw new Error('Không nhận được ID từ phản hồi tạo bệnh nhân.');
        }

        handleChange('patientInformationId', patientInfoRes.id);
        console.log('Advancing to step 6 after setting patientInformationId:', patientInfoRes.id);
        setCurrentStep((prev) => prev + 1);
      } else if (currentStep <= 6) {
        console.log(`Advancing from step ${currentStep} to ${currentStep + 1}`);
        setCurrentStep((prev) => prev + 1);
      } else if (currentStep === 7) {
        console.log('Submitting appointment with payload:', {
          patient_id: appointmentData.patientId,
          dentist_id: appointmentData.dentist?.id,
          service_id: appointmentData.service?.id,
          appointment_type_id: appointmentData.appointmentType?.id,
          branch_clinic_id: appointmentData.branchClinic?.id,
          appointment_time: `${appointmentData.date}T${appointmentData.time}:00`,
          reason: appointmentData.reason,
          patient_information_id: appointmentData.patientInformationId,
          status: 'Đang chờ',
        });

        const appointmentTime = new Date(`${appointmentData.date}T${appointmentData.time}:00`);
        const appointmentPayload = {
          patient_id: appointmentData.patientId,
          dentist_id: appointmentData.dentist?.id,
          service_id: appointmentData.service?.id,
          appointment_type_id: appointmentData.appointmentType?.id,
          branch_clinic_id: appointmentData.branchClinic?.id,
          appointment_time: appointmentTime.toISOString(),
          reason: appointmentData.reason || 'Không có lý do cụ thể',
          patient_information_id: appointmentData.patientInformationId,
          status: 'Đang chờ',
        };

        const result = await createNewAppointment(appointmentPayload);
        console.log('Appointment creation result:', result);

        if (result) {
          console.log('Appointment created successfully, advancing to step 8');
          setCurrentStep(8);
          setIsCompleted(true);
        } else {
          throw new Error('Không nhận được phản hồi từ server khi tạo lịch hẹn.');
        }
      }
    } catch (err) {
      console.error('Lỗi trong handleNextStep:', err);
      setErrorMessage(err.message || 'Đã xảy ra lỗi khi xử lý. Vui lòng thử lại.');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      console.log(`Moving back from step ${currentStep} to ${currentStep - 1}`);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    console.log('Resetting appointment data and state');
    setAppointmentData({
      branchClinic: null,
      dentist: null,
      service: null,
      appointmentType: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      reason: '',
      date: '',
      time: '',
      patientId: null,
      patientInformationId: null,
    });
    setCurrentStep(1);
    setIsCompleted(false);
    setErrorMessage(null);
  };

  const canProceed = () => {
    const {
      branchClinic,
      dentist,
      service,
      appointmentType,
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      patientId,
      patientInformationId,
    } = appointmentData;

    const canProceedResult = {
      step: currentStep,
      branchClinic: !!branchClinic,
      service: !!service,
      dentist: !!dentist,
      appointmentType: !!appointmentType,
      patientInfo: !!(firstName && lastName && email && phone && patientId),
      dateTime: !!(date && time),
      allRequired: !!(
        branchClinic &&
        service &&
        dentist &&
        appointmentType &&
        firstName &&
        lastName &&
        email &&
        phone &&
        date &&
        time &&
        patientId &&
        patientInformationId
      ),
    };

    console.log('canProceed check:', canProceedResult);

    switch (currentStep) {
      case 1:
        return !!branchClinic;
      case 2:
        return !!service;
      case 3:
        return !!dentist;
      case 4:
        return !!appointmentType;
      case 5:
        return !!(firstName && lastName && email && phone && patientId);
      case 6:
        return !!(date && time);
      case 7:
        return !!(
          branchClinic &&
          service &&
          dentist &&
          appointmentType &&
          firstName &&
          lastName &&
          email &&
          phone &&
          date &&
          time &&
          patientId &&
          patientInformationId
        );
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    console.log('Rendering step:', currentStep, 'with appointmentData:', appointmentData);
    switch (currentStep) {
      case 1:
        return (
          <ErrorBoundary>
            <StepBranchClinic
              branches={branchClinics || []}
              isLoading={isLoading}
              error={error}
              appointmentData={appointmentData}
              onChange={(v) => handleChange('branchClinic', v)}
            />
          </ErrorBoundary>
        );
      case 2:
        return (
          <ErrorBoundary>
            <StepService
              services={services || []}
              isLoading={isLoading}
              error={error}
              value={appointmentData.service}
              onChange={(v) => handleChange('service', v)}
            />
          </ErrorBoundary>
        );
      case 3:
        return (
          <ErrorBoundary>
            <StepDentist
              dentists={dentists || []}
              specializations={specializations || []}
              isLoading={isLoading}
              error={error}
              appointmentData={appointmentData}
              onChange={(v) => handleChange('dentist', v)}
            />
          </ErrorBoundary>
        );
      case 4:
        return (
          <ErrorBoundary>
            <StepAppointmentType
              appointmentTypes={appointmentTypes || []}
              appointmentData={appointmentData}
              onChange={(v) => handleChange('appointmentType', v)}
            />
          </ErrorBoundary>
        );
      case 5:
        return (
          <ErrorBoundary>
            <StepPatientInfo
              appointmentData={appointmentData}
              patients={patients || []}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              setPatientId={(id) => handleChange('patientId', id)}
            />
          </ErrorBoundary>
        );
      case 6:
        return (
          <ErrorBoundary>
            <StepDateTime
              appointmentData={appointmentData}
              existingAppointments={existingAppointments || []}
              onChange={handleChange}
            />
          </ErrorBoundary>
        );
      case 7:
        return (
          <ErrorBoundary>
            <StepReview
              appointmentData={appointmentData}
              specializations={specializations || []}
            />
          </ErrorBoundary>
        );
      case 8:
        return (
          <ErrorBoundary>
            <AppointmentConfirmation handleReset={handleReset} />
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white min-h-screen">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Đặt Lịch Khám Nha Khoa</h1>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Lỗi: {error}. Vui lòng thử lại sau.</div>
        ) : (
          <>
            {errorMessage && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{errorMessage}</div>}
            {!isCompleted ? (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="mb-8">
                  <div className="sm:hidden mb-4 text-center">
                    <p className="text-lg font-semibold text-gray-800">
                      Bước {currentStep} / {steps.length}: {steps[currentStep - 1].name}
                    </p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="hidden sm:flex justify-between items-center mb-4">
                    {steps.map((step) => (
                      <div key={step.id} className="flex-1 text-center">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center ${
                            step.id <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {step.id}
                        </div>
                        <p
                          className={`mt-2 text-xs sm:text-sm font-medium ${
                            step.id <= currentStep ? 'text-blue-500' : 'text-gray-500'
                          }`}
                        >
                          {step.name}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="hidden sm:block mt-4 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="mb-8">{renderStepContent()}</div>
                <div className="flex justify-between">
                  <button
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    className="px-6 py-2 rounded-full bg-gray-300 text-gray-700 font-semibold disabled:opacity-50 hover:bg-gray-400 transition-colors"
                  >
                    Quay Lại
                  </button>
                  {currentStep < 8 && (
                    <button
                      onClick={handleNextStep}
                      disabled={!canProceed()}
                      className="px-6 py-2 rounded-full bg-blue-500 text-white font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors"
                    >
                      {currentStep === 7 ? 'Xác Nhận' : 'Tiếp Theo'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center bg-white shadow-lg rounded-lg p-8">
                <p className="text-3xl font-bold text-green-600 mb-4">Đặt Lịch Thành Công!</p>
                <p className="text-gray-600 mb-6">
                  Cảm ơn bạn đã đặt lịch. Chúng tôi sẽ liên hệ sớm để xác nhận.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                >
                  Đặt Lịch Mới
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default BookAppointmentPage;