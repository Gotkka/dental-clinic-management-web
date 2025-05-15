import { useState, useEffect } from 'react';
import { getAppointments, createAppointment } from '../services/appointmentService'; 

export default function useAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getAppointments();
                console.log("Raw API response:", JSON.stringify(res, null, 2));
                setAppointments(res);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return { appointments, loading, error };
}

export function useCreateAppointment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createNewAppointment = async (appointmentData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAppointment(appointmentData);
            console.log("Appointment created successfully:", response);
            return response;
        } catch (err) {
            setError(err);
            console.error('Lỗi khi tạo cuộc hẹn:', err);
        } finally {
            setLoading(false);
        }
    };

    return { createNewAppointment, loading, error };
}