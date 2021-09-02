// server.js
let FileStreamRotator = require("file-stream-rotator");
const express = require("express");
const next = require("next");
const fs = require("fs");
var morgan = require("morgan");
var path = require("path");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const http = require("http");
const https = require("https");

var options = {
  key: fs.readFileSync("./sslkey/final/5000.kinmen.gov.tw.key"),
  cert: fs.readFileSync("./sslkey/final/5000.kinmen.gov.tw.chained.crt"),
};

app.prepare().then(() => {
  const app = express();

  var logDirectory = path.join(__dirname, "log");

  // ensure log directory exists
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  // create a rotating write stream
  var accessLogStream = FileStreamRotator.getStream({
    date_format: "YYYYMMDD",
    filename: path.join(logDirectory, "access-%DATE%.log"),
    frequency: "daily",
    verbose: false,
  });

  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  var httpsServer = https.createServer(options, app);

  httpsServer.listen(8443, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${8443}`);
  });
});
