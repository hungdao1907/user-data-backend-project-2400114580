// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ⚙️ import model User

// =======================================================
// 1️⃣ LẤY DANH SÁCH NGƯỜI DÙNG (READ All)
// GET | /api/v1/users/
// =======================================================
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // loại bỏ password
    res.status(200).json({
      message: "Lấy danh sách người dùng thành công (200 OK)",
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
// 2️⃣ TẠO NGƯỜI DÙNG MỚI (CREATE)
// POST | /api/v1/users/
// =======================================================
router.post('/', async (req, res) => {
  try {
    // req.body chứa username, email, password (thô)
    // Hook 'pre-save' trong User.js sẽ tự hash password
    const newUser = await User.create(req.body);

    res.status(201).json({
      message: "Tạo User thành công!",
      data: newUser,
    });
  } catch (err) {
    // Nếu dữ liệu không hợp lệ (trùng email, thiếu trường, minlength...)
    res.status(400).json({
      message: "Tạo User thất bại",
      error: err.message,
    });
  }
});

// =======================================================
// 3️⃣ LẤY CHI TIẾT NGƯỜI DÙNG (READ One)
// GET | /api/v1/users/:id
// =======================================================
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: `Không tìm thấy người dùng có ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      message: "Lấy chi tiết người dùng thành công (200 OK)",
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
// 4️⃣ CẬP NHẬT NGƯỜI DÙNG (UPDATE)
// PUT | /api/v1/users/:id
// =======================================================
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: `Không tìm thấy người dùng có ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      message: `Cập nhật người dùng ID ${req.params.id} thành công (200 OK)`,
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
// 5️⃣ XÓA NGƯỜI DÙNG (DELETE)
// DELETE | /api/v1/users/:id
// =======================================================
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: `Không tìm thấy người dùng có ID: ${req.params.id}`,
      });
    }

    res.status(204).send(); // 204 No Content
  } catch (err) {
    res.status(400).json({
      message: "Xóa người dùng thất bại",
      error: err.message,
    });
  }
});

// =======================================================
module.exports = router;
