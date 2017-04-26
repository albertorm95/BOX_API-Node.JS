var express = require('express');
var path = require('path');
var BoxSDK = require('box-node-sdk');
var fs = require('fs');
var exphbs = require('express-handlebars');
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));


var sdk = new BoxSDK({
  clientID: 'clientID',
  clientSecret: 'clientSecret'
});
var client = sdk.getBasicClient('token');

//Main Index
app.get('/', function (req, res) {
	console.log("GET '/'");
	client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
  	if(err) throw err;
  	res.render('home', {nombre : currentUser.name, tittle : "BOX SDK Node.JS Demo"});
	});
});

//GET description
app.get('/getFileInfo/:id', function (req, res){
	console.log("GET '/getFileInfo/"+req.params.id+"'");
	client.files.get(req.params.id, null, function(err, file){
		if(err) throw err;
		client.files.getDownloadURL(req.params.id, null, function(err, downloadURL){
			if (err) throw err;
			res.render('getFileInfo', {file : file, tittle : "Get File Info", downloadLink : downloadURL });
		});
	});
});

//Update description
app.get('/updateFileInfo/:id', function (req, res){
	console.log("GET '/updateFileInfo/"+req.params.id+"'");
	client.files.update(req.params.id, {description : 'TEST'}, function(err, file){
		if(err) throw err;
		res.render('getFileInfo', {file : file, tittle : "Get File Info"});
	});
});

//Reverse Update
app.get('/updateFileInfoRestore/:id', function (req, res){
	console.log("GET '/updateFileInfoRestore/"+req.params.id+"'");
	client.files.update(req.params.id, {description : ''}, function(err, file){
		if(err) throw err;
		res.render('getFileInfo', {file : file, tittle : "Get File Info"});
	});
});

//Delete File
app.get('/deleteFile/:id', function (req, res){
	console.log("GET '/deleteFile/"+req.params.id+"'");
	client.files.delete(req.params.id, function(err){
		if(err) throw err;
		console.log("deleted.");
	});
	res.redirect('/');
});

//Get Folder Items
app.get('/getFolderItems', function(req, res){
	console.log("GET '/getFolderItems'");
	client.folders.getItems(
    '24995973944',
    {
        fields: 'name,modified_at,size,url,permissions,sync_state',
        offset: 0,
        limit: 25
    },
    function(err, file){
    	if (err) throw err;
			res.render('getFolderItems', {tittle : "Get Folder Items", files : file.entries});
    });
});

//Upload File
app.get('/uploadFile', function(req, res){
	console.log("GET '/uploadFile'");
	var stream = fs.createReadStream(req.query.path);
	client.files.uploadFile('24995973944', req.query.name, stream, function(err){
		if (err) throw err;
	});
	res.redirect('/');
});


//Server Initialization
app.listen(3000, function () {
  console.log('App listening on port 3000! - http://localhost:3000');
});