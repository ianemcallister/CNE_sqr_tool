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
		delete_duplicats: delete_duplicates,
		customer_id: repair_customer_id,
		ids: repair_ids
	},
	test: test
};

/*
*	DELETE DUPLICATES
*/
function delete_duplicates() {
	//define local variables
	var allPromises = [firebase.read('sales_days')];

	//return async work
	return new Promise(function(resolve, reject) {

		//	1. COLLECT ALL THE SALES DAYS
		Promise.all(allPromises)
		.then(function success(s) {
			//define local variables
			var allSalesdays = s[0];
			var validSalesDays = {};
			var returnObject = {};

			//	1. ITERATE OVER ALL SALES DAYS
			Object.keys(allSalesdays).forEach(function(salesDayKey) {
				//define local variables
				var cme_name = allSalesdays[salesDayKey].cme_name;

				//	2. ADD THE VALUD SALES DAYS TO THE VALID OBJECT
				if(cme_name != undefined) validSalesDays[salesDayKey] = allSalesdays[salesDayKey];

				//	3. ADD THE INVALID KEYS TO A DELETE OBJECT
				else returnObject[salesDayKey] = null;
			});

			resolve(returnObject);
			//save the files if need be
			/*
			firebase.update('sales_days', returnObject)
			.then(function success(ss) {
				resolve({message: ss});
			}).catch(function error(ee) {
				reject(ee);
			});*/

		}).catch(function error(e) {
			reject(e);
		});

	});

};

/*
*	REPAIR CUSTOMER IDS
*
*	This function iterats over all the sales days and insures that every one has a customer
*	id.
*/
function repair_customer_id() {
	//define local variables
	var allPromises = [firebase.read('customers')];

	//return async work
	return new Promise(function(resolve, reject) {

		//	1. COLLECT ALL THE SALES DAYS
		Promise.all(allPromises)
		.then(function success(s) {
			//define local variables
			var allCustomers = s[0];
			var updateObject = {};
			var counter = 0;
			
			//	2. ITERATE OVER ALL THE CUSTOMERS
			Object.keys(allCustomers).forEach(function(customerKey) {
				//define local variables
				var allSalesDays = allCustomers[customerKey].sales_days;

				//	3. ITERATE OVER ALL SALESDAYS FOR EACH CUSTOMER
				Object.keys(allSalesDays).forEach(function(salesDayKey) {
					//define local variables
					var updatePath = allSalesDays[salesDayKey] + "/customer_id";

					//	4. ADD THE KEY VALUE PAIR TO THE UPDATE OBJECT
					updateObject[updatePath] = customerKey;

					//incriment the counter
					counter++;
				});

				
			});

			//resolve(updateObject);

			//	5. RUN ALL UPDATES THROGUH FIREBASE
			firebase.update('sales_days', updateObject)
			.then(function success(ss) {
				resolve({ updates: updateObject, records: counter, message: ss});
			}).catch(function error(ee) {
				reject(ee);
			});

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


