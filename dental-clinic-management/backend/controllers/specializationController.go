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

func CreateSpecialization(c *gin.Context) {
	var specialization models.Specialization

	if err := c.ShouldBindJSON(&specialization); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Dữ liệu không hợp lệ",
		})
		return
	}

	// Kiểm tra xem bác sĩ đã tồn tại chưa
	var existingSpecialization models.Specialization
	if err := config.DB.Where("name = ?", specialization.Name).First(&existingSpecialization).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error": "Đã tồn tại chuyên khoa này",
		})
		return
	}

	if err := config.DB.Create(&specialization).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Không thể tạo chuyên khoa",
		})
		return
	}

	c.JSON(http.StatusCreated, specialization)
}

func UpdateSpecialization(c *gin.Context) {
	var specialization models.Specialization
	id := c.Param("id")

	if err := config.DB.First(&specialization, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Không tìm thấy chuyên khoa",
		})
		return
	}

	if err := c.ShouldBindJSON(&specialization); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Dữ liệu không hợp lệ",
		})
		return
	}

	if err := config.DB.Save(&specialization).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Không thể cập nhật chuyên khoa",
		})
		return
	}

	c.JSON(http.StatusOK, specialization)
}

func DeleteSpecialization(c *gin.Context) {
	id := c.Param("id")
	var specialization models.Specialization

	if err := config.DB.First(&specialization, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Không tìm thấy chuyên khoa",
		})
		return
	}

	if err := config.DB.Delete(&specialization).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Không thể xóa chuyên khoa",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Xóa chuyên khoa thành công",
	})
}
