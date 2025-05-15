import { useState } from 'react';
import useDentists from './useDentists';
import useBranchClinics from './useBranchClinics';
import useAppointmentTypes from './useAppointmentTypes';
import useServices from './useServices';
import usePatients from './usePatients';
import useSpecializations from './useSpecializations';
import useExistingAppointments from './useExistingAppointments';

import { fetchAllData } from '../services/bookAppointmentService';
import { createAppointment } from '../services/appointmentService';
import { createPatientInformation } from '../services/patientInformationService';
import { convertTo24HourTime } from '../utils/dateTimeUtils';

const useBookAppointment = (dentistId = null) => {
  const { dentists, isLoading: dentistsLoading, error: dentistsError } = useDentists();
  const { services, isLoading: servicesLoading, error: servicesError } = useServices();
  const { specializations, isLoading: specializationsLoading, error: specializationsError } = useSpecializations();
  const { appointmentTypes, isLoading: appointmentTypesLoading, error: appointmentTypesError } = useAppointmentTypes();
  const { patients, isLoading: patientsLoading, error: patientsError } = usePatients();
  const { branchClinics, isLoading: branchClinicsLoading, error: branchClinicsError } = useBranchClinics();
  const { existingAppointments, isLoading: appointmentsLoading, error: appointmentsError } = useExistingAppointments(dentistId);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allData, setAllData] = useState({
    dentists: [],
    specializations: [],
    services: [],
    appointmentTypes: [],
    patients: [],
    branchClinics: [],
  });

  const fetchAllDataFromAPI = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllData();
      console.log('Dữ liệu từ fetchAllData:', data);
      setAllData({
        dentists: data.dentists || [],
        specializations: data.specializations || [],
        services: data.services || [],
        appointmentTypes: data.appointmentTypes || [],
        patients: data.patients || [],
        branchClinics: data.branchClinics || [],
      });
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const isTimeSlotAvailable = (selectedDateTime, appointmentData) => {
    return !existingAppointments.some((appointment) => {
      const apptDateTime = new Date(appointment.appointment_time).getTime();
      const selectedDateTimeMillis = new Date(selectedDateTime).getTime();
      return (
        apptDateTime === selectedDateTimeMillis &&
        appointment.dentist_id === appointmentData.dentist?.id &&
        appointment.status === 'Đang chờ'
      );
    });
  };

  const isAnyLoading =
    dentistsLoading ||
    servicesLoading ||
    specializationsLoading ||
    appointmentTypesLoading ||
    patientsLoading ||
    branchClinicsLoading ||
    isLoading ||
    appointmentsLoading;

  const combinedError =
    error ||
    dentistsError ||
    servicesError ||
    specializationsError ||
    appointmentTypesError ||
    patientsError ||
    branchClinicsError ||
    appointmentsError;

  const submitAppointment = async (appointmentData) => {
    try {
      if (!appointmentData.dentist || !appointmentData.service || !appointmentData.appointmentType || !appointmentData.branchClinic) {
        throw new Error('Vui lòng chọn đầy đủ thông tin: nha sĩ, dịch vụ, loại lịch hẹn, và chi nhánh.');
      }

      const patientInfo = {
        first_name: appointmentData.firstName,
        last_name: appointmentData.lastName,
        email: appointmentData.email,
        phone: appointmentData.phone,
      };

      const patientInfoRes = await createPatientInformation(patientInfo);

      const user = JSON.parse(localStorage.getItem('user')) || {};
      let patientId = null;

      if (user && user.id) {
        const userPatient = patients.find((p) => p.user_id === user.id);
        patientId = userPatient ? userPatient.id : null;
      }

      if (!patientId) {
        throw new Error('Không tìm thấy ID bệnh nhân. Vui lòng đăng nhập hoặc kiểm tra dữ liệu bệnh nhân.');
      }

      const appointmentTime = `${appointmentData.date}T${convertTo24HourTime(appointmentData.time)}`;

      const newAppointment = {
        patient_id: patientId,
        dentist_id: appointmentData.dentist.id,
        service_id: appointmentData.service.id,
        appointment_type_id: appointmentData.appointmentType.id,
        branch_clinic_id: appointmentData.branchClinic.id,
        appointment_time: appointmentTime,
        reason: appointmentData.reason || 'Không có lý do cụ thể',
        status: 'Đang chờ',
        patient_information_id: patientInfoRes.id,
      };

      console.log('Dữ liệu gửi tạo lịch hẹn:', newAppointment);
      await createAppointment(newAppointment);
      return newAppointment;
    } catch (error) {
      console.error('Lỗi khi gửi lịch hẹn:', error);
      throw new Error(error.message || 'Lỗi khi tạo lịch hẹn. Vui lòng thử lại.');
    }
  };

  return {
    dentists: Array.isArray(allData.dentists) && allData.dentists.length > 0 ? allData.dentists : dentists || [],
    services: Array.isArray(allData.services) && allData.services.length > 0 ? allData.services : services || [],
    specializations: Array.isArray(allData.specializations) && allData.specializations.length > 0 ? allData.specializations : specializations || [],
    appointmentTypes: Array.isArray(allData.appointmentTypes) && allData.appointmentTypes.length > 0 ? allData.appointmentTypes : appointmentTypes || [],
    patients: Array.isArray(allData.patients) && allData.patients.length > 0 ? allData.patients : patients || [],
    branchClinics: Array.isArray(allData.branchClinics) && allData.branchClinics.length > 0 ? allData.branchClinics : branchClinics || [],
    existingAppointments: existingAppointments || [],
    isLoading: isAnyLoading,
    error: combinedError,
    fetchAllDataFromAPI,
    submitAppointment,
    isTimeSlotAvailable,
  };
};

export default useBookAppointment;