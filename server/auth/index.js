const router = require("express").Router();
const User = require("../db/models/user");
module.exports = router;

router.use("/google", require("./google"));

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email.toLowerCase() }
    });
    if (!user) {
      console.log("No such user found:", req.body.email);
      res.status(401).send("Wrong username and/or password");
    } else if (!user.correctPassword(req.body.password)) {
      console.log("Incorrect password for user:", req.body.email);
      res.status(401).send("Wrong username and/or password");
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)));
    }
  } catch (err) {
    next(err);
  }
});

// router.post('/signup', async (req, res, next) => {
//   try {
//     const user = await User.create({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//       googleId: null,
//       password: req.body.password
//     })
//     req.login(user, err => (err ? next(err) : res.json(user)))
//   } catch (err) {
//     if (err.name === 'SequelizeUniqueConstraintError') {
//       res.status(401).send('User already exists')
//     } else {
//       next(err)
//     }
//   }
// })
router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.create({
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      googleId: null
    });
    req.login(user, err => (err ? next(err) : res.json(user)));
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else if (err.name === "SequelizeValidationError") {
      res.status(401).send("Please Enter a Valid Email");
    } else {
      next(err);
    }
  }
});

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/me", (req, res) => {
  res.json(req.user);
});

// router.use('/google', require('./google'))
