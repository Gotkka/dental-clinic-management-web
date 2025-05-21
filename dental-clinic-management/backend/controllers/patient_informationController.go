package controllers

import (
	"errors"
	"net/http"

	"dental-clinic-management/config"
	"dental-clinic-management/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAllPatientInformations(c *gin.Context) {
	var patientInfo []models.PatientInformation

	// Lấy tất cả thông tin bệnh nhân từ cơ sở dữ liệu
	if err := config.DB.Find(&patientInfo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Lỗi": "Không thể lấy thông tin bệnh nhân"})
		return
	}

	c.JSON(http.StatusOK, patientInfo)
}

func CreatePatientInformation(patient *models.PatientInformation) error {
	return config.DB.Create(patient).Error
}

func UpdatePatientInformation(patient *models.PatientInformation) error {
	patient.IsNewPatient = false
	return config.DB.Save(patient).Error
}

func HandleCreateOrUpdatePatientInformation(c *gin.Context) {
	var patientInfo models.PatientInformation

	if err := c.ShouldBindJSON(&patientInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Không thể phân tích cú pháp dữ liệu đầu vào"})
		return
	}

	var existingPatient models.PatientInformation
	err := config.DB.Where("first_name = ? AND last_name = ? AND email = ? AND phone = ?",
		patientInfo.FirstName, patientInfo.LastName, patientInfo.Email, patientInfo.Phone).
		First(&existingPatient).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		// Bệnh nhân chưa tồn tại, tạo mới
		if err := CreatePatientInformation(&patientInfo); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo thông tin bệnh nhân"})
			return
		}
		c.JSON(http.StatusCreated, patientInfo)
		return
	} else if err != nil {
		// Lỗi truy vấn DB
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi truy vấn cơ sở dữ liệu"})
		return
	}

	// Bệnh nhân đã tồn tại, cập nhật thông tin
	if err := UpdatePatientInformation(&existingPatient); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể cập nhật bệnh nhân hiện có"})
		return
	}
	c.JSON(http.StatusOK, existingPatient)
}
