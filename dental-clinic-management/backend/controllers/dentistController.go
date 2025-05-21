package controllers

import (
	"net/http"
	"time"

	"dental-clinic-management/config" // Đảm bảo import DB từ file config hoặc main
	"dental-clinic-management/models" // Thay bằng đường dẫn thực tế đến package models

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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

func CreateDentist(c *gin.Context) {
	var input struct {
		Username         string `json:"username" binding:"required"`
		Password         string `json:"password" binding:"required"`
		FullName         string `json:"full_name" binding:"required"`
		ImgURL           string `json:"img_url"`
		SpecializationID uint   `json:"specialization_id" binding:"required"`
		BranchClinicID   uint   `json:"branch_clinic_id" binding:"required"`
		PhoneNumber      string `json:"phone_number" binding:"required"`
		Email            string `json:"email" binding:"required,email"`
	}

	// Bind dữ liệu từ request
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ", "details": err.Error()})
		return
	}

	// Kiểm tra username đã tồn tại
	var existingUser models.User
	if err := config.DB.Where("username = ?", input.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Tên đăng nhập đã tồn tại"})
		return
	}

	// Hash password trước khi lưu
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể mã hóa mật khẩu", "details": err.Error()})
		return
	}

	// Tạo user mới với role dentist
	newUser := models.User{
		Username:  input.Username,
		Password:  string(hashedPassword),
		Role:      "dentist",
		CreatedAt: time.Now(),
	}

	if err := config.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Không thể tạo tài khoản người dùng",
			"details": err.Error(),
		})
		return
	}

	// Kiểm tra trùng số điện thoại hoặc email
	var existingDentist models.Dentist
	if err := config.DB.Where("phone_number = ? OR email = ?", input.PhoneNumber, input.Email).First(&existingDentist).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Đã tồn tại bác sĩ với số điện thoại hoặc email này"})
		return
	}

	// Kiểm tra SpecializationID tồn tại
	var specialization models.Specialization
	if err := config.DB.First(&specialization, input.SpecializationID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Chuyên khoa không tồn tại", "details": err.Error()})
		return
	}

	// Kiểm tra BranchClinicID tồn tại
	var branchClinic models.BranchClinic
	if err := config.DB.First(&branchClinic, input.BranchClinicID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Chi nhánh không tồn tại", "details": err.Error()})
		return
	}

	// Tạo bác sĩ
	newDentist := models.Dentist{
		UserID:           newUser.ID,
		FullName:         input.FullName,
		ImgURL:           input.ImgURL,
		SpecializationID: input.SpecializationID,
		BranchClinicID:   input.BranchClinicID,
		PhoneNumber:      input.PhoneNumber,
		Email:            input.Email,
		CreatedAt:        time.Now(),
	}

	if err := config.DB.Create(&newDentist).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Không thể tạo hồ sơ bác sĩ",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Tạo bác sĩ thành công",
		"user":    newUser,
		"dentist": newDentist,
	})
}
func UpdateDentist(c *gin.Context) {
	var dentist models.Dentist
	id := c.Param("id")

	if err := config.DB.First(&dentist, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Bác sĩ không tồn tại",
		})
		return
	}

	if err := c.ShouldBindJSON(&dentist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Dữ liệu không hợp lệ",
		})
		return
	}

	if err := config.DB.Save(&dentist).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Không thể cập nhật bác sĩ",
		})
		return
	}

	c.JSON(http.StatusOK, dentist)
}

func DeleteDentist(c *gin.Context) {
	id := c.Param("id")
	var dentist models.Dentist

	// Tìm bác sĩ theo ID
	if err := config.DB.First(&dentist, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "Bác sĩ không tồn tại",
			"details": err.Error(),
		})
		return
	}

	// Sử dụng transaction để đảm bảo tính toàn vẹn
	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Đã xảy ra lỗi không mong muốn khi xóa bác sĩ",
				"details": r,
			})
		}
	}()

	// Tìm và xóa User liên quan
	var user models.User
	if err := tx.First(&user, dentist.UserID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Không thể tìm thấy tài khoản người dùng liên quan",
			"details": err.Error(),
		})
		return
	}

	// Xóa Dentist
	if err := tx.Delete(&dentist).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Không thể xóa bác sĩ",
			"details": err.Error(),
		})
		return
	}

	// Xóa User
	if err := tx.Delete(&user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Không thể xóa tài khoản người dùng",
			"details": err.Error(),
		})
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Không thể hoàn tất việc xóa",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Xóa bác sĩ và tài khoản người dùng thành công",
	})
}
