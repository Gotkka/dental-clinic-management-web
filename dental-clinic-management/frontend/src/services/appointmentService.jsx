import axios from 'axios';
import { formatDateTime } from '../utils/dateTimeUtils';

const API_BASE_URL = 'http://localhost:8080/dental-clinic/appointments';

// Create a dedicated debug utility
const debug = {
  log: (area, message, data) => {
    console.log(`[Appointment Service][${area}] ${message}`, data !== undefined ? data : '');
  },
  error: (area, message, error) => {
    console.error(`[Appointment Service][${area}] ${message}`, error);
    if (error?.response?.data) {
      console.error(`[Appointment Service][${area}] Server response:`, error.response.data);
    }
  },
  group: (area, message) => {
    console.group(`[Appointment Service][${area}] ${message}`);
  },
  groupEnd: () => {
    console.groupEnd();
  },
  table: (data) => {
    console.table(data);
  }
};

// Hàm lấy header Authorization từ token trong localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  debug.log('Auth', 'Using token', token ? 'Token exists' : 'No token found');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Lấy tất cả các cuộc hẹn: đang chờ, hoàn thành, hủy
export const getAppointments = async () => {
  debug.group('getAppointments', 'Starting to fetch all appointments');
  
  try {
    const startTime = performance.now();
    
    const [upcomingAppointments, pastAppointments, cancelledAppointments] = await axios.all([
      axios.get(`${API_BASE_URL}/upcoming`, getAuthHeaders()),
      axios.get(`${API_BASE_URL}/completed`, getAuthHeaders()),
      axios.get(`${API_BASE_URL}/cancelled`, getAuthHeaders()),
    ]);

    debug.log('getAppointments', 'Fetched counts', {
      upcoming: upcomingAppointments.data.length,
      past: pastAppointments.data.length,
      cancelled: cancelledAppointments.data.length
    });

    // Gán trạng thái và format thời gian cho từng cuộc hẹn
    const appointments = [
      ...upcomingAppointments.data.map((appointment) => ({
        ...appointment,
        status: 'Đang chờ',
        appointment_time: formatDateTime(appointment.appointment_time),
      })),
      ...pastAppointments.data.map((appointment) => ({
        ...appointment,
        status: 'Hoàn thành',
        appointment_time: formatDateTime(appointment.appointment_time),
      })),
      ...cancelledAppointments.data.map((appointment) => ({
        ...appointment,
        status: 'Hủy',
        appointment_time: formatDateTime(appointment.appointment_time),
      })),
    ];

    // Loại bỏ các cuộc hẹn trùng ID
    const uniqueAppointments = Array.from(
      new Map(appointments.map((item) => [item.id, item])).values()
    );

    const endTime = performance.now();
    debug.log('getAppointments', `Processed ${uniqueAppointments.length} unique appointments in ${(endTime - startTime).toFixed(2)}ms`);
    
    if (uniqueAppointments.length < appointments.length) {
      debug.log('getAppointments', `Removed ${appointments.length - uniqueAppointments.length} duplicate appointments`);
    }
    
    debug.groupEnd();
    return uniqueAppointments;
  } catch (error) {
    debug.error('getAppointments', 'Failed to fetch appointments', error);
    debug.groupEnd();
    throw error;
  }
};

// Tạo cuộc hẹn mới
export const createAppointment = async (appointmentData) => {
  debug.group('createAppointment', 'Creating new appointment');
  debug.log('createAppointment', 'Appointment data', appointmentData);
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/create-appointment`,
      appointmentData,
      getAuthHeaders()
    );
    
    debug.log('createAppointment', 'Success response', response.data);
    debug.groupEnd();
    return response.data;
  } catch (error) {
    debug.error('createAppointment', 'Failed to create appointment', error);
    debug.groupEnd();
    throw error;
  }
};

// Lấy các cuộc hẹn hiện có của bác sĩ trong khoảng 7 ngày từ ngày chọn
export const fetchExistingAppointments = async (dentistId, selectedDate = new Date()) => {
  console.groupCollapsed(`[Appointment Service][fetchExistingAppointments] Starting fetch for dentist ${dentistId}`);
  
  if (!dentistId) {
    console.error('[Appointment Service][fetchExistingAppointments] Aborting: Missing dentistId', { 
      received: dentistId,
      selectedDate: selectedDate.toISOString()
    });
    console.groupEnd();
    return { data: [] };
  }

  try {
    // Timezone calculations
    const offset = 7 * 60; // UTC+7 giờ Việt Nam
    const start = new Date(selectedDate);
    start.setMinutes(start.getMinutes() - start.getTimezoneOffset() + offset);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];
    
    console.log('[Appointment Service][fetchExistingAppointments] Date range calculated:', { 
      inputDate: selectedDate.toString(),
      timezoneAdjustedStart: start.toString(),
      queryStartDate: startDate,
      queryEndDate: endDate,
      daysCovered: Math.round((end - start) / (1000 * 60 * 60 * 24)),
      timezoneOffset: start.getTimezoneOffset(),
      vietnamOffset: offset
    });

    const params = {
      start_date: startDate,
      end_date: endDate,
      dentist_id: dentistId,
    };

    console.log('[Appointment Service][fetchExistingAppointments] Request parameters:', params);
    
    // Auth debug
    const authHeaders = getAuthHeaders();
    console.log('[Appointment Service][Auth] Using token', authHeaders?.headers?.Authorization 
      ? 'Token exists' 
      : 'No token found');

    const response = await axios.get(`${API_BASE_URL}/existing`, {
      params,
      ...authHeaders,
    });

    // Response analysis
    const rawData = response.data.data || [];
    console.log('[Appointment Service][fetchExistingAppointments] Raw response data:', {
      status: response.status,
      count: rawData.length,
      firstItem: rawData[0] || 'Empty',
      lastItem: rawData[rawData.length - 1] || 'Empty',
      datesCovered: [...new Set(rawData.map(item => item.appointment_time?.split('T')[0]))]
    });

    // Data processing
    const appointments = Array.isArray(rawData) ? rawData : [];
    const uniqueAppointments = Array.from(
      new Map(appointments.map((appt) => [appt.id, appt])).values()
    );

    // Debug chi tiết từng cuộc hẹn
    console.groupCollapsed(`[Appointment Service][fetchExistingAppointments] Chi tiết tất cả cuộc hẹn (${uniqueAppointments.length} cuộc)`);
    uniqueAppointments.forEach((appt, idx) => {
      console.log(`  [${idx + 1}] ID: ${appt.id} | Thời gian: ${appt.appointment_time} | Thời lượng: ${appt.service_duration || 'Không có'} phút | Trạng thái: ${appt.status || 'Không có'}`);
    });
    console.groupEnd();
    
    console.log('[Appointment Service][fetchExistingAppointments] Processed appointments:', {
      totalReceived: appointments.length,
      uniqueCount: uniqueAppointments.length,
      duplicatesRemoved: appointments.length - uniqueAppointments.length,
      sampleAppointments: uniqueAppointments.slice(0, 3).map(a => ({
        id: a.id,
        date: a.appointment_time?.split('T')[0],
        time: a.appointment_time?.split('T')[1]?.substring(0, 5)
      }))
    });
    
    console.groupEnd();
    return { data: uniqueAppointments };
  } catch (error) {
    console.error('[Appointment Service][fetchExistingAppointments] Failed to fetch:', {
      error: error.response?.data || error.message,
      config: error.config,
      status: error.response?.status
    });
    console.groupEnd();
    return { data: [], error };
  }
};

// --- Hàm mới: Lấy danh sách các slot lịch khả dụng (các khung giờ có thể đặt) của bác sĩ trong khoảng thời gian ---
export const fetchAvailableSlots = async (dentistId, startDate, endDate) => {
  debug.group('fetchAvailableSlots', `Fetching available slots for dentist ${dentistId}`);
  debug.log('fetchAvailableSlots', 'Date range', { startDate, endDate });

  if (!dentistId) {
    debug.error('fetchAvailableSlots', 'Missing dentistId');
    debug.groupEnd();
    return { data: [] };
  }
  if (!startDate || !endDate) {
    debug.error('fetchAvailableSlots', 'Missing startDate or endDate');
    debug.groupEnd();
    return { data: [] };
  }

  try {
    const params = {
      dentist_id: dentistId,
      start_date: startDate,
      end_date: endDate,
    };

    debug.log('fetchAvailableSlots', 'Request parameters', params);

    const response = await axios.get(`${API_BASE_URL}/available-slots`, {
      params,
      ...getAuthHeaders(),
    });

    const slots = response.data.data || [];
    debug.log('fetchAvailableSlots', `Received ${slots.length} available slots`);
    debug.table(slots);

    debug.groupEnd();
    return { data: slots };
  } catch (error) {
    debug.error('fetchAvailableSlots', 'Failed to fetch available slots', error);
    debug.groupEnd();
    return { data: [], error };
  }
};

// Cập nhật cuộc hẹn theo id
export const updateAppointment = async (appointmentId, updateData) => {
  debug.group('updateAppointment', `Updating appointment ${appointmentId}`);
  debug.log('updateAppointment', 'Update data', updateData);
  
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${appointmentId}`,
      updateData,
      getAuthHeaders()
    );
    
    debug.log('updateAppointment', 'Success response', response.data);
    debug.groupEnd();
    return response.data;
  } catch (error) {
    debug.error('updateAppointment', 'Failed to update appointment', error);
    debug.groupEnd();
    throw error;
  }
};

// Lấy chi tiết cuộc hẹn theo id
export const getAppointmentDetail = async (id) => {
  debug.group('getAppointmentDetail', `Fetching details for appointment ${id}`);
  
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeaders());
    debug.log('getAppointmentDetail', 'Appointment details', response.data);
    debug.groupEnd();
    return response.data;
  } catch (error) {
    debug.error('getAppointmentDetail', 'Failed to fetch appointment details', error);
    debug.groupEnd();
    throw error;
  }
};

// Xóa cuộc hẹn theo id
export const deleteAppointment = async (appointmentId) => {
  debug.group('deleteAppointment', `Deleting appointment ${appointmentId}`);
  
  try {
    const response = await axios.delete(`${API_BASE_URL}/${appointmentId}`, getAuthHeaders());
    debug.log('deleteAppointment', 'Success response', response.data);
    debug.groupEnd();
    return response.data;
  } catch (error) {
    debug.error('deleteAppointment', 'Failed to delete appointment', error);
    debug.groupEnd();
    throw error;
  }
};

// Lấy lịch hẹn của user theo userId
export const getUserAppointments = async (userId) => {
  debug.group('getUserAppointments', `Fetching appointments for user ${userId}`);

  if (!userId || isNaN(userId)) {
    debug.error('getUserAppointments', 'Invalid userId', { userId });
    debug.groupEnd();
    throw new Error('ID người dùng không hợp lệ');
  }

  try {
    debug.log('getUserAppointments', 'Request URL', `${API_BASE_URL}/patient/${userId}`);
    const response = await axios.get(`${API_BASE_URL}/patient/${userId}`, getAuthHeaders());

    const appointments = response.data.data || response.data || [];
    debug.log('getUserAppointments', `Received ${appointments.length} appointments`, {
      sample: appointments.slice(0, 3).map(a => ({
        id: a.id,
        time: a.appointment_time,
        status: a.status,
      })),
    });

    // Format appointment_time giống các hàm khác
    const formattedAppointments = appointments.map(appointment => ({
      ...appointment,
      status: appointment.status || 'Chờ xác nhận',
      appointment_time: formatDateTime(appointment.appointment_time),
    }));

    debug.groupEnd();
    return formattedAppointments;
  } catch (error) {
    debug.error('getUserAppointments', 'Failed to fetch user appointments', error);
    debug.groupEnd();
    throw error;
  }
};

export const getAppointmentFilterByDate = async (startDate, endDate) => {
  debug.group('getAppointmentFilterByDate', 'Date filter');
  debug.log('getAppointmentFilterByDate', 'Date range', { startDate, endDate });
  
  try {
    const response = await axios.get(`${API_BASE_URL}/filter`, {
      params: {
        from: startDate,
        to: endDate,
      },
      ...getAuthHeaders(),
    });
    
    debug.log('getAppointmentFilterByDate', `Found ${response.data.appointments?.length || 0} appointments`);
    debug.groupEnd();
    return response.data.appointments;
  } catch (error) {
    debug.error('getAppointmentFilterByDate', 'Failed to filter appointments by date', error);
    debug.groupEnd();
    throw error;
  }
};