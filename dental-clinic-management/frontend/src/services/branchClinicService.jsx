import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dental-clinic/branchs';

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

export const getBranches = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all`, getAuthHeaders());
        // console.log('getBranches - Raw response:', response.data);
        return response.data;
    } catch (error) {
        console.error('getBranches - Error:', error.response?.data || error);
        throw error;
    }
};

export const createBranch = async (branch) => {
  const response = await axios.post(`${API_BASE_URL}`, branch);
  return response.data;
};

export const updateBranch = async (id, branch) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, branch);
  return response.data;
};

export const deleteBranch = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
