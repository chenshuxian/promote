// server.js
const express = require("express");
const next = require("next");
const fs = require("fs");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const http = require("http");
const https = require("https");

var options = {
  key: fs.readFileSync("./sslkey/final/ssl/5000.kinmen.gov.tw.key"),
  cert: fs.readFileSync("./sslkey/final/ssl/5000.kinmen.gov.tw.crt"),
};

app.prepare().then(() => {
  const app = express();

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  var httpsServer = https.createServer(options, app);

  httpsServer.listen(8443, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${8443}`);
  });
});
