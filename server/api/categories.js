const router = require("express").Router();
const { Preference } = require("../db/models");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const prefs = await Preference.findAll();
    res.send(prefs.map(({ id, category }) => ({ id, category })));
  } catch (e) {
    next(e);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const { categories } = req.body;
    if (!categories || !Array.isArray(categories)) {
      const err = new Error('"categories" must be an array');
      err.status = 400;
      throw err;
    }
    const newCategories = await Preference.bulkCreate(
      categories.map(category => ({ category })),
      { returning: true }
    );
    res.status(201).send(newCategories);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Preference.destroy({ where: { id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});
