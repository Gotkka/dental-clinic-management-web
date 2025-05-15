package controllers

import (
	"dental-clinic-management/config"
	"dental-clinic-management/models"
	"fmt"
	"log"
	"net/http"
	"time"

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
	id := c.Param("id")

	var appointment models.Appointment

	if err := config.DB.
		Debug().
		Preload("Dentist").
		Preload("Dentist.Specialization").
		Preload("Dentist.BranchClinic").
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

func GetExistingAppointments(c *gin.Context) {
	// Lấy tham số từ query
	dentistID := c.Query("dentist_id")
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	// Xử lý múi giờ Asia/Ho_Chi_Minh (+07:00)
	loc, err := time.LoadLocation("Asia/Ho_Chi_Minh")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tải múi giờ"})
		return
	}

	// Parse startDate và endDate với múi giờ +07:00
	var startDate, endDate time.Time
	if startDateStr != "" {
		startDate, err = time.ParseInLocation("2006-01-02", startDateStr, loc)
		if err != nil {
			startDate = time.Now().In(loc)
		}
	} else {
		startDate = time.Now().In(loc)
	}

	if endDateStr != "" {
		endDate, err = time.ParseInLocation("2006-01-02", endDateStr, loc)
		if err != nil {
			endDate = startDate.AddDate(0, 0, 7)
		}
	} else {
		endDate = startDate.AddDate(0, 0, 7)
	}

	endDate = time.Date(endDate.Year(), endDate.Month(), endDate.Day(), 0, 0, 0, 0, loc).AddDate(0, 0, 1)

	c.Request.Header.Set("X-Start-Date", startDate.String())
	c.Request.Header.Set("X-End-Date", endDate.String())

	var appointments []models.Appointment
	query := config.DB.Where("appointment_time >= ? AND appointment_time < ?", startDate, endDate).
		Where("status IN ?", []string{"Đang chờ", "Xác nhận"})
	if dentistID != "" {
		query = query.Where("dentist_id = ?", dentistID)
	}

	if err := query.Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách lịch hẹn"})
		return
	}

	c.Request.Header.Set("X-Appointment-Count", fmt.Sprintf("%d", len(appointments)))
	for i, appt := range appointments {
		c.Request.Header.Set(fmt.Sprintf("X-Appointment-%d", i), fmt.Sprintf("ID: %d, Time: %s, DentistID: %d, Status: %s", appt.ID, appt.AppointmentTime.String(), appt.DentistID, appt.Status))
	}

	c.JSON(http.StatusOK, gin.H{"data": appointments})
}
