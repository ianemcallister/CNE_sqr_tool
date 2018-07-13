/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	MAINTENANCE: TRANSACTIONS COLLECTION tasks
*
*	This module...
*/

//define dependencies

//define module
var tasks = {
	update_txs: {
		batch: batch_update_txs
	},
	update_logs: {
		last_tx: update_last_tx_log
	},
	test: test
};

/*
*	UPDATE LAST TRANSACTIONS LOG
*
*	This is used to...
*/
function update_last_tx_log(lastUpdated) { 
	//define local variables

	//return async work
	return new Promise(function(resolve, reject) {
		resolve('last updated tx log');
	}); 

};

/*
*	BATCH UPDATE TRANSACTINS
*
*	This is used to..
*/
function batch_update_txs(locationsList, lastUpdated) { 
	//define local variables

	//return async work
	return new Promise(function(resolve, reject) {
		resolve(lastUpdated);
	}); 

};

/*
*	TEST
*
*	This is used to test the module
*/
function test() { console.log('testing transaction tasks module'); }

//return the module
module.exports = tasks;


