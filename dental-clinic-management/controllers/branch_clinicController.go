package controllers

import (
	"net/http"

	"dental-clinic-management/config" // Đảm bảo import DB từ file config hoặc main
	"dental-clinic-management/models" // Thay bằng đường dẫn thực tế đến package models

	"github.com/gin-gonic/gin"
)

// GetAllDentists trả về danh sách tất cả bác sĩ
func GetAllBranches(c *gin.Context) {
	var branches []models.BranchClinic

	if err := config.DB.Find(&branches).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Không thể lấy danh sách chi nhánh",
		})
		return
	}

	c.JSON(http.StatusOK, branches)
}
