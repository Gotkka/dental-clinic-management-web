package models

import (
	"time"
)

// User chứa thông tin đăng nhập và phân quyền
// Liên kết 1–1 tới Patient hoặc Dentist
// role có thể là "admin", "receptionist", "dentist", "patient"
type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Username  string    `gorm:"type:varchar(50);unique;not null" json:"username"`
	Password  string    `gorm:"type:text;not null" json:"password"`
	Role      string    `gorm:"type:varchar(50);not null" json:"role"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Quan hệ 1–1 với profile, dùng pointer để tránh recursive type
	Patient *Patient `gorm:"foreignKey:UserID" json:"patient,omitempty"`
	Dentist *Dentist `gorm:"foreignKey:UserID" json:"dentist,omitempty"`
}
