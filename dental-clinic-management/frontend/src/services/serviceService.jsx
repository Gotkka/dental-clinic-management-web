import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic/services';

export const getServices = async () => {
  const response = await axios.get(`${API_BASE_URL}/all`);
  return response.data;
};

export const createService = async (data) => {
  const response = await axios.post(API_BASE_URL, data);
  return response.data;
};

export const updateService = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
