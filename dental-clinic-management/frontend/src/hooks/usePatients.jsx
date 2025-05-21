import { getPatients } from '../services/patientService';
import useFetchData from './useFetchData';

const usePatients = () => {
  const { data: patients, isLoading, error, refetch } = useFetchData(getPatients);
  return { patients, isLoading, error, refetch };
};

export default usePatients;
