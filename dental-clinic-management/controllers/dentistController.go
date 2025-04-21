package controllers

import (
	"net/http"

	"dental-clinic-management/config" // Đảm bảo import DB từ file config hoặc main
	"dental-clinic-management/models" // Thay bằng đường dẫn thực tế đến package models

	"github.com/gin-gonic/gin"
)

// GetAllDentists trả về danh sách tất cả bác sĩ
func GetAllDentists(c *gin.Context) {
	var dentists []models.Dentist

	if err := config.DB.Find(&dentists).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Không thể lấy danh sách bác sĩ",
		})
		return
	}

	c.JSON(http.StatusOK, dentists)
}
