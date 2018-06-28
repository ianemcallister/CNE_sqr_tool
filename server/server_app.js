/*
*	SQUARE TOOLS SERVER APPLICATION
*
*	This script is the server for CNE SQUARE TOOLS APPLICATION.
*/

console.log('runnign the server');

//declare all dependencies
var express		= require('express');
var bodyParser 	= require('body-parser');

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

	//return an affirmative status code
	res.sendStatus(200);

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

