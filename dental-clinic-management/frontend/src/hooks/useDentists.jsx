import { getDentists } from '../services/dentistService';
import useFetchData from './useFetchData';

const useDentists = () => {
  const { data, isLoading, error, refetch } = useFetchData(getDentists);
  return { dentists: data || [], isLoading, error, refetch };
};

export default useDentists;
