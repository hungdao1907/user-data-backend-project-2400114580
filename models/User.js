const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },

  profile: {
    fullName: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true }
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  wishlist: { type: mongoose.Schema.Types.ObjectId, ref: 'WishList' },

  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]

}, { timestamps: true });


// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// Method so sánh mật khẩu khi login
userSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);