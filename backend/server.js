// Database Server

// External Dependencies
// // Server
const express = require("express");
const https = require("https");
const fs = require("fs");
const passport = require("passport");
const cors = require("cors");

// Internal Dependencies
const ensureSecure = require("./middleware/ensureSecure");
const datePrototype = require("./middleware/datePrototype");

// Routers
const assetRouter = require("./routers/assets");
const userRouter = require("./routers/users");
const authRouter = require("./routers/auth");
const equipmentRouter = require("./routers/equipment");
const rentRouter = require("./routers/rent");

// Express App Setup
const app = express();
//app.use(ensureSecure);
app.use(express.json());
app.use(express.static(__dirname));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://localhost:3000",
    credentials: true,
  })
);

// Passport Setup
require("./config/passport")(passport);
app.use(passport.initialize());

// SSL Certificate and Private Key
const privateKey = fs.readFileSync("ssl/key.pem", "utf8");
const certificate = fs.readFileSync("ssl/cert.pem", "utf8");

const FRONTEND_URL = process.env.FRONTEND_URL || "https://localhost:3000";
const BACK_HTTP_PORT = Number(process.env.BACK_HTTP_PORT) || 5001;
const BACK_HTTPS_PORT = Number(process.env.BACK_HTTPS_PORT) || 5000;
const SSL_PASSPHRASE = process.env.SSL_PASSPHRASE || "default_ssl_passphrase";

const credentials = { key: privateKey, passphrase: SSL_PASSPHRASE, cert: certificate };

// Create the HTTPS server
const httpsServer = https.createServer(credentials, app);

app.listen(BACK_HTTP_PORT, "0.0.0.0");

// Start HTTPS Server
httpsServer.listen(BACK_HTTPS_PORT, "0.0.0.0", () => {
  console.log("HTTPS Server running on port " + BACK_HTTPS_PORT);
});

// // Date Formatting Setup
Date.prototype.yyyymmdd = datePrototype;

// Default GET Requests
app.get("/", (req, res) => {
  var now = new Date();
  return res.send(
    "This is a REST API server for Penguin Inspections : " + now.yyyymmdd()
  );
});

app.get("/:universalURL", (req, res) => {
  return res.send({
    message: "ERROR: INVALID REQUEST",
  });
});

// Use Routers
app.use("/asset", assetRouter);
app.use("/equipment", equipmentRouter);
app.use("/rent", rentRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
