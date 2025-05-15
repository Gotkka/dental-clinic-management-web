// Tạo danh sách ngày khả dụng
export const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);

        if (nextDate.getDay() !== 0) { // Bỏ qua Chủ nhật
            dates.push({
                date: nextDate.toISOString().split('T')[0],
                dayName: nextDate.toLocaleDateString('vi-VN', { weekday: 'short' }),
                dayNumber: nextDate.getDate(),
                month: nextDate.toLocaleDateString('vi-VN', { month: 'short' })
            });
        }
    }

    return dates;
};

// Tạo danh sách khung giờ
export const getTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
        const isPM = hour >= 12;
        const displayHour = hour > 12 ? hour - 12 : hour;

        slots.push(`${displayHour}:00 ${isPM ? 'Chiều' : 'Sáng'}`);
        slots.push(`${displayHour}:30 ${isPM ? 'Chiều' : 'Sáng'}`);
    }

    return slots;
};

// Chuyển đổi thời gian từ định dạng 12h sang 24h
export const convertTo24HourTime = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hour, minute] = time.split(":").map(Number);

    if (period === "Chiều" && hour !== 12) {
        hour += 12;
    } else if (period === "Sáng" && hour === 12) {
        hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+00:00`;
};

// Format tiền tệ VND
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

// Format ngày theo định dạng Việt Nam
export const formatDate = (dateString) => {
    if (!dateString) return '';

    return new Date(dateString).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};