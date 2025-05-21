import React, { useState } from "react";
import Dashboard from "./Dashboard";
import AppointmentManagement from "./AppointmentManagement";
import Sidebar from "./Sidebar";
import BranchClinicManagement from "./BranchClinicManagement";
import ServiceManagement from "./ServiceManagement";
import SpecializationManagement from "./SpecializationManagement";
import DentistManagement from "./DentistManagement";
import Report from "./Report";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "appointments":
        return <AppointmentManagement />;
      case "branches":
        return <BranchClinicManagement />;
      case "services":
        return <ServiceManagement />;
      case "specializations":
        return <SpecializationManagement />;
      case "dentists":
        return <DentistManagement />;
      case "reports":
        return <Report />
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;