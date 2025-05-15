package models

import (
	"time"
)

type Patient struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"uniqueIndex;not null" json:"user_id"`
	Email     string    `gorm:"type:varchar(100)" json:"email"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`

	User *User `gorm:"foreignKey:UserID" json:"-"`
}
