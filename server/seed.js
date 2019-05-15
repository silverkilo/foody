const faker = require("faker");
const db = require("../server/db");
const gis = require("./gis");
const { Op } = require("sequelize");
const { Preference, User, UserPreference, Match } = require("./db/models");
const categories = [
  ["Bubble Tea", "52e81612bcbc57f1066b7a0c"],
  ["African", "4bf58dd8d48988d1c8941735"],
  ["American", "4bf58dd8d48988d14e941735"],
  ["Japanese", "4bf58dd8d48988d111941735"],
  ["Chinese", "4bf58dd8d48988d145941735"],
  ["Comfort Food", "52e81612bcbc57f1066b7a00"],
  ["Coffee Shop", "4bf58dd8d48988d1e0931735"],
  ["Vietnamese", "4bf58dd8d48988d14a941735"],
  ["Australian", "4bf58dd8d48988d169941735"],
  ["Brazilian", "4bf58dd8d48988d16b941735"],
  ["Soul Food", "4bf58dd8d48988d14f941735"],
  ["Cajun/Creole", "4bf58dd8d48988d17a941735"],
  ["Dessert Shop", "4bf58dd8d48988d1d0941735"],
  ["French", "4bf58dd8d48988d10c941735"],
  ["Bakery", "4bf58dd8d48988d16a941735"],
  ["German", "4bf58dd8d48988d10d941735"],
  ["Greek", "4bf58dd8d48988d10e941735"],
  ["Persian", "52e81612bcbc57f1066b79f7"],
  ["Peruvian", "4eb1bfa43b7b52c0e1adc2e8"],
  ["Vegetarian/Vegan", "4bf58dd8d48988d1d3941735"]
];
async function seed() {
  await db.sync({
    force: true
  });
  await gis(db);
  console.log("db synced!");

  await Preference.bulkCreate(
    categories.map(([category, fsId]) => ({
      category,
      fsId
    }))
  );
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
        password: "123",
        photoURLs: [
          "https://images-na.ssl-images-amazon.com/images/I/71gRnoHe%2BTL._UY550_.jpg"
        ]
      }
    ].concat(
      Array(35)
        .fill("x")
        .map((_, i) => {
          locations.push({
            latitude:
              codyLoc.latitude +
              (i + 1) * ((Math.random() > 5 ? -1 : 1) * 0.001),
            longitude:
              codyLoc.longitude +
              (i + 1) * ((Math.random() > 5 ? -1 : 1) * 0.001)
          });
          return {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: "user" + String(i + 2) + "@email.com",
            password: String(i + 2),
            photoURLs: [faker.image.avatar()]
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
      {
        replacements: [longitude, latitude, user.id]
      }
    );
  }
  await UserPreference.bulkCreate(
    Array(users.length * 5)
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
      matcherId: 2,
      matcheeId: 10
    },
    {
      matcherId: 10,
      matcheeId: 2
    }
  ]);
  await User.update({ hasMatched: 2 }, { where: { id: 10 } });
  await User.update({ hasMatched: 10 }, { where: { id: 2 } });
  await Promise.all(
    categories.map((_, i) =>
      UserPreference.create(
        {
          userId: 1,
          preferenceId: i + 1
        },
        { ignoreDuplicates: true }
      )
    )
  );
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
