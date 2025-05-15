import { patientService } from '../services/patientService';
import useFetchData from './useFetchData';

const usePatients = () => {
  const { data: patients, isLoading, error } = useFetchData(patientService);

  return { patients, isLoading, error };
};

export default usePatients;
