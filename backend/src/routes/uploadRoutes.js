const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

// Use memory storage — buffer the file and send directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// POST /api/upload
// Protected: only logged-in admins can upload
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64 data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'lumiere-garments',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

module.exports = router;
