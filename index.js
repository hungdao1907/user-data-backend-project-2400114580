// index.js

// 1. Import thư viện Express
const express = require('express');

// 2. Khởi tạo ứng dụng Express
const app = express();
const PORT = 3000; // Cổng Server thường dùng

// Week 3: Tạo các route riêng biệt trong file routes/userRoutes.js
// 1. IMPORT Router
const userRoutes = require('./routes/userRoutes');

// 2. MIDDLEWARE: BẮT BUỘC phải có để đọc Body JSON từ Request (POST, PUT, PATCH)
app.use(express.json());

// 3. ĐỊNH TUYẾN GỐC: Tất cả các route trong userRoutes sẽ bắt đầu bằng /api/v1/users
app.use('/api/v1/users', userRoutes);

// 3. Xây dựng Route/Endpoint đầu tiên (API chào mừng)
// Phương thức GET, đường dẫn '/'
app.get('/', (req, res) => {
    // Trả về phản hồi JSON
    res.json({ message: "Chào mừng đến với API Dữ liệu Người dùng!" });
});

// API để kiểm tra trạng thái hoạt động của Server
app.get('/api/v1/status', (req, res) => {
    // Trả về một phản hồi JSON chứa thông tin trạng thái
    res.json({
        service: "User Data API",
        version: "1.0",
        health: "Good",
        timestamp: new Date().toISOString() // Thêm thời gian hiện tại
    });
});

// 4. Lắng nghe các yêu cầu tại cổng đã định nghĩa
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});