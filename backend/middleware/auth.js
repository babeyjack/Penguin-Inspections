const passport = require("passport");

const isAuthenticated = (req, res, next) => {
  console.log("Check User Authentication");

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      console.log("User unauthorised:", info?.message);
      return res.status(401).json({ message: "Not Authenticated" });
    }

    console.log("User Authorised:", user.username);
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = isAuthenticated;
