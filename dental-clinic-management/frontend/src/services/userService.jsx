import axios from 'axios';

const API_URL = 'http://localhost:8080/dental-clinic';

export const loginUser = (username, id, password) => {
  return axios.post(`${API_URL}/login`, {
    username,
    id,
    password,
  });
};
