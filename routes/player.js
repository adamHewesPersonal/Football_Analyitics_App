const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player');

router.post('/', playerController.createPlayer);
router.get('/', playerController.getPlayers);
router.get('/:id', playerController.getPlayer);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);

module.exports = router;