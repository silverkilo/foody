module.exports = async function(db) {
  await db.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
  await db.query(
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS location GEOMETRY`
  );
  const [[{ srid }]] = await db.query(
    `SELECT srid FROM geometry_columns WHERE f_table_name='users'`
  );
  if (srid !== 26918) {
    await db.query(`SELECT UpdateGeometrySRID('users', 'location', 26918);`);
  }
  await db.query(
    `CREATE INDEX IF NOT EXISTS users_location_index ON users USING GIST(location);`
  );
};
