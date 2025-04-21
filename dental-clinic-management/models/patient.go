package models

import (
	"time"
)

// Patient chứa hồ sơ chi tiết của bệnh nhân
// Liên kết 1–1 với User qua UserID
type Patient struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"uniqueIndex;not null" json:"user_id"`
	FullName    string    `gorm:"type:varchar(100)" json:"full_name"`
	PhoneNumber string    `gorm:"type:varchar(15)" json:"phone_number"`
	Email       string    `gorm:"type:varchar(100)" json:"email"`
	Gender      string    `gorm:"type:varchar(10)" json:"gender"`
	BirthDate   time.Time `json:"birth_date"`
	Address     string    `gorm:"type:text" json:"address"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Quan hệ 1–1 với User, dùng pointer
	User *User `gorm:"foreignKey:UserID" json:"-"`
}
