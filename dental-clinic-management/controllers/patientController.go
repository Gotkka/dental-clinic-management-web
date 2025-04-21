package controllers

import (
	"net/http"

	"dental-clinic-management/config" // Đảm bảo import DB từ file config hoặc main
	"dental-clinic-management/models" // Thay bằng đường dẫn thực tế đến package models

	"github.com/gin-gonic/gin"
)

// GetAllDentists trả về danh sách tất cả bác sĩ
func GetAllPatients(c *gin.Context) {
	var patients []models.Patient

	if err := config.DB.Find(&patients).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Không thể lấy danh sách bệnh nhân",
		})
		return
	}

	c.JSON(http.StatusOK, patients)
}

func CreatePatient(c *gin.Context) {
	var patient models.Patient
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	if err := config.DB.Create(&patient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo bệnh nhân"})
		return
	}

	c.JSON(http.StatusCreated, patient)
}
