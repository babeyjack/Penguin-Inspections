const express = require("express");
const apiAddress = require("../middleware/apiAddress");
const router = express.Router();

router.get("/:equipRequest", (req, res) => {
  console.log("/equipment" + req.url);
  fetch(apiAddress + "/equipment/" + req.params.equipRequest, {
    method: "GET",
    headers: { Authorization: `Bearer ${req.cookies.token}` },
    credentials: "include",
  })
    .then((r) => r.json())
    .then((data) => res.status(200).json(data))
    .catch((err) =>
      res.status(500).json({ status: 500, message: "Proxy Failed" })
    );
});

router.get("/:equipRequest/:param", (req, res) => {
  console.log("/equipment" + req.url);

  if(req.params.param == "-1")
  {
    return res.status(200).json({status: 500, message: "Invlalid paramter"})
  }

  fetch(
    apiAddress +
      "/equipment/" +
      req.params.equipRequest +
      "/" +
      req.params.param,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${req.cookies.token}` },
      credentials: "include",
    }
  )
    .then((r) => r.json())
    .then((data) => res.status(200).json(data))
    .catch((err) =>
      res.status(500).json({ status: 500, message: "Proxy Failed" })
    );
});

router.get("/:equipRequest/:param/:domain", (req, res) => {

  if(req.params.param == "-1")
  {
    return res.status(200).json({status: 500, message: "Invlalid paramter"})
  }

  console.log("/equipment" + req.url);
  fetch(
    apiAddress +
      "/equipment/" +
      req.params.equipRequest +
      "/" +
      req.params.param + 
      "/" + 
      req.params.domain,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${req.cookies.token}` },
      credentials: "include",
    }
  )
    .then((r) => r.json())
    .then((data) => res.status(200).json(data))
    .catch((err) =>
      res.status(500).json({ status: 500, message: "Proxy Failed" })
    );
});

router.post("/:equipRequest", (req, res) => {
  console.log("/equipment" + req.url);
  // WARNING: this disables cert verification - for local dev ONLY
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  fetch(apiAddress + "/equipment/" + req.params.equipRequest, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.cookies.token}`,
    },
    body: JSON.stringify(req.body),
  })
    .then((r) => r.json())
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error("/equipment" + req.url + " : " + err);
      res.status(500).json({ status: 500, message: "Proxy Failed" });
    });
});

router.post("/:equipRequest/:param", (req, res) => {

  if(req.params.param == "-1")
  {
    return res.status(200).json({status: 500, message: "Invlalid paramter"})
  }

  console.log("/equipment" + req.url);
  // WARNING: this disables cert verification - for local dev ONLY
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  fetch(apiAddress + "/equipment/" + req.params.equipRequest + "/" + req.params.param, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.cookies.token}`,
    },
    body: JSON.stringify(req.body),
  })
    .then((r) => r.json())
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error("/equipment" + req.url + " : " + err);
      res.status(500).json({ status: 500, message: "Proxy Failed" });
    });
});

router.put("/:equipRequest", (req, res) => {
  console.log("/equipment" + req.url);
  // WARNING: this disables cert verification - for local dev ONLY
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  fetch(apiAddress + "/equipment/" + req.params.equipRequest, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.cookies.token}`,
    },
    body: JSON.stringify(req.body),
  })
    .then((r) => r.json())
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error("/equipment" + req.url + " : " + err);
      res.status(500).json({ status: 500, message: "Proxy Failed" });
    });
});

router.delete("/:equipRequest/:param", (req, res) => {
  
  if(req.params.param == "-1")
  {
    return res.status(200).json({status: 500, message: "Invlalid paramter"})
  }
  
  console.log("/equipment" + req.url);
  fetch(
    apiAddress +
      "/equipment/" +
      req.params.equipRequest +
      "/" +
      req.params.param,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${req.cookies.token}` },
      credentials: "include",
    }
  )
    .then((r) => r.json())
    .then((data) => res.status(200).json(data))
    .catch((err) =>
      res.status(500).json({ status: 500, message: "Proxy Failed" })
    );
});

router.delete("/:equipRequest/:param/:domain", (req, res) => {
  if(req.params.param == "-1")
  {
    return res.status(200).json({status: 500, message: "Invlalid paramter"})
  }

  console.log("/equipment" + req.url);
  fetch(
    apiAddress +
      "/equipment/" +
      req.params.equipRequest +
      "/" +
      req.params.param + 
      "/" + 
      req.params.domain,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${req.cookies.token}` },
      credentials: "include",
    }
  )
    .then((r) => r.json())
    .then((data) => res.status(200).json(data))
    .catch((err) =>
      res.status(500).json({ status: 500, message: "Proxy Failed" })
    );
});

module.exports = router;
