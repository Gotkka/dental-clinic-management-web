import { appointmentTypeService } from '../services/appointmentTypeService';
import useFetchData from './useFetchData';

const useAppointmentTypes = () => {
  const { data: appointmentTypes, isLoading, error } = useFetchData(appointmentTypeService);

  return { appointmentTypes, isLoading, error };
};

export default useAppointmentTypes;
