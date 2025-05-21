import { useState, useEffect } from 'react';
import {
  getAppointments,
  getUserAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentFilterByDate,
} from '../services/appointmentService';
import { format } from 'date-fns';

// Admin: lấy tất cả cuộc hẹn
export function useAllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    console.log('Fetching all appointments...');
    setLoading(true);
    setError(null);
    try {
      const res = await getAppointments();
      console.log('Fetched appointments:', res);
      setAppointments(res);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err?.message || 'Lỗi khi tải danh sách cuộc hẹn');
      setAppointments([]);
    } finally {
      console.log('Finished loading appointments, loading:', false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return { appointments, loading, error, refetch: fetchAppointments };
}

// User: chỉ lấy cuộc hẹn của user hiện tại
export function useUserAppointments(userId) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    console.log('Fetching user appointments for userId:', userId);
    setLoading(true);
    setError(null);
    try {
      const res = await getUserAppointments(userId);
      console.log('Fetched user appointments:', res);
      setAppointments(res);
    } catch (err) {
      console.error('Error fetching user appointments:', err);
      setError(err?.message || 'Lỗi khi tải cuộc hẹn của bạn');
      setAppointments([]);
    } finally {
      console.log('Finished loading user appointments, loading:', false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchAppointments();
  }, [userId]);

  return { appointments, loading, error, refetch: fetchAppointments };
}

// Dùng chung cho cả admin và user
export function useCreateAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNewAppointment = async (appointmentData) => {
    console.log('Creating new appointment with data:', appointmentData);
    setLoading(true);
    setError(null);
    try {
      const response = await createAppointment(appointmentData);
      console.log('Successfully created appointment:', response);
      return response;
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err?.message || 'Lỗi khi tạo cuộc hẹn');
      throw err;
    } finally {
      console.log('Finished creating appointment, loading:', false);
      setLoading(false);
    }
  };

  return { createNewAppointment, loading, error };
}

export function useUpdateAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAppointmentById = async (appointmentId, updateData) => {
    console.log('Updating appointment ID:', appointmentId, 'with data:', updateData);
    setLoading(true);
    setError(null);
    try {
      const response = await updateAppointment(appointmentId, updateData);
      console.log('Successfully updated appointment:', response);
      return response;
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError(err?.message || 'Lỗi khi cập nhật cuộc hẹn');
      throw err;
    } finally {
      console.log('Finished updating appointment, loading:', false);
      setLoading(false);
    }
  };

  return { updateAppointmentById, loading, error };
}

export function useDeleteAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteAppointmentById = async (appointmentId) => {
    console.log('Deleting appointment ID:', appointmentId);
    setLoading(true);
    setError(null);
    try {
      await deleteAppointment(appointmentId);
      console.log('Successfully deleted appointment ID:', appointmentId);
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError(err?.message || 'Lỗi khi xóa cuộc hẹn');
      throw err;
    } finally {
      console.log('Finished deleting appointment, loading:', false);
      setLoading(false);
    }
  };

  return { deleteAppointmentById, loading, error };
}

export function useFilteredAppointments(startDate, endDate) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFilteredAppointments = async () => {
    if (!startDate || !endDate) {
      console.log('No startDate or endDate provided, skipping fetch');
      return;
    }

    console.log('Fetching filtered appointments for range:', { startDate, endDate });
    setLoading(true);
    setError(null);

    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      console.log('Formatted dates:', { formattedStartDate, formattedEndDate });

      const res = await getAppointmentFilterByDate(formattedStartDate, formattedEndDate);
      console.log('Fetched filtered appointments:', res);
      setAppointments(res);
    } catch (err) {
      console.error('Error fetching filtered appointments:', err?.response?.data || err);
      const errorMessage = err?.response?.data?.error || err?.message || 'Lỗi khi lọc cuộc hẹn theo ngày';
      setError(errorMessage);
      setAppointments([]);
    } finally {
      console.log('Finished loading filtered appointments, loading:', false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredAppointments();
  }, [startDate, endDate]);

  return { appointments, loading, error, refetch: fetchFilteredAppointments };
}

