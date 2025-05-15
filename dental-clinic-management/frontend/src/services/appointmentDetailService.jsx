import axios from 'axios';

const API_URL = 'http://localhost:8080/dental-clinic/appointments';

export const appointmentDetailService = async (id) => {
    return axios.get(`${API_URL}/${id}`);
  };