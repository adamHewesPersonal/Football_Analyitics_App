



const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const { Op } = require('sequelize');
const cv = require('opencv4nodejs');
const mongoose = require('mongoose');
const Video = require('./models/Video');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

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
  res.send('Football Analytics app is working!');
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

// Routes
const userRouter = require('./routes/user');
const videoRouter = require('./routes/video');
const playerRouter = require('./routes/player');
const annotationRouter = require('./routes/annotation');
app.use('/users', userRouter);
app.use('/videos', videoRouter);
app.use('/players', playerRouter);
app.use('/annotations', annotationRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});