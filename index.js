require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urls = [];
let shortURLCounter = 0;

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const short_url = parseInt(req.params.short_url);
  const findurl = urls.find((url) => url.short_url === short_url);
  if (findurl) {
    res.redirect(findurl.original_url);
  } else {
    return res.json({
      error: "not found",
    });
  }
});

app.post("/api/shorturl", function (req, res) {
  const url = new URL(req.body.url);
  dns.lookup(url.host, (err) => {
    if (!err) {
      shortURLCounter++;
      const urlJson = {
        original_url: req.body.url,
        short_url: shortURLCounter,
      };
      urls.push(urlJson);
      return res.json(urlJson);
    }
    res.json({ error: "Invalid URL" });
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
