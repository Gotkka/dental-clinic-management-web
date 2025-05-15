import { branchClinicService } from '../services/branchClinicService';
import useFetchData from './useFetchData';

const useBranchClinics = () => {
  const { data: branchClinics, isLoading, error } = useFetchData(branchClinicService);

  return { branchClinics, isLoading, error };
};

export default useBranchClinics;
