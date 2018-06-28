/*
*	STANDARD INPUT/OUTPUT API 
*
*	This module fasciliates write and reading of files on the server
*/

//define dependencies
var fs 		= require('fs');
var path 	= require('path');

//define module
var stdio_api = {
	read: {
		string: read_string,
		json: read_json
	},
	write: {
		json: write_json
	}
};

//READ STRING
function read_string(filepath) {
	//define local variables
	var readpath = path.join(__dirname, '..', filepath);

	var file = fs.readFileSync(readpath, 'utf8');

	return file;
};

//READ JSON
function read_json(filepath) {
	//define local variables
	var readpath = path.join(__dirname, '..', filepath);

	var file = fs.readFileSync(readpath, 'utf8');

	return JSON.parse(file);
};

//WRITE JSON
function write_json(data, filepath) {
	//define local variables
	var writepath = path.join(__dirname, '..', filepath);

	fs.writeFile(writepath, JSON.stringify(data, null, '\t'), 'utf8', function (err) {
		if (err) {
		    return console.log(err);
		}

		console.log("The file was saved!");	
	});
};

//return the module
module.exports = stdio_api;
