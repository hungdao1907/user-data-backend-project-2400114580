// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ➕ Import middleware auth
const { protect, authorize } = require('../middleware/authMiddleware');

// =======================================================
// 1️⃣ LẤY DANH SÁCH NGƯỜI DÙNG (Chỉ Admin)
// GET | /api/v1/users/
// =======================================================
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      message: "Lấy danh sách người dùng thành công (Admin only)",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách người dùng",
      error: err.message,
    });
  }
});

// =======================================================
// 2️⃣ LẤY PROFILE CỦA USER ĐANG ĐĂNG NHẬP
// GET | /api/v1/users/me
// =======================================================
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      message: "Lấy thông tin cá nhân thành công",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi lấy profile",
      error: err.message,
    });
  }
});

// =======================================================
// 3️⃣ LẤY CHI TIẾT NGƯỜI DÙNG THEO ID (Chỉ Admin)
// GET | /api/v1/users/:id
// =======================================================
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: `Không tìm thấy người dùng có ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      message: "Lấy chi tiết người dùng thành công",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      message: "Lỗi khi lấy chi tiết người dùng",
      error: err.message,
    });
  }
});

// =======================================================
// 4️⃣ CẬP NHẬT NGƯỜI DÙNG (Chỉ Admin)
// PUT | /api/v1/users/:id
// =======================================================
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        message: `Không tìm thấy người dùng có ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      message: `Cập nhật người dùng ID ${req.params.id} thành công`,
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      message: "Cập nhật thất bại",
      error: err.message,
    });
  }
});

// =======================================================
// 5️⃣ XÓA NGƯỜI DÙNG (Chỉ Admin)
// DELETE | /api/v1/users/:id
// =======================================================
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: `Không tìm thấy người dùng có ID: ${req.params.id}`,
      });
    }

    res.status(204).send(); // No content
  } catch (err) {
    res.status(400).json({
      message: "Xóa người dùng thất bại",
      error: err.message,
    });
  }
});

// =======================================================
module.exports = router;
