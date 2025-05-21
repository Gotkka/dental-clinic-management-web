import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic';

export const loginUser = async (username, password) => {
  return axios.post(`${API_BASE_URL}/login`, { username, password });
};

export const registerUser = async (userData) => {
  return axios.post(`${API_BASE_URL}/register`, userData);
};
