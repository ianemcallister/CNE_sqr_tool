/*
*	COMMAND LINE INTERFACE
*
*	This is the command line interface for testing out various methods
*/

//declare dependencies
var cne				= require('./cne/cne.js');
//var mysql 			= require('./mysql/mysql_api.js');
//var square 			= require('./square/sqr_api.js');
//var templatizer 	= require('./template_engine/templateizer.js');
var stdio			= require('./stdio/stdio_api.js');
//var sqrdata			= require('./square/sqr_data_api.js');
//var locations_mysql = require('./mysql/query_builder.js');
//var squareV1		= require('./square/v1_api.js');
//var ahnutsSqSync	= require('./square/ahnuts_sqr_tx_sync.js');
var firebase		= require('./firebase/firebase.js');
var customerFns		= require('./cne/ahnuts_customers_fn.js'); 
//var calendarFns		= require('./cne/ahnuts_calender_fn.js'); 

customerFns.add.customers(stdio.read.json('./models/customers.json'));

//var calObject = calendarFns.add.date_range("2018-01-01", "2018-12-31");

/*firebase.create('calender/2018', calObject).then(function success(s) {
	console.log('success', s);
}).catch(function error(e) {
	console.log("error", e);
})*/

//ahnutsSqSync.push_requests({ entity_id: 'PzGUikmYpROMkDuGal6XLQB', event_type: 'PAYMENT_UPDATED', merchant_id: 'FCGJQY3GC9BNW', location_id: 'M53KQT35YKE5C' });


