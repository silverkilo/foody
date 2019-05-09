const faker = require("faker");
const db = require("../server/db");
const gis = require("./gis");
const { Preference, User, UserPreference, Match } = require("./db/models");
const categories = [
  "All",
  "African",
  "American",
  "Japanese",
  "Chinese",
  "Malaysian",
  "Vietnamese",
  "Australian",
  "Brazilian",
  "Burmese",
  "Cajun",
  "Dessert",
  "French",
  "Bakery",
  "German",
  "Greek",
  "Persian",
  "Peruvian",
  "Vegan",
  "Vegetarian"
];
async function seed() {
  await db.sync({ force: true });
  await gis(db);
  console.log("db synced!");

  await Preference.bulkCreate(categories.map(category => ({ category })));
  const codyLoc = {
    latitude: 40.704663848,
    longitude: -74.006499974
  };
  const locations = [codyLoc];

  const users = await User.bulkCreate(
    [
      {
        ...codyLoc,
        firstName: "Cody",
        lastName: "The Pug",
        email: "cody@thepug.com",
        password: "123"
      }
    ].concat(
      Array(11)
        .fill("x")
        .map((_, i) => {
          locations.push({
            latitude:
              codyLoc.latitude + i * ((Math.random() > 5 ? -1 : 1) * 0.1),
            longitude:
              codyLoc.longitude + i * ((Math.random() > 5 ? -1 : 1) * 0.1)
          });
          return {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: "user" + String(i + 2) + "@email.com",
            password: String(i + 2)
          };
        })
    ),
    {
      returning: true
    }
  );
  for (let user of users) {
    const { longitude, latitude } = locations[user.id - 1];
    await db.query(
      `UPDATE users SET location='SRID=26918;POINT(? ?)'::geometry WHERE id=?`,
      { replacements: [longitude, latitude, user.id] }
    );
  }
  await UserPreference.bulkCreate(
    Array(users.length * 3)
      .fill("x")
      .map((_, i) => ({
        userId: (i % users.length) + 1,
        preferenceId: (i % 20) + 1
      }))
  );
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
    }
  ]);
  await Match.bulkCreate([
    {
      matcherId: 7,
      matcheeId: 1
    },
    {
      matcherId: 10,
      matcheeId: 1
    }
  ]);
  console.log(`seeded successfully`);
}

async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
