import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, Search, User, Plus, Filter } from 'lucide-react';
import Layout from '../../layouts/Layout';
import useAppointments from '../../hooks/useAppointments';
import { useNavigate } from 'react-router-dom';     

export default function AppointmentsPage() {
    const [activeTab, setActiveTab] = useState("Đang chờ");
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { appointments, loading, error } = useAppointments();
    const navigate = useNavigate();

    const filteredAppointments = appointments.filter(appointment => {
        const matchesTab = appointment.status === activeTab;
        if (!matchesTab) return false;

        if (searchQuery.trim() === "") return true;

        const doctorName = appointment.dentist?.full_name || "N/A";
        const service = appointment.service?.name || "N/A";

        return (
            doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Đếm số lượng cho mỗi trạng thái
    const appointmentCounts = {
        "Đang chờ": appointments.filter(a => a.status === "Đang chờ").length,
        "Hoàn thành": appointments.filter(a => a.status === "Hoàn thành").length,
        "Hủy": appointments.filter(a => a.status === "Hủy").length
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Đang chờ": return "bg-indigo-50 text-indigo-700 border-indigo-200";
            case "Hoàn thành": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "Hủy": return "bg-rose-50 text-rose-700 border-rose-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "Đang chờ": return "Sắp tới";
            case "Hoàn thành": return "Đã hoàn thành";
            case "Hủy": return "Đã hủy";
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Đang chờ": return "border-indigo-500";
            case "Hoàn thành": return "border-emerald-500";
            case "Hủy": return "border-rose-500";
            default: return "border-gray-500";
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case "Đang chờ": return "bg-indigo-100";
            case "Hoàn thành": return "bg-emerald-100";
            case "Hủy": return "bg-rose-100";
            default: return "bg-gray-100";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Đang chờ": return <Calendar size={24} className="text-indigo-600" />;
            case "Hoàn thành": return <Clock size={24} className="text-emerald-600" />;
            case "Hủy": return <User size={24} className="text-rose-600" />;
            default: return null;
        }
    };

    const formatDateTime = (appointmentTime) => {
        if (!appointmentTime) return { date: 'N/A', time: 'N/A' };

        const date = new Date(appointmentTime);
        return {
            date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-slate-900">Lịch hẹn của tôi</h1>
                            <button className="flex my-global-btn items-center px-4 py-2 bg-indigo-600 text-white rounded-full font-medium shadow-md hover:bg-indigo-700 transition">
                                <Plus size={18} className="mr-2" />
                                Đặt lịch mới
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {["Đang chờ", "Hoàn thành", "Hủy"].map(status => (
                            <div key={status} className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${getStatusColor(status)}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">{getStatusText(status)}</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-1">{appointmentCounts[status]}</p>
                                    </div>
                                    <div className={`${getStatusBgColor(status)} p-3 rounded-full`}>
                                        {getStatusIcon(status)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search and Tabs */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                            <div className="flex space-x-6 mb-4 sm:mb-0">
                                {["Đang chờ", "Hoàn thành", "Hủy"].map(tab => (
                                    <button
                                        key={tab}
                                        className={`relative my-global-btn text-white pb-2 font-medium text-sm transition-colors ${activeTab === tab
                                            ? "text-black"
                                            : "text-slate-500 hover:text-black"
                                            }`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {getStatusText(tab)}
                                        {activeTab === tab && (
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex space-x-2">
                                <div className="relative flex-1 sm:min-w-[300px]">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={18} className="text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Tìm theo bác sĩ hoặc dịch vụ..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="inline-flex my-global-btn text-white items-center px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white hover:bg-slate-50"
                                >
                                    <Filter size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Filter Panel (hidden by default) */}
                        {isFilterOpen && (
                            <div className="bg-slate-50 p-4 rounded-lg mb-6">
                                <h3 className="font-medium text-slate-700 mb-3">Lọc theo</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Bác sĩ</label>
                                        <select className="w-full border border-slate-200 rounded-lg p-2">
                                            <option value="">Tất cả</option>
                                            <option>TS. Nguyễn Minh Tuấn</option>
                                            <option>BS. Trần Thị Hương</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Dịch vụ</label>
                                        <select className="w-full border border-slate-200 rounded-lg p-2">
                                            <option value="">Tất cả</option>
                                            <option>Khám tổng quát</option>
                                            <option>Tẩy trắng răng</option>
                                            <option>Niềng răng</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button className="px-4 py-2 my-global-btn text-white bg-indigo-600 text-white rounded-lg">Áp dụng</button>
                                </div>
                            </div>
                        )}

                        {/* Appointments List */}
                        {loading ? (
                            <div className="bg-white rounded-lg p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                                <p className="text-slate-600">Đang tải dữ liệu lịch hẹn...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-rose-50 text-rose-700 p-4 rounded-lg border border-rose-200 text-center">
                                <p className="font-medium">Đã xảy ra lỗi khi tải dữ liệu</p>
                                <p className="text-sm mt-1">{error.message}</p>
                            </div>
                        ) : filteredAppointments.length === 0 ? (
                            <div className="bg-white rounded-lg p-8 text-center">
                                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Calendar size={24} className="text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-1">Không có lịch hẹn</h3>
                                <p className="text-slate-500">
                                    {searchQuery ? "Không tìm thấy lịch hẹn phù hợp với tìm kiếm" : "Bạn không có lịch hẹn nào"}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredAppointments.map(appointment => {
                                    const { date, time } = formatDateTime(appointment.appointment_time);
                                    return (
                                        <div key={appointment.id} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 overflow-hidden">
                                            <div className="p-5">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-2">
                                                            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                                                {/* <User size={20} className="text-indigo-600" /> */}

                                                                <img
                                                                    src={'/assets/dentists/' + appointment.dentist?.img_url}

                                                                    alt="Dentist Avatar"
                                                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                                                />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-lg text-slate-900">{appointment.dentist?.full_name || "N/A"}</h3>
                                                                <p className="text-slate-500 text-sm">{appointment.dentist?.specialization?.name || "Bác sĩ Nha khoa"}</p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div className="flex items-center text-slate-600">
                                                                <Calendar size={16} className="mr-2 text-indigo-500" />
                                                                <span>{date}</span>
                                                            </div>
                                                            <div className="flex items-center text-slate-600">
                                                                <Clock size={16} className="mr-2 text-indigo-500" />
                                                                <span>{time}</span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <span className="text-slate-600">
                                                                <span className="font-medium">Dịch vụ:</span> {appointment.service?.name || "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end mt-4 sm:mt-0">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusClass(appointment.status)}`}>
                                                            {getStatusText(appointment.status)}
                                                        </span>

                                                        <button
                                                            onClick={() => navigate(`/appointments/${appointment.id}`)}
                                                            className="mt-4  my-global-btn text-white flex items-center text-indigo-600 hover:text-white font-medium">
                                                            Chi tiết <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 text-white transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}