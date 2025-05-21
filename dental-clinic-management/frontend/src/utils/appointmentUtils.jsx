export const getTodayAppointments = (appointments) => {
  const today = new Date();

  const result = appointments.filter((appt) => {
    const dateStr = appt.appointment_time || appt.date;
    if (!dateStr) {
      return false;
    }

    const apptDate = new Date(dateStr);

    const isSameDay =
      apptDate.getFullYear() === today.getFullYear() &&
      apptDate.getMonth() === today.getMonth() &&
      apptDate.getDate() === today.getDate();

    return isSameDay;
  });

  return result;
};

export const getUpcomingAppointments = (appointments) => {
  const today = new Date();

  const result = appointments.filter((appt) => {
    const dateStr = appt.appointment_time || appt.date;
    if (!dateStr) {
      return false;
    }

    const apptDate = new Date(dateStr);

    return apptDate > today;
  });

  return result;
};

export const renderTimeSlots = (timeSlots, selectedTime, handleTimeSelect) => {
  return timeSlots.map((time) => (
    <div
      key={time}
      className={`border rounded-lg py-2 px-3 text-center cursor-pointer transition-all ${
        selectedTime === time
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => handleTimeSelect(time)}
    >
      <p className="text-sm">{time}</p>
    </div>
  ));
};



