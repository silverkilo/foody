const isAuthenticated = (req, res, next) => {
  try {
    if (req.user) {
      return next();
    } else {
      res.redirect("/home");
    }
  } catch (e) {
    res.redirect("/home");
  }
};

module.exports = { isAuthenticated };
