import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Layout from '../components/layout/Layout';

const Dentists = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tất cả');
  const [dentists, setDentists] = useState([]);
  const [specializationList, setSpecializationList] = useState([]);
  const [specialties, setSpecialties] = useState(['Tất cả']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dentistRes, specializationRes] = await Promise.all([
          fetch('http://localhost:8080/dental-clinic/dentists'),
          fetch('http://localhost:8080/dental-clinic/specializations'),
        ]);

        if (!dentistRes.ok || !specializationRes.ok) {
          throw new Error('Không thể lấy dữ liệu');
        }

        const dentistData = await dentistRes.json();

        console.log('dentistData', dentistData);
        const specializationData = await specializationRes.json();

        setDentists(dentistData);
        setSpecializationList(specializationData);

        const specialtyNames = specializationData.map(s => s.name);
        setSpecialties(['Tất cả', ...specialtyNames]);
      } catch (err) {
        console.error('Lỗi khi fetch:', err);
        setError('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = dentists.filter((doctor) => {
    const spec = specializationList.find(s => s.id === doctor.specialization_id);
    const fullName = doctor.full_name?.toLowerCase() || '';
    const specName = spec?.name?.toLowerCase() || '';

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      specName.includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === 'Tất cả' || spec?.name === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

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
                    {specialties.map((specialty) => (
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
                  const specialization = specializationList.find(
                    (s) => s.id === doctor.specialization_id
                  );

                  return (
                    <div
                      key={doctor.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center">
                          <img
                            className="h-16 w-16 rounded-full object-cover"
                            src={'/assets/dentists/' + doctor.img_url}
                            alt={doctor.full_name}
                          />
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{doctor.full_name}</h3>
                            <p className="text-sm text-blue-600">
                              {specialization?.name || 'Chưa cập nhật'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                          <p><strong>Số điện thoại:</strong> {doctor.phone_number}</p>
                          <p><strong>Email:</strong> {doctor.email}</p>
                          <p><strong>Kinh nghiệm:</strong> chưa cập nhật</p>
                        </div>
                        <div className="mt-6">
                          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                            Đặt lịch khám
                          </button>
                        </div>
                      </div>
                    </div>
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
