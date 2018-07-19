/*
*	COMMAND LINE INTERFACE
*
*	This is the command line interface for testing out various methods
*/

//declare dependencies
var helper 		= require('./helpers/cli_helpers.js');


//read through all transactions

//testing single tx id
//helper.tests.single_tx_sync('fzi2LA0K4aFb2bdt5iFnLQB', 'M53KQT35YKE5C');

//helper.ops.allTx();

var locationsList = helper.stdio.read.json('./models/locations.json');
var locationsArray = []
var writePath = "/reference_lists/sqr_locations";

//run throuh locations
locationsList['locations'].forEach(function(location) {
	
	if(location.status!="INACTIVE") {
		var locationObject = {
			sqr_id: location.id,
			name: location.name,
			address: location.address,
		};



		locationsArray.push(helper.firebase.push(writePath, locationObject));
	}


});

Promise.all(locationsArray).then(function success(s) {
	console.log('success', s);
}).catch(function error(e) {
	console.log("error", e);
})