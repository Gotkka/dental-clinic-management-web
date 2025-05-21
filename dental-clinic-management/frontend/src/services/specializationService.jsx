import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic/specializations';

export const getSpecializations = async () => {
  const response = await axios.get(`${API_BASE_URL}/all`);
  return response.data;
};

export const createSpecialization = async (specialization) => {
  const response = await axios.post(`${API_BASE_URL}`, specialization);
  return response.data;
}

export const updateSpecialization = async (id, specialization) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, specialization);
  return response.data;
}

export const deleteSpecialization = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
