package controllers

import (
	"net/http"

	"dental-clinic-management/config"
	"dental-clinic-management/models"

	"github.com/gin-gonic/gin"
)

func GetAllAppointmentTypes(c *gin.Context) {
	var types []models.AppointmentType

	if err := config.DB.Find(&types).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Không thể lấy danh sách loại cuộc hẹn",
		})
		return
	}

	c.JSON(http.StatusOK, types)
}
