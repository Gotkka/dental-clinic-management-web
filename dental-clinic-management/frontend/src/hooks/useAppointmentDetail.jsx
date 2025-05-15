import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { appointmentDetailService } from '../services/appointmentDetailService';

export function useAppointmentDetail() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      setLoading(true);
      try {
        const response = await appointmentDetailService(id);
        console.log('Appointment Detail:', response.data);
        setAppointment(response.data);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi tải thông tin lịch hẹn');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointmentDetail();
    }
  }, [id]);

  return { appointment, loading, error };
}