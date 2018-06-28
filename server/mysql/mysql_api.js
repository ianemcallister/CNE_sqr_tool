/*
*	MYSQL API 
*
*	This module fasciliates mysql operations in the program
*/

//define dependencies
var mysql 	= require('mysql');

var _db = mysql.createConnection(/*add this here*/);

//define module
var mysql_api = {
	_connection: {
		start: start_connection,
		end: end_connection,
		load_db: load_db
	},
	create: {
		records: create_records
	},
	read: {
		records: read_records
	}, 
	update: {},
	del: {}
};

function start_connection() {
	//connect to the db
	_db.connect(function(err){
		//test for error
		if(err){
			console.log('Error connecting to Db');
		} else {
			console.log('Connection established');
		};

	});
};

function end_connection() {
	//exit the db
	_db.end(function(err) {
	  // The connection is terminated gracefully
	  // Ensures all previously enqueued queries are still
	  // before sending a COM_QUIT packet to the MySQL server.
	  if(err) console.log('err: ', err);
	  else console.log('Terminated done: ');
	});
};

function load_db(db) {
	//define local variables
	_db.query('USE ' + db + ';', function (err, result) {
		if (err) throw err;

		//console.log("Result: ", result);
	});
};
//
function create_records(table, col, data) {};

//
function read_records(table, col, filter) {
	//define local variables
	var self = this;

	//open db connection
	_db.connect();

	//designate database
	self._connection.load_db('test');

	//send the query
	_db.query('SHOW TABLES;', function (err, result) {
		if (err) throw err;

		console.log("Result: ", result);
	});

	//close db connection
	_db.end();
};

//return the module
module.exports = mysql_api;