export function getTotalPatients(patients) {
  if (!Array.isArray(patients)) return 0;
  return patients.length;
}