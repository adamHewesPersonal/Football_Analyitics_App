const videoService = require('../services/videoService');

exports.getVideos = async (req, res, next) => {
  try {
    const videos = await videoService.getVideos();
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

exports.getVideoById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const video = await videoService.getVideoById(id);
    if (!video) {
      const error = new Error(`Video with id ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

exports.createVideo = async (req, res, next) => {
  try {
    const { name, url, thumbnailUrl } = req.body;
    const video = await videoService.createVideo({ name, url, thumbnailUrl });
    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

exports.updateVideo = async (req, res, next) => {
  const { id } = req.params;
  const { name, url, thumbnailUrl } = req.body;
  try {
    const video = await videoService.updateVideo(id, { name, url, thumbnailUrl });
    if (!video) {
      const error = new Error(`Video with id ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

exports.deleteVideo = async (req, res, next) => {
  const { id } = req.params;
  try {
    const video = await videoService.deleteVideo(id);
    if (!video) {
      const error = new Error(`Video with id ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
};