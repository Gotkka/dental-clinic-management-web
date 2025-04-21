package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	// "gorm.io/gorm"

	"dental-clinic-management/config"
	"dental-clinic-management/models"
)

// ServiceController xử lý các request liên quan đến dịch vụ nha khoa
// type ServiceController struct {
// 	DB *gorm.DB
// }

// NewServiceController tạo một controller mới cho dịch vụ
// func NewServiceController(db *gorm.DB) *ServiceController {
// 	return &ServiceController{DB: db}
// }

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

// GetServiceByID trả về một dịch vụ dựa trên ID
// func (sc *ServiceController) GetServiceByID(c *gin.Context) {
// 	id, err := strconv.Atoi(c.Param("id"))
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"error": "ID không hợp lệ",
// 		})
// 		return
// 	}

// 	var service models.Service
// 	result := sc.DB.First(&service, id)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"error": "Không tìm thấy dịch vụ",
// 		})
// 		return
// 	}

// 	c.JSON(http.StatusOK, service)
// }

// CreateService tạo một dịch vụ mới
// func (sc *ServiceController) CreateService(c *gin.Context) {
// 	var service models.Service
// 	if err := c.ShouldBindJSON(&service); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"error": "Dữ liệu không hợp lệ",
// 		})
// 		return
// 	}

// 	result := sc.DB.Create(&service)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"error": "Không thể tạo dịch vụ",
// 		})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, service)
// }

// UpdateService cập nhật thông tin của một dịch vụ
// func (sc *ServiceController) UpdateService(c *gin.Context) {
// 	id, err := strconv.Atoi(c.Param("id"))
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"error": "ID không hợp lệ",
// 		})
// 		return
// 	}

// 	var service models.Service
// 	result := sc.DB.First(&service, id)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"error": "Không tìm thấy dịch vụ",
// 		})
// 		return
// 	}

// 	if err := c.ShouldBindJSON(&service); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"error": "Dữ liệu không hợp lệ",
// 		})
// 		return
// 	}

// 	sc.DB.Save(&service)
// 	c.JSON(http.StatusOK, service)
// }

// DeleteService xóa một dịch vụ dựa trên ID
// func (sc *ServiceController) DeleteService(c *gin.Context) {
// 	id, err := strconv.Atoi(c.Param("id"))
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"error": "ID không hợp lệ",
// 		})
// 		return
// 	}

// 	var service models.Service
// 	result := sc.DB.First(&service, id)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"error": "Không tìm thấy dịch vụ",
// 		})
// 		return
// 	}

// 	sc.DB.Delete(&service)
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Đã xóa dịch vụ thành công",
// 	})
// }
