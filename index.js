require("dotenv").config();
const express = require("express");
const dns = require("dns");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

let shortURLCounter = 1;
app.post("/api/shorturl", function (req, res) {
  const url = new URL(req.body.url);
  console.log({
    params: req.body.url,
    url,
  });
  dns.lookup(url.host, (err) => {
    if (!err) {
      shortURLCounter++;
      return res.json({
        original_url: req.body.url,
        short_url: shortURLCounter,
      });
    }
    console.log("err", err);
    res.json({ error: "Invalid URL" });
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
