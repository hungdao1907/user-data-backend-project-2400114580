/**
 * FILE: routes/orderRoutes.js
 * Chức năng: Xử lý Đặt hàng, Xem đơn hàng của User, Admin xem tất cả đơn hàng
 */

const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const { protect, authorize } = require("../middleware/authMiddleware");

// ==============================
// 1. TẠO ĐƠN HÀNG (User phải đăng nhập)
// ==============================
router.post("/", protect, async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;

        // Kiểm tra đầu vào
        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Danh sách sản phẩm không được để trống" });
        }

        const newOrder = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress,
        });

        res.status(201).json({
            message: "Đặt hàng thành công",
            data: newOrder,
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==============================
// 2. LẤY ĐƠN HÀNG CỦA TÔI (User đang đăng nhập)
// ==============================
router.get("/my-orders", protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("user", "username email")
            .populate("items.product")
            .sort("-createdAt");

        res.status(200).json({
            count: orders.length,
            data: orders,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==============================
// 3. LẤY TẤT CẢ ĐƠN HÀNG (Admin only)
// ==============================
router.get("/", protect, authorize("admin"), async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "username email")
            .sort("-createdAt");

        res.status(200).json({
            count: orders.length,
            data: orders,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;