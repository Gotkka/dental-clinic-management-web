import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Search, Filter, User, MapPin, Check, X, MoreHorizontal } from 'lucide-react';

const Appointments = () => {
  // Sample appointment data (in production, this would be fetched from an API)
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch appointments data (simulated)
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockAppointments = [
        {
          id: 1,
          title: "Khám sức khỏe định kỳ",
          date: "2025-04-20",
          time: "09:00",
          location: "Phòng khám Tân Bình",
          doctor: "Bs. Nguyễn Văn A",
          status: "upcoming",
          notes: "Nhớ mang sổ khám bệnh"
        },
        {
          id: 2,
          title: "Tư vấn dinh dưỡng",
          date: "2025-04-22",
          time: "14:30",
          location: "Phòng 303, Tòa nhà Y tế",
          doctor: "Bs. Trần Thị B",
          status: "upcoming",
          notes: "Mang theo kết quả xét nghiệm gần nhất"
        },
        {
          id: 3,
          title: "Kiểm tra răng",
          date: "2025-04-15",
          time: "10:00",
          location: "Nha khoa Thành Đô",
          doctor: "Bs. Lê Văn C",
          status: "completed",
          notes: ""
        },
        {
          id: 4,
          title: "Tái khám sau phẫu thuật",
          date: "2025-04-10",
          time: "15:45",
          location: "Bệnh viện Đa khoa",
          doctor: "PGS. Phạm Đức D",
          status: "completed",
          notes: "Cần đưa ra đánh giá về việc phục hồi"
        },
        {
          id: 5,
          title: "Chụp X-quang",
          date: "2025-04-18",
          time: "11:30",
          location: "Khoa chẩn đoán hình ảnh",
          doctor: "Bs. Hoàng Thị E",
          status: "cancelled",
          notes: "Hủy do trùng lịch công tác"
        }
      ];
      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter appointments based on search query and status filter
  useEffect(() => {
    let result = appointments;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(appointment => appointment.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(appointment => 
        appointment.title.toLowerCase().includes(query) ||
        appointment.doctor.toLowerCase().includes(query) ||
        appointment.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredAppointments(result);
  }, [searchQuery, statusFilter, appointments]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = "";
    let label = "";
    let Icon = null;
    
    switch(status) {
      case 'upcoming':
        badgeClass = "bg-blue-100 text-blue-800";
        label = "Sắp tới";
        Icon = Clock;
        break;
      case 'completed':
        badgeClass = "bg-green-100 text-green-800";
        label = "Đã hoàn thành";
        Icon = Check;
        break;
      case 'cancelled':
        badgeClass = "bg-red-100 text-red-800";
        label = "Đã hủy";
        Icon = X;
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
        label = "Không xác định";
    }
    
    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
        {Icon && <Icon size={12} />} {label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      <h1 className="text-2xl font-bold mb-6">Danh sách lịch hẹn</h1>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm lịch hẹn..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="upcoming">Sắp tới</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>
      
      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Không tìm thấy lịch hẹn</h3>
          <p className="mt-2 text-gray-500">Không có lịch hẹn nào phù hợp với điều kiện tìm kiếm.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{appointment.title}</h3>
                    <StatusBadge status={appointment.status} />
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span>{appointment.time}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span>{appointment.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <User size={16} className="mr-2" />
                      <span>{appointment.doctor}</span>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-2 text-sm text-gray-500">
                        <p><span className="font-medium">Ghi chú:</span> {appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 md:mt-0">
                  {appointment.status === 'upcoming' && (
                    <>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Sửa
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                        Hủy
                      </button>
                    </>
                  )}
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Summary Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Tổng quan</h3>
        <div className="flex flex-wrap gap-4">
          <div className="px-4 py-3 bg-white rounded-md shadow-sm">
            <p className="text-sm text-gray-500">Tổng số lịch hẹn</p>
            <p className="text-xl font-semibold">{appointments.length}</p>
          </div>
          <div className="px-4 py-3 bg-white rounded-md shadow-sm">
            <p className="text-sm text-gray-500">Sắp tới</p>
            <p className="text-xl font-semibold">{appointments.filter(a => a.status === 'upcoming').length}</p>
          </div>
          <div className="px-4 py-3 bg-white rounded-md shadow-sm">
            <p className="text-sm text-gray-500">Đã hoàn thành</p>
            <p className="text-xl font-semibold">{appointments.filter(a => a.status === 'completed').length}</p>
          </div>
          <div className="px-4 py-3 bg-white rounded-md shadow-sm">
            <p className="text-sm text-gray-500">Đã hủy</p>
            <p className="text-xl font-semibold">{appointments.filter(a => a.status === 'cancelled').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments;