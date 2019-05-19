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
  const names = [
    "Juan Marges",
    "Saeed Sheikh",
    "Sam Huque",
    "Eric Folks",
    "Danny Marquez",
    "Conrad Batraville",
    "Ben Rodriguez",
    "Brandon Rowe",
    "Jeetkumar Desai",
    "Julissa Napoletano",
    "Frank Rose",
    "Christina Armstrong",
    "Emily Asaro",
    "Billy Tan",
    "Grace Lee",
    "Matt Howe",
    "Daniel Kil",
    "Keith Nocera",
    "Peter Burger",
    "Barry Huang",
    "David Adewoyin",
    "Omar Jameer",
    "AJ Lapid",
    "Reggie Beauvais",
    "Anna Mai",
    "John Vasiliadis",
    "Kenny Ye",
    "Jackie Ore",
    "Daniel Lanoff",
    "Malhar Teli",
    "Corey Greenwald",
    "Eric Chan",
    "Roger Palabasan",
    "Jenny Wong",
    "Logan Takahashi",
    "Nevin Chen",
    "Jason Levine",
    "David Li",
    "Katrina Rodnika",
    "The Bazzles",
    "John McDonald",
    "Marielle Combier-Kapel",
    "Gordon Wu",
    "Marcia Wan",
    "Sasha Kayola",
    "Eileen Galindo",
    "Rhea Rao",
    "Mark Greenquist",
    "Christopher Najafi",
    "Aaron Nah",
    "Ariel Ahdoot",
    "Roumesh Persand",
    "Harrison Cole",
    "Brook Li"
  ];
  const locations = [codyLoc];
  console.log(names.indexOf("Sasha Kayola"));
  console.log(names.indexOf("Rhea Rao"));
  const seedUsers = names.map((name, i) => {
    const with_ = name.replace(" ", "_").toLowerCase();
    const [firstName, lastName] = name.split(" ");
    const email = name.replace(" ", ".").toLowerCase() + "@hungrystack.com";
    const password = name.toLowerCase().replace(" ", "");
    locations.push({
      latitude:
        codyLoc.latitude + (i + 1) * ((Math.random() > 5 ? -1 : 1) * 0.001),
      longitude:
        codyLoc.longitude + (i + 1) * ((Math.random() > 5 ? -1 : 1) * 0.001)
    });
    return {
      firstName,
      lastName,
      password,
      email,
      photoURLs: [
        `https://res.cloudinary.com/omarjuice/image/upload/w_300,h_300/v1558110703/foody/${with_}.${
          firstName === "Omar" ? "jpg" : "png"
        }`
      ]
    };
  });

  const users = await User.bulkCreate(
    [
      {
        firstName: "Cody",
        lastName: "The Pug",
        email: "cody@thepug.com",
        password: "123",
        photoURLs: [
          "https://images-na.ssl-images-amazon.com/images/I/71gRnoHe%2BTL._UY550_.jpg"
        ]
      }
    ].concat(seedUsers),
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
  await Match.bulkCreate([
    {
      matcherId: 46,
      matcheeId: 48
    },
    {
      matcherId: 48,
      matcheeId: 46
    }
  ]);
  await User.update({ hasMatched: 46 }, { where: { id: 48 } });
  await User.update({ hasMatched: 48 }, { where: { id: 46 } });
  await UserPreference.bulkCreate(
    Array(users.length * 5)
      .fill("x")
      .map((_, i) => ({
        userId: (i % users.length) + 1,
        preferenceId: (i % 20) + 1
      })),
    { ignoreDuplicates: true }
  );
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
