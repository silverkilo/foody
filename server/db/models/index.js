const User = require('./user')
const Preference = require('./preference')
const Match = require('./match')
const UserPreference = require('./userPreference')
const Location = require('./location')
const UserLocation = require('./userLocation')
// const Review = require('./review')

// User.hasMany(Review)
// Review.belongsTo(User)

User.belongsToMany(Preference, { through: UserPreference })
Preference.belongsToMany(User, { through: UserPreference })

User.belongsToMany(Location, { through: UserLocation })
Location.belongsToMany(User, { through: UserLocation })

User.belongsToMany(User, { through: Match, as: 'Matchee', foreignKey: 'matcherId' })
User.belongsToMany(User, { through: Match, as: 'Matcher', foreignKey: 'matcheeId' })
module.exports = {
  User,
  Preference,
  Match,
  UserPreference,
  UserLocation,
  Location
}
