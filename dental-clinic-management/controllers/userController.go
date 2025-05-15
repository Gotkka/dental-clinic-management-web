package controllers

import (
	"dental-clinic-management/config"
	"dental-clinic-management/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Đăng ký người dùng
func RegisterUser(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	// Validate input
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

	// Tạo User mới (không mã hóa mật khẩu)
	newUser := models.User{
		Username:  input.Username,
		Password:  input.Password, // Lưu thẳng plaintext
		Role:      "patient",
		CreatedAt: time.Now(),
	}

	if err := config.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo tài khoản"})
		return
	}

	// Tạo Patient tương ứng
	newPatient := models.Patient{
		UserID:    newUser.ID,
		Email:     input.Email,
		CreatedAt: time.Now(),
	}

	if err := config.DB.Create(&newPatient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo hồ sơ bệnh nhân"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Đăng ký thành công",
		"user": gin.H{
			"id":       newUser.ID,
			"username": newUser.Username,
			"role":     newUser.Role,
		},
		"patient": newPatient,
	})
}

// Đăng nhập
func LoginUser(c *gin.Context) {
	var loginData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	var user models.User
	if err := config.DB.Where("username = ?", loginData.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Tên đăng nhập không tồn tại"})
		return
	}

	// So sánh mật khẩu
	if user.Password != loginData.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Mật khẩu không đúng"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Đăng nhập thành công", "user": user})
}

// func GetFullNameByUsername(c *gin.Context) {
// 	username := c.Param("username")

// 	// Tìm user dựa trên username
// 	var user models.User
// 	if err := config.DB.Where("username = ?", username).First(&user).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy người dùng"})
// 		return
// 	}

// 	var fullName string

// 	switch user.Role {
// 	case "patient":
// 		var patient models.Patient
// 		if err := config.DB.Where("user_id = ?", user.ID).First(&patient).Error; err != nil {
// 			c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy hồ sơ bệnh nhân"})
// 			return
// 		}
// 		fullName = patient.FullName

// 	case "dentist":
// 		var dentist models.Dentist
// 		if err := config.DB.Where("user_id = ?", user.ID).First(&dentist).Error; err != nil {
// 			c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy hồ sơ nha sĩ"})
// 			return
// 		}
// 		fullName = dentist.FullName

// 	default:
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Vai trò người dùng không hợp lệ"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"username":  username,
// 		"role":      user.Role,
// 		"full_name": fullName,
// 	})
// }
