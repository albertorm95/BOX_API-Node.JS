var express = require('express');
var path = require('path');
var BoxSDK = require('box-node-sdk');
var app = express();

var sdk = new BoxSDK({
  clientID: 'Your clientID',
  clientSecret: 'Your clientSecret'
});
var client = sdk.getBasicClient('Your Token');

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

//Main Index
app.get('/', function (req, res) {
	client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
  	if(err) throw err;
  	console.log('Hello, ' + currentUser.name + '!');
	})
  res.sendFile(path.join(__dirname + '/index.html'));
});

//GET description
app.get('/getFileInfo', function (req, res){
	client.files.get('162990794867', null, function(err, res){
		if(err) throw err;
		console.log(res.description);
	});
	res.sendFile(path.join(__dirname + '/getFileInfo.html'));
});

//Update description
app.get('/putFileInfo', function (req, res){
	client.files.update('162990794867', {description : 'This is a BOX API Test'}, function(err, res){
		if(err) throw err;
		console.log("File updated to: \"" +  res.description + "\"");
	});
	res.sendFile(path.join(__dirname + '/putFileInfo.html'));
});

//Reverse Update
app.get('/back', function (req, res){
	client.files.update('162990794867', {description : 'blank'}, function(err, res){
		if(err) throw err;
		console.log("File updated to: \"" +  res.description + "\"");
	});
	res.sendFile(path.join(__dirname + '/putFileInfo.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});