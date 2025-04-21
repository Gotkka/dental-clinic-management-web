package controllers

import (
	"dental-clinic-management/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var appointments []models.Appointment

func GetAppointments(c *gin.Context) {
	c.JSON(http.StatusOK, appointments)
}

func CreateAppointment(c *gin.Context) {
	var newAppointment models.Appointment
	if err := c.ShouldBindJSON(&newAppointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	appointments = append(appointments, newAppointment)
	c.JSON(http.StatusCreated, newAppointment)
}
