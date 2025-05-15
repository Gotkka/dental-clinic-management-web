import { dentistService } from '../services/dentistService';
import useFetchData from './useFetchData';

const useDentists = () => {
  const { data: dentists, isLoading, error } = useFetchData(dentistService);

  return { dentists, isLoading, error };
};

export default useDentists;
