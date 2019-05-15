const Sequelize = require("sequelize");
const db = require("../db");

const Preference = db.define("preference", {
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fsId: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Preference;
