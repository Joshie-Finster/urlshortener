require("dotenv").config({ path: "sample.env" });
const express = require("express");
const cors = require("cors");
const { mongo } = require("mongoose");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

var original_url = "";
var short_url = "";
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

let urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
  },
  short_url: {
    type: String,
  },
});

let ShortUrl = mongoose.model("ShortUrl", urlSchema);

var createRandomUrl = () => {
  var random_string =
    Math.random().toString(32).substring(2, 5) +
    Math.random().toString(32).substring(2, 5);
  return random_string;
};

const findShortUrl = (shortUrl, done) => {
  ShortUrl.findOne({ short_url: shortUrl }, (err, foundUrl) => {
    if (err) return console.log(err);
    done(null, foundUrl);
  });
};

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl/new", async function (req, res) {
  let string = req.body.url;
  let randomNum = createRandomUrl();

  let urlRegex = new RegExp(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
  );

  if (!string.match(urlRegex)) {
    console.log("invalid URL");
    res.json({ error: "Invalid URL" });
  } else {
    try {
      let search = await ShortUrl.findOne({ original_url: string });
      if (search) {
        console.log(string)
        console.log("found in database");
        res.json({
          original_url: search.original_url,
          short_url: search.short_url,
        });
      } else {
        console.log("not in database");
        res.json({ url: "not in database" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("Server error");
    }
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
