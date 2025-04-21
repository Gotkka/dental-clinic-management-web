package controllers

import (
	"net/http"

	"dental-clinic-management/config" // Đảm bảo import DB từ file config hoặc main
	"dental-clinic-management/models" // Thay bằng đường dẫn thực tế đến package models

	"github.com/gin-gonic/gin"
)

// GetAllDentists trả về danh sách tất cả bác sĩ
func GetAllSpecializations(c *gin.Context) {
	var specializations []models.Specialization

	if err := config.DB.Find(&specializations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Không thể lấy danh sách bác sĩ",
		})
		return
	}

	c.JSON(http.StatusOK, specializations)
}
