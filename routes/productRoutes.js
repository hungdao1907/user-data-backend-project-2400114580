// file: /routes/productRoutes.js
// 1. Import các thư viện cần thiết
const router = require('express').Router();
const product = require('../models/Product'); // Giả sử model Product nằm ở đây
const { protect, authorize, admin } = require('../middlewares/auth'); // Giả sử middleware auth nằm ở đây

// 2. Định tuyến cho thao tác đọc (Read)
// GET /api/v1/products
router.get('/', async (req, res) => {
    try {
        // Lấy tất cả sản phẩm từ database
        const products = await Product.find({}); 
        
        // Trả về JSON chứa số lượng và danh sách sản phẩm
        res.status(200).json({ count: products.length, data: products });
    } catch (error) {
        // Xử lý lỗi
        res.status(500).json({ err: error.message });
    }
});

// 3. Định tuyến cho thao tác tạo (Create)
// POST /api/v1/products
// Thêm middleware protect, authorize('admin') để bảo vệ route, chỉ admin mới được tạo
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        // Tạo sản phẩm mới từ dữ liệu gửi lên (req.body)
        const newProduct = await Product.create(req.body); 
        
        // Trả về thông báo thành công và dữ liệu sản phẩm mới
        res.status(201).json({ msg: "Tạo sản phẩm thành công", data: newProduct });
    } catch (error) {
        // Xử lý lỗi
        res.status(500).json({ err: error.message });
    }
});

// 4. Định tuyến cho thao tác xóa (Delete)
// DELETE /api/v1/products/:id
// Thêm middleware protect, authorize('admin') để bảo vệ route, chỉ admin mới được xóa
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        // Xóa sản phẩm dựa trên ID trong params (req.params.id)
        await Product.findByIdAndDelete(req.params.id); 
        
        // Trả về thông báo thành công
        res.status(200).json({ msg: "Xóa sản phẩm thành công" });
    } catch (error) {
        // Xử lý lỗi
        res.status(500).json({ err: error.message });
    }
});

// Xuất router để sử dụng ở file khác
module.exports = router;