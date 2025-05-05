package routes

import (
	"dental-clinic-management/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// Thiết lập CORS để cho phép mọi origin
	r.Use(cors.Default())

	// Tạo group cho các routes liên quan đến dental-clinic
	dentalClinic := r.Group("/dental-clinic")
	{
		// Route cho đăng nhập
		dentalClinic.POST("/login", controllers.LoginUser)       // Đảm bảo dùng POST cho login
		dentalClinic.POST("/register", controllers.RegisterUser) // Đảm bảo dùng POST cho register

		dentalClinic.GET("/patients", controllers.GetAllPatients) // Lấy danh sách bệnh nhân

		dentalClinic.GET("/dentists", controllers.GetAllDentists)               // Lấy danh sách bác sĩ
		dentalClinic.GET("/specializations", controllers.GetAllSpecializations) // Lấy bác sĩ theo ID

		dentalClinic.GET("/services", controllers.GetAllServices) // Lấy danh sách dịch vụ nha khoa

		dentalClinic.GET("/appointment-types", controllers.GetAllAppointmentTypes) // Lấy danh sách loại lịch hẹn

		dentalClinic.POST("/create-patient-information", controllers.CreateNewPatientInformation) // Tạo thông tin bệnh nhân

		dentalClinic.GET("/appointments", controllers.GetAllAppointments) // Lấy danh sách lịch hẹn nha khoa

		dentalClinic.GET("/appointments/upcoming", controllers.GetUpcomingAppointments)
		dentalClinic.GET("/appointments/completed", controllers.GetCompletedAppointments)

		dentalClinic.GET("/appointments/cancelled", controllers.GetCancelledAppointments)

		dentalClinic.GET("/appointments/:id", controllers.GetAppointmentByID)   // Lấy lịch hẹn theo ID
		dentalClinic.POST("/create-appointment", controllers.CreateAppointment) // Tạo lịch hẹn nha khoa
	}

	return r
}
