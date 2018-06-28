/*
*	AH-NUTS SQUARE TRANSACTION SYNC 
*
*	This module is a connection between the ah-nuts databse and square.  It handles 
*	all function around syncing transactions between the two databses.
*/

//define dependencies

//define module
var an_sqr_tx_sync = {
	batch_requests: batch_requests,
	push_requests: push_requests
};

/*
*	BATCH REQUESTS
*/
function batch_requests() {}

/*
*	PUSH REQUESTS
*/
function push_requests(entity_id) {
	
}



//return the module
module.exports = an_sqr_tx_sync;


