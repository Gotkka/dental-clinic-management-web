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

        // Loại bỏ trùng lặp dựa trên id
        const uniqueAppointments = Array.from(
            new Map(appointments.map(item => [item.id, item])).values()
        );

        return uniqueAppointments;

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lịch hẹn:", error);
        throw error;
    }
};