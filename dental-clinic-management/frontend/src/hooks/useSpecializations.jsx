import { specializationService } from '../services/specializationService';
import useFetchData from './useFetchData';

const useSpecializations = () => {
  const { data: specializations, isLoading, error } = useFetchData(specializationService);

  return { specializations, isLoading, error };
};

export default useSpecializations;
