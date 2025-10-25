// Orders.js
const mongoose = require('mongoose');

// Schema cho Items (Nhúng Item, Tham chiếu User)
const itemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    // Có thể thêm các thuộc tính khác như tên sản phẩm, mô tả, v.v.
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [itemSchema], // Mảng chứa nhiều sản phẩm trong đơn hàng
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' },
    timestamps: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);