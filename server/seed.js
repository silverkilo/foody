

const db = require('../server/db')
const { Preference, User } = require('./db/models')
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

async function seed() {
  await db.sync({ force: true })
  console.log('db synced!')

  for (let i = 0; i < categories.length; i++) {
    await Preference.create({
      category: categories[i]
    })
  }
  await User.create({
    firstName: 'Cody',
    lastName: 'The Pug',
    email: 'cody@thepug.com',
    password: '123'
  })
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
