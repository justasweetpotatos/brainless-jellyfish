// const { Logger } = require("../utils/logger");
// const { SuwaClient } = require("../client/client");
// const { Sequelize } = require("sequelize");

// const { config } = require("../config/database.json");

// class Connector {
//   /**
//    *
//    * @param {SuwaClient} client
//    */
//   constructor(client) {
//     this.logger = new Logger("connector", client.logSystem);
//     this.sequelize = new Sequelize(config);
//   }
// }

// module.exports = { Connector };


// db.js
const { Sequelize } = require('sequelize');

// Kết nối đến cơ sở dữ liệu MySQL
const sequelize = new Sequelize('your_database', 'root', 'your_password', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
