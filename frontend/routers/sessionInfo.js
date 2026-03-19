const express = require("express");
const router = express.Router();

router.get("/lastRequest", (req, res) => {
  if (req.session.lastRequest != null) {
    return res.status(200).send({
      lastURL: req.session.lastRequest.url,
      lastStatus: req.session.lastRequest.status,
      message: req.session.lastRequest.message,
    });
  } else {
    return res.status(500).send({
      message: "Missing session data",
    });
  }
});

router.get("/lastRequest/url", (req, res) => {
  if (req.session.lastRequest != null) {
    return res.status.send({
      url: req.session.lastRequest.url,
    });
  } else {
    return res.status(500).send({
      url: "",
    });
  }
});

router.get("/lastRequest/status", (req, res) => {
  if (req.session.lastRequest != null) {
    return res.status.send({
      status: req.session.lastRequest.status,
    });
  } else {
    return res.status(500).send({
      status: true,
    });
  }
});

router.get("/lastRequest/message", (req, res) => {
  if (req.session.lastRequest != null) {
    return res.status.send({
      status: req.session.lastRequest.message,
    });
  } else {
    return res.status(500).send({
      message: "A server error occurred",
    });
  }
});

module.exports = router;
