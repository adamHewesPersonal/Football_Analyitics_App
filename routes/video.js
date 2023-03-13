const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const videoController = require('../controllers/video');

router.post('/', upload.single('video'), videoController.createVideo);
router.get('/', videoController.getVideos);
router.get('/:id', videoController.getVideo);
router.delete('/:id', videoController.deleteVideo);
router.get('/:id/duration', videoController.getVideoDuration);

module.exports = router;