package models

type PatientInformation struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	Email        string `json:"email"`
	Phone        string `json:"phone"`
	IsNewPatient bool   `gorm:"default:true" json:"is_new_patient"`
}
