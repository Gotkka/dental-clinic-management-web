import { getAppointmentTypes } from '../services/appointmentTypeService';
import useFetchData from './useFetchData';

const useAppointmentTypes = () => {
  const { data: appointmentTypes, isLoading, error, refetch } = useFetchData(getAppointmentTypes);
  return { appointmentTypes, isLoading, error, refetch };
};

export default useAppointmentTypes;
