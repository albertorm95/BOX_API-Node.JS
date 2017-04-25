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
  clientID: '82z2pp4h0hg4avykdj75pw5yhej9iczd',
  clientSecret: 'V9bJ3BM2xTHt9Q1liJ3Lxudca1hpRmoK'
});
var client = sdk.getBasicClient('CcAdyE3X9cJMyOmZuPoL5BZmRQqPBzlu');

//Main Index
app.get('/', function (req, res) {
	client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
  	if(err) throw err;
  	res.render('home', {nombre : currentUser.name, tittle : "BOX SDK Node.JS Demo"});
	});
});

//GET description
app.get('/getFileInfo/:id', function (req, res){
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
	client.files.update(req.params.id, {description : 'TEST'}, function(err, file){
		if(err) throw err;
		res.render('getFileInfo', {file : file, tittle : "Get File Info"}, function(){
			console.log("updated.");
		});
	});
});

//Reverse Update
app.get('/updateFileInfoRestore/:id', function (req, res){
	client.files.update(req.params.id, {description : 'blank'}, function(err, file){
		if(err) throw err;
		res.render('getFileInfo', {file : file, tittle : "Get File Info"}, function(){
			console.log("updated.");
		});
	});
});

//Delete File
app.get('/deleteFile/:id', function (req, res){
	client.files.delete(req.params.id, function(err){
		if(err) throw err;
		console.log("deleted.");
	});
	client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
		if(err) throw err;
		res.render('home', {nombre : currentUser.name, tittle : "BOX SDK Node.JS Demo"});
	});
});

//Get Folder Items
app.get('/getFolderItems', function(req, res){
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
		res.render('uploadFile');
});


//Server Initialization
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});