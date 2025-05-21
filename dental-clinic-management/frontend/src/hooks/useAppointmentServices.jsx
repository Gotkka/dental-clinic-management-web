import { useState, useEffect } from 'react';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
} from '../services/appointmentService';
import { getAvailableDates, getTimeSlots, convertTo24HourTime } from '../utils/dateTimeUtils';


const useAppointmentServices = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
      setError(null);
    } catch {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  return {
    appointments,
    isLoading,
    error,
    refetch: fetchAllAppointments,
    createAppointment,
    updateAppointment,
    getAvailableDates,
    getTimeSlots,
    convertTo24HourTime,
  };
};

export default useAppointmentServices;
