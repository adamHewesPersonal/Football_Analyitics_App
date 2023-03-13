const Sequelize = require('sequelize');
const sequelize = require('../database');

const Video = sequelize.define('video', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Video;