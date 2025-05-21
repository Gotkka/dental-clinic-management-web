package models

import (
	"time"
)

type Service struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	Name             string    `gorm:"type:varchar(100);uniqueIndex:unique_service_name" json:"name"`
	Description      string    `gorm:"type:text" json:"description"`
	Price            float64   `gorm:"type:numeric(10,2)" json:"price"`
	Duration         int       `gorm:"type:int" json:"duration"`
	SpecializationID uint      `gorm:"type:integer;not null" json:"specialization_id"`
	CreatedAt        time.Time `gorm:"autoCreateTime" json:"created_at"`

	Specialization Specialization `gorm:"foreignKey:SpecializationID" json:"specialization"`
}
