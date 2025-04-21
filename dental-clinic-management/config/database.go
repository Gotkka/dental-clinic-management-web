package config

import (
	"dental-clinic-management/models"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// Hàm kết nối đến CSDL PostgreSQL và trả về lỗi nếu có
func ConnectDB() error {
	dsn := "host=localhost user=postgres password=vinh12052004 dbname=clinic_db port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("❌ Lỗi kết nối CSDL PostgreSQL: %w", err)
	}

	// Tự động tạo bảng
	err = DB.AutoMigrate(&models.Appointment{}) // Sau sẽ thêm các model khác
	if err != nil {
		return fmt.Errorf("❌ Lỗi AutoMigrate: %w", err)
	}

	fmt.Println("✅ Kết nối CSDL PostgreSQL thành công!")
	return nil
}
