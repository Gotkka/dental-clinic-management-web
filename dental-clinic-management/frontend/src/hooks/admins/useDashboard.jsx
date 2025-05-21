import useDentist from "../useDentists";
import { useAllAppointments } from "../useAppointments";
import usePatientInformation from "../usePatientInformation";
import { getTodayAppointments, getUpcomingAppointments } from "../../utils/appointmentUtils";

function getTodayRevenue(appointments) {
  if (!Array.isArray(appointments)) return 0;

  const today = new Date().toISOString().slice(0, 10);

  return appointments
    .filter(
      (a) =>
        a.status === 'Hoàn thành' &&
        a.appointment_time?.slice(0, 10) === today &&
        a.service?.price
    )
    .reduce((sum, a) => sum + a.service.price, 0);
}

const useDashboard = () => {
  const { dentists, loading: loadingDentist, error: errorDentist } = useDentist();
  const { appointments, loading: loadingAppointment, error: errorAppointment } = useAllAppointments();
  const { patientInfo, loading: loadingPatientInfo, error: errorPatientInfo } = usePatientInformation();

  const loading = loadingDentist || loadingAppointment || loadingPatientInfo;
  const error = errorDentist || errorAppointment || errorPatientInfo;

  return {
    stats: {
      totalDentists: dentists?.length || 0,
      totalPatients: patientInfo?.length || 0, // Đếm tổng bản ghi patient_information
      todayAppointments: getTodayAppointments(appointments).length || 0,
      upcomingAppointments: getUpcomingAppointments(appointments) || [],
      revenueToday: getTodayRevenue(appointments), // Thêm dòng này
    },
    loading,
    error,
  };
};

export default useDashboard;
