import React from "react";

const DateRangePicker = ({ startDate, endDate, onChange }) => {
  return (
    <div className="flex space-x-2">
      <input
        type="date"
        value={startDate || ""}
        onChange={e => onChange({ startDate: e.target.value, endDate })}
        className="border rounded px-2 py-1"
      />
      <span>-</span>
      <input
        type="date"
        value={endDate || ""}
        onChange={e => onChange({ startDate, endDate: e.target.value })}
        className="border rounded px-2 py-1"
      />
    </div>
  );
};

export default DateRangePicker;