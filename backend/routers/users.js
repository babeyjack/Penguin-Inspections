// External Dependencies
// // Routing
const express = require("express");
const router = express.Router();
// // Database
const db = require("../db/connection");

// Export Router as the module
module.exports = router;

// User Data GET Requests

router.get("/:id/summary", (req, res) => {
  db.query(
    "SELECT inspections_count, equipment_count, equipment_cost FROM users WHERE id = ?",
    [req.params.id],
    (error, result) => {
      if (error) {
        console.error("/user/" + req.params.id + "/summary : " + error);
        return res.status(500).send({
          message: "Database Error Occurred",
        });
      }

      if (result.length == 1) {
        return res.status(200).send({
          inspectionsCount: result[0].inspections_count,
          itemCount: result[0].equipment_count,
          itemsCost: result[0].equipment_cost,
        });
      } else if (result.length == 0) {
        console.error("/user/" + req.params.id + "/summary : User not found");
        return res.status(300).send({
          message: "User not found",
        });
      } else {
        console.error(
          "/user/" + req.params.id + "/summary : Multiple users returned"
        );
        return res.status(300).send({
          message: "Multiple users returned",
        });
      }
    }
  );
});

router.get("/:id/image", (req, res) => {
  db.query(
    "SELECT image_src FROM users WHERE id = ?",
    [req.params.id],
    (error, result) => {
      if (error) {
        console.error("/user/" + req.params.id + "/image : " + error);
        return res.status(500).send({
          message: "Database Error Occurred",
        });
      }

      if (result.length == 1) {
        return res.status(200).send({
          image_src: result[0].image_src,
        });
      } else if (result.length == 0) {
        console.error("/user/" + req.params.id + "/image : User not found");
        return res.status(300).send({
          message: "User not found",
        });
      } else {
        console.error(
          "/user/" + req.params.id + "/image : Multiple users returned"
        );
        return res.status(300).send({
          message: "Multiple users returned",
        });
      }
    }
  );
});
