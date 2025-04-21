package controllers

import (
	"net/http"

	"dental-clinic-management/config"
	"dental-clinic-management/models"

	"github.com/gin-gonic/gin"
)

func CreateNewPatientInformation(c *gin.Context) {
	var patientInfo models.PatientInformation

	// Bind JSON data to the struct
	if err := c.ShouldBindJSON(&patientInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Lỗi": "Không thể phân tích cú pháp dữ liệu đầu vào"})
		return
	}

	// Save the new patient information to the database
	if err := config.DB.Create(&patientInfo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Lỗi": "Không thể tạo thông tin bệnh nhân"})
		return
	}

	c.JSON(http.StatusCreated, patientInfo)
}
