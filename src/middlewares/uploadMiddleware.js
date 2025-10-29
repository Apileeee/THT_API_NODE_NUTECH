const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `profile_${Date.now()}${ext}`;
    cb(null, name);
  }
});

function fileFilter (req, file, cb) {
  const allowed = ['.jpeg', '.jpg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('FORMAT_NOT_ALLOWED'));
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter });
module.exports = upload;
