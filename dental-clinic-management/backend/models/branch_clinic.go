package models

import (
	"time"
)

type BranchClinic struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"type:varchar(100);not null" json:"name"`
	Address     string    `gorm:"type:varchar(255);not null" json:"address"`
	PhoneNumber string    `gorm:"type:varchar(15)" json:"phone_number"`
	Email       string    `gorm:"type:varchar(100)" json:"email"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}
