/*
*	SQUARE TOOLS SERVER APPLICATION
*
*	This script is the server for CNE SQUARE TOOLS APPLICATION.
*/

console.log('runnign the server');

//declare all dependencies
var express		= require('express');
var bodyParser 	= require('body-parser');

//update this later but goo dfor now
//var sqrtxs 		= require('./square/ahnuts_sqr_tx_sync.js');
//var slsdayfns	= require('./cne/ahnuts_sales_days_fn.js');
var CNE 		= require('./cne/maintenance.js');

//return the express object
var serverApp = express();

//environment variables
var port = process.env.PORT || 3000;

//get the URL encoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

/*
*	USE Declarations
*
*/
//define our body parsers
serverApp.use(jsonParser); // for parsing application/json
serverApp.use(urlencodedParser); // for parsing application/x-www-form-urlencoded

//serve up a static asset
serverApp.use(express.static('dist'));

//define our body parsers
serverApp.use(jsonParser); // for parsing application/json
serverApp.use(urlencodedParser); // for parsing application/x-www-form-urlencoded

//track URL requests
serverApp.use('/', function(req, res, next) {
	//log the url to the console
	console.log('Request Url: ' + req.url);

	next();
});

/*
*	GET Declarations
*/
//	GET: ROOT 
serverApp.get('/', function(req, res) {
	//return an affirmative status code
	res.sendStatus(200);
});

//	GET: /API/
serverApp.get('/api/sync/transactions', function(req, res) {
	
	//run the requird function
	CNE.transactions.sync.ahNuts_to_Square('batch').then(function success(s) {
		
		//return an affirmative status code
		res.sendStatus(200);

	}).catch(function error(e) {
		
		//return an error status code
		res.sendStatus(550);

	});
	
});

/*
*	POST Declarations
*/
//square payment webhooks
serverApp.post('/sqrwebhook', function(req, res) {
	
	//advise of the post body
	console.log(req.body);

	//run the requird function
	CNE.transactions.sync.ahNuts_to_Square('single', req.body).then(function success(s) {
		
		//return an affirmative status code
		res.sendStatus(200);

	}).catch(function error(e) {
		
		//return an error status code
		res.sendStatus(550);
		
	});

});


//	POST: SQUARE TRANSACTIONS 
serverApp.post('/squarepos/txs', function(req, res) {
	//return an affirmative status code
	CNE.txs.download.from_square.by_device(req.body.location, req.body.start, req.body.end).then(function success(s) {

		//console.log(s, 'got a response');
		res.setHeader('Content-Type', 'application/json');
    	res.status(200);
    	res.send(JSON.stringify(s));

	}).catch(function error(e) {
		res.sendStatus(550);
	});
	
});

//	POST: SQUARE EMPLOYEES 
serverApp.post('/squarepos/employees', function(req, res) {
	//return an affirmative status code
	CNE.square.employees.list(req.body.status, req.body.external_id, req.body.limit, req.body.order, req.body.begin_updated_at, req.body.end_updated_at, req.body.begin_created_at, req.body.end_created_at).then(function success(s) {

		//console.log(s, 'got a response');
		res.setHeader('Content-Type', 'application/json');
    	res.status(200);
    	res.send(JSON.stringify(s));

	}).catch(function error(e) {
		res.sendStatus(550);
	});
	
});

//	POST: SQUARE EMPLOYEES 
serverApp.post('/squarepos/locations', function(req, res) {
	//return an affirmative status code
	CNE.square.locations.list().then(function success(s) {

		//console.log(s, 'got a response');
		res.setHeader('Content-Type', 'application/json');
    	res.status(200);
    	res.send(JSON.stringify(s));

	}).catch(function error(e) {
		res.sendStatus(550);
	});
	
});

//	BATCH REQUEST FOR NEW SALES DAYS
serverApp.post('/api/sales_days/compile_new_sales_days_batch', function(req, res) {
	
	//advise of the post body
	console.log(req.body);

	//run the requird function
	var returnArray = slsdayfns.compile.new_sales_days_batch(req.body);

	//return an affirmative status code
	res.status(200);
	res.send(returnArray);


});

/*
*	Opening Up the server
*/
//open the port for local development
serverApp.listen(port,function() {
	//display the port
	console.log('Express server is up and running on port ' + port);
	//identify the environment
	if(process.env.IS_PROUDCTION == 'true') console.log('is production')
		else console.log('is development')
});

