import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic/appointments';

export const getAppointments = async () => {
  try {
    const [upcomingAppointments, pastAppointments, cancelledAppointments] = await axios.all([
      axios.get(`${API_BASE_URL}/upcoming`),
      axios.get(`${API_BASE_URL}/completed`),
      axios.get(`${API_BASE_URL}/cancelled`)
    ]);

    const appointments = [
      ...upcomingAppointments.data.map(appointment => ({ ...appointment, status: 'Đang chờ' })),
      ...pastAppointments.data.map(appointment => ({ ...appointment, status: 'Hoàn thành' })),
      ...cancelledAppointments.data.map(appointment => ({ ...appointment, status: 'Hủy' }))
    ];

    const uniqueAppointments = Array.from(
      new Map(appointments.map(item => [item.id, item])).values()
    );

    return uniqueAppointments;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu lịch hẹn:", error);
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    console.log('Sending appointmentData to API:', appointmentData);
    const response = await axios.post(
      `${API_BASE_URL}/create-appointment`,
      appointmentData
    );
    console.log('createAppointment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo cuộc hẹn:', error);
    throw error;
  }
};

export const fetchExistingAppointments = async (dentistId = null) => {
  try {
    const startDate = new Date().toISOString().split('T')[0]; // 2025-05-13
    const endDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]; // 2025-05-20

    const params = {
      start_date: startDate,
      end_date: endDate,
    };
    if (dentistId) params.dentist_id = dentistId;

    const response = await axios.get(`${API_BASE_URL}/existing`, { params });
    const appointments = response.data.data || [];

    const uniqueAppointments = Array.from(
      new Map(appointments.map((appt) => [appt.id, appt])).values()
    );

    console.log('Dữ liệu existingAppointments từ API:', uniqueAppointments);
    return { data: uniqueAppointments };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu lịch hẹn:', error);
    throw error;
  }
};