import { useState, useEffect } from 'react';

const useFetchData = (fetchFunction) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchFunction();
      setData(result);
      setError(null);
    } catch {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchFunction]);

  return { data, isLoading, error, refetch: fetchData };
};

export default useFetchData;
