import { useState, useEffect } from 'react';
import { getPatientInformation, createPatientInformation } from '../services/patientInformationService';

const usePatientInformation = () => {
  const [patientInfo, setPatientInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatientInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatientInformation();
      // console.log('fetchPatientInfo - Dữ liệu:', data);
      setPatientInfo(data);
    } catch (err) {
      console.error('fetchPatientInfo - Lỗi:', err);
      setError(err.message || 'Không thể tải thông tin bệnh nhân.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientInfo();
  }, []);

  const createPatient = async (patientData) => {
    setLoading(true);
    setError(null);
    try {
      const newPatient = await createPatientInformation(patientData);
      console.log('createPatient - Phản hồi:', newPatient);
      if (!newPatient || !newPatient.id) {
        throw new Error('API không trả về ID hợp lệ.');
      }
      setPatientInfo((prev) => [...prev, newPatient]);
      return newPatient;
    } catch (err) {
      console.error('createPatient - Lỗi:', err);
      setError(err.message || 'Không thể tạo thông tin bệnh nhân.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    patientInfo,
    loading,
    error,
    createPatient,
    refetch: fetchPatientInfo,
  };
};

export default usePatientInformation;