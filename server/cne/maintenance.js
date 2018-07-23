/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	MAINTENANCE MODULE
*
*	This module is the jumping off point for all 
*	maintenace related operations for ah-nuts.
*/

//define dependencies
var transactions		= require('./transactions_collection.js');
var customers 			= require('./customers_collection.js');

//define local variables
var maintenace = {
	square: {
		employees: {
			list: square_employees_list
		},
		locations: {
			list: square_locations_list
		}
	},
	txs: {
		download: {
			from_square: {
				by_device: download_tx_from_square_by_device,
				raw_txs: download_tx_from_square
			}
		},
		sync: {
			ahNuts_to_Square: tx_sync_cne_db_to_sqr_db
		}
	},
	calendar: {},
	customers: {
		season: {
			add: add_customer_season
		}
	},
	employees: {},
	sales_days: {},
	ref_lists: {},
	reports: {},
	test: test
};

function add_customer_season(customer_id, params) {
	//define local variables
	console.log('maintenance:add_customer_season');
	//return async work
	return new Promise(function(resolve, reject) {

		//start by downloading the transaction
		customers.season.add(customer_id, params).then(function success(s) {
			//when the response comes back format it
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});
}


//
function square_locations_list() {
	//define local variables
	//console.log('maintenance:square_employees_list');
	//return async work
	return new Promise(function(resolve, reject) {

		//start by downloading the transaction
		transactions.square.locations.list().then(function success(s) {
			//when the response comes back format it
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});
};

//
function square_employees_list(status, external_id, limit, order, begin_updated_at, end_updated_at, begin_created_at, end_created_at) {
	//define local variables
	//console.log('maintenance:square_employees_list');
	//return async work
	return new Promise(function(resolve, reject) {

		//start by downloading the transaction
		transactions.square.employees.list(status, external_id, limit, order, begin_updated_at, end_updated_at, begin_created_at, end_created_at).then(function success(s) {
			//when the response comes back format it
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});
}

// 	DOWNLOAD TRANSACTIONS FROM SQUARE, FORMAT BY DEVICE
function download_tx_from_square_by_device(location_id, start, end) {
	//define local variables
	//console.log('got to download_tx_from_square');

	//return async work
	return new Promise(function(resolve, reject) {

		//start by downloading the transaction
		download_tx_from_square(location_id, start, end).then(function success(s) {
			//when the response comes back format it
			resolve(transactions.format.raw_sq_tx.to_list_by_device(s));
		}).catch(function error(e) {
			reject(e);
		});

	});

};


// 	DOWNLOAD TRANSACTIONS FROM SQUARE
function download_tx_from_square(location_id, start, end) {
	//define local variables
	//console.log('got to download_tx_from_square');

	//return async work
	return new Promise(function(resolve, reject) {

		//start by downloading the transaction
		transactions.download.batch_txs(location_id, start, end).then(function success(s) {
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});

};

/*
*	SYNC AH-NUTS TRANSACTIONS DB TO SQUARE TRANSACTIONS DB
*
*	This function...
*/
function tx_sync_cne_db_to_sqr_db(type, pushObject) {
	//define local variables
	var typeHash = {"batch": 0, "single": 1};

	//notify location
	console.log('got to sync_an_txs_to_sqrt');

	//return async work
	return new Promise(function(resolve, reject) {

		//switch based on type
		switch(typeHash[type]) {
			case 0:
				transactions.download.batch_locations_dates().then(function success(s) {
					resolve(s);
				}).catch(function error(e) {
					reject(e);
				});
				break;
			case 1:
				transactions.filter.single_tx_type(pushObject).then(function success(s) {
					resolve(s);
				}).catch(function error(e) {
					reject(e);
				});
				break;
			default:
				break;
		};

	});

};

/*
*	TEST
*
*	This is used to test the module
*/
function test() { console.log('testing maintenace module'); }


//return the module
module.exports = maintenace;


