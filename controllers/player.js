const Player = require('../models/player');

exports.createPlayer = async (req, res) => {
  const { name, jerseyNumber } = req.body;

  try {
    const player = await Player.create({ name, jerseyNumber });
    res.status(201).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPlayers = async (req, res) => {
  try {
    const players = await Player.findAll();
    res.status(200).json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPlayer = async (req, res) => {
  const id = req.params.id;

  try {
    const player = await Player.findOne({
      where: { id },
    });

    if (player) {
      res.status(200).json(player);
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updatePlayer = async (req, res) => {
  const id = req.params.id;
  const { name, jerseyNumber } = req.body;

  try {
    const player = await Player.findOne({
      where: { id },
    });

    if (player) {
      await player.update({ name, jerseyNumber });
      res.status(200).json(player);
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deletePlayer = async (req, res) => {
  const id = req.params.id;

  try {
    const player = await Player.findOne({
      where: { id },
    });

    if (player) {
      await player.destroy();
      res.status(200).json({ message: 'Player deleted successfully' });
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};