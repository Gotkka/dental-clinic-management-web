import React from 'react';
import { Search, Filter } from 'lucide-react';
import Layout from '../../layouts/Layout';
import useFilteredDentists from '../../hooks/useFilteredDentists';
import DentistCard from '../../components/DentistCard';

const Dentists = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedSpecialty,
    setSelectedSpecialty,
    specializations,
    loading,
    error,
    specialtyNames,
    filteredDoctors,
  } = useFilteredDentists();

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Tìm bác sĩ phù hợp</h1>
            <p className="mt-4 text-xl text-gray-600">Các chuyên gia tận tâm vì sức khỏe của bạn</p>
          </div>

          {/* Tìm kiếm và lọc */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tìm theo tên hoặc chuyên khoa"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-shrink-0">
                <div className="relative inline-block w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={20} className="text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                  >
                    {specialtyNames.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách bác sĩ */}
          {loading ? (
            <div className="text-center py-10 text-gray-600">Đang tải danh sách bác sĩ...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => {
                  const specialization = Array.isArray(specializations)
                    ? specializations.find((s) => s.id === doctor.specialization_id) || null
                    : null;

                  return (
                    <DentistCard
                      key={doctor.id}
                      doctor={doctor}
                      specialization={specialization}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg text-gray-600">Không tìm thấy bác sĩ phù hợp. Vui lòng thử lại.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dentists;