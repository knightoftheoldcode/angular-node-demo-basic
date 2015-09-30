// server.js

// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var Sequelize = require('sequelize');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var md = require('markdown-it')();

// configuration =================

var sequelize = new Sequelize('postgres://curtis:curtis@localhost/squire', {});

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define models ==

var Post = sequelize.define('post', {
	source: {
		type: Sequelize.TEXT
	},
	output: {
		type: Sequelize.TEXT
	}
})

Post.sync({force: true}).then(function () {
	var source = 'This *is* __markdown__.';
	
	return Post.create({		
		source: source,
		output: md.render(source)
	});
});

// routes ==

// application --
app.get('/', function(req, res) {
	res.sendfile('./public/index.html');
});

// api --
// get all users
app.get('/api/1.0/posts', function(req, res) {
	Post.findAll().then(function(posts) {
		res.json(posts);
	}, function(err) {
		res.send(err);
	});
});

// create and send back user
app.post('/api/1.0/posts', function(req, res) {
	var source = req.body.source;
	var output = md.render(source);
	
	// console.log('firstName:' + firstName);
	
	Post.create({source: source, output: output}).then(function(post) { res.json(post) });
});

// update and send back a user
app.delete('/api/1.0/posts/:post_id', function(req, res) {
	var postId = req.params.post_id;
	
	Post.destroy({where: {id: postId}}).then(res.json({ message: 'Post deleted'}));
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
