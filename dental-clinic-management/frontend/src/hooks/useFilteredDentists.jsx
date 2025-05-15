import { useState, useMemo } from 'react';
import useDentists from './useDentists';

const useFilteredDentists = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tất cả');
  const { dentists, specializations, loading, error } = useDentists();

  const specialtyNames = useMemo(() => ['Tất cả', ...specializations.map(s => s.name)], [specializations]);

  const filteredDoctors = useMemo(() => {
    return dentists.filter((doctor) => {
      const spec = specializations.find(s => s.id === doctor.specialization_id);
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
