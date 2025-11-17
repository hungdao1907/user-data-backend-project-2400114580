/*
 * =========================================
 * FILE: ROUTES/AUTHROUTES.JS (MỚI)
 * MÔ TẢ: Xử lý Đăng ký (Register) và Đăng nhập (Login)
 * =========================================
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');          // Import User model
const bcrypt = require('bcryptjs');              // Import bcrypt
const jwt = require('jsonwebtoken');             // Import jsonwebtoken

// ==== HÀM TẠO TOKEN ====
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token hết hạn sau 30 ngày
    });
};

// ==== 1. ENDPOINT: TẠO USER MỚI (REGISTER) ====
// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, profile, role } = req.body;

        // 1. Kiểm tra user tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // 2. Tạo user mới
        // Hook "pre-save" trong User.js sẽ tự hash password
        const newUser = await User.create({
            username,
            email,
            password,
            profile,
            role,
        });

        // 3. Trả về user (trừ password) + token
        return res.status(201).json({
            message: 'Tạo User thành công!',
            data: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            token: generateToken(newUser._id),
        });

    } catch (err) {
        return res.status(400).json({
            message: 'Tạo User thất bại',
            error: err.message,
        });
    }
});


// ==== 2. ENDPOINT: ĐĂNG NHẬP (LOGIN) ====
// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Lấy user theo email
        // Vì password có select: false → phải +password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // 2. So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // 3. Trả về user + token
        return res.status(200).json({
            message: 'Đăng nhập thành công',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token: generateToken(user._id),
        });

    } catch (err) {
        return res.status(500).json({
            message: 'Lỗi Server',
            error: err.message,
        });
    }
});

module.exports = router;