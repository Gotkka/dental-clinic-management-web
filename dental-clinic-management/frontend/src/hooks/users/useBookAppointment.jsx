import { useState, useEffect, useCallback } from 'react';
import {
  createAppointment,
  fetchExistingAppointments,
} from '../../services/appointmentService';
import { getServices } from '../../services/serviceService';
import { getDentists } from '../../services/dentistService';
import { getAppointmentTypes } from '../../services/appointmentTypeService';
import { getSpecializations } from '../../services/specializationService';
import { getPatients } from '../../services/patientService';
import { createPatientInformation } from '../../services/patientInformationService';

export function useBookAppointment() {
  const [dentistId, setDentistId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdAppointment, setCreatedAppointment] = useState(null);

  // Load services
  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getServices();
      console.log('Loaded services:', result);
      setServices(result || []);
    } catch (e) {
      console.error('Error loading services:', e);
      setError(e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load dentists
  const loadDentists = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getDentists();
      setDentists(result || []);
    } catch (e) {
      console.error('Error loading dentists:', e);
      setError(e);
      setDentists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load specializations
  const loadSpecializations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSpecializations();
      setSpecializations(result || []);
    } catch (e) {
      console.error('Error loading specializations:', e);
      setError(e);
      setSpecializations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load appointment types
  const loadAppointmentTypes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAppointmentTypes();
      setAppointmentTypes(result || []);
    } catch (e) {
      console.error('Error loading appointment types:', e);
      setError(e);
      setAppointmentTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load patients
  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPatients();
      setPatients(result || []);
    } catch (e) {
      console.error('Error loading patients:', e);
      setError(e);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load existing appointments for a dentist on a specific date
  const loadExistingAppointments = useCallback(async (dentistIdParam, dateParam) => {
    if (!dentistIdParam || !dateParam) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchExistingAppointments(dentistIdParam, dateParam);
      if (result.error) {
        setError(result.error);
        setExistingAppointments([]);
      } else {
        setExistingAppointments(result.data || []);
      }
    } catch (e) {
      console.error('Error loading existing appointments:', e);
      setError(e);
      setExistingAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new appointment
  const submitAppointment = useCallback(
    async (appointmentData) => {
      setLoading(true);
      setError(null);
      try {
        // Validate required fields
        if (!appointmentData.service?.id || !services.some((s) => s.id === appointmentData.service.id)) {
          throw new Error('Dịch vụ không hợp lệ hoặc không tồn tại.');
        }
        if (!appointmentData.dentist?.id) {
          throw new Error('Vui lòng chọn nha sĩ.');
        }
        if (!appointmentData.patientId) {
          throw new Error('Vui lòng chọn bệnh nhân.');
        }
        if (!appointmentData.appointmentType?.id) {
          throw new Error('Vui lòng chọn loại cuộc hẹn.');
        }
        if (!appointmentData.time) {
          throw new Error('Vui lòng chọn thời gian cuộc hẹn.');
        }

        // Create patient information
        const patientInfoData = {
          first_name: appointmentData.firstName || '',
          last_name: appointmentData.lastName || '',
          email: appointmentData.email || '',
          phone: appointmentData.phone || '',
          is_new_patient: true, // Default as per backend model
        };
        console.log('Creating patient information with data:', patientInfoData);
        const patientInfo = await createPatientInformation(patientInfoData);
        console.log('Patient information created:', patientInfo);

        // Format appointment data to match backend Appointment model
        const formattedData = {
          patient_id: appointmentData.patientId,
          dentist_id: appointmentData.dentist.id,
          service_id: appointmentData.service.id,
          appointment_type_id: appointmentData.appointmentType.id,
          appointment_time: appointmentData.time, // ISO string
          reason: appointmentData.reason || '',
          patient_information_id: patientInfo.id,
          // Note: status and created_at are handled by the backend
        };
        console.log('Formatted appointmentData for API:', formattedData);

        const newAppointment = await createAppointment(formattedData);
        console.log('Appointment created:', newAppointment);
        setCreatedAppointment(newAppointment);
        return newAppointment;
      } catch (e) {
        console.error('Error submitting appointment:', e);
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [services]
  );

  // Generate time slots based on service duration
  const generateTimeSlots = useCallback(
    (serviceId, selectedDate) => {
      if (!serviceId || !selectedDate) return [];

      const service = services.find((s) => s.id === serviceId);
      if (!service || !service.duration) {
        console.warn('Service not found or missing duration:', serviceId);
        return [];
      }

      const duration = service.duration || 30; // Fallback duration
      const timeSlots = [];
      const startHour = 8; // 8:00 AM
      const endHour = 17; // 5:00 PM
      const startTime = new Date(selectedDate);
      startTime.setHours(startHour, 0, 0, 0);

      while (startTime.getHours() < endHour) {
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

        const isBooked = existingAppointments.some((appointment) => {
          const apptStart = new Date(appointment.appointment_time);
          const apptEnd = new Date(
            apptStart.getTime() + (appointment.service_duration || duration) * 60 * 1000
          );
          return (
            (startTime >= apptStart && startTime < apptEnd) ||
            (endTime > apptStart && endTime <= apptEnd) ||
            (startTime <= apptStart && endTime >= apptEnd)
          );
        });

        if (!isBooked) {
          timeSlots.push({
            start: startTime.toISOString(),
            end: endTime.toISOString(),
            display: `${startTime.getHours()}:${startTime
              .getMinutes()
              .toString()
              .padStart(2, '0')}`,
          });
        }

        startTime.setTime(startTime.getTime() + duration * 60 * 1000);
      }

      return timeSlots;
    },
    [services, existingAppointments]
  );

  // Get available dates (next 7 days)
  const getAvailableDates = useCallback(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  // Load data on mount
  useEffect(() => {
    loadServices();
    loadDentists();
    loadSpecializations();
    loadAppointmentTypes();
    loadPatients();
  }, [loadServices, loadDentists, loadSpecializations, loadAppointmentTypes, loadPatients]);

  // Load existing appointments when dentistId or selectedDate changes
  useEffect(() => {
    if (dentistId && selectedDate) {
      loadExistingAppointments(dentistId, selectedDate);
    }
  }, [dentistId, selectedDate, loadExistingAppointments]);

  return {
    dentistId,
    setDentistId,
    selectedDate,
    setSelectedDate,
    existingAppointments,
    services,
    dentists,
    specializations,
    appointmentTypes,
    patients,
    loading,
    error,
    submitAppointment,
    createdAppointment,
    generateTimeSlots,
    getAvailableDates,
  };
}