package controllers

import (
	"dental-clinic-management/config"
	"dental-clinic-management/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllAppointments(c *gin.Context) {
	var appointments []models.Appointment
	if err := config.DB.
		Debug().
		Preload("Dentist").
		Preload("Service").
		Preload("Patient").
		Preload("AppointmentType").
		Preload("PatientInformation").
		Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách lịch hẹn"})
		return
	}
	log.Printf("All appointments: %+v\n", appointments)
	c.JSON(http.StatusOK, appointments)
}

func CreateAppointment(c *gin.Context) {
	var newAppointment models.Appointment

	// Bước 1: Bind JSON từ client
	if err := c.ShouldBindJSON(&newAppointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Bước 2: Lưu vào database
	if err := config.DB.Create(&newAppointment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi tạo lịch hẹn"})
		return
	}

	// Bước 3: Trả về kết quả
	c.JSON(http.StatusCreated, newAppointment)
}

func GetUpcomingAppointments(c *gin.Context) {
	var appointments []models.Appointment
	if err := config.DB.
		Debug().
		Preload("Dentist").
		Preload("Dentist.Specialization").
		Preload("Service").
		Preload("Patient").
		Preload("AppointmentType").
		Preload("PatientInformation").
		Where("status = ?", "Đang chờ").
		Order("appointment_time asc").
		Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy lịch hẹn sắp tới"})
		return
	}
	log.Printf("Upcoming appointments: %+v\n", appointments)
	c.JSON(http.StatusOK, appointments)
}

func GetCompletedAppointments(c *gin.Context) {
	var appointments []models.Appointment

	if err := config.DB.
		Debug().
		Preload("Dentist").
		Preload("Dentist.Specialization").
		Preload("Service").
		Preload("Patient").
		Preload("AppointmentType").
		Preload("PatientInformation").
		Where("status = ?", "Hoàn thành").
		Order("appointment_time desc").
		Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy lịch hẹn đã hoàn thành"})
		return
	}

	c.JSON(http.StatusOK, appointments)
}

func GetCancelledAppointments(c *gin.Context) {
	var appointments []models.Appointment

	if err := config.DB.
		Debug().
		Preload("Dentist").
		Preload("Dentist.Specialization").
		Preload("Service").
		Preload("Patient").
		Preload("AppointmentType").
		Preload("PatientInformation").
		Where("status = ?", "Hủy").
		Order("appointment_time desc").
		Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy lịch hẹn bị hủy"})
		return
	}

	c.JSON(http.StatusOK, appointments)
}

func GetAppointmentByID(c *gin.Context) {
	id := c.Param("id") // Lấy id từ URL param

	var appointment models.Appointment

	if err := config.DB.
		Debug().
		Preload("Dentist").
		Preload("Dentist.Specialization").
		Preload("Service").
		Preload("Patient").
		Preload("AppointmentType").
		Preload("PatientInformation").
		First(&appointment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy lịch hẹn"})
		return
	}

	c.JSON(http.StatusOK, appointment)
}
