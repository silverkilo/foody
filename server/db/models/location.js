const db = require('../db')
const Sequelize = require('sequelize')
const Location = db.define('location', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Location