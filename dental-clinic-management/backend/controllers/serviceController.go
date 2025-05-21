package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	// "gorm.io/gorm"

	"dental-clinic-management/config"
	"dental-clinic-management/models"
)

func GetAllServices(c *gin.Context) {
	var services []models.Service

	if err := config.DB.Find(&services).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Không thể lấy danh sách dịch vụ",
		})
		return
	}

	c.JSON(http.StatusOK, services)
}

// Thêm mới dịch vụ
func CreateService(c *gin.Context) {
	var service models.Service
	if err := c.ShouldBindJSON(&service); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	// Kiểm tra trùng tên và mô tả
	var existing models.Service
	if err := config.DB.Where("name = ?", service.Name).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tên dịch vụ đã tồn tại"})
		return
	}

	if err := config.DB.Create(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể thêm dịch vụ"})
		return
	}
	c.JSON(http.StatusOK, service)
}

// Sửa dịch vụ
func UpdateService(c *gin.Context) {
	id := c.Param("id")
	var service models.Service
	if err := config.DB.First(&service, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy dịch vụ"})
		return
	}

	if err := c.ShouldBindJSON(&service); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	if err := config.DB.Save(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể cập nhật dịch vụ"})
		return
	}
	c.JSON(http.StatusOK, service)
}

// Xóa dịch vụ
func DeleteService(c *gin.Context) {
	id := c.Param("id")
	var service models.Service
	if err := config.DB.First(&service, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy dịch vụ"})
		return
	}
	if err := config.DB.Delete(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể xoá dịch vụ"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Xoá dịch vụ thành công"})
}
