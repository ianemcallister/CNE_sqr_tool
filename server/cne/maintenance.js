/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	MAINTENANCE MODULE
*
*	This module is the jumping off point for all 
*	maintenace related operations for ah-nuts.
*/

//define dependencies
var transactions		= require('./transactions_collection.js');


//define local variables
var maintenace = {
	transactions: {
		sync: {
			ahNuts_to_Square: tx_sync_cne_db_to_sqr_db
		}
	},
	calendar: {},
	customers: {},
	employees: {},
	sales_days: {},
	ref_lists: {},
	reports: {},
	test: test
};

/*
*
*/
function tx_sync_cne_db_to_sqr_db(type, pushObject) {
	//define local variables
	var typeHash = {"batch": 0, "single": 1};

	//notify location
	//console.log('got to sync_an_txs_to_sqrt');

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
				transactions.download.single_tx(pushObject).then(function success(s) {
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


