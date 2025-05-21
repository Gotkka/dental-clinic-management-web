import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic';

export const getPatients = async () => {
  const response = await axios.get(`${API_BASE_URL}/patients`);
  return response.data;
};

