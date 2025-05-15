import { useState, useEffect } from 'react';
import { createAppointment, createPatientInformation, fetchAllData } from '../services/bookAppointmentService';
import { getAvailableDates, getTimeSlots, convertTo24HourTime } from '../utils/dateTimeUtils';


const useAppointmentServices = () => {
  const [dentists, setDentists] = useState([]);
  const [services, setServices] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllDataFromAPI = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllData();
      setDentists(data.dentists);
      setSpecializations(data.specializations);
      setServices(data.services);
      setAppointmentTypes(data.appointmentTypes);
      setPatients(data.patients);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAppointment = async (appointmentData) => {
    try {
      if (!appointmentData.dentist || !appointmentData.service || !appointmentData.appointmentType) {
        throw new Error("Vui lòng chọn đầy đủ thông tin.");
      }

      const patientInfo = {
        first_name: appointmentData.firstName,
        last_name: appointmentData.lastName,
        email: appointmentData.email,
        phone: appointmentData.phone,
      };

      const patientInfoRes = await createPatientInformation(patientInfo);

      const user = JSON.parse(localStorage.getItem("user")) || {};
      let patientId = null;

      if (user && user.id) {
        const userPatient = patients.find(p => p.user_id === user.id);
        patientId = userPatient ? userPatient.id : null;
      }

      const appointmentTime = `${appointmentData.date}T${convertTo24HourTime(appointmentData.time)}`;

      const newAppointment = {
        patient_id: patientId,
        dentist_id: appointmentData.dentist.id,
        service_id: appointmentData.service.id,
        appointment_type_id: appointmentData.appointmentType.id,
        appointment_time: appointmentTime,
        reason: appointmentData.reason,
        status: "Đang chờ",
        patient_information_id: patientInfoRes.id,
      };

      return await createAppointment(newAppointment);
    } catch (error) {
      console.error("Lỗi khi gửi lịch hẹn:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAllDataFromAPI();
  }, []);

  return {
    dentists,
    services,
    specializations,
    appointmentTypes,
    patients,
    isLoading,
    error,
    fetchAllDataFromAPI,
    getAvailableDates: getAvailableDates,
    getTimeSlots: getTimeSlots,
    submitAppointment,
  };
};

export default useAppointmentServices;
