import { appointmentTypeService } from './appointmentTypeService';
import { dentistService } from './dentistService';
import { patientService } from './patientService';
import { specializationService } from './specializationService';
import { serviceService } from './serviceService';
import { branchClinicService } from './branchClinicService';

export const fetchAllData = async () => {
  try {
    const [
      dentistsResponse,
      specializationsResponse,
      servicesResponse,
      appointmentTypesResponse,
      patientsResponse,
      branchsResponse,
    ] = await Promise.all([
      dentistService(),
      specializationService(),
      serviceService(),
      appointmentTypeService(),
      patientService(),
      branchClinicService(),
    ]);

    return {
      dentists: dentistsResponse.data || dentistsResponse, // Xử lý trường hợp không có data
      specializations: specializationsResponse.data || specializationsResponse,
      services: servicesResponse.data || servicesResponse,
      appointmentTypes: appointmentTypesResponse.data || appointmentTypesResponse,
      patients: patientsResponse.data || patientsResponse,
      branchs: branchsResponse.data || branchsResponse,
    };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    throw error;
  }
};

