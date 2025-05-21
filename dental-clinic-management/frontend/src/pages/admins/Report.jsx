import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import useReport, { normalizeStatus } from '../../hooks/admins/useReport';
import useServices from '../../hooks/useServices';
import usePatientInformation from '../../hooks/usePatientInformation';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Reports = () => {
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Hooks
  const { reportData, rawAppointments, dentists, loading, error } = useReport(dateRange.startDate, dateRange.endDate);
  const { services, isLoading: servicesLoading } = useServices();
  const { patientInfo: patients, isLoading: patientLoading, error: patientError } = usePatientInformation();

  // Extract report data
  const { totalAppointments, statusBreakdown, appointmentsByDentist } = reportData || {
    totalAppointments: 0,
    statusBreakdown: { 'Đang chờ': 0, 'Đã xác nhận': 0, 'Hoàn thành': 0, 'Hủy': 0 },
    appointmentsByDentist: {},
  };

  // Parse appointment time
  const parseAppointmentTime = (timeString) => {
    if (!timeString) return { date: 'Ngày không hợp lệ', time: 'Giờ không hợp lệ' };
    try {
      let date;
      if (timeString.includes('T')) {
        date = parseISO(timeString);
      } else {
        date = new Date(timeString); // Adjust based on your API format
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

  // Get status text and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Đã xác nhận':
        return { text: 'Đã xác nhận', color: 'emerald', icon: 'check-circle' };
      case 'Đang chờ':
        return { text: 'Chờ xác nhận', color: 'amber', icon: 'clock' };
      case 'Hủy':
        return { text: 'Đã hủy', color: 'red', icon: 'x-circle' };
      case 'Hoàn thành':
        return { text: 'Hoàn thành', color: 'blue', icon: 'check-badge' };
      default:
        return { text: status, color: 'gray', icon: 'question-mark-circle' };
    }
  };

  // Chart data with friendly colors
  const statusChartData = {
    labels: Object.keys(statusBreakdown),
    datasets: [{
      data: Object.values(statusBreakdown),
      backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444'],
      borderColor: ['#D97706', '#059669', '#2563EB', '#B91C1C'],
      borderWidth: 1,
    }],
  };

  const dentistChartData = {
    labels: Object.keys(appointmentsByDentist),
    datasets: [{
      label: 'Số lịch hẹn',
      data: Object.values(appointmentsByDentist),
      backgroundColor: ['#60A5FA', '#34D399', '#A78BFA', '#F472B6', '#FBBF24', '#6EE7B7', '#C4B5FD', '#FCA5A5'],
      borderColor: '#FFFFFF',
      borderWidth: 1,
    }],
  };

  // Date picker handlers
  const handleStartDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, endDate: date }));
  };

  // Custom DatePicker input
  const CustomDatePickerInput = React.forwardRef(({ value, onClick, label }, ref) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          ref={ref}
          className="w-full rounded-lg border border-gray-300 shadow-sm py-3 px-4 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 cursor-pointer"
          value={value || ''}
          onClick={onClick}
          readOnly
          placeholder="Chọn ngày"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
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

  // Export to Excel
  const exportToExcel = () => {
    try {
      if (totalAppointments === 0) {
        setErrorMsg('Không có dữ liệu để xuất báo cáo');
        setTimeout(() => setErrorMsg(''), 3000);
        return;
      }

      const exportData = rawAppointments.map((appointment) => {
        const { date, time } = parseAppointmentTime(appointment.appointment_time);
        const patient = patients?.find((p) => p.id === appointment.patient_information_id);
        const service = services?.find((s) => s.id === appointment.service_id);
        const dentist = dentists?.find((d) => d.id === appointment.dentist_id);
        return {
          'Tên bệnh nhân': patient ? `${patient.first_name} ${patient.last_name || ''}` : 'Không có thông tin',
          'Số điện thoại': patient?.phone || 'Không có số điện thoại',
          'Ngày': date,
          'Giờ': time,
          'Dịch vụ': service?.name || 'Không xác định',
          'Bác sĩ': dentist?.full_name || 'Không xác định',
          'Trạng thái': getStatusInfo(normalizeStatus(appointment.status)).text,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo lịch hẹn');
      const today = format(new Date(), 'yyyyMMdd');
      XLSX.writeFile(workbook, `bao_cao_lich_hen_${today}.xlsx`);
      setSuccessMsg('Xuất báo cáo thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error exporting report:', error);
      setErrorMsg('Lỗi khi xuất báo cáo: ' + error.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  // Loading state
  if (loading || servicesLoading || patientLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-6 text-xl font-medium text-indigo-700">Đang tải dữ liệu báo cáo...</p>
          <p className="mt-2 text-gray-500">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || patientError) {
    return (
      <div className="max-w-3xl mx-auto mt-10 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-red-800">Đã xảy ra lỗi!</h3>
            <p className="mt-2 text-red-700">{error?.message || patientError?.message}</p>
            <p className="mt-3 text-gray-700">Vui lòng thử lại sau hoặc liên hệ hỗ trợ kỹ thuật.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <header className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-bold text-indigo-900">Báo Cáo Lịch Hẹn</h1>
        <p className="text-gray-600 mt-2 text-lg">Thống kê và phân tích dữ liệu lịch hẹn của phòng khám</p>
      </header>

      {/* Alerts */}
      {successMsg && (
        <div className="mb-6 px-6 py-4 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-sm flex items-center">
          <svg className="h-6 w-6 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 px-6 py-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm flex items-center">
          <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8 transition-all hover:shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <svg className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Bộ lọc thời gian
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

      {/* Summary Cards */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Tổng quan lịch hẹn
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-md p-6 text-white transform transition-all hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-indigo-100">Tổng số lịch hẹn</h3>
            <svg className="h-8 w-8 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{totalAppointments}</p>
          <p className="text-indigo-200 mt-2">lịch hẹn</p>
        </div>
        
        {Object.entries(statusBreakdown).map(([status, count]) => {
          const statusInfo = getStatusInfo(status);
          let bgClass = '';
          let iconPath = '';
          
          switch(statusInfo.color) {
            case 'emerald':
              bgClass = 'from-emerald-500 to-emerald-600';
              iconPath = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
              break;
            case 'amber':
              bgClass = 'from-amber-500 to-amber-600';
              iconPath = 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
              break;
            case 'red':
              bgClass = 'from-red-500 to-red-600';
              iconPath = 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
              break;
            case 'blue':
              bgClass = 'from-blue-500 to-blue-600';
              iconPath = 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z';
              break;
            default:
              bgClass = 'from-gray-500 to-gray-600';
              iconPath = 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
          }
          
          return (
            <div key={status} className={`bg-gradient-to-br ${bgClass} rounded-2xl shadow-md p-6 text-white transform transition-all hover:scale-105`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-opacity-90">{statusInfo.text}</h3>
                <svg className="h-8 w-8 text-opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
                </svg>
              </div>
              <p className="text-4xl font-bold">{count}</p>
              <p className="text-opacity-80 mt-2">lịch hẹn</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <svg className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Phân bố trạng thái lịch hẹn
          </h3>
          <div className="h-80">
            <Pie 
              data={statusChartData} 
              options={{ 
                maintainAspectRatio: false, 
                plugins: { 
                  legend: { 
                    position: 'bottom',
                    labels: {
                      font: {
                        size: 14
                      },
                      padding: 20
                    }
                  },
                  tooltip: {
                    bodyFont: {
                      size: 14
                    },
                    titleFont: {
                      size: 16
                    }
                  }
                },
                animation: {
                  animateScale: true
                }
              }} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <svg className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Lịch hẹn theo nha sĩ
          </h3>
          <div className="h-80">
            <Bar 
              data={dentistChartData} 
              options={{ 
                maintainAspectRatio: false, 
                plugins: { 
                  legend: { 
                    display: false 
                  },
                  tooltip: {
                    bodyFont: {
                      size: 14
                    },
                    titleFont: {
                      size: 16
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false
                    },
                    ticks: {
                      font: {
                        size: 12
                      }
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      font: {
                        size: 12
                      }
                    }
                  }
                },
                animation: {
                  animateScale: true
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={exportToExcel}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-base font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Xuất báo cáo Excel
        </button>
      </div>
    </div>
  );
};

export default Reports;