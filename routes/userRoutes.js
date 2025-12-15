// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ➕ Import middleware auth
const { protect, authorize } = require('../middleware/authMiddleware');

// 📦 Import thư viện xử lý file và Cloudinary helper
const multer = require('multer');
const { upload } = require('../utils/cloudinary'); // Đảm bảo đường dẫn này đúng

// Cấu hình Multer: Lưu trữ file trong bộ nhớ (memory)
const storage = multer.memoryStorage();
const uploadAvatar = multer({ storage: storage });

// =======================================================
// 1️⃣ LẤY DANH SÁCH NGƯỜI DÙNG (Chỉ Admin)
// GET | /api/v1/users/
// =======================================================
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      message: "Lấy danh sách người dùng thành công (Admin only)",
      data: users,
    });
  } catch (error) {
    next(error); 
  }
});

// =======================================================
// 2️⃣ LẤY PROFILE CỦA USER ĐANG ĐĂNG NHẬP
// GET | /api/v1/users/me
// =======================================================
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
        res.status(404);
        throw new Error("Không tìm thấy người dùng (Profile)");
    }

    res.status(200).json({
      message: "Lấy thông tin cá nhân thành công",
      data: user,
    });
  } catch (error) {
    next(error); 
  }
});

// =======================================================
// 3️⃣ LẤY CHI TIẾT NGƯỜI DÙNG THEO ID (Chỉ Admin)
// GET | /api/v1/users/:id
// =======================================================
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error(`Không tìm thấy người dùng có ID: ${req.params.id}`); 
    }

    res.status(200).json({
      message: "Lấy chi tiết người dùng thành công",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// =======================================================
// 4️⃣ CẬP NHẬT NGƯỜI DÙNG (Chỉ Admin)
// PUT | /api/v1/users/:id
// =======================================================
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404);
      throw new Error(`Không tìm thấy người dùng có ID: ${req.params.id}`); 
    }

    res.status(200).json({
      message: `Cập nhật người dùng ID ${req.params.id} thành công`,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

// =======================================================
// 5️⃣ XÓA NGƯỜI DÙNG (Chỉ Admin)
// DELETE | /api/v1/users/:id
// =======================================================
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      res.status(404);
      throw new Error(`Không tìm thấy người dùng có ID: ${req.params.id}`);
    }

    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
});

// =======================================================
// 6️⃣ TẢI LÊN AVATAR (Dành cho User đang đăng nhập)
// POST | /api/v1/users/upload-avatar
// =======================================================
router.post('/upload-avatar', protect, uploadAvatar.single('avatar'), async (req, res, next) => {
  try {
    // 1. Kiểm tra file
    if (!req.file) {
      res.status(400);
      throw new Error('Chưa chọn file để tải lên.');
    }

    // 2. Tải lên Cloudinary
    const result = await upload(req.file);

    // 3. Lưu URL ảnh vào Database
    const user = await User.findById(req.user.id);
    
    if (!user) {
        res.status(404);
        throw new Error('Không tìm thấy người dùng.');
    }

    user.avatarUrl = result.secure_url;
    await user.save({ validateBeforeSave: false });

    // 4. Phản hồi thành công
    res.status(200).json({
      message: 'Upload thành công',
      avatarUrl: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
});

// =======================================================
module.exports = router;