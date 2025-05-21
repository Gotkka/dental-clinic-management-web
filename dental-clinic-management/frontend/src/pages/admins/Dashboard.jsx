import React from "react";
import StatCard from "../admins/StatCard";
import useDashboard from "../../hooks/admins/useDashboard";

const Dashboard = () => {
  const { stats, loading, error } = useDashboard();

  if (loading) return <div className="flex justify-center py-8">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-500 py-8">Có lỗi khi tải dữ liệu</div>;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Chào mừng!</h1>
        <p className="text-gray-600 mt-2">Tổng quan hệ thống đặt lịch khám nha khoa</p>
      </header>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tổng số nha sĩ"
          value={stats.totalDentists}
          icon="🧑‍⚕️"
        />
        <StatCard 
          title="Tổng số bệnh nhân"
          value={stats.totalPatients}
          icon="🧑‍🤝‍🧑"
        />
        <StatCard 
          title="Lịch hẹn hôm nay"
          value={stats.todayAppointments}
          icon="📅"
        />
        <StatCard 
          title="Doanh thu ngày"
          value={`${stats.revenueToday?.toLocaleString?.() || 0} đ`}
          icon="💰"
        />
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Thống kê lịch hẹn theo ngày</h3>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Lịch hẹn sắp tới</h3>
          <div className="space-y-4">
            {(stats.upcomingAppointments || []).slice(0, 3).map((appt, index) => (
              <div key={appt.id || index} className="flex items-start border-b border-gray-100 pb-3">
                <div className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3">
                  <span>{appt.time}</span>
                </div>
                <div>
                  <p className="font-medium">{appt.patientName}</p>
                  <p className="text-sm text-gray-500">{appt.serviceName}</p>
                </div>
              </div>
            ))}
            <button className="text-blue-600 hover:underline text-sm font-medium">
              Xem tất cả lịch hẹn →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;