import { serviceService } from '../services/serviceService';
import useFetchData from './useFetchData';

const useServices = () => {
  const { data: services, isLoading, error } = useFetchData(serviceService);

  return { services, isLoading, error };
};

export default useServices;
