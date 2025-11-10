const mongoose = require('mongoose');
// BƯỚC 1: Import bcryptjs
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // (Giữ nguyên username, email, profile, role, orders, wishlist, cart...)
  username: {
    type: String,
    required: [true, 'Username is required'], // Bắt buộc, kèm thông báo lỗi
    unique: true,
    trim: true, // Tự động xóa khoảng trắng
    minlength: [3, 'Username must be at least 3 characters long']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true, // Tự động chuyển thành chữ thường
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },

  // BƯỚC 2: Đổi 'passwordHash' thành 'password' và thêm Validators
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    // 'select: false' ẩn trường này khỏi các truy vấn find()
    select: false
  },

  profile: {
    fullName: {
      type: String,
      default: '',
      trim: true
    },
    phone: {
      type: String,
      default: '',
      trim: true
    }
  },

  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: '{VALUE} is not a supported role'
    },
    default: 'user'
  },

  // Tham chiếu 1-1: Liên kết với Cart
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },

  // Tham chiếu N-N: Mảng các Order IDs
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],

  // Tham chiếu 1-1: Liên kết với Wishlist
  wishlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WishList'
  }
}, { timestamps: true });

// BƯỚC 3: Thêm Mongoose Hook 'pre-save'
// Hook này sẽ tự động chạy TRƯỚC KHI một tài liệu 'User' mới được lưu
userSchema.pre('save', async function (next) {
  // Nếu không có dòng này, mỗi lần update email, mật khẩu sẽ bị hash lại
  if (!this.isModified('password')) return next();

  try {
    // Tạo Salt (độ phức tạp cấp 10)
    const salt = await bcrypt.genSalt(10);
    // Băm (hash) mật khẩu người dùng với Salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);