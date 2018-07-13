/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	MAINTENANCE: TRANSACTIONS COLLECTION
*
*	This module...
*/

//define dependencies
var squareV1		= require('../square/v1_api.js');
var firebase		= require('../firebase/firebase.js');
var data			= require('./transactions_collection_data_formatting.js');
var tasks			= require('./transactions_collection_tasks.js');

//define local variables
var transactions = {
	download: {
		batch_locations_dates: download_batch_locations_and_dates,
		single_tx: download_single_tx
	},
	test: test
};

/*
*	DOWNLOAD BATCH LOCATIONS AND DATES 
*
*	This function...
*/
function download_batch_locations_and_dates() {
	//define local variables

	//notify location
	console.log('got to _private_batch_locations_dates_download');

	//return async work
	return new Promise(function(resolve, reject) {

		//download locations list from square
		var locationsPromise = squareV1.locations.list();
		//download last successfuly batch update from firebase
		var lastUpdatePromise = data.parse.last_batch_sync(firebase.read('logs/tx_syncs'));

		//resolve promises
		Promise.all([locationsPromise, lastUpdatePromise]).then(function success(s) {

			//define local variable
			var locationsList = s[0];
			var lastUpdated = s[1];

			//run through locations list
			tasks.update_txs.batch(locationsList, lastUpdated).then(function success(ss) {
				
				//resolve(ss);
				//if all updates were successful, write success to the lastUpdated log
				tasks.update_logs.last_tx(ss).then(function success(sss) {

					resolve(sss);

				}).catch(function error(eee) {
					reject(eee);
				});

			}).catch(function error(ee) {
				reject(ee);
			});

		}).catch(function error(e) {
			reject(e);
		});

	});

};

/*
*	DOWNLOAD SINGLE TRANSACTION
*
*	This function...
*/
function download_single_tx() {
	//define local variables

	//notify location
	console.log('got to download_single_tx');

	//return async work
	return new Promise(function(resolve, reject) {
		resolve();
	});
};

/*
*	TEST
*
*	This is used to test the module
*/
function test() { console.log('testing transaction module'); }

//return the module
module.exports = transactions;


