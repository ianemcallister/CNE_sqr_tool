/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	MAINTENANCE: SALES DAYS COLLECTION
*
*	This module...
*/

//define dependencies
var squareV1		= require('../square/v1_api.js');
var firebase		= require('../firebase/firebase.js');
var data			= require('./transactions_collection_data_formatting.js');
var tasks			= require('./transactions_collection_tasks.js');

//define local variables
var salesDays = {
	repair: {
		customer_id: repair_customer_id,
		ids: repair_ids
	},
	test: test
};

/*
*	REPAIR CUSTOMER IDS
*
*	This function iterats over all the sales days and insures that every one has a customer
*	id.
*/
function repair_customer_id() {
	//define local variables

	//return async work
	return new Promise(function(resolve, reject) {

		//	1. COLLECT ALL THE SALES DAYS
		firebase.read('sales_days')
		.then(function success(allSalesdays) {
			//define local variables
			var allPromises = [];
			var returnObject = {};
			
			//	2. ITERATE OVER ALL THE SALES DAYS
			Object.keys(allSalesdays).forEach(function(key) {
				//define local variables
				var customer_name = allSalesdays[key].customer_name;

				if(returnObject[customer_name] == undefined) returnObject[customer_name] = "";

			});

			resolve(returnObject);

		}).catch(function error(e) {
			reject(e);
		});

	});

};

/*
*	REPAIR IDS
*
*	This function iterates over all the sales days and insures that every one has an id
*/
function repair_ids() {
	//define local variables

	//return async work
	return new Promise(function(resolve, reject) {

		//	1. COLLECT ALL THE SALES DAYS
		firebase.read('sales_days')
		.then(function success(allSalesdays) {
			//define local variables
			var allPromises = [];
			
			//	2. ITERATE OVER ALL THE SALES DAYS
			Object.keys(allSalesdays).forEach(function(key) {

				var updatePath = "sales_days/" + key;

				//	3. UPDATE THE OBJECT'S VALUE
				allPromises.push(firebase.update(updatePath, { id: key }));
			});

			//	4. WAIT ON ALL THE UPDATES TO TAKE EFFECT
			Promise.all(allPromises)
			.then(function success(ss) {
				//	5. RESOLVE ON COMPLETION
				resolve('done');
			}).catch(function error(ee) {
				reject(ee);
			})
			

		}).catch(function error(e) {
			reject(e);
		});

	});

}

/*
*	TEST
*
*	This is used to test the module
*/
function test() { return('testing salesDays module'); }

//return the module
module.exports = salesDays;


