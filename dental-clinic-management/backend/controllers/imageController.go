package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func UploadImage(c *gin.Context) {
	// Lấy file từ form
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Không thể tải ảnh lên"})
		return
	}

	// Định nghĩa đường dẫn lưu trữ
	uploadDir := "../frontend/public/assets/dentists" // Đường dẫn tương đối từ thư mục backend đến frontend/public/dentists/
	fileName := file.Filename
	filePath := filepath.Join(uploadDir, fileName)

	// Tạo thư mục nếu chưa tồn tại
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo thư mục lưu trữ"})
		return
	}

	// Kiểm tra xem file đã tồn tại chưa, nếu có thì thêm số thứ tự (ví dụ: image-1.jpg)
	baseName := filepath.Base(fileName)
	ext := filepath.Ext(baseName)
	name := baseName[:len(baseName)-len(ext)]
	counter := 1
	for {
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			break
		}
		fileName = fmt.Sprintf("%s-%d%s", name, counter, ext)
		filePath = filepath.Join(uploadDir, fileName)
		counter++
	}

	// Lưu file vào thư mục
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lưu ảnh"})
		return
	}

	// Trả về chỉ tên file (không bao gồm đường dẫn)
	c.JSON(http.StatusOK, gin.H{"image_url": fileName})
}
