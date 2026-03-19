// Client Server

// External Dependencies
// // Server
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

// Internal Dependencies
const ensureSecure = require("./middleware/ensureSecure");
const datePrototype = require("./middleware/datePrototype");

// Routers
const authRouter = require("./routers/auth");
const dashboardRouter = require("./routers/dashboard");
const rentRouter = require("./routers/rent");
const equipmentRouter = require("./routers/equipment");
const rdRouter = require("./routers/rd");
const reactAddress = require("./middleware/reactAddress");
const { createProxyMiddleware } = require("http-proxy-middleware");
const apiAddress = require("./middleware/apiAddress");

// Express App Setup
const app = express();
app.use(ensureSecure);
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "clipboard-read=*, clipboard-write=*");
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "react-app", "dist"));
app.use("/assets", express.static(path.join(__dirname, "react-app", "dist", "assets")));
app.use("/.well-known", express.static(path.join(__dirname, ".well-known")));

// SSL Certificate and Private Key
const privateKey = fs.readFileSync("ssl/key.pem", "utf8");
const certificate = fs.readFileSync("ssl/cert.pem", "utf8");

const FRONT_HTTP_PORT = Number(process.env.FRONT_HTTP_PORT) || 3001;
const FRONT_HTTPS_PORT = Number(process.env.FRONT_HTTPS_PORT) || 3000;

const credentials = { key: privateKey, passphrase: process.env.SSL_PASSPHRASE || "emilia28012004", cert: certificate };

// Create the HTTPS server
const httpsServer = https.createServer(credentials, app);

app.listen(FRONT_HTTP_PORT, "0.0.0.0");

// Start HTTPS Server
httpsServer.listen(FRONT_HTTPS_PORT, "0.0.0.0", () => {
  console.log("HTTPS Server running on port " + FRONT_HTTPS_PORT);
  console.log("React address points to: " + reactAddress)
});

// // Date Formatting Setup
Date.prototype.yyyymmdd = datePrototype;

// Router Redirects
app.use(
  "/auth/google",
  createProxyMiddleware({
    target: apiAddress + "/auth/google",
    changeOrigin: true,
    secure: false, // True for Production
  })
);
app.use("/equipment", equipmentRouter);
app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/rent", rentRouter);
app.use("/rd", rdRouter);

app.use("/asset", createProxyMiddleware({
  target: apiAddress,
  changeOrigin: true,
  secure: false,
  pathRewrite: (path) => `/asset${path}`,
}));

// Specific GET Requests

app.get("/login/:type/:msg", (req, res) => {
  return res.render(reactAddress);
});

app.get("/terms_of_service", (req, res) => {
  return res.send("INSERT TERMS OF SERVICE HERE");
});

app.get("/privacy_policy", (req, res) => {
  return res.send("INSERT PRIVACY POLICY HERE");
});

// Default GET Requests
app.get("/ping", (req, res) => {
  var now = new Date();
  return res.send(
    "This is the Client server for Penguin Inspections : " + now.yyyymmdd()
  );
});

app.get("/", (req, res) => {
  return res.render(reactAddress);
})

app.get("/api/test", (req, res) => {
  fetch(apiAddress + "/").then((data) => {
    return res.send(data);
  })
})

app.get("/:universal", (req, res) => {
  return res.render(reactAddress);
  // return res.send({
  //     message: "ERROR: INVALID REQUEST"
  // });
});
