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
var sqrdata			= require('./square/sqr_data_api.js');
//var locations_mysql = require('./mysql/query_builder.js');
var squareV1		= require('./square/v1_api.js');

//get the employee list from square
//cne.update.table.products();

/*
var products = stdio.read.json('models/products.json');
var idProductsList = sqrdata.products.sqr_to_sql(products);
stdio.write.json(idProductsList, "models/id_products_list.json");
*/

//var txs = stdio.read.json('models/tickets_test.json');

//var anTickets = sqrdata.transactions.to_object(txs);

//break out the transactions by device
//var selection = sqrdata.selection.filter(txs, "DEVICE_INSTALLATION_ID:51DB5448-E1D5-452D-AC02-4E7D97DE4286", "2018-05-02T16:56:30Z", "2018-05-03T20:16:44Z");

//then generate a report
//var mfgReport = selection.length;

//console.log(mfgReport);

squareV1.webhooks.list(["PAYMENT_UPDATED"]).then(function success(s) {

	console.log('got this back');
	console.log(s);

}).catch(function error(e) {
	console.log('there was an error', e);
});

/*squareV1.locations.list().then(function success(s) {
	console.log('success', s);
}).catch(function error(e) {
	console.log('error', e);
});*/

