var Sync = {};
module.exports = Sync;

var fs = require('fs');
var util = require('util');
var AWS = require('aws-sdk'); 

var config = require('../config/config.json');
AWS.config.loadFromPath(config.awsconfig);

var s3 = new AWS.S3();

//listBuckets();
putFile();

function readDir(path) {
	fs.readdir(path, function(err, files) {
		
		for(var i = 0;i < files.length;i++) {
			var fileName = path + files[i];
			
			if(include(fileName))
				checkFile(fileName);
		}
	});
}

function include(fileName) {
	for(var i = 0;i < config.ignore.length;i++) {
		if(fileName.indexOf(config.ignore[i]) >= 0)
			return false;
	}
	return true;
}

function checkFile(fileName) {
	fs.lstat(fileName, function(err, stats){
		if(err)
			console.log(err);
		else {
			if(stats.isDirectory()) {
				console.log("[" + fileName + "]");
				readDir(fileName + "/");
			}
			else {
				console.log(fileName + ": "+ stats.size + "," + stats.isSymbolicLink() + "," + stats.isDirectory());
			}
		}
	});	
}

function listBuckets() {
	s3.listBuckets({}, function(err, data){
		console.log(data);
	}
	);
}

function putFile() {
	var obj = {};
	obj.ACL = "private";
	obj.Key = "files/set1/temp/nils-holgersson-02.jpg";
	obj.Bucket = "d28d76a0-97e8-11e3-a5e2-0800200c9a66";
	
	fs.readFile("c:/temp/nils-holgersson-02.jpg", function(err, data){
		obj.Body = data;
		
		s3.putObject(obj, function(err, data){
			if(err)
				console.log(err);
			else
				console.log(data);
		});
	});
}