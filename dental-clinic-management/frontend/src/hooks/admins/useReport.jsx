import { useMemo } from 'react';
import { useAllAppointments, useFilteredAppointments } from '../useAppointments';
import useDentists from '../useDentists';

// Normalize status (exported for reuse)
export const normalizeStatus = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Đang chờ';
    case 'CONFIRMED':
      return 'Đã xác nhận';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'CANCELLED':
      return 'Hủy';
    default:
      return status;
  }
};

const useReport = (startDate, endDate) => {
  // Fetch data
  const { appointments, loading: appointmentsLoading, error: appointmentsError, refetch: refetchAll } = useAllAppointments();
  const { appointments: filteredAppointments, loading: filteredLoading, error: filteredError, refetch: refetchFiltered } = useFilteredAppointments(startDate, endDate);
  const { dentists, isLoading: dentistsLoading, error: dentistsError } = useDentists();

  // Select data based on date range
  const rawAppointments = startDate && endDate ? filteredAppointments : appointments;

  // Process report data
  const reportData = useMemo(() => {
    const processedAppointments = rawAppointments.map((appointment) => ({
      ...appointment,
      status: normalizeStatus(appointment.status),
    }));

    // Total appointments
    const totalAppointments = processedAppointments.length;

    // Status breakdown
    const statusBreakdown = {
      'Đang chờ': 0,
      'Đã xác nhận': 0,
      'Hoàn thành': 0,
      'Hủy': 0,
    };
    processedAppointments.forEach((appt) => {
      statusBreakdown[appt.status] = (statusBreakdown[appt.status] || 0) + 1;
    });

    // Appointments by dentist
    const appointmentsByDentist = {};
    processedAppointments.forEach((appt) => {
      const dentist = dentists?.find((d) => d.id === appt.dentist_id);
      const dentistName = dentist?.full_name || 'Không xác định';
      appointmentsByDentist[dentistName] = (appointmentsByDentist[dentistName] || 0) + 1;
    });

    return {
      totalAppointments,
      statusBreakdown,
      appointmentsByDentist,
    };
  }, [rawAppointments, dentists]);

  // Combine loading and error states
  const loading = appointmentsLoading || filteredLoading || dentistsLoading;
  const error = appointmentsError || filteredError || dentistsError;

  // Refetch function
  const refetch = () => {
    refetchAll();
    if (startDate && endDate) refetchFiltered();
  };

  return {
    reportData,
    rawAppointments,
    dentists,
    loading,
    error,
    refetch,
  };
};

export default useReport;