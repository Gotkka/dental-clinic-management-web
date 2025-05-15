import { useState, useMemo } from 'react';
import useDentists from './useDentists';
import useSpecializations from './useSpecializations';

const useFilteredDentists = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tất cả');
  const { dentists, loading: dentistsLoading, error: dentistsError } = useDentists();
  const { specializations, isLoading: specLoading, error: specError } = useSpecializations();

  // Gộp trạng thái loading và error
  const loading = dentistsLoading || specLoading;
  const error = dentistsError || specError;

  // Ensure specializations is an array before mapping over it
  const specialtyNames = useMemo(
    () => ['Tất cả', ...(Array.isArray(specializations) ? specializations.map(s => s.name) : [])],
    [specializations]
  );

  const filteredDoctors = useMemo(() => {
    const safeSpecializations = Array.isArray(specializations) ? specializations : [];
    return dentists.filter((doctor) => {
      const spec = safeSpecializations.find(s => s.id === doctor.specialization_id) || null;
      const fullName = doctor.full_name?.toLowerCase() || '';
      const specName = spec?.name?.toLowerCase() || '';

      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        specName.includes(searchTerm.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'Tất cả' || spec?.name === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [dentists, specializations, searchTerm, selectedSpecialty]);

  return {
    searchTerm,
    setSearchTerm,
    selectedSpecialty,
    setSelectedSpecialty,
    dentists,
    specializations,
    loading,
    error,
    specialtyNames,
    filteredDoctors,
  };
};

export default useFilteredDentists;