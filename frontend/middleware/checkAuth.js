const express = require("express");
const apiAddress = require("./apiAddress");

module.exports = function checkAuth(req, res, next) {
  // WARNING: this disables cert verification - for local dev ONLY
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  fetch(apiAddress + "/auth/protected", {
    method: "GET",
    headers: { Authorization: `Bearer ${req.cookies.token}` },
    credentials: "include",
  })
    .then((result) => {
      if (result.status != 200) {
        throw new Error("Not authenticated");
      } else {
        return result.json();
      }
    })
    .then((data) => {
      console.log("Check Auth : " + data.message);
      next();
    })
    .catch((e) => {
      console.error("Check Auth Error : " + e);
      res.redirect("/login/1/authError");
    });
};
