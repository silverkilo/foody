const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
router.use("/categories", require("./categories"));
router.use("/preferences", require("./preferences"));
router.use("/locations", require("./locations"));
router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
