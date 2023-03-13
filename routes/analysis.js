const express = require('express');
const router = express.Router();
const detectAndTrackPlayers = require('../services/analysis');

router.post('/analyze', async (req, res) => {
  const { filename } = req.body;

  try {
    await detectAndTrackPlayers(filename);
    res.status(200).json({ message: 'Analysis completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;