const express = require('express');
const router = express.Router();
const Annotation = require('../models/Annotation');

// GET all annotations
router.get('/', async (req, res) => {
  try {
    const annotations = await Annotation.find();
    res.json(annotations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific annotation
router.get('/:id', getAnnotation, (req, res) => {
  res.json(res.annotation);
});

// CREATE an annotation
router.post('/', async (req, res) => {
  const annotation = new Annotation({
    video_id: req.body.video_id,
    player_id: req.body.player_id,
    time: req.body.time,
    label: req.body.label,
    description: req.body.description,
  });

  try {
    const newAnnotation = await annotation.save();
    res.status(201).json(newAnnotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE an annotation
router.patch('/:id', getAnnotation, async (req, res) => {
  if (req.body.video_id != null) {
    res.annotation.video_id = req.body.video_id;
  }
  if (req.body.player_id != null) {
    res.annotation.player_id = req.body.player_id;
  }
  if (req.body.time != null) {
    res.annotation.time = req.body.time;
  }
  if (req.body.label != null) {
    res.annotation.label = req.body.label;
  }
  if (req.body.description != null) {
    res.annotation.description = req.body.description;
  }
  try {
    const updatedAnnotation = await res.annotation.save();
    res.json(updatedAnnotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an annotation
router.delete('/:id', getAnnotation, async (req, res) => {
  try {
    await res.annotation.remove();
    res.json({ message: 'Annotation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a specific annotation by ID
async function getAnnotation(req, res, next) {
  try {
    const annotation = await Annotation.findById(req.params.id);
    if (annotation == null) {
      return res.status(404).json({ message: 'Annotation not found' });
    }
    res.annotation = annotation;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;