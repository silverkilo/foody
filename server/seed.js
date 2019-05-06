

const faker = require('faker')
const db = require('../server/db')
const { Preference, User, Location, UserPreference, Match, UserLocation } = require('./db/models')
const categories = [
  'All',
  'African',
  'American',
  'Japanese',
  'Chinese',
  'Malaysian',
  'Vietnamese',
  'Australian',
  'Brazilian',
  'Burmese',
  'Cajun',
  'Dessert',
  'French',
  'Bakery',
  'German',
  'Greek',
  'Persian',
  'Peruvian',
  'Vegan',
  'Vegetarian'
]
const locations = [
  'Greenwich',
  'ChinaTown',
  'Flatiron'
]

async function seed() {
  await db.sync({ force: true })
  console.log('db synced!')

  await Preference.bulkCreate(categories.map(category => ({ category })))
  const users = await User.bulkCreate(
    [{
      firstName: 'Cody',
      lastName: 'The Pug',
      email: 'cody@thepug.com',
      password: '123'
    }].concat(Array(11).fill('x').map((_, i) => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: String(i + 2)
    }))),
    {
      returning: true
    }
  )
  await Location.bulkCreate(locations.map(name => ({ name })))
  await UserLocation.bulkCreate(users.map(({ id: userId }, i) => ({
    userId,
    locationId: 1
  })))
  await UserPreference.bulkCreate(
    Array(users.length * 3).fill('x').map((_, i) => ({
      userId: (i % users.length) + 1,
      preferenceId: (i % 20) + 1
    }))
  )
  await UserPreference.bulkCreate([
    {
      userId: 7,
      preferenceId: 13
    },
    {
      userId: 10,
      preferenceId: 1
    },
    {
      userId: 10,
      preferenceId: 13
    },

  ])
  await Match.bulkCreate([
    {
      matcherId: 7,
      matcheeId: 1,
    },
    {
      matcherId: 10,
      matcheeId: 1
    }
  ])
  console.log(`seeded successfully`)
}

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

if (module === require.main) {
  runSeed()
}

module.exports = seed
