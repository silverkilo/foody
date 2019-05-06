const Sequelize = require('sequelize')
const db = require('../db')

const UserLocation = db.define('user_location', {
    userId: Sequelize.INTEGER,
    locationId: Sequelize.INTEGER
})

module.exports = UserLocation