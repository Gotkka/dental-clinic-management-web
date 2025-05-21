import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import { useBookAppointment } from '../../hooks/users/useBookAppointment';
import { useBranches } from '../../hooks/useBranchClinics';
import StepBranchClinic from '../../components/appointment/steps/stepBranchClinic';
import StepDentist from '../../components/appointment/steps/stepDentist';
import StepService from '../../components/appointment/steps/stepService';
import StepDateTime from '../../components/appointment/steps/stepDateTime';
import StepAppointmentType from '../../components/appointment/steps/stepAppointmentType';
import StepPatientInfo from '../../components/appointment/steps/stepPatientInfo';
import AppointmentConfirmation from '../../components/appointment/steps/appointmentConfirmation';
import StepReview from '../../components/appointment/steps/stepReview';

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md my-4">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="font-medium">Đã xảy ra lỗi: {this.state.error?.message || 'Không xác định'}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const steps = [
  { id: 1, name: 'Chi Nhánh', icon: '🏢' },
  { id: 2, name: 'Dịch Vụ', icon: '🦷' },
  { id: 3, name: 'Nha Sĩ', icon: '👨‍⚕️' },
  { id: 4, name: 'Loại Hẹn', icon: '📝' },
  { id: 5, name: 'Thông Tin', icon: '👤' },
  { id: 6, name: 'Thời Gian', icon: '🕒' },
  { id: 7, name: 'Xem Lại', icon: '✓' },
  { id: 8, name: 'Xác Nhận', icon: '✅' },
];

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { branches, loading: branchesLoading, error: branchesError } = useBranches();

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

  // Sử dụng useBookAppointment
  const {
    setDentistId,
    setSelectedDate,
    services,
    dentists,
    specializations,
    appointmentTypes,
    patients,
    generateTimeSlots,
    getAvailableDates,
    loading: isLoading,
    error: bookingError,
    submitAppointment,
  } = useBookAppointment();

  // Đồng bộ dentistId với appointmentData.dentist
  useEffect(() => {
    if (appointmentData.dentist?.id) {
      setDentistId(appointmentData.dentist.id);
    }
  }, [appointmentData.dentist, setDentistId]);

  // Đồng bộ selectedDate với appointmentData.date
  useEffect(() => {
    if (appointmentData.date) {
      setSelectedDate(appointmentData.date);
    }
  }, [appointmentData.date, setSelectedDate]);

  // Kiểm tra trạng thái đăng nhập và lấy patientId khi component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      setErrorMessage('Vui lòng đăng nhập để đặt lịch khám.');
      navigate('/login', { state: { from: '/book-appointment' } });
    } else if (patients.length > 0) {
      const userPatient = patients.find((p) => p.user_id === user.id);
      setAppointmentData((prev) => ({
        ...prev,
        patientId: userPatient ? userPatient.id : null,
      }));
    }
  }, [navigate, patients]);

  const handleChange = (field, value) => {
    setAppointmentData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'date' ? { time: '' } : {}),
    }));
  };

  const setPatientId = (id) => {
    setAppointmentData((prev) => ({
      ...prev,
      patientId: id,
    }));
  };

  const handleNextStep = async () => {
    if (!canProceed() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      if (currentStep === 7) {
        console.log('Submitting appointmentData:', JSON.stringify(appointmentData, null, 2));
        const result = await submitAppointment(appointmentData);
        if (result) {
          setErrorMessage(null);
          setCurrentStep(8);
        } else {
          throw new Error('Không nhận được phản hồi từ server khi tạo lịch hẹn.');
        }
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (err) {
      let errorMsg = 'Đã xảy ra lỗi khi xử lý. Vui lòng thử lại.';
      if (err.message === 'Dịch vụ không hợp lệ hoặc không tồn tại.') {
        errorMsg = 'Dịch vụ không hợp lệ. Vui lòng chọn lại dịch vụ.';
        setCurrentStep(2); // Redirect to StepService
      } else if (err.response?.status === 400 && err.response?.data?.error === 'Không tìm thấy dịch vụ') {
        errorMsg = 'Dịch vụ không tồn tại trên hệ thống. Vui lòng chọn lại dịch vụ.';
        setCurrentStep(2);
      } else if (err.response?.status === 409) {
        errorMsg = 'Thời gian đã chọn không còn trống. Vui lòng chọn thời gian khác.';
        setCurrentStep(6);
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else {
        errorMsg = err.message || errorMsg;
      }
      setErrorMessage(errorMsg);
      console.error('Lỗi trong handleNextStep:', err, 'Response:', err.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
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
    } = appointmentData;

    switch (currentStep) {
      case 1:
        return !!branchClinic?.id;
      case 2:
        return !!service?.id && services.some((s) => s.id === service.id);
      case 3:
        return !!dentist?.id;
      case 4:
        return !!appointmentType?.id;
      case 5:
        return !!(firstName && lastName && email && phone && patientId);
      case 6:
        return !!(date && time);
      case 7: {
        const missingFields = [];
        if (!branchClinic?.id) missingFields.push('chi nhánh');
        if (!service?.id || !services.some((s) => s.id === service.id)) missingFields.push('dịch vụ');
        if (!dentist?.id) missingFields.push('nha sĩ');
        if (!appointmentType?.id) missingFields.push('loại lịch hẹn');
        if (!firstName) missingFields.push('tên');
        if (!lastName) missingFields.push('họ');
        if (!email) missingFields.push('email');
        if (!phone) missingFields.push('số điện thoại');
        if (!date) missingFields.push('ngày');
        if (!time) missingFields.push('giờ');
        if (!patientId) missingFields.push('ID bệnh nhân');
        if (missingFields.length > 0) {
          setErrorMessage(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}.`);
        }
        return !!(
          branchClinic?.id &&
          service?.id &&
          services.some((s) => s.id === service.id) &&
          dentist?.id &&
          appointmentType?.id &&
          firstName &&
          lastName &&
          email &&
          phone &&
          date &&
          time &&
          patientId
        );
      }
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      return (
        <div className="text-center py-10">
          <p className="text-red-600 font-semibold">Vui lòng đăng nhập để tiếp tục đặt lịch khám.</p>
          <button
            onClick={() => navigate('/login', { state: { from: '/book-appointment' } })}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Đăng nhập ngay
          </button>
        </div>
      );
    }

    if (branchesLoading) {
      return <div className="text-center py-10">Đang tải dữ liệu chi nhánh...</div>;
    }

    if (branchesError) {
      return (
        <div className="text-center py-10 text-red-600">
          Lỗi khi tải dữ liệu chi nhánh: {branchesError.message}
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <ErrorBoundary>
            <StepBranchClinic
              branches={branches}
              isLoading={branchesLoading}
              error={branchesError}
              onChange={handleChange}
              appointmentData={appointmentData}
            />
          </ErrorBoundary>
        );
      case 2:
        return (
          <ErrorBoundary>
            <StepService
              services={services}
              isLoading={isLoading}
              error={bookingError}
              value={appointmentData.service}
              onChange={handleChange}
            />
          </ErrorBoundary>
        );
      case 3:
        return (
          <ErrorBoundary>
            <StepDentist
              dentists={dentists}
              specializations={specializations}
              isLoading={isLoading}
              error={bookingError}
              appointmentData={appointmentData}
              onChange={handleChange}
            />
          </ErrorBoundary>
        );
      case 4:
        return (
          <ErrorBoundary>
            <StepAppointmentType
              appointmentTypes={appointmentTypes}
              value={appointmentData.appointmentType}
              onChange={handleChange}
            />
          </ErrorBoundary>
        );
      case 5:
        return (
          <ErrorBoundary>
            <StepPatientInfo
              appointmentData={appointmentData}
              patients={patients}
              onChange={handleChange}
              setPatientId={setPatientId}
            />
          </ErrorBoundary>
        );
      case 6:
        return (
          <ErrorBoundary>
            <StepDateTime
              availableDates={getAvailableDates}
              timeSlots={() => generateTimeSlots(appointmentData.service?.id, appointmentData.date)}
              appointmentData={appointmentData}
              handleDateSelect={handleChange}
            />
          </ErrorBoundary>
        );
      case 7:
        return (
          <ErrorBoundary>
            <StepReview
              appointmentData={appointmentData}
              specializations={specializations}
              branchClinics={branches}
            />
          </ErrorBoundary>
        );
      case 8:
        return (
          <ErrorBoundary>
            <AppointmentConfirmation
              appointmentData={appointmentData}
              handleReset={handleReset}
              specializations={specializations}
            />
          </ErrorBoundary>
        );
      default:
        return <div>Bước không hợp lệ</div>;
    }
  };

  const renderProgressBar = () => {
    const percent = ((currentStep - 1) / (steps.length - 1)) * 100;
    return (
      <div className="relative h-2 bg-gray-200 rounded-full mb-8 mt-2">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    );
  };

  return (
    <Layout title="Đặt lịch khám">
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt Lịch Khám Nha Khoa</h2>
              <p className="text-gray-600">Hoàn thành các bước dưới đây để đặt lịch khám</p>
            </div>

            {renderProgressBar()}

            <div className="hidden md:flex justify-between mb-10 px-4">
              {steps.map((step) => {
                let status;
                if (step.id === currentStep) status = 'current';
                else if (step.id < currentStep) status = 'completed';
                else status = 'upcoming';

                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center relative cursor-pointer transition-all duration-300 ${status === 'upcoming' ? 'opacity-60' : 'opacity-100'
                      }`}
                    onClick={() => {
                      if (step.id < currentStep) setCurrentStep(step.id);
                    }}
                  >
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-xl mb-2
                        ${status === 'current' ? 'bg-blue-600 text-white shadow-md animate-pulse' :
                          status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                        transition-all duration-300 transform ${status === 'current' ? 'scale-110' : ''}
                      `}
                    >
                      <span>{step.icon}</span>
                    </div>
                    <span
                      className={`text-sm font-medium ${status === 'current' ? 'text-blue-600' :
                        status === 'completed' ? 'text-green-600' : 'text-gray-500'
                        }`}
                    >
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="md:hidden mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Bước {currentStep}/{steps.length}</span>
                <span className="text-sm font-medium text-blue-600">{steps[currentStep - 1].name}</span>
              </div>
            </div>

            {(errorMessage || branchesError || bookingError) && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fadeIn">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMessage || branchesError?.message || bookingError?.message || 'Đã xảy ra lỗi không xác định.'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg mb-8 min-h-64 transition-all duration-500">
              {renderStepContent()}
            </div>

            <div className="flex justify-between">
              <button
                disabled={currentStep === 1}
                onClick={handlePreviousStep}
                className={`px-6 py-3 rounded-full flex items-center transition-all duration-300 ${currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Quay lại
              </button>

              {currentStep < 8 && (
                <button
                  onClick={handleNextStep}
                  className={`px-6 py-3 rounded-full flex items-center transition-all duration-300 ${!canProceed() || !appointmentData.patientId || isSubmitting
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-1'
                    }`}
                  disabled={!canProceed() || !appointmentData.patientId || isSubmitting}
                >
                  {isSubmitting ? 'Đang xử lý...' : currentStep === 7 ? 'Xác nhận' : 'Tiếp tục'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointmentPage;