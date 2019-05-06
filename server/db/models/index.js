const User = require('./user')
const Preference = require('./preference')
const Match = require('./match')
const UserPreference = require('./userPreference')
// const Review = require('./review')

// User.hasMany(Review)
// Review.belongsTo(User)

User.belongsToMany(Preference, { through: UserPreference })
Preference.belongsToMany(User, { through: UserPreference })

User.belongsToMany(User, { through: Match, as: 'Matcher', foreignKey: 'matcherId' })
User.belongsToMany(User, { through: Match, as: 'Matchee', foreignKey: 'matcheeId' })
module.exports = {
  User,
  Preference, Match, UserPreference
}
