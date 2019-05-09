const Sequelize = require('sequelize')

const db = new Sequelize(`postgres://localhost:5432/${process.env.NODE_ENV === 'test' ? 'foody_test' : 'foody'}`, {
  logging: true
})

module.exports = db
