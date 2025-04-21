package models

// AppointmentService kết nối nhiều-nhiều giữa Appointment và Service
type AppointmentService struct {
	ID            uint `gorm:"primaryKey" json:"id"`
	AppointmentID uint `gorm:"not null" json:"appointment_id"`
	ServiceID     uint `gorm:"not null" json:"service_id"`
	Quantity      int  `gorm:"default:1" json:"quantity"`
}
