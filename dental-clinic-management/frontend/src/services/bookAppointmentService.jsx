// services/bookAppointmentService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic';

export const fetchAllData = async () => {
  try {
    const [
      dentistsResponse, 
      specializationsResponse, 
      servicesResponse, 
      appointmentTypesResponse, 
      patientsResponse
    ] = await Promise.all([
      axios.get(`${API_BASE_URL}/dentists`),
      axios.get(`${API_BASE_URL}/specializations`),
      axios.get(`${API_BASE_URL}/services`),
      axios.get(`${API_BASE_URL}/appointment-types`),
      axios.get(`${API_BASE_URL}/patients`)
    ]);
    
    return {
      dentists: dentistsResponse.data,
      specializations: specializationsResponse.data,
      services: servicesResponse.data,
      appointmentTypes: appointmentTypesResponse.data,
      patients: patientsResponse.data
    };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    throw error;
  }
};

export const createPatientInformation = async (patientInfo) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/create-patient-information`,
      patientInfo
    );
    return data;
  } catch (error) {
    console.error('Lỗi khi tạo thông tin bệnh nhân:', error);
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/create-appointment`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo cuộc hẹn:', error);
    throw error;
  }
};
