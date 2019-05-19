const router = require("express").Router();
const passport = require("passport");
const { User } = require("../db/models");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
module.exports = router;

// Google authentication and login (GET /auth/google)
router.get("/", passport.authenticate("google", { scope: "email" }));

// This is the route that the Provider sends the user back to (along with the temporary auth token)
// after they "sign the contract".
//
// passport.authenticate will automatically send us to google (with the auth token and our client secret),
// and once we clear things with google, we will return to our verification callback with the permanent
// user token and any profile information we're allowed to see
router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/profile", // or wherever
    failureRedirect: "http://localhost:3000/login" // or wherever
  })
);

// For passport.authenticate to work, it needs a strategy, which we will configure below!
const googleCredentials = {
  clientID:
    "668410532884-dvjgn5u3a63lvu84cuudgmu8bik66abd.apps.googleusercontent.com",
  clientSecret: "W03P5suZ1VIGb04lrktfrR4U",
  callbackURL: "/auth/google/callback"
};

const verificationCallback = async (token, refreshToken, profile, done) => {
  const info = {
    name: profile.displayName,
    email: profile.emails[0].value,
    imageUrl: profile.photos ? profile.photos[0].value : undefined
  };

  try {
    const [user] = await User.findOrCreate({
      where: { googleId: profile.id },
      defaults: info
    });
    done(null, user); // the user we pass to done here is piped through passport.serializeUser
  } catch (err) {
    done(err);
  }
};

const strategy = new GoogleStrategy(googleCredentials, verificationCallback);

// configuring the strategy (credentials + verification callback)
// this is used by 'passport.authenticate'
passport.use(strategy);

// after we find or create a user, we 'serialize' our user on the session
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // If we've serialized the user on our session with an id, we look it up here
// // and attach it as 'req.user'.
// passport.deserializeUser((id, done) => {
//   User.findByPk(id)
//     .then(user => {
//       done(null, user);
//     })
//     .catch(err => {
//       done(err);
//     });
// });
