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
var sqrtxs 		= require('./square/ahnuts_sqr_tx_sync.js');
var slsdayfns	= require('./cne/ahnuts_sales_days_fn.js');

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
serverApp.get('/', function(req, res) {
	//return an affirmative status code
	res.sendStatus(200);
});

/*
*	POST Declarations
*/
//square payment webhooks
serverApp.post('/sqrwebhook', function(req, res) {
	
	//advise of the post body
	console.log(req.body);

	//run the requird function
	sqrtxs.push_requests(req.body);

	//return an affirmative status code
	res.sendStatus(200);

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

