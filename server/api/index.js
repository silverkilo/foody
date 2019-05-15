const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
router.use("/categories", require("./categories"));
router.use("/preferences", require("./preferences"));
router.use("/location", require("./location"));
router.use("/photos", require("./photos"));
router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
