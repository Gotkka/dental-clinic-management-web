package main

import (
	"dental-clinic-management/config"
	"dental-clinic-management/routes"
	"log"
)

func main() {
	// Kết nối cơ sở dữ liệu
	if err := config.ConnectDB(); err != nil {
		log.Fatal("Không thể kết nối đến cơ sở dữ liệu: ", err)
		return
	}

	// Thiết lập routes và chạy server
	r := routes.SetupRoutes()

	// Chạy server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Không thể chạy server: ", err)
	}

}
