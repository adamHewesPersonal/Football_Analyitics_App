const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const { Op } = require('sequelize');
const cv = require('opencv4nodejs');
const sequelize = require('./database');
const Video = require('./models/Video');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/videos', upload.single('video'), async (req, res) => {
  const { title } = req.body;
  const { filename } = req.file;

  try {
    const video = await Video.create({
      title,
      filename,
    });

    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/videos', async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/videos/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const video = await Video.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });

    if (video) {
      const cap = new cv.VideoCapture(`uploads/${video.filename}`);
      const frameRate = cap.get(cv.CAP_PROP_FPS);
      const frameCount = cap.get(cv.CAP_PROP_FRAME_COUNT);
      const duration = frameCount / frameRate;

      res.status(200).json({
        id: video.id,
        title: video.title,
        filename: video.filename,
        duration: duration.toFixed(2),
      });
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/videos/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const video = await Video.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });

    if (video) {
      fs.unlinkSync(`uploads/${video.filename}`);
      await video.destroy();
      res.status(200).json({ message: 'Video deleted successfully' });
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log('Server started on port 5000');
  });
});