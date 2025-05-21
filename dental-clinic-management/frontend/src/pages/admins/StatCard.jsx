import React from "react";

const StatCard = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-blue-600">{value}</p>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            trend.up === true ? 'text-green-600' : 
            trend.up === false ? 'text-red-600' : 'text-gray-500'
          }`}>
            {trend.up === true && (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
            {trend.up === false && (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;