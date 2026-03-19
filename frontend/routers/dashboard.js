const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();
const reactAddress = require("../middleware/reactAddress");

router.get("/:universalURL", checkAuth, (req, res) => {
  console.log("Dashboard Auth Confirmed");
  return res.render(reactAddress);
});

module.exports = router;
