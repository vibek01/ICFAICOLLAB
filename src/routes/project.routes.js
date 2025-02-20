// project.routes.js
const express = require('express');
const multer = require('multer');
const { protect } = require('../middlewares/auth.middleware');
const { uploadProject, getProjects, getMyProjects } = require('../controllers/project.controller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, Date.now() + '.png');
    } else {
      const ext = file.originalname.split('.').pop();
      cb(null, Date.now() + '.' + ext);
    }
  }
});

const upload = multer({ storage });
const router = express.Router();

router.get('/', getProjects);
router.get('/my-projects', protect, getMyProjects);
router.post('/', protect, upload.single('file'), uploadProject);

module.exports = router;