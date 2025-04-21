package models

import (
	"time"
)

// Appointment quản lý lịch hẹn giữa bệnh nhân và nha sĩ
type Appointment struct {
	ID                   uint      `gorm:"primaryKey" json:"id"`
	PatientID            uint      `gorm:"not null" json:"patient_id"`
	DentistID            uint      `gorm:"not null" json:"dentist_id"`
	ServiceID            uint      `gorm:"not null" json:"service_id"`
	AppointmentTypeID    uint      `gorm:"not null" json:"appointment_type_id"` // khóa ngoại
	AppointmentDate      time.Time `json:"appointment_date"`
	AppointmentTime      time.Time `json:"appointment_time"`
	Reason               string    `gorm:"type:text" json:"reason"`
	Status               string    `gorm:"type:varchar(50);default:Đang chờ" json:"status"`
	PatientInformationID uint      `json:"patient_information_id"`
	CreatedAt            time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Quan hệ
	Patient            Patient            `gorm:"foreignKey:PatientID" json:"patient"`
	Dentist            Dentist            `gorm:"foreignKey:DentistID" json:"dentist"`
	Service            Service            `gorm:"foreignKey:ServiceID" json:"service"`
	AppointmentType    AppointmentType    `gorm:"foreignKey:AppointmentTypeID" json:"appointment_type"`
	PatientInformation PatientInformation `gorm:"foreignKey:PatientInformationID" json:"patient_information"`
}
