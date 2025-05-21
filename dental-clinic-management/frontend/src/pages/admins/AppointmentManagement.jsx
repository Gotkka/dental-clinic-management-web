import React, { useState } from 'react';
import SearchInput from '../../components/common/SearchInput';
import AppointmentModal from '../../components/modals/AppointmentModal';
import {
  useAllAppointments,
  useUpdateAppointment,
  useFilteredAppointments,
} from '../../hooks/useAppointments';
import useDentists from '../../hooks/useDentists';
import useServices from '../../hooks/useServices';
import usePatientInformation from '../../hooks/usePatientInformation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';
import { format, parse, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';

const AppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Hooks
  const { appointments, loading, error, refetch } = useAllAppointments();
  const { updateAppointmentById, loading: updatingStatus, error: updateError } = useUpdateAppointment();
  const { dentists, isLoading: dentistsLoading } = useDentists();
  const { services, isLoading: servicesLoading } = useServices();
  const { patientInfo: patients, isLoading: patientLoading, error: patientError } = usePatientInformation();
  const { appointments: filteredByDateAppointments, loading: dateFilterLoading, error: dateFilterError, refetch: refetchFiltered } = useFilteredAppointments(
    dateRange.startDate,
    dateRange.endDate
  );

  const normalizeStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Đang chờ';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Hủy';
      default:
        return status;
    }
  };

  const handleStartDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, startDate: date }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleEndDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, endDate: date }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const filteredAppointments = (dateRange.startDate && dateRange.endDate ? filteredByDateAppointments : appointments)
    .map((appointment) => ({
      ...appointment,
      status: normalizeStatus(appointment.status),
    }))
    .filter(
      (a) =>
        (statusFilter === 'all' || a.status === statusFilter) &&
        (!searchTerm ||
          a.patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.dentist?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentById(appointmentId, { status: newStatus });
      setSuccessMsg('Cập nhật trạng thái lịch hẹn thành công!');
      refetch();
      if (dateRange.startDate && dateRange.endDate) refetchFiltered();
    } catch (err) {
      setErrorMsg('Lỗi khi cập nhật trạng thái lịch hẹn: ' + (updateError?.message || err.message));
    } finally {
      setTimeout(() => {
        setSuccessMsg('');
        setErrorMsg('');
      }, 3000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đã xác nhận':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Chờ xác nhận':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Hủy':
        return 'bg-rose-100 text-rose-800 border border-rose-200';
      case 'Hoàn thành':
        return 'bg-sky-100 text-sky-800 border border-sky-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Đã xác nhận':
        return 'Đã xác nhận';
      case 'Chờ xác nhận':
        return 'Chờ xác nhận';
      case 'Hủy':
        return 'Đã hủy';
      case 'Hoàn thành':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const CustomDatePickerInput = React.forwardRef(({ value, onClick, label }, ref) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          ref={ref}
          className="w-full rounded-lg border border-gray-300 shadow-sm py-2 px-3 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 cursor-pointer"
          value={value || ''}
          onClick={onClick}
          readOnly
          placeholder="Chọn ngày"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  ));

  // Parse appointment time for display
  const parseAppointmentTime = (timeString) => {
    if (!timeString) return { date: 'Ngày không hợp lệ', time: 'Giờ không hợp lệ' };
    try {
      let date;
      if (timeString.includes('T')) {
        date = parseISO(timeString);
      } else {
        date = parse(timeString, 'HH:mm dd/MM/yyyy', new Date());
      }
      if (isNaN(date)) throw new Error('Invalid date');
      return {
        date: format(date, 'dd/MM/yyyy', { locale: vi }),
        time: format(date, 'HH:mm', { locale: vi }),
      };
    } catch (err) {
      console.error('Error parsing appointment_time:', err.message, 'for timeString:', timeString);
      return { date: 'Ngày không hợp lệ', time: 'Giờ không hợp lệ' };
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      console.log('Starting export to Excel');
      if (filteredAppointments.length === 0) {
        console.log('No appointments to export');
        setErrorMsg('Không có lịch hẹn để xuất');
        setTimeout(() => setErrorMsg(''), 3000);
        return;
      }

      const exportData = filteredAppointments.map((appointment) => {
        try {
          const { date, time } = parseAppointmentTime(appointment.appointment_time);
          const patient = patients?.find((p) => p.id === appointment.patient_information_id);
          const service = services?.find((s) => s.id === appointment.service_id);
          const dentist = dentists?.find((d) => d.id === appointment.dentist_id);
          return {
            'Tên bệnh nhân': patient ? `${patient.first_name} ${patient.last_name || ''}` : 'Không có thông tin',
            'Số điện thoại': patient?.phone || 'Không có số điện thoại',
            'Ngày': date || 'N/A',
            'Giờ': time || 'N/A',
            'Dịch vụ': service?.name || 'Không xác định',
            'Bác sĩ': dentist?.full_name || 'Không xác định',
            'Trạng thái': getStatusText(appointment.status) || 'Không xác định',
          };
        } catch (error) {
          console.error(`Error processing appointment ${appointment.id}:`, error);
          return {};
        }
      });

      console.log('Export data:', exportData);
      console.log('XLSX library:', XLSX); // Log the XLSX object to verify
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');
      const today = format(new Date(), 'yyyyMMdd');
      XLSX.writeFile(workbook, `appointments_export_${today}.xlsx`);
      console.log('Export completed successfully');
      setSuccessMsg('Xuất file Excel thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      setErrorMsg('Lỗi khi xuất file Excel: ' + error.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  if (loading || dentistsLoading || servicesLoading || patientLoading || dateFilterLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error || patientError || dateFilterError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Đã xảy ra lỗi!</h3>
            <p className="mt-1 text-red-700">{error?.message || patientError?.message || dateFilterError?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
            <p className="text-gray-600 mt-1">Quản lý các cuộc hẹn khám nha khoa</p>
          </div>
        </div>
      </header>

      {/* Alert Messages */}
      {successMsg && (
        <div className="mb-6 px-4 py-3 bg-green-100 border border-green-200 text-green-700 rounded-lg shadow-sm transition-all transform animate-fadeIn">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 px-4 py-3 bg-red-100 border border-red-200 text-red-700 rounded-lg shadow-sm transition-all transform animate-fadeIn">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {errorMsg}
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 transition-all">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <SearchInput
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm theo tên bệnh nhân, bác sĩ..."
                className="w-full rounded-lg border border-gray-300 shadow-sm py-2 px-3 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <DatePicker
                selected={dateRange.startDate}
                onChange={handleStartDateChange}
                dateFormat="dd/MM/yyyy"
                isClearable
                locale={vi}
                placeholderText="Chọn ngày bắt đầu"
                customInput={<CustomDatePickerInput label="Từ ngày" />}
                className="w-full"
              />
            </div>

            <div>
              <DatePicker
                selected={dateRange.endDate}
                onChange={handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                isClearable
                locale={vi}
                placeholderText="Chọn ngày kết thúc"
                customInput={<CustomDatePickerInput label="Đến ngày" />}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`text-white px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'all' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}
                onClick={() => handleStatusFilterChange('all')}
              >
                Tất cả
              </button>
              <button
                className={`text-white px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'Chờ xác nhận' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}
                onClick={() => handleStatusFilterChange('Chờ xác nhận')}
              >
                Chờ xác nhận
              </button>
              <button
                className={`text-white px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'Đã xác nhận' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}
                onClick={() => handleStatusFilterChange('Đã xác nhận')}
              >
                Đã xác nhận
              </button>
              <button
                className={`text-white px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'Hoàn thành' ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}
                onClick={() => handleStatusFilterChange('Hoàn thành')}
              >
                Hoàn thành
              </button>
              <button
                className={`text-white px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'Hủy' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}
                onClick={() => handleStatusFilterChange('Hủy')}
              >
                Đã hủy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Danh sách lịch hẹn</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Xuất Excel
            </button>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full border border-indigo-200">
              {filteredAppointments.length} lịch hẹn
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bệnh nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày giờ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bác sĩ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v4m0 0l-2-2m2 2l2-2" />
                      </svg>
                      <p className="mt-2 text-gray-500 font-medium">Không tìm thấy lịch hẹn nào</p>
                      <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc thêm lịch hẹn mới</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAppointments.map((appointment) => {
                  const { date, time } = parseAppointmentTime(appointment.appointment_time);
                  const patient = patients && patients.length > 0
                    ? patients.find((p) => p.id === appointment.patient_information_id)
                    : null;
                  const service = services && services.length > 0
                    ? services.find((s) => s.id === appointment.service_id)
                    : null;
                  const dentist = dentists && dentists.length > 0
                    ? dentists.find((d) => d.id === appointment.dentist_id)
                    : null;

                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {patient?.first_name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient ? `${patient.first_name} ${patient.last_name || ''}` : 'Không có thông tin'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient?.phone || 'Không có số điện thoại'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{date}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {time}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {service?.name || 'Không xác định'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {dentist?.full_name || 'Không xác định'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                            appointment.status
                          )}`}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                          className="block rounded-lg text-sm border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                          disabled={updatingStatus}
                        >
                          <option value="Chờ xác nhận">Chờ xác nhận</option>
                          <option value="Đã xác nhận">Đã xác nhận</option>
                          <option value="Hoàn thành">Hoàn thành</option>
                          <option value="Hủy">Đã hủy</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages} ({filteredAppointments.length} lịch hẹn)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                  } border border-gray-200`}
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                  } border border-gray-200`}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      {isModalOpen && (
        <AppointmentModal
          onClose={() => setIsModalOpen(false)}
          onUpdate={() => {
            setIsModalOpen(false);
            refetch();
            if (dateRange.startDate && dateRange.endDate) refetchFiltered();
          }}
        />
      )}
    </div>
  );
};

export default AppointmentManagement;