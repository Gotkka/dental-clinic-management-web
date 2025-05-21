import { getSpecializations } from '../services/specializationService';
import useFetchData from './useFetchData';

const useSpecializations = () => {
  const { data: specializations, isLoading, error, refetch } = useFetchData(getSpecializations);
  return { specializations, isLoading, error, refetch };
};

export default useSpecializations;
