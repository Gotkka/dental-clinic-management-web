import { useState, useEffect } from 'react';
import axios from 'axios';

const useDentists = () => {
  const [dentists, setDentists] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Axios to fetch data
        const [dentistRes, specializationRes] = await Promise.all([
          axios.get('http://localhost:8080/dental-clinic/dentists'),
          axios.get('http://localhost:8080/dental-clinic/specializations'),
        ]);

        // If the response status is not successful, throw an error
        if (dentistRes.status !== 200 || specializationRes.status !== 200) {
          throw new Error('Không thể lấy dữ liệu');
        }

        // Extract data from response
        setDentists(dentistRes.data);
        setSpecializations(specializationRes.data);
      } catch (err) {
        console.error('Lỗi khi fetch:', err);
        setError('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dentists, specializations, loading, error };
};

export default useDentists;
