import { useState, useEffect } from 'react';
import { fetchExistingAppointments } from '../services/appointmentService';

const useExistingAppointments = (dentistId = null) => {
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchExistingAppointments(dentistId);
      const appointments = response.data || [];
      setExistingAppointments(appointments);
      console.log('Dữ liệu existingAppointments từ API:', appointments);
    } catch (err) {
      console.error('Lỗi khi lấy existingAppointments:', err);
      setError(err.message || 'Không thể tải danh sách lịch hẹn.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAppointments = async () => {
    try {
      await fetchData();
      console.log('Danh sách lịch hẹn đã được làm mới.');
    } catch (error) {
      console.error('Lỗi khi tải lại danh sách lịch hẹn:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dentistId]);

  return { existingAppointments, isLoading, error, refetch: fetchData, refreshAppointments };
};

export default useExistingAppointments;