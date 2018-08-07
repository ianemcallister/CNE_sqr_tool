/*
*	AH-NUTS / CAPITALIST NUT ENTERPRISES:
*	CUSTOMERS COLLECTION MODULE
*
*	This module is the jumping off point for all 
*	maintenace related operations for ah-nuts.
*/

//define dependencies
var firebase		= require('../firebase/firebase.js');
var tasks			= require('./customers_collection_tasks.js');

//define local variables
var customers = {
	compile: {
		hashes: {
			name_id: compile_customer_name_id_hash
		}
	},
	season: {
		add: add_customer_season
	}
};

/*
*	COMPILE CUSTOMER NAME/ID HASH
*
*	This function looks over the customer list to create a name/id hash and saves
*	it to the reference lists.
*/
function compile_customer_name_id_hash() {
	//define local variables

	//return async work
	return new Promise(function(resolve, reject) {

		//	1. DOWNLOAD ALL OF THE CUSTOMERS
		firebase.read('customers')
		.then(function success(allCustomers) {
			//define local variables
			var returnObject = {};

			//	2. ITERATE OVER ALL CUSTOMERS
			Object.keys(allCustomers).forEach(function(key) {
				//define local variables
				var display_name = allCustomers[key].display_name.replace(/ /g, "_");

				if(returnObject[display_name] == undefined) 
					returnObject[display_name] = key
			});

			//	3. SAVE THE HASH TO THE DATABASE BY UPDATING THE FILES
			firebase.update('reference_lists/hashes/customer_ids_to_keys', returnObject)
			.then(function success(ss) {
				resolve(ss);
			}).catch(function error(ee) {
				reject(ee);
			});

		}).catch(function error(e) {
			reject(e);
		});

	});	
};

function add_customer_season(customer_id, params) {
	//define local variables
	console.log('customers:add_customer_season');
	//return async work
	return new Promise(function(resolve, reject) {

		//start by downloading the transaction
		tasks.season.add(customer_id, params).then(function success(s) {
			//when the response comes back format it
			resolve(s);
		}).catch(function error(e) {
			reject(e);
		});

	});
};

//return the module
module.exports = customers;

