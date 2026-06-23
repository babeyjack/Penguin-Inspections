const express = require("express");
const isAuthenticated = require("../middleware/auth");
const router = express.Router();
const db = require("../db/connection");
const datePrototype = require("../middleware/datePrototype");

Date.prototype.yyyymmdd = datePrototype;

router.get("/nextUserID", isAuthenticated, (req, res) => {
  const userId = req.user.id;
  console.log("/equipment/nextUserID : " + userId);
  db.query(
    "SELECT MAX(e.internal_id) as max_id FROM penguin_inspections.user_equipment ue inner join penguin_inspections.equipment e on ue.equipment_id = e.id where ue.user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("/equipment/nextUserID : " + err);
        return res.status(500).json({
          status: 500,
          message: "Database Error Occured",
        });
      }

      if (result.length > 0) {
        console.log("/equipment/nextUserID : Value Correct");
        return res.status(200).json({
          status: 200,
          message: "Success",
          value: result[0].max_id + 1,
        });
      } else {
        console.error("/equipment/nextUserID : Too many results");
        return res.status(500).json({
          status: 500,
          message: "Too many elements returned",
        });
      }
    }
  );
});

router.get("/nextCompanyID/:domain", isAuthenticated, (req, res) => {
  let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "/equipment/allCompany/" + req.params.domain + " : " + domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log(
          "/equipment/nextCompanyID/" + req.params.domain + " : " + domainId
        );
      }
      db.query(
        "SELECT MAX(e.internal_id) as max_id FROM penguin_inspections.company_equipment ce inner join penguin_inspections.equipment e on ce.equipment_id = e.id where ce.company_id = ?",
        [domainId],
        (err, result) => {
          if (err) {
            console.error(
              "/equipment/nextCompanyID/" + req.params.domain + " : " + err
            );
            return res.status(500).json({
              status: 500,
              message: "Database Error Occured",
            });
          }

          if (result.length > 0) {
            console.log(
              "/equipment/nextCompanyID/" +
                req.params.domain +
                " : Value Correct"
            );
            return res.status(200).json({
              status: 200,
              message: "Success",
              value: result[0].max_id + 1,
            });
          } else {
            console.error(
              "/equipment/nextCompanyID/" +
                req.params.domain +
                " : Too many results"
            );
            return res.status(500).json({
              status: 500,
              message: "Too many elements returned",
            });
          }
        }
      );
    }
  );
});

router.get("/userTypes", isAuthenticated, (req, res) => {
  const userId = req.user.id;
  console.log("/equipment/userTypes : " + userId);
  db.query(
    "select et.* from penguin_inspections.equipment_type et inner join penguin_inspections.user_equipment_type uet on uet.type_id = et.id where uet.user_id = ? ORDER BY et.name",
    [userId],
    (error, result) => {
      if (error) {
        console.error("/equipment/userTypes : " + error);
        return res.status(500).json({
          status: 500,
          message: "Database Error Occured",
        });
      }

      if (result.length > 0) {
        console.log("/equipment/userTypes : Value Correct");
        return res.status(200).json({
          status: 200,
          message: "Success",
          value: result,
        });
      }
    }
  );
});

router.get("/companyTypes/:domain", isAuthenticated, (req, res) => {
  let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "/equipment/allCompany/" + req.params.domain + " : " + domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log(
          "/equipment/nextCompanyID/" + req.params.domain + " : " + domainId
        );
      }
      db.query(
        "select et.* from penguin_inspections.equipment_type et inner join penguin_inspections.company_equipment_type cet on cet.type_id = et.id where cet.company_id = ? ORDER BY et.name",
        [domainId],
        (error, result) => {
          if (error) {
            console.error(
              "/equipment/companyTypes/" + req.params.domain + " : " + error
            );
            return res.status(500).json({
              status: 500,
              message: "Database Error Occured",
            });
          }

          if (result.length > 0) {
            console.log(
              "/equipment/companyTypes/" +
                req.params.domain +
                " : Value Correct"
            );
            return res.status(200).json({
              status: 200,
              message: "Success",
              value: result,
            });
          }
        }
      );
    }
  );
});

router.get("/type/:typeId", isAuthenticated, (req, res) => {
  const typeId = req.params.typeId;
  db.query(
    "SELECT * FROM equipment_type WHERE id = ?",
    [typeId],
    (error, result) => {
      if (error) {
        console.error("/equipment/type/id : " + err);
        return res.status(500).json({
          status: 500,
          message: "Database Error Occured",
        });
      }

      if (result.length > 0) {
        console.log("/equipment/type/id : Success");
        return res.status(200).json({
          status: 200,
          message: "Success",
          value: result,
        });
      }
    }
  );
});

router.get("/allUser", isAuthenticated, (req, res) => {
  const userId = req.user.id;
  console.log("/equipment/allUser : " + userId);
  db.query(
    "SELECT e.*, i.status, i.next_date, i.details FROM penguin_inspections.equipment e INNER JOIN penguin_inspections.user_equipment ue ON ue.equipment_id = e.id LEFT JOIN ( SELECT i1.*, ui1.user_id FROM penguin_inspections.inspection i1 INNER JOIN penguin_inspections.user_inspection ui1 ON ui1.inspection_id = i1.id INNER JOIN ( SELECT i.equipment_id, ui.user_id, MAX(i.date) AS earliest_date FROM penguin_inspections.inspection i INNER JOIN penguin_inspections.user_inspection ui ON ui.inspection_id = i.id GROUP BY i.equipment_id, ui.user_id) earliest ON earliest.equipment_id = i1.equipment_id AND earliest.user_id = ui1.user_id AND i1.date = earliest.earliest_date ) i ON i.equipment_id = e.id AND i.user_id = ue.user_id WHERE ue.user_id = ? ORDER BY e.internal_id",
    [userId],
    (error, result) => {
      if (error) {
        console.error("/equipment/allUser : " + error);
        return res.status(500).json({
          status: 500,
          message: "Database Error Occured",
        });
      }
      if (result.length > 0) {
        console.log("/equipment/allUser : Value Correct");
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
              : item.next_date == null
              ? 2
              : new Date(item.next_date).getTime() <= today.getTime()
              ? 2
              : new Date(item.next_date).getTime() <=
                today.getTime() + 2592000000 // 30 days
              ? 1
              : 0,
          inspection_notes: item.details != "" ? item.details : "N/A",
        }));
        return res.status(200).json({
          status: 200,
          message: "Success",
          value: data,
        });
      }
    }
  );
});

router.get("/allCompany/:domain", isAuthenticated, (req, res) => {
  let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "/equipment/allCompany/" + req.params.domain + " : " + domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log(
          "/equipment/allCompany/" + req.params.domain + " : " + domainId
        );
      }

      db.query(
        "SELECT e.*, i.status, i.next_date, i.details FROM penguin_inspections.equipment e INNER JOIN penguin_inspections.company_equipment ce ON ce.equipment_id = e.id LEFT JOIN ( SELECT i1.*, ci1.company_id FROM penguin_inspections.inspection i1 INNER JOIN penguin_inspections.company_inspection ci1 ON ci1.inspection_id = i1.id INNER JOIN ( SELECT i.equipment_id, ci.company_id, MAX(i.date) AS earliest_date FROM penguin_inspections.inspection i INNER JOIN penguin_inspections.company_inspection ci ON ci.inspection_id = i.id GROUP BY i.equipment_id, ci.company_id) earliest ON earliest.equipment_id = i1.equipment_id AND earliest.company_id = ci1.company_id AND i1.date = earliest.earliest_date ) i ON i.equipment_id = e.id AND i.company_id = ce.company_id WHERE ce.company_id = ? ORDER BY e.internal_id",
        [domainId],
        (error, result) => {
          if (error) {
            console.error(
              "/equipment/allCompany/" + req.params.domain + " : " + error
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
                  : item.next_date == null
                  ? 2
                  : new Date(item.next_date).getTime() <= today.getTime()
                  ? 2
                  : new Date(item.next_date).getTime() <=
                    today.getTime() + 2592000000 // 30 days
                  ? 1
                  : 0,
              inspection_notes: item.details != "" ? item.details : "N/A",
            }));
            return res.status(200).json({
              status: 200,
              message: "Success",
              value: data,
            });
          }
        }
      );
    }
  );
});

router.get("/item/:internal_id/:domain", isAuthenticated, (req, res) => {
  const internal_id = req.params.internal_id;
  let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "/equipment/item/" +
            req.params.internal_id +
            "/" +
            req.params.domain +
            " : " +
            domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log(
          "/equipment/item/" +
            req.params.internal_id +
            "/" +
            req.params.domain +
            " : " +
            domainId
        );
      }

      console.log(
        "/equipment/item/" +
          req.params.internal_id +
          "/" +
          req.params.domain +
          " : " +
          internal_id
      );
      db.query(
        "SELECT * FROM equipment INNER JOIN company_equipment ON equipment.id = company_equipment.equipment_id WHERE company_equipment.company_id = ? AND equipment.internal_id = ?",
        [domainId, internal_id],
        (fetchErr, fetchRetr) => {
          if (fetchErr) {
            console.error("/equipment/add : " + fetchErr);
            return res.status(500).json({
              status: 500,
              message: "Database Error Occurred",
            });
          }

          if (fetchRetr.length > 0) {
            console.log("/equipment/item/internal/company : Success");
            const data = {
              ...fetchRetr[0],
              date_first_used: new Date(
                new Date(fetchRetr[0].date_first_used).getTime() + 86400000
              )
                .toISOString()
                .split("T")[0],
              retirement_date: new Date(
                new Date(fetchRetr[0].retirement_date).getTime() + 86400000
              )
                .toISOString()
                .split("T")[0],
            };
            return res.status(200).json({
              status: 200,
              message: "Success",
              value: data,
            });
          } else {
            console.error(
              "/equipment/item/internal/company : No Elements Found"
            );
            return res.status(204).json({
              status: 204,
              message: "No Elements Found",
            });
          }
        }
      );
    }
  );
});

router.get("/item/:internal_id", isAuthenticated, (req, res) => {
  const internal_id = req.params.internal_id;
  const userId = req.user.id;
  console.log("/equipment/item/id : " + internal_id);
  db.query(
    "SELECT * FROM equipment INNER JOIN user_equipment ON equipment.id = user_equipment.equipment_id WHERE user_equipment.user_id = ? AND equipment.internal_id = ?",
    [userId, internal_id],
    (fetchErr, fetchRetr) => {
      if (fetchErr) {
        console.error("/equipment/add : " + fetchErr);
        return res.status(500).json({
          status: 500,
          message: "Database Error Occurred",
        });
      }

      if (fetchRetr.length > 0) {
        console.log("/equipment/item/internal : Success");
        const data = {
          ...fetchRetr[0],
          date_first_used: new Date(
            new Date(fetchRetr[0].date_first_used).getTime() + 86400000
          )
            .toISOString()
            .split("T")[0],
          retirement_date: new Date(
            new Date(fetchRetr[0].retirement_date).getTime() + 86400000
          )
            .toISOString()
            .split("T")[0],
        };
        return res.status(200).json({
          status: 200,
          message: "Success",
          value: data,
        });
      } else {
        console.error("/equipment/add : No Elements Found");
        return res.status(204).json({
          status: 204,
          message: "No Elements Found",
        });
      }
    }
  );
});

router.get("/allSets", isAuthenticated, (req, res) => {
  const userId = req.user.id;

  console.log("/equipment/allSets");

  db.beginTransaction((beginErr) => {
    try {
      if (beginErr) {
        console.error("/equipmentn/allSets : " + beginErr);
        return res.status(500).json({
          status: 500,
          message: beginErr,
        });
      }

      db.query(
        "SELECT s.* FROM penguin_inspections.`set` s INNER JOIN user_set us on s.id = us.set_id WHERE us.user_id = ?",
        [userId],
        (setsErr, setsRetr) => {
          if (setsErr) {
            console.error("/equipment/allSets : Sets Fetch : " + setsErr);
            return res.status(500).json({
              status: 500,
              message: setsErr,
            });
          }

          if (setsRetr.length > 0) {
            console.log("/equipment/allSets : Success");
            return res.status(200).json({
              status: 200,
              message: "Success",
              value: setsRetr,
            });
          } else {
            console.log("/equipment/allSets : No Sets Returned");
            return res.status(200).json({
              status: 200,
              message: "Success",
              value: [],
            });
          }
        }
      );
    } catch (e) {
      console.error("/equipment/allSets : " + e);
      return res.status(500).json({
        status: 500,
        message: e,
      });
    }
  });
});

router.get("/allCompanySets/:domain", isAuthenticated, (req, res) => {
  let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "/equipment/allCompany/" + req.params.domain + " : " + domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log(
          "/equipment/allCompany/" + req.params.domain + " : " + domainId
        );
      }

      console.log("/equipment/allCompanySets/" + req.params.domain);

      db.beginTransaction((beginErr) => {
        try {
          if (beginErr) {
            console.error(
              "/equipment/allCompanySets/" +
                req.params.domain +
                " : " +
                beginErr
            );
            return res.status(500).json({
              status: 500,
              message: beginErr,
            });
          }

          db.query(
            "SELECT s.* FROM penguin_inspections.`set` s INNER JOIN company_set cs on s.id = cs.set_id WHERE cs.company_id = ?",
            [domainId],
            (setsErr, setsRetr) => {
              if (setsErr) {
                console.error(
                  "/equipment/allCompanySets/" +
                    req.params.domain +
                    " : Sets Fetch : " +
                    setsErr
                );
                return res.status(500).json({
                  status: 500,
                  message: setsErr,
                });
              }

              if (setsRetr.length > 0) {
                console.log(
                  "/equipment/allCompanySets/" +
                    req.params.domain +
                    " : Success"
                );
                return res.status(200).json({
                  status: 200,
                  message: "Success",
                  value: setsRetr,
                });
              } else {
                console.log(
                  "/equipment/allCompanySets/" +
                    req.params.domain +
                    " : No Sets Returned"
                );
                return res.status(200).json({
                  status: 200,
                  message: "Success",
                  value: [],
                });
              }
            }
          );
        } catch (e) {
          console.error(
            "/equipment/allCompanySets/" + req.params.domain + " : " + e
          );
          return res.status(500).json({
            status: 500,
            message: e,
          });
        }
      });
    }
  );
});

router.get("/set/:internal_id", isAuthenticated, (req, res) => {
  const internalId = req.params.internal_id;
  const userId = req.user.id;

  console.log("/equipment/set/" + internalId);

  db.beginTransaction((transactionErr) => {
    try {
      if (transactionErr) {
        console.error("/equipment/set/" + internalId + " : " + transactionErr);
        return res.status(500).send({
          status: 500,
          message: transactionErr,
        });
      }

      db.query(
        "SELECT s.internal_id AS 'id', s.desc, s.equipment_count as 'count', s.equipment_value as 'value' FROM penguin_inspections.set s INNER JOIN user_set us ON us.set_id = s.id WHERE s.internal_id = ? AND us.user_id = ?",
        [internalId, userId],
        (setErr, setRetr) => {
          if (setErr) {
            console.error("/equipment/set/" + internalId + " : " + setErr);
            return res.status(500).send({
              status: 500,
              message: setErr,
            });
          }

          if (setRetr.length == 0 || setRetr.length > 1) {
            console.error(
              "/equipment/set/" +
                internalId +
                " : Incorrect number of sets returned"
            );
            return res.status(500).send({
              status: 500,
              message: "Incorrect Set Count",
            });
          }

          db.query(
            "SELECT e.internal_id as 'external_id', e.id, e.name, e.serial, e.brand as 'manufacturer' FROM equipment e INNER JOIN set_equipment se ON se.equipment_id = e.id WHERE se.set_id = ?",
            [setRetr[0].id],
            (equipErr, equipRetr) => {
              if (equipErr) {
                console.error(
                  "/equipment/set/" + internalId + " : " + equipErr
                );
                return res.status(500).send({
                  status: 500,
                  message: equipErr,
                });
              }

              db.query(
                "SELECT s.internal_id as 'id', s.desc, s.equipment_count as 'count', s.equipment_value as 'value' FROM penguin_inspections.set s INNER JOIN set_set ss ON ss.child_set = s.id WHERE ss.parent_set = ?",
                [setRetr[0].id],
                (childErr, childRetr) => {
                  if (childErr) {
                    console.error(
                      "/equipment/set/" + internalId + " : " + childErr
                    );
                    return res.status(500).send({
                      status: 500,
                      message: childErr,
                    });
                  }

                  console.log("/equipment/set/" + internalId + " : Success");
                  return res.status(200).send({
                    status: 200,
                    setValue: setRetr[0],
                    equipment: equipRetr,
                    sets: childRetr,
                  });
                }
              );
            }
          );
        }
      );
    } catch (e) {
      console.error("/equipment/set/" + internalId + " : " + transactionErr);
      return res.status(500).send({
        status: 500,
        message: transactionErr,
      });
    }
  });
});

router.get("/set/:internal_id/:domain", isAuthenticated, (req, res) => {
  const internalId = req.params.internal_id;
  let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "/equipment/allCompany/" + req.params.domain + " : " + domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log(
          "/equipment/allCompany/" + req.params.domain + " : " + domainId
        );
      }

      console.log("/equipment/allCompanySets/" + req.params.domain);

      console.log("/equipment/set/" + internalId);

      db.beginTransaction((transactionErr) => {
        try {
          if (transactionErr) {
            console.error(
              "/equipment/set/" + internalId + " : " + transactionErr
            );
            return res.status(500).send({
              status: 500,
              message: transactionErr,
            });
          }

          db.query(
            "SELECT s.internal_id AS 'id', s.desc, s.equipment_count as 'count', s.equipment_value as 'value' FROM penguin_inspections.set s INNER JOIN company_set cs ON cs.set_id = s.id WHERE s.internal_id = ? AND cs.company_id = ?",
            [internalId, domainId],
            (setErr, setRetr) => {
              if (setErr) {
                console.error("/equipment/set/" + internalId + " : " + setErr);
                return res.status(500).send({
                  status: 500,
                  message: setErr,
                });
              }

              if (setRetr.length == 0 || setRetr.length > 1) {
                console.error(
                  "/equipment/set/" +
                    internalId +
                    " : Incorrect number of sets returned"
                );
                return res.status(500).send({
                  status: 500,
                  message: "Incorrect Set Count",
                });
              }

              db.query(
                "SELECT e.internal_id as 'external_id', e.id, e.name, e.serial, e.brand as 'manufacturer' FROM equipment e INNER JOIN set_equipment se ON se.equipment_id = e.id WHERE se.set_id = ?",
                [setRetr[0].id],
                (equipErr, equipRetr) => {
                  if (equipErr) {
                    console.error(
                      "/equipment/set/" + internalId + " : " + equipErr
                    );
                    return res.status(500).send({
                      status: 500,
                      message: equipErr,
                    });
                  }

                  db.query(
                    "SELECT s.internal_id as 'id', s.desc, s.equipment_count as 'count', s.equipment_value as 'value' FROM penguin_inspections.set s INNER JOIN set_set ss ON ss.child_set = s.id WHERE ss.parent_set = ?",
                    [setRetr[0].id],
                    (childErr, childRetr) => {
                      if (childErr) {
                        console.error(
                          "/equipment/set/" + internalId + " : " + childErr
                        );
                        return res.status(500).send({
                          status: 500,
                          message: childErr,
                        });
                      }

                      console.log(
                        "/equipment/set/" + internalId + " : Success"
                      );
                      return res.status(200).send({
                        status: 200,
                        setValue: setRetr[0],
                        equipment: equipRetr,
                        sets: childRetr,
                      });
                    }
                  );
                }
              );
            }
          );
        } catch (e) {
          console.error(
            "/equipment/set/" + internalId + " : " + transactionErr
          );
          return res.status(500).send({
            status: 500,
            message: transactionErr,
          });
        }
      });
    }
  );
});

router.post("/userAdd", isAuthenticated, (req, res) => {
  const {
    id,
    name,
    type,
    manufacturer,
    serial,
    price,
    colour,
    firstUseDate,
    retirementDate,
    fabricLength,
    fabricWidth,
  } = req.body;

  const userId = req.user.id;

  db.beginTransaction();

  try {
    db.query(
      "SELECT * FROM equipment INNER JOIN user_equipment ON equipment.id = user_equipment.equipment_id WHERE user_equipment.user_id = ? AND equipment.internal_id = ?",
      [userId, id],
      (fetchErr, fetchRetr) => {
        if (fetchErr) {
          console.error("/equipment/add : " + fetchErr);
          db.rollback();
          return res.status(500).json({
            status: 500,
            message: "Database Error Occurred",
          });
        }

        if (fetchRetr.length > 0) {
          console.log("/equipment/add : " + fetchRetr);
          db.rollback();
          return res.status(300).json({
            status: 300,
            message: "Item with the same Internal ID already exists",
          });
        } else {
          var today = new Date();

          var fabric_Length = -1.0;
          var fabric_Width = -1.0;
          if (fabricLength != "") {
            fabric_Length = parseFloat(fabricLength);
          }
          if (fabricWidth != "") {
            fabric_Width = parseFloat(fabricWidth);
          }

          db.query(
            "SELECT * from equipment_type WHERE id = ?",
            [type],
            (typeErr, typeRetr) => {
              if (typeErr) {
                console.error("/equipment/add : " + writeErr);
                db.rollback();
                return res.status(500).json({
                  status: 500,
                  message: "Database Error Occurred",
                });
              }

              db.query(
                "INSERT INTO equipment SET ?; SELECT LAST_INSERT_ID() AS LAST_INSERT_ID",
                [
                  {
                    internal_id: id,
                    name: name,
                    serial: serial,
                    colour: colour,
                    brand: manufacturer,
                    price: price,
                    type: typeRetr[0].id,
                    fabric_length: fabricLength,
                    fabric_width: fabricWidth,
                    price: price,
                    date_added: today.yyyymmdd(),
                    date_first_used: firstUseDate,
                    retirement_date: retirementDate,
                  },
                ],
                (writeErr, writeRetr) => {
                  if (writeErr) {
                    console.error("/equipment/add : " + writeErr);
                    db.rollback();
                    return res.status(500).json({
                      status: 500,
                      message: "Database Error Occurred",
                    });
                  }

                  if (writeRetr.length > 0) {
                    db.query(
                      "INSERT INTO user_equipment SET ?",
                      [
                        {
                          user_id: userId,
                          equipment_id: writeRetr[0].insertId,
                        },
                      ],
                      (userEqupErr) => {
                        if (userEqupErr) {
                          console.error("/equipment/add : " + userEqupErr);
                          db.rollback();
                          return res.status(500).json({
                            status: 500,
                            message: "Database Error Occurred",
                          });
                        }
                        db.commit();
                        return res.status(200).json({
                          status: 200,
                          message: "Item added successfully",
                        });
                      }
                    );

                    db.query(
                      "UPDATE users SET equipment_cost = equipment_cost + ? WHERE id = ?",
                      [price, userId],
                      (userErr) => {
                        if (userErr) {
                          db.rollback();
                          console.error("/equipment/add : " + userErr);
                          return res.status(500).json({
                            status: 500,
                            message: "Database Error Occurred",
                          });
                        }
                      }
                    );

                    db.query(
                      "UPDATE users SET equipment_count = equipment_count + 1 WHERE id = ?",
                      [userId],
                      (userErr) => {
                        if (userErr) {
                          db.rollback();
                          console.error("/equipment/add : " + userErr);
                          return res.status(500).json({
                            status: 500,
                            message: "Database Error Occurred",
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("/equipment/add : " + error.message);
    db.rollback;
    return res.status(500).json({
      status: 500,
      message: "An Unknown Error Occured",
    });
  }
});

router.post("/companyAdd/:domain", isAuthenticated, (req, res) => {
  const {
    id,
    name,
    type,
    manufacturer,
    serial,
    price,
    colour,
    firstUseDate,
    retirementDate,
    fabricLength,
    fabricWidth,
  } = req.body;

  let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "/equipment/item/" +
            req.params.internal_id +
            "/" +
            req.params.domain +
            " : " +
            domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log(
          "/equipment/item/" +
            req.params.internal_id +
            "/" +
            req.params.domain +
            " : " +
            domainId
        );
      }

      db.beginTransaction();

      try {
        db.query(
          "SELECT * FROM equipment INNER JOIN company_equipment ON equipment.id = company_equipment.equipment_id WHERE company_equipment.company_id = ? AND equipment.internal_id = ?",
          [domainId, id],
          (fetchErr, fetchRetr) => {
            if (fetchErr) {
              console.error("/equipment/add : check existing : " + fetchErr);
              db.rollback();
              return res.status(500).json({
                status: 500,
                message: "Database Error Occurred",
              });
            }

            if (fetchRetr.length > 0) {
              console.log("/equipment/add : existing true : " + fetchRetr);
              db.rollback();
              return res.status(300).json({
                status: 300,
                message: "Item with the same Internal ID already exists",
              });
            } else {
              var today = new Date();

              var fabric_Length = -1.0;
              var fabric_Width = -1.0;
              if (fabricLength != "") {
                fabric_Length = parseFloat(fabricLength);
              }
              if (fabricWidth != "") {
                fabric_Width = parseFloat(fabricWidth);
              }

              db.query(
                "SELECT * from equipment_type WHERE id = ?",
                [type],
                (typeErr, typeRetr) => {
                  if (typeErr) {
                    console.error("/equipment/add : get type : " + writeErr);
                    db.rollback();
                    return res.status(500).json({
                      status: 500,
                      message: "Database Error Occurred",
                    });
                  }

                  db.query(
                    "INSERT INTO equipment SET ?; SELECT LAST_INSERT_ID() AS LAST_INSERT_ID",
                    [
                      {
                        internal_id: id,
                        name: name,
                        serial: serial,
                        colour: colour,
                        brand: manufacturer,
                        price: price,
                        type: typeRetr[0].id,
                        fabric_length: fabricLength,
                        fabric_width: fabricWidth,
                        price: price,
                        date_added: today.yyyymmdd(),
                        date_first_used: firstUseDate,
                        retirement_date: retirementDate,
                      },
                    ],
                    (writeErr, writeRetr) => {
                      if (writeErr) {
                        console.error(
                          "/equipment/add : write equip : " + writeErr
                        );
                        db.rollback();
                        return res.status(500).json({
                          status: 500,
                          message: "Database Error Occurred",
                        });
                      }

                      if (writeRetr.length > 0) {
                        db.query(
                          "INSERT INTO company_equipment SET ?",
                          [
                            {
                              company_id: domainId,
                              equipment_id: writeRetr[0].insertId,
                            },
                          ],
                          (userEqupErr) => {
                            if (userEqupErr) {
                              console.error(
                                "/equipment/add : write to company : " +
                                  userEqupErr
                              );
                              db.rollback();
                              return res.status(500).json({
                                status: 500,
                                message: "Database Error Occurred",
                              });
                            }
                            db.commit();
                            return res.status(200).json({
                              status: 200,
                              message: "Item added successfully",
                            });
                          }
                        );

                        db.query(
                          "UPDATE company SET equipment_cost = equipment_cost + ? WHERE id = ?",
                          [price, domainId],
                          (userErr) => {
                            if (userErr) {
                              db.rollback();
                              console.error(
                                "/equipment/add : update company cost : " +
                                  userErr
                              );
                              return res.status(500).json({
                                status: 500,
                                message: "Database Error Occurred",
                              });
                            }
                          }
                        );

                        db.query(
                          "UPDATE company SET equipment_count = equipment_count + 1 WHERE id = ?",
                          [domainId],
                          (userErr) => {
                            if (userErr) {
                              db.rollback();
                              console.error(
                                "/equipment/add : update company equip count " +
                                  userErr
                              );
                              return res.status(500).json({
                                status: 500,
                                message: "Database Error Occurred",
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              );
            }
          }
        );
      } catch (error) {
        console.error("/equipment/add : overall error : " + error.message);
        db.rollback;
        return res.status(500).json({
          status: 500,
          message: "An Unknown Error Occured",
        });
      }
    }
  );
});

router.post("/userInspection", isAuthenticated, (req, res) => {
  const { id, form } = req.body;
  const { date, inspector, criteria, notes } = form;
  const userId = req.user.id;
  let status = 0;
  let nextInspectionModifier = 15778476000; //Milliseconds in 6 Months
  for (let i = 0; i < criteria.length; i++) {
    if (criteria[i][1] == 1 && status == 0) {
      nextInspectionModifier = 2628000000;
      status = 1;
    } else if (criteria[i][1] == 2 && status != 2) {
      nextInspectionModifier = 0;
      status = 2;
      break;
    }
  }
  db.beginTransaction();
  try {
    db.query(
      "SELECT e.id FROM penguin_inspections.equipment e INNER JOIN penguin_inspections.user_equipment ue on e.id = ue.equipment_id WHERE e.internal_id = ? AND ue.user_id = ?",
      [id, userId],
      (idErr, idResult) => {
        if (idErr) {
          console.log("/user/inspection/add : " + idErr.message);
          db.rollback();
          return res.status(500).json({
            status: 500,
            message: "Database Error Occurred",
          });
        }
        if (idResult.length > 0) {
          console.log(idResult[0].id);
          const trueEquipId = idResult[0].id;

          db.query(
            "INSERT INTO inspection SET ?",
            [
              {
                equipment_id: trueEquipId,
                status: status,
                inspector: inspector,
                date: date,
                next_date: new Date(
                  new Date(date).getTime() + nextInspectionModifier
                )
                  .toISOString()
                  .split("T")[0],
                details: notes,
              },
            ],
            (error) => {
              if (error) {
                console.log("/user/inspection/add : " + error.message);
                db.rollback();
                return res.status(500).json({
                  status: 500,
                  message: "Database Error Occurred",
                });
              }
              db.query(
                "SELECT LAST_INSERT_ID() AS LAST_INSERT_ID",
                (err, result) => {
                  if (result == null) {
                    console.log("/user/inspection/add : result not defined");
                    db.rollback();
                    return res.status(500).json({
                      status: 500,
                      message: "Database Error Occurred",
                    });
                  }

                  if (result.length > 0) {
                    db.query(
                      "INSERT INTO user_inspection SET ?; SELECT LAST_INSERT_ID() as LAST_INSERT_ID",
                      [
                        {
                          user_id: userId,
                          inspection_id: result[0].LAST_INSERT_ID,
                        },
                      ],
                      (usierr, usires) => {
                        if (usierr) {
                          console.log(
                            "/user/inspection/add usi : " + usierr.message
                          );
                          db.rollback();
                          return res.status(500).json({
                            status: 500,
                            message: "Database Error Occurred",
                          });
                        }
                        db.commit();
                        return res.status(200).json({
                          status: 200,
                          message: "Inspection created successfully",
                        });
                      }
                    );
                  }
                }
              );

              db.query(
                "UPDATE users SET inspections_count = inspections_count + 1 WHERE id = ?",
                [userId],
                (userErr) => {
                  if (userErr) {
                    db.rollback();
                    console.error(userErr);
                    return res.status(500).json({
                      status: 500,
                      message: "Database Error Occurred",
                    });
                  }
                }
              );
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("/user/inspection/add catch : " + error.message);
    db.rollback;
    return res.status(500).json({
      status: 500,
      message: "An Unknown Error Occured",
    });
  }
});

router.post("/companyInspection/:domain", isAuthenticated, (req, res) => {
  const { id, form } = req.body;
  const { date, inspector, criteria, notes } = form;
  const userId = req.user.id;
  let status = 0;
  let nextInspectionModifier = 15778476000; //Milliseconds in 6 Months
  for (let i = 0; i < criteria.length; i++) {
    if (criteria[i][1] == 1 && status == 0) {
      nextInspectionModifier = 2628000000;
      status = 1;
    } else if (criteria[i][1] == 2 && status != 2) {
      nextInspectionModifier = 0;
      status = 2;
      break;
    }
  }

  let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "//equipment/companyInspection/" +
            req.params.domain +
            " : " +
            domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log(
          "/equipment/companyInspection/" + req.params.domain + " : " + domainId
        );
      }

      db.beginTransaction();
      try {
        db.query(
          "SELECT e.id FROM penguin_inspections.equipment e INNER JOIN penguin_inspections.company_equipment ce on e.id = ce.equipment_id WHERE e.internal_id = ? AND ce.company_id = ?",
          [id, domainId],
          (idErr, idResult) => {
            if (idErr) {
              console.log(
                "/equipment/companyInspection/" +
                  req.params.domain +
                  " : " +
                  idErr.message
              );
              db.rollback();
              return res.status(500).json({
                status: 500,
                message: "Database Error Occurred",
              });
            }
            if (idResult.length > 0) {
              console.log(idResult[0].id);
              const trueEquipId = idResult[0].id;

              db.query(
                "INSERT INTO inspection SET ?",
                [
                  {
                    equipment_id: trueEquipId,
                    status: status,
                    inspector: inspector,
                    date: date,
                    next_date: new Date(
                      new Date(date).getTime() + nextInspectionModifier
                    )
                      .toISOString()
                      .split("T")[0],
                    details: notes,
                  },
                ],
                (error) => {
                  if (error) {
                    console.log(
                      "/equipment/companyInspection/" +
                        req.params.domain +
                        " : " +
                        error.message
                    );
                    db.rollback();
                    return res.status(500).json({
                      status: 500,
                      message: "Database Error Occurred",
                    });
                  }
                  db.query(
                    "SELECT LAST_INSERT_ID() AS LAST_INSERT_ID",
                    (err, result) => {
                      if (result == null) {
                        console.log(
                          "/equipment/companyInspection/" +
                            req.params.domain +
                            " : result not defined"
                        );
                        db.rollback();
                        return res.status(500).json({
                          status: 500,
                          message: "Database Error Occurred",
                        });
                      }

                      if (result.length > 0) {
                        db.query(
                          "INSERT INTO company_inspection SET ?; SELECT LAST_INSERT_ID() as LAST_INSERT_ID",
                          [
                            {
                              company_id: domainId,
                              inspection_id: result[0].LAST_INSERT_ID,
                              user_id: userId,
                            },
                          ],
                          (usierr, usires) => {
                            if (usierr) {
                              console.log(
                                "/equipment/companyInspection/" +
                                  req.params.domain +
                                  " : " +
                                  usierr.message
                              );
                              db.rollback();
                              return res.status(500).json({
                                status: 500,
                                message: "Database Error Occurred",
                              });
                            }
                            db.commit();
                            return res.status(200).json({
                              status: 200,
                              message: "Inspection created successfully",
                            });
                          }
                        );
                      }
                    }
                  );

                  db.query(
                    "UPDATE company SET inspections_count = inspections_count + 1 WHERE id = ?",
                    [userId],
                    (userErr) => {
                      if (userErr) {
                        db.rollback();
                        console.error(userErr);
                        return res.status(500).json({
                          status: 500,
                          message: "Database Error Occurred",
                        });
                      }
                    }
                  );
                }
              );
            }
          }
        );
      } catch (error) {
        console.error(
          "/equipment/companyInspection/" +
            req.params.domain +
            " : " +
            error.message
        );
        db.rollback;
        return res.status(500).json({
          status: 500,
          message: "An Unknown Error Occured",
        });
      }
    }
  );
});

router.post("/userEdit", isAuthenticated, (req, res) => {
  const {
    external_id,
    id,
    name,
    type,
    manufacturer,
    serial,
    price,
    colour,
    firstUseDate,
    retirementDate,
    fabricLength,
    fabricWidth,
  } = req.body;

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }

  db.beginTransaction((beginErr) => {
    if (beginErr) {
      console.error("Transaction begin failed:", beginErr);
      return res
        .status(500)
        .json({ status: 500, message: "Transaction failed" });
    }

    db.query(
      "SELECT * FROM user_equipment WHERE user_id = ? AND equipment_id = ?",
      [userId, external_id],
      (checkErr, checkRetr) => {
        if (checkErr || !checkRetr || checkRetr.length !== 1) {
          console.error(
            "user_equipment check failed:",
            checkErr || "Not found"
          );
          return db.rollback(() => {
            res.status(403).json({ status: 403, message: "Permission denied" });
          });
        }

        db.query(
          "SELECT * FROM equipment WHERE id = ?",
          [external_id],
          (fetchErr, fetchRetr) => {
            if (fetchErr || !fetchRetr || fetchRetr.length === 0) {
              console.error("equipment fetch failed:", fetchErr || "Not found");
              return db.rollback(() => {
                res
                  .status(404)
                  .json({ status: 404, message: "Equipment not found" });
              });
            }

            const existing = fetchRetr[0];
            const priceDifference =
              parseFloat(price) - parseFloat(existing.price || 0);

            const updateData = {
              internal_id: id,
              name,
              serial,
              colour,
              brand: manufacturer,
              price,
              type,
              fabric_length: fabricLength || -1,
              fabric_width: fabricWidth || -1,
              date_first_used: firstUseDate,
              retirement_date: retirementDate,
            };

            db.query(
              "UPDATE equipment SET ? WHERE id = ?",
              [updateData, external_id],
              (updateErr) => {
                if (updateErr) {
                  console.error("equipment update failed:", updateErr);
                  return db.rollback(() => {
                    res
                      .status(500)
                      .json({ status: 500, message: "Update failed" });
                  });
                }

                db.query(
                  "UPDATE users SET equipment_cost = equipment_cost + ? WHERE id = ?",
                  [priceDifference, userId],
                  (userErr) => {
                    if (userErr) {
                      console.error("user cost update failed:", userErr);
                      return db.rollback(() => {
                        res
                          .status(500)
                          .json({ status: 500, message: "User update failed" });
                      });
                    }

                    db.commit((commitErr) => {
                      if (commitErr) {
                        console.error("Commit failed:", commitErr);
                        return db.rollback(() => {
                          res
                            .status(500)
                            .json({ status: 500, message: "Commit failed" });
                        });
                      }

                      console.log("Update successful.");
                      return res
                        .status(200)
                        .json({ status: 200, message: "Success" });
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

router.post("/companyEdit/:domain", isAuthenticated, (req, res) => {
  const {
    external_id,
    id,
    name,
    type,
    manufacturer,
    serial,
    price,
    colour,
    firstUseDate,
    retirementDate,
    fabricLength,
    fabricWidth,
  } = req.body;

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }

  let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "//equipment/companyInspection/" +
            req.params.domain +
            " : " +
            domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log(
          "/equipment/companyInspection/" + req.params.domain + " : " + domainId
        );
      }

      db.beginTransaction((beginErr) => {
        if (beginErr) {
          console.error("Transaction begin failed:", beginErr);
          return res
            .status(500)
            .json({ status: 500, message: "Transaction failed" });
        }

        db.query(
          "SELECT * FROM company_equipment WHERE company_id = ? AND equipment_id = ?",
          [domainId, external_id],
          (checkErr, checkRetr) => {
            if (checkErr || !checkRetr || checkRetr.length !== 1) {
              console.error(
                "user_equipment check failed:",
                checkErr || "Not found"
              );
              return db.rollback(() => {
                res
                  .status(403)
                  .json({ status: 403, message: "Permission denied" });
              });
            }

            db.query(
              "SELECT * FROM equipment WHERE id = ?",
              [external_id],
              (fetchErr, fetchRetr) => {
                if (fetchErr || !fetchRetr || fetchRetr.length === 0) {
                  console.error(
                    "equipment fetch failed:",
                    fetchErr || "Not found"
                  );
                  return db.rollback(() => {
                    res
                      .status(404)
                      .json({ status: 404, message: "Equipment not found" });
                  });
                }

                const existing = fetchRetr[0];
                const priceDifference =
                  parseFloat(price) - parseFloat(existing.price || 0);

                const updateData = {
                  internal_id: id,
                  name,
                  serial,
                  colour,
                  brand: manufacturer,
                  price,
                  type,
                  fabric_length: fabricLength || -1,
                  fabric_width: fabricWidth || -1,
                  date_first_used: firstUseDate,
                  retirement_date: retirementDate,
                };

                db.query(
                  "UPDATE equipment SET ? WHERE id = ?",
                  [updateData, external_id],
                  (updateErr) => {
                    if (updateErr) {
                      console.error("equipment update failed:", updateErr);
                      return db.rollback(() => {
                        res
                          .status(500)
                          .json({ status: 500, message: "Update failed" });
                      });
                    }

                    db.query(
                      "UPDATE company SET equipment_cost = equipment_cost + ? WHERE id = ?",
                      [priceDifference, domainId],
                      (userErr) => {
                        if (userErr) {
                          console.error("user cost update failed:", userErr);
                          return db.rollback(() => {
                            res.status(500).json({
                              status: 500,
                              message: "User update failed",
                            });
                          });
                        }

                        db.commit((commitErr) => {
                          if (commitErr) {
                            console.error("Commit failed:", commitErr);
                            return db.rollback(() => {
                              res.status(500).json({
                                status: 500,
                                message: "Commit failed",
                              });
                            });
                          }

                          console.log("Update successful.");
                          return res
                            .status(200)
                            .json({ status: 200, message: "Success" });
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    }
  );
});

router.post("userFailedInspection", isAuthenticated, (req, res) => {
  const userId = req.user?.id;
  const id = req.body.id;
  
  db.beginTransaction((beginErr) => {
    try{
      if (beginErr) {
        console.log("Transaction begin failed: " + beginErr);
        return res
          .status(500)
          .json({ status: 500, message: "Transaction failed" });
      }

    db.query("SELECT * FROM user_equipment WHERE user_id = ? AND equipment_id = ?", [userId, id], 
      (dataErr, dataRetr) => {
      if (dataErr || !dataRetr || dataRetr.length !== 1) {
        console.error("user_equipment check failed:", dataErr || "Not found");
        return db.rollback(() => {
          res.status(403).json({ status: 403, message: "Permission denied" });
        });
      }

      if(dataRetr != 0)
      {
        db.query("SELECT * FROM inspection WHERE equipment_id = ? ORDER BY date DESC LIMIT 1", [id],
          (inspectionErr, inspectionRetr) => {
            if (inspectionErr || !inspectionRetr || inspectionRetr.length === 0) {
              console.error("inspection fetch failed:", inspectionErr || "Not found");
              return db.rollback(() => {
                res.status(404).json({ status: 404, message: "Inspection not found" });
              });
            }

          if(inspectionRetr.length > 0) {
            req.body.external_id = inspectionRetr[0].equipment_id;
            req.body.id = inspectionRetr[0].id;
            req.body.name = inspectionRetr[0].name;
            req.body.type = inspectionRetr[0].type;
            req.body.manufacturer = inspectionRetr[0].manufacturer;
            req.body.serial = inspectionRetr[0].serial;
            req.body.price = inspectionRetr[0].price;
            req.body.colour = inspectionRetr[0].colour;
            req.body.firstUseDate = inspectionRetr[0].first_use_date;
            req.body.retirementDate = new Date().yyyymmdd();
            req.body.fabricLength = inspectionRetr[0].fabric_length;
            req.body.fabricWidth = inspectionRetr[0].fabric_width;
          }
        });
      }
    });

    } catch(error){
      console.error("Error retrieving inspection data:", error);
      return db.rollback(() => {
        res.status(500).json({ status: 500, message: "Database Error Occurred" });
      })  
    };

  console.log("Inspection retrieval successful.");
  res.url = "/userEdit";
  next();
  });
});

router.post("companyFailedInspection/:domain", isAuthenticated, (req, res) => {
  const companyId = req.user?.id;
  const id = req.body.id;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }
  
    let domainId = 0;
  db.query(
    "SELECT id FROM company WHERE domain_name = ?",
    [req.params.domain],
    (domainErr, domainRes) => {
      if (domainErr) {
        console.log(
          "//equipment/companyInspection/" +
            req.params.domain +
            " : " +
            domainErr
        );
        return res.status(500).json({
          status: 500,
          message: "Domain Not Found",
        });
      }
      if (domainRes.length > 0) {
        domainId = domainRes[0].id;
        console.log(
          "/equipment/companyInspection/" + req.params.domain + " : " + domainId
        );
      }
  db.beginTransaction((beginErr) => {
    try{
      if (beginErr) {
        console.log("Transaction begin failed: " + beginErr);
        return res
          .status(500)
          .json({ status: 500, message: "Transaction failed" });
      }

    db.query("SELECT * FROM company_equipment WHERE company_id = ? AND equipment_id = ?", [domainId, id], 
      (dataErr, dataRetr) => {
      if (dataErr || !dataRetr || dataRetr.length !== 1) {
        console.error("user_equipment check failed:", dataErr || "Not found");
        return db.rollback(() => {
          res.status(403).json({ status: 403, message: "Permission denied" });
        });
      }

      if(dataRetr != 0)
      {
        db.query("SELECT * FROM inspection WHERE equipment_id = ? ORDER BY date DESC LIMIT 1", [id],
          (inspectionErr, inspectionRetr) => {
            if (inspectionErr || !inspectionRetr || inspectionRetr.length === 0) {
              console.error("inspection fetch failed:", inspectionErr || "Not found");
              return db.rollback(() => {
                res.status(404).json({ status: 404, message: "Inspection not found" });
              });
            }

          if(inspectionRetr.length > 0) {
            req.body.external_id = inspectionRetr[0].equipment_id;
            req.body.id = inspectionRetr[0].id;
            req.body.name = inspectionRetr[0].name;
            req.body.type = inspectionRetr[0].type;
            req.body.manufacturer = inspectionRetr[0].manufacturer;
            req.body.serial = inspectionRetr[0].serial;
            req.body.price = inspectionRetr[0].price;
            req.body.colour = inspectionRetr[0].colour;
            req.body.firstUseDate = inspectionRetr[0].first_use_date;
            req.body.retirementDate = new Date().yyyymmdd();
            req.body.fabricLength = inspectionRetr[0].fabric_length;
            req.body.fabricWidth = inspectionRetr[0].fabric_width;
          }
        });
      }
    });

    } catch(error){
      console.error("Error retrieving inspection data:", error);
      return db.rollback(() => {
        res.status(500).json({ status: 500, message: "Database Error Occurred" });
      })  
    };
  });

  console.log("Inspection retrieval successful.");
  res.url = "/userEdit";
  next();
  });
});

router.delete("/userDelete/:id", isAuthenticated, (req, res) => {
  const userId = req.user?.id;
  const id = req.params.id;

  db.beginTransaction((beginErr) => {
    try {
      if (beginErr) {
        console.log("Transaction begin failed: " + beginErr);
        return res
          .status(500)
          .json({ status: 500, message: "Transaction failed" });
      }

      db.query(
        "SELECT * FROM user_equipment WHERE user_id = ? AND equipment_id = ?",
        [userId, id],
        (checkErr, checkRetr) => {
          if (checkErr || !checkRetr || checkRetr.length !== 1) {
            console.error(
              "user_equipment check failed:",
              checkErr || "Not found"
            );
            return db.rollback(() => {
              res
                .status(403)
                .json({ status: 403, message: "Permission denied" });
            });
          }

          db.query(
            "SELECT * FROM equipment WHERE id = ?",
            [id],
            (fetchErr, fetchRetr) => {
              if (fetchErr || !fetchRetr || fetchRetr.length === 0) {
                console.error(
                  "equipment fetch failed:",
                  fetchErr || "Not found"
                );
                return db.rollback(() => {
                  res
                    .status(404)
                    .json({ status: 404, message: "Equipment not found" });
                });
              }

              const existing = fetchRetr[0];
              const priceDifference = 0 - parseFloat(existing.price || 0);

              db.query(
                "UPDATE users SET equipment_cost = equipment_cost + ? WHERE id = ?",
                [priceDifference, userId],
                (userErr) => {
                  if (userErr) {
                    console.error("user cost update failed:", userErr);
                    return db.rollback(() => {
                      res
                        .status(500)
                        .json({ status: 500, message: "User update failed" });
                    });
                  }

                  db.query(
                    "DELETE FROM user_equipment ue WHERE ue.equipmenet_id = ?",
                    [userId, existing.id],
                    (userEquipErr) => {
                      if (userEquipErr) {
                        console.error(
                          "User Equip Delete Error : " + userEquipErr
                        );
                        return db.rollback(() => {
                          res.status(500).json({
                            status: 500,
                            message: "User Equipment Deletion Failed",
                          });
                        });
                      }

                      db.query(
                        "DELETE FROM equipment e WHERE e.id = ?",
                        [existing.id],
                        (equipErr) => {
                          if (equipErr) {
                            console.error(
                              "Equipment deletion error : " + equipErr
                            );
                            return db.rollback(() => {
                              res.status(500).json({
                                status: 500,
                                message: "Equipment Deletion Failed",
                              });
                            });
                          }
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    } catch (endError) {
      return res
        .status(500)
        .json({ sataus: 500, message: "Transaction failed : " + endError });
    }
  });
});

router.delete(
  "/companyDelete/:internal_id/:domian",
  isAuthenticated,
  (req, res) => {
    console.log(
      "/equipment/companyDelete/" +
        req.params.internal_id +
        "/" +
        req.params.domian
    );

    let domainId = 0;
    db.query(
      "SELECT id FROM company WHERE domain_name = ?",
      [req.params.domain],
      (domainErr, domainRes) => {
        if (domainErr) {
          console.log(
            "//equipment/companyInspection/" +
              req.params.domain +
              " : " +
              domainErr
          );
          return res.status(500).json({
            status: 500,
            message: "Domain Not Found",
          });
        }
        console.log(domainRes);
        if (domainRes.length > 0) {
          domainId = domainRes[0].id;
          console.log(
            "/equipment/companyInspection/" +
              req.params.domain +
              " : " +
              domainId
          );
        }
        console.log(domainId);
        db.beginTransaction((beginErr) => {
          try {
            if (beginErr) {
              console.log("Transaction begin failed: " + beginErr);
              return res
                .status(500)
                .json({ status: 500, message: "Transaction failed" });
            }
            db.query(
              "SELECT e.* FROM company_equipment ce INNER JOIN equipment e ON e.id = ce.equipment_id WHERE ce.company_id = ? AND e.internal_id = ?",
              [domainId, req.params.internal_id],
              (fetchErr, fetchRetr) => {
                if (fetchErr || !fetchRetr || fetchRetr.length === 0) {
                  console.error(
                    "equipment fetch failed:",
                    fetchErr || "Not found"
                  );
                  return db.rollback(() => {
                    res.status(404).json({
                      status: 404,
                      message: "Equipment not found",
                    });
                  });
                }

                const existing = fetchRetr[0];
                const priceDifference = 0 - parseFloat(existing.price || 0);
                console.log(existing);

                db.query(
                  "UPDATE company SET equipment_cost = equipment_cost + ? WHERE id = ?",
                  [priceDifference, domainId],
                  (userErr) => {
                    if (userErr) {
                      console.error("user cost update failed:", userErr);
                      return db.rollback(() => {
                        res.status(500).json({
                          status: 500,
                          message: "User update failed",
                        });
                      });
                    }

                    db.query(
                      "DELETE FROM company_equipment ue WHERE ue.equipmenet_id = ?",
                      [domainId, existing.id],
                      (userEquipErr) => {
                        if (userEquipErr) {
                          console.error(
                            "User Equip Delete Error : " + userEquipErr
                          );
                          return db.rollback(() => {
                            res.status(500).json({
                              status: 500,
                              message: "User Equipment Deletion Failed",
                            });
                          });
                        }

                        db.query(
                          "DELETE FROM equipment e WHERE e.id = ?",
                          [existing.id],
                          (equipErr) => {
                            if (equipErr) {
                              console.error(
                                "Equipment deletion error : " + equipErr
                              );
                              return db.rollback(() => {
                                res.status(500).json({
                                  status: 500,
                                  message: "Equipment Deletion Failed",
                                });
                              });
                            }
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          } catch (endError) {
            return res.status(500).json({
              sataus: 500,
              message: "Transaction failed : " + endError,
            });
          }
        });
      }
    );
  }
);

module.exports = router;
