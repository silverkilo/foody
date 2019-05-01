const Sequelize = require('sequelize')
const db = require('../db')

const Preference = db.define('preference', {
  category: {
    type: Sequelize.STRING
  }
})

module.exports = Preference
