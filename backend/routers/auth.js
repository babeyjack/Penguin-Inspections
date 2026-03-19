const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/connection");
const isAuthenticated = require("../middleware/auth");
const frontendAddress = require("../middleware/frontendAddress");

const router = express.Router();
const JWT_SECRET = "chris07111995";

// Register
router.post("/register", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)",
    [firstName, lastName, username, email, hashed],
    (err) => {
      if (err) {
        console.error("/auth/register : " + err);
        return res.status(500).send("Registration failed");
      }
      console.log("/auth/register : Success");
      return res.status(200).json({ message: "User registered" });
    }
  );
});

// Login and issue JWT
router.post("/login", (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log("/auth/login : user : " + user);
    if (err) {
      console.log("/auth/login : Error : " + err);
      return res.status(401).json({ status: 401, message: "Login failed", info });
    } else if (!user) {
      console.log("/auth/login : !User : " + info.message);
      return res.status(401).json({status: 401, message: info.message, info});
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    console.log("/auth/login : Login Authorised");
    return res.status(200).json({ status: 200, token: token });
  })(req, res);
});

// Google Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: frontendAddress + "/auth/server/failure",
  }),
  (req, res) => {
    console.log("Google Authorised");
    const token = jwt.sign({ id: req.user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.redirect(frontendAddress + "/dashboard");
  }
);

// Protected route
router.get("/profile", isAuthenticated, (req, res) => {
  return res
    .status(200)
    .json({ message: "Welcome to your profile", user: req.user });
});

router.get("/protected", isAuthenticated, (req, res) => {
  console.log("/auth/protected : confirmed");
  return res.status(200).json({
    message: "You are authenticated",
    user: req.user,
  });
});

module.exports = router;
