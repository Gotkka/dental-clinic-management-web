import { useState, useEffect } from 'react';
import { fetchExistingAppointments } from '../services/appointmentService';

const useExistingAppointments = (dentistId = null) => {
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    console.groupCollapsed(`[useExistingAppointments] Fetching appointments for dentist ${dentistId}`);
    console.time('Fetch duration');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('[useExistingAppointments] Starting fetch...');
      const { data, error } = await fetchExistingAppointments(dentistId);
      
      if (error) throw error;
      
      console.log('[useExistingAppointments] Fetch successful. Data summary:', {
        count: data.length,
        dates: [...new Set(data.map(a => a.appointment_time?.split('T')[0]))],
        sample: data.slice(0, 3).map(a => a.appointment_time)
      });
      
      setExistingAppointments(data || []);
    } catch (err) {
      const errorMsg =
        err?.response?.status === 403
          ? 'Không có quyền truy cập danh sách lịch hẹn.'
          : err?.response?.status === 503
          ? 'Server đang bận, vui lòng thử lại sau.'
          : err.message || 'Lỗi kết nối server';
      
      console.error('[useExistingAppointments] Fetch error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      
      setError(errorMsg);
      setExistingAppointments([]);
    } finally {
      console.timeEnd('Fetch duration');
      console.log('[useExistingAppointments] Final state:', {
        isLoading: false,
        itemsCount: existingAppointments.length,
        error: error
      });
      console.groupEnd();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!dentistId) {
      console.log('[useExistingAppointments] Skipping fetch: dentistId is null or undefined');
      setExistingAppointments([]);
      setError(null);
      setIsLoading(false);
      return;
    }
    
    console.log(`[useExistingAppointments] Effect triggered for dentistId: ${dentistId}`);
    fetchData();
  }, [dentistId]);

  return { 
    existingAppointments, 
    isLoading, 
    error, 
    refetch: () => {
      console.log('[useExistingAppointments] Manual refetch triggered');
      fetchData();
    }
  };
};

export default useExistingAppointments;