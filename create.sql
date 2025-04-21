-- 1. Xóa các bảng (theo thứ tự con → cha để tránh lỗi FK)
DROP TABLE IF EXISTS appointment_services;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS dentists;
DROP TABLE IF EXISTS specializations; -- Thêm vào danh sách xóa
DROP TABLE IF EXISTS users;

-- 2. Tạo bảng users (chứa thông tin đăng nhập và phân quyền)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username     VARCHAR(50) UNIQUE NOT NULL,
    password TEXT         NOT NULL,
    role         VARCHAR(50),      -- e.g. 'admin', 'receptionist', 'dentist', 'patient'
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tạo bảng specializations (danh sách chuyên môn)
CREATE TABLE specializations (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- Tên chuyên môn (ví dụ: "Nha khoa tổng quát", "Chỉnh nha", "Implant")
    description TEXT, -- Mô tả chuyên môn (tùy chọn)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tạo bảng patients (liên kết 1–1 với users)
CREATE TABLE patients (
    id           SERIAL PRIMARY KEY,
    user_id      INT UNIQUE NOT NULL
                  REFERENCES users(id) ON DELETE CASCADE,
    full_name    VARCHAR(100),
    phone_number VARCHAR(15),
    email        VARCHAR(100),
    gender       VARCHAR(10),
    birth_date   DATE,
    address      TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tạo bảng dentists (liên kết 1–1 với users, và liên kết với specializations)
CREATE TABLE dentists (
    id             SERIAL PRIMARY KEY,
    user_id        INT UNIQUE NOT NULL
                    REFERENCES users(id) ON DELETE CASCADE,
    img_url        VARCHAR(100), 
    full_name      VARCHAR(100),
    specialization_id INT
                      REFERENCES specializations(id) ON DELETE SET NULL,
    phone_number   VARCHAR(15),
    email          VARCHAR(100),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tạo bảng services (danh mục dịch vụ)
CREATE TABLE services (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100),
    description TEXT,
    price       NUMERIC(10,2)
);

-- 7. Tạo bảng appointments (quản lý lịch hẹn)
CREATE TABLE appointments (
    id               SERIAL PRIMARY KEY,
    patient_id       INT NOT NULL
                       REFERENCES patients(id) ON DELETE CASCADE,
    dentist_id       INT
                       REFERENCES dentists(id) ON DELETE SET NULL,
    appointment_date TIMESTAMP NOT NULL,
    reason           TEXT,
    status           VARCHAR(50) DEFAULT 'scheduled',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tạo bảng appointment_services (chi tiết dịch vụ của mỗi lịch hẹn)
CREATE TABLE appointment_services (
    id             SERIAL PRIMARY KEY,
    appointment_id INT NOT NULL
                     REFERENCES appointments(id) ON DELETE CASCADE,
    service_id     INT NOT NULL
                     REFERENCES services(id) ON DELETE CASCADE,
    quantity       INT DEFAULT 1
);