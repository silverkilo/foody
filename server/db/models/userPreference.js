const Sequelize = require("sequelize");
const db = require("../db");

const UserPreference = db.define("user_preference", {
  userId: Sequelize.INTEGER,
  preferenceId: Sequelize.INTEGER
});

module.exports = UserPreference;
