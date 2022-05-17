const config = require("../config.json");
const mysql2 = require("mysql2/promise");
const { Sequelize } = require("sequelize");
// const mysql =require('mysql');
module.exports = db = {};

initialize();

async function initialize() {
  // create db if it doesn't already exist
  const { host, user, password, database } = config.database;
  const connection2 = await mysql2.createConnection({
    host,
    user,
    password,
  });
  await connection2.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // db for jwt authorized apis

  // connect to db
  const sequelize = new Sequelize(database, user, password, {
    logging: false,
    dialect: "mysql",
  });

  // init models and add them to the exported db object
  // db.User = require('../users/user.model')(sequelize);
  db.User = require("../users/user.model")(sequelize);

  // sync all models with database
  await sequelize.sync();
}
