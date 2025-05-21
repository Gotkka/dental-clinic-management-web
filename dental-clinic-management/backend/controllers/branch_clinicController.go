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

// CreateBranch thêm mới một chi nhánh
func CreateBranch(c *gin.Context) {
	var branch models.BranchClinic
	if err := c.ShouldBindJSON(&branch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	// Kiểm tra trùng tên, địa chỉ, số điện thoại hoặc email
	var existing models.BranchClinic
	if err := config.DB.Where(
		"name = ? OR address = ? OR phone_number = ? OR email = ?",
		branch.Name, branch.Address, branch.PhoneNumber, branch.Email,
	).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tên, địa chỉ, số điện thoại hoặc email đã tồn tại"})
		return
	}

	if err := config.DB.Create(&branch).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể thêm chi nhánh"})
		return
	}
	c.JSON(http.StatusOK, branch)
}

// UpdateBranch cập nhật thông tin chi nhánh
func UpdateBranch(c *gin.Context) {
	id := c.Param("id")
	var branch models.BranchClinic
	if err := config.DB.First(&branch, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chi nhánh"})
		return
	}
	var input models.BranchClinic
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}
	branch.Name = input.Name
	branch.Address = input.Address
	branch.PhoneNumber = input.PhoneNumber
	branch.Email = input.Email
	if err := config.DB.Save(&branch).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể cập nhật chi nhánh"})
		return
	}
	c.JSON(http.StatusOK, branch)
}

// DeleteBranch xóa chi nhánh
func DeleteBranch(c *gin.Context) {
	id := c.Param("id")
	var branch models.BranchClinic
	if err := config.DB.First(&branch, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chi nhánh"})
		return
	}

	if err := config.DB.Delete(&branch).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể xoá chi nhánh"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Xoá chi nhánh thành công"})
}
