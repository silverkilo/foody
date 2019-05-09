const router = require("express").Router();
const { Preference, User, UserPreference } = require("../db/models");
const { authGateWay } = require("./gateway");
module.exports = router;

router.get("/", authGateWay, async (req, res, next) => {
  try {
    const user = await User.findByPk(Number(req.user.id), {
      include: [{ model: Preference }]
    });
    res.send(user.preferences);
  } catch (e) {
    next(e);
  }
});

router.post("/", authGateWay, async (req, res, next) => {
  try {
    const { preferences } = req.body;
    if (!preferences || !Array.isArray(preferences)) {
      const err = new Error('"preferences" must be an array');
      err.status = 400;
      throw err;
    }
    const userId = req.user.id;
    await UserPreference.destroy({
      where: {
        userId
      }
    });
    const newPrefs = preferences.map(preferenceId => ({
      userId,
      preferenceId
    }));
    await UserPreference.bulkCreate(newPrefs);
    res.status(201).send(preferences);
  } catch (e) {
    next(e);
  }
});
