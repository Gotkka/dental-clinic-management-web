package models

import (
	"time"
)

// Dentist chứa hồ sơ chi tiết của nha sĩ
// Liên kết 1–1 với User qua UserID
type Dentist struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	UserID           uint      `gorm:"uniqueIndex;not null" json:"user_id"`
	ImgURL           string    `gorm:"type:varchar(100)" json:"img_url"`
	FullName         string    `gorm:"type:varchar(100);not null" json:"full_name"`
	SpecializationID uint      `gorm:"not null" json:"specialization_id"`
	BranchClinicID   uint      `gorm:"not null" json:"branch_clinic_id"`
	PhoneNumber      string    `gorm:"type:varchar(15)" json:"phone_number"`
	Email            string    `gorm:"type:varchar(100)" json:"email"`
	CreatedAt        time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Associations
	User           User           `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Specialization Specialization `gorm:"foreignKey:SpecializationID" json:"specialization"`
	BranchClinic   BranchClinic   `gorm:"foreignKey:BranchClinicID" json:"branch_clinic"`
}
