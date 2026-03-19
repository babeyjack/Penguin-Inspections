const express = require("express");
const router = express.Router();
const apiAddress = require("../middleware/apiAddress");
const validateEmail = require("../middleware/validateEmail");
const checkAuth = require("../middleware/checkAuth");
const { Stats } = require("fs");

// POST Requests
router.post("/login", (req, res) => {
  const { username, password, domain } = req.body;
  if (validateEmail(username)) {
    console.error(
      "/auth/login : Username value corresponds to an email address"
    );
    return res.status(406).json({
      status: 406,
      message: "usernameEmail",
    });
  }

  // WARNING: this disables cert verification - for local dev ONLY
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  fetch(apiAddress + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password, domain: domain}),
  })
    .then((result) => result?.json())
    .then((data) => {
      if(data.status == 200) {
      if (data.token) {
        res.cookie("token", data.token, {
          httpOnly: true, // safer, not accessible to JS
          secure: true, // only over HTTPS
          sameSite: "Strict",
          maxAge: 24 * 60 * 60 * 1000,
        });
      }
      console.log("/auth/login : Success");
      return res.status(200).json({
        status: 200,
        message: "success",
      });
    } else {
        console.error("/auth/login : Server Error");
        return res.status(500).json({
        status: 500,
        message: "serverFail",
      });
    }})
    .catch((e) => {
      console.error("/auth/login : " + e);
      return res.status(500).json({
        status: 500,
        message: "serverFail",
      });
    });
});

router.post("/register", (req, res) => {
  const { firstName, lastName, username, email, password, passwordConf, tos } =
    req.body;

  // WARNING: this disables cert verification - for local dev ONLY
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  fetch(apiAddress + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName,
      lastName,
      username,
      email,
      password,
    }),
  })
    .then((res) => {
      if (res.status != 200) {
        const errText = res.text();
        throw new Error(`Registration failed: ${errText}`);
      } else {
        return res.json();
      }
    })
    .then((data) => {
      console.log("/auth/register : ", data.message);
      return res.status(200).json({
        status: 200,
        message: "registerSuccess",
      });
    })
    .catch((e) => {
      console.error("/auth/register : " + e);
      return res.status(500).json({
        status: 500,
        message: "regFailed",
      });
    });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ status: 200, message: "logoutSuccess" });
});

router.get("/server/failure", (req, res) => {
  res.status(500).redirect("/login/1/googleFail");
});

router.get("/protected", checkAuth, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});

module.exports = router;
