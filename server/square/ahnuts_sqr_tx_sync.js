/*
*	AH-NUTS SQUARE TRANSACTION SYNC 
*
*	This module is a connection between the ah-nuts databse and square.  It handles 
*	all function around syncing transactions between the two databses.
*/

//define dependencies
var v1_api_sqr = require('./v1_api.js');

//define module
var an_sqr_tx_sync = {
	batch_requests: batch_requests,
	push_requests: push_requests,
	single_tx_sync: single_tx_sync
};

/*
*	MISC FUNCTIONS
*/
// SINGLE TRANSACTION SYNC
function single_tx_sync(entity_id, location_id) {
	//define local variables
	var newtx = {};

	//download tx from square
	v1_api_sqr.payments.retrieve(entity_id, location_id).then(function success(s) {

		//check for reference transaction status

		//saving the transaction happens regardless
		
		//if is a reference transaction....
		//if is NOT a reference transaction...
			//

	}).catch(function error(e) {
		console.log('error', e);
	});

	//
};

/*
*	BATCH REQUESTS
*/
function batch_requests() {}

/*
*	PUSH REQUESTS
*/
function push_requests(pushObject) {
	//define local variables
	var entity_id = pushObject.entity_id;
	var location_id = pushObject.location_id;
	var pushCase = { "PAYMENT_UPDATED": 1 };

	//handle the appropriate case
	switch(pushCase[pushObject.event_type]) {
		case 1:
			//payment updated
			single_tx_sync(entity_id, location_id);
			break;
		case 2:
			break;
		case 3:
			break;
		default:
			break;
	};


}



//return the module
module.exports = an_sqr_tx_sync;


