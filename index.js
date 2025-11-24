/*
* ========================================
* FILE: index.js (Main Server File)
* MÔ TẢ: Khởi tạo Server Express, kết nối MongoDB,
* và định tuyến các API request (Week 3 + Week 4)
* ========================================
*/

// --- 1. IMPORT CÁC MODULE CẦN THIẾT ---
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./db'); // File kết nối MongoDB

// --- 2. IMPORT CÁC ROUTER (TỪ TUẦN 3) ---
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // <-- THÊM DÒNG NÀY
// --- 3. CẤU HÌNH BIẾN MÔI TRƯỜNG (.env) ---
dotenv.config(); // Đọc file .env để lấy MONGO_URI và PORT

// --- 4. KHỞI TẠO ỨNG DỤNG EXPRESS ---
const app = express();

// --- 5. KẾT NỐI CƠ SỞ DỮ LIỆU MONGODB ---
connectDB();

// --- 6. CẤU HÌNH MIDDLEWARE ---
app.use(express.json()); // Cho phép đọc dữ liệu JSON từ body request

// --- 7. ĐỊNH TUYẾN API (ROUTES) ---
// Mọi request bắt đầu bằng /api/v1/users sẽ được xử lý bởi userRoutes
app.use('/api/v1/users', userRoutes);

// Route kiểm tra server và trạng thái DB
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Chào mừng đến với User Data Backend API (Week 3 + 4)",
    status: "Server is running",
    database_status:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Route kiểm tra tình trạng API cụ thể
app.get('/api/v1/status', (req, res) => {
  res.json({
    service: "User Data API",
    version: "1.0",
    health: "Good",
    timestamp: new Date().toISOString(),
    database_status:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// --- ĐỊNH TUYẾN (API ROUTES) ---
app.use('/api/v1/auth', authRoutes); 

// --- 8. KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  console.log("⏳ Đang chờ kết nối MongoDB...");
});