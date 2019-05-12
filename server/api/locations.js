const router = require("express").Router();
const db = require("../db");
const { authGateWay } = require("./gateway");
module.exports = router;

router.post("/", authGateWay, async (req, res, next) => {
  try {
    let { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      const err = new Error('"latitiude" and "longitude" must be provided');
      err.status = 400;
      throw err;
    }
    const id = req.user.id;
    const [[result]] = await db.query(
      `
            UPDATE users 
                SET location='SRID=26918;POINT(? ?)'::geometry 
            WHERE id=? 
            returning id, location`,
      { replacements: [longitude, latitude, id] }
    );
    res.status(201).send(result);
  } catch (e) {
    next(e);
  }
});
