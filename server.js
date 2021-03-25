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
  original_url: String,
  short_url: String
});

let ShortUrl = mongoose.model('ShortUrl', urlSchema);

var createRandomUrl = () => {
  var random_string = Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5);
  return random_string;
  
};
console.log(createRandomUrl());

const createAndSaveUrl = (done) =>{
  let input = new ShortUrl({original_url: index.html['url_input'], short_url: createRandomUrl()});
  input.save((err,data)=>{
    if(err) return console.error(err);
    done(null,data);
  })
}


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



app.post('/api/shorturl/new',(req,res)=>{
  let string = req.body.url;
  res.json({url: string})
  console.log('post ' + string)
})




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


