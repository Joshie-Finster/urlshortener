require('dotenv').config({path: 'sample.env'});
const express = require('express');
const cors = require('cors');
const { mongo } = require('mongoose');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');


var original_url ='';
var short_url = '';
mongoose.connect(process.env.DB_URI,{useNewUrlParser: true, useUnifiedTopology: true});

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: String,
    required: true
  }
});

let ShortUrl = mongoose.model('ShortUrl', urlSchema);

var createRandomUrl = () => {
  var random_string = Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5);
  return random_string;
  
};



const findShortUrl = (shortUrl, done) =>{
  ShortUrl.findOne({short_url: shortUrl}, (err,foundUrl)=>{
    if (err) return console.log(err);
    done(null, foundUrl)
  });
};

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



app.post('/api/shorturl/new',(req,res)=>{
  let string = req.body.url;
  let randomNum = createRandomUrl();
  const record = new ShortUrl({original_url: string, short_url: randomNum });
  record.save()
  res.json({record})
  
})




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


