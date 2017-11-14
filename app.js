var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', {posts : null, error : null});  
});

// GET
app.get('/subreddit/*', function(req, res) {
  var sr = req.query.value;
  sr = sr.replace(" ", "%20");
  console.log('https://www.reddit.com/r/' + sr + '/top.json?limit=10');
  request({
    url: 'https://www.reddit.com/r/' + sr + '/top.json?limit=10',
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var resultsArray = [];
      var results = body.data.children;
      for (var i = 0; i < results.length; i++) {
        var entry = {};
        var title = results[i].data.title;
        var url = results[i].data.url;
        var ups = results[i].data.ups;
        entry.title = title;
        entry.url = url;
        entry.ups = ups;
        resultsArray.push(entry);
      }
      res.render('index', {posts : resultsArray, error : null});
    } else {
      console.log(response.statusCode);
      res.render('index', {posts: null, error : response.statusCode});
    }
  })
});

app.listen(port, () => console.log('Example app listening on port 3000! Updated.'));