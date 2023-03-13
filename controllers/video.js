const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const Video = require('../models/video');

exports.createVideo = async (req, res) => {
  const { title, filename } = req.body;

  try {
    const video = await Video.create({ title, filename });
    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getVideo = async (req, res) => {
  const id = req.params.id;

  try {
    const video = await Video.findOne({
      where: { id },
    });

    if (video) {
      res.status(200).json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteVideo = async (req, res) => {
  const id = req.params.id;

  try {
    const video = await Video.findOne({
      where: { id },
    });

    if (video) {
      const filePath = path.join(__dirname, '..', 'uploads', video.filename);
      fs.unlinkSync(filePath);
      await video.destroy();
      res.status(200).json({ message: 'Video deleted successfully' });
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getVideoDuration = async (req, res) => {
  const id = req.params.id;

  try {
    const video = await Video.findOne({
      where: { id },
    });

    if (video) {
      const filePath = path.join(__dirname, '..', 'uploads', video.filename);
      const { duration } = await getVideoInfo(filePath);
      res.status(200).json({ duration });
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function getVideoInfo(filePath) {
  const { promisify } = require('util');
  const ffmpeg = require('fluent-ffmpeg');
  const ffprobe = promisify(ffmpeg.ffprobe);

  const { streams: [videoStream] } = await ffprobe(filePath);
  const { duration } = videoStream;

  return { duration };
}

module.exports = {
  createVideo,
  getVideos,
  getVideo,
  deleteVideo,
  getVideoDuration,
};