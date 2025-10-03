// index.js

// 1. Import thư viện Express
const express = require('express');

// 2. Khởi tạo ứng dụng Express
const app = express();
const PORT = 3000; // Đặt port cho server

// 3. Xây dựng Route gốc
app.get('/', (req, res) => {
  res.send('Xin chào! Đây là API Dữ liệu Người dùng');
});

// 4. API GET /api/v1/status
app.get('/api/v1/status', (req, res) => {
  res.json({
    service: "User Data API",
    version: "1.0",
    health: "Good",
    timestamp: new Date().toISOString()
  });
});

// 5. Lắng nghe cổng
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});