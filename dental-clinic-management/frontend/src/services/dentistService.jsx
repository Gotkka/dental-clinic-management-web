import axios from "axios";

const API_BASE_URL = "http://localhost:8080/dental-clinic/dentists";

export const getDentists = async () => {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
};

export const createDentist = async (dentist) => {
    console.log("Sending dentist data:", dentist); // Log để kiểm tra dữ liệu gửi đi
    const response = await axios.post(`${API_BASE_URL}`, dentist);
    return response.data;
};

export const updateDentist = async (id, dentist) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, dentist);
    return response.data;
};

export const deleteDentist = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};