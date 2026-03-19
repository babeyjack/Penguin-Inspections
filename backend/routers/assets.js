const express = require("express");
const router = express.Router();
const path = require("path");
const assetAddress = require("../middleware/assetAddress");

router.get("/local/img/:folder/:asset", (req, res) => {
  const options = {
    root: path.join(assetAddress, "images", req.params.folder, "/"),
  };
  //console.log("Requesting Local Image : " + req.params.folder + "/" + req.params.asset);
  return res.sendFile(req.params.asset, options);
});

module.exports = router;
