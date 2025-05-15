// usePatientInformation.jsx
import { useState, useEffect } from 'react';
import { getPatientInformation, createPatientInformation } from '../services/patientInformationService';

export default function usePatientInformation() {
    const [patientInfo, setPatientInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy thông tin bệnh nhân khi component mount
    useEffect(() => {
        const fetchPatientInfo = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getPatientInformation();
                setPatientInfo(data);
            } catch (err) {
                console.error('Lỗi khi lấy thông tin bệnh nhân:', err);
                setError(err.message || 'Không thể tải thông tin bệnh nhân.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientInfo();
    }, []);

    // Hàm tạo thông tin bệnh nhân
    const createPatient = async (patientData) => {
        setLoading(true);
        setError(null);
        try {
            const newPatient = await createPatientInformation(patientData);

            // Kiểm tra dữ liệu trả về từ API
            if (!newPatient || !newPatient.id) {
                throw new Error('API không trả về ID hợp lệ.');
            }

            // Cập nhật danh sách bệnh nhân
            setPatientInfo((prevState) => [...prevState, newPatient]);

            // Trả về bệnh nhân vừa được tạo
            return newPatient;
        } catch (err) {
            console.error('Lỗi khi tạo thông tin bệnh nhân:', err);
            setError(err.message || 'Không thể tạo thông tin bệnh nhân.');
            throw err; // Ném lỗi để xử lý ở nơi gọi hàm
        } finally {
            setLoading(false);
        }
    };

    return {
        patientInfo,
        loading,
        error,
        createPatient,
    };
}
