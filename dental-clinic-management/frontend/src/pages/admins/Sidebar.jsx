import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ activeTab, setActiveTab }) => {
  // Lấy role từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  const { logout } = useAuth();

  // Định nghĩa menu cho từng role
  const menuByRole = {
    admin: [
      { id: "dashboard", label: "Tổng quan", icon: "📊" },
      { id: "branches", label: "Quản lý chi nhánh", icon: "🏥" },
      { id: "services", label: "Quản lý dịch vụ", icon: "🦷" },
      { id: "specializations", label: "Quản lý chuyên khoa", icon: "📚" },
      { id: "dentists", label: "Quản lý nha sĩ", icon: "👥" },
      { id: "appointments", label: "Quản lý lịch hẹn", icon: "📅" },
      { id: "reports", label: "Báo cáo", icon: "📈" },
    ],
    dentist: [
      { id: "appointments", label: "Quản lý lịch hẹn", icon: "📅" },
    ]
  };

  // State thu nhỏ
  const [collapsed, setCollapsed] = useState(false);

  // Chọn menu phù hợp
  const menuItems = menuByRole[role] || [];
  return (
    <aside
      className={`bg-white shadow-lg py-10 h-screen sticky top-0 flex flex-col transition-all duration-300
        ${collapsed ? "w-24 px-2" : "w-80 px-10"}
      `}
    >
      {/* Nút thu nhỏ/mở rộng */}
      <button
        className="absolute top-4 right-4 bg-blue-100 hover:bg-blue-200 rounded-full p-2 transition"
        onClick={() => setCollapsed((prev) => !prev)}
        title={collapsed ? "Mở rộng" : "Thu nhỏ"}
        type="button"
      >
        {collapsed ? (
          <span className="text-xl">➡️</span>
        ) : (
          <span className="text-xl">⬅️</span>
        )}
      </button>

      {!collapsed && (
        <h2 className="text-3xl font-extrabold mb-10 text-blue-700 tracking-wide select-none">
          Nha Khoa Admin
        </h2>
      )}

      <ul className="flex-1 space-y-3 mt-4">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveTab(item.id)}
              className={`my-global-btn text-white flex items-center w-full text-left px-4 py-3 rounded-lg transition-all duration-300
                ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white font-semibold shadow-lg border-l-4 border-blue-900 scale-105"
                    : "bg-blue-500 text-white hover:bg-blue-700 border-l-4 border-transparent"
                }
              `}
            >
              <span className="mr-4 text-xl">{item.icon}</span>
              {!collapsed && <span className="text-base">{item.label}</span>}
            </button>
          </li>
        ))}
      </ul>

      <div className="pt-6 mt-auto border-t border-gray-200">
        <button
          className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-300 font-semibold"
          onClick={logout}
        >
          <span className="mr-4 text-xl">🚪</span>
          {!collapsed && "Đăng xuất"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;