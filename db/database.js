const Sequelize = require("sequelize");

const db = new Sequelize('dailyreads', 'junhuplim', 'junhup', {
  host:'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err);
  });

module.exports = db;


