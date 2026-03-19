const express = require("express");
const apiAddress = require("../middleware/apiAddress");
const router = express.Router();

router.get("/:rentRequest", (req, res) => {
  console.log("/rent" + req.url);
  fetch(apiAddress + "/rent/" + req.params.rentRequest, {
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

router.get("/:rentRequest/:param", (req, res) => {
  console.log("/rd" + req.url);

  if(req.params.param == "-1")
  {
    return res.status(200).json({status: 500, message: "Invlalid paramter"})
  }

  fetch(
    apiAddress +
      "/rent/" +
      req.params.rentRequest +
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

router.get("/:rentRequest/:param/:domain", (req, res) => {

  if(req.params.param == "-1")
  {
    return res.status(200).json({status: 500, message: "Invlalid paramter"})
  }

  console.log("/rd" + req.url);
  fetch(
    apiAddress +
      "/rent/" +
      req.params.rentRequest +
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

router.post("/:rentRequest", (req, res) => {
  console.log("/rd" + req.url);
  // WARNING: this disables cert verification - for local dev ONLY
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  fetch(apiAddress + "/rent/" + req.params.rentRequest, {
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
      console.error("/rd" + req.url + " : " + err);
      res.status(500).json({ status: 500, message: "Proxy Failed" });
    });
});

router.post("/:rentRequest/:param", (req, res) => {

  if(req.params.param == "-1")
  {
    return res.status(200).json({status: 500, message: "Invlalid paramter"})
  }

  console.log("/rd" + req.url);
  // WARNING: this disables cert verification - for local dev ONLY
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  fetch(apiAddress + "/rent/" + req.params.rentRequest + "/" + req.params.param, {
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
      console.error("/rd" + req.url + " : " + err);
      res.status(500).json({ status: 500, message: "Proxy Failed" });
    });
});

router.put("/:rentRequest", (req, res) => {
  console.log("/rd" + req.url);
  // WARNING: this disables cert verification - for local dev ONLY
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  fetch(apiAddress + "/rent/" + req.params.rentRequest, {
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
      console.error("/rd" + req.url + " : " + err);
      res.status(500).json({ status: 500, message: "Proxy Failed" });
    });
});

router.delete("/:rentRequest/:param", (req, res) => {
  
  if(req.params.param == "-1")
  {
    return res.status(200).json({status: 500, message: "Invlalid paramter"})
  }
  
  console.log("/rd" + req.url);
  fetch(
    apiAddress +
      "/rent/" +
      req.params.rentRequest +
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

router.delete("/:rentRequest/:param/:domain", (req, res) => {
  if(req.params.param == "-1")
  {
    return res.status(200).json({status: 500, message: "Invlalid paramter"})
  }

  console.log("/rd" + req.url);
  fetch(
    apiAddress +
      "/rent/" +
      req.params.rentRequest +
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
