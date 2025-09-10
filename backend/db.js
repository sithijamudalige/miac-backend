const { Sequelize } = require("sequelize");

// SQLite database stored in "database.sqlite" in your backend folder
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

module.exports = sequelize;
