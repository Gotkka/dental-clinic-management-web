package models

// Service chứa các dịch vụ nha khoa
type Service struct {
	ID          uint    `gorm:"primaryKey" json:"id"`
	Name        string  `gorm:"type:varchar(100)" json:"name"`
	Description string  `gorm:"type:text" json:"description"`
	Price       float64 `gorm:"type:numeric(10,2)" json:"price"`
	Duration    int     `gorm:"type:int" json:"duration"`
}
