const express = require("express");
const isAuthenticated = require("../middleware/auth");
const router = express.Router();
const db = require("../db/connection");

router.get("/test", isAuthenticated, async (req, res) => {
  res.json({ message: "Rent route is working!" });
});

router.get("/allCompanyClients/:domain", isAuthenticated, async (req, res) => {
  let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "/rent/allCompanyClients/" + req.params.domain + " : " + domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log(
          "/rent/allCompanyClients/" + req.params.domain + " : " + domainId
        );
      }

      try {
        db.query(
          "SELECT cc.user_id, cc.internal_id, u.first_name, u.last_name, u.email, cc.rent_count , cc.competency_level, u2.username AS competency_check_by FROM company_client cc INNER JOIN users u on cc.user_id = u.id INNER JOIN users u2 on cc.competency_check_by = u2.id WHERE cc.company_id = ? ORDER BY cc.internal_id ASC;",
          [domainId],
          (error, result) => {
            if (error) {
              console.error(
                "/rent/allCompanyClients/" + req.params.domain + " : " + error
              );
              return res.status(500).json({
                status: 500,
                message: "Database Error Occured",
              });
            }
            if (result.length > 0) {
              console.log(
                "/rent/allCompanyClients/" +
                req.params.domain +
                " : Value Correct"
              );
            }

            return res.status(200).send({
              status: 200,
              value: result,
            });
          }
        );
      } catch (error) {
        console.error("Error fetching company clients:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );
});

router.get("/userFromEmail/:email", isAuthenticated, (req, res) => {
  const email = req.params.email;
  db.query(
    "SELECT id, first_name, last_name FROM users WHERE email = ?",
    [email],
    (error, result) => {
      if (error) {
        console.error("/user/getFromEmail : " + error);
        return res.status(500).send({
          message: "Database Error Occurred",
        });
      }

      if (result.length == 1) {
        console.log("/user/getFromEmail : User found");
        return res.status(200).send({
          status: 200,
          value: 1,
          id: result[0].id,
          first_name: result[0].first_name,
          last_name: result[0].last_name,
        });
      } else if (result.length == 0) {
        console.error("/user/getFromEmail : User not found");
        return res.status(200).send({
          status: 200,
          value: 0,
          message: "User not found",
        });
      } else {
        console.error("/user/getFromEmail : Multiple users returned");
        return res.status(200).send({
          status: 200,
          value: 0,
          message: "Multiple users returned",
        });
      }
    }
  );
});

router.post("/addClient/:domain", isAuthenticated, async (req, res) => {
  const { user_id, internal_id, competency_level, competency_check_by } =
    req.body;
  let domainId = 0;

  const userId = req.user.id;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log("/rent/addClient/" + req.params.domain + " : " + domainErr);
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log("/rent/addClient/" + req.params.domain + " : " + domainId);
      }
      try {
        db.query(
          "INSERT INTO company_client SET ?",
          {
            user_id: user_id,
            company_id: domainId,
            internal_id: internal_id,
            rent_count: 0,
            competency_level: competency_level,
            competency_check_by: userId,
          },
          (error, result) => {
            if (error) {
              console.error(
                "/rent/addClient/" + req.params.domain + " : " + error
              );
              return res.status(500).json({
                status: 500,
                message: "Database Error Occured",
              });
            }

            return res.status(200).send({
              status: 200,
              message: "Client Added Successfully",
            });
          }
        );
      } catch (error) {
        console.error("Error adding company client:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );
});

router.delete(
  "/deleteClient/:user_id/:domain",
  isAuthenticated,
  async (req, res) => {
    console.log("/rent/deleteClient/" + req.params.domain + " : Accessed");
    let domainId = 0;

    db.query(
      "SELECT id FROM company WHERE domain_name = ?",
      [req.params.domain],
      (domainErr, domainRes) => {
        if (domainErr) {
          console.log(
            "/rent/deleteClient/" + req.params.domain + " : " + domainErr
          );
          return res.status(500).json({
            status: 500,
            message: "Domain Not Found",
          });
        }
        if (domainRes.length > 0) {
          domainId = domainRes[0].id;
          console.log(
            "/rent/deleteClient/" + req.params.domain + " : " + domainId
          );
        }
        try {
          db.query(
            "DELETE FROM company_client WHERE company_id = ? AND user_id = ?",
            [domainId, req.params.user_id],
            (error, result) => {
              if (error) {
                console.error(
                  "/rent/deleteClient/" + req.params.domain + " : " + error
                );
                return res.status(500).json({
                  status: 500,
                  message: "Database Error Occured",
                });
              }

              return res.status(200).send({
                status: 200,
                message: "Client Deleted Successfully",
              });
            }
          );
        } catch (error) {
          console.error("Error deleting company client:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
    );
  }
);

router.get("/allCompanyEquipment/rentable/:domain", isAuthenticated, async (req, res) => {
  console.log("/rent/deleteClient/" + req.params.domain + " : Accessed");
  let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "/rent/allCompanyEquipment/rentable/" + req.params.domain + " : " + domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;

        try {
          db.query(
            "SELECT e.*, i.status, i.next_date, i.details FROM penguin_inspections.equipment e INNER JOIN penguin_inspections.company_equipment ce ON ce.equipment_id = e.id LEFT JOIN ( SELECT i1.*, ci1.company_id FROM penguin_inspections.inspection i1 INNER JOIN penguin_inspections.company_inspection ci1 ON ci1.inspection_id = i1.id INNER JOIN ( SELECT i.equipment_id, ci.company_id, MAX(i.date) AS earliest_date FROM penguin_inspections.inspection i INNER JOIN penguin_inspections.company_inspection ci ON ci.inspection_id = i.id GROUP BY i.equipment_id, ci.company_id) earliest ON earliest.equipment_id = i1.equipment_id AND earliest.company_id = ci1.company_id AND i1.date = earliest.earliest_date ) i ON i.equipment_id = e.id AND i.company_id = ce.company_id WHERE ce.company_id = ? AND e.rentable = 1 ORDER BY e.internal_id",
            [domainId],
            (error, result) => {
              if (error) {
                console.error(
                  "/rent/allCompanyEquipment/rentable/" + req.params.domain + " : " + error
                );
                return res.status(500).json({
                  status: 500,
                  message: "Database Error Occured",
                });
              }
              if (result.length > 0) {
                console.log(
                  "/equipment/allCompany/" + req.params.domain + " : Value Correct"
                );
                console.log(
                  "/equipment/allUser : " +
                  new Date(result[0].retirement_date).getTime()
                );
                let today = new Date();
                let data = result.map((item) => ({
                  id: item.internal_id,
                  name: item.name,
                  brand: item.brand,
                  serial: item.serial,
                  price: item.price,
                  colour: item.colour,
                  type_number: item.type,
                  fabric_length: item.fabric_length,
                  fabric_width: item.fabric_width,
                  date_first_used: new Date(
                    new Date(item.date_first_used).getTime() + 86400000 // 24 Hours
                  )
                    .toISOString()
                    .split("T")[0],
                  retirement_date: new Date(
                    new Date(item.retirement_date).getTime() + 86400000 // 24 Hours
                  )
                    .toISOString()
                    .split("T")[0],
                  next_inspection_date:
                    item.next_date != null
                      ? new Date(item.next_date).toISOString().split("T")[0]
                      : "N/A",
                  status:
                    item.status == 2
                      ? 3
                      : new Date(item.retirement_date).getTime() <=
                        today.getTime() - 86400000 // 24 hours
                        ? 3
                        : 0,
                  inspection_notes: item.details != "" ? item.details : "N/A",
                  rentable: item.rentable === 1 ? true : false,
                }));
                return res.status(200).json({
                  status: 200,
                  message: "Success",
                  value: data,
                });
              }
            });
        }
        catch (error) {
          console.error("Error fetching company equipment:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
    }
  );
});

module.exports = router;
