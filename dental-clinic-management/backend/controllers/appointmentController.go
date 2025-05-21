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
		log.Printf("Error fetching all appointments: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách lịch hẹn"})
		return
	}
	log.Printf("Successfully fetched all appointments: %v", len(appointments))
	log.Printf("All appointments: %+v\n", appointments)
	c.JSON(http.StatusOK, appointments)
}

func CreateAppointment(c *gin.Context) {
	var newAppointment models.Appointment
	log.Printf("Received new appointment request: %+v", c.Request.Body)

	// Bước 1: Bind JSON từ client
	if err := c.ShouldBindJSON(&newAppointment); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Printf("Bound appointment data: %+v", newAppointment)

	// Bước 2: Kiểm tra xung đột thời gian
	var existingAppointments []models.Appointment
	if err := config.DB.
		Where("dentist_id = ? AND appointment_time::date = ?", newAppointment.DentistID, newAppointment.AppointmentTime).
		Where("status IN ?", []string{"Chờ xác nhận", "Đã xác nhận"}).
		Find(&existingAppointments).Error; err != nil {
		log.Printf("Error checking existing appointments: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi kiểm tra lịch hẹn hiện có"})
		return
	}
	log.Printf("Found %d existing appointments for dentist %d on %v", len(existingAppointments), newAppointment.DentistID, newAppointment.AppointmentTime)

	// Lấy thông tin dịch vụ để tính duration
	var service models.Service
	if err := config.DB.First(&service, newAppointment.ServiceID).Error; err != nil {
		log.Printf("Error fetching service: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Không tìm thấy dịch vụ"})
		return
	}
	log.Printf("Fetched service for ID %d: %+v", newAppointment.ServiceID, service)

	newAppointmentEnd := newAppointment.AppointmentTime.Add(time.Duration(service.Duration) * time.Minute)
	for _, appt := range existingAppointments {
		var apptService models.Service
		if err := config.DB.First(&apptService, appt.ServiceID).Error; err != nil {
			log.Printf("Error fetching appointment service: %v", err)
			continue
		}
		apptEnd := appt.AppointmentTime.Add(time.Duration(apptService.Duration) * time.Minute)
		log.Printf("Checking conflict: New (%v - %v) vs Existing (%v - %v)", newAppointment.AppointmentTime, newAppointmentEnd, appt.AppointmentTime, apptEnd)
		if newAppointment.AppointmentTime.Before(apptEnd) && newAppointmentEnd.After(appt.AppointmentTime) {
			log.Printf("Conflict detected for dentist %d at %v", newAppointment.DentistID, newAppointment.AppointmentTime)
			c.JSON(http.StatusConflict, gin.H{"error": "Khung giờ này đã được đặt bởi lịch hẹn khác"})
			return
		}
	}

	// Bước 3: Lưu vào database
	if err := config.DB.Create(&newAppointment).Error; err != nil {
		log.Printf("Error creating appointment: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi tạo lịch hẹn"})
		return
	}
	log.Printf("Successfully created appointment: %+v", newAppointment)

	// Bước 4: Trả về kết quả
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
		Where("status = ? OR status = ?", "Chờ xác nhận", "Đã xác nhận").
		Order("appointment_time asc").
		Find(&appointments).Error; err != nil {
		log.Printf("Error fetching upcoming appointments: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy lịch hẹn sắp tới"})
		return
	}
	log.Printf("Successfully fetched %d upcoming appointments", len(appointments))
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
		log.Printf("Error fetching completed appointments: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy lịch hẹn đã hoàn thành"})
		return
	}
	log.Printf("Successfully fetched %d completed appointments", len(appointments))
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
		Where("status = ?", "Đã hủy").
		Order("appointment_time desc").
		Find(&appointments).Error; err != nil {
		log.Printf("Error fetching cancelled appointments: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy lịch hẹn bị hủy"})
		return
	}
	log.Printf("Successfully fetched %d cancelled appointments", len(appointments))
	c.JSON(http.StatusOK, appointments)
}

func GetAppointmentByID(c *gin.Context) {
	id := c.Param("id")
	log.Printf("Fetching appointment with ID: %s", id)

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
		log.Printf("Error fetching appointment ID %s: %v", id, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy lịch hẹn"})
		return
	}
	log.Printf("Successfully fetched appointment ID %s: %+v", id, appointment)
	c.JSON(http.StatusOK, appointment)
}

func GetExistingAppointments(c *gin.Context) {
	// Lấy tham số từ query
	dentistID := c.Query("dentist_id")
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")
	log.Printf("Query params: dentist_id=%s, start_date=%s, end_date=%s", dentistID, startDateStr, endDateStr)

	// Xử lý múi giờ Asia/Ho_Chi_Minh (+07:00)
	loc, err := time.LoadLocation("Asia/Ho_Chi_Minh")
	if err != nil {
		log.Printf("Error loading location: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tải múi giờ"})
		return
	}

	// Parse startDate và endDate với múi giờ +07:00
	var startDate, endDate time.Time
	if startDateStr != "" {
		startDate, err = time.ParseInLocation("2006-01-02", startDateStr, loc)
		if err != nil {
			log.Printf("Invalid start date, using now: %v", err)
			startDate = time.Now().In(loc)
		}
	} else {
		startDate = time.Now().In(loc)
		log.Printf("No start date provided, using: %v", startDate)
	}

	if endDateStr != "" {
		endDate, err = time.ParseInLocation("2006-01-02", endDateStr, loc)
		if err != nil {
			log.Printf("Invalid end date, using default: %v", err)
			endDate = startDate.AddDate(0, 0, 7)
		}
	} else {
		endDate = startDate.AddDate(0, 0, 7)
		log.Printf("No end date provided, using: %v", endDate)
	}

	endDate = time.Date(endDate.Year(), endDate.Month(), endDate.Day(), 0, 0, 0, 0, loc).AddDate(0, 0, 1)
	log.Printf("Adjusted end date: %v", endDate)

	c.Request.Header.Set("X-Start-Date", startDate.String())
	c.Request.Header.Set("X-End-Date", endDate.String())

	var appointments []models.Appointment
	query := config.DB.Where("appointment_time >= ? AND appointment_time < ?", startDate, endDate).
		Where("status IN ?", []string{"Chờ xác nhận", "Đã xác nhận"})
	if dentistID != "" {
		query = query.Where("dentist_id = ?", dentistID)
		log.Printf("Filtering by dentist_id: %s", dentistID)
	}

	if err := query.Find(&appointments).Error; err != nil {
		log.Printf("Error fetching existing appointments: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách lịch hẹn"})
		return
	}
	log.Printf("Fetched %d existing appointments", len(appointments))

	c.Request.Header.Set("X-Appointment-Count", fmt.Sprintf("%d", len(appointments)))
	for i, appt := range appointments {
		c.Request.Header.Set(fmt.Sprintf("X-Appointment-%d", i), fmt.Sprintf("ID: %d, Time: %s, DentistID: %d, Status: %s", appt.ID, appt.AppointmentTime.String(), appt.DentistID, appt.Status))
		log.Printf("Appointment %d: %+v", i, appt)
	}

	c.JSON(http.StatusOK, gin.H{"data": appointments})
}

func UpdateAppointment(c *gin.Context) {
	id := c.Param("id")
	log.Printf("Updating appointment with ID: %s", id)

	var appointment models.Appointment
	if err := config.DB.First(&appointment, id).Error; err != nil {
		log.Printf("Error finding appointment ID %s: %v", id, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy lịch hẹn"})
		return
	}
	log.Printf("Found appointment to update: %+v", appointment)

	var updateData models.Appointment
	if err := c.ShouldBindJSON(&updateData); err != nil {
		log.Printf("Error binding update data: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Printf("Update data received: %+v", updateData)

	if err := config.DB.Model(&appointment).Updates(updateData).Error; err != nil {
		log.Printf("Error updating appointment: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi cập nhật lịch hẹn"})
		return
	}
	log.Printf("Successfully updated appointment ID %s: %+v", id, appointment)
	c.JSON(http.StatusOK, appointment)
}

func GetAppointmentsByDate(c *gin.Context) {
	from := c.Query("from")
	to := c.Query("to")
	log.Printf("Query params: from=%s, to=%s", from, to)

	if from == "" || to == "" {
		log.Printf("Missing from or to parameter")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing from or to parameter"})
		return
	}

	layout := "2006-01-02"
	fromDate, err := time.Parse(layout, from)
	if err != nil {
		log.Printf("Invalid from date format: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid from date format: %s", err.Error())})
		return
	}

	toDate, err := time.Parse(layout, to)
	if err != nil {
		log.Printf("Invalid to date format: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid to date format: %s", err.Error())})
		return
	}

	// Ensure toDate includes the full day
	toDate = toDate.AddDate(0, 0, 1)
	log.Printf("Adjusted toDate: %v", toDate)

	var appointments []models.Appointment
	if err := config.DB.
		Where("appointment_time >= ? AND appointment_time < ?", fromDate, toDate).
		Order("appointment_time asc").
		Find(&appointments).Error; err != nil {
		log.Printf("Error fetching appointments by date: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to fetch appointments: %s", err.Error())})
		return
	}
	log.Printf("Fetched %d appointments for date range %v to %v", len(appointments), fromDate, toDate)

	c.JSON(http.StatusOK, gin.H{"appointments": appointments})
}

// Struct trả về cho client
type AvailableSlot struct {
	Time      string    `json:"time"`
	Available bool      `json:"available"`
	StartTime time.Time `json:"-"`
	EndTime   time.Time `json:"-"`
}

// Hàm loại bỏ phần tử trùng trong slice uint
func uniqueUintSlice(input []uint) []uint {
	m := make(map[uint]bool)
	var result []uint
	for _, v := range input {
		if !m[v] {
			m[v] = true
			result = append(result, v)
		}
	}
	return result
}

func GetAvailableSlots(c *gin.Context) {
	// Lấy tham số từ query
	dentistID := c.Query("dentist_id")
	dateStr := c.Query("date")
	serviceID := c.Query("service_id") // Thêm tham số service_id

	log.Printf("Received query params: dentist_id=%s, date=%s, service_id=%s", dentistID, dateStr, serviceID)

	if dentistID == "" || dateStr == "" || serviceID == "" {
		log.Printf("Missing dentist_id, date, or service_id parameter")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing dentist_id, date, or service_id parameter"})
		return
	}

	// Xử lý múi giờ Asia/Ho_Chi_Minh (+07:00)
	loc, err := time.LoadLocation("Asia/Ho_Chi_Minh")
	if err != nil {
		log.Printf("Error loading location: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tải múi giờ"})
		return
	}

	// Parse ngày với múi giờ
	selectedDate, err := time.ParseInLocation("2006-01-02", dateStr, loc)
	if err != nil {
		log.Printf("Invalid date format: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}
	log.Printf("Parsed selected date: %v, Location: %v", selectedDate, selectedDate.Location())

	// Lấy tất cả lịch hẹn của bác sĩ trong ngày
	var appointments []models.Appointment
	if err := config.DB.
		Where("dentist_id = ? AND appointment_time::date = ?", dentistID, selectedDate).
		Where("status IN ?", []string{"Chờ xác nhận", "Đã xác nhận"}).
		Find(&appointments).Error; err != nil {
		log.Printf("Error fetching appointments for dentist %s on %v: %v", dentistID, selectedDate, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách lịch hẹn"})
		return
	}
	log.Printf("Fetched %d appointments for dentist %s on %v", len(appointments), dentistID, selectedDate)

	// Log chi tiết từng appointment time và location
	for _, app := range appointments {
		log.Printf("Appointment ID: %d, Time: %v, Location: %v, ServiceID: %d", app.ID, app.AppointmentTime, app.AppointmentTime.Location(), app.ServiceID)
	}

	// Lấy thông tin dịch vụ để tính duration
	var service models.Service
	if err := config.DB.First(&service, serviceID).Error; err != nil {
		log.Printf("Error fetching service for service_id %s: %v", serviceID, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Không tìm thấy dịch vụ"})
		return
	}
	log.Printf("Fetched service for ID %s: Duration %d minutes", serviceID, service.Duration)

	// Lấy duration của tất cả service trong appointments để tránh truy vấn nhiều lần
	serviceIDs := make([]uint, 0, len(appointments))
	for _, app := range appointments {
		serviceIDs = append(serviceIDs, app.ServiceID)
	}
	uniqueServiceIDs := uniqueUintSlice(serviceIDs)

	var services []models.Service
	if err := config.DB.Where("id IN ?", uniqueServiceIDs).Find(&services).Error; err != nil {
		log.Printf("Error fetching services: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lấy dịch vụ"})
		return
	}
	serviceDurations := make(map[uint]int)
	for _, s := range services {
		serviceDurations[s.ID] = s.Duration
		log.Printf("Service ID: %d, Duration: %d", s.ID, s.Duration)
	}

	// Định nghĩa thời gian làm việc
	startMorning := time.Date(selectedDate.Year(), selectedDate.Month(), selectedDate.Day(), 8, 0, 0, 0, loc)     // 08:00
	endMorning := time.Date(selectedDate.Year(), selectedDate.Month(), selectedDate.Day(), 12, 0, 0, 0, loc)      // 12:00
	startAfternoon := time.Date(selectedDate.Year(), selectedDate.Month(), selectedDate.Day(), 13, 30, 0, 0, loc) // 13:30
	endAfternoon := time.Date(selectedDate.Year(), selectedDate.Month(), selectedDate.Day(), 17, 30, 0, 0, loc)   // 17:30

	log.Printf("Working hours: Morning %v - %v, Afternoon %v - %v", startMorning, endMorning, startAfternoon, endAfternoon)

	// Tạo danh sách slot dựa trên duration của dịch vụ được chọn
	duration := service.Duration // Thời lượng dịch vụ (phút)
	availableSlots := make([]AvailableSlot, 0)

	// Tạo slot cho buổi sáng (08:00 - 12:00)
	currentTime := startMorning
	for currentTime.Before(endMorning) {
		slotEnd := currentTime.Add(time.Duration(duration) * time.Minute)
		if slotEnd.Before(endMorning) || slotEnd.Equal(endMorning) {
			availableSlots = append(availableSlots, AvailableSlot{
				Time:      currentTime.Format("15:04"),
				Available: true,
			})
		}
		currentTime = currentTime.Add(time.Duration(duration) * time.Minute)
	}

	// Tạo slot cho buổi chiều (13:30 - 17:30)
	currentTime = startAfternoon
	for currentTime.Before(endAfternoon) {
		slotEnd := currentTime.Add(time.Duration(duration) * time.Minute)
		if slotEnd.Before(endAfternoon) || slotEnd.Equal(endAfternoon) {
			availableSlots = append(availableSlots, AvailableSlot{
				Time:      currentTime.Format("15:04"),
				Available: true,
			})
		}
		currentTime = currentTime.Add(time.Duration(duration) * time.Minute)
	}

	log.Printf("Generated %d initial slots based on service duration %d minutes", len(availableSlots), duration)

	// Debug: In ra tất cả slot được tạo
	log.Printf("---- Debug slot and appointment timing ----")
	for _, slot := range availableSlots {
		slotTime, _ := time.ParseInLocation("15:04", slot.Time, loc)
		slotDateTime := time.Date(selectedDate.Year(), selectedDate.Month(), selectedDate.Day(),
			slotTime.Hour(), slotTime.Minute(), 0, 0, loc)
		log.Printf("Slot: %s, slotDateTime: %v", slot.Time, slotDateTime)
	}
	for _, app := range appointments {
		log.Printf("Appointment %d: Start %v, ServiceID %d", app.ID, app.AppointmentTime, app.ServiceID)
	}
	log.Printf("---- End debug slots and appointments ----")

	// Tính toán các khoảng thời gian bị chiếm từ lịch hẹn hiện có
	occupied := make(map[string]bool)
	for _, app := range appointments {
		durationApp, ok := serviceDurations[app.ServiceID]
		if !ok {
			log.Printf("Service ID %d not found in map for appointment %d", app.ServiceID, app.ID)
			continue
		}
		startApp := app.AppointmentTime
		endApp := startApp.Add(time.Duration(durationApp) * time.Minute)

		log.Printf("Checking appointment %d: start %v, end %v", app.ID, startApp, endApp)

		for _, slot := range availableSlots {
			slotTime, _ := time.ParseInLocation("15:04", slot.Time, loc)
			slotStart := time.Date(selectedDate.Year(), selectedDate.Month(), selectedDate.Day(),
				slotTime.Hour(), slotTime.Minute(), 0, 0, loc)
			slotEnd := slotStart.Add(time.Duration(duration) * time.Minute) // duration của service được chọn

			// Kiểm tra overlap:
			// Nếu slotStart < endApp và startApp < slotEnd thì trùng lịch
			if slotStart.Before(endApp) && startApp.Before(slotEnd) {
				occupied[slot.Time] = true
				log.Printf("Mark occupied: Slot %s overlaps with appointment %d [%v - %v]", slot.Time, app.ID, startApp, endApp)
			}
		}
	}

	// Cập nhật trạng thái available của các slot
	for i := range availableSlots {
		if occupied[availableSlots[i].Time] {
			availableSlots[i].Available = false
		}
	}

	// Debug: đếm slot khả dụng
	countAvailable := 0
	for _, slot := range availableSlots {
		if slot.Available {
			countAvailable++
		}
	}
	log.Printf("Total slots: %d, Available slots: %d", len(availableSlots), countAvailable)

	// Trả về danh sách slot
	c.JSON(http.StatusOK, availableSlots)
}

func GetAppointmentsByPatientID(c *gin.Context) {
	patientID := c.Param("patient_id")
	log.Printf("Fetching appointments for patient ID: %s", patientID)

	var appointments []models.Appointment
	if err := config.DB.
		Debug().
		Preload("Dentist").
		Preload("Dentist.Specialization").
		Preload("Service").
		Preload("Patient").
		Preload("AppointmentType").
		Preload("PatientInformation").
		Where("patient_id = ?", patientID).
		Order("appointment_time asc").
		Find(&appointments).Error; err != nil {
		log.Printf("Error fetching appointments for patient ID %s: %v", patientID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy lịch hẹn của bệnh nhân"})
		return
	}

	if len(appointments) == 0 {
		log.Printf("No appointments found for patient ID %s", patientID)
		c.JSON(http.StatusOK, gin.H{"data": []models.Appointment{}})
		return
	}

	log.Printf("Successfully fetched %d appointments for patient ID %s", len(appointments), patientID)
	c.JSON(http.StatusOK, gin.H{"data": appointments})
}
