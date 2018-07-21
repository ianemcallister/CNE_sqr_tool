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
		batch_txs: download_batch_txs,
		single_tx: download_single_tx
	},
	filter: {
		single_tx_type: filter_single_tx_type
	},
	format: {
		raw_sq_tx: {
			to_list_by_device: format_raw_sq_tx_to_list_by_device
		}
	},
	sync: {
		batch_txs: sync_batch_txs,
		single_tx: sync_single_tx
	},
	square: {
		employees: {
			list: square_employees_list
		},
		locations: {
			list: square_Locations_list
		}
	},
	test: test
};

//
function square_Locations_list() {
	//console.log('transactions:square_employees_list');
	//return async work
	return new Promise(function(resolve, reject) {
		squareV1.locations.list().then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});
	});

};

//
function square_employees_list(status, external_id, limit, order, begin_updated_at, end_updated_at, begin_created_at, end_created_at) {
	//console.log('transactions:square_employees_list');
	//return async work
	return new Promise(function(resolve, reject) {
		squareV1.employees.list(order, {begin:begin_updated_at, end:end_updated_at}, {begin:begin_created_at, end:end_created_at}, status, external_id, limit).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});
	});

};

//
function format_raw_sq_tx_to_list_by_device(txArray) {
	return data.parse.sq_txs_to_by_device_list(txArray);
};

/*
*	DOWNLOAD BATCH LOCATIONS AND DATES 
*
*	This function...
*/
function download_batch_locations_and_dates() {
	//define local variables

	//notify location
	//console.log('got to _private_batch_locations_dates_download');

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
			tasks.update.txs.batch(locationsList, lastUpdated).then(function success(ss) {
				
				//resolve(ss);
				//if all updates were successful, write success to the lastUpdated log
				tasks.update.logs.last_tx(ss).then(function success(sss) {

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

function download_batch_txs(location_id, start, end) {
	//define local variables
	console.log('got to download_batch_txs');

	//return async work
	return new Promise(function(resolve, reject) {

		//start by downloading the transaction
		squareV1.payments.list(location_id, start, end).then(function success(s) {
			resolve(s);
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
function download_single_tx(tx_id, location_id) {
	//define local variables

	//return async work
	return new Promise(function(resolve, reject) {

		//start by downloading the transaction
		tasks.download.tx.single(tx_id, location_id).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});

};

/*
*	SYNC SINGLE TRANSACTION
*
*	This is used to...
*/
function sync_single_tx(tx_id, location_id) {
	//define local variables

	//notify of progress
	console.log('got to sync_single_tx');

	//return async work
	return new Promise(function(resolve, reject) {

		//1. download the transaction
		tasks.download.txs.single(tx_id, location_id).then(function success(tx) {

			//2. map the transaction from the square tx to an ah-nuts transaction
			var ahnuts_tx = data.map.sq_tx_to_ahNuts_tx(tx, location_id);

			//3. save the tx to the ah-nuts(firebase) db
			var txSavePromise = tasks.save.tx_to_db(tx_id, ahnuts_tx);

			//4. check for known Sales day
			var salesdayCheckPromise = tasks.check.lists.known_cme(ahnuts_tx);

			//handle both promises at the same time
			Promise.all([txSavePromise, salesdayCheckPromise]).then(function success(s) {
				//define local variales
				var sales_day_id = s[1].ref.salesDay;
				var customer_id = s[1].ref.customer;
				var finishingPromises = [];

				//console.log('sales_day_id', sales_day_id);
				//console.log('customer_id', customer_id);

				//salesdayCheckPromise may come back with data
				//if the reference list had the record, update the appropriate models
				if(s[1].status == 'FOUND') {
					//A.5) Add the TX to the Sales Day object - Async
					finishingPromises.push(tasks.update.sales_day.fields(sales_day_id, [{field: "transaction", data: tx_id}]));

					//A.6) Add customer & sales day to transaction - Async
					finishingPromises.push(tasks.update.txs.fields(tx_id, [{field: "salesDay", data: sales_day_id}, {field: "customer", data: customer_id}]));

					//A.7) Update sales day calculations - Async
					finishingPromises.push(tasks.update.sales_day.calculations(sales_day_id, location_id));

				} else if(s[1].status = 'NOT_FOUND') {
					//if the records can't be found
					//B.5) Add the TX to the unassigned list - Async
					finishingPromises.push(tasks.update.lists.unassigned_tx(tx_id, location_id, ahnuts_tx));

				} else {

				};
				
				//resolve all final promises
				Promise.all(finishingPromises).then(function success(ss) {
					resolve(ss);
				}).catch(function error(eee) {
					reject(eee);
				});

			}).catch(function error(ee) {
				reject(ee);
			});

			//resolve(s);

		}).catch(function error(e) {
			console.log('error', e);
			reject('got this error' + e);
		});

	});

};

/*
*	SYNC BATCH TRANSACTIONS
*
*	This is used to...
*/
function sync_batch_txs() {}

/*
*	FILTER SINGLE TRANSACTION
*
*	This is used to...
*/
function filter_single_tx_type(pushObject) {
	//define local variables
	var entity_id = pushObject.entity_id;
	var location_id = pushObject.location_id;
	var pushCase = { "PAYMENT_UPDATED": 1 };

	//notify location
	console.log('got to download_single_tx');

	//return async work
	return new Promise(function(resolve, reject) {
		
		//handle the appropriate case
		switch(pushCase[pushObject.event_type]) {
			case 1:
				
				//run through updating the transaction
				sync_single_tx(entity_id, location_id).then(function success(s) {
					resolve(s);
				}).catch(function error(e) {
					reject(e);
				});

				break;
			case 2:
				break;
			case 3:
				break;
			default:
				break;
		};

	});
		
}

/*
*	TEST
*
*	This is used to test the module
*/
function test() { console.log('testing transaction module'); }

//return the module
module.exports = transactions;


