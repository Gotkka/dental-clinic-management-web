import { useState, useEffect } from 'react';
import { getAppointments } from '../services/appointmentService'; 

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