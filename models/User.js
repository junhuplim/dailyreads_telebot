const Sequelize = require('sequelize');
const db = require('../db/database');

const User = db.define("users", {
    chatId: {
      type: Sequelize.INTEGER,
    },
  });
  
module.exports = User;