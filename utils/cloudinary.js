// file: /utils/cloudinary.js (hoặc tương tự)

// 1. Import cloudinary
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier'); // Cần thư viện streamifier
const buffer = require('buffer'); // Cần thư viện buffer

// 2. Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 3. Định nghĩa hàm Multer (file object file đã được truyền vào)
const uploadFile = (file) => { // file: object file đã được truyền vào
  return new Promise((resolve, reject) => {
    // 4. Khởi tạo upload stream Cloudinary từ Buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, // Đặt resource_type là 'auto' để tự động nhận dạng loại tệp
      (error, result) => {
        if (error) {
          // Xử lý lỗi
          return reject(error);
        }
        // Trả về kết quả thành công
        return resolve(result); 
      }
    );

    // 5. Sử dụng streamifier để đẩy buffer vào stream
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

// 6. Export hàm
module.exports = { 
  upload: uploadFile, 
  cloudinary: cloudinary 
}; 
// Lưu ý: Dòng cuối trong ảnh là module.exports = { upload: uploadFile, cloudinary }; (viết gọn)