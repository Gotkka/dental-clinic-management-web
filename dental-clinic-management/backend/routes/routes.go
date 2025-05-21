package routes

import (
	"dental-clinic-management/controllers"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Chỉ cho phép origin của frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"}, // Thêm Authorization
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,           // Cho phép gửi cookie hoặc token
		MaxAge:           12 * time.Hour, // Thời gian cache preflight request
	}
	r.Use(cors.New(config))

	// Nhóm các route liên quan đến dental-clinic
	dentalClinic := r.Group("/dental-clinic")
	{
		// Auth
		dentalClinic.POST("/login", controllers.LoginUser)
		dentalClinic.POST("/register", controllers.RegisterUser)

		// Bệnh nhân
		dentalClinic.GET("/patients", controllers.GetAllPatients)
		dentalClinic.GET("/patient-informations/all", controllers.GetAllPatientInformations)
		dentalClinic.POST("/patient-informations/create-or-update", controllers.HandleCreateOrUpdatePatientInformation)

		// Bác sĩ & chuyên khoa
		dentalClinic.GET("/dentists/all", controllers.GetAllDentists)
		dentalClinic.POST("/dentists", controllers.CreateDentist)
		dentalClinic.PUT("/dentists/:id", controllers.UpdateDentist)
		dentalClinic.DELETE("/dentists/:id", controllers.DeleteDentist)

		dentalClinic.GET("/specializations/all", controllers.GetAllSpecializations)
		dentalClinic.POST("/specializations", controllers.CreateSpecialization)
		dentalClinic.PUT("/specializations/:id", controllers.UpdateSpecialization)
		dentalClinic.DELETE("/specializations/:id", controllers.DeleteSpecialization)

		// Dịch vụ
		dentalClinic.GET("/services/all", controllers.GetAllServices)
		dentalClinic.POST("/services", controllers.CreateService)
		dentalClinic.PUT("/services/:id", controllers.UpdateService)
		dentalClinic.DELETE("/services/:id", controllers.DeleteService)

		// Loại lịch hẹn
		dentalClinic.GET("/appointment-types", controllers.GetAllAppointmentTypes)

		// Lịch hẹn
		dentalClinic.GET("/appointments", controllers.GetAllAppointments)
		dentalClinic.GET("/appointments/upcoming", controllers.GetUpcomingAppointments)
		dentalClinic.GET("/appointments/completed", controllers.GetCompletedAppointments)
		dentalClinic.GET("/appointments/cancelled", controllers.GetCancelledAppointments)
		dentalClinic.GET("/appointments/existing", controllers.GetExistingAppointments)
		dentalClinic.GET("/appointments/filter", controllers.GetAppointmentsByDate)
		dentalClinic.GET("/appointments/available-slots", controllers.GetAvailableSlots)

		dentalClinic.GET("/appointments/:id", controllers.GetAppointmentByID)
		dentalClinic.POST("/appointments/create-appointment", controllers.CreateAppointment)
		dentalClinic.PUT("/appointments/:id", controllers.UpdateAppointment)
		dentalClinic.GET("/appointments/patient/:patient_id", controllers.GetAppointmentsByPatientID)

		// Chi nhánh
		dentalClinic.GET("/branchs/all", controllers.GetAllBranches)
		dentalClinic.POST("/branchs", controllers.CreateBranch)
		dentalClinic.PUT("/branchs/:id", controllers.UpdateBranch)
		dentalClinic.DELETE("/branchs/:id", controllers.DeleteBranch)

		dentalClinic.POST("/upload", controllers.UploadImage)
	}

	return r
}
