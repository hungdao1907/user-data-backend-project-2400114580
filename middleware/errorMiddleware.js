// file: /middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    // 1. Nếu lỗi chưa có statusCode, mặc định là 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
    
    // Gán statusCode cho response
    res.status(statusCode);

    // 2. Trả về JSON lỗi
    res.json({
        success: false,
        message: err.message,
        // Chỉ hiện stack trace (dạng lỗi) khi ở môi trường dev
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// Xuất middleware
module.exports = errorHandler;