import { getServices } from '../services/serviceService';
import useFetchData from './useFetchData';

const useServices = () => {
  const { data: services, isLoading, error, refetch } = useFetchData(getServices);
  return { services, isLoading, error, refetch };
};

export default useServices;
